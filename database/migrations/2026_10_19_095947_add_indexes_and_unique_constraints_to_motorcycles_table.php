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
        // Create indexes for motorcycles table
        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS motorcycles_brand_slug_unique ON motorcycles (brand_id, slug)');
        DB::statement('CREATE INDEX IF NOT EXISTS motorcycles_price_index ON motorcycles (price)');
        DB::statement('CREATE INDEX IF NOT EXISTS motorcycles_is_latest_index ON motorcycles (is_latest)');
        DB::statement('CREATE INDEX IF NOT EXISTS motorcycles_is_top_index ON motorcycles (is_top_motorcycle)');
        DB::statement('CREATE INDEX IF NOT EXISTS motorcycles_brand_category_index ON motorcycles (brand_id, category_id)');

        // Create indexes for brands table
        DB::statement('CREATE INDEX IF NOT EXISTS brands_name_index ON brands (name)');

        // Create indexes for categories table
        DB::statement('CREATE INDEX IF NOT EXISTS categories_name_index ON categories (name)');
        DB::statement('CREATE INDEX IF NOT EXISTS categories_is_common_index ON categories (is_common)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS motorcycles_brand_slug_unique');
        DB::statement('DROP INDEX IF EXISTS motorcycles_price_index');
        DB::statement('DROP INDEX IF EXISTS motorcycles_is_latest_index');
        DB::statement('DROP INDEX IF EXISTS motorcycles_is_top_index');
        DB::statement('DROP INDEX IF EXISTS motorcycles_brand_category_index');
        DB::statement('DROP INDEX IF EXISTS brands_name_index');
        DB::statement('DROP INDEX IF EXISTS categories_name_index');
        DB::statement('DROP INDEX IF EXISTS categories_is_common_index');
    }
};
