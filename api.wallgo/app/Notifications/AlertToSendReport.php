<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AlertToSendReport extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
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
            'user_id' => rand(),
            'user_name' => 'WallGo',
            'user_avatar' => 'https://res.cloudinary.com/dhysaozog/image/upload/v1795207271/logo_dzjtvr.webp',
            'type' => 'report',
            'message' => 'Your report has been submitted successfully, we will work on processing it promptly.'
        ];
    }
}
