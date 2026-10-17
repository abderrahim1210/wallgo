<?php

namespace App\Http\Controllers;

use App\Models\Like as ModelsLike;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Like extends Controller
{
    public function create(Request $request)
    {
        $user_id = Auth::id();
        if (!$user_id) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        $post_id = $request->post_id;
        $post = Post::find($post_id);
        if (!$post) return response()->json(['success' => false, 'message' => 'Post by id is not exist']);
        try {
            $existingLike = ModelsLike::where('user_id', $user_id)->where('post_id', $post->id)->first();
            if ($existingLike) {
                $existingLike->delete();
                return response()->json([
                    'success' => true,
                    'message' => 'Like removed successfully',
                    'is_liked' => false,
                ]);
            } else {
                ModelsLike::create([
                    'user_id' => $user_id,
                    'post_id' => $post_id
                ]);
                return response()->json([
                    'success' => true,
                    'message' => 'Like added successfully',
                    'is_liked' => true
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }
}
