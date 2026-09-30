import React from 'react';

interface TikTokIconProps {
  className?: string;
}

export default function TikTokIcon({ className = 'w-6 h-6' }: TikTokIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Circular Black Badge (Transparent background outside) */}
      <circle cx="24" cy="24" r="24" fill="#000000" />

      {/* Cyan Offset Layer */}
      <path
        d="M29.5 13.5c1.8 2.2 4.2 3.6 7 3.9v4.2c-2.6-.1-5-.9-7-2.3v10.4c0 4.6-3.7 8.3-8.3 8.3s-8.3-3.7-8.3-8.3 3.7-8.3 8.3-8.3c.6 0 1.2.1 1.8.2v4.4c-.6-.2-1.2-.3-1.8-.3-2.3 0-4.2 1.9-4.2 4.2s1.9 4.2 4.2 4.2 4.2-1.9 4.2-4.2V11h4.1v2.5z"
        fill="#25F4EE"
        transform="translate(-1, -0.8)"
      />

      {/* Pink/Red Offset Layer */}
      <path
        d="M29.5 13.5c1.8 2.2 4.2 3.6 7 3.9v4.2c-2.6-.1-5-.9-7-2.3v10.4c0 4.6-3.7 8.3-8.3 8.3s-8.3-3.7-8.3-8.3 3.7-8.3 8.3-8.3c.6 0 1.2.1 1.8.2v4.4c-.6-.2-1.2-.3-1.8-.3-2.3 0-4.2 1.9-4.2 4.2s1.9 4.2 4.2 4.2 4.2-1.9 4.2-4.2V11h4.1v2.5z"
        fill="#FE2C55"
        transform="translate(1, 0.8)"
      />

      {/* White Foreground Note */}
      <path
        d="M29.5 13.5c1.8 2.2 4.2 3.6 7 3.9v4.2c-2.6-.1-5-.9-7-2.3v10.4c0 4.6-3.7 8.3-8.3 8.3s-8.3-3.7-8.3-8.3 3.7-8.3 8.3-8.3c.6 0 1.2.1 1.8.2v4.4c-.6-.2-1.2-.3-1.8-.3-2.3 0-4.2 1.9-4.2 4.2s1.9 4.2 4.2 4.2 4.2-1.9 4.2-4.2V11h4.1v2.5z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
