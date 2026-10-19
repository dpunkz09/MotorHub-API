import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { User, ApiKey } from '@/types';
import { Button, Badge, Input } from '@/components/ui';
import { Plus, Copy, Power, Trash2, Key, Globe, Lock, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useConfetti } from '@/hooks/use-confetti';

interface Props {
    auth: { user: User };
    apiKeys: ApiKey[];
    accessMode: string;
}

export default function SettingsIndex({ auth, apiKeys, accessMode }: Props) {
    const [mode, setMode] = useState(accessMode);
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [keyName, setKeyName] = useState('');
    const [expiresInDays, setExpiresInDays] = useState<number | ''>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const { fire } = useConfetti();

    const handleModeChange = async (newMode: string) => {
        try {
            const response = await fetch('/admin/settings/access-mode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ mode: newMode }),
            });

            if (response.ok) {
                setMode(newMode);
                toast({ title: 'Access Mode Updated', description: `API is now ${newMode}`, variant: 'success' });
                router.reload();
            } else {
                toast({ title: 'Update Failed', variant: 'error' });
            }
        } catch (error) {
            toast({ title: 'Error', variant: 'error' });
        }
    };

    const handleGenerateKey = async () => {
        if (!keyName.trim()) {
            toast({ title: 'Missing Name', description: 'Please enter a key name', variant: 'warning' });
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch('/admin/settings/api-keys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    name: keyName,
                    expires_in_days: expiresInDays || null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                fire({ particleCount: 75, spread: 60, origin: { x: 0.5, y: 0.6 } });
                setGeneratedKey(data.data.key);
                setKeyName('');
                setExpiresInDays('');
                toast({ title: 'API Key Generated', description: 'Save it now - you won\'t see it again!', variant: 'success' });
                router.reload({ only: ['apiKeys'] });
            } else {
                toast({ title: 'Generation Failed', variant: 'error' });
            }
        } catch (error) {
            toast({ title: 'Error', variant: 'error' });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleToggleKey = async (id: number) => {
        try {
            const response = await fetch(`/admin/settings/api-keys/${id}/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                toast({ title: 'API Key Updated', variant: 'success' });
                router.reload({ only: ['apiKeys'] });
            } else {
                toast({ title: 'Toggle Failed', variant: 'error' });
            }
        } catch (error) {
            toast({ title: 'Error', variant: 'error' });
        }
    };

    const handleDeleteKey = async (id: number, name: string) => {
        if (!confirm(`Delete API key "${name}"? This cannot be undone.`)) return;

        try {
            const response = await fetch(`/admin/settings/api-keys/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                toast({ title: 'API Key Deleted', variant: 'success' });
                router.reload({ only: ['apiKeys'] });
            } else {
                toast({ title: 'Delete Failed', variant: 'error' });
            }
        } catch (error) {
            toast({ title: 'Error', variant: 'error' });
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied!', description: 'API key copied to clipboard', variant: 'success' });
    };

    return (
        <AppShell auth={auth} breadcrumbs={[{ label: 'Settings' }]} title="API Settings">
            <Head title="Settings" />
            
            {/* API Access Mode */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Lock className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">API Access Control</h2>
                </div>
                
                <div className="space-y-4">
                    <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        style={{ borderColor: mode === 'public' ? 'rgb(37 99 235)' : 'rgb(229 231 235)' }}>
                        <input type="radio" name="access_mode" value="public" checked={mode === 'public'} onChange={() => handleModeChange('public')}
                            className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-600" />
                                <div className="font-medium text-gray-900 dark:text-gray-100">Public Access</div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Anyone can access the API without authentication
                            </div>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        style={{ borderColor: mode === 'protected' ? 'rgb(37 99 235)' : 'rgb(229 231 235)' }}>
                        <input type="radio" name="access_mode" value="protected" checked={mode === 'protected'} onChange={() => handleModeChange('protected')}
                            className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <Key className="h-4 w-4 text-blue-600" />
                                <div className="font-medium text-gray-900 dark:text-gray-100">Protected (API Key Required)</div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Requires a valid API key to access the API
                            </div>
                        </div>
                    </label>
                </div>

                {mode === 'protected' && (
                    <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                                <p className="font-medium mb-1">Protected Mode Active</p>
                                <p>API requests must include the key in <code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded text-xs">X-API-Key</code> header or <code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded text-xs">api_key</code> parameter.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* API Keys Management */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">API Keys</h2>
                    <Button variant="primary" onClick={() => setShowKeyModal(true)}>
                        <Plus className="h-4 w-4" />
                        Generate New Key
                    </Button>
                </div>

                {apiKeys.length === 0 ? (
                    <div className="text-center py-12">
                        <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No API keys generated yet.</p>
                        <Button variant="primary" onClick={() => setShowKeyModal(true)}>
                            <Plus className="h-4 w-4" />
                            Generate Your First Key
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Key</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Last Used</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                {apiKeys.map((apiKey) => (
                                    <tr key={apiKey.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{apiKey.name}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                    {apiKey.key.substring(0, 20)}...
                                                </code>
                                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiKey.key)}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={apiKey.is_active ? 'success' : 'danger'}>
                                                {apiKey.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {apiKey.last_used_at ? new Date(apiKey.last_used_at).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleToggleKey(apiKey.id)}>
                                                    <Power className="h-4 w-4" />
                                                    {apiKey.is_active ? 'Disable' : 'Enable'}
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteKey(apiKey.id, apiKey.name || 'this key')}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Generate Key Modal */}
            {showKeyModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                            {generatedKey ? 'API Key Generated' : 'Generate New API Key'}
                        </h3>

                        {generatedKey ? (
                            <div>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            <strong>Save this key now!</strong> You won't be able to see it again.
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your API Key</label>
                                    <div className="flex gap-2">
                                        <Input type="text" value={generatedKey} readOnly className="flex-1 font-mono text-sm" />
                                        <Button variant="secondary" onClick={() => copyToClipboard(generatedKey)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button onClick={() => { setGeneratedKey(null); setShowKeyModal(false); }}>Close</Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-4">
                                    <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Key Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input type="text" id="keyName" value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="e.g., Mobile App" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="expiresInDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Expires In (days)
                                    </label>
                                    <Input type="number" id="expiresInDays" value={expiresInDays} onChange={(e) => setExpiresInDays(e.target.value ? parseInt(e.target.value) : '')}
                                        placeholder="Leave empty for no expiration" min="1" max="365" />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Leave empty for permanent key</p>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button variant="secondary" onClick={() => setShowKeyModal(false)}>Cancel</Button>
                                    <Button variant="primary" onClick={handleGenerateKey} isLoading={isGenerating}>Generate</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AppShell>
    );
}
