<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Motorcycle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Advanced search for motorcycles with filtering and sorting.
     */
    public function search(Request $request): JsonResponse
    {
        $query = Motorcycle::with(['brand', 'category']);

        // Text search (model name)
        if ($request->has('q')) {
            $searchTerm = $request->input('q');
            $query->where('model', 'like', "%{$searchTerm}%");
        }

        // Filter by brand (supports multiple brands)
        if ($request->has('brand')) {
            $brands = is_array($request->input('brand')) 
                ? $request->input('brand') 
                : explode(',', $request->input('brand'));
            
            $query->whereIn('brand_id', $brands);
        }

        // Filter by brand name (slug)
        if ($request->has('brand_slug')) {
            $query->whereHas('brand', function ($q) use ($request) {
                $slugs = is_array($request->input('brand_slug'))
                    ? $request->input('brand_slug')
                    : explode(',', $request->input('brand_slug'));
                $q->whereIn('slug', $slugs);
            });
        }

        // Filter by category
        if ($request->has('category')) {
            $categories = is_array($request->input('category'))
                ? $request->input('category')
                : explode(',', $request->input('category'));
            
            $query->whereIn('category_id', $categories);
        }

        // Filter by transmission
        if ($request->has('transmission')) {
            $transmissions = is_array($request->input('transmission'))
                ? $request->input('transmission')
                : explode(',', $request->input('transmission'));
            
            $query->whereIn('transmission', $transmissions);
        }

        // Filter by engine displacement (range)
        if ($request->has('engine_min')) {
            $query->where('engine_displacement', '>=', $request->input('engine_min'));
        }
        if ($request->has('engine_max')) {
            $query->where('engine_displacement', '<=', $request->input('engine_max'));
        }
        
        // Filter by exact engine displacement
        if ($request->has('engine')) {
            $query->where('engine_displacement', $request->input('engine'));
        }

        // Filter by ABS
        if ($request->has('front_abs')) {
            $query->where('is_front_abs', $request->boolean('front_abs'));
        }
        if ($request->has('rear_abs')) {
            $query->where('is_rear_abs', $request->boolean('rear_abs'));
        }
        if ($request->has('abs')) {
            // Both front and rear ABS
            $hasAbs = $request->boolean('abs');
            if ($hasAbs) {
                $query->where('is_front_abs', true)->where('is_rear_abs', true);
            } else {
                $query->where(function ($q) {
                    $q->where('is_front_abs', false)->orWhere('is_rear_abs', false);
                });
            }
        }

        // Filter by status
        if ($request->has('status')) {
            $statuses = is_array($request->input('status'))
                ? $request->input('status')
                : explode(',', $request->input('status'));
            
            $query->whereIn('status', $statuses);
        }

        // Filter by fuel consumption (range)
        if ($request->has('fuel_min')) {
            $query->where('fuel_consumption', '>=', $request->input('fuel_min'));
        }
        if ($request->has('fuel_max')) {
            $query->where('fuel_consumption', '<=', $request->input('fuel_max'));
        }

        // Filter by price (range)
        if ($request->has('price_min')) {
            $query->where('price', '>=', $request->input('price_min'));
        }
        if ($request->has('price_max')) {
            $query->where('price', '<=', $request->input('price_max'));
        }

        // Filter by features
        if ($request->has('keyless')) {
            $query->where('is_keyless', $request->boolean('keyless'));
        }
        if ($request->has('electric')) {
            $query->where('is_electric_motorcycle', $request->boolean('electric'));
        }
        if ($request->has('latest')) {
            $query->where('is_latest', $request->boolean('latest'));
        }
        if ($request->has('top_motorcycle')) {
            $query->where('is_top_motorcycle', $request->boolean('top_motorcycle'));
        }

        // Filter by cooling system
        if ($request->has('cooling')) {
            $coolings = is_array($request->input('cooling'))
                ? $request->input('cooling')
                : explode(',', $request->input('cooling'));
            
            $query->whereIn('cooling_system', $coolings);
        }

        // Filter by fuel system
        if ($request->has('fuel_system')) {
            $fuelSystems = is_array($request->input('fuel_system'))
                ? $request->input('fuel_system')
                : explode(',', $request->input('fuel_system'));
            
            $query->whereIn('fuel_system', $fuelSystems);
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'model');
        $sortOrder = $request->input('sort_order', 'asc');
        
        // Validate sort order
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'asc';
        }

        // Apply sorting
        switch ($sortBy) {
            case 'brand':
                $query->join('brands', 'motorcycles.brand_id', '=', 'brands.id')
                    ->orderBy('brands.name', $sortOrder)
                    ->select('motorcycles.*');
                break;
            case 'price':
                $query->orderBy('price', $sortOrder);
                break;
            case 'engine':
            case 'engine_displacement':
                $query->orderBy('engine_displacement', $sortOrder);
                break;
            case 'fuel_consumption':
                $query->orderBy('fuel_consumption', $sortOrder);
                break;
            case 'status':
                $query->orderBy('status', $sortOrder);
                break;
            case 'created_at':
                $query->orderBy('created_at', $sortOrder);
                break;
            case 'model':
            default:
                $query->orderBy('model', $sortOrder);
                break;
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        if ($perPage > 100) {
            $perPage = 100; // Max 100 items per page
        }

        $motorcycles = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $motorcycles,
            'filters' => [
                'q' => $request->input('q'),
                'brand' => $request->input('brand'),
                'brand_slug' => $request->input('brand_slug'),
                'category' => $request->input('category'),
                'transmission' => $request->input('transmission'),
                'engine_min' => $request->input('engine_min'),
                'engine_max' => $request->input('engine_max'),
                'engine' => $request->input('engine'),
                'front_abs' => $request->input('front_abs'),
                'rear_abs' => $request->input('rear_abs'),
                'abs' => $request->input('abs'),
                'status' => $request->input('status'),
                'fuel_min' => $request->input('fuel_min'),
                'fuel_max' => $request->input('fuel_max'),
                'price_min' => $request->input('price_min'),
                'price_max' => $request->input('price_max'),
                'keyless' => $request->input('keyless'),
                'electric' => $request->input('electric'),
                'latest' => $request->input('latest'),
                'top_motorcycle' => $request->input('top_motorcycle'),
                'cooling' => $request->input('cooling'),
                'fuel_system' => $request->input('fuel_system'),
            ],
            'sort' => [
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }
}
