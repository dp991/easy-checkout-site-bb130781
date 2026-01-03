import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
    priority?: boolean;
    aspectRatio?: 'square' | '4/3' | '16/9' | 'auto';
    fallbackSrc?: string;
    onLoad?: () => void;
    onError?: () => void;
}

export default function OptimizedImage({
    src,
    alt,
    className,
    containerClassName,
    priority = false,
    aspectRatio = 'auto',
    fallbackSrc = '/placeholder.svg',
    onLoad,
    onError,
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (priority || isInView) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px 0px', // Start loading 50px before entering viewport
                threshold: 0.01,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [priority, isInView]);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    const aspectRatioClass = {
        square: 'aspect-square',
        '4/3': 'aspect-[4/3]',
        '16/9': 'aspect-video',
        auto: '',
    }[aspectRatio];

    const imageSrc = hasError ? fallbackSrc : src;

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative overflow-hidden bg-muted',
                aspectRatioClass,
                containerClassName
            )}
        >
            {/* Skeleton placeholder - shows while loading */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/80 to-muted animate-pulse" />
            )}

            {/* Actual image - only load when in view */}
            {isInView && (
                <img
                    ref={imgRef}
                    src={imageSrc}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding={priority ? 'sync' : 'async'}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        'w-full h-full object-cover transition-opacity duration-300',
                        isLoaded ? 'opacity-100' : 'opacity-0',
                        className
                    )}
                />
            )}
        </div>
    );
}
