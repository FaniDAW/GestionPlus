<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin ───────────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'admin@gestionplus.com'],
            [
                'name'         => 'Admin',
                'password'     => Hash::make('Test1234'),
                'phone'        => '600000001',
                'role'         => 'admin',
                'qr_code'      => Str::uuid()->toString(),
                'loyalty_code' => '000001',
            ]
        );

        // ── Business owner (individual) ─────────────────────────────────────
        // Business + Subscription are created in BusinessSeeder
        User::firstOrCreate(
            ['email' => 'negocio@test.com'],
            [
                'name'         => 'Negocio Demo',
                'password'     => Hash::make('Test1234'),
                'phone'        => '600000002',
                'role'         => 'business_owner',
                'qr_code'      => Str::uuid()->toString(),
                'loyalty_code' => '000002',
            ]
        );

        // ── Customer ────────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'cliente@test.com'],
            [
                'name'         => 'Cliente Demo',
                'password'     => Hash::make('Test1234'),
                'phone'        => '600000003',
                'role'         => 'customer',
                'qr_code'      => Str::uuid()->toString(),
                'loyalty_code' => '000003',
            ]
        );

        // ── Association group ───────────────────────────────────────────────
        $group = Group::firstOrCreate(
            ['name' => 'Asociación de Comerciantes Demo'],
            [
                'type'           => 'association',
                'contact_email'  => 'asociacion@demo.com',
                'contact_phone'  => '600000010',
                'address'        => 'Calle Mayor 1, Demo',
                'is_active'      => true,
                'max_businesses' => 50,
            ]
        );

        // ── Association admin (linked to group) ─────────────────────────────
        User::firstOrCreate(
            ['email' => 'asociacion@demo.com'],
            [
                'name'         => 'Admin Asociación',
                'password'     => Hash::make('Test1234'),
                'phone'        => '600000010',
                'role'         => 'association_admin',
                'is_active'    => true,
                'qr_code'      => Str::uuid()->toString(),
                'loyalty_code' => '000010',
                'group_id'     => $group->id,
            ]
        );

        // ── Subscription for the association group (Asociación M, active) ───
        Subscription::firstOrCreate(
            ['group_id' => $group->id],
            [
                'plan_name'     => 'Asociación M',
                'price'         => 249.00,
                'billing_cycle' => 'monthly',
                'status'        => 'active',
                'starts_at'     => now()->toDateString(),
                'ends_at'       => now()->addYear()->toDateString(),
            ]
        );
    }
}
