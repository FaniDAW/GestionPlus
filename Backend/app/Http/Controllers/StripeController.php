<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\WebhookSignature;
use UnexpectedValueException;

class StripeController extends Controller
{
    private array $plans = [
        'starter' => [
            'name'       => 'Starter',
            'price'      => 2900,
            'price_id'   => 'price_starter_monthly',
            'billing_cycle' => 'monthly',
        ],
        'pro' => [
            'name'       => 'Pro',
            'price'      => 7900,
            'price_id'   => 'price_pro_monthly',
            'billing_cycle' => 'monthly',
        ],
        'enterprise' => [
            'name'       => 'Enterprise',
            'price'      => 19900,
            'price_id'   => 'price_enterprise_monthly',
            'billing_cycle' => 'monthly',
        ],
    ];

    public function createCheckoutSession(Request $request): JsonResponse
    {
        $data = $request->validate([
            'plan' => 'required|in:starter,pro,enterprise',
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));

        $user = $request->user();
        $plan = $this->plans[$data['plan']];

        $session = Session::create([
            'payment_method_types' => ['card'],
            'mode'                 => 'subscription',
            'customer_email'       => $user->email,
            'line_items'           => [[
                'price'    => $plan['price_id'],
                'quantity' => 1,
            ]],
            'metadata' => [
                'user_id' => $user->id,
                'plan'    => $data['plan'],
            ],
            'success_url' => config('app.frontend_url') . '/business/dashboard?welcome=1',
            'cancel_url'  => config('app.frontend_url') . '/register?cancelled=1',
        ]);

        return response()->json(['checkout_url' => $session->url]);
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
            $session = $event['data']['object'];
            $userId  = $session['metadata']['user_id'] ?? null;
            $plan    = $session['metadata']['plan'] ?? null;

            if ($userId && $plan && isset($this->plans[$plan])) {
                $planData = $this->plans[$plan];
                $user     = User::find($userId);

                if ($user) {
                    // Promover a business_owner
                    $user->update(['role' => 'business_owner']);

                    // Crear negocio si no tiene uno
                    $business = $user->businesses()->first()
                        ?? Business::create([
                            'owner_id'  => $user->id,
                            'name'      => 'Negocio de ' . $user->name,
                            'email'     => $user->email,
                            'is_active' => true,
                        ]);

                    // Crear o actualizar suscripción
                    Subscription::updateOrCreate(
                        ['business_id' => $business->id],
                        [
                            'plan_name'         => $planData['name'],
                            'price'             => $planData['price'] / 100,
                            'billing_cycle'     => $planData['billing_cycle'],
                            'status'            => 'active',
                            'starts_at'         => now(),
                            'ends_at'           => now()->addMonth(),
                            'stripe_session_id' => $session['id'],
                        ]
                    );
                }
            }
        }

        return response()->json(['received' => true]);
    }
}
