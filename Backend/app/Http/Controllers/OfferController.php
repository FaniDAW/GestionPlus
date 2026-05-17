<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user  = $request->user();
        $query = Offer::with(['business', 'group']);

        switch ($user->role) {
            case 'admin':
                // Ve todas las ofertas
                break;

            case 'association_admin':
                // Ve las ofertas de su grupo y las globales
                $query->where(fn($q) => $q
                    ->where('scope', 'global')
                    ->orWhere(fn($q2) => $q2->where('scope', 'group')->where('group_id', $user->group_id))
                );
                break;

            case 'business_owner':
                // Ve sus propias ofertas individuales y las globales
                $businessId = $user->businesses()->first()?->id;
                $query->where(fn($q) => $q
                    ->where('scope', 'global')
                    ->orWhere(fn($q2) => $q2->where('scope', 'individual')->where('business_id', $businessId))
                );
                break;

            default:
                // Customer: ve todas las ofertas activas
                $query->active();
                break;
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string',
            'image'          => 'nullable|string|max:255',
            'discount_type'  => 'required|in:percentage,fixed,points_multiplier',
            'discount_value' => 'required|numeric|min:0',
            'scope'          => 'required|in:individual,group,global',
            'business_id'    => 'nullable|exists:businesses,id',
            'group_id'       => 'nullable|exists:groups,id',
            'starts_at'      => 'nullable|date',
            'ends_at'        => 'nullable|date|after_or_equal:starts_at',
            'is_active'      => 'boolean',
        ]);

        // Forzar el scope y owner según el rol
        if ($user->role === 'business_owner') {
            $data['scope']       = 'individual';
            $data['business_id'] = $user->businesses()->first()?->id;
            $data['group_id']    = null;
        } elseif ($user->role === 'association_admin') {
            $data['scope']       = 'group';
            $data['group_id']    = $user->group_id;
            $data['business_id'] = null;
        }

        $offer = Offer::create($data);

        return response()->json($offer->load(['business', 'group']), 201);
    }

    public function show(Offer $offer): JsonResponse
    {
        return response()->json($offer->load(['business', 'group']));
    }

    public function update(Request $request, Offer $offer): JsonResponse
    {
        $data = $request->validate([
            'title'          => 'sometimes|string|max:255',
            'description'    => 'nullable|string',
            'image'          => 'nullable|string|max:255',
            'discount_type'  => 'sometimes|in:percentage,fixed,points_multiplier',
            'discount_value' => 'sometimes|numeric|min:0',
            'starts_at'      => 'nullable|date',
            'ends_at'        => 'nullable|date|after_or_equal:starts_at',
            'is_active'      => 'sometimes|boolean',
        ]);

        $offer->update($data);

        return response()->json($offer->load(['business', 'group']));
    }

    public function destroy(Offer $offer): JsonResponse
    {
        $offer->delete();

        return response()->json(null, 204);
    }
}
