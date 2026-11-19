import React, { useState, useEffect } from 'react';
import { HeaderDivider } from '../components/Flourish';
import { MenuItem } from '../components/MenuItem';
import { audioManager } from '../utils/audio';
import { achievementsData } from '../data/portfolio';

interface AchievementsModalProps {
  onBack: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ onBack }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleBack = () => {
    audioManager.playSFX('ui_option_click');
    onBack();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : achievementsData.length));
        audioManager.playSFX('ui_change_selection');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < achievementsData.length ? prev + 1 : 0));
        audioManager.playSFX('ui_change_selection');
      } else if (e.key === 'Escape' || e.key === 'Backspace' || (e.key === 'Enter' && selectedIndex === achievementsData.length)) {
        e.preventDefault();
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-8 sm:py-10 md:py-12 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center shrink-0">
        <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.24em] text-white glow-white font-normal text-center">
          ACHIEVEMENTS
        </h1>
        <HeaderDivider />
      </div>

      {/* Achievements List */}
      <div className="my-auto w-full max-w-3xl space-y-2.5 sm:space-y-3 overflow-y-auto overflow-x-hidden max-h-[55vh] sm:max-h-[60vh] pr-2 custom-scrollbar">
        {achievementsData.map((ach, idx) => {
          const isSelected = selectedIndex === idx;

          return (
            <div
              key={ach.id}
              onMouseEnter={() => {
                if (selectedIndex !== idx) {
                  audioManager.playSFX('ui_change_selection');
                  setSelectedIndex(idx);
                }
              }}
              className={`relative flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-5 transition-all duration-150 border cursor-default select-none ${
                isSelected
                  ? 'bg-neutral-900/80 border-white text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.35)] scale-[1.01]'
                  : 'bg-black/60 border-neutral-800 text-neutral-300 hover:border-neutral-600'
              }`}
            >
              {/* Left: Pointer + Title & Issuer */}
              <div className="flex items-center gap-2 sm:gap-3 max-w-[70%]">
                <div className={`transition-opacity duration-150 shrink-0 w-3 sm:w-4 flex items-center justify-center ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                  <img
                    src="/assets/pointer_left.png"
                    alt=""
                    className="w-3.5 sm:w-4 drop-shadow-[0_0_6px_white]"
                  />
                </div>
                <div className="flex flex-col space-y-0.5 truncate">
                  <span className="font-cinzel text-xs sm:text-sm md:text-base tracking-[0.16em] font-semibold text-white uppercase truncate">
                    {ach.title}
                  </span>
                  <span className="font-cinzel text-[10px] sm:text-xs text-neutral-400 tracking-widest uppercase truncate">
                    {ach.issuer}
                  </span>
                </div>
              </div>

              {/* Right: Date & Status + Pointer */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="text-right flex flex-col items-end">
                  <span className="font-cinzel text-[10px] sm:text-xs text-neutral-300 tracking-widest uppercase font-medium">
                    {ach.date}
                  </span>
                  <span className="font-cinzel text-[9px] sm:text-[10px] text-neutral-400 tracking-widest uppercase">
                    UNLOCKED
                  </span>
                </div>
                <div className={`transition-opacity duration-150 shrink-0 w-3 sm:w-4 flex items-center justify-center ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                  <img
                    src="/assets/pointer_right.png"
                    alt=""
                    className="w-3.5 sm:w-4 drop-shadow-[0_0_6px_white]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Back button */}
      <div className="pb-2 sm:pb-3 shrink-0">
        <MenuItem
          label="BACK"
          selected={selectedIndex === achievementsData.length}
          onHover={() => setSelectedIndex(achievementsData.length)}
          onClick={handleBack}
        />
      </div>
    </div>
  );
};
