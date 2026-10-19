<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Motorcycle extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'brand_id',
        'category_id',
        'model',
        'slug',
        'status',
        'release_date',
        'price',
        'description',
        'frame',
        'engine_displacement',
        'stroke_number',
        'cylinder',
        'valves',
        'overhead_cam',
        'cooling_system',
        'compression_ratio',
        'maximum_power',
        'maximum_torque',
        'starting_system',
        'engine_oil_capacity',
        'fuel_system',
        'fuel_consumption',
        'ignition_type',
        'top_speed',
        'transmission',
        'transmission_type',
        'front_suspension_type',
        'rear_suspension_type',
        'front_brake_type',
        'is_front_abs',
        'rear_brake_type',
        'is_rear_abs',
        'front_tyre_size_and_type',
        'rear_tyre_size_and_type',
        'wheel_type',
        'wheel_base',
        'dimension_length',
        'dimension_width',
        'dimension_height',
        'curb_weight',
        'seat_height',
        'ground_clearance',
        'fuel_tank_capacity',
        'battery_type',
        'is_keyless',
        'is_electric_motorcycle',
        'has_charging_port',
        'special_features',
        'colors_available',
        'transparent_url',
        'is_latest',
        'is_top_motorcycle',
        'brand_ranking',
        'other_keywords',
        'related_motorcycle_1',
        'related_motorcycle_2',
        'related_motorcycle_3',
        'related_motorcycle_4',
        'related_motorcycle_5',
        'related_motorcycle_6',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'engine_displacement' => 'decimal:2',
        'fuel_consumption' => 'string', // Changed from decimal to string because it contains "km/L"
        'is_front_abs' => 'boolean',
        'is_rear_abs' => 'boolean',
        'is_keyless' => 'boolean',
        'is_electric_motorcycle' => 'boolean',
        'has_charging_port' => 'boolean',
        'is_latest' => 'boolean',
        'is_top_motorcycle' => 'boolean',
    ];

    /**
     * Get the brand that owns the motorcycle.
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Get the category that owns the motorcycle.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
