<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupInvitation extends Model
{
    protected $fillable = ['group_id', 'email', 'token', 'expires_at'];

    protected $casts = ['expires_at' => 'datetime'];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}
