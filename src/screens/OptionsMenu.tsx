import React, { useState, useEffect } from 'react';
import { MenuItem } from '../components/MenuItem';
import { HeaderDivider } from '../components/Flourish';
import { ScreenType } from '../types';
import { audioManager } from '../utils/audio';

interface OptionsMenuProps {
  onNavigate: (screen: ScreenType) => void;
}

const OPTION_TABS = [
  { id: 'game', label: 'GAME', target: 'options_game' as ScreenType },
  { id: 'audio', label: 'AUDIO', target: 'options_audio' as ScreenType },
  { id: 'soundtrack', label: 'SOUNDTRACK', target: 'soundtrack' as ScreenType },
  { id: 'video', label: 'VIDEO', target: 'options_video' as ScreenType },
  { id: 'controller', label: 'CONTROLLER', target: 'options_controller' as ScreenType },
  { id: 'keyboard', label: 'KEYBOARD', target: 'options_keyboard' as ScreenType },
];

export const OptionsMenu: React.FC<OptionsMenuProps> = ({ onNavigate }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : OPTION_TABS.length));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex((prev) => (prev < OPTION_TABS.length ? prev + 1 : 0));
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (selectedIndex === OPTION_TABS.length) {
          audioManager.playSFX('ui_option_click');
          onNavigate('title');
        } else {
          audioManager.playSFX('ui_button_confirm');
          onNavigate(OPTION_TABS[selectedIndex].target);
        }
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        audioManager.playSFX('ui_option_click');
        onNavigate('title');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onNavigate]);

  const handleBack = () => {
    audioManager.playSFX('ui_option_click');
    onNavigate('title');
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-8 sm:py-12 md:py-16 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center shrink-0">
        <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.25em] text-white glow-white text-center">
          OPTIONS
        </h1>
        <HeaderDivider />
      </div>

      {/* Tabs list */}
      <div className="flex flex-col items-center space-y-3 sm:space-y-4 md:space-y-5 my-auto w-full px-2 overflow-y-auto overflow-x-hidden max-h-[65vh] custom-scrollbar">
        {OPTION_TABS.map((tab, index) => (
          <MenuItem
            key={tab.id}
            label={tab.label}
            selected={selectedIndex === index}
            onHover={() => {
              if (selectedIndex !== index) {
                audioManager.playSFX('ui_change_selection');
                setSelectedIndex(index);
              }
            }}
            onClick={() => {
              audioManager.playSFX('ui_button_confirm');
              onNavigate(tab.target);
            }}
          />
        ))}
      </div>

      {/* Back button */}
      <div className="pb-2 sm:pb-4 shrink-0">
        <MenuItem
          label="BACK"
          selected={selectedIndex === OPTION_TABS.length}
          onHover={() => setSelectedIndex(OPTION_TABS.length)}
          onClick={handleBack}
        />
      </div>
    </div>
  );
};
