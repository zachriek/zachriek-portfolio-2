import React from 'react';
import { audioManager } from '../utils/audio';

interface SliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  className?: string;
  showValue?: boolean;
}

export const CustomSlider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  className = '',
  showValue = true,
}) => {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    audioManager.playSFX('ui_option_click');
    onChange(newVal);
  };

  return (
    <div className={`flex items-center justify-between sm:justify-start gap-2 sm:gap-4 w-full max-w-md ${className}`}>
      {label && (
        <span className="font-cinzel text-xs sm:text-base md:text-lg tracking-wider w-28 sm:w-44 md:w-48 text-left truncate">
          {label}
        </span>
      )}

      {/* Slider Track and Indicator */}
      <div className="relative flex items-center flex-1 sm:w-56 md:w-64 group py-3">
        {/* Track Line */}
        <div className="w-full h-[2px] bg-white/40 relative">
          {/* Active progress */}
          <div
            className="absolute left-0 top-0 h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ width: `${percentage}%` }}
          />

          {/* Pointer Triangle Marker (▼) */}
          <div
            className="absolute -top-[14px] -translate-x-1/2 transition-all duration-75 pointer-events-none"
            style={{ left: `${percentage}%` }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
            >
              <polygon points="1,2 13,2 7,12" fill="white" />
              <polygon points="3,3 11,3 7,10" fill="#120c0f" />
              <line x1="7" y1="2" x2="7" y2="7" stroke="white" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Hidden Accessible Native Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Value Display */}
      {showValue && (
        <span className="font-cinzel text-xs sm:text-base md:text-lg tracking-wider w-10 sm:w-14 text-right sm:text-left font-light pl-1 sm:pl-2 shrink-0">
          {value}{unit}
        </span>
      )}
    </div>
  );
};
