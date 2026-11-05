<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostLikedNotification extends Notification
{
    use Queueable;

    public $sender;
    public $post;
    public $type;
    /**
     * Create a new notification instance.
     */
    public function __construct($sender, $post, $type)
    {
        $this->sender = $sender;
        $this->post = $post;
        $this->type = $type;
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
            'user_id' => $this->sender->id,
            'user_name' => $this->sender->name,
            'user_avatar' => $this->sender->avatar_url,
            'type' => 'like',
            'message' => "liked your $this->type.",
            'post_id' => $this->post->id,
            'link' => "/" . $this->type . "/" . $this->post->id
        ];
    }
}
