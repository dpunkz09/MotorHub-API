<?php

namespace App\Http\Middleware;

use App\Models\ApiKey;
use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateApiKey
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if API access mode is public
        $accessMode = Setting::get('api_access_mode', 'public');
        
        if ($accessMode === 'public') {
            return $next($request);
        }

        // API key is required
        $apiKey = $request->header('X-API-Key') ?? $request->query('api_key');

        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'API key is required. Please provide it in X-API-Key header or api_key query parameter.',
            ], 401);
        }

        // Validate API key
        $key = ApiKey::where('key', $apiKey)->first();

        if (!$key || !$key->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired API key.',
            ], 401);
        }

        // Mark key as used
        $key->markAsUsed();

        return $next($request);
    }
}
