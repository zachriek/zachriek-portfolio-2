import React, { useState, useEffect } from 'react';
import { MenuItem } from '../components/MenuItem';
import { ScreenType } from '../types';
import { audioManager } from '../utils/audio';

interface MainMenuProps {
  onNavigate: (screen: ScreenType) => void;
  onQuit?: () => void;
}

const MENU_ITEMS = [
  { id: 'start', label: 'START GAME', target: 'select_profile' as ScreenType },
  { id: 'options', label: 'OPTIONS', target: 'options' as ScreenType },
  { id: 'soundtrack', label: 'SOUNDTRACK', target: 'soundtrack' as ScreenType },
  { id: 'achievements', label: 'ACHIEVEMENTS', target: 'achievements' as ScreenType },
  { id: 'extras', label: 'EXTRAS', target: 'extras' as ScreenType },
  { id: 'quit', label: 'QUIT GAME', target: 'title' as ScreenType },
];

export const MainMenu: React.FC<MainMenuProps> = ({ onNavigate, onQuit }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard navigation (Arrow Up/Down, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : MENU_ITEMS.length - 1));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex((prev) => (prev < MENU_ITEMS.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const selected = MENU_ITEMS[selectedIndex];
        audioManager.playSFX('ui_button_confirm');
        if (selected.id === 'quit' && onQuit) {
          onQuit();
        } else {
          onNavigate(selected.target);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onNavigate, onQuit]);

  const handleSelect = (index: number) => {
    audioManager.playSFX('ui_button_confirm');
    const selected = MENU_ITEMS[index];
    if (selected.id === 'quit' && onQuit) {
      onQuit();
    } else {
      onNavigate(selected.target);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-6 sm:py-10 md:py-12 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Silksong Title Logo - Clean, crisp, NO animations or glow effects */}
      <div className="pt-4 sm:pt-6 md:pt-8 flex flex-col items-center shrink-0">
        <img
          src="/assets/logo_silksong.png"
          alt="Hollow Knight Silksong"
          className="w-[280px] sm:w-[420px] md:w-[540px] lg:w-[600px] max-w-[85vw] h-auto object-contain"
          draggable={false}
        />
      </div>

      {/* Needle decoration on the right side - Hidden on small mobile to avoid text obstruction */}
      <div className="absolute right-4 sm:right-10 md:right-16 lg:right-24 bottom-0 pointer-events-none w-[110px] sm:w-[150px] md:w-[190px] lg:w-[220px] opacity-70 md:opacity-90 max-h-[80vh] hidden sm:flex items-end justify-end">
        <img
          src="/assets/needle_statue.png"
          alt="Silksong Needle"
          className="object-contain"
          draggable={false}
        />
      </div>

      {/* Menu Navigation Items */}
      <div className="flex flex-col items-center space-y-2.5 sm:space-y-3 md:space-y-3.5 my-auto w-full px-2">
        {MENU_ITEMS.map((item, index) => (
          <MenuItem
            key={item.id}
            label={item.label}
            selected={selectedIndex === index}
            onHover={() => {
              if (selectedIndex !== index) {
                audioManager.playSFX('ui_change_selection');
                setSelectedIndex(index);
              }
            }}
            onClick={() => handleSelect(index)}
          />
        ))}
      </div>

      {/* Team Cherry logo & version bottom left */}
      <div className="relative sm:absolute sm:left-8 sm:bottom-6 flex flex-col items-center sm:items-start opacity-75 hover:opacity-100 transition-opacity shrink-0 pt-2 sm:pt-0">
        <img
          src="/assets/team_cherry.png"
          alt="Team Cherry"
          className="h-8 sm:h-10 object-contain"
          draggable={false}
        />
        <span className="font-cinzel text-[10px] sm:text-[11px] text-neutral-400 tracking-wider mt-1">
          1.0.28714
        </span>
      </div>
    </div>
  );
};
