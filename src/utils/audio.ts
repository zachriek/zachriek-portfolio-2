// Audio Manager for Hollow Knight: Silksong
// Handles seamless BGM, soundtrack selection, and Hollow Knight UI sound effects

export interface AudioSettings {
  masterVolume: number; // 0 to 10
  soundVolume: number;  // 0 to 10
  musicVolume: number;  // 0 to 10
  heroVoice: boolean;
}

export interface SoundtrackTrack {
  id: string;
  number: string;
  title: string;
  filename: string;
  composer: string;
  duration?: string;
}

export const SOUNDTRACK_LIST: SoundtrackTrack[] = [
  { id: 'bgm_menu', number: '00', title: 'Silksong Menu Theme', filename: 'bgm_menu.mp3', composer: 'Christopher Larkin', duration: '2:20' },
  { id: '04_bone_bottom', number: '04', title: 'Bone Bottom', filename: '04. Bone Bottom.mp3', composer: 'Christopher Larkin', duration: '4:20' },
  { id: '09_lace', number: '09', title: 'Lace', filename: '09. Lace.mp3', composer: 'Christopher Larkin', duration: '4:03' },
  { id: '15_widow', number: '15', title: 'Widow', filename: '15. Widow.mp3', composer: 'Christopher Larkin', duration: '3:18' },
  { id: '21_bilewater', number: '21', title: 'Bilewater', filename: '21. Bilewater.mp3', composer: 'Christopher Larkin', duration: '3:35' },
  { id: '28_last_judge', number: '28', title: 'Last Judge', filename: '28. Last Judge.mp3', composer: 'Christopher Larkin', duration: '3:24' },
  { id: '30_choral_chambers', number: '30', title: 'Choral Chambers', filename: '30. Choral Chambers.mp3', composer: 'Christopher Larkin', duration: '3:58' },
  { id: '32_cogwork_dancers', number: '32', title: 'Cogwork Dancers', filename: '32. Cogwork Dancers.mp3', composer: 'Christopher Larkin', duration: '4:01' },
  { id: '33_cogwork_core', number: '33', title: 'Cogwork Core', filename: '33. Cogwork Core.mp3', composer: 'Christopher Larkin', duration: '2:25' },
  { id: '34_whispering_vaults', number: '34', title: 'Whispering Vaults', filename: '34. Whispering Vaults.mp3', composer: 'Christopher Larkin', duration: '3:55' },
  { id: '35_trobbio', number: '35', title: 'Trobbio', filename: '35. Trobbio.mp3', composer: 'Christopher Larkin', duration: '3:09' },
  { id: '42_skarrsinger_karmelita', number: '42', title: 'Skarrsinger Karmelita', filename: '42. Skarrsinger Karmelita.mp3', composer: 'Christopher Larkin', duration: '2:54' },
  { id: '44_crust_king_khann', number: '44', title: 'Crust King Khann', filename: '44. Crust King Khann.mp3', composer: 'Christopher Larkin', duration: '3:06' },
  { id: '50_last_dive', number: '50', title: 'Last Dive', filename: '50. Last Dive.mp3', composer: 'Christopher Larkin', duration: '3:41' },
  { id: '51_lost_lace', number: '51', title: 'Lost Lace', filename: '51. Lost Lace.mp3', composer: 'Christopher Larkin', duration: '4:35' },
  { id: '52_sister_of_the_void', number: '52', title: 'Sister of the Void', filename: '52. Sister of the Void.mp3', composer: 'Christopher Larkin', duration: '2:55' },
];

export type UISoundName = 'ui_button_confirm' | 'ui_change_selection' | 'ui_option_click';

export interface PlaybackState {
  currentTrack: SoundtrackTrack;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loopMode: 'single' | 'all';
}

class AudioManager {
  private bgmAudio: HTMLAudioElement | null = null;
  private sfxCache: Map<string, HTMLAudioElement> = new Map();
  private settings: AudioSettings = {
    masterVolume: 10,
    soundVolume: 10,
    musicVolume: 10,
    heroVoice: true,
  };
  private isAudioUnlocked = false;
  private isUserPaused = false;
  private currentTrackIndex = 0;
  private isCurrentlyPlaying = false;
  private loopMode: 'single' | 'all' = 'all';
  private listeners: Set<(state: PlaybackState) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // Preload strictly allowed UI sound effects
      const uiSounds: UISoundName[] = [
        'ui_button_confirm',
        'ui_change_selection',
        'ui_option_click',
      ];

      uiSounds.forEach((snd) => {
        const audio = new Audio(`/sfx/${snd}.wav`);
        audio.preload = 'auto';
        this.sfxCache.set(snd, audio);
      });

      // Initialize initial BGM instance
      this.initBGM(SOUNDTRACK_LIST[0]);
    }
  }

  private initBGM(track: SoundtrackTrack) {
    if (typeof window === 'undefined') return;

    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.removeAttribute('src');
      this.bgmAudio.load();
    }

    const audio = new Audio(`/sfx/${track.filename}`);
    audio.preload = 'auto';
    audio.loop = this.loopMode === 'single';

    audio.addEventListener('play', () => {
      this.isCurrentlyPlaying = true;
      this.notifyListeners();
    });

    audio.addEventListener('pause', () => {
      this.isCurrentlyPlaying = false;
      this.notifyListeners();
    });

    audio.addEventListener('timeupdate', () => {
      this.notifyListeners();
    });

    audio.addEventListener('ended', () => {
      if (this.loopMode === 'all') {
        this.nextTrack();
      }
    });

    this.bgmAudio = audio;
    this.applyVolumes();
  }

  public unlockAudio() {
    this.isAudioUnlocked = true;
    this.isUserPaused = false;
    if (this.bgmAudio) {
      this.applyVolumes();
      this.bgmAudio.play().then(() => {
        this.isCurrentlyPlaying = true;
        this.notifyListeners();
      }).catch(() => {
        // Handled silently
      });
    }
  }

  public updateSettings(newSettings: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.applyVolumes();
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  private applyVolumes() {
    const masterRatio = this.settings.masterVolume / 10;
    const musicRatio = (this.settings.musicVolume / 10) * masterRatio;

    if (this.bgmAudio) {
      this.bgmAudio.volume = Math.max(0, Math.min(1, musicRatio * 0.7));
    }
  }

  public ensureMenuBGM() {
    if (typeof window === 'undefined') return;
    if (!this.isAudioUnlocked) return;
    // If the user intentionally paused the soundtrack, keep it paused across menu transitions!
    if (this.isUserPaused) return;

    if (!this.bgmAudio) {
      this.initBGM(SOUNDTRACK_LIST[this.currentTrackIndex]);
    }

    this.applyVolumes();

    if (this.bgmAudio && this.bgmAudio.paused) {
      this.bgmAudio.play().then(() => {
        this.isCurrentlyPlaying = true;
        this.notifyListeners();
      }).catch(() => {});
    }
  }

  public playBGM() {
    this.isUserPaused = false;
    this.ensureMenuBGM();
  }

  public pauseBGM() {
    this.isUserPaused = true;
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.isCurrentlyPlaying = false;
      this.notifyListeners();
    }
  }

  public resumeBGM() {
    this.isUserPaused = false;
    this.ensureMenuBGM();
  }

  public playInGameBGM() {
    this.ensureMenuBGM();
  }

  public stopAllBGM() {
    this.isUserPaused = true;
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.isCurrentlyPlaying = false;
      this.notifyListeners();
    }
  }

  // Soundtrack control methods
  public selectTrack(trackIdOrNumber: string) {
    const idx = SOUNDTRACK_LIST.findIndex(
      (t) => t.id === trackIdOrNumber || t.number === trackIdOrNumber || t.filename.includes(trackIdOrNumber)
    );
    if (idx === -1) return;

    this.currentTrackIndex = idx;
    this.isUserPaused = false; // User explicitly selected a track to play
    const track = SOUNDTRACK_LIST[idx];
    this.initBGM(track);

    if (this.isAudioUnlocked && this.bgmAudio) {
      this.bgmAudio.play().then(() => {
        this.isCurrentlyPlaying = true;
        this.notifyListeners();
      }).catch(() => {});
    }
  }

  public nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % SOUNDTRACK_LIST.length;
    this.selectTrack(SOUNDTRACK_LIST[nextIdx].id);
  }

  public prevTrack() {
    const prevIdx = (this.currentTrackIndex - 1 + SOUNDTRACK_LIST.length) % SOUNDTRACK_LIST.length;
    this.selectTrack(SOUNDTRACK_LIST[prevIdx].id);
  }

  public togglePlayPause() {
    if (!this.bgmAudio) {
      this.initBGM(SOUNDTRACK_LIST[this.currentTrackIndex]);
    }
    if (!this.bgmAudio) return;

    if (this.bgmAudio.paused) {
      this.isAudioUnlocked = true;
      this.isUserPaused = false;
      this.applyVolumes();
      this.bgmAudio.play().then(() => {
        this.isCurrentlyPlaying = true;
        this.notifyListeners();
      }).catch(() => {});
    } else {
      this.isUserPaused = true;
      this.bgmAudio.pause();
      this.isCurrentlyPlaying = false;
      this.notifyListeners();
    }
  }

  public toggleLoopMode() {
    this.loopMode = this.loopMode === 'single' ? 'all' : 'single';
    if (this.bgmAudio) {
      this.bgmAudio.loop = this.loopMode === 'single';
    }
    this.notifyListeners();
  }

  public seek(seconds: number) {
    if (this.bgmAudio && Number.isFinite(seconds)) {
      this.bgmAudio.currentTime = Math.max(0, Math.min(seconds, this.bgmAudio.duration || 0));
    }
  }

  public getPlaybackState(): PlaybackState {
    const track = SOUNDTRACK_LIST[this.currentTrackIndex] || SOUNDTRACK_LIST[0];
    return {
      currentTrack: track,
      isPlaying: this.isCurrentlyPlaying,
      currentTime: this.bgmAudio ? this.bgmAudio.currentTime || 0 : 0,
      duration: this.bgmAudio ? this.bgmAudio.duration || 0 : 0,
      loopMode: this.loopMode,
    };
  }

  public subscribe(listener: (state: PlaybackState) => void) {
    this.listeners.add(listener);
    listener(this.getPlaybackState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const state = this.getPlaybackState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch {
        // Handled silently
      }
    });
  }

  /**
   * Only Hollow Knight UI sound effects (ui_button_confirm, ui_change_selection, ui_option_click)
   * Legacy SFX names are seamlessly mapped to their respective ui_* equivalents.
   */
  public playSFX(name: string) {
    if (typeof window === 'undefined') return;
    const masterRatio = this.settings.masterVolume / 10;
    const sfxRatio = (this.settings.soundVolume / 10) * masterRatio;

    if (sfxRatio <= 0) return;

    // Strict mapping to only ui_* sounds
    let targetSound: UISoundName = 'ui_option_click';

    if (
      name === 'ui_button_confirm' ||
      name === 'sfx_select' ||
      name === 'sfx_gamestart' ||
      name === 'sfx_submenu' ||
      name === 'confirm' ||
      name === 'select'
    ) {
      targetSound = 'ui_button_confirm';
    } else if (
      name === 'ui_change_selection' ||
      name === 'sfx_hover' ||
      name === 'hover' ||
      name === 'navigate'
    ) {
      targetSound = 'ui_change_selection';
    } else {
      targetSound = 'ui_option_click';
    }

    let audio = this.sfxCache.get(targetSound);
    if (!audio) {
      audio = new Audio(`/sfx/${targetSound}.wav`);
      this.sfxCache.set(targetSound, audio);
    }

    try {
      const soundInstance = audio.cloneNode() as HTMLAudioElement;
      soundInstance.volume = Math.max(0, Math.min(1, sfxRatio * 0.85));
      soundInstance.play().catch(() => {});
    } catch {
      // Audio playback error handled gracefully
    }
  }
}

export const audioManager = new AudioManager();
