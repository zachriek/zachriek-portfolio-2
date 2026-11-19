import React, { useState, useEffect } from 'react';
import { MenuItem } from '../components/MenuItem';
import { HeaderDivider, SelectionArrow } from '../components/Flourish';
import { CustomSlider } from '../components/Slider';
import { ScreenType, GameSettingsState, defaultSettings } from '../types';
import { audioManager, PlaybackState } from '../utils/audio';

interface AudioOptionsProps {
  settings: GameSettingsState;
  onUpdateSettings: (newSettings: Partial<GameSettingsState>) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const AudioOptions: React.FC<AudioOptionsProps> = ({
  settings,
  onUpdateSettings,
  onNavigate,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playback, setPlayback] = useState<PlaybackState>(audioManager.getPlaybackState());

  useEffect(() => {
    return audioManager.subscribe((state) => {
      setPlayback(state);
    });
  }, []);

  const handleReset = () => {
    onUpdateSettings({
      masterVolume: defaultSettings.masterVolume,
      soundVolume: defaultSettings.soundVolume,
      musicVolume: defaultSettings.musicVolume,
      heroVoice: defaultSettings.heroVoice,
    });
    audioManager.updateSettings({
      masterVolume: defaultSettings.masterVolume,
      soundVolume: defaultSettings.soundVolume,
      musicVolume: defaultSettings.musicVolume,
      heroVoice: defaultSettings.heroVoice,
    });
    audioManager.playSFX('ui_option_click');
  };

  const handleBack = () => {
    audioManager.playSFX('ui_option_click');
    onNavigate('options');
  };

  const TOTAL_ITEMS = 7; // 0: Master, 1: Sound, 2: Music, 3: Soundtrack Menu, 4: Hero Voice, 5: Reset, 6: Back

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : TOTAL_ITEMS - 1));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex((prev) => (prev < TOTAL_ITEMS - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        if (selectedIndex === 0) {
          const v = Math.max(0, settings.masterVolume - 1);
          onUpdateSettings({ masterVolume: v });
          audioManager.updateSettings({ masterVolume: v });
        } else if (selectedIndex === 1) {
          const v = Math.max(0, settings.soundVolume - 1);
          onUpdateSettings({ soundVolume: v });
          audioManager.updateSettings({ soundVolume: v });
        } else if (selectedIndex === 2) {
          const v = Math.max(0, settings.musicVolume - 1);
          onUpdateSettings({ musicVolume: v });
          audioManager.updateSettings({ musicVolume: v });
        } else if (selectedIndex === 3) {
          audioManager.playSFX('ui_change_selection');
          audioManager.prevTrack();
        } else if (selectedIndex === 4) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ heroVoice: !settings.heroVoice });
          audioManager.updateSettings({ heroVoice: !settings.heroVoice });
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        if (selectedIndex === 0) {
          const v = Math.min(10, settings.masterVolume + 1);
          onUpdateSettings({ masterVolume: v });
          audioManager.updateSettings({ masterVolume: v });
        } else if (selectedIndex === 1) {
          const v = Math.min(10, settings.soundVolume + 1);
          onUpdateSettings({ soundVolume: v });
          audioManager.updateSettings({ soundVolume: v });
        } else if (selectedIndex === 2) {
          const v = Math.min(10, settings.musicVolume + 1);
          onUpdateSettings({ musicVolume: v });
          audioManager.updateSettings({ musicVolume: v });
        } else if (selectedIndex === 3) {
          audioManager.playSFX('ui_change_selection');
          audioManager.nextTrack();
        } else if (selectedIndex === 4) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ heroVoice: !settings.heroVoice });
          audioManager.updateSettings({ heroVoice: !settings.heroVoice });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex === 3) {
          audioManager.playSFX('ui_button_confirm');
          onNavigate('soundtrack');
        } else if (selectedIndex === 4) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ heroVoice: !settings.heroVoice });
          audioManager.updateSettings({ heroVoice: !settings.heroVoice });
        } else if (selectedIndex === 5) {
          handleReset();
        } else if (selectedIndex === 6) {
          handleBack();
        }
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
          AUDIO
        </h1>
        <HeaderDivider />
      </div>

      {/* Sliders and settings list */}
      <div className="flex flex-col items-center space-y-4 sm:space-y-5 my-auto w-full max-w-xl px-2 overflow-y-auto overflow-x-hidden max-h-[65vh] custom-scrollbar">
        {/* Master Volume */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer w-full justify-center"
          onMouseEnter={() => setSelectedIndex(0)}
        >
          <div className={selectedIndex === 0 ? 'opacity-100' : 'opacity-0'}>
            <SelectionArrow direction="left" />
          </div>
          <CustomSlider
            label="MASTER VOLUME"
            value={settings.masterVolume}
            min={0}
            max={10}
            onChange={(val) => {
              onUpdateSettings({ masterVolume: val });
              audioManager.updateSettings({ masterVolume: val });
            }}
          />
          <div className={selectedIndex === 0 ? 'opacity-100' : 'opacity-0'}>
            <SelectionArrow direction="right" />
          </div>
        </div>

        {/* Sound Volume */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer w-full justify-center"
          onMouseEnter={() => setSelectedIndex(1)}
        >
          <div className={selectedIndex === 1 ? 'opacity-100' : 'opacity-0'}>
            <SelectionArrow direction="left" />
          </div>
          <CustomSlider
            label="SOUND VOLUME"
            value={settings.soundVolume}
            min={0}
            max={10}
            onChange={(val) => {
              onUpdateSettings({ soundVolume: val });
              audioManager.updateSettings({ soundVolume: val });
            }}
          />
          <div className={selectedIndex === 1 ? 'opacity-100' : 'opacity-0'}>
            <SelectionArrow direction="right" />
          </div>
        </div>

        {/* Music Volume */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer w-full justify-center"
          onMouseEnter={() => setSelectedIndex(2)}
        >
          <div className={selectedIndex === 2 ? 'opacity-100' : 'opacity-0'}>
            <SelectionArrow direction="left" />
          </div>
          <CustomSlider
            label="MUSIC VOLUME"
            value={settings.musicVolume}
            min={0}
            max={10}
            onChange={(val) => {
              onUpdateSettings({ musicVolume: val });
              audioManager.updateSettings({ musicVolume: val });
            }}
          />
          <div className={selectedIndex === 2 ? 'opacity-100' : 'opacity-0'}>
            <SelectionArrow direction="right" />
          </div>
        </div>

        {/* Soundtrack Selector Quick Access */}
        <div className="w-full pt-1 flex justify-center">
          <MenuItem
            label="SOUNDTRACK MENU"
            value={playback.currentTrack.title}
            description="Select and play any official Hollow Knight: Silksong track."
            selected={selectedIndex === 3}
            onHover={() => setSelectedIndex(3)}
            onPrev={() => audioManager.prevTrack()}
            onNext={() => audioManager.nextTrack()}
            onClick={() => onNavigate('soundtrack')}
          />
        </div>

        {/* Hero Voice */}
        <div className="w-full flex justify-center">
          <MenuItem
            label="HERO VOICE"
            value={settings.heroVoice ? 'ON' : 'OFF'}
            selected={selectedIndex === 4}
            onHover={() => setSelectedIndex(4)}
            onPrev={() => {
              onUpdateSettings({ heroVoice: !settings.heroVoice });
              audioManager.updateSettings({ heroVoice: !settings.heroVoice });
            }}
            onNext={() => {
              onUpdateSettings({ heroVoice: !settings.heroVoice });
              audioManager.updateSettings({ heroVoice: !settings.heroVoice });
            }}
            onClick={() => {
              onUpdateSettings({ heroVoice: !settings.heroVoice });
              audioManager.updateSettings({ heroVoice: !settings.heroVoice });
            }}
          />
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col items-center space-y-2.5 sm:space-y-3.5 pb-2 shrink-0">
        <MenuItem
          label="RESET DEFAULTS"
          selected={selectedIndex === 5}
          onHover={() => setSelectedIndex(5)}
          onClick={handleReset}
        />
        <MenuItem
          label="BACK"
          selected={selectedIndex === 6}
          onHover={() => setSelectedIndex(6)}
          onClick={handleBack}
        />
      </div>
    </div>
  );
};
