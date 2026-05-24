<?php

namespace App\Mail;

use App\Models\GroupInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BusinessInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $inviteUrl;
    public string $groupName;

    public function __construct(GroupInvitation $invitation)
    {
        $frontend       = rtrim(config('app.frontend_url', config('app.url')), '/');
        $this->inviteUrl  = "{$frontend}/register?token={$invitation->token}";
        $this->groupName  = $invitation->group->name;
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: "Invitación para unirte a {$this->groupName} en Gestion+");
    }

    public function content(): Content
    {
        return new Content(view: 'emails.business-invitation');
    }
}
