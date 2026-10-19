import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import AppShell from '@/components/AppShell';
import { User } from '@/types';
import { Button, Input, ImageUpload, Progress } from '@/components/ui';
import { Save, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useConfetti } from '@/hooks/use-confetti';

interface Props {
    auth: {
        user: User;
    };
}

export default function CreateCategory({ auth }: Props) {
    const { data, setData, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        cover_url: '',
        is_common: true,
    });

    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { celebrate } = useConfetti();

    const handleImageChange = async (file: File | null) => {
        if (!file) {
            setData('cover_url', '');
            return;
        }

        // Upload to server with progress
        setUploadingImage(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', 'categories');

        try {
            // Simulate progress for user feedback
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
                setData('cover_url', result.data.url);
                toast({
                    title: 'Image Uploaded',
                    description: 'Cover image uploaded successfully',
                    variant: 'success',
                });
            } else {
                toast({
                    title: 'Upload Failed',
                    description: result.message || 'Failed to upload image',
                    variant: 'error',
                });
            }
        } catch (error: any) {
            console.error('Error uploading image:', error);
            toast({
                title: 'Error',
                description: error.message || 'Error uploading image',
                variant: 'error',
            });
        } finally {
            setUploadingImage(false);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                celebrate(); // Fire confetti!
                toast({
                    title: 'Category Created',
                    description: `"${data.name}" has been created successfully`,
                    variant: 'success',
                });
                setTimeout(() => {
                    router.visit(route('admin.categories.index'));
                }, 500);
            } else {
                toast({
                    title: 'Creation Failed',
                    description: result.message || 'Failed to create category',
                    variant: 'error',
                });
            }
        } catch (error: any) {
            console.error('Error creating category:', error);
            toast({
                title: 'Error',
                description: error.message || 'An error occurred',
                variant: 'error',
            });
        }
    };

    const generateSlug = () => {
        const slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setData('slug', slug);
    };

    return (
        <AppShell
            auth={auth}
            breadcrumbs={[
                { label: 'Categories', href: route('admin.categories.index') },
                { label: 'Create' }
            ]}
            title="Create Category"
        >
            <Head title="Create Category" />

            <div className="max-w-3xl">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                onBlur={generateSlug}
                                required
                                error={errors.name}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Slug */}
                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    required
                                    error={errors.slug}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={generateSlug}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Generate
                                </Button>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">URL-friendly identifier (e.g., cafe-racer)</p>
                            {errors.slug && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.slug}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                            )}
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cover Image
                            </label>
                            
                            <ImageUpload
                                value={data.cover_url}
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
                                        label="Uploading image"
                                    />
                                </div>
                            )}

                            {errors.cover_url && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cover_url}</p>
                            )}
                        </div>

                        {/* Is Common */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_common"
                                checked={data.is_common}
                                onChange={(e) => setData('is_common', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_common" className="text-sm text-gray-900 dark:text-gray-100">
                                Common Category
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <Link href={route('admin.categories.index')}>
                                <Button type="button" variant="secondary">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={processing}
                            >
                                <Save className="h-4 w-4" />
                                Create Category
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    );
}
