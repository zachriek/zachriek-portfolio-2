export type ScreenType =
  | 'title'
  | 'soundtrack'
  | 'options'
  | 'options_game'
  | 'options_audio'
  | 'options_video'
  | 'options_controller'
  | 'options_keyboard'
  | 'screen_scale'
  | 'brightness'
  | 'advanced_settings'
  | 'select_profile'
  | 'achievements'
  | 'extras'
  | 'loading'
  | 'ingame';

export interface GameSettingsState {
  // Game
  language: string;
  cameraShake: boolean;
  hudAppearance: 'OFF' | 'SMALL' | 'NORMAL' | 'LARGE';
  showAchievements: boolean;
  backerCredits: boolean;

  // Audio
  masterVolume: number; // 0 - 10
  soundVolume: number;  // 0 - 10
  musicVolume: number;  // 0 - 10
  heroVoice: boolean;

  // Video
  resolution: string;
  fullScreen: 'WINDOWED' | 'BORDERLESS' | 'FULLSCREEN';
  vSync: boolean;
  frameRateCap: string;
  screenScale: number; // 1 to 10
  brightness: number;  // 50 to 150 %

  // Advanced
  particleEffects: 'LOW' | 'NORMAL' | 'HIGH';
  blurQuality: 'LOW' | 'MEDIUM' | 'HIGH';
  dithering: boolean;
}

export const defaultSettings: GameSettingsState = {
  language: 'ENGLISH',
  cameraShake: true,
  hudAppearance: 'SMALL',
  showAchievements: false,
  backerCredits: false,

  masterVolume: 10,
  soundVolume: 10,
  musicVolume: 10,
  heroVoice: true,

  resolution: '2560 x 1440 @ 60Hz',
  fullScreen: 'BORDERLESS',
  vSync: true,
  frameRateCap: 'OFF',
  screenScale: 9,
  brightness: 100,

  particleEffects: 'NORMAL',
  blurQuality: 'HIGH',
  dithering: false,
};

export interface SaveProfile {
  id: number;
  isEmpty: boolean;
  name: string;
  location: string;
  playtime: string;
  beads: number;
  rosaries: number;
  masks: number;
  maxMasks: number;
  spoolPercent: number;
}
