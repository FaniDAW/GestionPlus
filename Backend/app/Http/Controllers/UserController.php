<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\ApiErrorException;
use Stripe\Stripe;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(User::all());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'phone'    => 'nullable|string|max:20',
            'role'     => 'in:admin,business_owner,customer',
        ]);

        $user = User::create($data);

        return response()->json($user, 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($user->load(['businesses', 'points', 'transactions', 'invoices']));
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'name'      => 'sometimes|string|max:255',
            'email'     => 'sometimes|email|unique:users,email,' . $user->id,
            'phone'     => 'nullable|string|max:20',
            'role'      => 'sometimes|in:admin,business_owner,customer',
            'is_active' => 'sometimes|boolean',
        ]);

        $user->update($data);

        return response()->json($user);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json(null, 204);
    }

    public function deleteAccount(Request $request): JsonResponse
    {
        $user = $request->user();

        // Cancel active subscription if exists
        $subscription = $this->findActiveSubscription($user);
        if ($subscription) {
            if ($subscription->stripe_subscription_id) {
                try {
                    Stripe::setApiKey(config('services.stripe.secret'));
                    \Stripe\Subscription::retrieve($subscription->stripe_subscription_id)->cancel();
                } catch (ApiErrorException $e) {
                    Log::warning('Stripe subscription cancel failed: ' . $e->getMessage());
                }
            }
            $subscription->update(['status' => 'cancelled']);
        }

        // Revoke all tokens before deleting
        $user->tokens()->delete();

        $user->delete();

        return response()->json(['message' => 'Cuenta eliminada correctamente.']);
    }

    private function findActiveSubscription(User $user): ?Subscription
    {
        // business_owner → subscription via their business
        if ($user->role === 'business_owner') {
            $business = $user->businesses()->first();
            if ($business) {
                return Subscription::where('business_id', $business->id)
                    ->whereIn('status', ['active', 'trialing'])
                    ->latest()
                    ->first();
            }
        }

        // association_admin → subscription via their group
        if ($user->role === 'association_admin' && $user->group_id) {
            return Subscription::where('group_id', $user->group_id)
                ->whereIn('status', ['active', 'trialing'])
                ->latest()
                ->first();
        }

        return null;
    }

    public function createAdmin(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $data['role'] = 'admin';
        $user = User::create($data);

        return response()->json($user, 201);
    }
}
