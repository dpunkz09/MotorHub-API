<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Brand extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'logo_url',
        'description',
    ];

    /**
     * Get the motorcycles for this brand.
     */
    public function motorcycles(): HasMany
    {
        return $this->hasMany(Motorcycle::class);
    }
}
