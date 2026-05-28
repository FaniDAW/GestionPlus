<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Atributos que se pueden asignar masivamente.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'qr_code',
        'loyalty_code',
        'role',
        'is_active',
        'group_id',
    ];

    /**
     * Atributos que deben ocultarse en la serialización.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Obtiene los atributos que deben castearse.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
        ];
    }

    public function businesses()
    {
        return $this->hasMany(Business::class, 'owner_id');
    }

    public function points()
    {
        return $this->hasMany(Point::class);
    }

    public function groupPoints()
    {
        return $this->hasMany(GroupPoint::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    protected static function boot(): void
    {
        parent::boot();

        static::retrieved(function (User $user) {
            if (is_null($user->loyalty_code)) {
                do {
                    $code = str_pad(random_int(0, 999_999), 6, '0', STR_PAD_LEFT);
                } while (static::where('loyalty_code', $code)->exists());

                $user->loyalty_code = $code;
                $user->saveQuietly();
            }
        });
    }

    // --- Helpers de rol ---
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isBusiness(): bool
    {
        return $this->role === 'business_owner';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function isAssociationAdmin(): bool
    {
        return $this->role === 'association_admin';
    }
}
