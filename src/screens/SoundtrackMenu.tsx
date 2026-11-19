import React, { useState, useEffect } from 'react';
import { HeaderDivider, SelectionArrow } from '../components/Flourish';
import { MenuItem } from '../components/MenuItem';
import { audioManager, SOUNDTRACK_LIST, SoundtrackTrack, PlaybackState } from '../utils/audio';
import { ScreenType } from '../types';

interface SoundtrackMenuProps {
  onNavigate: (screen: ScreenType) => void;
  returnScreen?: ScreenType;
}

export const SoundtrackMenu: React.FC<SoundtrackMenuProps> = ({
  onNavigate,
  returnScreen = 'title',
}) => {
  const [playback, setPlayback] = useState<PlaybackState>(audioManager.getPlaybackState());
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  // Subscribe to playback changes
  useEffect(() => {
    const unsubscribe = audioManager.subscribe((state) => {
      setPlayback(state);
    });
    return unsubscribe;
  }, []);

  const handleSelectTrack = (track: SoundtrackTrack, index: number) => {
    audioManager.playSFX('ui_button_confirm');
    setHoveredIndex(index);
    audioManager.selectTrack(track.id);
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.playSFX('ui_option_click');
    audioManager.togglePlayPause();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.playSFX('ui_change_selection');
    audioManager.nextTrack();
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.playSFX('ui_change_selection');
    audioManager.prevTrack();
  };

  const handleToggleLoop = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.playSFX('ui_option_click');
    audioManager.toggleLoopMode();
  };

  const handleBack = () => {
    audioManager.playSFX('ui_option_click');
    onNavigate(returnScreen);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setHoveredIndex((prev) => (prev > 0 ? prev - 1 : SOUNDTRACK_LIST.length));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        audioManager.playSFX('ui_change_selection');
        setHoveredIndex((prev) => (prev < SOUNDTRACK_LIST.length ? prev + 1 : 0));
      } else if (e.key === ' ' && hoveredIndex < SOUNDTRACK_LIST.length) {
        e.preventDefault();
        audioManager.playSFX('ui_option_click');
        audioManager.togglePlayPause();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (hoveredIndex === SOUNDTRACK_LIST.length) {
          handleBack();
        } else {
          const track = SOUNDTRACK_LIST[hoveredIndex];
          if (track) {
            handleSelectTrack(track, hoveredIndex);
          }
        }
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredIndex, returnScreen]);

  const formatSeconds = (secs: number) => {
    if (!Number.isFinite(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = playback.duration > 0
    ? Math.min(100, Math.max(0, (playback.currentTime / playback.duration) * 100))
    : 0;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-6 sm:py-8 md:py-10 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center shrink-0">
        <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.24em] text-white glow-white font-normal text-center">
          SOUNDTRACK
        </h1>
        <HeaderDivider />
        <span className="font-cinzel text-[10px] sm:text-xs text-neutral-400 tracking-[0.2em] uppercase mt-1">
          ORIGINAL SCORE BY CHRISTOPHER LARKIN
        </span>
      </div>

      {/* Main Container: Player Widget & Tracklist */}
      <div className="w-full max-w-3xl flex flex-col gap-4 my-auto overflow-hidden">
        {/* Now Playing Widget */}
        <div className="bg-black/80 border border-neutral-700/80 rounded-sm p-4 sm:p-5 flex flex-col gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-sm shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {/* Track Info */}
            <div className="flex items-center gap-3">
              {/* Playing Equalizer Animation */}
              <div className="w-6 h-6 flex items-end justify-center gap-0.5 shrink-0">
                <span
                  className={`w-1 bg-white transition-all duration-300 ${
                    playback.isPlaying ? 'h-5 animate-pulse' : 'h-1.5 opacity-40'
                  }`}
                />
                <span
                  className={`w-1 bg-white transition-all duration-200 ${
                    playback.isPlaying ? 'h-3 animate-ping' : 'h-2.5 opacity-40'
                  }`}
                />
                <span
                  className={`w-1 bg-white transition-all duration-300 ${
                    playback.isPlaying ? 'h-6 animate-pulse' : 'h-1 opacity-40'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-cinzel text-xs text-neutral-400 tracking-wider">
                    {playback.currentTrack.number}.
                  </span>
                  <span className="font-cinzel text-sm sm:text-base font-semibold tracking-wider text-white glow-white uppercase">
                    {playback.currentTrack.title}
                  </span>
                </div>
                <span className="font-cinzel text-[10px] text-neutral-400 tracking-widest uppercase">
                  {playback.isPlaying ? 'NOW PLAYING' : 'PAUSED'} • {playback.currentTrack.composer}
                </span>
              </div>
            </div>

            {/* Quick Player Controls */}
            <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
              {/* Prev */}
              <button
                type="button"
                onClick={handlePrev}
                title="Previous Track"
                className="font-cinzel text-xs px-2.5 py-1 text-neutral-300 hover:text-white border border-neutral-700 hover:border-white transition-colors"
              >
                ‹‹ PREV
              </button>

              {/* Play/Pause */}
              <button
                type="button"
                onClick={handleTogglePlay}
                title={playback.isPlaying ? 'Pause' : 'Play'}
                className="font-cinzel text-xs px-3.5 py-1 bg-white text-black font-semibold hover:bg-neutral-200 transition-colors tracking-wider"
              >
                {playback.isPlaying ? 'PAUSE' : 'PLAY'}
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={handleNext}
                title="Next Track"
                className="font-cinzel text-xs px-2.5 py-1 text-neutral-300 hover:text-white border border-neutral-700 hover:border-white transition-colors"
              >
                NEXT ››
              </button>

              {/* Loop mode toggle */}
              <button
                type="button"
                onClick={handleToggleLoop}
                title="Toggle Loop Mode"
                className="font-cinzel text-[10px] sm:text-xs px-2 py-1 text-neutral-400 hover:text-white transition-colors border border-neutral-800"
              >
                {playback.loopMode === 'single' ? 'REPEAT 1' : 'LOOP ALL'}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 pt-1">
            <span className="font-cinzel text-[10px] sm:text-xs text-neutral-400 tracking-wider w-10 text-right">
              {formatSeconds(playback.currentTime)}
            </span>
            <div
              className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden cursor-pointer relative group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                if (playback.duration > 0) {
                  audioManager.seek(pos * playback.duration);
                }
              }}
            >
              <div
                className="h-full bg-white shadow-[0_0_8px_white] transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-cinzel text-[10px] sm:text-xs text-neutral-400 tracking-wider w-10">
              {playback.duration > 0 ? formatSeconds(playback.duration) : playback.currentTrack.duration || '--:--'}
            </span>
          </div>
        </div>

        {/* Tracklist Container: Strictly vertical scroll, zero horizontal scrollbar, custom scrollbar styling */}
        <div className="flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden max-h-[38vh] sm:max-h-[44vh] pr-3 custom-scrollbar">
          {SOUNDTRACK_LIST.map((track, idx) => {
            const isCurrent = playback.currentTrack.id === track.id;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={track.id}
                onClick={() => handleSelectTrack(track, idx)}
                onMouseEnter={() => {
                  if (hoveredIndex !== idx) {
                    audioManager.playSFX('ui_change_selection');
                    setHoveredIndex(idx);
                  }
                }}
                className={`relative flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 transition-all duration-150 cursor-pointer border rounded-sm ${
                  isCurrent
                    ? 'bg-neutral-900/95 border-white text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                    : isHovered
                    ? 'bg-neutral-900/60 border-neutral-500 text-white'
                    : 'bg-black/50 border-neutral-800/80 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                {/* Left: Pointer arrow + Number & Title */}
                <div className="flex items-center gap-2 sm:gap-3 truncate">
                  <div className={`transition-opacity duration-150 shrink-0 w-3 sm:w-4 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <SelectionArrow direction="left" />
                  </div>
                  <span
                    className={`font-cinzel text-xs sm:text-sm font-semibold tracking-wider ${
                      isCurrent ? 'text-white' : 'text-neutral-400'
                    }`}
                  >
                    {track.number}.
                  </span>
                  <span
                    className={`font-cinzel text-xs sm:text-sm md:text-base tracking-[0.14em] uppercase truncate ${
                      isCurrent ? 'text-white font-medium glow-white' : 'hover:text-white'
                    }`}
                  >
                    {track.title}
                  </span>
                </div>

                {/* Right: Status badge + Duration + Pointer arrow */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {isCurrent && (
                    <span className="font-cinzel text-[9px] sm:text-[10px] tracking-widest uppercase px-1.5 sm:px-2 py-0.5 border border-white/60 text-white">
                      {playback.isPlaying ? 'PLAYING' : 'PAUSED'}
                    </span>
                  )}
                  <span className="font-cinzel text-xs text-neutral-400 tracking-wider">
                    {track.duration}
                  </span>
                  <div className={`transition-opacity duration-150 shrink-0 w-3 sm:w-4 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <SelectionArrow direction="right" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Back button */}
      <div className="pt-2 sm:pt-4 pb-2 shrink-0">
        <MenuItem
          label="BACK"
          selected={hoveredIndex === SOUNDTRACK_LIST.length}
          onHover={() => setHoveredIndex(SOUNDTRACK_LIST.length)}
          onClick={handleBack}
        />
      </div>
    </div>
  );
};
