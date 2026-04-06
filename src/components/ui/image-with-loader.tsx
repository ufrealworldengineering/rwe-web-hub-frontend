import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ImageWithLoaderProps = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  imgClassName?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'auto' | 'sync';
};

export const ImageWithLoader = ({
  src,
  alt,
  className,
  wrapperClassName,
  imgClassName,
  loading = 'lazy',
  decoding = 'async',
}: ImageWithLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
  }, [src]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (img.complete) {
      if (img.naturalWidth > 0) {
        setIsLoaded(true);
      } else {
        setIsError(true);
        setIsLoaded(true);
      }
    }
  }, [src]);

  return (
    <div className={cn('relative', wrapperClassName)}>
      {!isLoaded && !isError ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/30">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : null}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={cn(className, imgClassName)}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsError(true);
          setIsLoaded(true);
        }}
      />
    </div>
  );
};
