<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Transaction::with(['user', 'business', 'invoice'])->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id'     => 'required|exists:users,id',
            'business_id' => 'required|exists:businesses,id',
            'invoice_id'  => 'nullable|exists:invoices,id',
            'type'        => 'required|in:earn,redeem,refund',
            'points'      => 'required|integer|min:0',
            'amount'      => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ]);

        $transaction = Transaction::create($data);

        return response()->json($transaction, 201);
    }

    public function show(Transaction $transaction): JsonResponse
    {
        return response()->json($transaction->load(['user', 'business', 'invoice']));
    }

    public function update(Request $request, Transaction $transaction): JsonResponse
    {
        $data = $request->validate([
            'type'        => 'sometimes|in:earn,redeem,refund',
            'points'      => 'sometimes|integer|min:0',
            'amount'      => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ]);

        $transaction->update($data);

        return response()->json($transaction);
    }

    public function destroy(Transaction $transaction): JsonResponse
    {
        $transaction->delete();

        return response()->json(null, 204);
    }
}
