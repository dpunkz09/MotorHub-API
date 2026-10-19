import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { User } from '@/types';
import { Button, Badge } from '@/components/ui';
import { Upload, FileJson, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { route } from '@/lib/route';

interface Props {
    auth: { user: User };
}

export default function MotorcyclesImport({ auth }: Props) {
    const [jsonInput, setJsonInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleImport = async () => {
        if (!jsonInput.trim()) {
            toast({ title: 'Missing Data', description: 'Please enter JSON data', variant: 'warning' });
            return;
        }

        try {
            let motorcycles = JSON.parse(jsonInput);
            
            // Auto-detect nested brand format and convert
            if (motorcycles.name && Array.isArray(motorcycles.motorcycles)) {
                const brandName = motorcycles.name;
                motorcycles = motorcycles.motorcycles.map((m: any) => ({
                    ...m,
                    brand: m.brand || brandName,
                }));
                toast({ title: 'Format Detected', description: `Converted ${motorcycles.length} motorcycles from nested brand format`, variant: 'success' });
            }
            
            if (!Array.isArray(motorcycles)) {
                toast({ title: 'Invalid Format', description: 'JSON must be an array', variant: 'error' });
                return;
            }

            setIsSubmitting(true);
            setResult(null);

            const response = await fetch('/api/motorcycles/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ motorcycles }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
                if (data.success) {
                    toast({ title: 'Import Successful', description: data.message, variant: 'success' });
                    setTimeout(() => router.visit(route('admin.motorcycles.index')), 2000);
                }
            } else {
                toast({ title: 'Import Failed', description: data.message || 'Unknown error', variant: 'error' });
                setResult(data);
            }
        } catch (error: any) {
            toast({ title: 'Error', description: error.message.includes('JSON') ? 'Invalid JSON format' : error.message, variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const sampleJson = `[
  {
    "name": "CBR1000RR",
    "slug": "cbr1000rr",
    "brand": "Honda",
    "category": "Sports Bike",
    "model_year": 2024,
    "price": 16999,
    "status": "available"
  }
]`;

    return (
        <AppShell auth={auth} breadcrumbs={[{ label: 'Motorcycles', href: route('admin.motorcycles.index') }, { label: 'Import' }]} title="Import Motorcycles">
            <Head title="Import Motorcycles" />

            <div className="max-w-4xl">
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <p className="font-medium mb-1">Paste your JSON array below</p>
                            <p className="mb-2">Supports both flat array and nested brand format. Use brand/category names (auto-matched) or IDs.</p>
                            <Link href={route('admin.motorcycles.convert')} className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                                <RefreshCw className="h-3 w-3" />
                                Need to convert nested brand JSON?
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6 mb-6">
                    <label htmlFor="json-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        JSON Data
                    </label>
                    <textarea
                        id="json-input"
                        rows={18}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder={sampleJson}
                    />
                    
                    <div className="mt-4 flex justify-between items-center">
                        <Button type="button" variant="ghost" onClick={() => setJsonInput(sampleJson)}>
                            <FileJson className="h-4 w-4" />
                            Load Sample
                        </Button>
                        
                        <div className="flex gap-3">
                            <Link href={route('admin.motorcycles.index')}>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </Link>
                            <Button onClick={handleImport} isLoading={isSubmitting} variant="primary">
                                <Upload className="h-4 w-4" />
                                Import Motorcycles
                            </Button>
                        </div>
                    </div>
                </div>

                {result && (
                    <div className={`rounded-lg p-6 border ${
                        result.success 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                        <div className="flex items-start gap-3">
                            {result.success ? (
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <h3 className={`font-semibold mb-2 ${result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                                    Import Result
                                </h3>
                                <p className={result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                                    {result.message}
                                </p>
                                
                                {result.data && (
                                    <div className="mt-3 flex gap-4 text-sm">
                                        <Badge variant="success">Imported: {result.data.imported}</Badge>
                                        <Badge variant="default">Skipped: {result.data.skipped}</Badge>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
