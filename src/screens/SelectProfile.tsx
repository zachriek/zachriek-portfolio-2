import React, { useState, useEffect } from 'react';
import { ScreenType, SaveProfile } from '../types';
import { audioManager } from '../utils/audio';
import { SilkSpoolIcon, MaskShard } from '../components/Flourish';

interface SelectProfileProps {
  onSelectSave?: (profile: SaveProfile) => void;
  onNavigate: (screen: ScreenType) => void;
}

const INITIAL_PROFILES: SaveProfile[] = [
  {
    id: 1,
    isEmpty: false,
    name: 'ZACHRIE KURNIAWAN',
    location: 'UNIVERSITAS LAMPUNG',
    playtime: '2023 - PRESENT',
    beads: 308,
    rosaries: 4,
    masks: 5,
    maxMasks: 5,
    spoolPercent: 100,
  },
  {
    id: 2,
    isEmpty: false,
    name: 'WORK EXPERIENCES',
    location: 'CORE INITIATIVE & QWORDS',
    playtime: '2023 - 2024',
    beads: 120,
    rosaries: 2,
    masks: 5,
    maxMasks: 5,
    spoolPercent: 85,
  },
  {
    id: 3,
    isEmpty: false,
    name: 'FORMAL EDUCATIONS',
    location: 'UNILA & SMKN 1 B. LAMPUNG',
    playtime: '2020 - PRESENT',
    beads: 80,
    rosaries: 2,
    masks: 5,
    maxMasks: 5,
    spoolPercent: 90,
  },
  {
    id: 4,
    isEmpty: false,
    name: 'PENTEST ARSENAL',
    location: 'CYBERSECURITY LAB',
    playtime: '10 TOOLS',
    beads: 250,
    rosaries: 5,
    masks: 5,
    maxMasks: 5,
    spoolPercent: 95,
  },
];

export const SelectProfile: React.FC<SelectProfileProps> = ({
  onNavigate,
}) => {
  const [profiles, setProfiles] = useState<SaveProfile[]>(INITIAL_PROFILES);
  const [selectedIndex, setSelectedIndex] = useState(0); // 0-3: Save slots, 4: Back

  const handleSelectSlot = (idx: number) => {
    audioManager.playSFX('ui_button_confirm');
    setSelectedIndex(idx);
  };

  const handleResetSlot = (slotIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.playSFX('ui_option_click');
    setProfiles((prev) =>
      prev.map((p, i) => (i === slotIdx ? INITIAL_PROFILES[slotIdx] : p))
    );
  };

  const handleDeleteSlot = (slotIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.playSFX('ui_option_click');
    setProfiles((prev) =>
      prev.map((p, i) => (i === slotIdx ? { ...p, isEmpty: true } : p))
    );
  };

  const handleBack = () => {
    audioManager.playSFX('ui_option_click');
    onNavigate('title');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        if (selectedIndex < 4) {
          audioManager.playSFX('ui_change_selection');
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 3));
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        if (selectedIndex < 4) {
          audioManager.playSFX('ui_change_selection');
          setSelectedIndex((prev) => (prev < 3 ? prev + 1 : 0));
        }
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex(4); // Back button
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (selectedIndex === 4) {
          audioManager.playSFX('ui_change_selection');
          setSelectedIndex(0);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (selectedIndex < 4) {
          handleSelectSlot(selectedIndex);
        } else {
          handleBack();
        }
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-4 sm:py-6 md:py-8 px-2 sm:px-4 select-none z-20 overflow-hidden">
      {/* Header with Title and Ornate Flourish Divider */}
      <div className="flex flex-col items-center pt-2 sm:pt-4 shrink-0">
        <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-[40px] uppercase tracking-[0.24em] text-white glow-white font-normal text-center">
          SELECT PROFILE
        </h1>
        <img
          src="/assets/header_flourish.png"
          alt=""
          className="h-4 sm:h-5 md:h-6 opacity-90 mt-2 pointer-events-none"
        />
      </div>

      {/* 4 Save Slots Container - Fully responsive horizontal scroll on mobile with snap, centered on desktop */}
      <div className="my-auto w-full max-w-[1680px] flex flex-nowrap overflow-x-auto overflow-y-hidden lg:overflow-visible items-center justify-start lg:justify-center gap-4 sm:gap-6 md:gap-8 px-4 py-2 custom-scrollbar snap-x snap-mandatory">
        {profiles.map((profile, idx) => {
          const isSelected = selectedIndex === idx;

          return (
            <div key={profile.id} className="flex flex-col items-center shrink-0 snap-center">
              {/* Card Container */}
              <div
                onClick={() => handleSelectSlot(idx)}
                onMouseEnter={() => {
                  if (selectedIndex !== idx) {
                    audioManager.playSFX('ui_change_selection');
                    setSelectedIndex(idx);
                  }
                }}
                className={`relative w-[215px] sm:w-[250px] md:w-[285px] lg:w-[325px] h-[375px] sm:h-[435px] md:h-[490px] lg:h-[550px] pt-6 sm:pt-8 pb-5 sm:pb-7 px-5 sm:px-7 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden select-none ${
                  isSelected
                    ? 'scale-[1.02] filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                    : 'opacity-90 hover:opacity-100 hover:scale-[1.01]'
                }`}
              >
                {/* Background Shadow & Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-neutral-950/80 to-black/95 pointer-events-none z-0" />

                {/* Subtle in-game bench texture background on Slot 1 */}
                {idx === 0 && (
                  <img
                    src="/assets/bench_scene.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none mix-blend-screen z-0"
                  />
                )}

                {/* Ornate Frame Border matching Hollow Knight Silksong */}
                <img
                  src="/assets/empty_slot_frame.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10"
                />

                {/* Left & Right selection pointers for active slot */}
                {isSelected && (
                  <>
                    <div className="absolute -left-4 sm:-left-7 md:-left-9 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
                      <img
                        src="/assets/pointer_left.png"
                        alt=""
                        className="w-4 sm:w-6 md:w-8 drop-shadow-[0_0_8px_white]"
                      />
                    </div>
                    <div className="absolute -right-4 sm:-right-7 md:-right-9 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
                      <img
                        src="/assets/pointer_right.png"
                        alt=""
                        className="w-4 sm:w-6 md:w-8 drop-shadow-[0_0_8px_white]"
                      />
                    </div>
                  </>
                )}

                {/* Empty Profile State (if cleared) */}
                {profile.isEmpty ? (
                  <div className="relative z-20 my-auto flex flex-col items-center justify-center">
                    <span className="font-cinzel text-base sm:text-lg md:text-xl font-normal uppercase tracking-[0.22em] text-white glow-white">
                      NEW GAME
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Card Top: Silk Spool crest & Mask HP shards */}
                    <div className="relative z-20 flex items-start justify-between w-full pt-1">
                      <div className="flex items-center gap-2">
                        <SilkSpoolIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]" />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: profile.maxMasks }).map((_, mIdx) => (
                              <MaskShard
                                key={mIdx}
                                filled={mIdx < profile.masks}
                                className="w-2.5 h-3.5 sm:w-3 sm:h-4 md:w-3.5 md:h-5 filter drop-shadow-[0_0_3px_white]"
                              />
                            ))}
                          </div>
                          {/* Silk Thread gauge line */}
                          <div className="w-14 sm:w-18 md:w-20 h-0.5 bg-white/30 mt-1 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white shadow-[0_0_4px_white]"
                              style={{ width: `${profile.spoolPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Middle: Content in pure Cinzel typography */}
                    <div className="relative z-20 flex flex-col my-auto space-y-1.5 sm:space-y-2 py-1">
                      {/* Slot Title */}
                      <span className="font-cinzel text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-[0.16em] text-white glow-white uppercase leading-tight">
                        {profile.name}
                      </span>

                      {/* Slot 1: Zachrie Profile Details */}
                      {idx === 0 && (
                        <div className="space-y-1 font-cinzel text-neutral-300">
                          <p className="text-[9px] sm:text-[11px] md:text-xs font-semibold tracking-wider text-white uppercase">
                            WEB DEVELOPER
                          </p>
                          <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-widest text-neutral-400 uppercase">
                            UNILA INFORMATICS 2023
                          </p>
                          <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-widest text-neutral-300 uppercase pt-0.5">
                            4 NATIONAL AWARDS
                          </p>
                        </div>
                      )}

                      {/* Slot 2: Work Experiences */}
                      {idx === 1 && (
                        <div className="space-y-1.5 font-cinzel text-neutral-300">
                          <div className="space-y-0.5">
                            <p className="text-[9px] sm:text-[11px] md:text-xs font-semibold tracking-wider text-white uppercase">
                              FRONTEND INTERN
                            </p>
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-widest text-neutral-300 uppercase">
                              CORE INITIATIVE • VUE.JS
                            </p>
                          </div>
                          <div className="w-10 h-[1px] bg-white/20" />
                          <div className="space-y-0.5">
                            <p className="text-[9px] sm:text-[11px] md:text-xs font-semibold tracking-wider text-white uppercase">
                              FULLSTACK INTERN
                            </p>
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-widest text-neutral-300 uppercase">
                              QWORDS CLOUD • LARAVEL
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Slot 3: Formal Educations */}
                      {idx === 2 && (
                        <div className="space-y-1.5 font-cinzel text-neutral-300">
                          <div className="space-y-0.5">
                            <p className="text-[9px] sm:text-[11px] md:text-xs font-semibold tracking-wider text-white uppercase">
                              S1 TEKNIK INFORMATIKA
                            </p>
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-widest text-neutral-300 uppercase">
                              UNIVERSITAS LAMPUNG
                            </p>
                          </div>
                          <div className="w-10 h-[1px] bg-white/20" />
                          <div className="space-y-0.5">
                            <p className="text-[9px] sm:text-[11px] md:text-xs font-semibold tracking-wider text-white uppercase">
                              MULTIMEDIA
                            </p>
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-widest text-neutral-300 uppercase">
                              SMK NEGERI 1 B. LAMPUNG
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Slot 4: Pentest Arsenal */}
                      {idx === 3 && (
                        <div className="space-y-1 font-cinzel text-neutral-300">
                          <p className="text-[9px] sm:text-[11px] md:text-xs font-semibold tracking-wider text-white uppercase">
                            CYBERSECURITY LAB
                          </p>
                          <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-widest text-neutral-300 uppercase">
                            BURP SUITE • NMAP • METASPLOIT
                          </p>
                          <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-widest text-neutral-400 uppercase">
                            WIRESHARK • SQLMAP • HYDRA
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Card Bottom: Slot Number at bottom-left gap, Playtime & Location at bottom-right */}
                <div className="relative z-20 flex items-end justify-between w-full pt-1">
                  <span className="font-cinzel text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white select-none leading-none drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]">
                    {profile.id}.
                  </span>

                  {!profile.isEmpty && (
                    <div className="flex flex-col items-end text-right">
                      <span className="font-cinzel text-[9px] sm:text-[10px] md:text-xs text-neutral-400 font-light tracking-widest uppercase">
                        {profile.playtime}
                      </span>
                      <span className="font-cinzel text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-semibold tracking-wider text-white uppercase glow-white truncate max-w-[120px] sm:max-w-[160px] md:max-w-[180px]">
                        {profile.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-actions under each slot */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2 h-6">
                <button
                  type="button"
                  onClick={(e) => handleResetSlot(idx, e)}
                  className="font-cinzel text-[9px] sm:text-[10px] tracking-widest text-neutral-400 hover:text-white uppercase transition-colors"
                >
                  RESET
                </button>
                <span className="text-neutral-600 text-[10px]">•</span>
                <button
                  type="button"
                  onClick={(e) => handleDeleteSlot(idx, e)}
                  className="font-cinzel text-[9px] sm:text-[10px] tracking-widest text-neutral-400 hover:text-white uppercase transition-colors"
                >
                  CLEAR
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Back button */}
      <div className="pb-2 sm:pb-4 shrink-0 z-20">
        <div
          onClick={handleBack}
          onMouseEnter={() => {
            if (selectedIndex !== 4) {
              audioManager.playSFX('ui_change_selection');
              setSelectedIndex(4);
            }
          }}
          className="group flex items-center justify-center gap-3 sm:gap-4 cursor-pointer py-1.5 select-none"
        >
          <div
            className={`transition-all duration-150 transform ${
              selectedIndex === 4 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
            }`}
          >
            <img
              src="/assets/pointer_left.png"
              alt=""
              className="w-4 sm:w-5 md:w-6 drop-shadow-[0_0_6px_white]"
            />
          </div>

          <span
            className={`font-cinzel text-lg sm:text-xl md:text-2xl uppercase tracking-[0.24em] transition-all duration-150 ${
              selectedIndex === 4
                ? 'text-white glow-white scale-[1.03] font-medium'
                : 'text-neutral-300 font-light hover:text-white'
            }`}
          >
            BACK
          </span>

          <div
            className={`transition-all duration-150 transform ${
              selectedIndex === 4 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}
          >
            <img
              src="/assets/pointer_right.png"
              alt=""
              className="w-4 sm:w-5 md:w-6 drop-shadow-[0_0_6px_white]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
