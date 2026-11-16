<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Messenger extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user_id = Auth::id();
        $user = User::find($user_id);
        try {
            $conversations = $user->conversations()->with(['users' => function ($q) use ($user_id) {
                $q->where('users.id', '!=', $user_id);
            }, 'latestMessage'])->latest()->get()->map(function ($conversation) use ($user_id) {
                $otherUser = $conversation->users->first();

                return [
                    'id' => $conversation->id,
                    'user' => $otherUser ? [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'username' => $otherUser->username ?? null,
                        'avatar_url' => $otherUser->avatar_url ?? null,
                        'online' => false,
                    ] : null,
                    'latest_message' => $conversation->latestMessage,
                    'created_at' => $conversation->created_at,
                    'updated_at' => $conversation->updated_at,
                ];
            });

            return response()->json([
                'success' => true,
                'conversations' => $conversations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(string $otherUserId)
    {
        if (!$otherUserId) {
            return response()->json([
                'success' => false,
                'message' => 'Id required'
            ]);
        }

        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $currentUserId = Auth::id();

        $conversation = Conversation::whereHas('users', function ($query) use ($currentUserId) {
            $query->where('user_id', $currentUserId);
        })
            ->whereHas('users', function ($query) use ($otherUserId) {
                $query->where('user_id', $otherUserId);
            })
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create();

            $conversation->users()->attach([$currentUserId, $otherUserId]);
        }

        $conversation->load(['users' => function ($query) use ($currentUserId) {
            $query->where('users.id', '!=', $currentUserId);
        }, 'latestMessage']);

        return response()->json([
            'success' => true,
            'conversation' => $conversation
        ]);
    }
}
