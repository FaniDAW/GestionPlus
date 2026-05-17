<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'description',
        'contact_email',
        'contact_phone',
        'address',
        'is_active',
        'max_businesses',
        'invitation_token',
    ];

    protected $casts = [
        'is_active'       => 'boolean',
        'max_businesses'  => 'integer',
    ];

    public function businesses()
    {
        return $this->belongsToMany(Business::class, 'group_business');
    }

    public function admins()
    {
        return $this->hasMany(User::class);
    }

    public function groupPoints()
    {
        return $this->hasMany(GroupPoint::class);
    }

    public function offers()
    {
        return $this->hasMany(Offer::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
