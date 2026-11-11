<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class Settings extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'visibility' => ['nullable', 'string', 'in:public,private'],
            'currentPassword' => ['nullable', 'string', 'min:6'],
            'password' => ['nullable', 'string', 'min:6'],
            'emails_likes_notifications' => ['nullable', 'boolean'],
            'new_follower_alerts' => ['nullable', 'boolean']
        ]);
        $user = User::findOrFail(Auth::id());
        if (!$user) return response()->json(['success' => false, 'message' => 'User unauthorized'], 401);

        try {
            if (empty($request->visibility) && empty($request->password) && empty($request->currentPassword)) {
                return response()->json([
                    'success' => true,
                    'message' => 'No updates detected'
                ]);
            }

            if (!empty($request->password)) {
                if (empty($request->currentPassword)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Current password is required to set a new password',
                    ], 422);
                }

                if (!Hash::check($request->currentPassword, $user->password)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Current password does not match',
                    ], 422);
                }
                $user->password = Hash::make($request->string('password'));
            }

            $user->fill($request->only([
                'visibility',
                'emails_likes_notifications',
                'new_follower_alerts'
            ]));

            if ($request->has('visibility')) {
                $user->visibility = $request->visibility;
            }

            if ($request->has('emails_likes_notifications') && (bool)$user->emails_likes_notifications !== (bool)$request->emails_likes_notifications) {
                $user->emails_likes_notifications = $request->emails_likes_notifications;
            }

            if ($request->has('new_follower_alerts') && (bool)$user->new_follower_alerts !== (bool)$request->new_follower_alerts) {
                $user->new_follower_alerts = $request->new_follower_alerts;
            }

            if ($user->isDirty()){
                $user->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Settings updated successfully',
                ]);
            }else{
                return response()->json([
                    'success' => false,
                    'message' => 'No updates change it'
                ]);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Update settings failed : " . $e->getMessage(),
            ], 500);
        }
    }
}
