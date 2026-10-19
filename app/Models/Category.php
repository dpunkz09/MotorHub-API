<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'cover_url',
        'is_common',
        'relevance',
        'meta',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_common' => 'boolean',
        'relevance' => 'integer',
        'meta' => 'array',
    ];

    /**
     * Get the motorcycles that belong to this category.
     */
    public function motorcycles()
    {
        return $this->hasMany(\App\Models\Motorcycle::class);
    }
}
