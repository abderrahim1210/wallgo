<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EditProfile;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\GetUser;
use App\Http\Controllers\GetUsers;
use App\Http\Controllers\Like as ControllersLike;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Post;
use App\Http\Controllers\Settings;
use App\Models\Page;
use App\Models\Post as ModelsPost;
use App\Models\User;
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

Route::get('/get_user/{id?}', [GetUser::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/edit_profile', [EditProfile::class, 'edit']);

    Route::post('/settings', [Settings::class, 'update']);

    Route::post('/posts/create', [Post::class, 'create']);

    Route::put('/posts/{id}/update', [Post::class, 'update']);

    Route::get('/posts', [Post::class, 'index']);

    Route::get('/post/{id}', function ($id) {
        if (empty($id)) {
            return response()->json([
                'success' => false,
                'message' => 'Post id required'
            ]);
        }
        try {
            $post = ModelsPost::findOrFail($id);
            return response()->json([
                'success' => true,
                'post' => $post
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    });

    Route::delete('/posts/{id}', [Post::class, 'destroy']);

    Route::post('/posts/send_report', [Post::class, 'report']);

    Route::get('/get_suggested_users', [GetUsers::class, 'get']);

    Route::post('/add_follow', [FollowController::class, 'add_follow']);

    Route::get('/check_follow/{id}', [FollowController::class, 'checkFollow']);

    Route::delete('/logout', [AuthenticatedSessionController::class, 'destroy']);

    Route::get('/follows', function () {
        $user_id = Auth::id();
        $follows = User::find($user_id)->followings;
        return response()->json([
            'follows' => $follows
        ]);
    });

    Route::post('/add_like', [ControllersLike::class, 'create']);

    Route::get('/comments/{post_id}', [CommentController::class, 'index']);

    Route::post('/comments/create', [CommentController::class, 'create']);

    Route::get('/my_posts', [GetUser::class, 'getPosts']);

    Route::get('/pages', [PageController::class, 'index']);

    Route::post('/pages/create', [PageController::class, 'store']);

    Route::put('/pages/{id}', [PageController::class, 'update']);

    Route::post('/pages/follow', [PageController::class, 'follow']);

    Route::get('/get_my_pages', function () {
        $user_id = Auth::id();
        $pages = Page::select('id', 'owner_id', 'name')->where('owner_id', $user_id)->get();
        return response()->json([
            'success' => true,
            'pages' => $pages
        ]);
    });
});

Route::get('/pages/{id}', [PageController::class, 'show']);

require __DIR__ . '/auth.php';
