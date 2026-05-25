<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;

class BusinessSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::where('email', 'negocio@test.com')->firstOrFail();

        $business = Business::firstOrCreate(
            ['email' => 'contacto@negociodemo.com'],
            [
                'name'        => 'Negocio Demo S.L.',
                'phone'       => '910000001',
                'address'     => 'Calle Mayor 1, Madrid',
                'description' => 'Negocio de prueba para desarrollo.',
                'is_active'   => true,
                'owner_id'    => $owner->id,
            ]
        );

        // Subscription for this individual business
        Subscription::firstOrCreate(
            ['business_id' => $business->id],
            [
                'plan_name'     => 'Individual',
                'price'         => 29.00,
                'billing_cycle' => 'monthly',
                'status'        => 'active',
                'starts_at'     => now()->toDateString(),
                'ends_at'       => now()->addYear()->toDateString(),
            ]
        );
    }
}
