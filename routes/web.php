<?php

use App\Http\Controllers\Admin\BrandAdminController;
use App\Http\Controllers\Admin\CategoryAdminController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MotorcycleAdminController;
use App\Http\Controllers\Admin\SettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

// Admin routes - protected by auth middleware
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    
    // Category routes
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoryAdminController::class, 'index'])->name('index');
        Route::get('/create', [CategoryAdminController::class, 'create'])->name('create');
        Route::get('/{category}/edit', [CategoryAdminController::class, 'edit'])->name('edit');
        Route::get('/import', [CategoryAdminController::class, 'import'])->name('import');
    });
    
    // Brand routes
    Route::prefix('brands')->name('brands.')->group(function () {
        Route::get('/', [BrandAdminController::class, 'index'])->name('index');
        Route::get('/create', [BrandAdminController::class, 'create'])->name('create');
        Route::get('/{brand}/edit', [BrandAdminController::class, 'edit'])->name('edit');
        Route::get('/import', [BrandAdminController::class, 'import'])->name('import');
    });
    
    // Motorcycle routes
    Route::prefix('motorcycles')->name('motorcycles.')->group(function () {
        Route::get('/', [MotorcycleAdminController::class, 'index'])->name('index');
        Route::get('/create', [MotorcycleAdminController::class, 'create'])->name('create');
        Route::get('/{motorcycle}/edit', [MotorcycleAdminController::class, 'edit'])->name('edit');
        Route::get('/import', [MotorcycleAdminController::class, 'import'])->name('import');
        Route::get('/convert', [MotorcycleAdminController::class, 'convert'])->name('convert');
        Route::post('/mass-delete', [MotorcycleAdminController::class, 'massDelete'])->name('mass-delete');
    });
    
    // Settings routes
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [SettingsController::class, 'index'])->name('index');
        Route::post('/access-mode', [SettingsController::class, 'updateAccessMode'])->name('access-mode');
        Route::post('/api-keys', [SettingsController::class, 'generateApiKey'])->name('api-keys.generate');
        Route::post('/api-keys/{id}/toggle', [SettingsController::class, 'toggleApiKey'])->name('api-keys.toggle');
        Route::delete('/api-keys/{id}', [SettingsController::class, 'deleteApiKey'])->name('api-keys.delete');
    });

    // API Documentation
    Route::get('/api-docs', function () {
        return Inertia::render('Admin/ApiDocs');
    })->name('api-docs');
});

require __DIR__.'/auth.php';
