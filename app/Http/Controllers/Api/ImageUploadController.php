<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageUploadController extends Controller
{
    /**
     * Upload image without conversion (simpler approach).
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'folder' => 'sometimes|string',
        ]);

        try {
            $file = $request->file('image');
            $folder = $request->input('folder', 'images');
            
            // Generate unique filename with original extension
            $extension = $file->getClientOriginalExtension();
            $filename = uniqid() . '.' . $extension;
            $path = "{$folder}/{$filename}";
            
            // Store the file directly without conversion
            $storedPath = $file->storeAs($folder, $filename, 'public');
            
            // Get the public URL
            $url = Storage::disk('public')->url($storedPath);
            
            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'data' => [
                    'url' => $url,
                    'path' => $storedPath,
                    'filename' => $filename,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Image upload failed', [
                'folder' => $request->input('folder'),
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image',
            ], 500);
        }
    }

    /**
     * Delete an uploaded image.
     */
    public function delete(Request $request): JsonResponse
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        try {
            $path = $request->input('path');
            
            // Remove /storage/ prefix if present to get the actual storage path
            $storagePath = str_replace('/storage/', '', $path);
            
            // SECURITY: Prevent path traversal attacks
            // Normalize path and ensure it doesn't contain dangerous patterns
            $storagePath = str_replace(['../', '..\\', '..'], '', $storagePath);
            $storagePath = ltrim($storagePath, '/\\');
            
            // Only allow deletion from specific folders
            $allowedFolders = ['images', 'motorcycles', 'categories', 'brands'];
            $pathParts = explode('/', $storagePath);
            $firstFolder = $pathParts[0] ?? '';
            
            if (!in_array($firstFolder, $allowedFolders)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid file path',
                ], 403);
            }
            
            if (Storage::disk('public')->exists($storagePath)) {
                Storage::disk('public')->delete($storagePath);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Image deleted successfully',
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Image not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Image deletion failed', [
                'path' => $request->input('path'),
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image',
            ], 500);
        }
    }
}
