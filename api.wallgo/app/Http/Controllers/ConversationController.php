<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
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
