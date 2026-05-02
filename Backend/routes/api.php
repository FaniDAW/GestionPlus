<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PointController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Auth pública
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Webhook de Stripe (sin auth, con firma)
Route::post('/stripe/webhook', [StripeController::class, 'webhook']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::post('/stripe/checkout', [StripeController::class, 'createCheckoutSession']);

    Route::apiResource('users',         UserController::class);
    Route::apiResource('businesses',    BusinessController::class);
    Route::apiResource('subscriptions', SubscriptionController::class);
    Route::apiResource('invoices',      InvoiceController::class);
    Route::apiResource('rewards',       RewardController::class);
    Route::apiResource('points',        PointController::class);
    Route::apiResource('transactions',  TransactionController::class);
});
