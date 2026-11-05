<?php

namespace App\Http\Controllers;

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
            'success' => false,
            'notifications' => $notifications
        ], 200);
    }
}
