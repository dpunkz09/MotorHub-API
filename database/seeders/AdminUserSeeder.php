<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default admin user
        User::firstOrCreate(
            ['email' => 'admin@jpaworx.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('@Vxk9ud4m123'),
                'is_admin' => true,
            ]
        );

        $this->command->info('Admin user created:');
        $this->command->info('Email: admin@jpaworx.com');
        $this->command->info('Password: @Vxk9ud4m123');
    }
}
