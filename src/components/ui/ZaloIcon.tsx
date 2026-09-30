import React from 'react';
import Image from 'next/image';

interface ZaloIconProps {
  className?: string;
}

export default function ZaloIcon({ className = 'w-6 h-6' }: ZaloIconProps) {
  return (
    <div className={`relative ${className} shrink-0 inline-flex items-center justify-center select-none`}>
      <Image
        src="/images/zalo-icon.png"
        alt="Zalo"
        fill
        sizes="48px"
        className="object-contain"
        priority
      />
    </div>
  );
}
