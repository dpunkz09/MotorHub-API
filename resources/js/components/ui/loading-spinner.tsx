import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
            <Loader2 className={cn('animate-spin text-blue-600 dark:text-blue-400', sizes[size])} />
            {text && (
                <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}

export function LoadingOverlay({ text }: { text?: string }) {
    return (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
}
