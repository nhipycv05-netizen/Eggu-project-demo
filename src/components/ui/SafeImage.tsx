'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

const FALLBACK_IMAGE = '/images/hero-sandwich.jpg';

export default function SafeImage({ src, onError, ...props }: ImageProps) {
  const [imageSource, setImageSource] = useState(src);

  useEffect(() => {
    setImageSource(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={imageSource}
      onError={(event) => {
        setImageSource(FALLBACK_IMAGE);
        onError?.(event);
      }}
    />
  );
}