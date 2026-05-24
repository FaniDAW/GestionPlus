<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $userName;
    public string $role;
    public string $dashboardUrl;

    public function __construct(User $user)
    {
        $this->userName     = $user->name;
        $this->role         = $user->role;
        $frontend           = rtrim(config('app.frontend_url', config('app.url')), '/');
        $this->dashboardUrl = $frontend . match ($user->role) {
            'association_admin' => '/association',
            'business_owner'    => '/business',
            'admin'             => '/admin',
            default             => '/dashboard',
        };
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: '¡Bienvenido a Gestion+!');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.welcome');
    }
}
