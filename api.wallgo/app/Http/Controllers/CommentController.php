<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'post_id' => ['integer', 'required', 'exists:posts,id'],
            'content' => ['string', 'required', 'max:255']
        ]);
        $user = Auth::user();
        if (!$user) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        $user_id = $user->id;
        $post = Post::find($request->post_id);
        if (!$post) return response()->json(['success' => false, 'message' => 'Post not found']);


        try {
            Comment::create([
                'user_id' => $user_id,
                'post_id' => $request->post_id,
                'content' => $request->content
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Comment added successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }

    public function index($post_id)
    {
        $post = Post::find($post_id);
        if (!$post) return response()->json(['success' => false, 'message' => 'Post by this id not found']);

        try {
            $comments = Comment::with(['user'])->where('post_id', $post_id)->latest()->get();
            return response()->json(['success' => true, 'comments' => $comments]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }
}
