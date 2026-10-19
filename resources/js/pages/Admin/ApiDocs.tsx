import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { User } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { Code, Copy, Check, Lock, Globe, Search, Database } from 'lucide-react';

interface Props {
    auth: { user: User };
}

interface Endpoint {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    description: string;
    auth: boolean;
    params?: Record<string, string>;
    response?: string;
}

export default function ApiDocs({ auth }: Props) {
    const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
    const baseUrl = window.location.origin;

    const endpoints: Record<string, Endpoint[]> = {
        'Categories': [
            {
                method: 'GET',
                path: '/api/categories',
                description: 'Get all categories',
                auth: false,
                response: `{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sport",
      "slug": "sport",
      "description": "High-performance motorcycles designed for speed and agility",
      "cover_image": "/categories/sport.jpg",
      "is_common": true,
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T10:30:00.000000Z"
    },
    {
      "id": 2,
      "name": "Cruiser",
      "slug": "cruiser",
      "description": "Comfortable motorcycles for long-distance riding",
      "cover_image": "/categories/cruiser.jpg",
      "is_common": true,
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T10:30:00.000000Z"
    }
  ]
}`
            },
            {
                method: 'GET',
                path: '/api/categories/{slug}',
                description: 'Get category by slug with nested motorcycles',
                auth: false,
                response: `{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sport",
    "slug": "sport",
    "description": "High-performance motorcycles designed for speed and agility",
    "cover_image": "/categories/sport.jpg",
    "is_common": true,
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z",
    "motorcycles": [
      {
        "id": 101,
        "name": "Ninja ZX-10R",
        "slug": "ninja-zx-10r",
        "brand_id": 5,
        "category_id": 1,
        "model_year": 2024,
        "price": 16999.00,
        "status": "available",
        "image": "/motorcycles/ninja-zx-10r.jpg",
        "transparent_url": "/motorcycles/ninja-zx-10r-transparent.png",
        "engine_displacement": "998cc",
        "transmission": "Manual",
        "abs": "Combined",
        "fuel_consumption": "18.5 km/l",
        "created_at": "2024-01-20T14:20:00.000000Z",
        "updated_at": "2024-01-20T14:20:00.000000Z"
      }
    ]
  }
}`
            },
            {
                method: 'GET',
                path: '/api/category/{slug}',
                description: 'Alias for /api/categories/{slug}',
                auth: false,
            },
            {
                method: 'POST',
                path: '/api/categories',
                description: 'Create a new category',
                auth: true,
                params: {
                    name: 'Category name (required)',
                    slug: 'URL-friendly slug (required)',
                    description: 'Category description (optional)',
                    cover_url: 'Cover image URL (optional)',
                    is_common: 'Boolean (optional, default: true)',
                },
                response: `{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 10,
    "name": "Adventure",
    "slug": "adventure",
    "description": "Off-road capable touring motorcycles",
    "cover_image": "/categories/adventure.jpg",
    "is_common": true,
    "created_at": "2024-01-25T16:45:00.000000Z",
    "updated_at": "2024-01-25T16:45:00.000000Z"
  }
}`
            },
            {
                method: 'PUT',
                path: '/api/categories/{slug}',
                description: 'Update a category',
                auth: true,
                response: `{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 10,
    "name": "Adventure Touring",
    "slug": "adventure-touring",
    "description": "Long-distance off-road capable motorcycles",
    "cover_image": "/categories/adventure.jpg",
    "is_common": true,
    "created_at": "2024-01-25T16:45:00.000000Z",
    "updated_at": "2024-01-26T09:30:00.000000Z"
  }
}`
            },
            {
                method: 'DELETE',
                path: '/api/categories/{slug}',
                description: 'Delete a category',
                auth: true,
                response: `{
  "success": true,
  "message": "Category deleted successfully"
}`
            },
        ],
        'Brands': [
            {
                method: 'GET',
                path: '/api/brands',
                description: 'Get all brands',
                auth: false,
                response: `{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kawasaki",
      "slug": "kawasaki",
      "description": "Japanese manufacturer known for performance motorcycles",
      "logo_url": "/brands/kawasaki-logo.png",
      "website_url": "https://www.kawasaki.com",
      "created_at": "2024-01-10T08:00:00.000000Z",
      "updated_at": "2024-01-10T08:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "Honda",
      "slug": "honda",
      "description": "World's largest motorcycle manufacturer",
      "logo_url": "/brands/honda-logo.png",
      "website_url": "https://www.honda.com",
      "created_at": "2024-01-10T08:00:00.000000Z",
      "updated_at": "2024-01-10T08:00:00.000000Z"
    }
  ]
}`
            },
            {
                method: 'GET',
                path: '/api/brands/{slug}',
                description: 'Get brand by slug',
                auth: false,
                response: `{
  "success": true,
  "data": {
    "id": 1,
    "name": "Kawasaki",
    "slug": "kawasaki",
    "description": "Japanese manufacturer known for performance motorcycles",
    "logo_url": "/brands/kawasaki-logo.png",
    "website_url": "https://www.kawasaki.com",
    "created_at": "2024-01-10T08:00:00.000000Z",
    "updated_at": "2024-01-10T08:00:00.000000Z"
  }
}`
            },
            {
                method: 'GET',
                path: '/api/brand/{slug}',
                description: 'Alias for /api/brands/{slug}',
                auth: false,
            },
            {
                method: 'POST',
                path: '/api/brands',
                description: 'Create a new brand',
                auth: true,
                params: {
                    name: 'Brand name (required)',
                    slug: 'URL-friendly slug (required)',
                    description: 'Brand description (optional)',
                    logo_url: 'Logo URL (optional)',
                    website_url: 'Brand website (optional)',
                },
                response: `{
  "success": true,
  "message": "Brand created successfully",
  "data": {
    "id": 15,
    "name": "Ducati",
    "slug": "ducati",
    "description": "Italian manufacturer of premium motorcycles",
    "logo_url": "/brands/ducati-logo.png",
    "website_url": "https://www.ducati.com",
    "created_at": "2024-01-28T11:20:00.000000Z",
    "updated_at": "2024-01-28T11:20:00.000000Z"
  }
}`
            },
            {
                method: 'PUT',
                path: '/api/brands/{slug}',
                description: 'Update a brand',
                auth: true,
                response: `{
  "success": true,
  "message": "Brand updated successfully",
  "data": {
    "id": 15,
    "name": "Ducati Motor Holding",
    "slug": "ducati",
    "description": "Italian manufacturer of premium sport motorcycles",
    "logo_url": "/brands/ducati-logo.png",
    "website_url": "https://www.ducati.com",
    "created_at": "2024-01-28T11:20:00.000000Z",
    "updated_at": "2024-01-29T14:15:00.000000Z"
  }
}`
            },
            {
                method: 'DELETE',
                path: '/api/brands/{slug}',
                description: 'Delete a brand',
                auth: true,
                response: `{
  "success": true,
  "message": "Brand deleted successfully"
}`
            },
        ],
        'Motorcycles': [
            {
                method: 'GET',
                path: '/api/motorcycles',
                description: 'Get all motorcycles (paginated)',
                auth: false,
                response: `{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 101,
        "name": "Ninja ZX-10R",
        "slug": "ninja-zx-10r",
        "brand_id": 5,
        "category_id": 1,
        "model_year": 2024,
        "price": 16999.00,
        "status": "available",
        "image": "/motorcycles/ninja-zx-10r.jpg",
        "transparent_url": "/motorcycles/ninja-zx-10r-transparent.png",
        "engine_displacement": "998cc",
        "engine_type": "Liquid-cooled, 4-stroke, DOHC",
        "max_power": "203 HP @ 13,200 rpm",
        "max_torque": "114.9 Nm @ 11,400 rpm",
        "transmission": "Manual",
        "fuel_system": "Fuel Injection",
        "fuel_capacity": "17 L",
        "fuel_consumption": "18.5 km/l",
        "front_suspension": "43mm inverted fork",
        "rear_suspension": "Horizontal back-link",
        "front_brake": "Dual 330mm discs",
        "rear_brake": "Single 250mm disc",
        "abs": "Combined",
        "front_tire": "120/70 ZR17",
        "rear_tire": "190/55 ZR17",
        "seat_height": "835mm",
        "wet_weight": "207kg",
        "dry_weight": "206kg",
        "wheelbase": "1,450mm",
        "ground_clearance": "130mm",
        "top_speed": "299 km/h",
        "acceleration": "2.9s (0-100 km/h)",
        "warranty": "2 years unlimited mileage",
        "colors": "Lime Green, Metallic Spark Black",
        "features": "Traction Control, Quick Shifter, Launch Control, Cornering ABS",
        "created_at": "2024-01-20T14:20:00.000000Z",
        "updated_at": "2024-01-20T14:20:00.000000Z",
        "brand": {
          "id": 5,
          "name": "Kawasaki",
          "slug": "kawasaki"
        },
        "category": {
          "id": 1,
          "name": "Sport",
          "slug": "sport"
        }
      }
    ],
    "first_page_url": "http://localhost:8000/api/motorcycles?page=1",
    "from": 1,
    "last_page": 4,
    "last_page_url": "http://localhost:8000/api/motorcycles?page=4",
    "next_page_url": "http://localhost:8000/api/motorcycles?page=2",
    "path": "http://localhost:8000/api/motorcycles",
    "per_page": 15,
    "prev_page_url": null,
    "to": 15,
    "total": 52
  }
}`
            },
            {
                method: 'GET',
                path: '/api/motorcycles/{slug}',
                description: 'Get motorcycle by slug',
                auth: false,
                response: `{
  "success": true,
  "data": {
    "id": 101,
    "name": "Ninja ZX-10R",
    "slug": "ninja-zx-10r",
    "brand_id": 5,
    "category_id": 1,
    "model_year": 2024,
    "price": 16999.00,
    "status": "available",
    "image": "/motorcycles/ninja-zx-10r.jpg",
    "transparent_url": "/motorcycles/ninja-zx-10r-transparent.png",
    "engine_displacement": "998cc",
    "engine_type": "Liquid-cooled, 4-stroke, DOHC",
    "max_power": "203 HP @ 13,200 rpm",
    "max_torque": "114.9 Nm @ 11,400 rpm",
    "transmission": "Manual",
    "fuel_system": "Fuel Injection",
    "fuel_capacity": "17 L",
    "fuel_consumption": "18.5 km/l",
    "front_suspension": "43mm inverted fork",
    "rear_suspension": "Horizontal back-link",
    "front_brake": "Dual 330mm discs",
    "rear_brake": "Single 250mm disc",
    "abs": "Combined",
    "front_tire": "120/70 ZR17",
    "rear_tire": "190/55 ZR17",
    "seat_height": "835mm",
    "wet_weight": "207kg",
    "dry_weight": "206kg",
    "wheelbase": "1,450mm",
    "ground_clearance": "130mm",
    "top_speed": "299 km/h",
    "acceleration": "2.9s (0-100 km/h)",
    "warranty": "2 years unlimited mileage",
    "colors": "Lime Green, Metallic Spark Black",
    "features": "Traction Control, Quick Shifter, Launch Control, Cornering ABS",
    "created_at": "2024-01-20T14:20:00.000000Z",
    "updated_at": "2024-01-20T14:20:00.000000Z",
    "brand": {
      "id": 5,
      "name": "Kawasaki",
      "slug": "kawasaki",
      "logo_url": "/brands/kawasaki-logo.png"
    },
    "category": {
      "id": 1,
      "name": "Sport",
      "slug": "sport",
      "cover_image": "/categories/sport.jpg"
    }
  }
}`
            },
            {
                method: 'GET',
                path: '/api/motorcycle/{slug}',
                description: 'Alias for /api/motorcycles/{slug}',
                auth: false,
            },
            {
                method: 'POST',
                path: '/api/motorcycles',
                description: 'Create a new motorcycle',
                auth: true,
                params: {
                    name: 'Motorcycle name (required)',
                    slug: 'URL-friendly slug (required)',
                    brand_id: 'Brand ID (required)',
                    category_id: 'Category ID (required)',
                    model_year: 'Model year (required)',
                    price: 'Price in USD (required)',
                    status: 'available|sold|reserved (required)',
                    'All other fields': '60+ optional technical specifications',
                },
                response: `{
  "success": true,
  "message": "Motorcycle created successfully",
  "data": {
    "id": 150,
    "name": "CBR1000RR-R Fireblade",
    "slug": "cbr1000rr-r-fireblade",
    "brand_id": 2,
    "category_id": 1,
    "model_year": 2024,
    "price": 28500.00,
    "status": "available",
    "created_at": "2024-01-30T10:15:00.000000Z",
    "updated_at": "2024-01-30T10:15:00.000000Z"
  }
}`
            },
            {
                method: 'PUT',
                path: '/api/motorcycles/{slug}',
                description: 'Update a motorcycle',
                auth: true,
                response: `{
  "success": true,
  "message": "Motorcycle updated successfully"
}`
            },
            {
                method: 'DELETE',
                path: '/api/motorcycles/{slug}',
                description: 'Delete a motorcycle',
                auth: true,
                response: `{
  "success": true,
  "message": "Motorcycle deleted successfully"
}`
            },
        ],
        'Search': [
            {
                method: 'GET',
                path: '/api/search',
                description: 'Advanced search with filters and sorting',
                auth: false,
                params: {
                    'query': 'Search term (optional)',
                    'brand': 'Filter by brand slug',
                    'category': 'Filter by category slug',
                    'min_price': 'Minimum price',
                    'max_price': 'Maximum price',
                    'model_year': 'Filter by year',
                    'status': 'available|sold|reserved',
                    'transmission': 'Manual|Automatic|CVT|DCT',
                    'min_engine': 'Min engine displacement (cc)',
                    'max_engine': 'Max engine displacement (cc)',
                    'abs': 'yes|no|front|rear|combined',
                    'min_fuel': 'Min fuel consumption (km/l)',
                    'max_fuel': 'Max fuel consumption (km/l)',
                    'sort': 'Field to sort by (price, model_year, etc)',
                    'order': 'asc|desc',
                    'per_page': 'Results per page (default: 15)',
                },
                response: `{
  "success": true,
  "data": {
    "data": [...],
    "current_page": 1,
    "total": 50,
    "per_page": 15
  }
}`
            },
        ],
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedEndpoint(text);
        setTimeout(() => setCopiedEndpoint(null), 2000);
    };

    const getMethodColor = (method: string) => {
        const colors = {
            GET: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            POST: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        };
        return colors[method as keyof typeof colors];
    };

    return (
        <AppShell auth={auth} breadcrumbs={[{ label: 'API Documentation' }]} title="API Documentation">
            <Head title="API Documentation" />

            <div className="max-w-6xl space-y-6">
                {/* Introduction */}
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            Motorcycle API Documentation
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                RESTful API for managing and querying motorcycle data. All responses are in JSON format.
                            </p>
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Base URL:</p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm">
                                        {baseUrl}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(baseUrl)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                    >
                                        {copiedEndpoint === baseUrl ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <Globe className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Public Endpoints</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">No authentication required</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <Lock className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Protected Endpoints</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Requires API key in header</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Authentication */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Authentication
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-gray-700 dark:text-gray-300">
                            Protected endpoints require an API key. Include it in the request header:
                        </p>
                        <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto">
                            <code className="text-green-400 font-mono text-sm">
                                X-API-Key: your_api_key_here
                            </code>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Generate API keys in the <a href={route('admin.settings.index')} className="text-blue-600 dark:text-blue-400 hover:underline">Settings</a> page.
                        </p>
                    </CardContent>
                </Card>

                {/* Endpoints by category */}
                {Object.entries(endpoints).map(([category, categoryEndpoints]) => (
                    <Card key={category}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {category === 'Search' ? (
                                    <Search className="h-5 w-5" />
                                ) : (
                                    <Database className="h-5 w-5" />
                                )}
                                {category}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {categoryEndpoints.map((endpoint, idx) => (
                                <div key={idx} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                                    <div className="flex items-start gap-3 mb-3">
                                        <Badge className={getMethodColor(endpoint.method)}>
                                            {endpoint.method}
                                        </Badge>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <code className="text-sm font-mono text-gray-900 dark:text-gray-100">
                                                    {endpoint.path}
                                                </code>
                                                {endpoint.auth && (
                                                    <span title="Requires authentication">
                                                        <Lock className="h-4 w-4 text-red-500 dark:text-red-400" />
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{endpoint.description}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(`${baseUrl}${endpoint.path}`)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                        >
                                            {copiedEndpoint === `${baseUrl}${endpoint.path}` ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                            )}
                                        </button>
                                    </div>

                                    {endpoint.params && (
                                        <div className="mt-3 ml-20">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Parameters:</p>
                                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-1">
                                                {Object.entries(endpoint.params).map(([key, value]) => (
                                                    <div key={key} className="flex gap-2 text-sm">
                                                        <code className="text-blue-600 dark:text-blue-400 font-mono">{key}</code>
                                                        <span className="text-gray-600 dark:text-gray-400">-</span>
                                                        <span className="text-gray-700 dark:text-gray-300">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {endpoint.response && (
                                        <div className="mt-3 ml-20">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example Response:</p>
                                            <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto">
                                                <pre className="text-green-400 font-mono text-xs">{endpoint.response}</pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}

                {/* Response Codes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Response Codes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">200</Badge>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Success</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">201</Badge>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Created</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">400</Badge>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Bad Request</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">401</Badge>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Unauthorized</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">404</Badge>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Not Found</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">500</Badge>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Server Error</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
