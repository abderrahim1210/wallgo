<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Like as ModelsLike;
use App\Models\Post;
use App\Models\Reel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Like extends Controller
{
    public function create(Request $request)
    {
        $user_id = Auth::id();
        if (!$user_id) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        $type = $request->type;
        if (!$type) {
            return response()->json(['success' => false, 'message' => 'Type id not found']);
        }
        $liketable = null;
        switch ($type) {
            case 'post':
                $liketable = Post::find($request->post_id);
                if (!$liketable) return response()->json(['success' => false, 'message' => 'Post by id is not exist']);
                break;
            case 'comment':
                $liketable = Comment::find($request->comment_id);
                if (!$liketable) return response()->json(['success' => false, 'message' => 'Comment by id is not exist']);
                break;
            case 'reel':
                $liketable = Reel::find($request->reel_id);
                if (!$liketable) return response()->json(['success' => false, 'message' => 'Reel by id is not exist']);
                break;
        }
        try {
            $existingLike = ModelsLike::where('user_id', $user_id)->where('liketable_id', $liketable->id)->where('liketable_type',get_class($liketable))->first();
            if ($existingLike) {
                $existingLike->delete();
                return response()->json([
                    'success' => true,
                    'message' => 'Like removed successfully',
                    'is_liked' => false,
                ]);
            } else {
                $liketable->likes()->create([
                    'user_id' => $user_id,
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
