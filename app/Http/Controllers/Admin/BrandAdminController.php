<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Inertia\Inertia;
use Inertia\Response;

class BrandAdminController extends Controller
{
    /**
     * Display a listing of brands in the admin panel.
     */
    public function index(): Response
    {
        $brands = Brand::withCount('motorcycles')->orderBy('name')->get();

        return Inertia::render('Admin/Brands/Index', [
            'brands' => $brands,
        ]);
    }

    /**
     * Show the form for creating a new brand.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Brands/Create');
    }

    /**
     * Show the form for editing the specified brand.
     */
    public function edit(Brand $brand): Response
    {
        return Inertia::render('Admin/Brands/Edit', [
            'brand' => $brand,
        ]);
    }

    /**
     * Show the mass import page.
     */
    public function import(): Response
    {
        return Inertia::render('Admin/Brands/Import');
    }
}
