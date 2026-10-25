<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function send(Request $request)
    {
        $user_id = Auth::id();
        if (!$user_id) return response()->json(['success' => false, 'message' => 'User not found'], 401);
        $request->validate([
            'reason' => ['string', 'required'],
            'description' => ['nullable', 'string']
        ]);
        try {
            $reportable = null;
            switch ($request->reportable_type) {
                case 'post':
                    $reportable = Post::select('id')->find($request->reportable_id);
                    if (!$reportable) return response()->json(['success' => false, 'message' => "Post by id $request->reportable_id not found"]);
                    break;
                case 'user':
                    $reportable = User::select('id')->find($request->reportable_id);
                    if (!$reportable) return response()->json(['success' => false, 'message' => "Post by id $request->reportable_id not found"]);
                    break;
            }

            // $reportable->reports()->create([
            //     'user_id' => $user_id,
            //     'reason' => $request->reason,
            //     'description' => $request->description
            // ]);

            Report::create([
                'user_id' => $user_id,
                'reason' => $request->reason,
                'description' => $request->description,
                'reportable_id' => $reportable->id,
                'reportable_type' => $reportable ? get_class($reportable) : null
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Report send succefully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }
}
