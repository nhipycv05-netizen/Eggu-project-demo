import React from 'react';

interface FacebookIconProps {
  className?: string;
  alt?: string;
}

export default function FacebookIcon({ className = 'w-5 h-5', alt }: FacebookIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={alt ? 'img' : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : 'true'}
    >
      {alt && <title>{alt}</title>}
      <path
        d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.52-.14-2.71-.14-2.72 0-4.79 1.66-4.79 4.9v2.6H7v4h3V22h4v-8.5z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
