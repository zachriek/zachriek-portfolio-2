import React from 'react';
import { SelectionArrow } from './Flourish';
import { audioManager } from '../utils/audio';

interface MenuItemProps {
  label: string;
  selected?: boolean;
  value?: string | React.ReactNode;
  description?: string;
  onClick?: () => void;
  onHover?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
  isAction?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  selected = false,
  value,
  description,
  onClick,
  onHover,
  onPrev,
  onNext,
  className = '',
}) => {
  const handleMouseEnter = () => {
    if (!selected) {
      audioManager.playSFX('ui_change_selection');
    }
    if (onHover) onHover();
  };

  const handleClick = () => {
    audioManager.playSFX('ui_button_confirm');
    if (onClick) onClick();
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.playSFX('ui_option_click');
    if (onPrev) onPrev();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.playSFX('ui_option_click');
    if (onNext) onNext();
  };

  return (
    <div
      className={`group flex flex-col items-center justify-center cursor-pointer select-none py-1 sm:py-1.5 transition-all duration-150 ${className}`}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center gap-2 sm:gap-4 relative max-w-full">
        {/* Left pointer marker */}
        <div
          className={`transition-all duration-150 transform ${
            selected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          <SelectionArrow direction="left" />
        </div>

        {/* Content */}
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center text-center">
          <span
            className={`font-cinzel text-base sm:text-xl md:text-2xl uppercase tracking-[0.16em] sm:tracking-[0.18em] transition-all duration-150 ${
              selected
                ? 'text-white font-medium glow-selected scale-[1.02]'
                : 'text-neutral-300 font-light hover:text-white'
            }`}
          >
            {label}
          </span>

          {/* Optional Value selector (e.g. ‹ ON ›) */}
          {value !== undefined && (
            <div className="flex items-center gap-1.5 sm:gap-2 font-cinzel text-sm sm:text-lg md:text-xl text-neutral-200">
              {onPrev && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="hover:text-white hover:scale-125 px-1 py-0.5 text-neutral-400 hover:text-white transition-transform"
                >
                  ‹
                </button>
              )}
              <span className={`tracking-widest ${selected ? 'text-white glow-white' : ''}`}>
                {value}
              </span>
              {onNext && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="hover:text-white hover:scale-125 px-1 py-0.5 text-neutral-400 hover:text-white transition-transform"
                >
                  ›
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right pointer marker */}
        <div
          className={`transition-all duration-150 transform ${
            selected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
          }`}
        >
          <SelectionArrow direction="right" />
        </div>
      </div>

      {/* Description Tooltip / Subtext */}
      {description && selected && (
        <p className="font-cinzel text-[10px] sm:text-xs text-neutral-400 tracking-wider mt-1 max-w-xs sm:max-w-md text-center uppercase opacity-90 transition-opacity">
          {description}
        </p>
      )}
    </div>
  );
};
