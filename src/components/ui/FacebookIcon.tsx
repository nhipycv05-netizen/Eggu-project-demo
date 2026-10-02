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
      <circle cx="12" cy="12" r="12" fill="#0866FF" />
      <path
        d="M16.672 15.469L17.204 12h-3.328V9.763c0-.949.465-1.874 1.956-1.874h1.514V4.936s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669V12H7.078v3.469h3.047v8.385a12.09 12.09 0 003.75 0v-8.385h2.797z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
