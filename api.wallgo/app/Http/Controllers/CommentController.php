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
            'content' => ['string', 'required', 'max:255'],
            'reply_to' => ['nullable', 'integer', 'exists:comments,id']
        ]);
        $user = Auth::user();
        if (!$user) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        $user_id = $user->id;
        $post = Post::find($request->post_id);
        if (!$post) return response()->json(['success' => false, 'message' => 'Post not found']);
        if ($request->reply_to) {
            $comment = Comment::find($request->reply_to);
            if (!$comment) return response()->json(['success' => false, 'message' => 'Comment by id not found']);
        }

        try {
            Comment::create([
                'user_id' => $user_id,
                'post_id' => $request->post_id,
                'content' => $request->content,
                'reply_to' => $request->reply_to
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
            $comments = Comment::with(['user', 'replies.user'])->withCount(['likes'])->withExists(['likes as is_liked' => function ($q) use ($post_id) {
                $q->where('post_id', $post_id);
            }])->where('post_id', $post_id)->whereNull('reply_to')->latest()->get();
            return response()->json(['success' => true, 'comments' => $comments]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }
}
