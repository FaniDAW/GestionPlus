<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Group;
use App\Models\GroupPoint;
use App\Models\Point;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'             => 'required|string|max:255',
            'email'            => 'required|email|unique:users,email',
            'password'         => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
            'phone'            => 'nullable|string|max:20',
            'invitation_token' => 'nullable|string',
            'plan'             => 'nullable|string|in:individual,association_s,association_m,municipal',
            'business_name'    => 'nullable|string|max:255',
        ]);

        $group = null;
        $role  = 'customer';

        if (! empty($data['invitation_token'])) {
            $group = Group::where('invitation_token', $data['invitation_token'])->first();

            if (! $group) {
                return response()->json([
                    'message' => 'El enlace de invitación no es válido o ha expirado.',
                ], 422);
            }

            if ($group->max_businesses !== null && $group->businesses()->count() >= $group->max_businesses) {
                return response()->json([
                    'message' => 'La asociación ha alcanzado el límite de negocios de su plan.',
                ], 422);
            }

            $role = 'business_owner';
        } elseif (! empty($data['plan'])) {
            $role = 'business_owner';
        }

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'phone'    => $data['phone'] ?? null,
            'role'     => $role,
            'qr_code'  => Str::uuid()->toString(),
        ]);

        $businessName = ! empty($data['business_name']) ? $data['business_name'] : $data['name'];

        if ($group) {
            $business = Business::create([
                'name'      => $businessName,
                'email'     => $data['email'],
                'owner_id'  => $user->id,
                'is_active' => true,
            ]);

            $group->businesses()->attach($business->id);
        } elseif (! empty($data['plan'])) {
            Business::create([
                'name'      => $businessName,
                'email'     => $data['email'],
                'owner_id'  => $user->id,
                'is_active' => false,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'         => $user,
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (! Auth::attempt($data)) {
            return response()->json(['message' => 'Credenciales incorrectas.'], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'         => $user,
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('businesses');

        $individual = Point::with('business')
            ->where('user_id', $user->id)
            ->get()
            ->map(fn($p) => [
                'type'           => 'individual',
                'name'           => $p->business?->name ?? '',
                'balance'        => $p->balance,
                'total_earned'   => $p->total_earned,
                'total_redeemed' => $p->total_redeemed,
            ]);

        $group = GroupPoint::with('group')
            ->where('user_id', $user->id)
            ->get()
            ->map(fn($p) => [
                'type'           => 'group',
                'name'           => $p->group?->name ?? '',
                'balance'        => $p->balance,
                'total_earned'   => $p->total_earned,
                'total_redeemed' => $p->total_redeemed,
            ]);

        return response()->json(array_merge($user->toArray(), [
            'points'        => $individual->toBase()->merge($group->toBase())->values(),
            'total_balance' => $individual->sum('balance') + $group->sum('balance'),
        ]));
    }
}
