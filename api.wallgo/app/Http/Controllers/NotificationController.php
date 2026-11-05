<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
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
        $notifications = $user->notifications()->latest()->get();
        return response()->json([
            'success' => true,
            'notifications' => $notifications
        ], 200);
    }

    public function mark_as_read(Request $request, string $type)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        if ($type) {
            $user = User::find(Auth::id());
            $notifications = $user->notifications()->get();
            foreach ($notifications as $notif) {
                $notif->update([
                    'read_at' => now()
                ]);
            }
            return response()->json([
                'success' => true
            ],200);
        }

        $notification_id = $request->notification_id;
        if (!$notification_id) {
            return response()->json([
                'success' => false,
                'message' => 'Notification id required'
            ], 404);
        }

        $notification = Notification::where('id', $notification_id)->first();
        if ($notification) {
            $notification->update([
                'read_at' => now()
            ]);
            return response()->json([
                'success' => true,
            ], 200);
        }
    }
}
