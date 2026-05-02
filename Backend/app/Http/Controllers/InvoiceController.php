<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Invoice::with(['business', 'user'])->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'user_id'     => 'nullable|exists:users,id',
            'amount'      => 'required|numeric|min:0',
            'tax'         => 'numeric|min:0',
            'total'       => 'required|numeric|min:0',
            'status'      => 'in:pending,paid,cancelled',
            'due_date'    => 'required|date',
            'paid_at'     => 'nullable|date',
            'notes'       => 'nullable|string',
        ]);

        $invoice = Invoice::create($data);

        return response()->json($invoice, 201);
    }

    public function show(Invoice $invoice): JsonResponse
    {
        return response()->json($invoice->load(['business', 'user', 'transactions']));
    }

    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        $data = $request->validate([
            'amount'   => 'sometimes|numeric|min:0',
            'tax'      => 'sometimes|numeric|min:0',
            'total'    => 'sometimes|numeric|min:0',
            'status'   => 'sometimes|in:pending,paid,cancelled',
            'due_date' => 'sometimes|date',
            'paid_at'  => 'nullable|date',
            'notes'    => 'nullable|string',
        ]);

        $invoice->update($data);

        return response()->json($invoice);
    }

    public function destroy(Invoice $invoice): JsonResponse
    {
        $invoice->delete();

        return response()->json(null, 204);
    }
}
