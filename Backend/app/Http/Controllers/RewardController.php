<?php

namespace App\Http\Controllers;

use App\Models\GroupPoint;
use App\Models\Point;
use App\Models\Reward;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RewardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'customer') {
            $groupIds = GroupPoint::where('user_id', $user->id)->pluck('group_id');
            $groupBusinessIds = $groupIds->isEmpty() ? collect() :
                DB::table('group_business')->whereIn('group_id', $groupIds)->pluck('business_id');

            $individualBusinessIds = Point::where('user_id', $user->id)->pluck('business_id');

            $allBusinessIds = $individualBusinessIds->merge($groupBusinessIds)->unique();

            if ($allBusinessIds->isEmpty()) {
                return response()->json([]);
            }

            return response()->json(
                Reward::with('business')
                    ->whereIn('business_id', $allBusinessIds)
                    ->where('is_active', true)
                    ->where(fn($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
                    ->where(fn($q) => $q->whereNull('stock')->orWhere('stock', '>', 0))
                    ->orderBy('points_required')
                    ->get()
            );
        }

        if ($user->role === 'business_owner') {
            $businessId = $user->businesses()->first()?->id;
            return response()->json(Reward::with('business')->where('business_id', $businessId)->get());
        }

        return response()->json(Reward::with('business')->get());
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role === 'business_owner') {
            $request->merge([
                'business_id' => $request->user()->businesses()->first()?->id,
            ]);
        }

        $data = $request->validate([
            'business_id'     => 'required|exists:businesses,id',
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'points_required' => 'required|integer|min:1',
            'stock'           => 'nullable|integer|min:0',
            'is_active'       => 'boolean',
            'expires_at'      => 'nullable|date',
        ]);

        $reward = Reward::create($data);

        return response()->json($reward, 201);
    }

    public function show(Reward $reward): JsonResponse
    {
        return response()->json($reward->load('business'));
    }

    public function update(Request $request, Reward $reward): JsonResponse
    {
        $data = $request->validate([
            'name'            => 'sometimes|string|max:255',
            'description'     => 'nullable|string',
            'points_required' => 'sometimes|integer|min:1',
            'stock'           => 'nullable|integer|min:0',
            'is_active'       => 'sometimes|boolean',
            'expires_at'      => 'nullable|date',
        ]);

        $reward->update($data);

        return response()->json($reward);
    }

    public function destroy(Reward $reward): JsonResponse
    {
        $reward->delete();

        return response()->json(null, 204);
    }
}
