import React, { useState, useEffect } from 'react';
import { HeaderDivider } from '../components/Flourish';
import { MenuItem } from '../components/MenuItem';
import { audioManager } from '../utils/audio';

interface ExtrasModalProps {
  onBack: () => void;
}

export const ExtrasModal: React.FC<ExtrasModalProps> = ({ onBack }) => {
  const [tab, setTab] = useState<'experiences' | 'education' | 'arsenal'>('experiences');

  const handleBack = () => {
    audioManager.playSFX('ui_option_click');
    onBack();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-8 sm:py-10 md:py-12 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center shrink-0">
        <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.24em] text-white glow-white font-normal text-center">
          EXTRAS
        </h1>
        <HeaderDivider />

        {/* Tab switcher */}
        <div className="flex items-center gap-4 sm:gap-8 mt-3 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => {
              setTab('experiences');
              audioManager.playSFX('ui_option_click');
            }}
            className={`font-cinzel text-xs sm:text-sm tracking-[0.2em] uppercase pb-1 transition-all ${
              tab === 'experiences'
                ? 'border-b-2 border-white text-white glow-white'
                : 'border-b-2 border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            EXPERIENCES
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('education');
              audioManager.playSFX('ui_option_click');
            }}
            className={`font-cinzel text-xs sm:text-sm tracking-[0.2em] uppercase pb-1 transition-all ${
              tab === 'education'
                ? 'border-b-2 border-white text-white glow-white'
                : 'border-b-2 border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            EDUCATIONS
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('arsenal');
              audioManager.playSFX('ui_option_click');
            }}
            className={`font-cinzel text-xs sm:text-sm tracking-[0.2em] uppercase pb-1 transition-all ${
              tab === 'arsenal'
                ? 'border-b-2 border-white text-white glow-white'
                : 'border-b-2 border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            ARSENAL
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="my-auto w-full max-w-2xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto overflow-x-hidden max-h-[55vh] custom-scrollbar">
        {/* Tab 1: Experiences */}
        {tab === 'experiences' && (
          <div className="w-full space-y-3 sm:space-y-4 animate-tab-fade-in">
            <div className="p-4 sm:p-5 border border-neutral-800 bg-black/60 space-y-1">
              <span className="font-cinzel text-sm sm:text-base font-semibold tracking-wider text-white uppercase">
                FRONTEND INTERN
              </span>
              <p className="font-cinzel text-xs text-neutral-300 tracking-widest uppercase">
                CORE INITIATIVE STUDIO • 2024
              </p>
              <p className="font-cinzel text-[10px] sm:text-[11px] text-neutral-400 tracking-wider uppercase pt-1">
                VUE.JS • RESPONSIVE E-COMMERCE UI
              </p>
            </div>

            <div className="p-4 sm:p-5 border border-neutral-800 bg-black/60 space-y-1">
              <span className="font-cinzel text-sm sm:text-base font-semibold tracking-wider text-white uppercase">
                FULLSTACK INTERN
              </span>
              <p className="font-cinzel text-xs text-neutral-300 tracking-widest uppercase">
                QWORDS CLOUD HOSTING • 2023
              </p>
              <p className="font-cinzel text-[10px] sm:text-[11px] text-neutral-400 tracking-wider uppercase pt-1">
                LARAVEL • PHP • WEB PLATFORM
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Education */}
        {tab === 'education' && (
          <div className="w-full space-y-3 sm:space-y-4 animate-tab-fade-in">
            <div className="p-4 sm:p-5 border border-neutral-800 bg-black/60 space-y-1">
              <span className="font-cinzel text-sm sm:text-base font-semibold tracking-wider text-white uppercase">
                S1 TEKNIK INFORMATIKA
              </span>
              <p className="font-cinzel text-xs text-neutral-300 tracking-widest uppercase">
                UNIVERSITAS LAMPUNG
              </p>
              <p className="font-cinzel text-[10px] sm:text-[11px] text-neutral-400 tracking-wider uppercase pt-1">
                2023 - PRESENT
              </p>
            </div>

            <div className="p-4 sm:p-5 border border-neutral-800 bg-black/60 space-y-1">
              <span className="font-cinzel text-sm sm:text-base font-semibold tracking-wider text-white uppercase">
                MULTIMEDIA
              </span>
              <p className="font-cinzel text-xs text-neutral-300 tracking-widest uppercase">
                SMK NEGERI 1 BANDAR LAMPUNG
              </p>
              <p className="font-cinzel text-[10px] sm:text-[11px] text-neutral-400 tracking-wider uppercase pt-1">
                2020 - 2023
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Arsenal */}
        {tab === 'arsenal' && (
          <div className="w-full space-y-3 sm:space-y-4 animate-tab-fade-in">
            <div className="p-4 sm:p-5 border border-neutral-800 bg-black/60 space-y-2">
              <span className="font-cinzel text-sm sm:text-base font-semibold tracking-wider text-white uppercase">
                PENETRATION TESTING
              </span>
              <p className="font-cinzel text-xs text-neutral-300 tracking-widest uppercase">
                BURP SUITE • NMAP • METASPLOIT
              </p>
              <p className="font-cinzel text-xs text-neutral-400 tracking-widest uppercase">
                WIRESHARK • SQLMAP • HYDRA
              </p>
            </div>

            <div className="p-4 sm:p-5 border border-neutral-800 bg-black/60 space-y-2">
              <span className="font-cinzel text-sm sm:text-base font-semibold tracking-wider text-white uppercase">
                DEVELOPMENT STACK
              </span>
              <p className="font-cinzel text-xs text-neutral-300 tracking-widest uppercase">
                VUE.JS • LARAVEL • REACT • TAILWIND CSS • PYTHON
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Back button */}
      <div className="pb-2 sm:pb-3 shrink-0">
        <MenuItem label="BACK" selected onClick={handleBack} />
      </div>
    </div>
  );
};
