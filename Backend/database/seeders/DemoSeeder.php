<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Group;
use App\Models\GroupPoint;
use App\Models\Offer;
use App\Models\Reward;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $group    = Group::where('name', 'Asociación de Comerciantes Demo')->firstOrFail();
        $customer = User::where('email', 'cliente@test.com')->firstOrFail();

        $businesses = [
            [
                'owner_email' => 'cafeteria@demo.com',
                'owner_name'  => 'Dueño Cafetería',
                'biz_name'    => 'Cafetería La Esquina',
                'biz_email'   => 'contacto@cafeteria-esquina.com',
                'address'     => 'Plaza Mayor 3, Madrid',
                'description' => 'Cafetería tradicional con desayunos caseros.',
                'rewards'     => [
                    ['name' => 'Café gratis',         'description' => 'Un café solo o con leche a elegir.',   'points_required' => 50,  'stock' => null],
                    ['name' => 'Menú del día gratis', 'description' => 'Menú completo de mediodía.',           'points_required' => 200, 'stock' => 10],
                    ['name' => 'Desayuno para dos',   'description' => 'Café + tostada para dos personas.',    'points_required' => 100, 'stock' => null],
                ],
                'offers' => [
                    ['title' => '2×1 en desayunos',          'description' => 'Trae a un amigo y el segundo desayuno es gratis.', 'discount_type' => 'percentage',  'discount_value' => 50],
                    ['title' => '×2 puntos los martes',      'description' => 'Doble puntos en todas las consumiciones los martes.', 'discount_type' => 'points_multiplier', 'discount_value' => 2],
                ],
            ],
            [
                'owner_email' => 'peluqueria@demo.com',
                'owner_name'  => 'Dueña Peluquería',
                'biz_name'    => 'Peluquería Ana',
                'biz_email'   => 'contacto@peluqueria-ana.com',
                'address'     => 'Calle Serrano 22, Madrid',
                'description' => 'Salón de peluquería y estética para toda la familia.',
                'rewards'     => [
                    ['name' => 'Mascarilla capilar gratis', 'description' => 'Tratamiento hidratante de regalo.',      'points_required' => 80,  'stock' => 20],
                    ['name' => '10 € de descuento',         'description' => 'Descuento directo en cualquier servicio.', 'points_required' => 150, 'stock' => null],
                ],
                'offers' => [
                    ['title' => '15% en coloración',         'description' => 'Descuento en todos los servicios de color este mes.', 'discount_type' => 'percentage', 'discount_value' => 15],
                    ['title' => 'Corte + lavado a precio especial', 'description' => '5 € de descuento en el servicio completo.', 'discount_type' => 'fixed', 'discount_value' => 5],
                ],
            ],
            [
                'owner_email' => 'libreria@demo.com',
                'owner_name'  => 'Dueño Librería',
                'biz_name'    => 'Librería Central',
                'biz_email'   => 'contacto@libreria-central.com',
                'address'     => 'Calle Alcalá 10, Madrid',
                'description' => 'Librería con fondo general, papelería y novedades.',
                'rewards'     => [
                    ['name' => 'Punto de libro de tela',   'description' => 'Marcapáginas artesanal de regalo.',     'points_required' => 30,  'stock' => 50],
                    ['name' => 'Libro a elegir (hasta 12 €)', 'description' => 'Selecciona cualquier libro del fondo hasta 12 €.', 'points_required' => 250, 'stock' => null],
                    ['name' => 'Kit papelería',            'description' => 'Bloc + bolígrafo + agenda mini.',        'points_required' => 120, 'stock' => 15],
                ],
                'offers' => [
                    ['title' => '10% en novedades',       'description' => 'Descuento en todos los libros recién llegados.',  'discount_type' => 'percentage', 'discount_value' => 10],
                    ['title' => 'Papelería -20%',         'description' => 'Toda la papelería con descuento durante mayo.', 'discount_type' => 'percentage', 'discount_value' => 20],
                ],
            ],
        ];

        foreach ($businesses as $data) {
            $owner = User::firstOrCreate(
                ['email' => $data['owner_email']],
                [
                    'name'      => $data['owner_name'],
                    'password'  => Hash::make('Test1234'),
                    'role'      => 'business_owner',
                    'is_active' => true,
                    'qr_code'   => \Illuminate\Support\Str::uuid()->toString(),
                ]
            );

            $business = Business::firstOrCreate(
                ['email' => $data['biz_email']],
                [
                    'name'        => $data['biz_name'],
                    'address'     => $data['address'],
                    'description' => $data['description'],
                    'is_active'   => true,
                    'owner_id'    => $owner->id,
                ]
            );

            if (! $group->businesses()->where('business_id', $business->id)->exists()) {
                $group->businesses()->attach($business->id);
            }

            foreach ($data['rewards'] as $r) {
                Reward::firstOrCreate(
                    ['business_id' => $business->id, 'name' => $r['name']],
                    [
                        'description'     => $r['description'],
                        'points_required' => $r['points_required'],
                        'stock'           => $r['stock'],
                        'is_active'       => true,
                        'expires_at'      => null,
                    ]
                );
            }

            foreach ($data['offers'] as $o) {
                Offer::firstOrCreate(
                    ['business_id' => $business->id, 'title' => $o['title']],
                    [
                        'description'    => $o['description'],
                        'discount_type'  => $o['discount_type'],
                        'discount_value' => $o['discount_value'],
                        'scope'          => 'group',
                        'group_id'       => $group->id,
                        'is_active'      => true,
                        'starts_at'      => now()->toDateString(),
                        'ends_at'        => now()->addMonths(2)->toDateString(),
                    ]
                );
            }
        }

        // Actualizar saldo del cliente para que pueda ver distintos niveles de recompensas
        GroupPoint::updateOrCreate(
            ['user_id' => $customer->id, 'group_id' => $group->id],
            ['balance' => 185, 'total_earned' => 285, 'total_redeemed' => 100]
        );
    }
}
