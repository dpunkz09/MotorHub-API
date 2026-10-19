import { Head, Link } from '@inertiajs/react';
import AppShell from '@/components/AppShell';
import { User } from '@/types';
import { Button } from '@/components/ui';
import { Plus, Upload, Tag, Building2, Bike, Sparkles } from 'lucide-react';

interface Props {
    auth: {
        user: User;
    };
    stats: {
        categories: number;
        brands: number;
        motorcycles: number;
        latest_motorcycles: number;
    };
}

export default function Dashboard({ auth, stats }: Props) {
    return (
        <AppShell 
            auth={auth}
            breadcrumbs={[{ label: 'Dashboard' }]}
        >
            <Head title="Dashboard" />

            <div className="mb-6">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Welcome back! Here's an overview of your motorcycle database.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6 hover-lift animate-fade-in stagger-1 group">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 group-hover:scale-110 transition-transform">
                            <Tag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Categories</dt>
                                <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.categories}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link href={route('admin.categories.index')} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            View all →
                        </Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6 hover-lift animate-fade-in stagger-2 group">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 group-hover:scale-110 transition-transform">
                            <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Brands</dt>
                                <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.brands}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link href={route('admin.brands.index')} className="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                            View all →
                        </Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6 hover-lift animate-fade-in stagger-3 group">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 group-hover:scale-110 transition-transform">
                            <Bike className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Motorcycles</dt>
                                <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.motorcycles}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link href={route('admin.motorcycles.index')} className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                            View all →
                        </Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6 hover-lift animate-fade-in stagger-4 group">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-3 group-hover:scale-110 transition-transform">
                            <Sparkles className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Latest Models</dt>
                                <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.latest_motorcycles}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link href={route('admin.motorcycles.index') + '?is_latest=1'} className="text-sm text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300">
                            View latest →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href={route('admin.motorcycles.create')}>
                            <Button variant="primary" size="lg" className="w-full h-auto py-4">
                                <div className="flex items-center w-full">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4 text-left">
                                        <h3 className="text-sm font-medium">Add Motorcycle</h3>
                                        <p className="text-xs opacity-80">Create a new motorcycle entry</p>
                                    </div>
                                </div>
                            </Button>
                        </Link>

                        <Link href={route('admin.brands.create')}>
                            <Button variant="success" size="lg" className="w-full h-auto py-4">
                                <div className="flex items-center w-full">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4 text-left">
                                        <h3 className="text-sm font-medium">Add Brand</h3>
                                        <p className="text-xs opacity-80">Create a new brand</p>
                                    </div>
                                </div>
                            </Button>
                        </Link>

                        <Link href={route('admin.categories.create')}>
                            <Button variant="secondary" size="lg" className="w-full h-auto py-4">
                                <div className="flex items-center w-full">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4 text-left">
                                        <h3 className="text-sm font-medium">Add Category</h3>
                                        <p className="text-xs opacity-80">Create a new category</p>
                                    </div>
                                </div>
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Mass Import</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link href={route('admin.motorcycles.import')}>
                                <Button variant="secondary" className="w-full">
                                    <Upload className="h-4 w-4" />
                                    Import Motorcycles
                                </Button>
                            </Link>
                            <Link href={route('admin.brands.import')}>
                                <Button variant="secondary" className="w-full">
                                    <Upload className="h-4 w-4" />
                                    Import Brands
                                </Button>
                            </Link>
                            <Link href={route('admin.categories.import')}>
                                <Button variant="secondary" className="w-full">
                                    <Upload className="h-4 w-4" />
                                    Import Categories
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
