<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Motorcycle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MotorcycleController extends Controller
{
    /**
     * Display a listing of motorcycles.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Motorcycle::with(['brand', 'category']);

        // Filter by brand
        if ($request->has('brand_id')) {
            $query->where('brand_id', $request->input('brand_id'));
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by is_latest
        if ($request->has('is_latest')) {
            $query->where('is_latest', $request->boolean('is_latest'));
        }

        // Filter by is_top_motorcycle
        if ($request->has('is_top_motorcycle')) {
            $query->where('is_top_motorcycle', $request->boolean('is_top_motorcycle'));
        }

        // Search by model
        if ($request->has('search')) {
            $query->where('model', 'like', '%' . $request->input('search') . '%');
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'model');
        $sortOrder = $request->input('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->input('per_page', 15);
        $motorcycles = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $motorcycles,
        ]);
    }

    /**
     * Store a newly created motorcycle.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = $this->getValidator($request->all());

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        
        // Convert brand name to brand_id if provided
        if (isset($data['brand']) && !isset($data['brand_id'])) {
            $brand = Brand::where('name', $data['brand'])->first();
            if ($brand) {
                $data['brand_id'] = $brand->id;
            }
            unset($data['brand']);
        }

        // Convert category name to category_id if provided
        if (isset($data['category']) && !isset($data['category_id'])) {
            $category = Category::where('name', $data['category'])->first();
            if ($category) {
                $data['category_id'] = $category->id;
            }
            unset($data['category']);
        }

        $motorcycle = Motorcycle::create($data);
        $motorcycle->load(['brand', 'category']);

        return response()->json([
            'success' => true,
            'message' => 'Motorcycle created successfully',
            'data' => $motorcycle,
        ], 201);
    }

    /**
     * Update motorcycle image.
     */
    public function updateImage(Request $request, $id): JsonResponse
    {
        try {
            $motorcycle = Motorcycle::findOrFail($id);
            
            $request->validate([
                'image_url' => 'required|url|starts_with:http://,https://',
            ]);

            $motorcycle->image = $request->input('image_url');
            $motorcycle->save();

            return response()->json([
                'success' => true,
                'message' => 'Motorcycle image updated successfully',
                'data' => $motorcycle,
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to update motorcycle image', [
                'motorcycle_id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update image',
            ], 500);
        }
    }

    /**
     * Display the specified motorcycle.
     */
    public function show(string $slug): JsonResponse
    {
        $motorcycle = Motorcycle::where('slug', $slug)
            ->with(['brand', 'category'])
            ->first();

        if (!$motorcycle) {
            return response()->json([
                'success' => false,
                'message' => 'Motorcycle not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $motorcycle,
        ]);
    }

    /**
     * Update a motorcycle by ID (for admin use).
     */
    public function updateById(Request $request, int $id): JsonResponse
    {
        $motorcycle = Motorcycle::find($id);

        if (!$motorcycle) {
            return response()->json([
                'success' => false,
                'message' => 'Motorcycle not found',
            ], 404);
        }

        $validator = $this->getValidator($request->all(), $motorcycle->id, true);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        
        // Convert brand name to brand_id if provided
        if (isset($data['brand']) && !isset($data['brand_id'])) {
            $brand = Brand::where('name', $data['brand'])->first();
            if ($brand) {
                $data['brand_id'] = $brand->id;
            }
            unset($data['brand']);
        }

        // Convert category name to category_id if provided
        if (isset($data['category']) && !isset($data['category_id'])) {
            $category = Category::where('name', $data['category'])->first();
            if ($category) {
                $data['category_id'] = $category->id;
            }
            unset($data['category']);
        }

        $motorcycle->update($data);
        $motorcycle->load(['brand', 'category']);

        return response()->json([
            'success' => true,
            'message' => 'Motorcycle updated successfully',
            'data' => $motorcycle,
        ]);
    }

    /**
     * Update the specified motorcycle.
     */
    public function update(Request $request, string $slug): JsonResponse
    {
        $motorcycle = Motorcycle::where('slug', $slug)->first();

        if (!$motorcycle) {
            return response()->json([
                'success' => false,
                'message' => 'Motorcycle not found',
            ], 404);
        }

        $validator = $this->getValidator($request->all(), $motorcycle->id, true);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        
        // Convert brand name to brand_id if provided
        if (isset($data['brand']) && !isset($data['brand_id'])) {
            $brand = Brand::where('name', $data['brand'])->first();
            if ($brand) {
                $data['brand_id'] = $brand->id;
            }
            unset($data['brand']);
        }

        // Convert category name to category_id if provided
        if (isset($data['category']) && !isset($data['category_id'])) {
            $category = Category::where('name', $data['category'])->first();
            if ($category) {
                $data['category_id'] = $category->id;
            }
            unset($data['category']);
        }

        $motorcycle->update($data);
        $motorcycle->load(['brand', 'category']);

        return response()->json([
            'success' => true,
            'message' => 'Motorcycle updated successfully',
            'data' => $motorcycle,
        ]);
    }

    /**
     * Remove the specified motorcycle.
     */
    public function destroy(string $slug): JsonResponse
    {
        $motorcycle = Motorcycle::where('slug', $slug)->first();

        if (!$motorcycle) {
            return response()->json([
                'success' => false,
                'message' => 'Motorcycle not found',
            ], 404);
        }

        $motorcycle->delete();

        return response()->json([
            'success' => true,
            'message' => 'Motorcycle deleted successfully',
        ]);
    }

    /**
     * Mass import motorcycles from JSON.
     */
    public function import(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'motorcycles' => 'required|array|min:1|max:1000',
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

        // Use transaction for better performance and data integrity
        \DB::beginTransaction();
        
        try {
            foreach ($request->input('motorcycles') as $index => $motorcycleData) {
                try {
                    // Store the desired ID if provided
                    $desiredId = isset($motorcycleData['id']) ? $motorcycleData['id'] : null;
                
                // Convert brand name to brand_id
                if (isset($motorcycleData['brand']) && !isset($motorcycleData['brand_id'])) {
                    $brand = Brand::where('name', $motorcycleData['brand'])->first();
                    if ($brand) {
                        $motorcycleData['brand_id'] = $brand->id;
                    } else {
                        throw new \Exception("Brand '{$motorcycleData['brand']}' not found");
                    }
                    unset($motorcycleData['brand']);
                }

                // Convert category name to category_id
                if (isset($motorcycleData['category']) && !isset($motorcycleData['category_id'])) {
                    $category = Category::where('name', $motorcycleData['category'])->first();
                    if ($category) {
                        $motorcycleData['category_id'] = $category->id;
                    }
                    unset($motorcycleData['category']);
                }

                // Convert boolean string values and handle missing/null values
                $booleanFields = ['is_front_abs', 'is_rear_abs', 'is_keyless', 'is_electric_motorcycle', 'has_charging_port', 'is_latest', 'is_top_motorcycle'];
                foreach ($booleanFields as $field) {
                    if (isset($motorcycleData[$field])) {
                        $value = $motorcycleData[$field];
                        // Handle "?", null, empty string as false
                        if ($value === '?' || $value === '' || $value === null) {
                            $motorcycleData[$field] = false;
                        } elseif ($value === 'Yes' || $value === 'yes' || $value === '1' || $value === 1 || $value === true) {
                            $motorcycleData[$field] = true;
                        } else {
                            $motorcycleData[$field] = false;
                        }
                    } else {
                        // If field is not set at all, default to false
                        $motorcycleData[$field] = false;
                    }
                }

                // Clean up numeric fields that might have text
                if (isset($motorcycleData['engine_displacement']) && is_string($motorcycleData['engine_displacement'])) {
                    $motorcycleData['engine_displacement'] = (int) filter_var($motorcycleData['engine_displacement'], FILTER_SANITIZE_NUMBER_INT);
                }
                
                if (isset($motorcycleData['price']) && is_string($motorcycleData['price'])) {
                    $motorcycleData['price'] = (float) filter_var($motorcycleData['price'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                }

                // Clean up "?" values in string fields - convert to null
                $nullableStringFields = [
                    'category_id', 'release_date', 'description', 'frame', 'stroke_number', 'cylinder', 
                    'valves', 'overhead_cam', 'cooling_system', 'compression_ratio', 'maximum_power', 
                    'maximum_torque', 'starting_system', 'engine_oil_capacity', 'fuel_system', 
                    'fuel_consumption', 'ignition_type', 'top_speed', 'transmission', 'transmission_type',
                    'front_suspension_type', 'rear_suspension_type', 'front_brake_type', 'rear_brake_type',
                    'front_tyre_size_and_type', 'rear_tyre_size_and_type', 'wheel_type', 'wheel_base',
                    'dimension_length', 'dimension_width', 'dimension_height', 'curb_weight', 'seat_height',
                    'ground_clearance', 'fuel_tank_capacity', 'battery_type', 'special_features', 
                    'colors_available', 'transparent_url', 'brand_ranking', 'other_keywords',
                    'related_motorcycle_1', 'related_motorcycle_2', 'related_motorcycle_3', 
                    'related_motorcycle_4', 'related_motorcycle_5', 'related_motorcycle_6'
                ];
                
                foreach ($nullableStringFields as $field) {
                    if (isset($motorcycleData[$field]) && ($motorcycleData[$field] === '?' || $motorcycleData[$field] === '')) {
                        $motorcycleData[$field] = null;
                    }
                }

                // Check if motorcycle with slug already exists
                $existing = Motorcycle::where('slug', $motorcycleData['slug'])->first();
                
                if ($existing) {
                    // Update existing motorcycle
                    // SECURITY: Prevent ID manipulation - ignore provided ID for updates
                    unset($motorcycleData['id']);
                    $existing->update($motorcycleData);
                    $imported++;
                } else {
                    // SECURITY: Prevent ID manipulation - ignore provided ID, use auto-increment
                    unset($motorcycleData['id']);
                    Motorcycle::create($motorcycleData);
                    $imported++;
                }
            } catch (\Exception $e) {
                $skipped++;
                $errors[] = [
                    'index' => $index,
                    'slug' => $motorcycleData['slug'] ?? 'unknown',
                    'model' => $motorcycleData['model'] ?? 'unknown',
                    'error' => $e->getMessage(),
                ];
            }
        }
        
        // Commit transaction
        \DB::commit();

        return response()->json([
            'success' => true,
            'message' => "Import completed: {$imported} imported, {$skipped} skipped",
            'data' => [
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => $errors,
            ],
        ]);
    } catch (\Exception $e) {
        // Rollback on failure
        \DB::rollBack();
        
        \Log::error('Motorcycle import failed', [
            'error' => $e->getMessage()
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Import failed - all changes rolled back',
            'errors' => [$e->getMessage()],
        ], 500);
    }
}

    /**
     * Get validation rules for motorcycle.
     */
    private function getValidator(array $data, ?int $id = null, bool $isUpdate = false): \Illuminate\Validation\Validator
    {
        $required = $isUpdate ? 'sometimes|' : '';
        
        return Validator::make($data, [
            'brand_id' => $required . 'required|exists:brands,id',
            'category_id' => 'nullable|exists:categories,id',
            'model' => $required . 'required|string|max:255',
            'slug' => $required . 'required|string|max:255|unique:motorcycles,slug' . ($id ? ',' . $id : ''),
            'status' => 'nullable|string|in:Available,Discontinued,Coming Soon',
            'release_date' => 'nullable|string',
            'price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'frame' => 'nullable|string',
            'engine_displacement' => 'nullable|integer',
            'stroke_number' => 'nullable|string',
            'cylinder' => 'nullable|string',
            'valves' => 'nullable|string',
            'overhead_cam' => 'nullable|string',
            'cooling_system' => 'nullable|string',
            'compression_ratio' => 'nullable|string',
            'maximum_power' => 'nullable|string',
            'maximum_torque' => 'nullable|string',
            'starting_system' => 'nullable|string',
            'engine_oil_capacity' => 'nullable|string',
            'fuel_system' => 'nullable|string',
            'fuel_consumption' => 'nullable|string', // Changed from numeric to string
            'ignition_type' => 'nullable|string',
            'top_speed' => 'nullable|string',
            'transmission' => 'nullable|string',
            'transmission_type' => 'nullable|string',
            'front_suspension_type' => 'nullable|string',
            'rear_suspension_type' => 'nullable|string',
            'front_brake_type' => 'nullable|string',
            'is_front_abs' => 'nullable|boolean',
            'rear_brake_type' => 'nullable|string',
            'is_rear_abs' => 'nullable|boolean',
            'front_tyre_size_and_type' => 'nullable|string',
            'rear_tyre_size_and_type' => 'nullable|string',
            'wheel_type' => 'nullable|string',
            'wheel_base' => 'nullable|string',
            'dimension_length' => 'nullable|string',
            'dimension_width' => 'nullable|string',
            'dimension_height' => 'nullable|string',
            'curb_weight' => 'nullable|string',
            'seat_height' => 'nullable|string',
            'ground_clearance' => 'nullable|string',
            'fuel_tank_capacity' => 'nullable|string',
            'battery_type' => 'nullable|string',
            'is_keyless' => 'nullable|boolean',
            'is_electric_motorcycle' => 'nullable|boolean',
            'has_charging_port' => 'nullable|boolean',
            'special_features' => 'nullable|string',
            'colors_available' => 'nullable|string',
            'transparent_url' => 'nullable|string',
            'is_latest' => 'nullable|boolean',
            'is_top_motorcycle' => 'nullable|boolean',
            'brand_ranking' => 'nullable|string',
            'other_keywords' => 'nullable|string',
            'related_motorcycle_1' => 'nullable|string',
            'related_motorcycle_2' => 'nullable|string',
            'related_motorcycle_3' => 'nullable|string',
            'related_motorcycle_4' => 'nullable|string',
            'related_motorcycle_5' => 'nullable|string',
            'related_motorcycle_6' => 'nullable|string',
        ]);
    }
}
