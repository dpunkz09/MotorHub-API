import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { User, Motorcycle, Brand, Category, PaginatedResponse } from '@/types';
import { Button, Badge, Input, Select } from '@/components/ui';
import { Plus, Upload, Edit, Trash2, Filter, X, Search, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { route } from '@/lib/route';

interface Props {
    auth: { user: User };
    motorcycles: PaginatedResponse<Motorcycle & { brand: Brand; category?: Category }>;
    brands: Brand[];
    categories: Category[];
    filters: { 
        brand_id?: string; 
        category_id?: string; 
        status?: string; 
        price_min?: string; 
        price_max?: string; 
        is_latest?: string;
        search?: string;
    };
    sortBy: string;
    sortOrder: string;
}

export default function MotorcyclesIndex({ auth, motorcycles, brands, categories, filters, sortBy, sortOrder }: Props) {
    const [filterState, setFilterState] = useState(filters);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [uploadingImageFor, setUploadingImageFor] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleFilterChange = (key: string, value: string) => {
        setFilterState(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        
        // Add search query
        if (searchQuery) params.append('search', searchQuery);
        
        // Add other filters
        Object.entries(filterState).forEach(([key, value]) => {
            if (value && key !== 'search') params.append(key, value);
        });
        
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        router.get(`/admin/motorcycles?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const clearFilters = () => {
        setFilterState({});
        setSearchQuery('');
        router.get('/admin/motorcycles');
    };

    const handleImageUpload = async (motorcycleId: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImageFor(motorcycleId);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', 'motorcycles');

        try {
            const uploadResponse = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });
            const uploadResult = await uploadResponse.json();

            if (uploadResponse.ok && uploadResult.success) {
                const updateResponse = await fetch(`/api/motorcycles/${motorcycleId}/image`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image_url: uploadResult.data.url }),
                });

                if (updateResponse.ok) {
                    toast({ title: 'Image Updated', variant: 'success' });
                    router.reload({ only: ['motorcycles'] });
                } else {
                    toast({ title: 'Update Failed', variant: 'error' });
                }
            } else {
                toast({ title: 'Upload Failed', variant: 'error' });
            }
        } catch (error) {
            toast({ title: 'Error', variant: 'error' });
        } finally {
            setUploadingImageFor(null);
        }
    };

    const handleMassDelete = () => {
        if (selectedIds.length === 0) {
            toast({ title: 'No Selection', description: 'Select motorcycles to delete', variant: 'warning' });
            return;
        }

        if (!confirm(`Delete ${selectedIds.length} motorcycle(s)? This cannot be undone.`)) return;

        router.post('/admin/motorcycles/mass-delete', { ids: selectedIds }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast({ title: 'Motorcycles Deleted', description: `${selectedIds.length} motorcycle(s) deleted`, variant: 'success' });
                setSelectedIds([]);
            },
            onError: () => {
                toast({ title: 'Delete Failed', variant: 'error' });
            },
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === motorcycles.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(motorcycles.data.map(m => m.id));
        }
    };

    return (
        <AppShell auth={auth} breadcrumbs={[{ label: 'Motorcycles' }]} title="Motorcycles">
            <Head title="Motorcycles" />
            
            <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search motorcycles by name, brand, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button type="submit" variant="secondary">
                        <Search className="h-4 w-4" />
                        Search
                    </Button>
                    {(searchQuery || Object.values(filterState).some(Boolean)) && (
                        <Button type="button" variant="ghost" onClick={clearFilters}>
                            <X className="h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </form>

                {/* Action Bar */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
                            <Filter className="h-4 w-4" />
                            Filters {Object.values(filterState).filter(v => v && v !== 'search').length > 0 && `(${Object.values(filterState).filter(v => v && v !== 'search').length})`}
                        </Button>
                        {selectedIds.length > 0 && (
                            <Button variant="danger" onClick={handleMassDelete}>
                                <Trash2 className="h-4 w-4" />
                                Delete Selected ({selectedIds.length})
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Link href={route('admin.motorcycles.import')}>
                            <Button variant="secondary">
                                <Upload className="h-4 w-4" />
                                Import
                            </Button>
                        </Link>
                        <Link href={route('admin.motorcycles.create')}>
                            <Button variant="primary">
                                <Plus className="h-4 w-4" />
                                Add Motorcycle
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand</label>
                            <Select value={filterState.brand_id || ''} onChange={(e) => handleFilterChange('brand_id', e.target.value)}>
                                <option value="">All Brands</option>
                                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <Select value={filterState.category_id || ''} onChange={(e) => handleFilterChange('category_id', e.target.value)}>
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                            <Select value={filterState.status || ''} onChange={(e) => handleFilterChange('status', e.target.value)}>
                                <option value="">All Status</option>
                                <option value="available">Available</option>
                                <option value="sold">Sold</option>
                                <option value="reserved">Reserved</option>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="ghost" onClick={clearFilters}>
                            <X className="h-4 w-4" />
                            Clear
                        </Button>
                        <Button variant="primary" onClick={applyFilters}>Apply Filters</Button>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input type="checkbox" checked={selectedIds.length === motorcycles.data.length && motorcycles.data.length > 0}
                                        onChange={toggleSelectAll} className="rounded" />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Model</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Brand</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            {motorcycles.data.map((motorcycle) => (
                                <tr key={motorcycle.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" checked={selectedIds.includes(motorcycle.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds([...selectedIds, motorcycle.id]);
                                                } else {
                                                    setSelectedIds(selectedIds.filter(id => id !== motorcycle.id));
                                                }
                                            }} className="rounded" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <label className="cursor-pointer">
                                            {motorcycle.image || motorcycle.transparent_url ? (
                                                <img src={motorcycle.image || motorcycle.transparent_url || undefined} alt={motorcycle.model} className="w-16 h-16 object-contain rounded border-2 border-gray-200 dark:border-gray-700" />
                                            ) : (
                                                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded border-2 border-dashed border-gray-300 dark:border-gray-700">
                                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(motorcycle.id, e)}
                                                disabled={uploadingImageFor === motorcycle.id} className="hidden" />
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{motorcycle.model}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{motorcycle.brand.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {motorcycle.price ? `$${motorcycle.price.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={motorcycle.status === 'available' ? 'success' : motorcycle.status === 'sold' ? 'danger' : 'warning'}>
                                            {motorcycle.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Link href={`/admin/motorcycles/${motorcycle.id}/edit`}>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {motorcycles.data.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No motorcycles found.</p>
                        <Link href={route('admin.motorcycles.create')}>
                            <Button variant="primary">
                                <Plus className="h-4 w-4" />
                                Add Your First Motorcycle
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {motorcycles.last_page > 1 && (
                    <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Showing {motorcycles.from} to {motorcycles.to} of {motorcycles.total} results
                        </div>
                        <div className="flex gap-2">
                            {motorcycles.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1 rounded text-sm ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : link.url
                                            ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}


// Brand Import Panel Component
function BrandImportPanel({ brands }: { brands: Brand[] }) {
    const [importing, setImporting] = useState<Record<number, boolean>>({});
    const [progress, setProgress] = useState<Record<number, { current: number; total: number }>>({});

    const handleImport = async (brand: Brand) => {
        if (!brand.slug) {
            toast({ title: 'Error', description: 'Brand slug is missing', variant: 'error' });
            return;
        }

        setImporting(prev => ({ ...prev, [brand.id]: true }));
        setProgress(prev => ({ ...prev, [brand.id]: { current: 0, total: 0 } }));

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
            setProgress(prev => ({ ...prev, [brand.id]: { current: 0, total: 0 } }));
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Import from External API
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map(brand => (
                    <div
                        key={brand.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
                    >
                        <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                {brand.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {brand.motorcycles_count || 0} motorcycle{brand.motorcycles_count !== 1 ? 's' : ''}
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleImport(brand)}
                            disabled={importing[brand.id]}
                        >
                            {importing[brand.id] ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
                                    Importing...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    Import
                                </>
                            )}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
