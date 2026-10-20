import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { User, Brand } from '@/types';
import { Button, Badge } from '@/components/ui';
import { Plus, Upload, Edit, Trash2, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { route } from '@/lib/route';

interface Props {
    auth: {
        user: User;
    };
    brands: Brand[];
}

export default function BrandsIndex({ auth, brands }: Props) {
    const [importing, setImporting] = useState<Record<number, boolean>>({});
    
    const handleDelete = async (slug: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            const response = await fetch(`/api/brands/${slug}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                toast({
                    title: 'Brand Deleted',
                    description: `"${name}" has been deleted successfully.`,
                    variant: 'success',
                });
                router.reload();
            } else {
                toast({
                    title: 'Delete Failed',
                    description: 'Failed to delete brand',
                    variant: 'error',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An error occurred',
                variant: 'error',
            });
        }
    };

    const handleImport = async (brand: Brand) => {
        if (!brand.slug) {
            toast({ 
                title: 'Error', 
                description: 'Brand slug is missing', 
                variant: 'destructive' 
            });
            return;
        }

        if (!confirm(`Import motorcycles for "${brand.name}"?\n\nThis will fetch data from the external API and may take a few minutes.`)) {
            return;
        }

        setImporting(prev => ({ ...prev, [brand.id]: true }));

        try {
            const response = await fetch(`/api/motorcycles/import-from-brand/${brand.slug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                const { imported, skipped, total, duration_seconds } = result.data;
                const errorCount = result.data.errors?.length || 0;
                
                // Build detailed success message
                let description = `✓ Imported: ${imported} motorcycles\n`;
                if (skipped > 0) description += `⊘ Skipped: ${skipped} motorcycles\n`;
                if (errorCount > 0) description += `✗ Errors: ${errorCount} records\n`;
                if (duration_seconds) description += `⏱ Duration: ${duration_seconds}s`;

                toast({
                    title: 'Import Completed',
                    description,
                    variant: 'default',
                    duration: 8000,
                });

                // Show first few errors if any
                if (errorCount > 0 && result.data.errors) {
                    const firstErrors = result.data.errors.slice(0, 3);
                    const errorDetails = firstErrors.map((err: any) => 
                        `${err.slug || 'Unknown'}: ${err.error}`
                    ).join('\n');
                    
                    setTimeout(() => {
                        toast({
                            title: `Import Errors (showing ${Math.min(3, errorCount)} of ${errorCount})`,
                            description: errorDetails,
                            variant: 'destructive',
                            duration: 10000,
                        });
                    }, 500);
                }

                // Reload page to update counts
                router.reload();
            } else {
                // Detailed error message
                const errorMsg = result.error || result.message || 'Unknown error occurred';
                const statusCode = response.status;
                
                let description = `Status: ${statusCode}\n`;
                description += `Error: ${errorMsg}\n`;
                
                // Add specific guidance based on error type
                if (statusCode === 404) {
                    description += '\nThe brand was not found on the external API.';
                } else if (statusCode === 422) {
                    description += '\nThe API response format was invalid or missing required data.';
                } else if (statusCode === 429) {
                    description += '\nRate limit exceeded. Please try again in a few minutes.';
                } else if (statusCode >= 500) {
                    description += '\nServer error. Please check the logs or try again later.';
                }

                toast({
                    title: 'Import Failed',
                    description,
                    variant: 'destructive',
                    duration: 10000,
                });
            }
        } catch (error) {
            // Network or parsing error
            const errorMsg = error instanceof Error ? error.message : 'Unknown network error';
            
            toast({
                title: 'Import Error',
                description: `Network or connection error:\n${errorMsg}\n\nPlease check your internet connection and try again.`,
                variant: 'destructive',
                duration: 10000,
            });
            
            console.error('Import error:', error);
        } finally {
            setImporting(prev => ({ ...prev, [brand.id]: false }));
        }
    };

    return (
        <AppShell auth={auth} breadcrumbs={[{ label: 'Brands' }]} title="Brands">
            <Head title="Brands" />
            
            <div className="flex justify-end mb-6 gap-3">
                <Link href={route('admin.brands.import')}>
                    <Button variant="secondary">
                        <Upload className="h-4 w-4" />
                        Mass Import
                    </Button>
                </Link>
                <Link href={route('admin.brands.create')}>
                    <Button variant="primary">
                        <Plus className="h-4 w-4" />
                        Add Brand
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Slug</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Motorcycles</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Website</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            {brands.map((brand) => (
                                <tr key={brand.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {brand.logo_url && (
                                                <img src={brand.logo_url} alt={brand.name} className="w-10 h-10 rounded object-contain mr-3 bg-gray-100 dark:bg-gray-800 p-1" />
                                            )}
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{brand.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{brand.slug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant="secondary">{brand.motorcycles_count || 0}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {brand.website_url ? (
                                            <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                                                Visit →
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleImport(brand)}
                                                disabled={importing[brand.id]}
                                                title="Import from External API"
                                            >
                                                {importing[brand.id] ? (
                                                    <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
                                                ) : (
                                                    <Download className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Link href={route('admin.brands.edit', { brand: brand.id })}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(brand.slug, brand.name)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {brands.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No brands found.</p>
                        <Link href={route('admin.brands.create')}>
                            <Button variant="primary">
                                <Plus className="h-4 w-4" />
                                Create Your First Brand
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
