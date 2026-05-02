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

// Rutas protegidas — cualquier usuario autenticado
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
    Route::post('/stripe/checkout', [StripeController::class, 'createCheckoutSession']);
    Route::apiResource('businesses', BusinessController::class);
    Route::apiResource('transactions', TransactionController::class);
});

// Solo admin
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('users', UserController::class);
    Route::apiResource('subscriptions', SubscriptionController::class);
    Route::apiResource('invoices', InvoiceController::class);
});

// Solo negocios
Route::middleware(['auth:sanctum', 'role:business_owner'])->group(function () {
    Route::apiResource('rewards', RewardController::class);
    Route::apiResource('points', PointController::class);
});
