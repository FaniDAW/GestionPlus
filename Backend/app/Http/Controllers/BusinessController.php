<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\GroupPoint;
use App\Models\Reward;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Business::with('owner')->get());
    }

    public function myBusiness(Request $request): JsonResponse
    {
        $business = $request->user()->businesses()->first();

        if (! $business) {
            return response()->json(['message' => 'No tienes un negocio registrado.'], 404);
        }

        $group = $business->groups()->first();

        if ($group) {
            $gp = GroupPoint::where('group_id', $group->id);
            $stats = [
                'total_customers'       => (clone $gp)->distinct('user_id')->count('user_id'),
                'total_points_issued'   => (int) (clone $gp)->sum('total_earned'),
                'total_points_redeemed' => (int) (clone $gp)->sum('total_redeemed'),
                'active_rewards'        => $business->rewards()->where('is_active', true)->count(),
            ];
        } else {
            $stats = [
                'total_customers'       => $business->points()->distinct('user_id')->count('user_id'),
                'total_points_issued'   => (int) $business->points()->sum('total_earned'),
                'total_points_redeemed' => (int) $business->points()->sum('total_redeemed'),
                'active_rewards'        => $business->rewards()->where('is_active', true)->count(),
            ];
        }

        return response()->json(array_merge($business->toArray(), ['stats' => $stats]));
    }

    public function stats(Request $request): JsonResponse
    {
        $business = $request->user()->businesses()->first();

        if (! $business) {
            return response()->json(['message' => 'No tienes un negocio registrado.'], 404);
        }

        $sixMonthsAgo = now()->subMonths(5)->startOfMonth();

        $thisMonthPoints = $business->transactions()
            ->where('type', 'earn')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('points');

        $thisMonthRedemptions = $business->transactions()
            ->where('type', 'redeem')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $monthlyPoints = $business->transactions()
            ->where('type', 'earn')
            ->where('created_at', '>=', $sixMonthsAgo)
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, SUM(points) as total_points")
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $topRewards = $business->transactions()
            ->where('type', 'redeem')
            ->where('redeemable_type', 'reward')
            ->where('status', 'validated')
            ->selectRaw('redeemable_id, COUNT(*) as count')
            ->groupBy('redeemable_id')
            ->orderByDesc('count')
            ->limit(3)
            ->get()
            ->map(function ($item) {
                $reward = Reward::find($item->redeemable_id);

                return [
                    'name'  => $reward?->name ?? 'Recompensa eliminada',
                    'count' => (int) $item->count,
                ];
            });

        return response()->json([
            'this_month_points'      => (int) $thisMonthPoints,
            'this_month_redemptions' => (int) $thisMonthRedemptions,
            'monthly_points'         => $monthlyPoints,
            'top_rewards'            => $topRewards,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:businesses',
            'phone'       => 'nullable|string|max:20',
            'address'     => 'nullable|string|max:255',
            'logo'        => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
            'owner_id'    => 'required|exists:users,id',
        ]);

        $business = Business::create($data);

        return response()->json($business, 201);
    }

    public function show(Business $business): JsonResponse
    {
        return response()->json($business->load(['owner', 'subscriptions', 'invoices', 'rewards']));
    }

    public function update(Request $request, Business $business): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'email'       => 'sometimes|email|unique:businesses,email,' . $business->id,
            'phone'       => 'nullable|string|max:20',
            'address'     => 'nullable|string|max:255',
            'logo'        => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
        ]);

        $business->update($data);

        return response()->json($business);
    }

    public function destroy(Business $business): JsonResponse
    {
        $business->delete();

        return response()->json(null, 204);
    }
}
