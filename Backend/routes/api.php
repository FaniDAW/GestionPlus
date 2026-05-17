<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\OfferController;
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

    // Ofertas — acceso y filtrado por rol dentro del controlador
    Route::apiResource('offers', OfferController::class);
});

// Solo admin
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('users', UserController::class);
    Route::apiResource('subscriptions', SubscriptionController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('businesses', BusinessController::class);
    Route::apiResource('groups', GroupController::class);
    Route::post('groups/{group}/businesses',   [GroupController::class, 'addBusiness']);
    Route::delete('groups/{group}/businesses', [GroupController::class, 'removeBusiness']);
});

// Solo association_admin
Route::middleware(['auth:sanctum', 'role:association_admin'])->group(function () {
    Route::get('/my-group',   [GroupController::class, 'myGroup']);
    Route::get('/points',     [PointController::class, 'index']);
    Route::get('/transactions', [TransactionController::class, 'index']);
});

// Solo business_owner
Route::middleware(['auth:sanctum', 'role:business_owner'])->group(function () {
    Route::get('/my-business', [BusinessController::class, 'myBusiness']);
    Route::apiResource('rewards', RewardController::class);
    Route::apiResource('points', PointController::class);
    Route::apiResource('transactions', TransactionController::class);
});
