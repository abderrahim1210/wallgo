<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AlertToDeleteComment extends Notification
{
    use Queueable;

    public $page;
    public $content;
    /**
     * Create a new notification instance.
     */
    public function __construct($page,$content)
    {
        $this->page = $page;
        $this->content = $content;
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
            'user_id' => $this->page->id,
            'user_name' => $this->page->name,
            'user_avatar' => $this->page->logo_url,
            'type' => 'deleted',
            'message' => "Your comment '$this->content' was deleted from {$this->page->name}"
        ];
    }
}
