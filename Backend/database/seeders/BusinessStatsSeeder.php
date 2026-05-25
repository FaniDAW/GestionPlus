<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Point;
use App\Models\Reward;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BusinessStatsSeeder extends Seeder
{
    public function run(): void
    {
        $business = Business::where('email', 'contacto@negociodemo.com')->firstOrFail();

        // Limpia datos previos de este negocio para poder re-ejecutar el seeder sin migrate:fresh
        DB::table('transactions')->where('business_id', $business->id)->delete();
        DB::table('points')->where('business_id', $business->id)
            ->update(['balance' => 0, 'total_earned' => 0, 'total_redeemed' => 0]);

        $customers = $this->createCustomers($business);
        $rewards   = $this->ensureRewards($business);

        $this->createEarnTransactions($business, $customers);
        $this->createRedeemTransactions($business, $customers, $rewards);
        $this->recalculatePoints($business, $customers);

        $this->command->info('BusinessStatsSeeder: datos de estadísticas generados correctamente.');
    }

    // -------------------------------------------------------------------------

    private function createCustomers(Business $business): array
    {
        $names = [
            'Ana García',       'Carlos López',     'María Martínez',
            'Pedro Sánchez',    'Laura Fernández',  'Javier Rodríguez',
            'Elena González',   'Miguel Hernández', 'Carmen Díaz',
            'Roberto Moreno',
        ];

        $customers = [];

        foreach ($names as $i => $name) {
            $customer = User::firstOrCreate(
                ['email' => 'stats' . ($i + 1) . '@negociodemo.test'],
                [
                    'name'         => $name,
                    'password'     => Hash::make('Test1234'),
                    'role'         => 'customer',
                    'qr_code'      => Str::uuid()->toString(),
                    'loyalty_code' => str_pad(910000 + $i, 6, '0', STR_PAD_LEFT),
                ]
            );

            Point::firstOrCreate(
                ['user_id' => $customer->id, 'business_id' => $business->id],
                ['balance' => 0, 'total_earned' => 0, 'total_redeemed' => 0]
            );

            $customers[] = $customer;
        }

        return $customers;
    }

    private function ensureRewards(Business $business): array
    {
        $defs = [
            ['name' => 'Café gratis',   'description' => 'Un café a elegir en tu próxima visita.',  'points_required' => 100],
            ['name' => 'Postre gratis', 'description' => 'Postre o bebida de temporada de regalo.', 'points_required' => 150],
            ['name' => 'Descuento 20%', 'description' => 'Descuento del 20% en cualquier producto.','points_required' => 200],
        ];

        return array_map(fn($def) => Reward::firstOrCreate(
            ['business_id' => $business->id, 'name' => $def['name']],
            array_merge($def, ['is_active' => true, 'stock' => null, 'expires_at' => null])
        ), $defs);
    }

    private function createEarnTransactions(Business $business, array $customers): void
    {
        // [monthsAgo, dayOfMonth, customerIdx, points]
        // Días fijos con now()->subMonths($m)->setDay($d) — sin rand() para reproducibilidad.
        // Máximo día 24 en el mes actual (0) para quedar siempre en el pasado.
        // Máximo día 24 en febrero (mes 3 atrás) — feb 2026 tiene 28 días.
        $plan = [
            // Dic 2025 — 8 transacciones — ~810 pts
            [5,  3, 0,  80], [5,  6, 1, 120], [5,  9, 2,  60], [5, 12, 3, 150],
            [5, 15, 4,  90], [5, 18, 5, 110], [5, 21, 6, 130], [5, 24, 7,  70],

            // Ene 2026 — 8 transacciones — ~1055 pts
            [4,  3, 8, 100], [4,  6, 9, 180], [4,  9, 0, 200], [4, 12, 1, 130],
            [4, 15, 2,  90], [4, 18, 3, 160], [4, 21, 4, 120], [4, 24, 5,  75],

            // Feb 2026 — 8 transacciones — ~980 pts  (máx día 24)
            [3,  3, 6,  80], [3,  6, 7, 140], [3,  9, 8, 110], [3, 12, 9, 175],
            [3, 15, 0, 160], [3, 18, 1,  90], [3, 21, 2, 130], [3, 24, 3,  95],

            // Mar 2026 — 9 transacciones — ~1280 pts
            [2,  3, 4, 200], [2,  6, 5, 170], [2,  9, 6,  80], [2, 12, 7, 120],
            [2, 15, 8, 160], [2, 18, 9, 130], [2, 21, 0, 180], [2, 24, 1,  90],
            [2, 27, 2, 150],

            // Abr 2026 — 8 transacciones — ~955 pts
            [1,  3, 3, 180], [1,  6, 4,  70], [1,  9, 5, 150], [1, 12, 6, 130],
            [1, 15, 7, 100], [1, 18, 8,  90], [1, 21, 9, 160], [1, 24, 0,  75],

            // May 2026 — 7 transacciones — ~800 pts  (máx día 21, antes del día 25 de hoy)
            [0,  3, 1,  80], [0,  6, 2, 120], [0,  9, 3, 100], [0, 12, 4, 160],
            [0, 15, 5, 140], [0, 18, 6,  90], [0, 21, 7, 110],
        ];

        foreach ($plan as [$monthsAgo, $day, $custIdx, $points]) {
            $date = now()->subMonths($monthsAgo)->setDay($day)->startOfDay();

            DB::table('transactions')->insert([
                'user_id'     => $customers[$custIdx]->id,
                'business_id' => $business->id,
                'type'        => 'earn',
                'points'      => $points,
                'description' => 'Puntos acumulados en visita',
                'created_at'  => $date->toDateTimeString(),
                'updated_at'  => $date->toDateTimeString(),
            ]);
        }
    }

    private function createRedeemTransactions(Business $business, array $customers, array $rewards): void
    {
        // [rewardIdx, customerIdx, monthsAgo, dayOfMonth]
        // rewards[0] = Café gratis (100 pts)  → 8 canjes  ← 1.º en ranking
        // rewards[1] = Postre gratis (150 pts) → 5 canjes  ← 2.º en ranking
        // rewards[2] = Descuento 20% (200 pts) → 3 canjes  ← 3.º en ranking
        $plan = [
            [0, 0, 0, 10], [0, 1, 1,  8], [0, 2, 1, 20], [0, 3, 2, 12],
            [0, 4, 3, 15], [0, 5, 3, 22], [0, 6, 4, 14], [0, 7, 5, 18],

            [1, 0, 0, 18], [1, 1, 1, 25], [1, 2, 2, 20], [1, 3, 3,  8], [1, 4, 4, 22],

            [2, 0, 1, 15], [2, 1, 2, 25], [2, 2, 3, 20],
        ];

        foreach ($plan as [$rewardIdx, $custIdx, $monthsAgo, $day]) {
            $reward   = $rewards[$rewardIdx];
            $customer = $customers[$custIdx];
            $date     = now()->subMonths($monthsAgo)->setDay($day)->startOfDay();

            DB::table('transactions')->insert([
                'user_id'         => $customer->id,
                'business_id'     => $business->id,
                'type'            => 'redeem',
                'points'          => $reward->points_required,
                'description'     => 'Canje: ' . $reward->name,
                'code'            => strtoupper(Str::random(4)) . '-' . strtoupper(Str::random(4)),
                'status'          => 'validated',
                'redeemable_id'   => $reward->id,
                'redeemable_type' => 'reward',
                'expires_at'      => null,
                'created_at'      => $date->toDateTimeString(),
                'updated_at'      => $date->toDateTimeString(),
            ]);
        }
    }

    private function recalculatePoints(Business $business, array $customers): void
    {
        foreach ($customers as $customer) {
            $totalEarned = (int) DB::table('transactions')
                ->where('business_id', $business->id)
                ->where('user_id', $customer->id)
                ->where('type', 'earn')
                ->sum('points');

            $totalRedeemed = (int) DB::table('transactions')
                ->where('business_id', $business->id)
                ->where('user_id', $customer->id)
                ->where('type', 'redeem')
                ->where('status', 'validated')
                ->sum('points');

            Point::where('user_id', $customer->id)
                ->where('business_id', $business->id)
                ->update([
                    'total_earned'   => $totalEarned,
                    'total_redeemed' => $totalRedeemed,
                    'balance'        => max(0, $totalEarned - $totalRedeemed),
                ]);
        }
    }
}
