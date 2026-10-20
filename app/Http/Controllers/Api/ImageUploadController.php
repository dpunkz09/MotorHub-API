<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageUploadController extends Controller
{
    /**
     * Upload image with WebP conversion and optimization.
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

            // Generate unique filename with .webp extension
            $filename = uniqid().'.webp';
            $path = "{$folder}/{$filename}";

            // Get temporary path
            $tempPath = $file->getRealPath();

            // Detect image type and create image resource
            $imageInfo = getimagesize($tempPath);
            $mimeType = $imageInfo['mime'];

            switch ($mimeType) {
                case 'image/jpeg':
                    $image = imagecreatefromjpeg($tempPath);
                    break;
                case 'image/png':
                    $image = imagecreatefrompng($tempPath);
                    // Preserve transparency
                    imagealphablending($image, false);
                    imagesavealpha($image, true);
                    break;
                case 'image/gif':
                    $image = imagecreatefromgif($tempPath);
                    break;
                case 'image/webp':
                    $image = imagecreatefromwebp($tempPath);
                    break;
                default:
                    return response()->json([
                        'success' => false,
                        'message' => 'Unsupported image type',
                    ], 422);
            }

            if (! $image) {
                throw new \Exception('Failed to create image resource');
            }

            // Calculate optimized dimensions (max 1920px width or height)
            $originalWidth = imagesx($image);
            $originalHeight = imagesy($image);
            $maxDimension = 1920;

            if ($originalWidth > $maxDimension || $originalHeight > $maxDimension) {
                // Calculate new dimensions maintaining aspect ratio
                if ($originalWidth > $originalHeight) {
                    $newWidth = $maxDimension;
                    $newHeight = intval(($maxDimension / $originalWidth) * $originalHeight);
                } else {
                    $newHeight = $maxDimension;
                    $newWidth = intval(($maxDimension / $originalHeight) * $originalWidth);
                }

                // Create resized image
                $resizedImage = imagecreatetruecolor($newWidth, $newHeight);

                // Preserve transparency for PNG/WebP
                imagealphablending($resizedImage, false);
                imagesavealpha($resizedImage, true);

                // Resize with high quality
                imagecopyresampled(
                    $resizedImage,
                    $image,
                    0, 0, 0, 0,
                    $newWidth, $newHeight,
                    $originalWidth, $originalHeight
                );

                imagedestroy($image);
                $image = $resizedImage;
            }

            // Create directory if it doesn't exist
            $fullPath = storage_path("app/public/{$folder}");
            if (! file_exists($fullPath)) {
                mkdir($fullPath, 0755, true);
            }

            // Save as WebP with quality 85
            $destinationPath = storage_path("app/public/{$path}");
            $success = imagewebp($image, $destinationPath, 85);

            // Clean up
            imagedestroy($image);

            if (! $success) {
                throw new \Exception('Failed to save WebP image');
            }

            // Get the public URL
            $url = Storage::disk('public')->url($path);

            \Log::info('Image uploaded and converted to WebP', [
                'original_mime' => $mimeType,
                'original_size' => filesize($tempPath),
                'webp_size' => filesize($destinationPath),
                'dimensions' => imagesx($image).'x'.imagesy($image),
                'path' => $path,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Image uploaded and optimized successfully',
                'data' => [
                    'url' => $url,
                    'path' => $path,
                    'filename' => $filename,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Image upload failed', [
                'folder' => $request->input('folder'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image: '.$e->getMessage(),
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

            if (! in_array($firstFolder, $allowedFolders)) {
                \Log::warning('Image deletion blocked - invalid folder', [
                    'path' => $path,
                    'folder' => $firstFolder,
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Invalid file path',
                ], 403);
            }

            if (Storage::disk('public')->exists($storagePath)) {
                Storage::disk('public')->delete($storagePath);

                \Log::info('Image deleted successfully', [
                    'path' => $storagePath,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Image deleted successfully',
                ]);
            }

            \Log::warning('Image deletion failed - file not found', [
                'path' => $storagePath,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Image not found',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Image deletion failed', [
                'path' => $request->input('path'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image: '.$e->getMessage(),
            ], 500);
        }
    }
}
