<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
    /**
     * Display a listing of brands.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Brand::query();

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }

        $brands = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $brands,
        ]);
    }

    /**
     * Store a newly created brand.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:brands,slug',
            'logo_url' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $brand = Brand::create($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Brand created successfully',
            'data' => $brand,
        ], 201);
    }

    /**
     * Display the specified brand.
     */
    public function show(string $slug): JsonResponse
    {
        $brand = Brand::where('slug', $slug)
            ->with(['motorcycles' => function ($query) {
                $query->orderBy('model');
            }])
            ->first();

        if (!$brand) {
            return response()->json([
                'success' => false,
                'message' => 'Brand not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $brand,
        ]);
    }

    /**
     * Update the specified brand.
     */
    public function update(Request $request, string $slug): JsonResponse
    {
        $brand = Brand::where('slug', $slug)->first();

        if (!$brand) {
            return response()->json([
                'success' => false,
                'message' => 'Brand not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            // SECURITY: Removed ID field from validation - prevent ID manipulation
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:brands,slug,' . $brand->id,
            'logo_url' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        // SECURITY: Removed ID manipulation logic
        // Update only allowed fields
        $brand->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Brand updated successfully',
            'data' => $brand,
        ]);
    }

    /**
     * Remove the specified brand.
     */
    public function destroy(string $slug): JsonResponse
    {
        $brand = Brand::where('slug', $slug)->first();

        if (!$brand) {
            return response()->json([
                'success' => false,
                'message' => 'Brand not found',
            ], 404);
        }

        // Check if brand has motorcycles - use exists() for better performance
        if ($brand->motorcycles()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete brand with existing motorcycles',
            ], 400);
        }

        $brand->delete();

        return response()->json([
            'success' => true,
            'message' => 'Brand deleted successfully',
        ]);
    }

    /**
     * Mass import brands from JSON.
     */
    public function import(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'brands' => 'required|array',
            'brands.*.name' => 'required|string|max:255',
            'brands.*.slug' => 'required|string|max:255',
            'brands.*.logo_url' => 'nullable|string',
            'brands.*.description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $imported = 0;
        $skipped = 0;
        $errors = [];

        foreach ($request->input('brands') as $index => $brandData) {
            try {
                // Check if brand with slug already exists
                $existing = Brand::where('slug', $brandData['slug'])->first();
                
                if ($existing) {
                    // Update existing brand
                    $existing->update($brandData);
                    $imported++;
                } else {
                    // Create new brand
                    Brand::create($brandData);
                    $imported++;
                }
            } catch (\Exception $e) {
                $skipped++;
                $errors[] = [
                    'index' => $index,
                    'slug' => $brandData['slug'] ?? 'unknown',
                    'error' => $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Import completed: {$imported} imported, {$skipped} skipped",
            'data' => [
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => $errors,
            ],
        ]);
    }
}
