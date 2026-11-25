<?php

namespace App\Http\Controllers;

use App\Events\UserTyping;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
    public function typing(Request $request, string $id)
    {
        $conversation = Conversation::findOrFail($id);

        if (!$conversation->users()
            ->where('users.id', Auth::id())
            ->wherePivotNull('deleted_at')
            ->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'You dont have permission to access this conversation'
            ], 403);
        }

        $validated = $request->validate([
            'is_typing' => ['required', 'boolean'],
        ]);

        broadcast(new UserTyping(
            (int) $conversation->id,
            (int) Auth::id(),
            (bool) $validated['is_typing'],
        ))->toOthers();

        return response()->json(['success' => true]);
    }

    public function destroy(string $id, string $type)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user_id = Auth::id();
        $id = (int) $id;
        $conversation = Conversation::findOrFail($id);
        try {
            if ($conversation) {
                $isParticipant = $conversation->users()->where('users.id', $user_id)->exists();
                if ($isParticipant) {
                    switch ($type) {
                        case 'everyone':
                            $conversation->messages()->delete();
                            $conversation->delete();
                            break;
                        case 'to_me':
                            $conversation->users()->updateExistingPivot($user_id, ['deleted_at' => now()]);
                            break;
                    }

                    return response()->json([
                        'success' => true,
                        'message' => 'Conversation deleted successfully'
                    ], 200);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'You dont have permission to delete this conversation'
                    ], 403);
                }
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }
}
