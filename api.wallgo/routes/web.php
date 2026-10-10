<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\GetUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/user', function () {
    $user = Auth::user();
    if (!$user) {
        return response()->json(['success' => false], 401);
    }
    return response()->json(['success' => true, 'user' => [
        'id' => $user->id,
        'email' => $user->email,
        'username' => $user->username,
        'photo_profile' => $user->photo_profile,
        'role' => $user->role,
        'status' => $user->status
    ]]);
});

Route::get('/get_user', [GetUser::class, 'index']);

Route::middleware('auth:sanctum', 'CheckUserStatus')->group(function () {});


require __DIR__ . '/auth.php';
