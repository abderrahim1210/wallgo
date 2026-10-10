<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GetUser extends Controller
{
    public function index()
    {
        try {
            $user = User::find(Auth::id());
            $posts = Post::where('user_id', Auth::id())->count();
            if (!$user) return response()->json(['success' => false, 'message' => 'User not found', 401]);
            return response()->json([
                'success' => true,
                'user' => $user,
                'stats' => [
                    'postsCount' => $posts
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
