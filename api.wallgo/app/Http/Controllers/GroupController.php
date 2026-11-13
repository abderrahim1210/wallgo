<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\GroupJoinRequest;
use App\Models\GroupPageFollow;
use App\Models\GroupQuestion;
use App\Models\Post;
use App\Models\Reel;
use App\Models\User;
use App\Notifications\ChangeStatusRequest;
use App\Notifications\FollowPageGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\AlertDeletePostFromOwner;
use Cloudinary\Cloudinary;
use App\Models\Page;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user_id = Auth::id();
        try {
            $my_groups = Group::withCount(['followers'])->where('owner_id', $user_id)->get();
            $groups = Group::withCount(['followers'])->withExists(['followers as is_followed' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->where('owner_id', '!=', $user_id)->get();
            return response()->json([
                'success' => true,
                'my_groups' => $my_groups,
                'groups' => $groups
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user_id = Auth::id();
        if (!$user_id) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        $request->validate([
            'name' => ['string', 'max:155'],
            'description' => ['nullable', 'string', 'max:355'],
            'type' => ['string', 'in:public,private'],
            'question' => ['nullable', 'string', 'max:355']
        ]);
        try {
            $validator = new \App\Http\Controllers\ValidePageLogoBanner();
            $logo = null;
            if (!empty($request->logo_url)) {
                $logo = $validator->valide($request->logo_url, 'wallgo_groups_logo_url');
            }

            $banner = null;
            if (!empty($request->banner_url)) {
                $banner = $validator->valide($request->banner_url, 'wallgo_groups_banner_url');
            }

            $group = Group::create([
                'owner_id' => $user_id,
                'name' => $request->name,
                'description' => $request->description,
                'logo_url' => $logo,
                'banner_url' => $banner,
                'visibility' => $request->type
            ]);

            if (!empty($request->question)) {
                GroupQuestion::create([
                    'group_id' => $group->id,
                    'question' => $request->question
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Group created successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'Id is required for show page'
            ]);
        }

        $user_id = Auth::id();
        try {
            $group = Group::with(['owner'])->withCount(['followers'])->withExists(['followers as is_followed' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->find($id);
            if (!$group) return response()->json(['success' => false, 'message' => "Group by id $id not found"], 404);
            $isJoined = false;
            if ($user_id !== $group->owner_id) {
                $joined = GroupPageFollow::where('user_id', $user_id)->where('followable_id', $group->id)->exists();
                if ($joined) $isJoined = true;
            } else {
                $isJoined = true;
            }

            $question = GroupQuestion::select('id', 'group_id', 'question')->where('group_id', $group->id)->first();
            return response()->json([
                'success' => true,
                'group' => $group,
                'is_joined' => $isJoined,
                'question' => $question
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }

    public function posts(string $id)
    {
        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'Id is required for show page'
            ]);
        }

        $user_id = Auth::id();

        try {
            $group = Group::find($id);
            if (!$group) return response()->json(['success' => false, 'message' => "Group by id $id not found"], 404);
            $posts = Post::withCount(['likes', 'comments'])->with(['user:id,name,username,avatar_url', 'postable:id,name,logo_url,owner_id'])->withExists(['likes as is_liked' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->withExists(['user as is_owner' => function ($q) use ($user_id) {
                $q->where('id', $user_id);
            }])->withExists(['bookmarks as is_saved' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->where('postable_id', $group->id)->where('postable_type', \App\Models\Group::class)->when($user_id !== $group->owner_id, function ($q) {
                $q->where(function ($subQuery) {
                    $subQuery->whereNull('schedule_time')->orWhere('schedule_time', '<=', now());
                });
            })->latest()->paginate(10);

            $reels = Reel::with(['user:id,username,name,avatar_url'])->withCount(['likes', 'comments'])->withExists(['user as is_owner' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->where('reelable_id', $group->id)->latest()->paginate(10);
            return response()->json([
                'success' => true,
                'posts' => $posts,
                'reels' => $reels
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }

    public function reels(string $id)
    {
        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'Id is required for show page'
            ]);
        }

        $user_id = Auth::id();

        try {
            $group = Group::find($id);
            if (!$group) return response()->json(['success' => false, 'message' => "Group by id $id not found"], 404);

            $reels = Reel::with(['user:id,username,name,avatar_url'])->withCount(['likes', 'comments'])->withExists(['user as is_owner' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->where('reelable_id', $group->id)->latest()->paginate(10);
            return response()->json([
                'success' => true,
                'reels' => $reels
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'Id not exist'
            ]);
        }

        $group = Group::find($id);
        if (!$group) return response()->json(['success' => false, 'message' => 'Group by this id not found']);
        try {
            $cloudinary = new \App\Http\Controllers\CloudinaryActions();
            if ($group->logo_url) {
                $cloudinary->destroy($group->logo_url, 'wallgo_groups_logo_url/');
            }

            if ($group->banner_url) {
                $cloudinary->destroy($group->banner_url, 'wallgo_groups_banner_url/');
            }
            $group->delete();
            return response()->json([
                'success' => true,
                'message' => 'Group deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }

    public function checkFollow(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user_id = Auth::id();
        $group_id = $request->group_id;
        $groupExist = Group::findOrFail($group_id);
        $group = GroupJoinRequest::where('user_id', $user_id)->where('group_id', $group_id)->select('id', 'user_id', 'group_id', 'status')->first();
        return response()->json([
            'success' => true,
            'status' => $group->status
        ]);
    }

    public function send_req(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User Unauthorized'
            ], 401);
        }

        $user_id = Auth::id();
        $request->validate([
            'answer' => ['string', 'required'],
            'group_id' => ['integer', 'required', 'exists:groups,id']
        ]);

        $group = Group::find($request->group_id);
        $owner = User::find($group->owner_id);
        $user = User::find($user_id);
        try {
            GroupJoinRequest::create([
                'user_id' => $user_id,
                'group_id' => $request->group_id,
                'answer' => $request->answer
            ]);


            $owner->notify(new FollowPageGroup($user, $group));
            return response()->json([
                'success' => true,
                'message' => 'Request sent successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }

    public function requests()
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ]);
        }

        $user_id = Auth::id();
        try {
            $requests = GroupJoinRequest::with(['group:id,owner_id,name,logo_url', 'user:id,username,avatar_url'])->whereHas('group', function ($q) use ($user_id) {
                $q->where('owner_id', $user_id);
            })->where('status', 'pending')->latest('created_at')->paginate(10);
            return response()->json([
                'success' => true,
                'requests' => $requests
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }

    public function changeStatus(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user_id = Auth::id();
        $request->validate([
            'group_id' => ['required', 'integer', 'exists:groups,id'],
            'request_id' => ['required', 'integer', 'exists:groups_join_requests,id'],
            'status' => ['required', 'string', 'in:accepted,rejected'],
            'user_id' => ['required', 'integer', 'exists:users,id']
        ]);

        $group = Group::where('owner_id', $user_id)->where('id', $request->group_id)->first();
        if (!$group) {
            return response()->json([
                'success' => false,
                'message' => 'Group not exist or you dont have permission for manage requests to this group.'
            ]);
        }

        try {
            $joinRequest = GroupJoinRequest::where('id', $request->request_id)->where('user_id', $request->user_id)->where('group_id', $request->group_id)->first();
            $joinRequest->update([
                'status' => $request->status
            ]);


            if ($request->status === 'accepted') {
                GroupPageFollow::firstOrCreate([
                    'user_id'         => $request->user_id,
                    'followable_id'   => $group->id,
                    'followable_type' => Group::class,
                ]);
            }
            $joinRequest->delete();
            $requester = User::findOrFail($joinRequest->user_id);

            $requester->notify(new ChangeStatusRequest($group, $request->status));

            return response()->json([
                'success' => true,
                'message' => 'Status changed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }

    public function followers($group_id)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user_id = Auth::id();

        $group = Group::findOrFail($group_id);
        $followers = $group->followers()->where('user_id', '!=', $user_id)->get();

        return response()->json([
            'success' => true,
            'followers' => $followers
        ]);
    }


    public function removeMember($group_id, $user_id)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }
        $current_user_id = Auth::id();

        if (!User::find($user_id)) {
            return response()->json([
                'success' => false,
                'message' => "User by id $user_id not found"
            ], 404);
        }

        $group = Group::where('id', $group_id)->where('owner_id', $current_user_id)->first();
        if (!$group) {
            return response()->json([
                'success' => false,
                'message' => "Group by id $group_id not found"
            ], 404);
        }

        try {
            $follow = GroupPageFollow::where('user_id', $user_id)->where('followable_id', $group_id)->where('followable_type', \App\Models\Group::class)->first();
            if ($follow) {
                $follow->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'Member deleted successfully'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Failed : " . $e->getMessage()
            ], 500);
        }
    }

    public function deletePost($group_id, $post_id)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }
        $user_id = Auth::id();
        $group = Group::findOrFail($group_id);
        $post = Post::findOrFail($post_id);
        if ($group->owner_id !== $user_id) {
            return response()->json([
                'success' => false,
                'message' => "You dont have permission for delete this post"
            ]);
        }
        try {
            if ($post->media_url) {
                $cloudinary = new \App\Http\Controllers\CloudinaryActions();
                $cloudinary->destroy($post->media_url, 'wallgo_medias/');
            }

            $user = User::find($post->user_id);
            $content = $post->content;

            $post->likes()->delete();
            $post->comments()->delete();
            $post->reports()->delete();
            $post->delete();

            $user->notify(new AlertDeletePostFromOwner($group, $content));

            return response()->json([
                'success' => true,
                'message' => 'Post deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteReel($id, $reel_id, $type)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user_id = Auth::id();
        $reelable = null;
        switch ($type) {
            case 'group':
                $reelable = Group::findOrFail($id);
                if (!$reelable) return response()->json(['success' => false, 'message' => "Group by id $id not found"]);
                break;
            case 'page':
                $reelable = Page::findOrFail($id);
                if (!$reelable) return response()->json(['success' => false, 'message' => "Page by id $id not found"]);
                break;
        }
        $reel = Reel::findOrFail($reel_id);
        if ($reelable->owner_id !== $user_id) {
            return response()->json([
                'success' => false,
                'message' => "You dont have permission for delete this post"
            ]);
        }

        if ($reel->public_id) {
            try {
                $cloudinary = new Cloudinary([
                    'cloud' => [
                        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                        'api_key'    => env('CLOUDINARY_API_KEY'),
                        'api_secret' => env('CLOUDINARY_API_SECRET'),
                    ],
                    'url' => [
                        'secure' => true
                    ]
                ]);

                $cloudinary->uploadApi()->destroy($reel->public_id, [
                    'resource_type' => 'video'
                ]);

                $content = $reel->caption;
                $user = User::find($reel->user_id);
                $reel->likes()->delete();
                $reel->comments()->delete();
                $reel->bookmarks()->delete();
                $reel->reports()->delete();
                $reel->delete();

                if ($user_id !== $user->id) {
                    $user->notify(new AlertDeletePostFromOwner($reelable, $content));
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Reel deleted successfully'
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed : ' . $e->getMessage()
                ], 500);
            }
        }
    }
}
