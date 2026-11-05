<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FollowUserNotification extends Notification
{
    use Queueable;

    public $follower;
    public $following;
    /**
     * Create a new notification instance.
     */
    public function __construct($follower, $following)
    {
        $this->follower = $follower;
        $this->following = $following;
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
            'user_id' => $this->follower->id,
            'user_name' => $this->follower->name,
            'user_avatar' => $this->follower->avatar_url,
            'type' => 'follow',
            'message' => 'followed you.',
            'following_id' => $this->following->id,
            'link' => "/profile/" . $this->follower->id . "/" . $this->follower->username
        ];
    }
}
