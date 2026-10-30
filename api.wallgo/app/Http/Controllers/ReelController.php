<?php

namespace App\Http\Controllers;

use App\Models\Reel;
use Cloudinary\Cloudinary;
// use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ReelController extends Controller
{
    public function create(Request $request)
    {
        $user_id = Auth::id();
        if (!$user_id) return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 401);

        $request->validate([
            'video' => ['required', 'file', 'mimes:mp4,mov,webm', 'max:51200'],
            'caption' => ['nullable', 'string', 'max:355'],
            'audio_name' => ['nullable', 'string'],
            'visibility' => ['nullable', 'string', 'in:public,private']
        ]);

        try {
            if (!$request->hasFile('video')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No video file provided'
                ], 422);
            }

            $videoFile = $request->file('video');
            // $check = new \App\Http\Controllers\ValideImage();
            // $valide = $check->valide($videoFile, 'video');
            // if ($valide) {
            $cloudinary = new Cloudinary([
                'cloud' => [
                    'cloud_name' => config('cloudinary.cloud_name', env('CLOUDINARY_CLOUD_NAME')),
                    'api_key'    => env('CLOUDINARY_API_KEY'),
                    'api_secret' => env('CLOUDINARY_API_SECRET'),
                ],
                'url' => ['secure' => true],
            ]);


            $result = $cloudinary->uploadApi()->upload($videoFile->getRealPath(), [
                'resource_type' => 'video',
                'folder' => 'wallgo_reels_url',
            ]);

            $video_url = $result['secure_url'];
            Reel::create([
                'user_id' => $user_id,
                'video_url' => $video_url,
                'caption' => $request->caption ?? null,
                'audio_name' => $request->audio_name ?? null,
                'visibility' => $request->visibility ?? 'public'
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Reel created successfully'
            ], 201);
            // } else {
            //     return response()->json([
            //         'success' => false,
            //         'message' => 'Failed to create a reel'
            //     ], 500);
            // }
        } catch (\Exception $e) {
            Log::error($e);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
}
