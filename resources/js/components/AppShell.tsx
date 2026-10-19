import { ReactNode, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { User } from '@/types';
import Sidebar from './Sidebar';
import { Toaster } from './ui/toaster';
import { Breadcrumbs, BreadcrumbItem } from './ui/breadcrumbs';
import PageTransition from './PageTransition';
import { cn } from '@/lib/utils';

interface AppShellProps {
    auth: {
        user: User;
    };
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
}

export default function AppShell({ auth, children, breadcrumbs, title }: AppShellProps) {
    const page = usePage();
    const currentPath = page.url;

    // Inertia progress bar styling
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .inertia-progress-bar {
                height: 3px;
                background: linear-gradient(to right, #3b82f6, #2563eb);
                box-shadow: 0 0 10px #3b82f6, 0 0 5px #2563eb;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Sidebar */}
            <Sidebar currentPath={currentPath} />

            {/* Main content area */}
            <div className="lg:pl-64 transition-all duration-300">
                {/* Top bar with breadcrumbs and user info */}
                <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
                    <div className="flex items-center justify-between px-4 lg:px-8 py-4 animate-slide-in-top">
                        <div className="flex-1">
                            {breadcrumbs && breadcrumbs.length > 0 && (
                                <Breadcrumbs items={breadcrumbs} />
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
                                {auth.user.name}
                            </span>
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-shadow">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content with transition */}
                <main className="p-4 lg:p-8">
                    <PageTransition>
                        {title && (
                            <div className="mb-6">
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {title}
                                </h1>
                            </div>
                        )}
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </PageTransition>
                </main>
            </div>

            {/* Toast notifications */}
            <Toaster />
        </div>
    );
}
