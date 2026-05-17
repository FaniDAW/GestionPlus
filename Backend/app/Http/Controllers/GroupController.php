<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Business;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Group::with(['businesses', 'admins'])->get());
    }

    public function myGroup(Request $request): JsonResponse
    {
        $group = $request->user()->group;

        if (! $group) {
            return response()->json(['message' => 'No tienes un grupo asignado.'], 404);
        }

        $group->load('businesses.owner');

        $stats = [
            'total_businesses'      => $group->businesses()->count(),
            'total_customers'       => $group->groupPoints()->distinct('user_id')->count('user_id'),
            'total_points_issued'   => (int) $group->groupPoints()->sum('total_earned'),
            'total_points_redeemed' => (int) $group->groupPoints()->sum('total_redeemed'),
            'active_offers'         => $group->offers()->where('is_active', true)->count(),
        ];

        return response()->json(array_merge($group->toArray(), ['stats' => $stats]));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'type'          => 'required|in:association,municipal',
            'description'   => 'nullable|string',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'address'       => 'nullable|string|max:255',
            'is_active'     => 'boolean',
        ]);

        $group = Group::create($data);

        return response()->json($group, 201);
    }

    public function show(Group $group): JsonResponse
    {
        return response()->json($group->load(['businesses.owner', 'admins', 'offers', 'subscriptions']));
    }

    public function update(Request $request, Group $group): JsonResponse
    {
        $data = $request->validate([
            'name'          => 'sometimes|string|max:255',
            'type'          => 'sometimes|in:association,municipal',
            'description'   => 'nullable|string',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'address'       => 'nullable|string|max:255',
            'is_active'     => 'boolean',
        ]);

        $group->update($data);

        return response()->json($group);
    }

    public function destroy(Group $group): JsonResponse
    {
        $group->delete();

        return response()->json(null, 204);
    }

    public function addBusiness(Request $request, Group $group): JsonResponse
    {
        $data = $request->validate([
            'business_id' => 'required|exists:businesses,id',
        ]);

        $group->businesses()->syncWithoutDetaching([$data['business_id']]);

        return response()->json(['message' => 'Negocio añadido al grupo correctamente.']);
    }

    public function removeBusiness(Request $request, Group $group): JsonResponse
    {
        $data = $request->validate([
            'business_id' => 'required|exists:businesses,id',
        ]);

        $group->businesses()->detach($data['business_id']);

        return response()->json(['message' => 'Negocio eliminado del grupo correctamente.']);
    }
}
