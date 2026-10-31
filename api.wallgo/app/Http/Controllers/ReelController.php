<?php

namespace App\Http\Controllers;

use App\Models\Reel;
use Cloudinary\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReelController extends Controller
{
    public function index()
    {
        $user_id = Auth::id();
        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        try {
            $reels = Reel::with(['user:id,username,name,avatar_url'])->withCount(['likes', 'comments'])->withExists(['user as is_owner' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->latest()->paginate(10);
            return response()->json([
                'success' => true,
                'reels' => $reels
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }
    public function create(Request $request)
    {
        set_time_limit(300);
        ini_set('max_execution_time', '300');
        $user_id = Auth::id();
        if (!$user_id) return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 401);

        $request->validate([
            'video' => ['required', 'file', 'mimes:mp4,mov,webm', 'max:51200'],
            'caption' => ['nullable', 'string', 'max:355'],
            'audio_name' => ['nullable', 'string'],
            'audio_url' => ['nullable', 'string'],
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
            $cloudinary = new Cloudinary([
                'cloud' => [
                    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                    'api_key'    => env('CLOUDINARY_API_KEY'),
                    'api_secret' => env('CLOUDINARY_API_SECRET'),
                ],
                'url' => [
                    'secure' => true
                ]
            ]);

            $uploadResult = $cloudinary->uploadApi()->upload(
                $videoFile->getRealPath(),
                [
                    'resource_type' => 'video',
                    'folder' => 'wallgo_reels'
                ]
            );

            if (!isset($uploadResult['secure_url'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cloudinary upload failed to return secure URL'
                ], 500);
            }

            $video_url = $uploadResult['secure_url'];
            Reel::create([
                'user_id' => $user_id,
                'video_url' => $video_url,
                'caption' => $request->caption ?? null,
                'audio_name' => $request->audio_name ?? null,
                'audio_url' => $request->audio_url ?? null,
                'visibility' => $request->visibility ?? 'public'
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Reel created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
}
