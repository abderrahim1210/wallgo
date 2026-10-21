<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GetUser extends Controller
{
    public function index($id = null)
    {
        try {
            $user_id = $id ?? Auth::id();
            $user = User::withCount(['followers', 'followings'])->findOrFail($user_id);
            $posts = Post::where('user_id', $user_id)->count();
            $followers_list = $user->followers()->get()->map(function ($follower) use ($user_id) {
                return [
                    'id' => $follower->id,
                    'name' => $follower->name,
                    'username' => $follower->username,
                    'avatar_url' => $follower->avatar_url,
                    'is_following' => Follow::where('follower_id', $user_id)->where('following_id', $follower->id)->exists()
                ];
            });
            $followings_list = $user->followings()->get()->map(function ($following) use ($user_id) {
                return [
                    'id' => $following->id,
                    'name' => $following->name,
                    'username' => $following->username,
                    'avatar_url' => $following->avatar_url,
                    'is_following' => Follow::where('follower_id', $user_id)->where('following_id', $following->id)->exists()
                ];
            });
            $posts_list = Post::select('id', 'user_id', 'content', 'media_url', 'created_at')->withCount(['likes', 'comments'])->with(['user:id,name,username,avatar_url'])->where('user_id', $user->id)->withExists(['likes as is_liked' => function ($query) use ($user_id) {
                $query->where('user_id', $user_id);
            }])->whereNull('postable_id')->get();
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

    public function getPosts()
    {
        $user = Auth::user();
        if (!$user) return response()->json([
            'success' => false,
            'message' => 'User not found'
        ], 401);

        $user_id = $user->id;
        try {
            $posts = Post::with(['user:id,name,username,avatar_url', 'postable:id,name,logo_url'])->withCount(['likes', 'comments'])->withExists(['likes as is_liked' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->where('user_id', $user_id)->get();
            return response()->json([
                'success' => true,
                'posts' => $posts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }
}
