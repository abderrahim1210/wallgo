<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\GroupPageFollow;
use App\Models\Page;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user_id = Auth::id();
        try {
            $my_pages = Page::withCount(['followers'])->where('owner_id', $user_id)->get();
            $pages = Page::withCount(['followers'])->withExists(['followers as is_followed' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->where('owner_id', '!=', $user_id)->get();
            return response()->json([
                'success' => true,
                'my_pages' => $my_pages,
                'pages' => $pages
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
        $user = Auth::user();
        if (!$user) return response()->json([
            'success' => false,
            'message' => 'User not found'
        ], 401);
        $request->validate([
            'name' => ['string', 'required', 'max:100'],
            'description' => ['string', 'max:355'],
            'category' => ['string', 'required', 'in:technoloy,photography,business,education,entertainment,personal_blog']
        ]);
        try {
            $validator = new \App\Http\Controllers\ValidePageLogoBanner();
            $logo = null;
            if (!empty($request->logo_url)) {
                $logo = $validator->valide($request->logo_url, 'wallgo_pages_logo_url');
            }

            $banner = null;
            if (!empty($request->banner_url)) {
                $banner = $validator->valide($request->banner_url, 'wallgo_pages_banner_url');
            }
            Page::create([
                'owner_id' => $user->id,
                'name' => $request->name,
                'description' => $request->description,
                'logo_url' => $logo,
                'banner_url' => $banner,
                'category' => $request->category,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Page created successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
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
            $page = Page::with(['owner'])->withCount(['followers'])->withExists(['followers as is_followed' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->find($id);
            if (!$page) return response()->json(['success' => false, 'message' => "Page by id $id not found"], 404);
            $posts = Post::withCount(['likes', 'comments'])->with(['user:id,name,username,avatar_url', 'postable:id,name,logo_url'])->withExists(['likes as is_liked' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->withExists(['user as is_owner' => function ($q) use ($user_id) {
                $q->where('id', $user_id);
            }])->where('postable_id', $page->id)->get();
            return response()->json([
                'success' => true,
                'page' => $page,
                'posts' => $posts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
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

        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'You need to login first for upload a photo'
            ], 401);
        }

        $user_id = Auth::id();

        $page = Page::find($id);
        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found'
            ]);
        }

        if ($page->owner_id !== $user_id) {
            return response()->json([
                'success' => false,
                'message' => "You don't have a permission for edit this page"
            ]);
        }

        $request->validate([
            'name' => ['nullable', 'string', 'max:155'],
            'description' => ['nullable', 'string', 'max:355'],
            'logo_url' => ['nullable', 'string'],
            'banner_url' => ['nullable', 'string'],
            'category' => ['nullable', 'string']
        ]);
        try {
            $validator = new \App\Http\Controllers\ValidePageLogoBanner();
            $cloudinary = new \App\Http\Controllers\CloudinaryActions();
            if ($request->filled('logo_url') && str_starts_with($request->logo_url, 'data:image')) {
                $uploadedLogoUrl = $validator->valide($request->logo_url, 'wallgo_pages_logo_url');
                if ($uploadedLogoUrl) {
                    if ($page->logo_url) {
                        $cloudinary->destroy($page->logo_url, 'wallgo_pages_logo_url/');
                    }
                    $page->logo_url = $uploadedLogoUrl;
                }
            }

            if ($request->filled('banner_url') && str_starts_with($request->banner_url, 'data:image')) {
                $uploadedBannerUrl = $validator->valide($request->banner_url, 'wallgo_pages_banner_url');
                if ($uploadedBannerUrl) {
                    if ($page->banner_url) {
                        $cloudinary->destroy($page->banner_url, 'wallgo_pages_banner_url/');
                    }
                    $page->banner_url = $uploadedBannerUrl;
                }
            }

            $page->fill($request->only([
                'name',
                'description',
                'category'
            ]));

            if ($request->filled('name')) {
                $page->name = $request->name;
            }

            if ($request->has('description')) {
                $page->description = $request->description;
            }

            if ($request->filled('category')) {
                $page->category = $request->category;
            }
            // $page->logo_url = $logo ?? $page->logo_url;
            // $page->banner_url = $banner ?? $page->banner_url;

            if ($page->isDirty()) {
                $page->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Page updated successfully'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update informations for this page'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
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

        $page = Page::find($id);
        if (!$page) return response()->json(['success' => false, 'message' => 'Page by this id not found']);
        try {
            $cloudinary = new \App\Http\Controllers\CloudinaryActions();
            if ($page->logo_url) {
                $cloudinary->destroy($page->logo_url, 'wallgo_pages_logo_url/');
            }

            if ($page->banner_url) {
                $cloudinary->destroy($page->banner_url, 'wallgo_pages_banner_url/');
            }
            $page->delete();
            return response()->json([
                'success' => true,
                'message' => 'Page deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }


    public function follow(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 401);
        }

        $user_id = Auth::id();
        $type = $request->type;
        $followable = null;

        switch ($type) {
            case 'page':
                $followable = Page::find($request->entity_id);
                if (!$followable) return response()->json(['success' => false, 'message' => 'Page by this id not found']);
                break;
            case 'group':
                $followable = Group::find($request->entity_id);
                if (!$followable) return response()->json(['success' => false, 'message' => 'Group by this id not found']);
                break;
        }
        try {
            $existingFollow = GroupPageFollow::where('user_id', $user_id)->where('followable_id', $followable->id)->where('followable_type', get_class($followable))->first();
            if ($existingFollow) {
                $existingFollow->delete();
                return response()->json([
                    'success' => true,
                    'message' => 'Follow removed successfully',
                    'is_followed' => false
                ]);
            } else {
                GroupPageFollow::create([
                    'user_id' => $user_id,
                    'followable_id' => $followable->id,
                    'followable_type' => get_class($followable)
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Follow added successfully',
                    'is_followed' => true
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ]);
        }
    }
}
