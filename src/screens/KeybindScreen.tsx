import React, { useState, useEffect } from 'react';
import { MenuItem } from '../components/MenuItem';
import { HeaderDivider } from '../components/Flourish';
import { ScreenType } from '../types';
import { audioManager } from '../utils/audio';

interface KeybindScreenProps {
  type: 'controller' | 'keyboard';
  onNavigate: (screen: ScreenType) => void;
}

const KEYBOARD_BINDS = [
  { action: 'MOVE LEFT / RIGHT', bind: 'A / D OR ← / →' },
  { action: 'LOOK UP / DOWN', bind: 'W / S OR ↑ / ↓' },
  { action: 'JUMP', bind: 'SPACE OR Z' },
  { action: 'ATTACK (NEEDLE)', bind: 'J OR X' },
  { action: 'DASH / SPRINT', bind: 'K OR C' },
  { action: 'SILK BIND / HEAL', bind: 'A OR F' },
  { action: 'INTERACT / BENCH', bind: 'E OR S' },
  { action: 'PAUSE MENU', bind: 'ESCAPE' },
];

const CONTROLLER_BINDS = [
  { action: 'MOVE', bind: 'LEFT STICK / D-PAD' },
  { action: 'JUMP', bind: 'A BUTTON' },
  { action: 'ATTACK (NEEDLE)', bind: 'X BUTTON' },
  { action: 'DASH', bind: 'RIGHT TRIGGER' },
  { action: 'SILK BIND / HEAL', bind: 'B BUTTON' },
  { action: 'INTERACT / BENCH', bind: 'UP / DOWN' },
  { action: 'PAUSE MENU', bind: 'START / OPTIONS' },
];

export const KeybindScreen: React.FC<KeybindScreenProps> = ({ type, onNavigate }) => {
  const binds = type === 'keyboard' ? KEYBOARD_BINDS : CONTROLLER_BINDS;
  const [selectedIndex, setSelectedIndex] = useState(binds.length);

  const handleBack = () => {
    audioManager.playSFX('ui_option_click');
    onNavigate('options');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : binds.length));
        audioManager.playSFX('ui_change_selection');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < binds.length ? prev + 1 : 0));
        audioManager.playSFX('ui_change_selection');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex === binds.length) handleBack();
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-8 sm:py-12 md:py-14 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center shrink-0">
        <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.24em] text-white glow-white font-normal text-center">
          {type === 'keyboard' ? 'KEYBOARD' : 'CONTROLLER'}
        </h1>
        <HeaderDivider />
      </div>

      {/* Keybinds Table */}
      <div className="my-auto w-full max-w-xl space-y-2 overflow-y-auto overflow-x-hidden max-h-[60vh] pr-2 custom-scrollbar">
        {binds.map((item, idx) => {
          const isSelected = selectedIndex === idx;

          return (
            <div
              key={item.action}
              onMouseEnter={() => {
                if (selectedIndex !== idx) {
                  audioManager.playSFX('ui_change_selection');
                  setSelectedIndex(idx);
                }
              }}
              className={`relative flex items-center justify-between px-4 sm:px-6 py-2 transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'text-white glow-white scale-[1.02]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isSelected && (
                <>
                  <div className="absolute -left-5 sm:-left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                    <img src="/assets/pointer_left.png" alt="" className="w-4 sm:w-5 drop-shadow-[0_0_6px_white]" />
                  </div>
                  <div className="absolute -right-5 sm:-right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                    <img src="/assets/pointer_right.png" alt="" className="w-4 sm:w-5 drop-shadow-[0_0_6px_white]" />
                  </div>
                </>
              )}

              <span className="font-cinzel tracking-[0.16em] text-xs sm:text-sm md:text-base uppercase truncate mr-2">
                {item.action}
              </span>
              <span className="font-cinzel text-xs sm:text-sm tracking-widest text-neutral-300 uppercase font-medium shrink-0">
                {item.bind}
              </span>
            </div>
          );
        })}
      </div>

      {/* Back button */}
      <div className="pb-2 sm:pb-3 shrink-0">
        <MenuItem
          label="BACK"
          selected={selectedIndex === binds.length}
          onHover={() => setSelectedIndex(binds.length)}
          onClick={handleBack}
        />
      </div>
    </div>
  );
};
