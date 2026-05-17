<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\GroupPoint;
use App\Models\Point;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PointController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'association_admin') {
            $points = GroupPoint::with(['user', 'group'])
                ->where('group_id', $user->group_id)
                ->get();

            return response()->json($points);
        }

        $query = Point::with(['user', 'business']);

        if ($user->role === 'business_owner') {
            $businessId = $user->businesses()->first()?->id;
            $query->where('business_id', $businessId);
        }

        return response()->json($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id'        => 'required|exists:users,id',
            'business_id'    => 'required|exists:businesses,id',
            'points'         => 'required|integer|min:1',
            'type'           => 'required|in:earn,redeem',
        ]);

        $business = Business::find($data['business_id']);
        $group    = $business->groups()->first();

        if ($group) {
            return $this->handleGroupPoints($data, $group);
        }

        return $this->handleIndividualPoints($data);
    }

    private function handleGroupPoints(array $data, $group): JsonResponse
    {
        $groupPoint = GroupPoint::firstOrCreate(
            ['user_id' => $data['user_id'], 'group_id' => $group->id],
            ['balance' => 0, 'total_earned' => 0, 'total_redeemed' => 0]
        );

        if ($data['type'] === 'earn') {
            $groupPoint->increment('balance', $data['points']);
            $groupPoint->increment('total_earned', $data['points']);
        } else {
            if ($groupPoint->balance < $data['points']) {
                return response()->json(['message' => 'Saldo de puntos insuficiente.'], 422);
            }
            $groupPoint->decrement('balance', $data['points']);
            $groupPoint->increment('total_redeemed', $data['points']);
        }

        return response()->json($groupPoint->load(['user', 'group']), 201);
    }

    private function handleIndividualPoints(array $data): JsonResponse
    {
        $point = Point::firstOrCreate(
            ['user_id' => $data['user_id'], 'business_id' => $data['business_id']],
            ['balance' => 0, 'total_earned' => 0, 'total_redeemed' => 0]
        );

        if ($data['type'] === 'earn') {
            $point->increment('balance', $data['points']);
            $point->increment('total_earned', $data['points']);
        } else {
            if ($point->balance < $data['points']) {
                return response()->json(['message' => 'Saldo de puntos insuficiente.'], 422);
            }
            $point->decrement('balance', $data['points']);
            $point->increment('total_redeemed', $data['points']);
        }

        return response()->json($point->load(['user', 'business']), 201);
    }

    public function myPoints(Request $request): JsonResponse
    {
        $user = $request->user();

        $individual = Point::with('business')
            ->where('user_id', $user->id)
            ->get()
            ->map(fn($p) => [
                'type'           => 'individual',
                'name'           => $p->business->name,
                'balance'        => $p->balance,
                'total_earned'   => $p->total_earned,
                'total_redeemed' => $p->total_redeemed,
            ]);

        $group = GroupPoint::with('group')
            ->where('user_id', $user->id)
            ->get()
            ->map(fn($p) => [
                'type'           => 'group',
                'name'           => $p->group->name,
                'balance'        => $p->balance,
                'total_earned'   => $p->total_earned,
                'total_redeemed' => $p->total_redeemed,
            ]);

        return response()->json([
            'points'      => $individual->merge($group)->values(),
            'total_balance' => $individual->sum('balance') + $group->sum('balance'),
        ]);
    }

    public function show(Point $point): JsonResponse
    {
        return response()->json($point->load(['user', 'business']));
    }

    public function update(Request $request, Point $point): JsonResponse
    {
        $data = $request->validate([
            'balance'        => 'sometimes|integer|min:0',
            'total_earned'   => 'sometimes|integer|min:0',
            'total_redeemed' => 'sometimes|integer|min:0',
        ]);

        $point->update($data);

        return response()->json($point);
    }

    public function destroy(Point $point): JsonResponse
    {
        $point->delete();

        return response()->json(null, 204);
    }
}
