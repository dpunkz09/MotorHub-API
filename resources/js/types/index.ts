// Type definitions for the application

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    cover_url: string | null;
    is_common?: boolean;
    created_at: string;
    updated_at: string;
}

export interface Brand {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    logo_url: string | null;
    website_url: string | null;
    motorcycles_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Motorcycle {
    id: number;
    brand_id: number;
    category_id: number;
    model: string;
    slug: string;
    status: 'available' | 'sold' | 'reserved';
    release_date: string | null;
    price: number;
    description: string | null;
    frame: string | null;
    engine_displacement: number | null;
    stroke_number: string | null;
    cylinder: string | null;
    valves: string | null;
    overhead_cam: string | null;
    cooling_system: string | null;
    compression_ratio: string | null;
    maximum_power: string | null;
    maximum_torque: string | null;
    starting_system: string | null;
    engine_oil_capacity: string | null;
    fuel_system: string | null;
    fuel_consumption: string | null;
    ignition_type: string | null;
    top_speed: string | null;
    transmission: string | null;
    transmission_type: string | null;
    front_suspension_type: string | null;
    rear_suspension_type: string | null;
    front_brake_type: string | null;
    is_front_abs: boolean;
    rear_brake_type: string | null;
    is_rear_abs: boolean;
    front_tyre_size_and_type: string | null;
    rear_tyre_size_and_type: string | null;
    wheel_type: string | null;
    wheel_base: string | null;
    dimension_length: string | null;
    dimension_width: string | null;
    dimension_height: string | null;
    curb_weight: string | null;
    seat_height: string | null;
    ground_clearance: string | null;
    fuel_tank_capacity: string | null;
    battery_type: string | null;
    is_keyless: boolean;
    is_electric_motorcycle: boolean;
    has_charging_port: boolean;
    special_features: string | null;
    colors_available: string | null;
    transparent_url: string | null;
    image: string | null;
    is_latest: boolean;
    is_top_motorcycle: boolean;
    brand_ranking: number | null;
    other_keywords: string | null;
    related_motorcycle_1: string | null;
    related_motorcycle_2: string | null;
    related_motorcycle_3: string | null;
    related_motorcycle_4: string | null;
    related_motorcycle_5: string | null;
    related_motorcycle_6: string | null;
    created_at: string;
    updated_at: string;
    // Relationships
    brand?: Brand;
    category?: Category;
}

export interface Setting {
    id: number;
    key: string;
    value: string;
    created_at: string;
    updated_at: string;
}

export interface ApiKey {
    id: number;
    key: string;
    name: string | null;
    is_active?: boolean;
    last_used_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLinks[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
