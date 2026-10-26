<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UpdatePageGroup extends Controller
{
    public function update(Request $request, string $id)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'You need to login first for upload a photo'
            ], 401);
        }

        $user_id = Auth::id();

        $obj = null;
        switch ($request->type) {
            case 'pages':
                $obj = Page::find($id);
                if (!$obj) return response()->json(['success' => false, 'message' => "Page by id $id not found"]);
                break;
            case 'groups':
                $obj = Group::find($id);
                if (!$obj) return response()->json(['success' => false, 'message' => "Group by id $id not found"]);
                break;
        }
        if (!$obj) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch the object'
            ], 500);
        }

        if ($obj->owner_id !== $user_id) {
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
            'category' => ['nullable', 'string'],
            'visibility' => ['nullable', 'string', 'in:public,private']
        ]);
        try {
            $validator = new \App\Http\Controllers\ValidePageLogoBanner();
            $cloudinary = new \App\Http\Controllers\CloudinaryActions();
            if ($request->filled('logo_url') && str_starts_with($request->logo_url, 'data:image')) {
                $uploadedLogoUrl = $validator->valide($request->logo_url, 'wallgo_pages_logo_url');
                if ($uploadedLogoUrl) {
                    if ($obj->logo_url) {
                        $cloudinary->destroy($obj->logo_url, 'wallgo_pages_logo_url/');
                    }
                    $obj->logo_url = $uploadedLogoUrl;
                }
            }

            if ($request->filled('banner_url') && str_starts_with($request->banner_url, 'data:image')) {
                $uploadedBannerUrl = $validator->valide($request->banner_url, 'wallgo_pages_banner_url');
                if ($uploadedBannerUrl) {
                    if ($obj->banner_url) {
                        $cloudinary->destroy($obj->banner_url, 'wallgo_pages_banner_url/');
                    }
                    $obj->banner_url = $uploadedBannerUrl;
                }
            }

            $obj->fill($request->only([
                'name',
                'description',
                'category',
                'visibility'
            ]));

            if ($request->filled('name')) {
                $obj->name = $request->name;
            }

            if ($request->has('description')) {
                $obj->description = $request->description;
            }

            if ($request->filled('category')) {
                $obj->category = $request->category;
            }

            if ($request->filled('visibility')) {
                $obj->visibility = $request->visibility;
            }

            if ($obj->isDirty()) {
                $obj->save();

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
}
