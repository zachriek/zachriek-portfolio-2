import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScreenType, GameSettingsState, defaultSettings, SaveProfile } from './types';
import { audioManager } from './utils/audio';
import { EmberCanvas } from './components/EmberCanvas';
import { StartScreen } from './screens/StartScreen';
import { MainMenu } from './screens/MainMenu';
import { SoundtrackMenu } from './screens/SoundtrackMenu';
import { OptionsMenu } from './screens/OptionsMenu';
import { GameOptions } from './screens/GameOptions';
import { AudioOptions } from './screens/AudioOptions';
import { VideoOptions } from './screens/VideoOptions';
import { ScreenScale } from './screens/ScreenScale';
import { BrightnessSetting } from './screens/BrightnessSetting';
import { AdvancedSettings } from './screens/AdvancedSettings';
import { KeybindScreen } from './screens/KeybindScreen';
import { SelectProfile } from './screens/SelectProfile';
import { AchievementsModal } from './screens/AchievementsModal';
import { ExtrasModal } from './screens/ExtrasModal';

export function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('title');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('title');
  const [settings, setSettings] = useState<GameSettingsState>(defaultSettings);
  const [activeProfile, setActiveProfile] = useState<SaveProfile | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Menu Transition States
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fadeState, setFadeState] = useState<'idle' | 'fading-out' | 'fading-in'>('idle');

  const isTransitioningRef = useRef(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Once entered, ensure BGM continues playing seamlessly across all menu screens
  useEffect(() => {
    if (hasEntered) {
      audioManager.ensureMenuBGM();
    }
  }, [currentScreen, hasEntered]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    };
  }, []);

  // Block keyboard events during menu transition to prevent glitchy state
  useEffect(() => {
    if (!isTransitioning) return;
    const blockKeys = (e: KeyboardEvent) => {
      e.stopPropagation();
    };
    window.addEventListener('keydown', blockKeys, { capture: true });
    return () => window.removeEventListener('keydown', blockKeys, { capture: true });
  }, [isTransitioning]);

  const handleNavigate = useCallback(
    (targetScreen: ScreenType) => {
      if (isTransitioningRef.current || targetScreen === currentScreen) {
        return;
      }

      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setPreviousScreen(currentScreen);
      setFadeState('fading-out');

      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);

      fadeTimeoutRef.current = setTimeout(() => {
        setCurrentScreen(targetScreen);
        setFadeState('fading-in');

        finishTimeoutRef.current = setTimeout(() => {
          setFadeState('idle');
          setIsTransitioning(false);
          isTransitioningRef.current = false;
        }, 200);
      }, 200);
    },
    [currentScreen]
  );

  const handleEnterApp = useCallback(() => {
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setFadeState('fading-out');

    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);

    fadeTimeoutRef.current = setTimeout(() => {
      setHasEntered(true);
      audioManager.unlockAudio();
      setCurrentScreen('title');
      setFadeState('fading-in');

      finishTimeoutRef.current = setTimeout(() => {
        setFadeState('idle');
        setIsTransitioning(false);
        isTransitioningRef.current = false;
      }, 200);
    }, 200);
  }, []);

  const handleUpdateSettings = (newSettings: Partial<GameSettingsState>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSelectSave = (profile: SaveProfile) => {
    setActiveProfile(profile);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      audioManager.updateSettings({ masterVolume: settings.masterVolume });
      setIsMuted(false);
    } else {
      audioManager.updateSettings({ masterVolume: 0 });
      setIsMuted(true);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      tabIndex={0}
      className="relative w-screen h-screen min-h-dvh overflow-hidden bg-[#070406] text-white font-cinzel outline-none select-none"
      style={{
        filter: `brightness(${settings.brightness}%)`,
      }}
    >
      {/* Background Atmosphere & Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-[#0a0508]/80 to-[#040203]" />
        <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-red-950/25 via-amber-950/15 to-transparent" />
      </div>

      {/* Floating Ember Particles System */}
      <EmberCanvas density={settings.particleEffects.toLowerCase() as any} />

      {/* Top Floating Utility Controls (Mute / Fullscreen) */}
      {hasEntered && (
        <div className="absolute top-3 right-4 sm:top-4 sm:right-6 z-50 flex items-center gap-3 sm:gap-4 opacity-50 hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleToggleMute}
            className="font-cinzel text-[10px] sm:text-[11px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
          >
            {isMuted ? 'UNMUTE' : 'MUTE'}
          </button>
          <span className="text-neutral-600 text-xs">•</span>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="font-cinzel text-[10px] sm:text-[11px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
          >
            FULLSCREEN
          </button>
        </div>
      )}

      {/* Screen Viewport with smooth Hollow Knight Fade-in & Fade-out */}
      <div
        className={`relative w-full h-full z-20 transition-opacity duration-200 ease-in-out ${
          fadeState === 'fading-out' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {!hasEntered ? (
          <StartScreen onEnter={handleEnterApp} />
        ) : (
          <>
            {currentScreen === 'title' && (
              <MainMenu
                onNavigate={handleNavigate}
                onQuit={() => {
                  if (confirm('Quit to Desktop?')) {
                    window.close();
                  }
                }}
              />
            )}

            {currentScreen === 'soundtrack' && (
              <SoundtrackMenu
                onNavigate={handleNavigate}
                returnScreen={previousScreen || 'title'}
              />
            )}

            {currentScreen === 'options' && (
              <OptionsMenu onNavigate={handleNavigate} />
            )}

            {currentScreen === 'options_game' && (
              <GameOptions
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'options_audio' && (
              <AudioOptions
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'options_video' && (
              <VideoOptions
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'options_controller' && (
              <KeybindScreen
                type="controller"
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'options_keyboard' && (
              <KeybindScreen
                type="keyboard"
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'screen_scale' && (
              <ScreenScale
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'brightness' && (
              <BrightnessSetting
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'advanced_settings' && (
              <AdvancedSettings
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'select_profile' && (
              <SelectProfile
                onSelectSave={handleSelectSave}
                onNavigate={handleNavigate}
              />
            )}

            {currentScreen === 'achievements' && (
              <AchievementsModal onBack={() => handleNavigate('title')} />
            )}

            {currentScreen === 'extras' && (
              <ExtrasModal onBack={() => handleNavigate('title')} />
            )}
          </>
        )}
      </div>

      {/* Atmospheric Black Veil Transition Layer */}
      <div
        className={`absolute inset-0 bg-[#070406]/70 pointer-events-none z-30 transition-opacity duration-200 ease-in-out ${
          fadeState === 'fading-out' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export default App;
