<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Motorcycle;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
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
            $query->where('model', 'like', '%'.$request->input('search').'%');
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
        if (isset($data['brand']) && ! isset($data['brand_id'])) {
            $brand = Brand::where('name', $data['brand'])->first();
            if ($brand) {
                $data['brand_id'] = $brand->id;
            }
            unset($data['brand']);
        }

        // Convert category name to category_id if provided
        if (isset($data['category']) && ! isset($data['category_id'])) {
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
                'error' => $e->getMessage(),
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

        if (! $motorcycle) {
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

        if (! $motorcycle) {
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
        if (isset($data['brand']) && ! isset($data['brand_id'])) {
            $brand = Brand::where('name', $data['brand'])->first();
            if ($brand) {
                $data['brand_id'] = $brand->id;
            }
            unset($data['brand']);
        }

        // Convert category name to category_id if provided
        if (isset($data['category']) && ! isset($data['category_id'])) {
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

        if (! $motorcycle) {
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
        if (isset($data['brand']) && ! isset($data['brand_id'])) {
            $brand = Brand::where('name', $data['brand'])->first();
            if ($brand) {
                $data['brand_id'] = $brand->id;
            }
            unset($data['brand']);
        }

        // Convert category name to category_id if provided
        if (isset($data['category']) && ! isset($data['category_id'])) {
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

        if (! $motorcycle) {
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
        // Increase execution time for large imports
        set_time_limit(300); // 5 minutes

        $validator = Validator::make($request->all(), [
            'motorcycles' => 'required|array|min:1|max:1000',
        ]);

        if ($validator->fails()) {
            \Log::warning('Motorcycle import validation failed', [
                'errors' => $validator->errors()->toArray(),
                'data_count' => count($request->input('motorcycles', [])),
            ]);

            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $imported = 0;
        $updated = 0;
        $skipped = 0;
        $duplicateSkipped = 0;
        $errors = [];
        $motorcycles = $request->input('motorcycles');
        $processedSlugs = []; // Track slugs we've already processed in this batch

        \Log::info('Motorcycle import started', [
            'total_records' => count($motorcycles),
            'timestamp' => now()->toDateTimeString(),
        ]);

        // Pre-load all brands and categories to avoid repeated queries
        $brandsCache = Brand::pluck('id', 'name')->toArray();
        $categoriesCache = Category::pluck('id', 'name')->toArray();

        \Log::debug('Loaded lookup caches', [
            'brands_count' => count($brandsCache),
            'categories_count' => count($categoriesCache),
        ]);

        // Use transaction for better performance and data integrity
        \DB::beginTransaction();

        try {
            foreach ($motorcycles as $index => $motorcycleData) {
                try {
                    $recordInfo = [
                        'index' => $index,
                        'slug' => $motorcycleData['slug'] ?? 'missing',
                        'model' => $motorcycleData['model'] ?? 'missing',
                        'brand' => $motorcycleData['brand'] ?? $motorcycleData['brand_id'] ?? 'missing',
                    ];

                    // Validate required fields
                    if (! isset($motorcycleData['slug'])) {
                        throw new \Exception("Missing required field 'slug'");
                    }
                    if (! isset($motorcycleData['model'])) {
                        throw new \Exception("Missing required field 'model'");
                    }

                    $slug = $motorcycleData['slug'];

                    // Check for duplicates within this batch
                    if (isset($processedSlugs[$slug])) {
                        $duplicateSkipped++;
                        \Log::warning('Duplicate slug in batch', array_merge($recordInfo, [
                            'slug' => $slug,
                            'previous_index' => $processedSlugs[$slug],
                            'reason' => 'Same slug already processed in this import batch',
                        ]));

                        $errors[] = [
                            'index' => $index,
                            'slug' => $slug,
                            'model' => $motorcycleData['model'] ?? 'unknown',
                            'brand' => $motorcycleData['brand'] ?? $motorcycleData['brand_id'] ?? 'unknown',
                            'error' => 'Duplicate slug in import batch (already at index '.$processedSlugs[$slug].')',
                            'error_type' => 'DuplicateSlugException',
                        ];

                        continue; // Skip this duplicate
                    }

                    // Mark this slug as processed
                    $processedSlugs[$slug] = $index;

                    // Store the desired ID if provided
                    $desiredId = isset($motorcycleData['id']) ? $motorcycleData['id'] : null;

                    // Convert brand name to brand_id using cached data
                    if (isset($motorcycleData['brand']) && ! isset($motorcycleData['brand_id'])) {
                        $brandName = $motorcycleData['brand'];
                        if (isset($brandsCache[$brandName])) {
                            $motorcycleData['brand_id'] = $brandsCache[$brandName];
                            \Log::debug('Brand name converted to ID', array_merge($recordInfo, [
                                'brand_name' => $brandName,
                                'brand_id' => $brandsCache[$brandName],
                            ]));
                        } else {
                            \Log::error('Brand not found during import', array_merge($recordInfo, [
                                'brand_name' => $brandName,
                                'available_brands' => array_keys($brandsCache),
                            ]));
                            throw new \Exception("Brand '{$brandName}' not found. Available brands: ".implode(', ', array_keys($brandsCache)));
                        }
                        unset($motorcycleData['brand']);
                    } elseif (! isset($motorcycleData['brand_id'])) {
                        \Log::error('Missing brand information', $recordInfo);
                        throw new \Exception("Either 'brand' or 'brand_id' is required");
                    }

                    // Convert category name to category_id using cached data
                    if (isset($motorcycleData['category']) && ! isset($motorcycleData['category_id'])) {
                        $categoryName = $motorcycleData['category'];
                        if (isset($categoriesCache[$categoryName])) {
                            $motorcycleData['category_id'] = $categoriesCache[$categoryName];
                            \Log::debug('Category name converted to ID', array_merge($recordInfo, [
                                'category_name' => $categoryName,
                                'category_id' => $categoriesCache[$categoryName],
                            ]));
                        } else {
                            \Log::warning('Category not found, will be set to null', array_merge($recordInfo, [
                                'category_name' => $categoryName,
                                'available_categories' => array_keys($categoriesCache),
                            ]));
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
                    if (isset($motorcycleData['engine_displacement'])) {
                        $original = $motorcycleData['engine_displacement'];
                        if (is_string($original)) {
                            // Extract numeric value (supports both integer and decimal)
                            $motorcycleData['engine_displacement'] = (float) filter_var($original, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        } else {
                            // Already numeric, ensure it's float
                            $motorcycleData['engine_displacement'] = (float) $original;
                        }
                        if ((string) $original !== (string) $motorcycleData['engine_displacement']) {
                            \Log::debug('Engine displacement sanitized', array_merge($recordInfo, [
                                'original' => $original,
                                'sanitized' => $motorcycleData['engine_displacement'],
                            ]));
                        }
                    }

                    if (isset($motorcycleData['price']) && is_string($motorcycleData['price'])) {
                        $original = $motorcycleData['price'];
                        $motorcycleData['price'] = (float) filter_var($motorcycleData['price'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                        if ((float) $original !== $motorcycleData['price']) {
                            \Log::debug('Price sanitized', array_merge($recordInfo, [
                                'original' => $original,
                                'sanitized' => $motorcycleData['price'],
                            ]));
                        }
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
                        'related_motorcycle_4', 'related_motorcycle_5', 'related_motorcycle_6',
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
                        \Log::info('Updating existing motorcycle', array_merge($recordInfo, [
                            'existing_id' => $existing->id,
                            'action' => 'update',
                        ]));

                        // SECURITY: Prevent ID manipulation - ignore provided ID for updates
                        unset($motorcycleData['id']);
                        $existing->update($motorcycleData);
                        $updated++;
                    } else {
                        // Create new motorcycle
                        \Log::info('Creating new motorcycle', array_merge($recordInfo, [
                            'action' => 'create',
                        ]));

                        // SECURITY: Prevent ID manipulation - ignore provided ID, use auto-increment
                        unset($motorcycleData['id']);
                        $motorcycle = Motorcycle::create($motorcycleData);
                        \Log::info('Motorcycle created successfully', array_merge($recordInfo, [
                            'created_id' => $motorcycle->id,
                        ]));
                        $imported++;
                    }
                } catch (\Exception $e) {
                    $skipped++;
                    $errorDetail = [
                        'index' => $index,
                        'slug' => $motorcycleData['slug'] ?? 'unknown',
                        'model' => $motorcycleData['model'] ?? 'unknown',
                        'brand' => $motorcycleData['brand'] ?? $motorcycleData['brand_id'] ?? 'unknown',
                        'error' => $e->getMessage(),
                        'error_type' => get_class($e),
                        'line' => $e->getLine(),
                    ];

                    \Log::error('Motorcycle import record skipped', array_merge($errorDetail, [
                        'trace' => $e->getTraceAsString(),
                        'raw_data' => $motorcycleData,
                    ]));

                    $errors[] = $errorDetail;
                }
            }

            // Commit transaction
            \DB::commit();

            \Log::info('Motorcycle import completed', [
                'total' => count($motorcycles),
                'imported' => $imported,
                'updated' => $updated,
                'skipped' => $skipped,
                'duplicate_skipped' => $duplicateSkipped,
                'success_rate' => count($motorcycles) > 0 ? round((($imported + $updated) / count($motorcycles)) * 100, 2).'%' : '0%',
                'duration' => 'completed',
            ]);

            $message = "Import completed: {$imported} created";
            if ($updated > 0) {
                $message .= ", {$updated} updated";
            }
            if ($skipped > 0) {
                $message .= ", {$skipped} skipped";
            }
            if ($duplicateSkipped > 0) {
                $message .= ", {$duplicateSkipped} duplicates ignored";
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'imported' => $imported,
                    'updated' => $updated,
                    'skipped' => $skipped,
                    'duplicate_skipped' => $duplicateSkipped,
                    'errors' => $errors,
                ],
            ]);
        } catch (\Exception $e) {
            // Rollback on failure
            \DB::rollBack();

            \Log::error('Motorcycle import transaction failed - rolled back', [
                'error' => $e->getMessage(),
                'error_type' => get_class($e),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString(),
                'imported_before_failure' => $imported,
                'updated_before_failure' => $updated,
                'skipped_before_failure' => $skipped,
                'duplicate_skipped_before_failure' => $duplicateSkipped,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Import failed - all changes rolled back: '.$e->getMessage(),
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
            'brand_id' => $required.'required|exists:brands,id',
            'category_id' => 'nullable|exists:categories,id',
            'model' => $required.'required|string|max:255',
            'slug' => $required.'required|string|max:255|unique:motorcycles,slug'.($id ? ','.$id : ''),
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

    /**
     * Import motorcycles from external API by brand slug.
     */
    public function importFromBrand(Request $request, string $brandSlug): JsonResponse
    {
        $startTime = microtime(true);
        $memoryStart = memory_get_usage(true);

        set_time_limit(300); // 5 minutes
        ini_set('memory_limit', '512M'); // Increase memory limit for large imports

        \Log::info('External API import started', [
            'brand_slug' => $brandSlug,
            'timestamp' => now()->toDateTimeString(),
            'memory_start' => round($memoryStart / 1024 / 1024, 2).'MB',
        ]);

        try {
            // Fetch data from external API
            $externalUrl = "https://www.kamote.ph/api/brand/{$brandSlug}";

            \Log::debug('Fetching from external API', [
                'url' => $externalUrl,
            ]);

            $response = \Http::timeout(60)
                ->retry(3, 1000) // Retry 3 times with 1 second delay
                ->get($externalUrl);

            if (! $response->successful()) {
                $statusCode = $response->status();
                $errorBody = $response->body();

                \Log::error('External API request failed', [
                    'status' => $statusCode,
                    'url' => $externalUrl,
                    'response_body' => substr($errorBody, 0, 500),
                ]);

                $errorMessage = match ($statusCode) {
                    404 => "Brand '{$brandSlug}' not found on external API",
                    429 => 'Rate limit exceeded on external API',
                    500, 502, 503 => 'External API server error',
                    default => 'Failed to fetch data from external API',
                };

                return response()->json([
                    'success' => false,
                    'message' => $errorMessage,
                    'error' => "HTTP {$statusCode}",
                    'details' => substr($errorBody, 0, 200),
                ], $statusCode >= 500 ? 500 : 422);
            }

            $data = $response->json();

            if (! isset($data['motorcycles']) || ! is_array($data['motorcycles'])) {
                \Log::error('Invalid API response format', [
                    'response_keys' => array_keys($data),
                    'has_motorcycles' => isset($data['motorcycles']),
                    'motorcycles_type' => isset($data['motorcycles']) ? gettype($data['motorcycles']) : 'missing',
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Invalid data format from external API',
                    'error' => 'Expected "motorcycles" array in response',
                    'details' => 'Response keys: '.implode(', ', array_keys($data)),
                ], 422);
            }

            $motorcycles = $data['motorcycles'];
            $totalRecords = count($motorcycles);

            if ($totalRecords === 0) {
                \Log::warning('No motorcycles found in API response', [
                    'brand_slug' => $brandSlug,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'No motorcycles found for this brand',
                    'data' => [
                        'imported' => 0,
                        'skipped' => 0,
                        'total' => 0,
                        'errors' => [],
                    ],
                ]);
            }

            // Memory check after fetching data
            $memoryAfterFetch = memory_get_usage(true);
            \Log::debug('Data fetched from external API', [
                'total_records' => $totalRecords,
                'memory_used' => round(($memoryAfterFetch - $memoryStart) / 1024 / 1024, 2).'MB',
                'memory_current' => round($memoryAfterFetch / 1024 / 1024, 2).'MB',
            ]);

            // Find the brand by slug to ensure imported motorcycles are assigned to it
            $brand = Brand::where('slug', $brandSlug)->first();

            if (! $brand) {
                \Log::error('Brand not found for import', [
                    'brand_slug' => $brandSlug,
                ]);

                return response()->json([
                    'success' => false,
                    'message' => "Brand '{$brandSlug}' not found in database",
                    'error' => 'Brand must exist before importing motorcycles',
                    'details' => 'Please create the brand first, then import motorcycles',
                ], 404);
            }

            // Override brand for all motorcycles to match the import source
            // Use array_walk for better memory efficiency instead of foreach with references
            array_walk($motorcycles, function (&$motorcycle) use ($brand) {
                $motorcycle['brand_id'] = $brand->id;
                unset($motorcycle['brand']); // Remove brand name to prevent conflicts
            });

            \Log::info('Brand assignment overridden for import', [
                'brand_id' => $brand->id,
                'brand_name' => $brand->name,
                'brand_slug' => $brandSlug,
                'total_motorcycles' => count($motorcycles),
            ]);

            // Use the existing import logic
            $request->merge(['motorcycles' => $motorcycles]);
            $importResult = $this->import($request);

            // Add performance metrics to the response
            $duration = round(microtime(true) - $startTime, 2);
            $memoryPeak = memory_get_peak_usage(true);
            $memoryUsed = $memoryPeak - $memoryStart;

            \Log::info('External API import completed', [
                'brand_slug' => $brandSlug,
                'duration_seconds' => $duration,
                'memory_peak' => round($memoryPeak / 1024 / 1024, 2).'MB',
                'memory_used' => round($memoryUsed / 1024 / 1024, 2).'MB',
                'records_processed' => $totalRecords,
            ]);

            // Decode JSON response to add metrics
            $resultData = json_decode($importResult->content(), true);
            if (isset($resultData['data'])) {
                $resultData['data']['duration_seconds'] = $duration;
                $resultData['data']['memory_used_mb'] = round($memoryUsed / 1024 / 1024, 2);
                $resultData['data']['total'] = $totalRecords;
            }

            return response()->json($resultData, $importResult->status());
        } catch (ConnectionException $e) {
            \Log::error('External API connection failed', [
                'brand_slug' => $brandSlug,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Connection to external API failed',
                'error' => 'Network timeout or connection refused',
                'details' => $e->getMessage(),
            ], 500);
        } catch (RequestException $e) {
            \Log::error('External API request exception', [
                'brand_slug' => $brandSlug,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'External API request failed',
                'error' => $e->getMessage(),
                'details' => 'The external API returned an error response',
            ], 500);
        } catch (\Exception $e) {
            $duration = round(microtime(true) - $startTime, 2);

            \Log::error('External API import failed', [
                'brand_slug' => $brandSlug,
                'error' => $e->getMessage(),
                'error_type' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'duration_seconds' => $duration,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Import failed due to server error',
                'error' => $e->getMessage(),
                'details' => get_class($e).' in '.$e->getFile().' on line '.$e->getLine(),
            ], 500);
        } finally {
            // Force garbage collection to free memory
            if (function_exists('gc_collect_cycles')) {
                gc_collect_cycles();
            }
        }
    }
}
