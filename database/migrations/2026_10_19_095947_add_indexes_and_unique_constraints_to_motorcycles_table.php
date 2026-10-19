<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For PostgreSQL compatibility, check if indexes exist before creating
        Schema::table('motorcycles', function (Blueprint $table) {
            if (!$this->indexExists('motorcycles', 'motorcycles_brand_slug_unique')) {
                $table->unique(['brand_id', 'slug'], 'motorcycles_brand_slug_unique');
            }
            if (!$this->indexExists('motorcycles', 'motorcycles_price_index')) {
                $table->index('price', 'motorcycles_price_index');
            }
            if (!$this->indexExists('motorcycles', 'motorcycles_is_latest_index')) {
                $table->index('is_latest', 'motorcycles_is_latest_index');
            }
            if (!$this->indexExists('motorcycles', 'motorcycles_is_top_index')) {
                $table->index('is_top_motorcycle', 'motorcycles_is_top_index');
            }
            if (!$this->indexExists('motorcycles', 'motorcycles_brand_category_index')) {
                $table->index(['brand_id', 'category_id'], 'motorcycles_brand_category_index');
            }
        });

        Schema::table('brands', function (Blueprint $table) {
            if (!$this->indexExists('brands', 'brands_name_index')) {
                $table->index('name', 'brands_name_index');
            }
        });

        Schema::table('categories', function (Blueprint $table) {
            if (!$this->indexExists('categories', 'categories_name_index')) {
                $table->index('name', 'categories_name_index');
            }
            if (!$this->indexExists('categories', 'categories_is_common_index')) {
                $table->index('is_common', 'categories_is_common_index');
            }
        });
    }

    /**
     * Check if an index exists on a table.
     */
    private function indexExists(string $table, string $index): bool
    {
        $connection = Schema::getConnection();
        $schema = $connection->getDoctrineSchemaManager();
        
        try {
            $indexes = $schema->listTableIndexes($table);
            return isset($indexes[$index]);
        } catch (\Exception $e) {
            // If we can't check, assume it doesn't exist
            return false;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('motorcycles', function (Blueprint $table) {
            $table->dropUnique('motorcycles_brand_slug_unique');
            $table->dropIndex('motorcycles_status_index');
            $table->dropIndex('motorcycles_price_index');
            $table->dropIndex('motorcycles_is_latest_index');
            $table->dropIndex('motorcycles_is_top_index');
            $table->dropIndex('motorcycles_brand_category_index');
        });

        Schema::table('brands', function (Blueprint $table) {
            $table->dropIndex('brands_name_index');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('categories_name_index');
            $table->dropIndex('categories_is_common_index');
        });
    }
};
