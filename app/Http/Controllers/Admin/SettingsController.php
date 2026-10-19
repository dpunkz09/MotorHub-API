<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ApiKey;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index(): Response
    {
        $apiKeys = ApiKey::orderBy('created_at', 'desc')->get();
        $accessMode = Setting::get('api_access_mode', 'public');

        return Inertia::render('Admin/Settings/Index', [
            'apiKeys' => $apiKeys,
            'accessMode' => $accessMode,
        ]);
    }

    /**
     * Update API access mode.
     */
    public function updateAccessMode(Request $request): JsonResponse
    {
        $request->validate([
            'mode' => 'required|in:public,protected',
        ]);

        Setting::set('api_access_mode', $request->input('mode'));

        return response()->json([
            'success' => true,
            'message' => 'API access mode updated successfully',
        ]);
    }

    /**
     * Generate a new API key.
     */
    public function generateApiKey(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'expires_in_days' => 'nullable|integer|min:1|max:365',
        ]);

        $apiKey = ApiKey::generate(
            $request->input('name'),
            $request->input('expires_in_days')
        );

        return response()->json([
            'success' => true,
            'message' => 'API key generated successfully',
            'data' => $apiKey,
        ]);
    }

    /**
     * Toggle API key status.
     */
    public function toggleApiKey(Request $request, int $id): JsonResponse
    {
        $apiKey = ApiKey::findOrFail($id);
        $apiKey->update(['is_active' => !$apiKey->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'API key status updated',
            'data' => $apiKey,
        ]);
    }

    /**
     * Delete an API key.
     */
    public function deleteApiKey(int $id): JsonResponse
    {
        $apiKey = ApiKey::findOrFail($id);
        $apiKey->delete();

        return response()->json([
            'success' => true,
            'message' => 'API key deleted successfully',
        ]);
    }
}
