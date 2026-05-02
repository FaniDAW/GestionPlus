<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'plan_name',
        'price',
        'billing_cycle',
        'status',
        'starts_at',
        'ends_at',
        'stripe_session_id',
    ];

    protected $casts = [
        'price'     => 'decimal:2',
        'starts_at' => 'date',
        'ends_at'   => 'date',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}
