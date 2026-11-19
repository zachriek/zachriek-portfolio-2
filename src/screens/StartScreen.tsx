import React, { useEffect } from 'react';
import { SelectionArrow } from '../components/Flourish';
import { audioManager } from '../utils/audio';

interface StartScreenProps {
  onEnter: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onEnter }) => {
  const handleEnter = () => {
    audioManager.unlockAudio();
    audioManager.playSFX('ui_button_confirm');
    onEnter();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      handleEnter();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      onClick={handleEnter}
      className="relative w-full h-full flex flex-col items-center justify-between py-10 sm:py-14 md:py-16 px-6 select-none z-30 cursor-pointer overflow-hidden"
    >
      {/* Background vignette & atmospheric ambient */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#0a0508]/85 to-[#040203]" />
        <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-red-950/25 via-amber-950/15 to-transparent" />
      </div>

      {/* Silksong Title Logo - Clean, crisp, NO effects as requested */}
      <div className="pt-4 sm:pt-8 md:pt-12 flex flex-col items-center z-10">
        <img
          src="/assets/logo_silksong.png"
          alt="Hollow Knight Silksong"
          className="w-[280px] sm:w-[440px] md:w-[580px] lg:w-[660px] max-w-[85vw] h-auto object-contain"
          draggable={false}
        />
      </div>

      {/* Center Interactive Button for audio unlocking and entering main menu */}
      <div className="my-auto flex flex-col items-center gap-4 sm:gap-5 z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleEnter();
          }}
          className="group relative flex items-center justify-center gap-3 sm:gap-4 px-7 sm:px-10 md:px-12 py-3 sm:py-4 border border-white/60 bg-black/65 hover:bg-white hover:text-black hover:border-white transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.8)] cursor-pointer"
        >
          <div className="opacity-70 group-hover:opacity-100 transition-opacity">
            <SelectionArrow direction="left" />
          </div>
          <span className="font-cinzel text-base sm:text-xl md:text-2xl font-medium tracking-[0.22em] uppercase transition-colors text-white group-hover:text-black">
            CLICK TO ENTER
          </span>
          <div className="opacity-70 group-hover:opacity-100 transition-opacity">
            <SelectionArrow direction="right" />
          </div>
        </button>

        <p className="font-cinzel text-[10px] sm:text-xs text-neutral-400 tracking-[0.24em] uppercase text-center max-w-md">
          PRESS ANY KEY OR CLICK TO START WITH AUDIO
        </p>
      </div>

      {/* Team Cherry logo bottom-center / bottom-left */}
      <div className="flex flex-col items-center opacity-70 z-10">
        <img
          src="/assets/team_cherry.png"
          alt="Team Cherry"
          className="h-8 sm:h-9 object-contain"
          draggable={false}
        />
        <span className="font-cinzel text-[10px] text-neutral-500 tracking-wider mt-1.5">
          TEAM CHERRY
        </span>
      </div>
    </div>
  );
};
