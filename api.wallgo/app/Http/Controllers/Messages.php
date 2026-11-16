<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Messages extends Controller
{
    public function send(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user_id = Auth::id();
        $request->validate([
            'content' => ['nullable', 'string'],
            'media_url' => ['nullable', 'string'],
            'conversation_id' => ['required', 'numeric', 'exists:conversations,id']
        ]);

        $conversation = Conversation::find((int) $request->conversation_id);
        try {
            Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $user_id,
                'content' => trim($request->content),
                'is_read' => false
            ]);

            return response()->json([
                'success' => true,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }


    public function messages(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ]);
        }

        $user_id = (int) Auth::id();
        
        $request->validate([
            'conversation_id' => ['required', 'numeric', 'exists:conversations,id']
        ]);

        $conversation = Conversation::find((int) $request->conversation_id);
        try {
            $messages = $conversation->messages()->orderBy('created_at', 'asc')->get()->map(function ($message) use ($user_id){
                return [
                    'id' => $message->id,
                    'sender_id' => (int) $message->sender_id,
                    'sender' => (int) $message->sender_id === $user_id ? 'me' : 'them',
                    'content' => $message->content,
                    'time' => $message->created_at->format('H:i')
                ];
            });
            return response()->json([
                'success' => true,
                'messages' => $messages
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }
}
