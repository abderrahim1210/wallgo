<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\EditProfile;
use App\Http\Controllers\GetUser;
use App\Http\Controllers\Post;
use App\Http\Controllers\Settings;
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
        'name' => $user->name,
        'avatar_url' => $user->avatar_url,
        'visibility' => $user->visibility
    ]]);
});

Route::get('/get_user', [GetUser::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/edit_profile', [EditProfile::class, 'edit']);

    Route::post('/settings', [Settings::class, 'update']);

    Route::post('/posts/create', [Post::class, 'create']);

    Route::get('/posts', [Post::class, 'index']);
});


require __DIR__ . '/auth.php';
