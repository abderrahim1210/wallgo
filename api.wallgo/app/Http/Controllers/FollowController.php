<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{

    public function add_follow(Request $request)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        $following_id = $request->following_id;
        if (!$following_id) return response()->json(['success' => false, 'message' => 'Target user id is required'], 400);
        if ($following_id == $user->id) return response()->json(['success' => false, 'message' => 'You cannot follow yourself'], 400);
        $following = User::findOrFail($following_id);
        $follow = Follow::where('follower_id', $user->id)->where('following_id', $following_id)->first();
        try {
            if (!$follow) {
                Follow::firstOrCreate([
                    'follower_id' => $user->id,
                    'following_id' => $following_id
                ]);
                $newStatus = true;
            } else {
                $newStatus = false;
                $follow->delete();
            }
            return response()->json([
                'success' => true,
                'followed' => $newStatus,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }

    public function checkFollow(Request $request)
    {
        $user = Auth::user();
        $following_id = $request->id;
        if (!$user || !$following_id) return response()->json([
            'success' => false,
            'message' => 'User id or following id not found'
        ], 404);
        $is_followed = false;
        try {
            $follow = Follow::where('follower_id', $user->id)->where('following_id', $following_id)->first();
            if ($follow) {
                $is_followed = true;
            }
            return response()->json([
                'success' => true,
                'is_followed' => $is_followed
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }
}
