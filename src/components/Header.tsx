import React from 'react';
import { Volume2, VolumeX, Smartphone, Monitor, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isDesktopFramed: boolean;
  onToggleDesktopFrame: () => void;
  inStockCount: number;
  expiringCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  isDesktopFramed,
  onToggleDesktopFrame,
  inStockCount,
  expiringCount,
}) => {
  return (
    <header className="relative w-full bg-[#E53935] border-b-4 border-[#2B170C] select-none" role="banner">
      {/* Top Diner Checkerboard Strip */}
      <div className="h-3 w-full bg-checker-diner opacity-90 border-b border-[#2B170C]/40" aria-hidden="true" />

      <div className="max-w-md mx-auto px-4 py-3.5 flex items-center justify-between gap-2">
        {/* Left: Vintage Neon Badge & Title */}
        <div className="flex items-center gap-3">
          <div
            className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FBC02D] border-3 border-[#2B170C] shadow-[3px_3px_0px_#2B170C] rotate-[-2deg] shrink-0"
            aria-hidden="true"
          >
            <span className="text-2xl leading-none" role="img" aria-label="Slot Machine">🎰</span>
            {/* Blinking neon bulb dots */}
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#FFE082] border-2 border-[#2B170C] animate-bulb" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-wider font-black uppercase bg-[#2B170C] text-[#FBC02D] px-2 py-0.5 rounded">
                24/7 DINER
              </span>
              {expiringCount > 0 && (
                <span
                  role="status"
                  aria-live="polite"
                  className="text-xs font-bold bg-[#FFF9C4] text-[#B71C1C] border border-[#2B170C] px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse"
                >
                  ⚠️ {expiringCount} to rescue!
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl leading-tight font-retro text-[#FFFDF8] tracking-wide retro-title-shadow mt-0.5">
              FRIDGE ROULETTE
            </h1>
          </div>
        </div>

        {/* Right: Tactile Controls with accessible 44px min tap targets */}
        <div className="flex items-center gap-2">
          {/* Mute Toggle */}
          <button
            onClick={() => {
              sounds.playBoop(600);
              onToggleMute();
            }}
            title={isMuted ? 'Unmute Diner Sounds' : 'Mute Diner Sounds'}
            aria-label={isMuted ? 'Diner sounds are muted. Tap to unmute.' : 'Diner sounds are active. Tap to mute.'}
            aria-pressed={isMuted}
            className="min-w-[44px] min-h-[44px] rounded-2xl bg-[#FFFDF8] text-[#2B170C] border-3 border-[#2B170C] shadow-[2px_3px_0px_#2B170C] active:translate-y-0.5 active:shadow-[0px_0px_0px_#2B170C] flex items-center justify-center transition-transform cursor-pointer focus-visible:ring-3 focus-visible:ring-white"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-700" />
            ) : (
              <Volume2 className="w-5 h-5 text-[#E53935]" />
            )}
          </button>

          {/* Desktop Frame Toggle */}
          <button
            onClick={() => {
              sounds.playBoop(700);
              onToggleDesktopFrame();
            }}
            title={isDesktopFramed ? 'Switch to Full Screen View' : 'Switch to Mobile Handheld Frame'}
            aria-label={isDesktopFramed ? 'Currently in Phone Frame. Tap for Full Screen.' : 'Currently in Full Screen. Tap for Phone Frame.'}
            aria-pressed={isDesktopFramed}
            className="hidden md:flex min-w-[44px] min-h-[44px] rounded-2xl bg-[#FBC02D] text-[#2B170C] border-3 border-[#2B170C] shadow-[2px_3px_0px_#2B170C] active:translate-y-0.5 active:shadow-[0px_0px_0px_#2B170C] items-center justify-center transition-transform cursor-pointer focus-visible:ring-3 focus-visible:ring-white"
          >
            {isDesktopFramed ? (
              <Monitor className="w-5 h-5" />
            ) : (
              <Smartphone className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Tomato Accent Line with Diner Tagline Bar */}
      <div className="bg-[#FFFDF8] border-t-2 border-[#2B170C] px-4 py-1.5 flex items-center justify-between text-xs sm:text-sm font-bold text-[#2B170C]">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#E65100]" aria-hidden="true" />
          <span>Spin leftovers into diner classics</span>
        </div>
        <div className="font-extrabold text-[#B71C1C] bg-[#FFE3E3] px-2.5 py-0.5 rounded-full border border-[#2B170C]/40 text-xs">
          {inStockCount} in fridge
        </div>
      </div>
    </header>
  );
};
