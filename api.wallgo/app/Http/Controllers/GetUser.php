<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GetUser extends Controller
{
    public function index($id=null)
    {
        try {
            $user_id = $id ?? Auth::id();
            $user = User::withCount(['followers', 'followings'])->findOrFail($user_id);
            $posts = Post::where('user_id', $user_id)->count();
            $followers_list = $user->followers();
            $followings_list = $user->followings();
            $posts_list = Post::withCount(['likes','comments'])->with(['user:id,name,username,avatar_url'])->select('id', 'user_id','content', 'media_url','created_at')->where('user_id', $user->id)->get();
            if (!$user) return response()->json(['success' => false, 'message' => 'User not found', 401]);
            return response()->json([
                'success' => true,
                'user' => $user,
                'stats' => [
                    'postsCount' => $posts,
                    'followers_count' => $user->followers_count,
                    'followings_count' => $user->followings_count,
                ],
                'followers_list' => $followers_list,
                'followings_list' => $followings_list,
                'posts_list' => $posts_list
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
