'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

const FALLBACK_IMAGE = '/images/hero-sandwich.jpg';

export default function SafeImage({ src, onError, unoptimized, ...props }: ImageProps) {
  const [imageSource, setImageSource] = useState<string>(() => {
    if (typeof src === 'string' && src.trim()) {
      return src;
    }
    return FALLBACK_IMAGE;
  });

  useEffect(() => {
    if (typeof src === 'string' && src.trim()) {
      setImageSource(src);
    } else {
      setImageSource(FALLBACK_IMAGE);
    }
  }, [src]);

  const isBase64 = typeof imageSource === 'string' && imageSource.startsWith('data:');

  return (
    <Image
      {...props}
      src={imageSource || FALLBACK_IMAGE}
      unoptimized={unoptimized || isBase64}
      onError={(event) => {
        setImageSource(FALLBACK_IMAGE);
        onError?.(event);
      }}
    />
  );
}