<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // business_id nullable para ofertas globales (sin negocio específico)
            $table->unsignedBigInteger('business_id')->nullable()->change();

            $table->string('code', 20)->nullable()->unique()->after('description');
            $table->enum('status', ['pending', 'validated', 'expired'])->nullable()->after('code');
            $table->timestamp('expires_at')->nullable()->after('status');
            $table->unsignedBigInteger('redeemable_id')->nullable()->after('expires_at');
            $table->string('redeemable_type', 50)->nullable()->after('redeemable_id');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['code', 'status', 'expires_at', 'redeemable_id', 'redeemable_type']);
            $table->unsignedBigInteger('business_id')->nullable(false)->change();
        });
    }
};
