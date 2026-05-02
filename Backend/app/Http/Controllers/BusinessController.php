<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Business::with('owner')->get());
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
