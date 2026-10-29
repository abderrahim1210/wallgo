<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Page;
use App\Models\Post;
use App\Models\Search;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $user_id = Auth::id();
        if (!$user_id) return response()->json(['success' => false, 'message' => 'User not authenticated'], 401);
        $request->validate([
            'type' => ['string', 'in:all,posts,users,groups,pages,tags'],
            'term' => ['string', 'max:255']
        ]);

        try {
            $term = trim($request->term);
            $type = $request->type ?? 'all';

            if (!empty($term)) {
                $searchTypeTerm = str_starts_with($term, '#') ? 'hashtag' : 'keyword';
                Search::updateOrCreate([
                    'term' => strtolower($term),
                    'type' => $searchTypeTerm
                ])->increment('searchs_count');
            }

            $response = ['success' => true];
            if (in_array($type, ['all', 'posts'])) {
                $posts = Post::with(['user:id,username,name,avatar_url'])->select('id', 'content', 'user_id', 'media_url', 'schedule_time', 'created_at', 'visibility')->withCount(['likes', 'comments'])->withExists(['likes as is_liked' => function ($q) use ($user_id) {
                    $q->where('user_id', $user_id);
                }])->withExists(['bookmarks as is_saved' => function ($q) use ($user_id) {
                    $q->where('user_id', $user_id);
                }])->where('content', 'ILIKE', "%{$term}%")->where(function ($q) {
                    $q->whereNull('schedule_time')->orWhere('schedule_time', '<=', now());
                })->latest()->paginate(10);

                $response['posts'] = $posts;
            }

            if (in_array($type, ['all', 'users'])) {
                $users = User::withCount('followers')->select('id', 'name', 'username', 'avatar_url')->withExists(['followers as is_following' => function ($q) use ($user_id) {
                    $q->where('follower_id', $user_id);
                }])->where('name', 'ILIKE', "%{$term}%")->orWhere('name', 'ILIKE', "%{$term}%")->paginate(10);
                $response['users'] = $users;
            }

            if (in_array($type, ['all', 'pages'])) {
                $pages = Page::withCount(['followers'])->withExists(['followers as is_followed' => function ($q) use ($user_id) {
                    $q->where('user_id', $user_id);
                }])->where('name', 'ILIKE', "%{$term}%")->paginate(10);
                $response['pages'] = $pages;
            }

            if (in_array($type, ['all', 'groups'])) {
                $groups = Group::withCount('followers')->withExists(['followers as is_followed' => function ($q) use ($user_id) {
                    $q->where('user_id', $user_id);
                }])->where('name', 'ILIKE', "%{$term}%")->paginate(10);
                $response['groups'] = $groups;
            }

            if (in_array($type, ['tags'])) {
                $tags = Search::where('type', 'hashtag')->where('term', 'ILIKE', "%{$term}%")->orderBy('searchs_count', 'desc')->paginate(10);
                $response['tags'] = $tags;
            }

            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed : ' . $e->getMessage()
            ], 500);
        }
    }
}
