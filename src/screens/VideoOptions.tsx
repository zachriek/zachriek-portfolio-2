import React, { useState, useEffect } from 'react';
import { MenuItem } from '../components/MenuItem';
import { HeaderDivider } from '../components/Flourish';
import { ScreenType, GameSettingsState, defaultSettings } from '../types';
import { audioManager } from '../utils/audio';

interface VideoOptionsProps {
  settings: GameSettingsState;
  onUpdateSettings: (newSettings: Partial<GameSettingsState>) => void;
  onNavigate: (screen: ScreenType) => void;
}

const RESOLUTIONS = [
  '1920 x 1080 @ 60Hz',
  '2560 x 1440 @ 60Hz',
  '2560 x 1440 @ 144Hz',
  '3840 x 2160 @ 60Hz',
];

const FULLSCREEN_MODES = ['BORDERLESS', 'FULLSCREEN', 'WINDOWED'] as const;
const FPS_CAPS = ['OFF', '60 FPS', '120 FPS', '144 FPS', '240 FPS'];

export const VideoOptions: React.FC<VideoOptionsProps> = ({
  settings,
  onUpdateSettings,
  onNavigate,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const toggleResolution = (forward: boolean) => {
    audioManager.playSFX('ui_option_click');
    const idx = RESOLUTIONS.indexOf(settings.resolution);
    const nextIdx = forward
      ? (idx + 1) % RESOLUTIONS.length
      : (idx - 1 + RESOLUTIONS.length) % RESOLUTIONS.length;
    onUpdateSettings({ resolution: RESOLUTIONS[nextIdx] });
  };

  const toggleFullscreen = (forward: boolean) => {
    audioManager.playSFX('ui_option_click');
    const idx = FULLSCREEN_MODES.indexOf(settings.fullScreen);
    const nextIdx = forward
      ? (idx + 1) % FULLSCREEN_MODES.length
      : (idx - 1 + FULLSCREEN_MODES.length) % FULLSCREEN_MODES.length;
    onUpdateSettings({ fullScreen: FULLSCREEN_MODES[nextIdx] });

    if (FULLSCREEN_MODES[nextIdx] === 'FULLSCREEN' && document.fullscreenEnabled) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleFps = (forward: boolean) => {
    audioManager.playSFX('ui_option_click');
    const idx = FPS_CAPS.indexOf(settings.frameRateCap);
    const nextIdx = forward
      ? (idx + 1) % FPS_CAPS.length
      : (idx - 1 + FPS_CAPS.length) % FPS_CAPS.length;
    onUpdateSettings({ frameRateCap: FPS_CAPS[nextIdx] });
  };

  const handleReset = () => {
    onUpdateSettings({
      resolution: defaultSettings.resolution,
      fullScreen: defaultSettings.fullScreen,
      vSync: defaultSettings.vSync,
      frameRateCap: defaultSettings.frameRateCap,
      screenScale: defaultSettings.screenScale,
      brightness: defaultSettings.brightness,
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
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 8));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setSelectedIndex((prev) => (prev < 8 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        if (selectedIndex === 0) toggleResolution(false);
        if (selectedIndex === 1) toggleFullscreen(false);
        if (selectedIndex === 2) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ vSync: !settings.vSync });
        }
        if (selectedIndex === 3) toggleFps(false);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        if (selectedIndex === 0) toggleResolution(true);
        if (selectedIndex === 1) toggleFullscreen(true);
        if (selectedIndex === 2) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ vSync: !settings.vSync });
        }
        if (selectedIndex === 3) toggleFps(true);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex === 0) toggleResolution(true);
        if (selectedIndex === 1) toggleFullscreen(true);
        if (selectedIndex === 2) {
          audioManager.playSFX('ui_option_click');
          onUpdateSettings({ vSync: !settings.vSync });
        }
        if (selectedIndex === 3) toggleFps(true);
        if (selectedIndex === 4) {
          audioManager.playSFX('ui_button_confirm');
          onNavigate('screen_scale');
        }
        if (selectedIndex === 5) {
          audioManager.playSFX('ui_button_confirm');
          onNavigate('brightness');
        }
        if (selectedIndex === 6) {
          audioManager.playSFX('ui_button_confirm');
          onNavigate('advanced_settings');
        }
        if (selectedIndex === 7) handleReset();
        if (selectedIndex === 8) handleBack();
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
          VIDEO
        </h1>
        <HeaderDivider />
      </div>

      {/* Settings list */}
      <div className="flex flex-col items-center space-y-2.5 sm:space-y-3.5 my-auto w-full max-w-xl px-2 overflow-y-auto overflow-x-hidden max-h-[65vh] custom-scrollbar">
        <MenuItem
          label="RESOLUTION"
          value={settings.resolution}
          selected={selectedIndex === 0}
          onHover={() => setSelectedIndex(0)}
          onPrev={() => toggleResolution(false)}
          onNext={() => toggleResolution(true)}
          onClick={() => toggleResolution(true)}
        />

        <MenuItem
          label="FULL SCREEN"
          value={settings.fullScreen}
          selected={selectedIndex === 1}
          onHover={() => setSelectedIndex(1)}
          onPrev={() => toggleFullscreen(false)}
          onNext={() => toggleFullscreen(true)}
          onClick={() => toggleFullscreen(true)}
        />

        <MenuItem
          label="V-SYNC"
          value={settings.vSync ? 'ON' : 'OFF'}
          description="Prevents screen tearing. Leave on for a smoother experience."
          selected={selectedIndex === 2}
          onHover={() => setSelectedIndex(2)}
          onPrev={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ vSync: !settings.vSync });
          }}
          onNext={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ vSync: !settings.vSync });
          }}
          onClick={() => {
            audioManager.playSFX('ui_option_click');
            onUpdateSettings({ vSync: !settings.vSync });
          }}
        />

        <MenuItem
          label="FRAME RATE CAP"
          value={settings.frameRateCap}
          selected={selectedIndex === 3}
          onHover={() => setSelectedIndex(3)}
          onPrev={() => toggleFps(false)}
          onNext={() => toggleFps(true)}
          onClick={() => toggleFps(true)}
        />

        <MenuItem
          label="SCREEN SCALE"
          selected={selectedIndex === 4}
          onHover={() => setSelectedIndex(4)}
          onClick={() => {
            audioManager.playSFX('ui_button_confirm');
            onNavigate('screen_scale');
          }}
        />

        <MenuItem
          label="BRIGHTNESS"
          selected={selectedIndex === 5}
          onHover={() => setSelectedIndex(5)}
          onClick={() => {
            audioManager.playSFX('ui_button_confirm');
            onNavigate('brightness');
          }}
        />

        <MenuItem
          label="ADVANCED SETTINGS"
          selected={selectedIndex === 6}
          onHover={() => setSelectedIndex(6)}
          onClick={() => {
            audioManager.playSFX('ui_button_confirm');
            onNavigate('advanced_settings');
          }}
        />
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col items-center space-y-2.5 sm:space-y-3 pb-2 shrink-0">
        <MenuItem
          label="RESET DEFAULTS"
          selected={selectedIndex === 7}
          onHover={() => setSelectedIndex(7)}
          onClick={handleReset}
        />
        <MenuItem
          label="BACK"
          selected={selectedIndex === 8}
          onHover={() => setSelectedIndex(8)}
          onClick={handleBack}
        />
      </div>
    </div>
  );
};
