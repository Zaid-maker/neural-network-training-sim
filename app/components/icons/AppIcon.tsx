import React from 'react';

interface AppIconProps {
  size?: number;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="512" height="512" fill="currentColor" fillOpacity={0.1} />
      <g transform="translate(64, 64) scale(0.75)">
        {/* Neural Network Visualization */}
        {/* Layer 1 */}
        <circle cx="128" cy="128" r="32" fill="currentColor" />
        <circle cx="128" cy="256" r="32" fill="currentColor" />
        <circle cx="128" cy="384" r="32" fill="currentColor" />
        
        {/* Layer 2 */}
        <circle cx="256" cy="192" r="32" fill="currentColor" />
        <circle cx="256" cy="320" r="32" fill="currentColor" />
        
        {/* Layer 3 */}
        <circle cx="384" cy="256" r="32" fill="currentColor" />
        
        {/* Connections */}
        <path d="M160 128 L224 192" stroke="currentColor" strokeWidth="4" opacity="0.6" />
        <path d="M160 128 L224 320" stroke="currentColor" strokeWidth="4" opacity="0.6" />
        <path d="M160 256 L224 192" stroke="currentColor" strokeWidth="4" opacity="0.6" />
        <path d="M160 256 L224 320" stroke="currentColor" strokeWidth="4" opacity="0.6" />
        <path d="M160 384 L224 192" stroke="currentColor" strokeWidth="4" opacity="0.6" />
        <path d="M160 384 L224 320" stroke="currentColor" strokeWidth="4" opacity="0.6" />
        
        <path d="M288 192 L352 256" stroke="currentColor" strokeWidth="4" opacity="0.6" />
        <path d="M288 320 L352 256" stroke="currentColor" strokeWidth="4" opacity="0.6" />
      </g>
    </svg>
  );
};
