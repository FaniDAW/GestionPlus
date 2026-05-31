<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Group;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Stripe;
use Stripe\WebhookSignature;
use UnexpectedValueException;

class StripeController extends Controller
{
    // Metadatos legibles del plan: nombre visible y precios en EUR
    private const PLAN_META = [
        'individual'    => ['name' => 'Individual',   'monthly' => 29.00,  'annual' => 290.00],
        'association_s' => ['name' => 'Asociación S', 'monthly' => 149.00, 'annual' => 1490.00],
        'association_m' => ['name' => 'Asociación M', 'monthly' => 249.00, 'annual' => 2490.00],
    ];

    public function createCheckoutSession(Request $request): JsonResponse
    {
        $data = $request->validate([
            'plan'    => 'required|in:individual,association_s,association_m',
            'billing' => 'nullable|in:monthly,annual',
            'email'   => 'required|email',
        ]);

        $billing = $data['billing'] ?? 'monthly';
        $priceId = config("plans.{$data['plan']}.{$billing}");

        if (! $priceId) {
            return response()->json(['message' => 'Combinación de plan y ciclo no válida.'], 422);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        $user = auth()->user();

        $session = Session::create([
            'payment_method_types' => ['card'],
            'mode'                 => 'subscription',
            'customer_email'       => $data['email'],
            'line_items'           => [[
                'price'    => $priceId,
                'quantity' => 1,
            ]],
            'subscription_data' => [
                'trial_period_days' => 14,
            ],
            'metadata' => [
                'user_id' => $user->id,
                'plan'    => $data['plan'],
                'billing' => $billing,
            ],
            'success_url' => config('app.frontend_url') . '/checkout/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => config('app.frontend_url') . '/register?cancelled=1',
        ]);

        return response()->json([
            'checkout_url' => $session->url,
            'session_id'   => $session->id,
        ]);
    }

    public function handleCheckoutSuccess(Request $request): JsonResponse
    {
        $data = $request->validate([
            'session_id' => 'required|string',
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));

        $session = Session::retrieve($data['session_id']);

        $userId = $session->metadata->user_id ?? null;
        $user   = auth()->user();

        if (! $userId || (int) $userId !== $user->id) {
            return response()->json(['message' => 'Sesión no válida para este usuario.'], 403);
        }

        $plan    = $session->metadata->plan    ?? null;
        $billing = $session->metadata->billing ?? 'monthly';

        if (! $plan || ! isset(self::PLAN_META[$plan])) {
            return response()->json(['message' => 'Plan no reconocido.'], 422);
        }

        $meta  = self::PLAN_META[$plan];
        $price = $meta[$billing] ?? $meta['monthly'];

        $user->update(['role' => $this->roleForPlan($plan)]);

        $subData = [
            'plan_name'         => $meta['name'],
            'price'             => $price,
            'billing_cycle'     => $billing,
            'status'            => 'active',
            'starts_at'         => now()->toDateString(),
            'ends_at'           => $billing === 'annual'
                ? now()->addYear()->toDateString()
                : now()->addMonth()->toDateString(),
            'stripe_session_id' => $session->id,
        ];

        if (in_array($plan, ['association_s', 'association_m'])) {
            $group = $user->group;
            if (! $group) {
                return response()->json(['message' => 'No se encontró el grupo asociado al usuario.'], 422);
            }
            Subscription::updateOrCreate(['group_id' => $group->id], $subData);
        } else {
            $business = $user->businesses()->first();
            if (! $business) {
                return response()->json(['message' => 'No se encontró el negocio asociado al usuario.'], 422);
            }
            Subscription::updateOrCreate(['business_id' => $business->id], $subData);
        }

        return response()->json(['message' => 'Suscripción activada correctamente.']);
    }

    public function webhook(Request $request): JsonResponse
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret    = config('services.stripe.webhook_secret');

        try {
            WebhookSignature::verifyHeader($payload, $sigHeader, $secret);
        } catch (SignatureVerificationException | UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        $event = json_decode($payload, true);

        if ($event['type'] === 'checkout.session.completed') {
            $this->handleCheckoutCompleted($event['data']['object']);
        }

        return response()->json(['received' => true]);
    }

    private function roleForPlan(string $plan): string
    {
        return in_array($plan, ['association_s', 'association_m'])
            ? 'association_admin'
            : 'business_owner';
    }

    private function handleCheckoutCompleted(array $session): void
    {
        $userId  = $session['metadata']['user_id'] ?? null;
        $plan    = $session['metadata']['plan']    ?? null;
        $billing = $session['metadata']['billing'] ?? 'monthly';

        if (! $userId || ! $plan || ! isset(self::PLAN_META[$plan])) {
            return;
        }

        $meta  = self::PLAN_META[$plan];
        $price = $meta[$billing] ?? $meta['monthly'];
        $user  = User::find($userId);

        if (! $user) {
            return;
        }

        $user->update(['role' => $this->roleForPlan($plan)]);

        $subData = [
            'plan_name'         => $meta['name'],
            'price'             => $price,
            'billing_cycle'     => $billing,
            'status'            => 'active',
            'starts_at'         => now()->toDateString(),
            'ends_at'           => $billing === 'annual'
                ? now()->addYear()->toDateString()
                : now()->addMonth()->toDateString(),
            'stripe_session_id' => $session['id'],
        ];

        if (in_array($plan, ['association_s', 'association_m'])) {
            $group = $user->group;
            if (! $group) return;
            Subscription::updateOrCreate(['group_id' => $group->id], $subData);
        } else {
            $business = $user->businesses()->first();
            if (! $business) return;
            Subscription::updateOrCreate(['business_id' => $business->id], $subData);
        }
    }
}
