<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewMessage extends Notification
{
    use Queueable;

    public $sender;
    public $message;

    /**
     * Create a new notification instance.
     */
    public function __construct($sender, $message)
    {
        $this->sender = $sender;
        $this->message = $message;
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
            'type' => 'message',
            'message' => "{{$this->sender->name}} send you message !",
            'link' => env('FRONTEND_URL') . "/messenger"
        ];
    }
}
