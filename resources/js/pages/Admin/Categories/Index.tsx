import { Head, Link, router } from '@inertiajs/react';
import AppShell from '@/components/AppShell';
import { User, Category } from '@/types';
import { Button, Badge } from '@/components/ui';
import { Plus, Upload, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
    auth: {
        user: User;
    };
    categories: Category[];
}

export default function CategoriesIndex({ auth, categories }: Props) {
    const handleDelete = async (slug: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/categories/${slug}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast({
                    title: 'Category Deleted',
                    description: `"${name}" has been deleted successfully.`,
                    variant: 'success',
                });
                router.reload();
            } else {
                toast({
                    title: 'Delete Failed',
                    description: 'Failed to delete category. Please try again.',
                    variant: 'error',
                });
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            toast({
                title: 'Error',
                description: 'An error occurred while deleting the category.',
                variant: 'error',
            });
        }
    };

    return (
        <AppShell
            auth={auth}
            breadcrumbs={[{ label: 'Categories' }]}
            title="Categories"
        >
            <Head title="Categories" />
            
            <div className="flex justify-end mb-6 gap-3">
                <Link href={route('admin.categories.import')}>
                    <Button variant="secondary">
                        <Upload className="h-4 w-4" />
                        Mass Import
                    </Button>
                </Link>
                <Link href={route('admin.categories.create')}>
                    <Button variant="primary">
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Common
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {category.cover_url && (
                                                <img
                                                    src={category.cover_url}
                                                    alt={category.name}
                                                    className="w-10 h-10 rounded object-cover mr-3"
                                                />
                                            )}
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {category.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {category.slug}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {category.description ? 
                                            (category.description.length > 60 
                                                ? category.description.substring(0, 60) + '...'
                                                : category.description
                                            ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={category.is_common ? 'success' : 'default'}>
                                            {category.is_common ? 'Yes' : 'No'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link href={route('admin.categories.edit', { category: category.id })}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(category.slug, category.name)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {categories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No categories found.</p>
                        <Link href={route('admin.categories.create')}>
                            <Button variant="primary">
                                <Plus className="h-4 w-4" />
                                Create Your First Category
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
