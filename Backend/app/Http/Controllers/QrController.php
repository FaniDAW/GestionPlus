<?php

namespace App\Http\Controllers;

use App\Models\GroupPoint;
use App\Models\Point;
use App\Models\Reward;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QrController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user();

        if (! $user->qr_code) {
            $user->qr_code = Str::uuid()->toString();
            $user->save();
        }

        $svg = QrCode::size(164)->margin(1)->generate($user->qr_code);

        return response($svg, 200)
            ->header('Content-Type', 'image/svg+xml')
            ->header('Cache-Control', 'no-store');
    }

    public function scan(Request $request, string $code): JsonResponse
    {
        $business = $request->user()->businesses()->first();

        if (! $business) {
            return response()->json(['message' => 'No tienes un negocio asociado.'], 422);
        }

        $customer = User::where('qr_code', $code)->where('role', 'customer')->first();

        if (! $customer) {
            return response()->json(['message' => 'Código QR no reconocido.'], 404);
        }

        $group = $business->groups()->first();

        if ($group) {
            $pointRecord = GroupPoint::where('user_id', $customer->id)
                ->where('group_id', $group->id)
                ->first();
        } else {
            $pointRecord = Point::where('user_id', $customer->id)
                ->where('business_id', $business->id)
                ->first();
        }

        $rewards = Reward::where('business_id', $business->id)
            ->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->where(function ($q) {
                $q->whereNull('stock')->orWhere('stock', '>', 0);
            })
            ->orderBy('points_required')
            ->get(['id', 'name', 'description', 'points_required', 'stock']);

        return response()->json([
            'user'        => ['id' => $customer->id, 'name' => $customer->name, 'email' => $customer->email],
            'points'      => ['balance' => $pointRecord ? $pointRecord->balance : 0],
            'rewards'     => $rewards,
            'business_id' => $business->id,
        ]);
    }
}
