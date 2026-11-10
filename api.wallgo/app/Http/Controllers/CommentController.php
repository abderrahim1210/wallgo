<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Reel;
use App\Models\User;
use App\Notifications\CommentNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'type' => ['string', 'required', 'in:post,reel'],
            'id' => ['integer', 'required'],
            'content' => ['string', 'required', 'max:255'],
            'reply_to' => ['nullable', 'integer', 'exists:comments,id'],
            'comment_id' => ['nullable', 'integer', 'exists:comments,id']
        ]);
        $user = User::find(Auth::id());
        if (!$user) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        $user_id = $user->id;
        $obj = null;
        $type = $request->type;
        if ($type === 'post') {
            $obj = Post::find($request->id);
        } else {
            $obj = Reel::find($request->id);
        }
        if (!$obj) return response()->json(['success' => false, 'message' => "$type not found"]);
        if ($request->reply_to) {
            $comment = Comment::find($request->reply_to);
            if (!$comment) return response()->json(['success' => false, 'message' => 'Comment by id not found']);
        }

        if ($request->comment_id) {
            $commentExist = Comment::find($request->comment_id);
        }
        try {
            if ($request->filled('comment_id')) {
                $commentExist = Comment::find($request->comment_id);

                if (!$commentExist) {
                    return response()->json(['success' => false, 'message' => 'Comment not found']);
                }

                if ($commentExist->user_id !== $user->id) {
                    return response()->json(['success' => false, 'message' => 'Unauthorized action'], 403);
                }
                $commentExist->update([
                    'content' => $request->content,
                    'is_edited' => true
                ]);
                return response()->json([
                    'success' => true,
                    'message' => 'Comment updated successfully'
                ]);
            }

            if ($request->filled('reply_to')) {
                $parentComment = Comment::find($request->reply_to);
                if (!$parentComment) {
                    return response()->json(['success' => false, 'message' => 'Parent comment not found']);
                }
            }

            $comment = Comment::create([
                'user_id' => $user_id,
                'content' => $request->content,
                'reply_to' => $request->reply_to,
                'commentable_id' => $obj->id,
                'commentable_type' => get_class($obj),
            ]);

            $commentOwner = $obj->user;

            if ($commentOwner && $commentOwner->id !== $user->id) {
                $commentOwner->notify(new CommentNotification($comment, Auth::user(), $obj));
            }
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

    public function index($type, $id)
    {
        $obj = null;
        if ($type === 'reel') {
            $obj = Reel::find($id);
        } else {
            $obj = Post::find($id);
        }
        if (!$obj) return response()->json(['success' => false, 'message' => 'Post by this id not found']);

        try {
            $comments = Comment::with(['user', 'replies.user'])->withCount(['likes'])->withExists(['likes as is_liked' => function ($q) use ($id) {
                $q->where('commentable_id', $id);
            }])->where('commentable_id', $id)->where('commentable_type', get_class($obj))->whereNull('reply_to')->latest()->paginate(10);

            $postPage = null;
            if ($obj->postable_type && str_contains($obj->postable_type, 'Page')) {
                $postPage = $obj->postable;
            }

            $authId = (int) Auth::id();
            $pageOwnerId = $postPage ? (int) $postPage->owner_id : null;

            $decorate = function ($comment) use ($postPage, $authId, $pageOwnerId) {
                $isPageAuthor = $postPage && (int) $comment->user_id === $pageOwnerId;

                $comment->is_page_author = $isPageAuthor;
                $comment->page_info = $isPageAuthor ? [
                    'id' => $postPage->id,
                    'name' => $postPage->name,
                    'logo_url' => $postPage->logo_url,
                    'owner_id' => $postPage->owner_id
                ] : null;

                $comment->can_delete =
                    (int) $comment->user_id === $authId ||
                    ($pageOwnerId !== null && $pageOwnerId === $authId);
            };

            $comments->getCollection()->transform(function ($comment) use ($decorate) {
                $decorate($comment);
                $comment->replies->each($decorate);
                return $comment;
            });
            return response()->json(['success' => true, 'comments' => $comments]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }

    public function destroy(string $id)
    {
        $user_id = Auth::id();
        if (!$user_id) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        if (!$id) return response()->json(['success' => false, 'message' => 'Id required'], 404);
        $comment = Comment::find($id);
        if (!$comment) return response()->json(['success' => false, 'message' => 'Comment not found'], 404);
        if ($user_id !== $comment->user_id) return response()->json(['success' => false, 'message' => "You don't have a permession for delete this comment"]);
        try {
            $comment->delete();
            return response()->json([
                'success' => true,
                'message' => "Comment deleted successfully"
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }
}
