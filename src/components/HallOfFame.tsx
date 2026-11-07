import React from 'react';
import { Award, Clock, ArrowRight } from 'lucide-react';
import type { DinerRecipe } from '../data/recipes';
import { sounds } from '../utils/soundEffects';

export interface DinerStats {
  spinsCount: number;
  cookedCount: number;
  wasteSavedLbs: number;
  hasChaosSpun: boolean;
}

interface HallOfFameProps {
  stats: DinerStats;
  favoriteRecipes: DinerRecipe[];
  onOpenRecipe: (recipe: DinerRecipe) => void;
  onRemoveFavorite: (recipeId: string) => void;
}

export const HallOfFame: React.FC<HallOfFameProps> = ({
  stats,
  favoriteRecipes,
  onOpenRecipe,
  onRemoveFavorite,
}) => {
  const estimatedDollarsSaved = (stats.wasteSavedLbs * 4.8).toFixed(1);

  // Dynamic Badges based on player progress
  const badges = [
    {
      id: 'rookie',
      title: 'Short-Order Rookie',
      desc: 'Spun the roulette at least once',
      emoji: '🎰',
      unlocked: stats.spinsCount >= 1,
    },
    {
      id: 'fry_cook',
      title: 'Griddle Master',
      desc: 'Cooked 2+ diner recipes',
      emoji: '🍳',
      unlocked: stats.cookedCount >= 2,
    },
    {
      id: 'zero_waste',
      title: 'Zero-Waste Champion',
      desc: 'Rescued 1.5+ lbs of fridge food',
      emoji: '♻️',
      unlocked: stats.wasteSavedLbs >= 1.5,
    },
    {
      id: 'chaos_king',
      title: 'Mystery Cook',
      desc: 'Spun with Chaos Twist active',
      emoji: '🌶️',
      unlocked: stats.hasChaosSpun,
    },
    {
      id: 'regular',
      title: 'Diner Regular',
      desc: 'Spun the roulette 5+ times',
      emoji: '☕',
      unlocked: stats.spinsCount >= 5,
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3.5 flex flex-col gap-4 select-none pb-36" role="region" aria-label="Diner Hall of Fame">
      {/* Top Diner Marquee Card */}
      <div className="bg-[#FFFDF8] border-3 border-[#2B170C] rounded-2xl p-3.5 shadow-[4px_4px_0px_#2B170C]">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FBC02D] border-2 border-[#2B170C] flex items-center justify-center text-2xl shadow-[1px_2px_0px_#2B170C]">
            🏆
          </div>
          <div>
            <h2 className="font-retro text-xl sm:text-2xl text-[#E53935] tracking-wide leading-tight">
              DINER HALL OF FAME
            </h2>
            <p className="text-xs sm:text-sm text-[#2B170C] font-semibold">
              Kitchen triumphs, badges & saved groceries!
            </p>
          </div>
        </div>

        {/* 4 Big Diner Score Boxes with large typography */}
        <div className="grid grid-cols-2 gap-2.5 mt-3">
          <div className="p-3 rounded-xl bg-[#FFE3E3] border-2 border-[#2B170C] shadow-[2px_2px_0px_#2B170C]">
            <p className="text-xs font-black uppercase text-[#B71C1C] tracking-wider">
              Roulette Spins
            </p>
            <p className="text-3xl font-retro text-[#2B170C] mt-1">
              {stats.spinsCount}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#FFF9C4] border-2 border-[#2B170C] shadow-[2px_2px_0px_#2B170C]">
            <p className="text-xs font-black uppercase text-[#801B1B] tracking-wider">
              Orders Plated
            </p>
            <p className="text-3xl font-retro text-[#2B170C] mt-1">
              {stats.cookedCount}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#E8F5E9] border-2 border-[#2B170C] shadow-[2px_2px_0px_#2B170C]">
            <p className="text-xs font-black uppercase text-[#1B5E20] tracking-wider">
              Waste Rescued
            </p>
            <p className="text-3xl font-retro text-[#1B5E20] mt-1">
              {stats.wasteSavedLbs.toFixed(1)} <span className="text-sm font-bold text-[#2B170C]">lbs</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#E3F2FD] border-2 border-[#2B170C] shadow-[2px_2px_0px_#2B170C]">
            <p className="text-xs font-black uppercase text-[#0D47A1] tracking-wider">
              Money Saved Est.
            </p>
            <p className="text-3xl font-retro text-[#0D47A1] mt-1">
              ${estimatedDollarsSaved}
            </p>
          </div>
        </div>
      </div>

      {/* Diner Merit Badges */}
      <div className="bg-[#FFFDF8] border-3 border-[#2B170C] rounded-2xl p-3.5 shadow-[4px_4px_0px_#2B170C]">
        <h3 className="font-heading font-black text-sm uppercase text-[#2B170C] tracking-wider mb-2.5 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#E65100]" />
          <span>Diner Merit Badges</span>
        </h3>

        <div className="grid grid-cols-1 gap-2.5" role="list">
          {badges.map(b => (
            <div
              key={b.id}
              role="listitem"
              className={`p-3 rounded-2xl border-2 border-[#2B170C] flex items-center gap-3.5 transition-all ${
                b.unlocked
                  ? 'bg-[#FFFDF8] shadow-[2px_2px_0px_#2B170C]'
                  : 'bg-[#ECEFF1] opacity-70 border-dashed'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl border-2 border-[#2B170C] flex items-center justify-center text-2xl shrink-0 ${
                  b.unlocked ? 'bg-[#FBC02D] shadow-[1px_1px_0px_#2B170C]' : 'bg-gray-200'
                }`}
              >
                {b.unlocked ? b.emoji : '🔒'}
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-[#2B170C] truncate">
                    {b.title}
                  </p>
                  {b.unlocked && (
                    <span className="text-[10px] bg-[#1B5E20] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                      UNLOCKED
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#2B170C]/80 font-medium truncate mt-0.5">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Favorite Recipes Section */}
      <div className="bg-[#FFFDF8] border-3 border-[#2B170C] rounded-2xl p-3.5 shadow-[4px_4px_0px_#2B170C]">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-heading font-black text-sm uppercase text-[#2B170C] tracking-wider flex items-center gap-1.5">
            <span>⭐</span>
            <span>Saved Counter Specialties ({favoriteRecipes.length})</span>
          </h3>
        </div>

        {favoriteRecipes.length === 0 ? (
          <div className="text-center py-7 text-xs sm:text-sm text-[#2B170C] font-semibold italic bg-[#FBF5E6] rounded-xl border-2 border-dashed border-[#2B170C]/40 p-4">
            <span className="text-3xl block mb-1.5" aria-hidden="true">📖</span>
            No saved favorites yet! Spin the roulette and tap "SAVE" on your favorite diner guest checks.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {favoriteRecipes.map(recipe => (
              <div
                key={recipe.id}
                className="p-3 rounded-2xl border-2 border-[#2B170C] bg-[#FFFDF8] shadow-[2px_2px_0px_#2B170C] flex items-center justify-between gap-3"
              >
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs bg-[#2B170C] text-[#FFF9C4] px-2 py-0.5 rounded font-mono font-black">
                      TABLE #{recipe.tableNumber}
                    </span>
                    <span className="text-xs font-black text-[#B71C1C] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {recipe.cookTimeMin}m
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#2B170C] truncate mt-1">
                    {recipe.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    {recipe.ingredients.slice(0, 4).map((ing, i) => (
                      <span key={i} className="text-base" title={ing.name}>{ing.emoji}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      sounds.playBoop(600);
                      onOpenRecipe(recipe);
                    }}
                    aria-label={`Cook ${recipe.title}`}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FBC02D] text-[#2B170C] border-2 border-[#2B170C] shadow-[1px_2px_0px_#2B170C] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 text-xs sm:text-sm font-black cursor-pointer hover:bg-[#FDD835]"
                  >
                    <span>Cook</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => {
                      sounds.playBoop(400);
                      onRemoveFavorite(recipe.id);
                    }}
                    aria-label={`Remove ${recipe.title} from favorites`}
                    className="min-w-[40px] min-h-[40px] rounded-lg text-sm font-bold text-gray-500 hover:text-[#B71C1C] flex items-center justify-center cursor-pointer hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
