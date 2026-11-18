<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Notifications\NewMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Messages extends Controller
{
    public function send(Request $request)
    {
        $user_id = Auth::id();

        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized',
            ], 401);
        }

        $user = User::find($user_id);

        $data = $request->validate([
            'content' => ['nullable', 'string', 'max:10000', 'required_without:media_url'],
            'media_url' => ['nullable', 'url', 'max:2048', 'required_without:content'],
            'conversation_id' => ['required', 'integer', 'exists:conversations,id'],
        ]);

        $conversation = $user->conversations()->whereKey($data['conversation_id'])->first();

        if (!$conversation) {
            return response()->json([
                'success' => false,
                'message' => 'You are not a participant in this conversation',
            ], 403);
        }

        $content = trim($data['content'] ?? '');
        $mediaUrl = $data['media_url'] ?? null;

        if ($content === '' && !$mediaUrl) {
            return response()->json([
                'success' => false,
                'message' => 'A message or attachment is required',
            ], 422);
        }

        $message = $conversation->messages()->create([
            'sender_id' => $user->id,
            'content' => $content,
            'media_url' => $mediaUrl,
            'is_read' => false,
        ]);
        $conversation->touch();

        $user->notify(new NewMessage($user, $message));

        return response()->json([
            'success' => true,
            'message' => $this->messagePayload($message, (int) $user->id),
        ], 201);
    }

    public function messages(Request $request)
    {
        $user_id = Auth::id();

        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized',
            ], 401);
        }

        $user = User::find($user_id);

        $data = $request->validate([
            'conversation_id' => ['required', 'integer', 'exists:conversations,id'],
        ]);

        $conversation = $user->conversations()->whereKey($data['conversation_id'])->first();

        if (!$conversation) {
            return response()->json([
                'success' => false,
                'message' => 'You are not a participant in this conversation',
            ], 403);
        }

        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = $conversation->messages()
            ->orderBy('created_at')
            ->orderBy('id')
            ->get()
            ->map(fn(Message $message) => $this->messagePayload($message, (int) $user->id));

        return response()->json([
            'success' => true,
            'messages' => $messages,
        ]);
    }

    private function messagePayload(Message $message, int $currentUserId): array
    {
        return [
            'id' => $message->id,
            'sender_id' => (int) $message->sender_id,
            'sender' => (int) $message->sender_id === $currentUserId ? 'me' : 'them',
            'content' => $message->content,
            'image' => $message->media_url,
            'media_url' => $message->media_url,
            'is_read' => (bool) $message->is_read,
            'time' => $message->created_at?->format('H:i') ?? '',
            'created_at' => $message->created_at,
        ];
    }
}
