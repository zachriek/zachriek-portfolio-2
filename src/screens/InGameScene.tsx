import React, { useState, useEffect, useRef } from 'react';
import { MaskShard, SilkSpoolIcon } from '../components/Flourish';
import { SaveProfile } from '../types';
import { audioManager } from '../utils/audio';
import { MenuItem } from '../components/MenuItem';
import { MessageSquare, RotateCcw } from 'lucide-react';

interface InGameSceneProps {
  profile: SaveProfile | null;
  onReturnToTitle: () => void;
  onOpenOptions: () => void;
}

export const InGameScene: React.FC<InGameSceneProps> = ({
  profile,
  onReturnToTitle,
  onOpenOptions,
}) => {
  const [isOnBench, setIsOnBench] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const [currentHealth, setCurrentHealth] = useState(profile?.masks || 5);
  const [maxHealth] = useState(profile?.maxMasks || 5);
  const [silkThread, setSilkThread] = useState(profile?.spoolPercent || 100);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Resume menu BGM
  useEffect(() => {
    audioManager.ensureMenuBGM();
    return () => {
      audioManager.ensureMenuBGM();
    };
  }, []);

  // Sherma dialogues incorporating Zachrie's portfolio
  const SHERMA_DIALOGUES = [
    "“Ha, traveler Zachrie! You have awakened upon the sacred seat of Pharloom. The weavers speak of your craft in building intuitive web applications and exploring the depths of cybersecurity...”",
    "“I heard tales from afar: Gold Medalist in National Mathematics, and Medallion for Excellence in LKS Web Technologies!”",
    "“From Vue.js at Core Initiative to Laravel at Qwords, and auditing networks with Nmap & Burp Suite—your needle weaves powerful threads!”",
    "“Even here in the Blasted Steps, the principles of clean code and robust security stand undefeated.”",
  ];

  const handleTalkToSherma = () => {
    audioManager.playSFX('ui_button_confirm');
    const randomText = SHERMA_DIALOGUES[Math.floor(Math.random() * SHERMA_DIALOGUES.length)];
    setDialogText(randomText);
    setDialogOpen(true);
  };

  const handleWakeUp = () => {
    if (!isOnBench) return;
    setIsOnBench(false);
    audioManager.playSFX('ui_button_confirm');
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleSitBench = () => {
    setIsOnBench(true);
    audioManager.playSFX('ui_button_confirm');
    setCurrentHealth(maxHealth);
    setSilkThread(100);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Keyboard controls
  useEffect(() => {
    if (isPaused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        audioManager.playSFX('ui_option_click');
        return;
      }

      if (dialogOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'e' || e.key === 'E') {
          setDialogOpen(false);
          audioManager.playSFX('ui_option_click');
        }
        return;
      }

      // Wake up from bench
      if (isOnBench) {
        if (['ArrowRight', 'ArrowLeft', 'd', 'D', 'a', 'A', ' ', 'w', 'W'].includes(e.key)) {
          handleWakeUp();
          return;
        }
      } else {
        // Sit back down
        if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
          handleSitBench();
          return;
        }
      }

      // Talk to Sherma
      if (e.key === 'e' || e.key === 'E') {
        handleTalkToSherma();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOnBench, isPaused, dialogOpen, maxHealth]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      {/* Background Layer:
          When on bench: show bench_scene.png (Hornet sitting gracefully on the throne)
          When awake: plays ingame_walk.mp4 video seamlessly showing Hornet awakening and sprinting right!
      */}
      <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
        {isOnBench ? (
          <img
            src="/assets/bench_scene.png"
            alt="Pharloom Shrine Bench"
            className="w-full h-full object-cover filter brightness-95 contrast-105"
            draggable={false}
          />
        ) : (
          <video
            ref={videoRef}
            src="/assets/ingame_walk.mp4"
            className="w-full h-full object-cover"
            playsInline
            onEnded={() => {
              // Video finished walk, loop or remain standing
            }}
          />
        )}
        {/* Subtle Cavern Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 pointer-events-none" />
      </div>

      {/* Top Left Silksong HUD with Zachrie's Profile identity */}
      <div className="absolute left-8 top-8 z-30 flex items-start gap-4">
        {/* Silk Spool Crest */}
        <div className="relative flex items-center">
          <SilkSpoolIcon className="w-16 h-16 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
          
          {/* Needle Silk Gauge extending to the right */}
          <div className="relative flex items-center -ml-2">
            <svg width="180" height="26" viewBox="0 0 180 26" fill="none">
              <path
                d="M4 13 L28 4 L170 11 L178 13 L170 15 L28 22 Z"
                fill="#181215"
                stroke="#ffffff"
                strokeWidth="1.6"
              />
              <path
                d={`M12 13 L28 6 L${Math.max(30, 28 + (silkThread / 100) * 135)} 11 L${Math.max(30, 28 + (silkThread / 100) * 135)} 15 L28 20 Z`}
                fill="#ffffff"
                className="transition-all duration-300 filter drop-shadow-[0_0_6px_white]"
              />
            </svg>
          </div>
        </div>

        {/* Health Masks & Profile Name */}
        <div className="flex flex-col justify-center pt-1.5 -ml-16 z-40">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxHealth }).map((_, mIdx) => (
              <MaskShard
                key={mIdx}
                filled={mIdx < currentHealth}
                className="w-5 h-7 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
              />
            ))}
          </div>

          {/* Profile Name & Beads Count */}
          <div className="flex items-center gap-2 mt-2 pl-1">
            <span className="font-cinzel text-xs text-amber-200 font-semibold tracking-wider">
              {profile?.name || 'ZACHRIE KURNIAWAN'}
            </span>
            <span className="text-neutral-500">•</span>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M2 7 L7 2 L12 7 L7 12 Z" fill="#dddddd" stroke="#ffffff" strokeWidth="1" />
            </svg>
            <span className="font-cinzel text-xs text-neutral-300 tracking-widest font-light">
              {profile?.beads || 308} BEADS
            </span>
          </div>
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute right-8 top-8 z-30 flex items-center gap-4">
        {!isOnBench && (
          <button
            type="button"
            onClick={handleSitBench}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900/80 border border-neutral-600 rounded text-neutral-300 hover:text-white hover:border-white font-cinzel text-xs tracking-wider transition-all"
          >
            <RotateCcw size={14} />
            REST ON BENCH [S]
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsPaused(true)}
          className="px-3 py-1.5 bg-neutral-900/80 border border-neutral-600 rounded text-neutral-300 hover:text-white hover:border-white font-cinzel text-xs tracking-wider transition-all"
        >
          PAUSE [ESC]
        </button>
      </div>

      {/* Sitting Bench Prompt */}
      {isOnBench && (
        <div
          onClick={handleWakeUp}
          className="absolute bottom-[36%] left-[50%] -translate-x-1/2 flex flex-col items-center cursor-pointer z-30"
        >
          <div className="bg-black/80 px-4 py-1.5 border border-white/50 rounded text-xs font-cinzel text-white shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse">
            PRESS [D] OR [SPACE] TO WAKE
          </div>
        </div>
      )}

      {/* Sherma interaction hit area */}
      <div
        className="absolute bottom-[24%] left-[30%] sm:left-[32%] md:left-[34%] w-24 h-28 cursor-pointer group flex flex-col items-center justify-start z-30"
        onClick={handleTalkToSherma}
      >
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2.5 py-0.5 border border-white/40 rounded text-[11px] font-cinzel text-white flex items-center gap-1 shadow-[0_0_8px_white]">
          <MessageSquare size={10} />
          TALK [E]
        </div>
      </div>

      {/* Sherma Dialogue Box */}
      {dialogOpen && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-6">
          <div className="bg-black/95 border-2 border-white/70 p-6 rounded shadow-[0_0_35px_rgba(255,255,255,0.3)]">
            <div className="flex items-center justify-between pb-3 border-b border-white/20 mb-3">
              <span className="font-cinzel text-lg tracking-widest text-amber-200 font-semibold">
                SHERMA
              </span>
              <span className="font-cinzel text-xs text-neutral-400">
                PRESS [SPACE] TO CONTINUE
              </span>
            </div>
            <p className="font-marcellus text-lg text-neutral-100 tracking-wide leading-relaxed">
              {dialogText}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Controls Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 px-6 py-2 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full text-xs font-cinzel text-neutral-400 tracking-wider">
        <span>[D / SPACE] WAKE UP</span>
        <span>[S] REST ON BENCH</span>
        <span>[E] TALK TO SHERMA</span>
        <span>[ESC] PAUSE</span>
      </div>

      {/* In-Game Pause Menu */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center select-none">
          <h2 className="font-cinzel text-3xl tracking-[0.25em] text-white glow-white mb-8">
            GAME PAUSED
          </h2>

          <div className="flex flex-col items-center space-y-4">
            <MenuItem
              label="CONTINUE"
              selected
              onClick={() => {
                audioManager.playSFX('ui_button_confirm');
                setIsPaused(false);
              }}
            />
            <MenuItem
              label="OPTIONS"
              onClick={() => {
                setIsPaused(false);
                onOpenOptions();
              }}
            />
            <MenuItem
              label="QUIT TO TITLE"
              onClick={() => {
                audioManager.playSFX('ui_option_click');
                setIsPaused(false);
                audioManager.ensureMenuBGM();
                onReturnToTitle();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
