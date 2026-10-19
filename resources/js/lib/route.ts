// Simple route helper for Inertia
const routes: Record<string, string> = {
    'home': '/',
    'login': '/login',
    'register': '/register',
    'logout': '/logout',
    'admin.dashboard': '/admin',
    'admin.categories.index': '/admin/categories',
    'admin.categories.create': '/admin/categories/create',
    'admin.categories.edit': '/admin/categories/:category/edit',
    'admin.categories.import': '/admin/categories/import',
    'admin.brands.index': '/admin/brands',
    'admin.brands.create': '/admin/brands/create',
    'admin.brands.edit': '/admin/brands/:brand/edit',
    'admin.brands.import': '/admin/brands/import',
    'admin.motorcycles.index': '/admin/motorcycles',
    'admin.motorcycles.create': '/admin/motorcycles/create',
    'admin.motorcycles.edit': '/admin/motorcycles/:motorcycle/edit',
    'admin.motorcycles.import': '/admin/motorcycles/import',
    'admin.motorcycles.convert': '/admin/motorcycles/convert',
    'admin.settings.index': '/admin/settings',
    'admin.api-docs': '/admin/api-docs',
};

export function route(name: string, params?: any): string {
    let url = routes[name] || name;
    
    if (params) {
        // If params is a number or string, treat it as the first placeholder
        if (typeof params === 'number' || typeof params === 'string') {
            url = url.replace(/:[^/]+/, params.toString());
        } else {
            // If params is an object, replace named placeholders
            Object.keys(params).forEach(key => {
                url = url.replace(`:${key}`, params[key]);
            });
        }
    }
    
    return url;
}

// Make route available globally for convenience
declare global {
    function route(name: string, params?: Record<string, any>): string;
}

if (typeof window !== 'undefined') {
    (window as any).route = route;
}
