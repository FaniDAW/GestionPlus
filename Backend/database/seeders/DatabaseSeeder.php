<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        foreach ([
            'personal_access_tokens',
            'transactions',
            'group_points',
            'points',
            'group_invitations',
            'group_business',
            'offers',
            'rewards',
            'invoices',
            'subscriptions',
            'groups',
            'businesses',
            'users',
        ] as $table) {
            DB::table($table)->truncate();
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $this->call([
            UserSeeder::class,
            BusinessSeeder::class,
            DemoSeeder::class,
            BusinessStatsSeeder::class,
        ]);
    }
}
