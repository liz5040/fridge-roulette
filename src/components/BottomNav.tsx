import React from 'react';
import { X } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export type NavTab = 'spin' | 'pantry' | 'hall_of_fame';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  hasActiveRecipe: boolean;
  onOpenActiveRecipe: () => void;
  onDismissActiveRecipe?: () => void;
  fridgeCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  hasActiveRecipe,
  onOpenActiveRecipe,
  onDismissActiveRecipe,
  fridgeCount,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 max-w-md mx-auto pointer-events-none select-none" role="navigation" aria-label="Main navigation">
      {/* Floating Order Ticket Pill if a recipe has been spun */}
      {hasActiveRecipe && (
        <div className="px-4 pb-2.5 flex items-center justify-center gap-2 pointer-events-auto animate-in slide-in-from-bottom duration-200">
          <button
            onClick={() => {
              sounds.playDinerBell();
              onOpenActiveRecipe();
            }}
            aria-label="View Chef's Guest Check Recipe Ticket"
            className="min-h-[48px] py-2.5 px-4 rounded-full bg-[#E53935] text-white border-3 border-[#2B170C] shadow-[3px_4px_0px_#2B170C] active:translate-y-0.5 active:shadow-none flex items-center gap-2 text-xs sm:text-sm font-retro tracking-wider cursor-pointer hover:bg-[#FF5252] transition-colors"
          >
            <span className="text-base" aria-hidden="true">🧾</span>
            <span>VIEW CHEF'S GUEST CHECK</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBC02D] animate-ping" aria-hidden="true" />
          </button>

          {onDismissActiveRecipe && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playBoop(400);
                onDismissActiveRecipe();
              }}
              title="Dismiss ticket alert"
              aria-label="Dismiss order ticket alert"
              className="min-w-[40px] min-h-[40px] rounded-full bg-[#FFFDF8] border-2 border-[#2B170C] text-[#2B170C] flex items-center justify-center shadow-[1px_2px_0px_#2B170C] active:translate-y-0.5 cursor-pointer hover:bg-[#FFE3E3]"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      )}

      {/* Main Bottom Diner Navigation Bar */}
      <nav
        aria-label="Diner Tabs"
        className="bg-[#FFFDF8] border-t-4 border-[#2B170C] px-3 py-2 flex items-center justify-around pointer-events-auto shadow-[0_-4px_12px_rgba(43,23,12,0.12)] min-h-[64px]"
      >
        {/* Tab 1: Spin The Roulette */}
        <button
          onClick={() => {
            sounds.playBoop(520);
            onChangeTab('spin');
          }}
          aria-label="Roulette Spinner Tab"
          aria-selected={activeTab === 'spin'}
          className={`flex-1 min-h-[48px] py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'spin'
              ? 'bg-[#E53935] text-white border-2 border-[#2B170C] shadow-[2px_2px_0px_#2B170C] scale-105'
              : 'text-[#2B170C] hover:bg-[#FFF9C4]'
          }`}
        >
          <span className="text-2xl leading-none" aria-hidden="true">🎰</span>
          <span className={`text-xs font-retro tracking-wider uppercase mt-1 ${activeTab === 'spin' ? 'text-[#FFF9C4]' : 'text-[#2B170C]'}`}>
            SPIN
          </span>
        </button>

        {/* Tab 2: Fridge Pantry */}
        <button
          onClick={() => {
            sounds.playBoop(580);
            onChangeTab('pantry');
          }}
          aria-label={`Fridge Pantry Tab, ${fridgeCount} items in fridge`}
          aria-selected={activeTab === 'pantry'}
          className={`flex-1 min-h-[48px] py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center relative transition-all cursor-pointer ${
            activeTab === 'pantry'
              ? 'bg-[#E53935] text-white border-2 border-[#2B170C] shadow-[2px_2px_0px_#2B170C] scale-105'
              : 'text-[#2B170C] hover:bg-[#FFF9C4]'
          }`}
        >
          <span className="text-2xl leading-none" aria-hidden="true">🧊</span>
          <span className={`text-xs font-retro tracking-wider uppercase mt-1 ${activeTab === 'pantry' ? 'text-[#FFF9C4]' : 'text-[#2B170C]'}`}>
            FRIDGE
          </span>
          <span className={`absolute top-0.5 right-3 text-xs font-black rounded-full px-1.5 py-0.2 border border-[#2B170C] ${activeTab === 'pantry' ? 'bg-[#FBC02D] text-[#2B170C]' : 'bg-[#E53935] text-white'}`}>
            {fridgeCount}
          </span>
        </button>

        {/* Tab 3: Diner Hall of Fame */}
        <button
          onClick={() => {
            sounds.playBoop(640);
            onChangeTab('hall_of_fame');
          }}
          aria-label="Trophies and Hall of Fame Tab"
          aria-selected={activeTab === 'hall_of_fame'}
          className={`flex-1 min-h-[48px] py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'hall_of_fame'
              ? 'bg-[#E53935] text-white border-2 border-[#2B170C] shadow-[2px_2px_0px_#2B170C] scale-105'
              : 'text-[#2B170C] hover:bg-[#FFF9C4]'
          }`}
        >
          <span className="text-2xl leading-none" aria-hidden="true">🏆</span>
          <span className={`text-xs font-retro tracking-wider uppercase mt-1 ${activeTab === 'hall_of_fame' ? 'text-[#FFF9C4]' : 'text-[#2B170C]'}`}>
            TROPHIES
          </span>
        </button>
      </nav>
    </div>
  );
};
