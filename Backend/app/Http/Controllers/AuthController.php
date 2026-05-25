<?php

namespace App\Http\Controllers;

use App\Mail\WelcomeMail;
use App\Models\Business;
use App\Models\Group;
use App\Models\GroupInvitation;
use App\Models\GroupPoint;
use App\Models\Point;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
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
            // Try link-based token first, then email-based token
            $group = Group::where('invitation_token', $data['invitation_token'])->first();

            if (! $group) {
                $emailInvitation = GroupInvitation::with('group')
                    ->where('token', $data['invitation_token'])
                    ->where('expires_at', '>', now())
                    ->first();

                if ($emailInvitation) {
                    $group = $emailInvitation->group;
                }
            }

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
            $role = in_array($data['plan'], ['association_s', 'association_m', 'municipal'])
                ? 'association_admin'
                : 'business_owner';
        }

        do {
            $loyaltyCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (User::where('loyalty_code', $loyaltyCode)->exists());

        $user = User::create([
            'name'         => $data['name'],
            'email'        => $data['email'],
            'password'     => Hash::make($data['password']),
            'phone'        => $data['phone'] ?? null,
            'role'         => $role,
            'qr_code'      => Str::uuid()->toString(),
            'loyalty_code' => $loyaltyCode,
        ]);

        $businessName = ! empty($data['business_name']) ? $data['business_name'] : $data['name'];

        if ($group) {
            // Flow: invitation token — business owner joining an existing group
            $business = Business::create([
                'name'      => $businessName,
                'email'     => $data['email'],
                'owner_id'  => $user->id,
                'is_active' => true,
            ]);

            $group->businesses()->attach($business->id);

            GroupInvitation::where('token', $data['invitation_token'] ?? '')->delete();

        } elseif (($data['plan'] ?? null) === 'individual') {
            // Flow: individual business plan — create business + pending subscription
            $business = Business::create([
                'name'      => $businessName,
                'email'     => $data['email'],
                'owner_id'  => $user->id,
                'is_active' => false,
            ]);

            Subscription::create([
                'business_id'   => $business->id,
                'plan_name'     => 'Individual',
                'price'         => 29.00,
                'billing_cycle' => 'monthly',
                'status'        => 'pending',
                'starts_at'     => now()->toDateString(),
                'ends_at'       => now()->addDays(14)->toDateString(),
            ]);

        } elseif (in_array($data['plan'] ?? null, ['association_s', 'association_m', 'municipal'])) {
            // Flow: association / municipal plan — create group, link admin, pending subscription
            $planMap = [
                'association_s' => ['label' => 'Asociación S', 'price' => 149.00, 'max' => 20,   'type' => 'association'],
                'association_m' => ['label' => 'Asociación M', 'price' => 249.00, 'max' => 50,   'type' => 'association'],
                'municipal'     => ['label' => 'Municipal',    'price' => 499.00, 'max' => null,  'type' => 'municipal'],
            ];
            $cfg = $planMap[$data['plan']];

            $newGroup = Group::create([
                'name'           => $businessName,
                'type'           => $cfg['type'],
                'contact_email'  => $data['email'],
                'max_businesses' => $cfg['max'],
                'is_active'      => true,
            ]);

            $user->update(['group_id' => $newGroup->id]);

            Subscription::create([
                'group_id'      => $newGroup->id,
                'plan_name'     => $cfg['label'],
                'price'         => $cfg['price'],
                'billing_cycle' => 'monthly',
                'status'        => 'pending',
                'starts_at'     => now()->toDateString(),
                'ends_at'       => now()->addDays(14)->toDateString(),
            ]);
        }

        Mail::to($user->email)->send(new WelcomeMail($user));

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
                'group_id'       => $p->group_id,
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
