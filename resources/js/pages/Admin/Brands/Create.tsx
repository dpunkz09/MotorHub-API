import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import AppShell from '@/components/AppShell';
import { User } from '@/types';
import { Button, Input, ImageUpload, Progress } from '@/components/ui';
import { Save, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useConfetti } from '@/hooks/use-confetti';

interface Props {
    auth: { user: User };
}

export default function CreateBrand({ auth }: Props) {
    const { data, setData, processing } = useForm({
        name: '',
        slug: '',
        description: '',
        logo_url: '',
        website_url: '',
    });

    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { celebrate } = useConfetti();

    const handleImageChange = async (file: File | null) => {
        if (!file) {
            setData('logo_url', '');
            return;
        }

        setUploadingImage(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', 'brands');

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => Math.min(prev + 10, 90));
            }, 100);

            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const result = await response.json();

            if (response.ok && result.success) {
                setData('logo_url', result.data.url);
                toast({ title: 'Logo Uploaded', description: 'Logo uploaded successfully', variant: 'success' });
            } else {
                toast({ title: 'Upload Failed', description: result.message || 'Failed to upload logo', variant: 'error' });
            }
        } catch (error: any) {
            toast({ title: 'Error', description: error.message || 'Error uploading logo', variant: 'error' });
        } finally {
            setUploadingImage(false);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/brands', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (response.ok && result.success) {
                celebrate();
                toast({ title: 'Brand Created', description: `"${data.name}" has been created`, variant: 'success' });
                setTimeout(() => {
                    router.visit(route('admin.brands.index'));
                }, 500);
            } else {
                toast({ title: 'Creation Failed', variant: 'error' });
            }
        } catch (error) {
            toast({ title: 'Error', variant: 'error' });
        }
    };

    const generateSlug = () => {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        setData('slug', slug);
    };

    return (
        <AppShell auth={auth} breadcrumbs={[{ label: 'Brands', href: route('admin.brands.index') }, { label: 'Create' }]} title="Create Brand">
            <Head title="Create Brand" />

            <div className="max-w-3xl">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <Input type="text" id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} onBlur={generateSlug} required />
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <Input type="text" id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} required className="flex-1" />
                                <Button type="button" variant="secondary" onClick={generateSlug}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                            <textarea id="description" rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
                            <Input type="url" id="website_url" value={data.website_url} onChange={(e) => setData('website_url', e.target.value)} placeholder="https://example.com" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand Logo</label>
                            
                            <ImageUpload
                                value={data.logo_url}
                                onChange={handleImageChange}
                                disabled={uploadingImage}
                                maxSize={10}
                            />

                            {uploadingImage && uploadProgress > 0 && (
                                <div className="mt-3">
                                    <Progress
                                        value={uploadProgress}
                                        variant={uploadProgress === 100 ? 'success' : 'default'}
                                        showLabel
                                        label="Uploading logo"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <Link href={route('admin.brands.index')}>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </Link>
                            <Button type="submit" variant="primary" isLoading={processing}>
                                <Save className="h-4 w-4" />
                                Create Brand
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    );
}
