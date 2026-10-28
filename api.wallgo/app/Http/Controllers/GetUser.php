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
            $authenticated_user = Auth::id();
            $user_id = empty($id) ? $authenticated_user : $id;
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
                // 'posts_list' => $posts_list
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function getPosts($id = null)
    {
        $authenticated_user = Auth::id();
        $user_id = empty($id) ? $authenticated_user : $id;

        try {
            $posts = Post::with(['user:id,name,username,avatar_url', 'postable:id,name,logo_url'])->withCount(['likes', 'comments'])
                ->withExists(['likes as is_liked' => function ($q) use ($authenticated_user) {
                    $q->where('user_id', $authenticated_user);
                }])->withExists(['bookmarks as is_saved' => function ($q) use ($authenticated_user) {
                    $q->where('user_id', $authenticated_user);
                }])->where('user_id', $user_id)->whereNull('postable_id')->when(!empty($id), function ($q) {
                    $q->where(function ($subQuery) {
                        $subQuery->whereNull('schedule_time')->orWhere('schedule_time', '<=', now());
                    });
                })->latest()->paginate(10);
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
