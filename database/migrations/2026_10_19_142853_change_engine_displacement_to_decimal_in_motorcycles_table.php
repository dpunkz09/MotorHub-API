<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change engine_displacement from integer to decimal(6,2)
        // This allows values like 175.3, 149.6, 1254.0, etc.
        Schema::table('motorcycles', function (Blueprint $table) {
            $table->decimal('engine_displacement', 6, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to integer (will lose decimal precision)
        Schema::table('motorcycles', function (Blueprint $table) {
            $table->integer('engine_displacement')->nullable()->change();
        });
    }
};
