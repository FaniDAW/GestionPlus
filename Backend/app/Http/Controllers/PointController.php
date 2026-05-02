<?php

namespace App\Http\Controllers;

use App\Models\Point;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PointController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Point::with(['user', 'business'])->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id'        => 'required|exists:users,id',
            'business_id'    => 'required|exists:businesses,id',
            'balance'        => 'integer|min:0',
            'total_earned'   => 'integer|min:0',
            'total_redeemed' => 'integer|min:0',
        ]);

        $point = Point::create($data);

        return response()->json($point, 201);
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
