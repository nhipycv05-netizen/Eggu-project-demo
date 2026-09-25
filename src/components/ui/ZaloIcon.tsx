import React from 'react';

interface ZaloIconProps {
  className?: string;
}

export default function ZaloIcon({ className = 'w-4 h-4' }: ZaloIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="24" height="24" rx="6" fill="#0068FF" />
      <text
        x="12"
        y="15.2"
        textAnchor="middle"
        fill="#FFFFFF"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: 900,
          fontSize: '8px',
          letterSpacing: '-0.2px',
        }}
      >
        Zalo
      </text>
    </svg>
  );
}
