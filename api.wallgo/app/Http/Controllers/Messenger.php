<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class Messenger extends Controller
{
    public function index()
    {
        $user_id = Auth::id();

        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user = User::find($user_id);

        $conversations = $user->conversations()
            ->wherePivotNull('deleted_at')
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
            'theme' => DB::table('conversation_user')->where('user_id',Auth::id())->where('conversation_id',$conversation->id)->value('theme')
        ];
    }

    public function read_conversation(Request $request)
    {
        $request->validate([
            'conversation_id' => ['required', 'integer', 'exists:conversations,id']
        ]);

        Message::where('conversation_id', $request->conversation_id)->where('sender_id', '!=', Auth::id())->where('is_read', false)->update(['is_read' => true]);
        return response()->json([
            'success' => true,
        ], 200);
    }

    public function change_theme(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user_id = Auth::id();

        $allowedWallpapers = [
            'chat-bg-classic-full.webp',
            'chat-bg-classic-tile.webp',
            'chat-bg-lavender-full.webp',
            'chat-bg-mint-full.webp',
            'chat-bg-rose-full.webp',
            'chat-bg-sand-full.webp',
            'chat-bg-sky-full.webp',
            'chat-bg-dark-full.webp',
            'chat-bg-dark-purple-full.webp',
            'chat-bg-dark-teal-full.webp',
        ];
        $request->validate([
            'conversation_id' => ['required', 'numeric', 'exists:conversations,id'],
            'theme' => ['nullable', 'string', 'max:255', 'not_regex:/[\/\\\\]|\.\./', Rule::in($allowedWallpapers)]
        ]);

        $conversation = Conversation::findOrFail((int) $request->conversation_id);
        $isParticipant = $conversation->users()->where('users.id', $user_id)->first();
        if (!$isParticipant) {
            return response()->json([
                'success' => false,
                'message' => 'You dont have permission for change the theme of this conversation'
            ], 403);
        }

        if ($conversation->theme !== $request->theme) {
            try {
                DB::table('conversation_user')->where('user_id',$user_id)->where('conversation_id',$conversation->id)->update([
                    'theme' => $request->theme
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Theme updated successfully'
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed : ' . $e->getMessage()
                ], 500);
            }
        } else {
            return response()->json([
                'success' => false
            ]);
        }
    }
}
