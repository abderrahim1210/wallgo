<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Like as ModelsLike;
use App\Models\Post;
use App\Models\Reel;
use App\Models\User;
use App\Notifications\PostLikedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Like extends Controller
{
    public function create(Request $request)
    {
        $user_id = Auth::id();
        if (!$user_id) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        $type = $request->type;
        $user = User::findOrFail($user_id);
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
            default:
                return response()->json(['success' => false, 'message' => 'Invalid type provided'], 422);
        }
        try {
            $existingLike = ModelsLike::where('user_id', $user_id)->where('liketable_id', $liketable->id)->where('liketable_type', get_class($liketable))->first();
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
                if ($liketable->user->emails_likes_notifications) {
                    if ($liketable->user && $liketable->user->id !== $user_id) {
                        $liketable->user->notify(new PostLikedNotification($user, $liketable, $type));
                    }
                }
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
