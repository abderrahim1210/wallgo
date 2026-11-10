<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Mail;

class ForgotPassword extends Controller
{
    public function send_link(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Email not exist in our system'
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        $token = Password::createToken($user);

        $url = "https://www.pixora.test/reset-password?token=" . $token . "&email=" . urlencode($user->email);

        Mail::to($user->email)->send(new ResetPasswordMail($url));

        return response()->json(['success' => true, 'message' => 'Link sent successfully']);
    }
}
