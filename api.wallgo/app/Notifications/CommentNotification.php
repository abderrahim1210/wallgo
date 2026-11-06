<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommentNotification extends Notification
{
    use Queueable;

    public $comment;
    public $user;
    public $post;
    /**
     * Create a new notification instance.
     */
    public function __construct($comment, $user, $post)
    {
        $this->comment = $comment;
        $this->user = $user;
        $this->post = $post;
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
            'type' => 'comment',
            'message' => 'added comment.',
            'comment_id' => $this->comment->id,
            'comment_content' => $this->comment->content,
            'post_id' => $this->post->id,
            'link' => "/post/" . $this->post->id
        ];
    }
}
