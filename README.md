# Motorcycle API

API for managing motorcycle brands, categories, prices, and types.

## Setup

1. Install dependencies:
```bash
composer install
npm install
```

2. Copy environment file:
```bash
copy .env.example .env
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Run migrations:
```bash
php artisan migrate
```

5. Seed categories (optional):
```bash
php artisan db:seed --class=CategorySeeder
```

## API Endpoints

### Categories

#### List all categories
```
GET /api/categories
Query params:
  - is_common (boolean): Filter by common categories
  - search (string): Search by name
```

#### Get single category
```
GET /api/categories/{slug}
```

#### Create category
```
POST /api/categories
Body:
{
  "name": "Category Name",
  "slug": "category-slug",
  "description": "Description text",
  "cover_url": "/path/to/image.jpg",
  "is_common": true
}
```

#### Update category
```
PUT /api/categories/{slug}
Body: Same as create (all fields optional)
```

#### Delete category
```
DELETE /api/categories/{slug}
```

#### Mass import categories
```
POST /api/categories/import
Body:
{
  "categories": [
    {
      "name": "Cafe Racer",
      "slug": "cafe-racer",
      "description": "Known for low handlebars...",
      "cover_url": "/categories/cafe-racer.jpg",
      "is_common": "1"
    },
    ...
  ]
}
```

## Admin Dashboard

Access the admin dashboard at:
- `/admin/categories` - List all categories
- `/admin/categories/create` - Create new category
- `/admin/categories/{id}/edit` - Edit category
- `/admin/categories/import` - Mass import categories

## Development

Run the development server:
```bash
npm run dev
php artisan serve
```

## Testing

Run tests:
```bash
php artisan test
```
