import { Link, router } from '@inertiajs/react';
import { ReactNode } from 'react';
import { User } from '@/types';

interface Props {
    auth: {
        user: User;
    };
    children: ReactNode;
    title?: string;
}

export default function AdminLayout({ auth, children, title }: Props) {
    const handleLogout = () => {
        router.post(route('logout'));
    };

    const isActive = (path: string) => {
        return window.location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href={route('admin.dashboard')} className="text-xl font-bold text-gray-800">
                                    🏍️ Motorcycle Admin
                                </Link>
                            </div>
                            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                                <Link
                                    href={route('admin.categories.index')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActive('/admin/categories')
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                >
                                    Categories
                                </Link>
                                <Link
                                    href={route('admin.brands.index')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActive('/admin/brands')
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                >
                                    Brands
                                </Link>
                                <Link
                                    href={route('admin.motorcycles.index')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActive('/admin/motorcycles')
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                >
                                    Motorcycles
                                </Link>
                                <Link
                                    href={route('admin.settings.index')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActive('/admin/settings')
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                >
                                    Settings
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="text-sm text-gray-500 mr-4">
                                    {auth.user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {title && (
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                        </div>
                    )}
                    {children}
                </div>
            </main>
        </div>
    );
}
