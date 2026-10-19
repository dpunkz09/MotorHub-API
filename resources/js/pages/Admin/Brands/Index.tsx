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
            toast({ title: 'Error', description: 'Brand slug is missing', variant: 'error' });
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
                toast({
                    title: 'Import Successful',
                    description: `${result.data.imported} motorcycles imported, ${result.data.skipped} skipped`,
                    variant: 'success',
                });
                // Reload page to update counts
                router.reload();
            } else {
                toast({
                    title: 'Import Failed',
                    description: result.message || 'Unknown error occurred',
                    variant: 'error',
                });
            }
        } catch (error) {
            toast({
                title: 'Import Error',
                description: error instanceof Error ? error.message : 'Network error',
                variant: 'error',
            });
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
