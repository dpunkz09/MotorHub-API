import { Link, router } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Tag, 
    Building2, 
    Bike, 
    Settings, 
    LogOut,
    ChevronLeft,
    Menu,
    BookOpen
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { route } from '@/lib/route';

interface SidebarProps {
    currentPath: string;
}

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    pattern: RegExp;
}

const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: route('admin.dashboard'),
        icon: LayoutDashboard,
        pattern: /^\/admin\/?$/,
    },
    {
        label: 'Categories',
        href: route('admin.categories.index'),
        icon: Tag,
        pattern: /^\/admin\/categories/,
    },
    {
        label: 'Brands',
        href: route('admin.brands.index'),
        icon: Building2,
        pattern: /^\/admin\/brands/,
    },
    {
        label: 'Motorcycles',
        href: route('admin.motorcycles.index'),
        icon: Bike,
        pattern: /^\/admin\/motorcycles/,
    },
    {
        label: 'API Docs',
        href: route('admin.api-docs'),
        icon: BookOpen,
        pattern: /^\/admin\/api-docs/,
    },
    {
        label: 'Settings',
        href: route('admin.settings.index'),
        icon: Settings,
        pattern: /^\/admin\/settings/,
    },
];

export default function Sidebar({ currentPath }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (pattern: RegExp) => pattern.test(currentPath);

    const handleLogout = () => {
        // Use Inertia router for POST request
        router.post(route('logout'));
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-40 shadow-xl',
                    collapsed ? 'w-16' : 'w-64',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className={cn(
                        'flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800',
                        collapsed && 'justify-center'
                    )}>
                        {!collapsed && (
                            <Link 
                                href={route('admin.dashboard')}
                                className="flex items-center space-x-2 text-lg font-bold text-gray-900 dark:text-gray-100 group"
                            >
                                <div className="p-1.5 rounded-lg bg-blue-600 group-hover:bg-blue-700 transition-colors">
                                    <Bike className="h-5 w-5 text-white" />
                                </div>
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Moto Admin</span>
                            </Link>
                        )}
                        {collapsed && (
                            <div className="p-1.5 rounded-lg bg-blue-600">
                                <Bike className="h-5 w-5 text-white" />
                            </div>
                        )}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-110"
                        >
                            <ChevronLeft
                                className={cn(
                                    'h-5 w-5 text-gray-500 transition-transform duration-300',
                                    collapsed && 'rotate-180'
                                )}
                            />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        {navItems.map((item, index) => {
                            const Icon = item.icon;
                            const active = isActive(item.pattern);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group relative overflow-hidden',
                                        active
                                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 hover:scale-105',
                                        collapsed && 'justify-center',
                                        'animate-fade-in',
                                        `stagger-${index + 1}`
                                    )}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {active && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-400 rounded-r" />
                                    )}
                                    <Icon className={cn('h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110', active && 'text-blue-600 dark:text-blue-400')} />
                                    {!collapsed && (
                                        <span className="transition-all">{item.label}</span>
                                    )}
                                    {!collapsed && active && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer - Logout */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className={cn(
                                'w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 group',
                                collapsed && 'justify-center'
                            )}
                        >
                            <LogOut className="h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                            {!collapsed && <span className="ml-3">Logout</span>}
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
}
