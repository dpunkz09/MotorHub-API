<?php

use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ImageUploadController;
use App\Http\Controllers\Api\MotorcycleController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Image upload routes
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/upload-image', [ImageUploadController::class, 'upload']);
    Route::post('/delete-image', [ImageUploadController::class, 'delete']);
});

// Search route
Route::get('/search', [SearchController::class, 'search'])->middleware(['api.key', 'throttle:60,1']);

// Brand routes
Route::prefix('brands')->middleware(['api.key', 'throttle:60,1'])->group(function () {
    Route::get('/', [BrandController::class, 'index']);
    Route::post('/', [BrandController::class, 'store']);
    Route::post('/import', [BrandController::class, 'import']);
    Route::get('/{slug}', [BrandController::class, 'show']);
    Route::put('/{slug}', [BrandController::class, 'update']);
    Route::delete('/{slug}', [BrandController::class, 'destroy']);
});

// Brand routes (singular alias)
Route::prefix('brand')->middleware('api.key')->group(function () {
    Route::get('/{slug}', [BrandController::class, 'show']);
});

// Category routes
Route::prefix('categories')->middleware(['api.key', 'throttle:60,1'])->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::post('/import', [CategoryController::class, 'import']);
    Route::get('/{slug}', [CategoryController::class, 'show']);
    Route::put('/{slug}', [CategoryController::class, 'update']);
    Route::delete('/{slug}', [CategoryController::class, 'destroy']);
});

// Category routes (singular alias)
Route::prefix('category')->middleware('api.key')->group(function () {
    Route::get('/{slug}', [CategoryController::class, 'show']);
});

// Motorcycle routes
Route::prefix('motorcycles')->middleware(['api.key', 'throttle:60,1'])->group(function () {
    Route::get('/', [MotorcycleController::class, 'index']);
    Route::post('/', [MotorcycleController::class, 'store']);
    Route::post('/import', [MotorcycleController::class, 'import']);
    Route::post('/{id}/image', [MotorcycleController::class, 'updateImage']);
    Route::put('/{id}/update', [MotorcycleController::class, 'updateById'])->where('id', '[0-9]+');
    Route::get('/{slug}', [MotorcycleController::class, 'show']);
    Route::put('/{slug}', [MotorcycleController::class, 'update']);
    Route::delete('/{slug}', [MotorcycleController::class, 'destroy']);
});

// Motorcycle routes (singular alias)
Route::prefix('motorcycle')->middleware('api.key')->group(function () {
    Route::get('/{slug}', [MotorcycleController::class, 'show']);
});


// Fetch and import from external API
Route::post('/motorcycles/import-from-brand/{brandSlug}', [MotorcycleController::class, 'importFromBrand'])->middleware('throttle:10,1');
