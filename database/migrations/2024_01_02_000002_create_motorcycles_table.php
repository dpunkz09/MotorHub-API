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
        Schema::create('motorcycles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->constrained('brands')->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            
            // Basic Information
            $table->string('model');
            $table->string('slug')->unique();
            $table->string('status')->default('Available'); // Available, Discontinued, Coming Soon
            $table->string('release_date')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->text('description')->nullable();
            
            // Engine Specifications
            $table->string('frame')->nullable();
            $table->integer('engine_displacement')->nullable(); // in cc
            $table->string('stroke_number')->nullable(); // 4-stroke, 2-stroke
            $table->string('cylinder')->nullable();
            $table->string('valves')->nullable();
            $table->string('overhead_cam')->nullable(); // SOHC, DOHC
            $table->string('cooling_system')->nullable(); // Air-cooled, Liquid-cooled
            $table->string('compression_ratio')->nullable();
            $table->string('maximum_power')->nullable();
            $table->string('maximum_torque')->nullable();
            $table->string('starting_system')->nullable(); // Electric, Kick, Both
            $table->string('engine_oil_capacity')->nullable();
            $table->string('fuel_system')->nullable(); // Carburetor, Fuel injection
            $table->string('fuel_consumption')->nullable(); // Changed to string to store "45 km/L" format
            $table->string('ignition_type')->nullable();
            
            // Performance
            $table->string('top_speed')->nullable();
            $table->string('transmission')->nullable(); // Manual, Automatic, CVT
            $table->string('transmission_type')->nullable(); // 4-speed, 5-speed, 6-speed
            
            // Suspension & Brakes
            $table->string('front_suspension_type')->nullable();
            $table->string('rear_suspension_type')->nullable();
            $table->string('front_brake_type')->nullable();
            $table->boolean('is_front_abs')->default(false);
            $table->string('rear_brake_type')->nullable();
            $table->boolean('is_rear_abs')->default(false);
            
            // Wheels & Tires
            $table->string('front_tyre_size_and_type')->nullable();
            $table->string('rear_tyre_size_and_type')->nullable();
            $table->string('wheel_type')->nullable(); // Cast Wheel, Spoke Wheel
            $table->string('wheel_base')->nullable();
            
            // Dimensions & Weight
            $table->string('dimension_length')->nullable();
            $table->string('dimension_width')->nullable();
            $table->string('dimension_height')->nullable();
            $table->string('curb_weight')->nullable();
            $table->string('seat_height')->nullable();
            $table->string('ground_clearance')->nullable();
            $table->string('fuel_tank_capacity')->nullable();
            
            // Electrical & Features
            $table->string('battery_type')->nullable();
            $table->boolean('is_keyless')->default(false);
            $table->boolean('is_electric_motorcycle')->default(false);
            $table->boolean('has_charging_port')->default(false);
            $table->text('special_features')->nullable();
            
            // Appearance
            $table->text('colors_available')->nullable(); // Comma-separated
            $table->string('transparent_url')->nullable(); // Product image URL
            
            // SEO & Discovery
            $table->boolean('is_latest')->default(false);
            $table->boolean('is_top_motorcycle')->default(false);
            $table->string('brand_ranking')->nullable();
            $table->text('other_keywords')->nullable();
            
            // Related Motorcycles
            $table->string('related_motorcycle_1')->nullable();
            $table->string('related_motorcycle_2')->nullable();
            $table->string('related_motorcycle_3')->nullable();
            $table->string('related_motorcycle_4')->nullable();
            $table->string('related_motorcycle_5')->nullable();
            $table->string('related_motorcycle_6')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('brand_id');
            $table->index('category_id');
            $table->index('status');
            $table->index('is_latest');
            $table->index('is_top_motorcycle');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('motorcycles');
    }
};
