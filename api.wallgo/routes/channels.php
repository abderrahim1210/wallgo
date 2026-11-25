<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    return $user->conversations()
        ->whereKey($conversationId)
        ->wherePivotNull('deleted_at')
        ->exists();
});

Broadcast::channel('online', function ($user) {
    if (!$user) {
        return false;
    }
    return [
        'id' => $user->id,
        'name' => $user->name,
        'last_seen_at' => $user->last_seen_at?->toISOString(),
    ];
});
