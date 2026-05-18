<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\GroupPoint;
use App\Models\Offer;
use App\Models\Point;
use App\Models\Reward;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Transaction::with(['user', 'business', 'invoice']);

        if ($request->user()->role === 'business_owner') {
            $businessId = $request->user()->businesses()->first()?->id;
            $query->where('business_id', $businessId);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id'     => 'required|exists:users,id',
            'business_id' => 'required|exists:businesses,id',
            'invoice_id'  => 'nullable|exists:invoices,id',
            'type'        => 'required|in:earn,redeem,refund',
            'points'      => 'required|integer|min:0',
            'amount'      => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ]);

        $transaction = Transaction::create($data);

        return response()->json($transaction, 201);
    }

    public function show(Transaction $transaction): JsonResponse
    {
        return response()->json($transaction->load(['user', 'business', 'invoice']));
    }

    public function update(Request $request, Transaction $transaction): JsonResponse
    {
        $data = $request->validate([
            'type'        => 'sometimes|in:earn,redeem,refund',
            'points'      => 'sometimes|integer|min:0',
            'amount'      => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ]);

        $transaction->update($data);

        return response()->json($transaction);
    }

    public function destroy(Transaction $transaction): JsonResponse
    {
        $transaction->delete();

        return response()->json(null, 204);
    }

    public function redeem(Request $request): JsonResponse
    {
        $data = $request->validate([
            'redeemable_type' => 'required|in:reward,offer',
            'redeemable_id'   => 'required|integer',
        ]);

        $user = $request->user();

        if ($data['redeemable_type'] === 'reward') {
            $reward = Reward::findOrFail($data['redeemable_id']);

            if (! $reward->is_active) {
                return response()->json(['message' => 'Esta recompensa ya no está disponible.'], 422);
            }

            // Comprobar si ya hay un código de canje activo para esta recompensa
            $existing = Transaction::where('user_id', $user->id)
                ->where('redeemable_type', 'reward')
                ->where('redeemable_id', $reward->id)
                ->where('status', 'pending')
                ->where('expires_at', '>', now())
                ->first();

            if ($existing) {
                return response()->json([
                    'message'    => 'Ya tienes un código de canje activo para esta recompensa.',
                    'code'       => $existing->code,
                    'expires_at' => $existing->expires_at,
                    'reward'     => $reward->only(['id', 'name', 'description', 'points_required']),
                ], 409);
            }

            $business = Business::findOrFail($reward->business_id);
            $group    = $business->groups()->first();

            // Solo verificamos saldo — el descuento ocurre al validar el código
            if ($group) {
                $gp = GroupPoint::where('user_id', $user->id)
                    ->where('group_id', $group->id)
                    ->first();

                if (! $gp) {
                    return response()->json(['message' => 'Esta recompensa no es válida en este negocio.'], 422);
                }

                if ($gp->balance < $reward->points_required) {
                    return response()->json(['message' => 'Saldo de puntos insuficiente.'], 422);
                }
            } else {
                $point = Point::where('user_id', $user->id)
                    ->where('business_id', $reward->business_id)
                    ->first();

                if (! $point || $point->balance < $reward->points_required) {
                    return response()->json(['message' => 'Saldo de puntos insuficiente.'], 422);
                }
            }

            $code = $this->generateUniqueCode();

            $transaction = Transaction::create([
                'user_id'         => $user->id,
                'business_id'     => $reward->business_id,
                'type'            => 'redeem',
                'points'          => $reward->points_required,
                'description'     => 'Canje: ' . $reward->name,
                'code'            => $code,
                'status'          => 'pending',
                'expires_at'      => now()->addHours(24),
                'redeemable_id'   => $reward->id,
                'redeemable_type' => 'reward',
            ]);

            return response()->json([
                'code'       => $code,
                'expires_at' => $transaction->expires_at,
                'reward'     => $reward->only(['id', 'name', 'description', 'points_required']),
            ], 201);
        }

        // Oferta: genera código sin coste de puntos
        $offer = Offer::findOrFail($data['redeemable_id']);

        if (! $offer->is_active) {
            return response()->json(['message' => 'Esta oferta ya no está disponible.'], 422);
        }

        $code = $this->generateUniqueCode();

        $transaction = Transaction::create([
            'user_id'         => $user->id,
            'business_id'     => $offer->business_id, // null para ofertas globales
            'type'            => 'redeem',
            'points'          => 0,
            'description'     => 'Uso oferta: ' . $offer->title,
            'code'            => $code,
            'status'          => 'pending',
            'expires_at'      => now()->addHours(48),
            'redeemable_id'   => $offer->id,
            'redeemable_type' => 'offer',
        ]);

        return response()->json([
            'code'       => $code,
            'expires_at' => $transaction->expires_at,
            'offer'      => $offer->only(['id', 'title', 'description', 'discount_type', 'discount_value']),
        ], 201);
    }

    public function validateCode(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => 'required|string|max:20',
        ]);

        $transaction = Transaction::with(['user'])
            ->where('code', strtoupper(trim($data['code'])))
            ->where('status', 'pending')
            ->first();

        if (! $transaction) {
            return response()->json(['message' => 'Código no encontrado o ya utilizado.'], 404);
        }

        if ($transaction->expires_at && $transaction->expires_at->isPast()) {
            $transaction->update(['status' => 'expired']);
            return response()->json(['message' => 'El código ha expirado.'], 422);
        }

        $transaction->update(['status' => 'validated']);

        $meta = null;

        if ($transaction->redeemable_type === 'reward') {
            $reward = Reward::find($transaction->redeemable_id);
            $meta   = $reward?->only(['name', 'description', 'points_required']);

            // Descuento de puntos en el momento de la validación
            if ($reward && $transaction->points > 0) {
                $business = Business::find($reward->business_id);
                $group    = $business?->groups()->first();

                if ($group) {
                    $gp = GroupPoint::where('user_id', $transaction->user_id)
                        ->where('group_id', $group->id)
                        ->first();

                    if ($gp && $gp->balance >= $transaction->points) {
                        $gp->decrement('balance', $transaction->points);
                        $gp->increment('total_redeemed', $transaction->points);
                    }
                } else {
                    $point = Point::where('user_id', $transaction->user_id)
                        ->where('business_id', $reward->business_id)
                        ->first();

                    if ($point && $point->balance >= $transaction->points) {
                        $point->decrement('balance', $transaction->points);
                        $point->increment('total_redeemed', $transaction->points);
                    }
                }
            }

            // Descontar stock y desactivar si se agota
            if ($reward && $reward->stock !== null) {
                $newStock = max(0, $reward->stock - 1);
                $updates  = ['stock' => $newStock];
                if ($newStock <= 0) {
                    $updates['is_active'] = false;
                }
                $reward->update($updates);
            }
        } elseif ($transaction->redeemable_type === 'offer') {
            $meta = Offer::find($transaction->redeemable_id)?->only(['title', 'description', 'discount_type', 'discount_value']);
        }

        return response()->json([
            'message'         => 'Código validado correctamente.',
            'type'            => $transaction->redeemable_type,
            'customer'        => $transaction->user->only(['id', 'name', 'email']),
            'points_redeemed' => $transaction->points,
            'meta'            => $meta,
        ]);
    }

    private function generateUniqueCode(): string
    {
        do {
            $code = strtoupper(Str::random(4)) . '-' . strtoupper(Str::random(4));
        } while (Transaction::where('code', $code)->exists());

        return $code;
    }
}
