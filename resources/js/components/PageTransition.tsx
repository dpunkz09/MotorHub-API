import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

export default function PageTransition({ children, className }: PageTransitionProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation after mount
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={cn(
                'transition-all duration-300 ease-out',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                className
            )}
        >
            {children}
        </div>
    );
}
