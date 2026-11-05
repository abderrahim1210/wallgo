<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PageGroupFollowNotification extends Notification
{
    use Queueable;

    public $type;
    public $user;
    public $object;
    /**
     * Create a new notification instance.
     */
    public function __construct($type,$user,$object)
    {
        $this->type = $type;
        $this->user = $user;
        $this->object = $object;
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
            'user_name' => $this->user->name || $this->user->username,
            'user_avatar' => $this->user->avatar_url,
            'type' => $this->type,
            'message' => 'followed your ' . $this->type,
            'object_id' => $this->object->id
        ];
    }
}
