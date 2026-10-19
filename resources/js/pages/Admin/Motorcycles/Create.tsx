import { Head, Link, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import AppShell from '@/components/AppShell';
import { User, Brand, Category } from '@/types';
import { Button, Input, Select } from '@/components/ui';
import { Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useConfetti } from '@/hooks/use-confetti';

interface Props {
    auth: { user: User };
    brands: Brand[];
    categories: Category[];
}

export default function CreateMotorcycle({ auth, brands, categories }: Props) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        brand_id: '',
        category_id: '',
        model_year: new Date().getFullYear(),
        price: '',
        status: 'available',
        transparent_url: '',
    });
    const [processing, setProcessing] = useState(false);
    const { celebrate } = useConfetti();

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await fetch('/api/motorcycles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (response.ok && result.success) {
                celebrate();
                toast({ title: 'Motorcycle Created', description: `"${formData.name}" has been created`, variant: 'success' });
                setTimeout(() => {
                    router.visit(route('admin.motorcycles.index'));
                }, 500);
            } else {
                toast({ title: 'Creation Failed', description: result.message, variant: 'error' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'An error occurred', variant: 'error' });
        } finally {
            setProcessing(false);
        }
    };

    const generateSlug = () => {
        const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        setFormData({ ...formData, slug });
    };

    return (
        <AppShell auth={auth} breadcrumbs={[{ label: 'Motorcycles', href: route('admin.motorcycles.index') }, { label: 'Create' }]} title="Create Motorcycle">
            <Head title="Create Motorcycle" />

            <div className="max-w-3xl">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Model Name <span className="text-red-500">*</span>
                            </label>
                            <Input type="text" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                onBlur={generateSlug} required />
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <Input type="text" id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Brand <span className="text-red-500">*</span>
                                </label>
                                <Select id="brand_id" value={formData.brand_id} onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })} required>
                                    <option value="">Select Brand</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </Select>
                            </div>

                            <div>
                                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                <Select id="category_id" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}>
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="model_year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                                <Input type="number" id="model_year" value={formData.model_year} onChange={(e) => setFormData({ ...formData, model_year: parseInt(e.target.value) })} />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
                                <Input type="number" id="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" step="0.01" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                            <Select id="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option value="available">Available</option>
                                <option value="sold">Sold</option>
                                <option value="reserved">Reserved</option>
                            </Select>
                        </div>

                        <div>
                            <label htmlFor="transparent_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                            <Input type="text" id="transparent_url" value={formData.transparent_url} onChange={(e) => setFormData({ ...formData, transparent_url: e.target.value })} placeholder="/motorcycles/image.png" />
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Note:</strong> This is a simplified form. Additional fields (engine, transmission, etc.) can be edited after creation or added via bulk import.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <Link href={route('admin.motorcycles.index')}>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </Link>
                            <Button type="submit" variant="primary" isLoading={processing}>
                                <Save className="h-4 w-4" />
                                Create Motorcycle
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    );
}
