<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Post;
use App\Models\Reel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    public function save(Request $request)
    {
        $user_id = Auth::id();
        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 401);
        }

        if ($request->type === 'post') {
            if (empty($request->post_id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Id required for save post'
                ], 401);
            }
        } else {
            if (empty($request->reel_id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Id required for save post'
                ], 401);
            }
        }

        try {
            $booktable = null;
            switch ($request->type) {
                case 'post':
                    $booktable = Post::select('id')->find($request->post_id);
                    if (!$booktable) return response()->json(['success' => false, 'message' => "Post by id $request->post_id not found", 404]);
                    break;
                case 'reel':
                    $booktable = Reel::select('id')->find($request->reel_id);
                    if (!$booktable) return response()->json(['success' => false, 'message' => "Reel by id $request->reel_id not found", 404]);
                    break;
            }

            $saved = Bookmark::where('user_id', $user_id)->where('booktable_id', $booktable->id)->where('booktable_type', get_class($booktable))->first();

            if ($saved) {
                $saved->delete();
                return response()->json([
                    'success' => true,
                    'message' => 'Post unsaved'
                ], 200);
            } else {
                Bookmark::create([
                    'user_id' => $user_id,
                    'booktable_id' => $booktable->id,
                    'booktable_type' => $booktable ? get_class($booktable) : null
                ]);
                return response()->json([
                    'success' => true,
                    'message' => 'Post saved'
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        $user_id = Auth::id();
        if (!$user_id) return response()->json([
            'success' => false,
            'message' => 'User not found'
        ], 401);

        try {
            $posts = Post::whereHas('bookmarks', function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            })->withCount(['likes', 'comments'])->with(['user:id,name,username,avatar_url', 'postable:id,name,logo_url'])->withExists(['likes as is_liked' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->withExists(['bookmarks as is_saved' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->paginate(10);

            $reels = Reel::with(['user:id,username,name,avatar_url'])->withCount(['likes', 'comments'])->withExists(['user as is_owner' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->withExists(['user as is_followed' => function ($q) use ($user_id) {
                $q->whereHas('followers', function ($query) use ($user_id) {
                    $query->where('follower_id', $user_id);
                });
            }])->withExists(['likes as is_liked' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->withExists(['bookmarks as is_saved' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->latest()->paginate(10);

            return response()->json([
                'success' => true,
                'posts' => $posts,
                'reels' => $reels
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }
}
