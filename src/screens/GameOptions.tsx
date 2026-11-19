import React, { useState, useEffect } from 'react';
import { MenuItem } from '../components/MenuItem';
import { HeaderDivider } from '../components/Flourish';
import { ScreenType, GameSettingsState, defaultSettings } from '../types';
import { audioManager } from '../utils/audio';

interface GameOptionsProps {
  settings: GameSettingsState;
  onUpdateSettings: (newSettings: Partial<GameSettingsState>) => void;
  onNavigate: (screen: ScreenType) => void;
}

const LANGUAGES = ['ENGLISH', 'FRANÇAIS', 'ESPAÑOL', 'DEUTSCH', 'ITALIANO', '日本語', '한국어', '中文'];
const HUD_OPTIONS = ['OFF', 'SMALL', 'NORMAL', 'LARGE'] as const;

export const GameOptions: React.FC<GameOptionsProps> = ({
  settings,
  onUpdateSettings,
  onNavigate,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const toggleLanguage = (forward: boolean) => {
    audioManager.playSFX('ui_option_click');
    const curIdx = LANGUAGES.indexOf(settings.language);
    const nextIdx = forward
      ? (curIdx + 1) % LANGUAGES.length
      : (curIdx - 1 + LANGUAGES.length) % LANGUAGES.length;
    onUpdateSettings({ language: LANGUAGES[nextIdx] });
  };

  const toggleHud = (forward: boolean) => {
    audioManager.playSFX('ui_option_click');
    const curIdx = HUD_OPTIONS.indexOf(settings.hudAppearance);
    const nextIdx = forward
      ? (curIdx + 1) % HUD_OPTIONS.length
      : (curIdx - 1 + HUD_OPTIONS.length) % HUD_OPTIONS.length;
    onUpdateSettings({ hudAppearance: HUD_OPTIONS[nextIdx] });
  };

  const handleReset = () => {
    onUpdateSettings({
      language: defaultSettings.language,
      cameraShake: defaultSettings.cameraShake,
      hudAppearance: defaultSettings.hudAppearance,
      showAchievements: defaultSettings.showAchievements,
      backerCredits: defaultSettings.backerCredits,
    });
    audioManager.playSFX('ui_option_click');
  };

  const handleBack = () => {
    audioManager.playSFX('ui_option_click');
    onNavigate('options');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 6));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex((prev) => (prev < 6 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        if (selectedIndex === 0) toggleLanguage(false);
        if (selectedIndex === 1) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ cameraShake: !settings.cameraShake });
        }
        if (selectedIndex === 2) toggleHud(false);
        if (selectedIndex === 3) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ showAchievements: !settings.showAchievements });
        }
        if (selectedIndex === 4) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ backerCredits: !settings.backerCredits });
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex === 0) toggleLanguage(true);
        if (selectedIndex === 1) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ cameraShake: !settings.cameraShake });
        }
        if (selectedIndex === 2) toggleHud(true);
        if (selectedIndex === 3) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ showAchievements: !settings.showAchievements });
        }
        if (selectedIndex === 4) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ backerCredits: !settings.backerCredits });
        }
        if (selectedIndex === 5) handleReset();
        if (selectedIndex === 6) handleBack();
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
          GAME OPTIONS
        </h1>
        <HeaderDivider />
      </div>

      {/* Options List */}
      <div className="flex flex-col items-center space-y-3 sm:space-y-4 my-auto w-full max-w-xl px-2 overflow-y-auto overflow-x-hidden max-h-[65vh] custom-scrollbar">
        {/* Language */}
        <MenuItem
          label="LANGUAGE"
          value={settings.language}
          selected={selectedIndex === 0}
          onHover={() => setSelectedIndex(0)}
          onPrev={() => toggleLanguage(false)}
          onNext={() => toggleLanguage(true)}
          onClick={() => toggleLanguage(true)}
        />

        {/* Camera Shake */}
        <MenuItem
          label="CAMERA SHAKE"
          value={settings.cameraShake ? 'ON' : 'OFF'}
          selected={selectedIndex === 1}
          onHover={() => setSelectedIndex(1)}
          onPrev={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ cameraShake: !settings.cameraShake });
          }}
          onNext={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ cameraShake: !settings.cameraShake });
          }}
          onClick={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ cameraShake: !settings.cameraShake });
          }}
        />

        {/* HUD Appearance */}
        <MenuItem
          label="HUD APPEARANCE"
          value={settings.hudAppearance}
          description="Adjust the scale of the HUD. Will reset on game exit if set to 'Off'."
          selected={selectedIndex === 2}
          onHover={() => setSelectedIndex(2)}
          onPrev={() => toggleHud(false)}
          onNext={() => toggleHud(true)}
          onClick={() => toggleHud(true)}
        />

        {/* Show Achievements */}
        <MenuItem
          label="SHOW ACHIEVEMENTS"
          value={settings.showAchievements ? 'ON' : 'OFF'}
          selected={selectedIndex === 3}
          onHover={() => setSelectedIndex(3)}
          onPrev={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ showAchievements: !settings.showAchievements });
          }}
          onNext={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ showAchievements: !settings.showAchievements });
          }}
          onClick={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ showAchievements: !settings.showAchievements });
          }}
        />

        {/* Backer Credits */}
        <MenuItem
          label="BACKER CREDITS"
          value={settings.backerCredits ? 'ON' : 'OFF'}
          description="Show names of Kickstarter backers alongside their contributions."
          selected={selectedIndex === 4}
          onHover={() => setSelectedIndex(4)}
          onPrev={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ backerCredits: !settings.backerCredits });
          }}
          onNext={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ backerCredits: !settings.backerCredits });
          }}
          onClick={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ backerCredits: !settings.backerCredits });
          }}
        />
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
