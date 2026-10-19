<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Category::query();

        // Filter by is_common if provided
        if ($request->has('is_common')) {
            $query->where('is_common', $request->boolean('is_common'));
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }

        $categories = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
            'cover_url' => 'nullable|string',
            'is_common' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $category = Category::create($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category,
        ], 201);
    }

    /**
     * Display the specified category.
     */
    public function show(string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        // Load motorcycles with their brands
        $motorcycles = $category->motorcycles()
            ->with('brand')
            ->orderBy('brand_ranking')
            ->orderBy('model')
            ->get()
            ->map(function ($motorcycle) {
                return [
                    'id' => $motorcycle->id,
                    'brand_id' => $motorcycle->brand_id,
                    'model' => $motorcycle->model,
                    'brand' => $motorcycle->brand->name ?? null,
                    'status' => $motorcycle->status,
                    'release_date' => $motorcycle->release_date,
                    'price' => $motorcycle->price,
                    'category' => $motorcycle->category?->name,
                    'frame' => $motorcycle->frame,
                    'engine_displacement' => $motorcycle->engine_displacement,
                    'top_speed' => $motorcycle->top_speed,
                    'transmission' => $motorcycle->transmission,
                    'transmission_type' => $motorcycle->transmission_type,
                    'colors_available' => $motorcycle->colors_available,
                    'description' => $motorcycle->description,
                    'stroke_number' => $motorcycle->stroke_number,
                    'cylinder' => $motorcycle->cylinder,
                    'valves' => $motorcycle->valves,
                    'overhead_cam' => $motorcycle->overhead_cam,
                    'cooling_system' => $motorcycle->cooling_system,
                    'compression_ratio' => $motorcycle->compression_ratio,
                    'maximum_power' => $motorcycle->maximum_power,
                    'maximum_torque' => $motorcycle->maximum_torque,
                    'starting_system' => $motorcycle->starting_system,
                    'engine_oil_capacity' => $motorcycle->engine_oil_capacity,
                    'fuel_system' => $motorcycle->fuel_system,
                    'fuel_consumption' => $motorcycle->fuel_consumption,
                    'front_suspension_type' => $motorcycle->front_suspension_type,
                    'rear_suspension_type' => $motorcycle->rear_suspension_type,
                    'front_brake_type' => $motorcycle->front_brake_type,
                    'is_front_abs' => $motorcycle->is_front_abs ? 'Yes' : 'No',
                    'rear_brake_type' => $motorcycle->rear_brake_type,
                    'is_rear_abs' => $motorcycle->is_rear_abs ? 'Yes' : 'No',
                    'front_tyre_size_and_type' => $motorcycle->front_tyre_size_and_type,
                    'rear_tyre_size_and_type' => $motorcycle->rear_tyre_size_and_type,
                    'wheel_type' => $motorcycle->wheel_type,
                    'wheel_base' => $motorcycle->wheel_base,
                    'dimension_length' => $motorcycle->dimension_length,
                    'dimension_width' => $motorcycle->dimension_width,
                    'dimension_height' => $motorcycle->dimension_height,
                    'curb_weight' => $motorcycle->curb_weight,
                    'seat_height' => $motorcycle->seat_height,
                    'ground_clearance' => $motorcycle->ground_clearance,
                    'fuel_tank_capacity' => $motorcycle->fuel_tank_capacity,
                    'ignition_type' => $motorcycle->ignition_type,
                    'battery_type' => $motorcycle->battery_type,
                    'is_keyless' => $motorcycle->is_keyless ? 'Yes' : '',
                    'is_electric_motorcycle' => $motorcycle->is_electric_motorcycle ? 'Yes' : 'No',
                    'has_charging_port' => $motorcycle->has_charging_port ? 'Yes' : 'No',
                    'special_features' => $motorcycle->special_features,
                    'transparent_url' => $motorcycle->transparent_url,
                    'is_latest' => $motorcycle->is_latest,
                    'slug' => $motorcycle->slug,
                    'related_motorcycle_1' => $motorcycle->related_motorcycle_1,
                    'related_motorcycle_2' => $motorcycle->related_motorcycle_2,
                    'related_motorcycle_3' => $motorcycle->related_motorcycle_3,
                    'related_motorcycle_4' => $motorcycle->related_motorcycle_4,
                    'related_motorcycle_5' => $motorcycle->related_motorcycle_5,
                    'related_motorcycle_6' => $motorcycle->related_motorcycle_6,
                    'other_keywords' => $motorcycle->other_keywords,
                    'is_top_motorcycle' => $motorcycle->is_top_motorcycle ? 'Yes' : 'No',
                    'brand_ranking' => $motorcycle->brand_ranking,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'is_common' => $category->is_common ? '1' : '0',
                'relevance' => $category->relevance,
                'cover_url' => $category->cover_url,
                'meta' => $category->meta ? json_encode($category->meta) : null,
                'created_at' => $category->created_at,
                'updated_at' => $category->updated_at,
                'query' => $category->name,
                'motorcycles' => $motorcycles,
            ],
        ]);
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:categories,slug,' . $category->id,
            'description' => 'nullable|string',
            'cover_url' => 'nullable|string',
            'is_common' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $category->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $category,
        ]);
    }

    /**
     * Remove the specified category.
     */
    public function destroy(string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ]);
    }

    /**
     * Mass import categories from JSON.
     */
    public function import(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'categories' => 'required|array',
            'categories.*.name' => 'required|string|max:255',
            'categories.*.slug' => 'required|string|max:255',
            'categories.*.description' => 'nullable|string',
            'categories.*.cover_url' => 'nullable|string',
            'categories.*.is_common' => 'nullable',
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

        foreach ($request->input('categories') as $index => $categoryData) {
            try {
                // Convert is_common to boolean
                $categoryData['is_common'] = isset($categoryData['is_common']) 
                    ? filter_var($categoryData['is_common'], FILTER_VALIDATE_BOOLEAN)
                    : false;

                // Check if category with slug already exists
                $existing = Category::where('slug', $categoryData['slug'])->first();
                
                if ($existing) {
                    // Update existing category
                    $existing->update($categoryData);
                    $imported++;
                } else {
                    // Create new category
                    Category::create($categoryData);
                    $imported++;
                }
            } catch (\Exception $e) {
                $skipped++;
                $errors[] = [
                    'index' => $index,
                    'slug' => $categoryData['slug'] ?? 'unknown',
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
