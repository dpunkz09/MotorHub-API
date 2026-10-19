<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                "name" => "Cafe Racer",
                "slug" => "cafe-racer",
                "description" => "Known for low handlebars and minimalist retro styling.",
                "cover_url" => "/categories/cafe-racer.jpg",
                "is_common" => true
            ],
            [
                "name" => "Retro Scooter",
                "slug" => "retro-scooter",
                "description" => "Combines vintage aesthetics with modern conveniences like storage and comfort.",
                "cover_url" => "/categories/retro-scooter.jpg",
                "is_common" => true
            ],
            [
                "name" => "Moped",
                "slug" => "moped",
                "description" => "Extremely fuel-efficient and easy to operate.",
                "cover_url" => "/categories/moped.jpg",
                "is_common" => true
            ],
            [
                "name" => "Sports Bike",
                "slug" => "sports-bike",
                "description" => "Built for racing and high-speed road performance.",
                "cover_url" => "/categories/sports-bike.jpg",
                "is_common" => true
            ],
            [
                "name" => "Naked Sports",
                "slug" => "naked-sports-bike",
                "description" => "Combines sporty performance with a more relaxed and upright riding position.",
                "cover_url" => "/categories/naked-sports-bike.jpg",
                "is_common" => true
            ],
            [
                "name" => "Touring",
                "slug" => "touring",
                "description" => "Prioritizes rider comfort and storage capacity for extended journeys.",
                "cover_url" => "/categories/touring.jpg",
                "is_common" => true
            ],
            [
                "name" => "Dirt Bike",
                "slug" => "dirt-bike",
                "description" => "Specially designed for off-road adventures and agility.",
                "cover_url" => "/categories/dirt-bike.jpg",
                "is_common" => true
            ],
            [
                "name" => "Expressway",
                "slug" => "expressway",
                "description" => "Geared for high-speed travel on highways.",
                "cover_url" => "/categories/expressway.jpg",
                "is_common" => true
            ],
            [
                "name" => "Scooter",
                "slug" => "scooter",
                "description" => "Excellent for urban commuting and ease of use.",
                "cover_url" => "/categories/scooter.jpg",
                "is_common" => true
            ],
            [
                "name" => "Adventure",
                "slug" => "adventure",
                "description" => "Combines off-road capability with touring comfort and durability.",
                "cover_url" => "/categories/adventure.jpg",
                "is_common" => true
            ],
            [
                "name" => "Cruiser",
                "slug" => "cruiser",
                "description" => "Designed for comfort and laid-back cruising, often with a retro aesthetic.",
                "cover_url" => "/categories/cruiser.jpg",
                "is_common" => false
            ],
            [
                "name" => "Bobber",
                "slug" => "bobber",
                "description" => "Distinctive for their \"bare-bones\" styling and low stance.",
                "cover_url" => "/categories/bobber.jpg",
                "is_common" => false
            ],
            [
                "name" => "Chopper",
                "slug" => "chopper",
                "description" => "Iconic for their stretched, dramatic designs, popularized in the 1960s.",
                "cover_url" => "/categories/chopper.jpg",
                "is_common" => false
            ],
            [
                "name" => "Dual-Sport",
                "slug" => "dual-sport",
                "description" => "Versatile for both city streets and rugged terrain.",
                "cover_url" => "/categories/dual-sport.jpg",
                "is_common" => false
            ]
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
