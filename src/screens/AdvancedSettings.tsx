import React, { useState, useEffect } from 'react';
import { MenuItem } from '../components/MenuItem';
import { HeaderDivider } from '../components/Flourish';
import { ScreenType, GameSettingsState, defaultSettings } from '../types';
import { audioManager } from '../utils/audio';

interface AdvancedSettingsProps {
  settings: GameSettingsState;
  onUpdateSettings: (newSettings: Partial<GameSettingsState>) => void;
  onNavigate: (screen: ScreenType) => void;
}

const PARTICLE_LEVELS = ['LOW', 'NORMAL', 'HIGH'] as const;
const BLUR_LEVELS = ['LOW', 'HIGH'] as const;

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  settings,
  onUpdateSettings,
  onNavigate,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const toggleParticles = (forward: boolean) => {
    audioManager.playSFX('ui_option_click');
    const idx = PARTICLE_LEVELS.indexOf(settings.particleEffects);
    const nextIdx = forward
      ? (idx + 1) % PARTICLE_LEVELS.length
      : (idx - 1 + PARTICLE_LEVELS.length) % PARTICLE_LEVELS.length;
    onUpdateSettings({ particleEffects: PARTICLE_LEVELS[nextIdx] });
  };

  const toggleBlur = (forward: boolean) => {
    audioManager.playSFX('ui_option_click');
    const idx = BLUR_LEVELS.indexOf(settings.blurQuality as any);
    const nextIdx = forward
      ? (idx + 1) % BLUR_LEVELS.length
      : (idx - 1 + BLUR_LEVELS.length) % BLUR_LEVELS.length;
    onUpdateSettings({ blurQuality: BLUR_LEVELS[nextIdx] });
  };

  const handleReset = () => {
    onUpdateSettings({
      particleEffects: defaultSettings.particleEffects,
      blurQuality: defaultSettings.blurQuality,
      dithering: defaultSettings.dithering,
    });
    audioManager.playSFX('ui_option_click');
  };

  const handleBack = () => {
    audioManager.playSFX('ui_option_click');
    onNavigate('options_video');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 4));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex((prev) => (prev < 4 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        if (selectedIndex === 0) toggleParticles(false);
        if (selectedIndex === 1) toggleBlur(false);
        if (selectedIndex === 2) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ dithering: !settings.dithering });
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        if (selectedIndex === 0) toggleParticles(true);
        if (selectedIndex === 1) toggleBlur(true);
        if (selectedIndex === 2) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ dithering: !settings.dithering });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex === 0) toggleParticles(true);
        if (selectedIndex === 1) toggleBlur(true);
        if (selectedIndex === 2) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ dithering: !settings.dithering });
        }
        if (selectedIndex === 3) handleReset();
        if (selectedIndex === 4) handleBack();
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
      {/* Header */}
      <div className="flex flex-col items-center shrink-0">
        <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.25em] text-white glow-white text-center">
          ADVANCED SETTINGS
        </h1>
        <HeaderDivider />
      </div>

      {/* Settings list */}
      <div className="flex flex-col items-center space-y-3 sm:space-y-4 my-auto w-full max-w-xl px-2 overflow-y-auto overflow-x-hidden max-h-[65vh] custom-scrollbar">
        <MenuItem
          label="PARTICLE EFFECTS"
          value={settings.particleEffects}
          description="Reduce to improve performance on lower end systems."
          selected={selectedIndex === 0}
          onHover={() => setSelectedIndex(0)}
          onPrev={() => toggleParticles(false)}
          onNext={() => toggleParticles(true)}
          onClick={() => toggleParticles(true)}
        />

        <MenuItem
          label="BLUR QUALITY"
          value={settings.blurQuality}
          description="Reduce to improve performance on lower end systems."
          selected={selectedIndex === 1}
          onHover={() => setSelectedIndex(1)}
          onPrev={() => toggleBlur(false)}
          onNext={() => toggleBlur(true)}
          onClick={() => toggleBlur(true)}
        />

        <MenuItem
          label="DITHERING"
          value={settings.dithering ? 'ON' : 'OFF'}
          description="Reduces colour banding, but may effect performance on lower end systems."
          selected={selectedIndex === 2}
          onHover={() => setSelectedIndex(2)}
          onPrev={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ dithering: !settings.dithering });
          }}
          onNext={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ dithering: !settings.dithering });
          }}
          onClick={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ dithering: !settings.dithering });
          }}
        />
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col items-center space-y-2.5 sm:space-y-3 pb-2 shrink-0">
        <MenuItem
          label="RESET DEFAULTS"
          selected={selectedIndex === 3}
          onHover={() => setSelectedIndex(3)}
          onClick={handleReset}
        />
        <MenuItem
          label="BACK"
          selected={selectedIndex === 4}
          onHover={() => setSelectedIndex(4)}
          onClick={handleBack}
        />
      </div>
    </div>
  );
};
