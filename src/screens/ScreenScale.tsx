import React, { useState, useEffect } from 'react';
import { OrnateCorner, SelectionArrow } from '../components/Flourish';
import { CustomSlider } from '../components/Slider';
import { MenuItem } from '../components/MenuItem';
import { ScreenType, GameSettingsState } from '../types';
import { audioManager } from '../utils/audio';

interface ScreenScaleProps {
  settings: GameSettingsState;
  onUpdateSettings: (newSettings: Partial<GameSettingsState>) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ScreenScale: React.FC<ScreenScaleProps> = ({
  settings,
  onUpdateSettings,
  onNavigate,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Offset based on scale (1 to 10)
  const insetGap = Math.max(0, (10 - settings.screenScale) * 6);

  const handleBack = () => {
    audioManager.playSFX('ui_option_click');
    onNavigate('options_video');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex(0);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        if (selectedIndex === 0) {
          const next = Math.max(1, settings.screenScale - 1);
          onUpdateSettings({ screenScale: next });
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        if (selectedIndex === 0) {
          const next = Math.min(10, settings.screenScale + 1);
          onUpdateSettings({ screenScale: next });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex === 1) handleBack();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, settings]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-10 sm:py-14 md:py-16 px-6 sm:px-12 select-none z-20 overflow-hidden">
      {/* 4 Dynamic Corner Flourishes */}
      <div
        className="absolute transition-all duration-200 pointer-events-none"
        style={{ top: `${insetGap}px`, left: `${insetGap}px` }}
      >
        <OrnateCorner position="top-left" size={50} />
      </div>

      <div
        className="absolute transition-all duration-200 pointer-events-none"
        style={{ top: `${insetGap}px`, right: `${insetGap}px` }}
      >
        <OrnateCorner position="top-right" size={50} />
      </div>

      <div
        className="absolute transition-all duration-200 pointer-events-none"
        style={{ bottom: `${insetGap}px`, left: `${insetGap}px` }}
      >
        <OrnateCorner position="bottom-left" size={50} />
      </div>

      <div
        className="absolute transition-all duration-200 pointer-events-none"
        style={{ bottom: `${insetGap}px`, right: `${insetGap}px` }}
      >
        <OrnateCorner position="bottom-right" size={50} />
      </div>

      {/* Screen edges side pointers */}
      <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 opacity-75 hidden md:block">
        <SelectionArrow direction="left" />
      </div>
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 opacity-75 hidden md:block">
        <SelectionArrow direction="right" />
      </div>

      {/* Center Instruction & Slider */}
      <div className="my-auto flex flex-col items-center max-w-lg text-center space-y-6 sm:space-y-8 px-2">
        <p className="font-cinzel text-xs sm:text-base uppercase tracking-[0.18em] text-neutral-300 font-medium">
          ADJUST SLIDER UNTIL FRAMES TOUCH EDGES
        </p>

        {/* Slider */}
        <div
          className="flex items-center gap-2 sm:gap-4 cursor-pointer w-full justify-center"
          onMouseEnter={() => setSelectedIndex(0)}
        >
          <div className={selectedIndex === 0 ? 'opacity-100' : 'opacity-0'}>
            <SelectionArrow direction="left" />
          </div>
          <CustomSlider
            label="SCALE"
            value={settings.screenScale}
            min={1}
            max={10}
            onChange={(val) => onUpdateSettings({ screenScale: val })}
          />
          <div className={selectedIndex === 0 ? 'opacity-100' : 'opacity-0'}>
            <SelectionArrow direction="right" />
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="pb-2 sm:pb-4 shrink-0">
        <MenuItem
          label="BACK"
          selected={selectedIndex === 1}
          onHover={() => setSelectedIndex(1)}
          onClick={handleBack}
        />
      </div>
    </div>
  );
};
