<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\GroupPageFollow;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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

            Group::create([
                'owner_id' => $user_id,
                'name' => $request->name,
                'description' => $request->description,
                'logo_url' => $logo,
                'banner_url' => $banner,
                'type' => $request->type
            ]);

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
            if ($user_id !== $group->owner_id){
                $joined = GroupPageFollow::where('user_id',$user_id)->where('followable_id',$group->id)->first();
                if ($joined) $isJoined = true;
            }
            $posts = Post::withCount(['likes', 'comments'])->with(['user:id,name,username,avatar_url', 'postable:id,name,logo_url'])->withExists(['likes as is_liked' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->withExists(['user as is_owner' => function ($q) use ($user_id) {
                $q->where('id', $user_id);
            }])->withExists(['bookmarks as is_saved' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->where('postable_id', $group->id)->when($user_id !== $group->owner_id, function ($q) {
                $q->where(function ($subQuery) {
                    $subQuery->whereNull('schedule_time')->orWhere('schedule_time', '<=', now());
                });
            })->get();
            return response()->json([
                'success' => true,
                'group' => $group,
                'is_joined' => $isJoined,
                'posts' => $posts
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
            $posts = Post::withCount(['likes', 'comments'])->with(['user:id,name,username,avatar_url', 'postable:id,name,logo_url'])->withExists(['likes as is_liked' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->withExists(['user as is_owner' => function ($q) use ($user_id) {
                $q->where('id', $user_id);
            }])->withExists(['bookmarks as is_saved' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->where('postable_id', $group->id)->when($user_id !== $group->owner_id, function ($q) {
                $q->where(function ($subQuery) {
                    $subQuery->whereNull('schedule_time')->orWhere('schedule_time', '<=', now());
                });
            })->latest()->paginate(10);
            return response()->json([
                'success' => true,
                'posts' => $posts
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
}
