<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GetUsers extends Controller
{
    public function get()
    {
        $userId = Auth::id();
        if (!$userId) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        try {
            $followingIds = Follow::where('follower_id', $userId)->pluck('following_id');

            $suggestedUsers = User::whereIn('id', function ($query) use ($followingIds) {
                $query->select('following_id')
                    ->from('follows')
                    ->whereIn('follower_id', $followingIds);
            })
                ->where('id', '!=', $userId)
                ->whereNotIn('id', $followingIds)
                ->select('id', 'name', 'username', 'avatar_url')
                ->take(10)
                ->get();
            return response()->json([
                'success' => true,
                'users' => $suggestedUsers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }
}
