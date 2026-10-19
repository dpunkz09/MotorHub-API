import { Head, Link, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import AppShell from '@/components/AppShell';
import { User, Brand, Category, Motorcycle } from '@/types';
import { Button, Input, Select } from '@/components/ui';
import { Save, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useConfetti } from '@/hooks/use-confetti';
import { route } from '@/lib/route';

interface Props {
    auth: { user: User };
    motorcycle: Motorcycle & { brand: Brand; category?: Category };
    brands: Brand[];
    categories: Category[];
}

export default function EditMotorcycle({ auth, motorcycle, brands, categories }: Props) {
    const [formData, setFormData] = useState({
        model: motorcycle.model || '',
        slug: motorcycle.slug || '',
        brand_id: motorcycle.brand_id?.toString() || '',
        category_id: motorcycle.category_id?.toString() || '',
        status: motorcycle.status || 'available',
        release_date: motorcycle.release_date || '',
        price: motorcycle.price?.toString() || '',
        description: motorcycle.description || '',
        frame: motorcycle.frame || '',
        engine_displacement: motorcycle.engine_displacement?.toString() || '',
        stroke_number: motorcycle.stroke_number || '',
        cylinder: motorcycle.cylinder || '',
        valves: motorcycle.valves || '',
        overhead_cam: motorcycle.overhead_cam || '',
        cooling_system: motorcycle.cooling_system || '',
        compression_ratio: motorcycle.compression_ratio || '',
        maximum_power: motorcycle.maximum_power || '',
        maximum_torque: motorcycle.maximum_torque || '',
        starting_system: motorcycle.starting_system || '',
        engine_oil_capacity: motorcycle.engine_oil_capacity || '',
        fuel_system: motorcycle.fuel_system || '',
        fuel_consumption: motorcycle.fuel_consumption || '',
        ignition_type: motorcycle.ignition_type || '',
        top_speed: motorcycle.top_speed || '',
        transmission: motorcycle.transmission || '',
        transmission_type: motorcycle.transmission_type || '',
        front_suspension_type: motorcycle.front_suspension_type || '',
        rear_suspension_type: motorcycle.rear_suspension_type || '',
        front_brake_type: motorcycle.front_brake_type || '',
        is_front_abs: motorcycle.is_front_abs || false,
        rear_brake_type: motorcycle.rear_brake_type || '',
        is_rear_abs: motorcycle.is_rear_abs || false,
        front_tyre_size_and_type: motorcycle.front_tyre_size_and_type || '',
        rear_tyre_size_and_type: motorcycle.rear_tyre_size_and_type || '',
        wheel_type: motorcycle.wheel_type || '',
        wheel_base: motorcycle.wheel_base || '',
        dimension_length: motorcycle.dimension_length || '',
        dimension_width: motorcycle.dimension_width || '',
        dimension_height: motorcycle.dimension_height || '',
        curb_weight: motorcycle.curb_weight || '',
        seat_height: motorcycle.seat_height || '',
        ground_clearance: motorcycle.ground_clearance || '',
        fuel_tank_capacity: motorcycle.fuel_tank_capacity || '',
        battery_type: motorcycle.battery_type || '',
        is_keyless: motorcycle.is_keyless || false,
        is_electric_motorcycle: motorcycle.is_electric_motorcycle || false,
        has_charging_port: motorcycle.has_charging_port || false,
        special_features: motorcycle.special_features || '',
        colors_available: motorcycle.colors_available || '',
        transparent_url: motorcycle.transparent_url || '',
        is_latest: motorcycle.is_latest || false,
        is_top_motorcycle: motorcycle.is_top_motorcycle || false,
        brand_ranking: motorcycle.brand_ranking?.toString() || '',
        other_keywords: motorcycle.other_keywords || '',
        related_motorcycle_1: motorcycle.related_motorcycle_1 || '',
        related_motorcycle_2: motorcycle.related_motorcycle_2 || '',
        related_motorcycle_3: motorcycle.related_motorcycle_3 || '',
        related_motorcycle_4: motorcycle.related_motorcycle_4 || '',
        related_motorcycle_5: motorcycle.related_motorcycle_5 || '',
        related_motorcycle_6: motorcycle.related_motorcycle_6 || '',
    });
    const [processing, setProcessing] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        engine: false,
        transmission: false,
        suspension: false,
        dimensions: false,
        features: false,
        seo: false,
    });
    const { celebrate } = useConfetti();

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };


    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await fetch(`/api/motorcycles/${motorcycle.id}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    engine_displacement: formData.engine_displacement ? parseFloat(formData.engine_displacement) : null,
                    brand_ranking: formData.brand_ranking ? parseInt(formData.brand_ranking) : null,
                }),
            });
            const result = await response.json();

            if (response.ok && result.success) {
                celebrate();
                toast({ 
                    title: 'Motorcycle Updated', 
                    description: `"${formData.model}" has been updated`, 
                    variant: 'success' 
                });
                setTimeout(() => {
                    router.visit(route('admin.motorcycles.index'));
                }, 500);
            } else {
                toast({ 
                    title: 'Update Failed', 
                    description: result.message || 'An error occurred', 
                    variant: 'error' 
                });
            }
        } catch (error) {
            toast({ 
                title: 'Error', 
                description: 'An error occurred while updating the motorcycle', 
                variant: 'error' 
            });
        } finally {
            setProcessing(false);
        }
    };

    const generateSlug = () => {
        const slug = formData.model.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        setFormData({ ...formData, slug });
    };

    const SectionHeader = ({ title, section }: { title: string; section: keyof typeof expandedSections }) => (
        <button
            type="button"
            onClick={() => toggleSection(section)}
            className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
        >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            {expandedSections[section] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
    );

    return (
        <AppShell 
            auth={auth} 
            breadcrumbs={[
                { label: 'Motorcycles', href: route('admin.motorcycles.index') }, 
                { label: motorcycle.model || 'Edit' }
            ]} 
            title={`Edit ${motorcycle.model}`}
        >
            <Head title={`Edit ${motorcycle.model}`} />

            <div className="max-w-5xl">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <SectionHeader title="Basic Information" section="basic" />
                        {expandedSections.basic && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Model Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="model" 
                                            value={formData.model} 
                                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                            onBlur={generateSlug} 
                                            required 
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Slug <span className="text-red-500">*</span>
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="slug" 
                                            value={formData.slug} 
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Brand <span className="text-red-500">*</span>
                                        </label>
                                        <Select 
                                            id="brand_id" 
                                            value={formData.brand_id} 
                                            onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })} 
                                            required
                                        >
                                            <option value="">Select Brand</option>
                                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                        </Select>
                                    </div>

                                    <div>
                                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Category
                                        </label>
                                        <Select 
                                            id="category_id" 
                                            value={formData.category_id} 
                                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Status
                                        </label>
                                        <Select 
                                            id="status" 
                                            value={formData.status} 
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'available' | 'sold' | 'reserved' })}
                                        >
                                            <option value="available">Available</option>
                                            <option value="sold">Sold</option>
                                            <option value="reserved">Reserved</option>
                                        </Select>
                                    </div>

                                    <div>
                                        <label htmlFor="release_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Release Date
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="release_date" 
                                            value={formData.release_date} 
                                            onChange={(e) => setFormData({ ...formData, release_date: e.target.value })} 
                                            placeholder="2024"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Price
                                        </label>
                                        <Input 
                                            type="number" 
                                            id="price" 
                                            value={formData.price} 
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                                            placeholder="0.00" 
                                            step="0.01" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="transparent_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Transparent Image URL
                                    </label>
                                    <Input 
                                        type="text" 
                                        id="transparent_url" 
                                        value={formData.transparent_url} 
                                        onChange={(e) => setFormData({ ...formData, transparent_url: e.target.value })} 
                                        placeholder="/brand/model.webp" 
                                    />
                                </div>
                            </div>
                        )}

                        {/* Engine Specifications */}
                        <SectionHeader title="Engine Specifications" section="engine" />
                        {expandedSections.engine && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="frame" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Frame Type
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="frame" 
                                            value={formData.frame} 
                                            onChange={(e) => setFormData({ ...formData, frame: e.target.value })} 
                                            placeholder="Underbone, Backbone, etc."
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="engine_displacement" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Engine Displacement (cc)
                                        </label>
                                        <Input 
                                            type="number" 
                                            id="engine_displacement" 
                                            value={formData.engine_displacement} 
                                            onChange={(e) => setFormData({ ...formData, engine_displacement: e.target.value })} 
                                            placeholder="100"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="stroke_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Stroke
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="stroke_number" 
                                            value={formData.stroke_number} 
                                            onChange={(e) => setFormData({ ...formData, stroke_number: e.target.value })} 
                                            placeholder="4-stroke, 2-stroke"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="cylinder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Cylinder
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="cylinder" 
                                            value={formData.cylinder} 
                                            onChange={(e) => setFormData({ ...formData, cylinder: e.target.value })} 
                                            placeholder="1, 2, 4"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="valves" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Valves
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="valves" 
                                            value={formData.valves} 
                                            onChange={(e) => setFormData({ ...formData, valves: e.target.value })} 
                                            placeholder="2, 4"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="overhead_cam" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Overhead Cam
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="overhead_cam" 
                                            value={formData.overhead_cam} 
                                            onChange={(e) => setFormData({ ...formData, overhead_cam: e.target.value })} 
                                            placeholder="SOHC, DOHC"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="cooling_system" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Cooling System
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="cooling_system" 
                                            value={formData.cooling_system} 
                                            onChange={(e) => setFormData({ ...formData, cooling_system: e.target.value })} 
                                            placeholder="Air-cooled, Liquid-cooled"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="compression_ratio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Compression Ratio
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="compression_ratio" 
                                            value={formData.compression_ratio} 
                                            onChange={(e) => setFormData({ ...formData, compression_ratio: e.target.value })} 
                                            placeholder="10.5:1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="maximum_power" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Maximum Power
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="maximum_power" 
                                            value={formData.maximum_power} 
                                            onChange={(e) => setFormData({ ...formData, maximum_power: e.target.value })} 
                                            placeholder="4.3hp @ 6000rpm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="maximum_torque" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Maximum Torque
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="maximum_torque" 
                                            value={formData.maximum_torque} 
                                            onChange={(e) => setFormData({ ...formData, maximum_torque: e.target.value })} 
                                            placeholder="6.5Nm @ 3500rpm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="starting_system" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Starting System
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="starting_system" 
                                            value={formData.starting_system} 
                                            onChange={(e) => setFormData({ ...formData, starting_system: e.target.value })} 
                                            placeholder="Kick & Electric"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="engine_oil_capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Engine Oil Capacity
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="engine_oil_capacity" 
                                            value={formData.engine_oil_capacity} 
                                            onChange={(e) => setFormData({ ...formData, engine_oil_capacity: e.target.value })} 
                                            placeholder="0.8L"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="fuel_system" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Fuel System
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="fuel_system" 
                                            value={formData.fuel_system} 
                                            onChange={(e) => setFormData({ ...formData, fuel_system: e.target.value })} 
                                            placeholder="Carburetor, Fuel Injection"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="fuel_consumption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Fuel Consumption
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="fuel_consumption" 
                                            value={formData.fuel_consumption} 
                                            onChange={(e) => setFormData({ ...formData, fuel_consumption: e.target.value })} 
                                            placeholder="65 km/L"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="ignition_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Ignition Type
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="ignition_type" 
                                            value={formData.ignition_type} 
                                            onChange={(e) => setFormData({ ...formData, ignition_type: e.target.value })} 
                                            placeholder="CDI, TCI"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="top_speed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Top Speed
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="top_speed" 
                                            value={formData.top_speed} 
                                            onChange={(e) => setFormData({ ...formData, top_speed: e.target.value })} 
                                            placeholder="120 km/h"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transmission & Suspension */}
                        <SectionHeader title="Transmission & Suspension" section="transmission" />
                        {expandedSections.transmission && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Transmission
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="transmission" 
                                            value={formData.transmission} 
                                            onChange={(e) => setFormData({ ...formData, transmission: e.target.value })} 
                                            placeholder="Manual, Automatic"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="transmission_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Transmission Type
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="transmission_type" 
                                            value={formData.transmission_type} 
                                            onChange={(e) => setFormData({ ...formData, transmission_type: e.target.value })} 
                                            placeholder="6-Speed, Single Speed"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="front_suspension_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Front Suspension
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="front_suspension_type" 
                                            value={formData.front_suspension_type} 
                                            onChange={(e) => setFormData({ ...formData, front_suspension_type: e.target.value })} 
                                            placeholder="Telescopic Fork"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="rear_suspension_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Rear Suspension
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="rear_suspension_type" 
                                            value={formData.rear_suspension_type} 
                                            onChange={(e) => setFormData({ ...formData, rear_suspension_type: e.target.value })} 
                                            placeholder="Swing Arm, Monoshock"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="front_brake_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Front Brake Type
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="front_brake_type" 
                                            value={formData.front_brake_type} 
                                            onChange={(e) => setFormData({ ...formData, front_brake_type: e.target.value })} 
                                            placeholder="Disc, Drum"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="is_front_abs" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mt-8">
                                            <input
                                                type="checkbox"
                                                id="is_front_abs"
                                                checked={formData.is_front_abs}
                                                onChange={(e) => setFormData({ ...formData, is_front_abs: e.target.checked })}
                                                className="rounded"
                                            />
                                            Front ABS
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="rear_brake_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Rear Brake Type
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="rear_brake_type" 
                                            value={formData.rear_brake_type} 
                                            onChange={(e) => setFormData({ ...formData, rear_brake_type: e.target.value })} 
                                            placeholder="Disc, Drum"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="is_rear_abs" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mt-8">
                                            <input
                                                type="checkbox"
                                                id="is_rear_abs"
                                                checked={formData.is_rear_abs}
                                                onChange={(e) => setFormData({ ...formData, is_rear_abs: e.target.checked })}
                                                className="rounded"
                                            />
                                            Rear ABS
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="front_tyre_size_and_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Front Tyre
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="front_tyre_size_and_type" 
                                            value={formData.front_tyre_size_and_type} 
                                            onChange={(e) => setFormData({ ...formData, front_tyre_size_and_type: e.target.value })} 
                                            placeholder="R16"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="rear_tyre_size_and_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Rear Tyre
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="rear_tyre_size_and_type" 
                                            value={formData.rear_tyre_size_and_type} 
                                            onChange={(e) => setFormData({ ...formData, rear_tyre_size_and_type: e.target.value })} 
                                            placeholder="R16"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="wheel_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Wheel Type
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="wheel_type" 
                                            value={formData.wheel_type} 
                                            onChange={(e) => setFormData({ ...formData, wheel_type: e.target.value })} 
                                            placeholder="Wire Spoke, Alloy"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dimensions & Capacity */}
                        <SectionHeader title="Dimensions & Capacity" section="dimensions" />
                        {expandedSections.dimensions && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="dimension_length" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Length
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="dimension_length" 
                                            value={formData.dimension_length} 
                                            onChange={(e) => setFormData({ ...formData, dimension_length: e.target.value })} 
                                            placeholder="1895mm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="dimension_width" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Width
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="dimension_width" 
                                            value={formData.dimension_width} 
                                            onChange={(e) => setFormData({ ...formData, dimension_width: e.target.value })} 
                                            placeholder="670mm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="dimension_height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Height
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="dimension_height" 
                                            value={formData.dimension_height} 
                                            onChange={(e) => setFormData({ ...formData, dimension_height: e.target.value })} 
                                            placeholder="1077mm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="wheel_base" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Wheelbase
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="wheel_base" 
                                            value={formData.wheel_base} 
                                            onChange={(e) => setFormData({ ...formData, wheel_base: e.target.value })} 
                                            placeholder="1228mm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="seat_height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Seat Height
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="seat_height" 
                                            value={formData.seat_height} 
                                            onChange={(e) => setFormData({ ...formData, seat_height: e.target.value })} 
                                            placeholder="779mm"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="ground_clearance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Ground Clearance
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="ground_clearance" 
                                            value={formData.ground_clearance} 
                                            onChange={(e) => setFormData({ ...formData, ground_clearance: e.target.value })} 
                                            placeholder="155mm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="curb_weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Curb Weight
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="curb_weight" 
                                            value={formData.curb_weight} 
                                            onChange={(e) => setFormData({ ...formData, curb_weight: e.target.value })} 
                                            placeholder="86kg"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="fuel_tank_capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Fuel Tank Capacity
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="fuel_tank_capacity" 
                                            value={formData.fuel_tank_capacity} 
                                            onChange={(e) => setFormData({ ...formData, fuel_tank_capacity: e.target.value })} 
                                            placeholder="4L"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="battery_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Battery Type
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="battery_type" 
                                            value={formData.battery_type} 
                                            onChange={(e) => setFormData({ ...formData, battery_type: e.target.value })} 
                                            placeholder="12V 5Ah"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Features & Colors */}
                        <SectionHeader title="Features & Colors" section="features" />
                        {expandedSections.features && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="is_keyless" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <input
                                                type="checkbox"
                                                id="is_keyless"
                                                checked={formData.is_keyless}
                                                onChange={(e) => setFormData({ ...formData, is_keyless: e.target.checked })}
                                                className="rounded"
                                            />
                                            Keyless
                                        </label>
                                    </div>

                                    <div>
                                        <label htmlFor="is_electric_motorcycle" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <input
                                                type="checkbox"
                                                id="is_electric_motorcycle"
                                                checked={formData.is_electric_motorcycle}
                                                onChange={(e) => setFormData({ ...formData, is_electric_motorcycle: e.target.checked })}
                                                className="rounded"
                                            />
                                            Electric Motorcycle
                                        </label>
                                    </div>

                                    <div>
                                        <label htmlFor="has_charging_port" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <input
                                                type="checkbox"
                                                id="has_charging_port"
                                                checked={formData.has_charging_port}
                                                onChange={(e) => setFormData({ ...formData, has_charging_port: e.target.checked })}
                                                className="rounded"
                                            />
                                            Charging Port
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="special_features" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Special Features
                                    </label>
                                    <Input 
                                        type="text" 
                                        id="special_features" 
                                        value={formData.special_features} 
                                        onChange={(e) => setFormData({ ...formData, special_features: e.target.value })} 
                                        placeholder="Metal Fairings, LED Lights, etc."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="colors_available" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Colors Available
                                    </label>
                                    <Input 
                                        type="text" 
                                        id="colors_available" 
                                        value={formData.colors_available} 
                                        onChange={(e) => setFormData({ ...formData, colors_available: e.target.value })} 
                                        placeholder="Silver, Red, Green, Blue, Black"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="is_latest" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <input
                                                type="checkbox"
                                                id="is_latest"
                                                checked={formData.is_latest}
                                                onChange={(e) => setFormData({ ...formData, is_latest: e.target.checked })}
                                                className="rounded"
                                            />
                                            Latest Model
                                        </label>
                                    </div>

                                    <div>
                                        <label htmlFor="is_top_motorcycle" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <input
                                                type="checkbox"
                                                id="is_top_motorcycle"
                                                checked={formData.is_top_motorcycle}
                                                onChange={(e) => setFormData({ ...formData, is_top_motorcycle: e.target.checked })}
                                                className="rounded"
                                            />
                                            Top Motorcycle
                                        </label>
                                    </div>

                                    <div>
                                        <label htmlFor="brand_ranking" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Brand Ranking
                                        </label>
                                        <Input 
                                            type="number" 
                                            id="brand_ranking" 
                                            value={formData.brand_ranking} 
                                            onChange={(e) => setFormData({ ...formData, brand_ranking: e.target.value })} 
                                            placeholder="1-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SEO & Related */}
                        <SectionHeader title="SEO & Related Motorcycles" section="seo" />
                        {expandedSections.seo && (
                            <div className="p-6 space-y-6">
                                <div>
                                    <label htmlFor="other_keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Other Keywords
                                    </label>
                                    <Input 
                                        type="text" 
                                        id="other_keywords" 
                                        value={formData.other_keywords} 
                                        onChange={(e) => setFormData({ ...formData, other_keywords: e.target.value })} 
                                        placeholder="Comma-separated keywords"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="related_motorcycle_1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Related Motorcycle 1
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="related_motorcycle_1" 
                                            value={formData.related_motorcycle_1} 
                                            onChange={(e) => setFormData({ ...formData, related_motorcycle_1: e.target.value })} 
                                            placeholder="motorcycle-slug"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="related_motorcycle_2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Related Motorcycle 2
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="related_motorcycle_2" 
                                            value={formData.related_motorcycle_2} 
                                            onChange={(e) => setFormData({ ...formData, related_motorcycle_2: e.target.value })} 
                                            placeholder="motorcycle-slug"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="related_motorcycle_3" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Related Motorcycle 3
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="related_motorcycle_3" 
                                            value={formData.related_motorcycle_3} 
                                            onChange={(e) => setFormData({ ...formData, related_motorcycle_3: e.target.value })} 
                                            placeholder="motorcycle-slug"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="related_motorcycle_4" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Related Motorcycle 4
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="related_motorcycle_4" 
                                            value={formData.related_motorcycle_4} 
                                            onChange={(e) => setFormData({ ...formData, related_motorcycle_4: e.target.value })} 
                                            placeholder="motorcycle-slug"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="related_motorcycle_5" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Related Motorcycle 5
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="related_motorcycle_5" 
                                            value={formData.related_motorcycle_5} 
                                            onChange={(e) => setFormData({ ...formData, related_motorcycle_5: e.target.value })} 
                                            placeholder="motorcycle-slug"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="related_motorcycle_6" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Related Motorcycle 6
                                        </label>
                                        <Input 
                                            type="text" 
                                            id="related_motorcycle_6" 
                                            value={formData.related_motorcycle_6} 
                                            onChange={(e) => setFormData({ ...formData, related_motorcycle_6: e.target.value })} 
                                            placeholder="motorcycle-slug"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Section */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-end gap-3">
                                <Link href={route('admin.motorcycles.index')}>
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </Link>
                                <Button type="submit" variant="primary" isLoading={processing}>
                                    <Save className="h-4 w-4" />
                                    Update Motorcycle
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    );
}
