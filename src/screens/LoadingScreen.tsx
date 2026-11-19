import React, { useEffect } from 'react';

interface LoadingScreenProps {
  onLoaded: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  useEffect(() => {
    // Keep ambient background music playing smoothly without harsh cut
    const timer = setTimeout(() => {
      onLoaded();
    }, 2400);

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div
      onClick={onLoaded}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center cursor-pointer select-none"
    >
      {/* Animated Loading Bug in bottom-right corner */}
      <div className="absolute right-12 bottom-12 flex items-center gap-3">
        <img
          src="/assets/loading_bug.png"
          alt="Loading..."
          className="w-10 h-10 object-contain filter invert drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-flutter"
          draggable={false}
        />
      </div>
    </div>
  );
};
