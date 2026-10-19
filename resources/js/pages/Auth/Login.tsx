import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button, Input } from '@/components/ui';
import { LogIn, Bike } from 'lucide-react';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Admin Login" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                                <Bike className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Admin Login
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Sign in to access the motorcycle dashboard
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">{status}</p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="admin@example.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={errors.email}
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Remember me
                                </label>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={processing}
                                className="w-full"
                            >
                                <LogIn className="h-4 w-4" />
                                Sign In
                            </Button>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                        Motorcycle Admin Dashboard - Admin Access Only
                    </p>
                </div>
            </div>
        </>
    );
}
