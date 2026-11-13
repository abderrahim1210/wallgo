<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Page;
use App\Models\Reel;
use App\Models\ReelViews;
use App\Models\User;
use Cloudinary\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReelController extends Controller
{
    public function index()
    {
        $user_id = Auth::id();
        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        try {
            $reels = Reel::with(['user:id,username,name,avatar_url', 'reelable:id,name,owner_id,logo_url'])->withCount(['likes', 'comments'])->withExists(['user as is_owner' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->withExists(['user as is_followed' => function ($q) use ($user_id) {
                $q->whereHas('followers', function ($query) use ($user_id) {
                    $query->where('follower_id', $user_id);
                });
            }])->withExists(['likes as is_liked' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->withExists(['bookmarks as is_saved' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->latest()->paginate(10);
            return response()->json([
                'success' => true,
                'reels' => $reels
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }
    public function create(Request $request)
    {
        set_time_limit(300);
        ini_set('max_execution_time', '300');
        $user_id = Auth::id();
        if (!$user_id) return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 401);

        $request->validate([
            'caption' => ['nullable', 'string', 'max:355'],
            'audio_name' => ['nullable', 'string'],
            'audio_url' => ['nullable', 'string'],
            'visibility' => ['nullable', 'string', 'in:public,private'],
            'reelable_id' => ['nullable', 'integer', 'exists:groups,id'],
            'reelable_type' => ['nullable', 'string', 'in:group'],
            'type' => ['string', 'in:group,page']
        ]);

        $type = $request->type;
        $reelable = null;
        switch ($type) {
            case 'group':
                $reelable = Group::find($request->reelable_id);
                if (!$reelable) return response()->json(['success' => false, 'message' => "Group by id $request->id not found"]);
                break;
            case 'page':
                $reelable = Page::find($request->reelable_id);
                if (!$reelable) return response()->json(['success' => false, 'message' => "Page by id $request->id not found"]);
                break;
        }

        try {
            Reel::create([
                'user_id' => $user_id,
                'video_url' => $request->video,
                'caption' => $request->caption ?? null,
                'audio_name' => $request->audio_name ?? null,
                'audio_url' => $request->audio_url ?? null,
                'visibility' => $request->visibility ?? 'public',
                'public_id' => $request->public_id,
                'reelable_id' => $request->reelable_id ?? null,
                'reelable_type' => get_class($reelable) ?? null
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Reel created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }

    public function show(string $id)
    {
        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'Id required'
            ]);
        }

        $user_id = Auth::id();
        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'User id not found'
            ], 401);
        }

        try {
            $reel = Reel::find($id);
            if (!$reel) {
                return response()->json([
                    'success' => false,
                    'message' =>  'Reel not exist'
                ]);
            }

            return response()->json([
                'success' => true,
                'reel' => $reel
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }

    public function preview(string $id)
    {
        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'Id reel required'
            ]);
        }

        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user_id = Auth::id();
        try {
            $reel = Reel::with(['user:id,username,name,avatar_url', 'comments', 'reelable:id,name,owner_id,logo_url'])->withCount(['likes', 'comments'])->withExists(['likes as is_liked' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->withExists(['user as is_owner' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->withExists(['bookmarks as is_saved' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])->withExists(['user as is_followed' => function ($q) use ($user_id) {
                $q->whereHas('followers', function ($query) use ($user_id) {
                    $query->where('follower_id', $user_id);
                });
            }])->where('id', $id)->first();
            return response()->json([
                'success' => true,
                'reel' => $reel
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail(Auth::id());
        if (!$user) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        $reel = Reel::where('id', $id)->where('user_id', $user->id)->first();
        if (!$reel) return response()->json(['success' => false, 'message' => 'Reel not found', 404]);
        $data = $request->all();
        try {
            if ($reel->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => "You don't have permission for edit this reel"
                ]);
            }
            $reel->update($data);
            return response()->json([
                'success' => true,
                'message' => 'Post updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : '  . $e->getMessage()
            ]);
        }
    }

    public function destroy(string $id)
    {
        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'Id required for delete reel'
            ], 504);
        }

        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }

        $user_id = Auth::id();
        $reel = Reel::where('id', $id)->where('user_id', $user_id)->first();
        if (!$reel) {
            return response()->json([
                'success' => false,
                'message' => 'Reel not exist or you dont have permission for delete this reel'
            ], 404);
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

                $reel->likes()->delete();
                $reel->comments()->delete();
                $reel->bookmarks()->delete();
                $reel->reports()->delete();
                $reel->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'Reel deleted successfully'
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed : ' . $e->getMessage()
                ], 500);
            }
        }
    }

    public function incrementViews($id, Request $request)
    {
        $user_id = Auth::id();
        if (!$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'User unauthorized'
            ], 401);
        }
        $reel = Reel::find($id);
        if (!$reel) {
            return response()->json([
                'success' => false,
                'message' => 'Reel not exist'
            ]);
        }

        try {
            $existingView = ReelViews::where('reel_id', $reel->id)->where('user_id', $user_id)->first();
            if (!$existingView) {
                ReelViews::create([
                    'user_id' => $user_id,
                    'reel_id' => $reel->id
                ]);
                $reel->increment('views_count');
            }


            return response()->json([
                'success' => true,
                'views_count' => $reel->fresh()->views_count
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error : ' . $e->getMessage()
            ], 500);
        }
    }
}
