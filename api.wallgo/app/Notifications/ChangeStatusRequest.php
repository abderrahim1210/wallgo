<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ChangeStatusRequest extends Notification
{
    use Queueable;

    public $group;
    public $status;
    /**
     * Create a new notification instance.
     */
    public function __construct($group, $status)
    {
        $this->group = $group;
        $this->status = $status;
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
            'user_id' => $this->group->id,
            'user_name' => $this->group->name,
            'user_avatar' => $this->group->logo_url,
            'type' => 'status',
            'message' => "Your request to join {$this->group->name} was {$this->status}",
            'link' => "/groups/{$this->group->id}"
        ];
    }
}
