<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FollowPageGroup extends Notification
{
    use Queueable;

    public $user;
    public $group;
    /**
     * Create a new notification instance.
     */
    public function __construct($user, $group)
    {
        $this->user = $user;
        $this->group = $group;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'user_id' => $this->user->id,
            'user_name' => $this->user->username,
            'user_avatar' => $this->user->avatar_url,
            'type' => 'request',
            'message' => "{$this->user->name} has requested to join your group {$this->group->name}.",
            'group_id' => $this->group->id,
            'link' => "/groups_requests"
        ];
    }
}
