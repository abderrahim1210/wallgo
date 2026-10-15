<?php

namespace App\Http\Controllers;

use App\Models\Post as ModelsPost;
use App\Models\Report;
use App\Models\User;
use BcMath\Number;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Post extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'content' => ['string', 'max:255', 'required'],
            'post_type' => ['string', 'in:regular,time_capsule'],
            'schedule_time' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date'],
            'unlock_time' => ['nullable', 'date'],
            'capsule_status' => ['nullable', 'string', 'in:published,active'],
            'media_url' => ['nullable', 'string']
        ]);

        $data = $request->all();

        $user = User::findOrFail(Auth::id());
        if (!$user) return response()->json(['success' => false, 'message' => 'User unauthorized'], 401);
        try {
            if (empty($data['content'])) {
                return response()->json([
                    'success' => false,
                    'message' => "Content can't be a empty"
                ]);
            }

            if (!empty($data['media_url']) && str_starts_with($data['media_url'], 'data:image')) {
                $check = new \App\Http\Controllers\ValideImage();
                $valide = $check->valide($data['media_url']);

                if ($valide) {
                    try {
                        $upload = new \App\Http\Controllers\CloudinaryActions();
                        $res = $upload->upload($data['media_url'], 'wallgo_medias');
                        $data['media_url'] = $res['image_url'] ?? $res['secure_url'] ?? $res['url'];
                    } catch (\Exception $e) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Upload banner failed : ' . $e->getMessage()
                        ]);
                    }
                } else {
                    unset($data['media_url']);
                }
            } else {
                unset($data['media_url']);
            }

            ModelsPost::create([
                'user_id' => $user->id,
                'content' => $data['content'],
                'schedule_time' => $data['schedule_time'] ?? null,
                'expires_at' => $data['expires_at'] ?? null,
                'unlock_time' => $data['unlock_time'] ?? null,
                'capsule_status' => $data['capsule_status'] ?? null,
                'media_url' => $data['media_url'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Post uploaded successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Upload failed : " . $e->getMessage()
            ]);
        }
    }


    public function index()
    {
        $user = User::findOrFail(Auth::id());
        try {
            if ($user) {
                $posts = ModelsPost::withCount(['likes', 'comments'])->with(['user:id,username,name,avatar_url'])->get();
                return response()->json([
                    'success' => true,
                    'posts' => $posts
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail(Auth::id());
        if (!$user) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        $post = ModelsPost::where('id', $id)->where('user_id', $user->id)->first();
        if (!$post) return response()->json(['success' => false, 'message' => 'Post not found', 404]);
        $data = $request->all();
        try {
            $fn = new \App\Http\Controllers\MediaValide();
            $res = $fn->valide($data['media_url']);
            if ($request->filled('media_url') && str_starts_with($request->media_url, 'data:image')) {
                if ($res) {
                    $data['media_url'] = $res['image_url'] ?? $res['secure_url'] ?? $res['url'];
                    $cloudinary = new \App\Http\Controllers\CloudinaryActions();
                    $cloudinary->destroy($post->media_url, 'wallgo_medias/');
                } else {
                    unset($data['media_url']);
                }
            } else {
                unset($data['media_url']);
            }

            $post->update($data);
            return response()->json([
                'success' => true,
                'message' => 'Post updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : '  . $e->getMessage()
            ]);
        }
    }

    public function destroy($id)
    {
        $user = User::findOrFail(Auth::id());
        $post = ModelsPost::findOrFail($id);
        if (!$user) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        if (!$post) return response()->json(['success' => false, 'message' => 'Post by this id not found'], 404);

        if ($post->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => "You don't have permission for delete this post"
            ]);
        }
        try {
            if ($post->media_url) {
                $cloudinary = new \App\Http\Controllers\CloudinaryActions();
                $cloudinary->destroy($post->media_url, 'wallgo_medias/');
            }


            $post->likes()->delete();
            $post->comments()->delete();

            $post->delete();

            return response()->json([
                'success' => true,
                'message' => 'Post deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }

    public function report(Request $request)
    {
        $user = User::findOrFail(Auth::id());
        if (!$user) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        $post = ModelsPost::select('id')->where('id', $request->id)->first();
        if (!$post) return response()->json(['success' => false, 'message' => 'Post not found'], 404);
        $request->validate([
            'reason' => ['string', 'required'],
            'description' => ['nullable', 'string']
        ]);
        try {
            $post->reports()->create([
                'user_id' => $user->id,
                'reason' => $request->reason,
                'description' => $request->description
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Report send succefully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }
}
