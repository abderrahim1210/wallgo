<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EditProfile;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\ForgotPassword;
use App\Http\Controllers\GetUser;
use App\Http\Controllers\GetUsers;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\Like as ControllersLike;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Post;
use App\Http\Controllers\ReelController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Settings;
use App\Http\Controllers\UpdatePageGroup;
use App\Models\Group;
use App\Models\Notification;
use App\Models\Page;
use App\Models\Post as ModelsPost;
use App\Models\Search;
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
        'visibility' => $user->visibility,
        'emails_likes_notifications' => $user->emails_likes_notifications,
        'new_follower_alerts' => $user->new_follower_alerts
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

    Route::post('/send_report', [ReportController::class, 'send']);

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

    Route::get('/comments/{type?}/{id}', [CommentController::class, 'index']);

    Route::post('/comments/create', [CommentController::class, 'create']);

    Route::get('/my_posts', [GetUser::class, 'getPosts']);

    Route::get('/get_posts/{id?}', [GetUser::class, 'getPosts']);

    Route::get('/pages', [PageController::class, 'index']);

    Route::get('/groups', [GroupController::class, 'index']);

    Route::post('/pages/create', [PageController::class, 'store']);

    Route::post('/groups/create', [GroupController::class, 'store']);

    Route::put('/pages/{id}', [UpdatePageGroup::class, 'update']);
    Route::put('/groups/{id}', [UpdatePageGroup::class, 'update']);

    Route::post('/pages/follow', [PageController::class, 'follow']);

    Route::get('/get_my_pages', function () {
        $user_id = Auth::id();
        $pages = Page::select('id', 'owner_id', 'name')->where('owner_id', $user_id)->get();
        return response()->json([
            'success' => true,
            'pages' => $pages
        ]);
    });

    Route::get('/get_my_groups', function () {
        $user_id = Auth::id();
        $groups = Group::select('id', 'owner_id', 'name')->where('owner_id', $user_id)->get();
        return response()->json([
            'success' => true,
            'groups' => $groups
        ]);
    });

    Route::delete('/pages/{id}', [PageController::class, 'destroy']);

    Route::delete('/groups/{id}', [GroupController::class, 'destroy']);

    Route::get('/post_preview/{id}', function ($id) {
        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => "Id required for return informations"
            ], 404);
        }
        $user_id = Auth::id();

        try {
            $post = ModelsPost::withCount(['likes', 'comments'])->with(['user:id,username,name,avatar_url', 'postable:id,name,logo_url'])->withExists(['likes as is_liked' => function ($query) use ($user_id) {
                $query->where('user_id', $user_id);
            }])->withExists(['bookmarks as is_saved' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->find($id);
            if (!$post) {
                return response()->json([
                    'success' => false,
                    'message' => "Post by id $id not found"
                ], 404);
            }

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

    Route::post('/post/save', [BookmarkController::class, 'save']);

    Route::get('/posts/saved', [BookmarkController::class, 'index']);

    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    Route::get('/search', [SearchController::class, 'search']);

    Route::prefix('/reels')->group(function () {

        Route::post('/create', [ReelController::class, 'create']);

        Route::put('/{id}/edit', [ReelController::class, 'update']);

        Route::get('/', [ReelController::class, 'index']);

        Route::get('/{id}', [ReelController::class, 'show']);

        Route::get('/{id}/preview', [ReelController::class, 'preview']);

        Route::delete('/{id}', [ReelController::class, 'destroy']);

        Route::post('/{id}/view', [ReelController::class, 'incrementViews']);
    });

    Route::get('/searches', function () {
        $results = Search::where('searchs_count', '>=', 100)->limit(3)->get();
        return response()->json([
            'success' => true,
            'searches' => $results
        ]);
    });

    Route::get('/notifications', [NotificationController::class, 'index']);

    Route::get('/notifications/all', [NotificationController::class, 'all']);

    Route::post('/notifications/is_read/{type?}', [NotificationController::class, 'mark_as_read']);

    Route::get('/check_follow_group', [GroupController::class, 'checkFollow']);

    Route::post('/send_request', [GroupController::class, 'send_req']);

    Route::get('/groups/requests', [GroupController::class, 'requests']);

    Route::post('/request/change_status', [GroupController::class, 'changeStatus']);

    Route::get('/notifications/not_read', function () {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user_id = Auth::id();
        $notifications = Notification::where('notifiable_id', $user_id)->whereNull('read_at')->count();
        return response()->json([
            'success' => true,
            'notifications' => $notifications
        ]);
    });

    Route::delete('/groups/{group_id}/remove_member/{user_id}', [GroupController::class, 'removeMember']);

    Route::get('/groups/{group_id}/followers', [GroupController::class, 'followers']);

    Route::delete('/groups/{group_id}/{post_id}', [GroupController::class, 'deletePost']);

    Route::delete('/groups/delete_reel/{id}/{reel_id}/{type}', [GroupController::class, 'deleteReel']);

    Route::delete('/pages/delete_comment/{page_id}/{comment_id}', [PageController::class, 'deleteComment']);

    Route::get('/last_searches', [SearchController::class, 'get_searches']);

    Route::delete('/searches/{id}', [SearchController::class, 'deleteTerm']);
});
Route::post('/send_link_email', [ForgotPassword::class, 'send_link']);

Route::post('/reset_password', [NewPasswordController::class, 'store']);

Route::get('/pages/{id}', [PageController::class, 'show']);

Route::get('/groups/{id}', [GroupController::class, 'show']);

Route::get('/groups/{id}/posts', [GroupController::class, 'posts']);

Route::get('/pages/{id}/posts', [PageController::class, 'posts']);

Route::get('/groups/{id}/reels', [GroupController::class, 'reels']);

Route::get('/test', function () {
    return view('vendor.emails.ResetYourPassword');
});

require __DIR__ . '/auth.php';
