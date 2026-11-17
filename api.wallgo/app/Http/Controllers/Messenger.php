<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Messenger extends Controller
{
    public function index()
    {
        $user_id = Auth::user();

        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user = User::find($user_id);

        $conversations = $user->conversations()
            ->with([
                'users' => fn($query) => $query->where('users.id', '!=', $user->id),
                'latestMessage',
            ])
            ->withCount([
                'messages as unread' => fn($query) => $query
                    ->where('sender_id', '!=', $user->id)
                    ->where('is_read', false),
            ])
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn(Conversation $conversation) => $this->conversationPayload($conversation));

        return response()->json([
            'success' => true,
            'conversations' => $conversations,
        ]);
    }

    public function show(string $otherUserId)
    {
        $user_id = Auth::user();

        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $user = User::find($user_id);

        if (!ctype_digit($otherUserId)) {
            return response()->json([
                'success' => false,
                'message' => 'A valid user id is required'
            ], 422);
        }

        $otherUser = User::find($otherUserId);

        if (!$otherUser) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        if ($otherUser->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'A conversation with yourself is not allowed'
            ], 422);
        }

        $conversation = DB::transaction(function () use ($user, $otherUser) {
            $conversation = $user->conversations()
                ->whereHas('users', fn($query) => $query->where('users.id', $otherUser->id))
                ->first();

            if (!$conversation) {
                $conversation = Conversation::create();
                $conversation->users()->attach([$user->id, $otherUser->id]);
            }

            return $conversation;
        });

        $conversation->load([
            'users' => fn($query) => $query->where('users.id', '!=', $user->id),
            'latestMessage',
        ])->loadCount([
            'messages as unread' => fn($query) => $query
                ->where('sender_id', '!=', $user->id)
                ->where('is_read', false),
        ]);

        return response()->json([
            'success' => true,
            'conversation' => $this->conversationPayload($conversation),
        ]);
    }

    private function conversationPayload(Conversation $conversation): array
    {
        $otherUser = $conversation->users->first();
        $latestMessage = $conversation->latestMessage;
        $user = $otherUser ? [
            'id' => $otherUser->id,
            'name' => $otherUser->name,
            'username' => $otherUser->username,
            'avatar_url' => $otherUser->avatar_url,
            'online' => (bool) ($otherUser->online ?? false),
        ] : null;

        return [
            'id' => $conversation->id,
            'name' => $otherUser?->name ?? '',
            'avatar_url' => $otherUser?->avatar_url,
            'latest_message' => $latestMessage,
            'time' => $latestMessage?->created_at?->toIso8601String() ?? '',
            'online' => (bool) ($otherUser?->online ?? false),
            'user' => $user,
            'unread' => (int) ($conversation->unread ?? 0),
            'created_at' => $conversation->created_at,
            'updated_at' => $conversation->updated_at,
        ];
    }
}
