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
        DB::statement('ALTER TABLE motorcycles ALTER COLUMN engine_displacement TYPE NUMERIC(6,2) USING engine_displacement::numeric');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to integer (will lose decimal precision)
        DB::statement('ALTER TABLE motorcycles ALTER COLUMN engine_displacement TYPE INTEGER USING engine_displacement::integer');
    }
};
