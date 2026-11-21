<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Cloudinary\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
            'public_id' => ['nullable', 'string']
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
        $public_id = $data['public_id'] ?? null;

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
            'public_id' => $public_id

        ]);
        $conversation->touch();

        broadcast(new MessageSent($this->messagePayload($message, (int) $user->id), (int) $conversation->id))->toOthers();

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
            'conversation_id' => $message->conversation_id,
            'is_read' => (bool) $message->is_read,
            'time' => $message->created_at?->format('H:i') ?? '',
            'can_edit' => $message->created_at ? abs($message->created_at->diffInMinutes(now())) <= 45 : false,
            'created_at' => $message->created_at,
            'updated_at' => $message->updated_at,
            'edited' => (bool) $message->edited
        ];
    }

    public function update(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user_id = Auth::id();
        $request->validate([
            'message_id' => ['required', 'numeric', 'exists:messages,id'],
            'content' => ['required', 'string']
        ]);

        $message = Message::where('sender_id', $user_id)->findOrFail((int) $request->message_id);
        try {
            $content = trim($request->content);
            if ($message->content !== $content) {
                $message->update([
                    'content' => $content,
                    'edited' => true,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Message edited successfully'
                ], 200);
            }

            return response()->json([
                'success' => true,
                'message' => 'Nothing to update'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'Id required'
            ]);
        }

        $id = (int) $id;
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user_id = Auth::id();
        $message = Message::where('sender_id', $user_id)->findOrFail($id);
        try {
            if ($message->media_url) {
                $cloudinary = new Cloudinary([
                    'cloud' => [
                        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                        'api_key'    => env('CLOUDINARY_API_KEY'),
                        'api_secret' => env('CLOUDINARY_API_SECRET'),
                    ],
                    'url' => [
                        'secure' => true
                    ]
                ]);

                $cloudinary->uploadApi()->destroy($message->public_id);
            }
            $message->delete();
            return response()->json([
                'success' => true,
                'message' => 'Message deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }
}
