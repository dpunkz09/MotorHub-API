<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Motorcycle;
use Inertia\Inertia;
use Inertia\Response;

class MotorcycleAdminController extends Controller
{
    /**
     * Display a listing of motorcycles in the admin panel.
     */
    public function index(): Response
    {
        $query = Motorcycle::with(['brand', 'category']);

        // Get filter parameters from request
        $filters = request()->only(['brand_id', 'category_id', 'status', 'price_min', 'price_max', 'search']);
        
        // Search functionality
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('model', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhereHas('brand', function ($brandQuery) use ($search) {
                      $brandQuery->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('category', function ($categoryQuery) use ($search) {
                      $categoryQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        // Apply filters
        if (!empty($filters['brand_id'])) {
            $query->where('brand_id', $filters['brand_id']);
        }
        
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }
        
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        
        if (!empty($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }
        
        if (!empty($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        // Sorting
        $sortBy = request('sort_by', 'model');
        $sortOrder = request('sort_order', 'asc');
        
        $query->orderBy($sortBy, $sortOrder);

        $motorcycles = $query->paginate(20)->appends(request()->query());

        // Cache brands and categories for 1 hour to avoid repeated queries
        $brands = \Cache::remember('brands_for_filters', 3600, function () {
            return Brand::orderBy('name')->get()->toArray();
        });
        
        // Add motorcycle counts to each brand
        $brands = array_map(function ($brand) {
            $brand['motorcycles_count'] = Motorcycle::where('brand_id', $brand['id'])->count();
            return $brand;
        }, $brands);
        
        $categories = \Cache::remember('categories_for_filters', 3600, function () {
            return Category::orderBy('name')->get()->toArray();
        });

        return Inertia::render('Admin/Motorcycles/Index', [
            'motorcycles' => $motorcycles,
            'brands' => $brands,
            'categories' => $categories,
            'filters' => $filters,
            'sortBy' => $sortBy,
            'sortOrder' => $sortOrder,
        ]);
    }

    /**
     * Show the form for creating a new motorcycle.
     */
    public function create(): Response
    {
        // Get brands and categories as arrays, then cache
        $brands = \Cache::remember('brands_for_filters', 3600, function () {
            return Brand::orderBy('name')->get()->toArray();
        });
        
        $categories = \Cache::remember('categories_for_filters', 3600, function () {
            return Category::orderBy('name')->get()->toArray();
        });

        return Inertia::render('Admin/Motorcycles/Create', [
            'brands' => $brands,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for editing the specified motorcycle.
     */
    public function edit(Motorcycle $motorcycle): Response
    {
        $motorcycle->load(['brand', 'category']);
        
        // Get brands and categories as arrays, then cache
        $brands = \Cache::remember('brands_for_filters', 3600, function () {
            return Brand::orderBy('name')->get()->toArray();
        });
        
        $categories = \Cache::remember('categories_for_filters', 3600, function () {
            return Category::orderBy('name')->get()->toArray();
        });

        return Inertia::render('Admin/Motorcycles/Edit', [
            'motorcycle' => $motorcycle,
            'brands' => $brands,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the mass import page.
     */
    public function import(): Response
    {
        return Inertia::render('Admin/Motorcycles/Import');
    }

    /**
     * Show the JSON converter page.
     */
    public function convert(): Response
    {
        return Inertia::render('Admin/Motorcycles/ConvertBrand');
    }

    /**
     * Delete multiple motorcycles.
     */
    public function massDelete()
    {
        $validated = request()->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:motorcycles,id',
        ]);

        $count = Motorcycle::whereIn('id', $validated['ids'])->delete();

        return response()->json([
            'message' => "{$count} motorcycle(s) deleted successfully",
            'count' => $count,
        ]);
    }
}
