<?php

namespace App\Http\Controllers;

use App\Models\Page;
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
            $my_pages = Page::where('owner_id', $user_id)->get();
            $pages = Page::where('owner_id', '!=', $user_id)->get();
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

        try {
            $page = Page::with(['owner'])->withCount(['followers'])->find($id);
            if (!$page) return response()->json(['success' => false, 'message' => "Page by id $id not found"], 404);
            return response()->json([
                'success' => true,
                'page' => $page
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
