import React from 'react';

// Ornate Header Divider with central spool crest from Silksong
export const HeaderDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center my-2.5 ${className}`}>
    <img
      src="/assets/header_flourish.png"
      alt=""
      className="h-5 sm:h-6 opacity-90 pointer-events-none"
    />
  </div>
);

// Selection Pointer Arrow (Left & Right) matching Silksong
export const SelectionArrow: React.FC<{ direction: 'left' | 'right'; className?: string }> = ({
  direction,
  className = '',
}) => {
  const isLeft = direction === 'left';
  return (
    <img
      src={isLeft ? '/assets/pointer_left.png' : '/assets/pointer_right.png'}
      alt=""
      className={`inline-block w-5 sm:w-6 transition-transform duration-150 drop-shadow-[0_0_6px_white] ${className}`}
    />
  );
};

// Ornate Corner Flourish for Cards & Screen Boundaries
export const OrnateCorner: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: number;
}> = ({ position, className = '', size = 44 }) => {
  let rotation = '';
  if (position === 'top-right') rotation = 'rotate-90';
  if (position === 'bottom-right') rotation = 'rotate-180';
  if (position === 'bottom-left') rotation = '-rotate-90';

  return (
    <div className={`absolute ${rotation} ${className} pointer-events-none`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 48 L4 12 C4 7.5, 7.5 4, 12 4 L48 4"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 8 C14 14, 16 22, 14 30 C12 24, 10 18, 8 8 Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M8 8 C14 14, 22 16, 30 14 C24 12, 18 10, 8 8 Z"
          fill="white"
          opacity="0.9"
        />
        <circle cx="16" cy="16" r="2.5" fill="white" />
      </svg>
    </div>
  );
};

// Mask Shard / Health Heart icon from Hollow Knight
export const MaskShard: React.FC<{ filled?: boolean; className?: string }> = ({
  filled = true,
  className = '',
}) => (
  <svg
    width="16"
    height="20"
    viewBox="0 0 18 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <path
      d="M9 2 C4 2, 2 6, 2 12 C2 17, 5 20, 9 21 C13 20, 16 17, 16 12 C16 6, 14 2, 9 2 Z"
      fill={filled ? '#ffffff' : '#1a1a1a'}
      stroke="#ffffff"
      strokeWidth="1.2"
    />
    <ellipse cx="6" cy="11" rx="1.5" ry="3" fill="#000000" />
    <ellipse cx="12" cy="11" rx="1.5" ry="3" fill="#000000" />
  </svg>
);

// Silk Spool icon
export const SilkSpoolIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="17" cy="17" r="14" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 2" />
    <circle cx="17" cy="17" r="11" fill="#752226" stroke="#ffffff" strokeWidth="1.5" />
    <line x1="9" y1="25" x2="25" y2="9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
