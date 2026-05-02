<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@gestionplus.com'],
            [
                'name'     => 'Admin',
                'password' => Hash::make('Test1234'),
                'phone'    => '600000001',
                'role'     => 'admin',
            ]
        );

        User::firstOrCreate(
            ['email' => 'negocio@test.com'],
            [
                'name'     => 'Negocio Demo',
                'password' => Hash::make('Test1234'),
                'phone'    => '600000002',
                'role'     => 'business_owner',
            ]
        );

        User::firstOrCreate(
            ['email' => 'cliente@test.com'],
            [
                'name'     => 'Cliente Demo',
                'password' => Hash::make('Test1234'),
                'phone'    => '600000003',
                'role'     => 'customer',
            ]
        );
    }
}
