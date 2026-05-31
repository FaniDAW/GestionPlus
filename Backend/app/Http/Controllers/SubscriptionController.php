<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        $subscription = null;

        if ($user->role === 'business_owner') {
            $business     = $user->businesses()->first();
            $subscription = $business?->subscriptions()->latest()->first();
        } elseif ($user->role === 'association_admin') {
            $subscription = $user->group?->subscriptions()->latest()->first();
        }

        if (! $subscription) {
            return response()->json(['message' => 'No hay suscripción activa.'], 404);
        }

        $trialEndsAt = Carbon::parse($subscription->starts_at)->addDays(14);
        $isTrial     = now()->lt($trialEndsAt) && $subscription->status === 'active';

        return response()->json([
            'plan_name'     => $subscription->plan_name,
            'billing_cycle' => $subscription->billing_cycle,
            'price'         => (float) $subscription->price,
            'status'        => $subscription->status,
            'starts_at'     => $subscription->starts_at->toDateString(),
            'ends_at'       => $subscription->ends_at->toDateString(),
            'is_trial'      => $isTrial,
            'trial_ends_at' => $trialEndsAt->toDateString(),
        ]);
    }

    public function index(): JsonResponse
    {
        return response()->json(Subscription::with(['business', 'group'])->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'business_id'   => 'required|exists:businesses,id',
            'plan_name'     => 'required|string|max:255',
            'price'         => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,annual',
            'status'        => 'in:active,cancelled,expired',
            'starts_at'     => 'required|date',
            'ends_at'       => 'required|date|after:starts_at',
        ]);

        $subscription = Subscription::create($data);

        return response()->json($subscription, 201);
    }

    public function show(Subscription $subscription): JsonResponse
    {
        return response()->json($subscription->load('business'));
    }

    public function update(Request $request, Subscription $subscription): JsonResponse
    {
        $data = $request->validate([
            'plan_name'     => 'sometimes|string|max:255',
            'price'         => 'sometimes|numeric|min:0',
            'billing_cycle' => 'sometimes|in:monthly,annual',
            'status'        => 'sometimes|in:active,cancelled,expired',
            'starts_at'     => 'sometimes|date',
            'ends_at'       => 'sometimes|date|after:starts_at',
        ]);

        $subscription->update($data);

        return response()->json($subscription);
    }

    public function destroy(Subscription $subscription): JsonResponse
    {
        $subscription->delete();

        return response()->json(null, 204);
    }
}
