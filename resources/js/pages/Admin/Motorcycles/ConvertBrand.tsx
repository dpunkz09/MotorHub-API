import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { User } from '@/types';
import { Button } from '@/components/ui';
import { ArrowRight, Copy, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { route } from '@/lib/route';

interface Props {
    auth: { user: User };
}

export default function ConvertBrand({ auth }: Props) {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleConvert = () => {
        try {
            const data = JSON.parse(input);
            
            if (data.name && Array.isArray(data.motorcycles)) {
                const brandName = data.name;
                const converted = data.motorcycles.map((m: any) => ({
                    ...m,
                    brand: m.brand || brandName,
                }));
                setOutput(JSON.stringify(converted, null, 2));
                toast({ title: 'Converted', description: `Extracted ${converted.length} motorcycles`, variant: 'success' });
            } else {
                toast({ title: 'Invalid Format', description: 'Expected { name: "...", motorcycles: [...] }', variant: 'error' });
            }
        } catch (error: any) {
            toast({ title: 'Error', description: 'Invalid JSON', variant: 'error' });
        }
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        toast({ title: 'Copied!', description: 'Output copied to clipboard', variant: 'success' });
    };

    const sampleInput = `{
  "name": "Honda",
  "motorcycles": [
    {
      "name": "CBR1000RR",
      "slug": "cbr1000rr",
      "model_year": 2024,
      "price": 16999
    }
  ]
}`;

    return (
        <AppShell auth={auth} breadcrumbs={[{ label: 'Motorcycles', href: route('admin.motorcycles.index') }, { label: 'Convert Brand JSON' }]} title="Convert Brand JSON">
            <Head title="Convert Brand JSON" />

            <div className="max-w-6xl">
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <p className="font-medium mb-1">Convert nested brand format to flat array</p>
                            <p>Paste JSON with <code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">&#123; "name": "Brand", "motorcycles": [...] &#125;</code> format, and we'll convert it to a flat array ready for import.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Input (Nested Format)
                            </label>
                            <Button variant="ghost" size="sm" onClick={() => setInput(sampleInput)}>
                                Load Sample
                            </Button>
                        </div>
                        <textarea
                            rows={20}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={sampleInput}
                        />
                        <div className="mt-4">
                            <Button variant="primary" onClick={handleConvert} className="w-full">
                                <ArrowRight className="h-4 w-4" />
                                Convert to Flat Array
                            </Button>
                        </div>
                    </div>

                    {/* Output */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Output (Flat Array)
                            </label>
                            {output && (
                                <Button variant="ghost" size="sm" onClick={copyOutput}>
                                    <Copy className="h-4 w-4" />
                                    Copy
                                </Button>
                            )}
                        </div>
                        <textarea
                            rows={20}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-mono text-sm"
                            value={output}
                            readOnly
                            placeholder="Converted output will appear here..."
                        />
                        {output && (
                            <div className="mt-4">
                                <Link href={route('admin.motorcycles.import')}>
                                    <Button variant="success" className="w-full">
                                        Go to Import Page
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
