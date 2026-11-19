import React, { useState, useEffect } from 'react';
import { SelectionArrow } from '../components/Flourish';
import { CustomSlider } from '../components/Slider';
import { MenuItem } from '../components/MenuItem';
import { ScreenType, GameSettingsState } from '../types';
import { audioManager } from '../utils/audio';

interface BrightnessSettingProps {
  settings: GameSettingsState;
  onUpdateSettings: (newSettings: Partial<GameSettingsState>) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const BrightnessSetting: React.FC<BrightnessSettingProps> = ({
  settings,
  onUpdateSettings,
  onNavigate,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

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
          const next = Math.max(50, settings.brightness - 5);
          onUpdateSettings({ brightness: next });
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        if (selectedIndex === 0) {
          const next = Math.min(150, settings.brightness + 5);
          onUpdateSettings({ brightness: next });
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
    <div className="relative w-full h-full flex flex-col items-center justify-between py-8 sm:py-12 md:py-14 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Side pointers */}
      <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 opacity-75 hidden md:block">
        <SelectionArrow direction="left" />
      </div>
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 opacity-75 hidden md:block">
        <SelectionArrow direction="right" />
      </div>

      {/* Main Content */}
      <div className="my-auto flex flex-col items-center max-w-2xl text-center space-y-4 sm:space-y-6 px-2">
        {/* In-Game Preview Frame */}
        <div className="relative rounded-sm overflow-hidden border border-neutral-700/80 shadow-[0_0_25px_rgba(0,0,0,0.8)] max-w-full">
          <img
            src="/assets/brightness_preview.png"
            alt="Brightness Test Preview"
            className="w-[300px] sm:w-[480px] md:w-[600px] lg:w-[680px] max-w-[90vw] h-auto object-cover transition-all duration-100"
            style={{
              filter: `brightness(${settings.brightness}%) contrast(105%)`,
            }}
            draggable={false}
          />
        </div>

        {/* Text Instruction */}
        <p className="font-cinzel text-xs sm:text-sm uppercase tracking-[0.18em] text-neutral-300 font-medium">
          ADJUST BRIGHTNESS TO DESIRED LEVEL
        </p>

        {/* Brightness Slider */}
        <div
          className="flex items-center gap-2 sm:gap-4 cursor-pointer pt-1 w-full justify-center"
          onMouseEnter={() => setSelectedIndex(0)}
        >
          <div className={selectedIndex === 0 ? 'opacity-100' : 'opacity-0'}>
            <SelectionArrow direction="left" />
          </div>
          <CustomSlider
            label="BRIGHTNESS"
            value={settings.brightness}
            min={50}
            max={150}
            step={5}
            unit="%"
            onChange={(val) => onUpdateSettings({ brightness: val })}
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
