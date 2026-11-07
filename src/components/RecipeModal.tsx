import React, { useState } from 'react';
import { X, Flame, Play, Bookmark, BookmarkCheck, CheckCircle2, Clock, Sparkles, Share2, Check } from 'lucide-react';
import type { DinerRecipe } from '../data/recipes';
import { sounds } from '../utils/soundEffects';
import { IngredientIcon } from '../utils/ingredientIcons';

interface RecipeModalProps {
  recipe: DinerRecipe | null;
  onClose: () => void;
  onStartCookMode: (recipe: DinerRecipe) => void;
  onToggleSaveFavorite: (recipe: DinerRecipe) => void;
  isFavorite: boolean;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  onStartCookMode,
  onToggleSaveFavorite,
  isFavorite,
}) => {
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({});
  const [copied, setCopied] = useState(false);

  if (!recipe) return null;

  const toggleStep = (stepNum: number) => {
    sounds.playBoop(540);
    setCompletedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const handleShareOrCopy = async () => {
    sounds.playBoop(650);
    const text = `🧾 FRIDGE ROULETTE — GUEST CHECK #${recipe.orderNumber}
Table #${recipe.tableNumber} | Dish: ${recipe.title}
"${recipe.tagline}"

🛒 INGREDIENTS:
${recipe.ingredients.map(i => `• ${i.emoji} ${i.name} (${i.amount})`).join('\n')}

🍳 STEPS:
${recipe.steps.map(s => `${s.step}. ${s.instruction}`).join('\n')}

💡 Short-Order Secret: ${recipe.shortOrderTip}
Spun with Fridge Roulette 🎰`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      navigator.clipboard?.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      {/* Container simulating a Diner Guest Check Slip */}
      <div className="relative w-full max-w-md my-auto bg-[#FFFDF8] border-4 border-[#2B170C] rounded-2xl shadow-[6px_8px_0px_#2B170C] overflow-hidden">
        
        {/* Top Checkerboard Accent */}
        <div className="h-3 w-full bg-checker-tomato border-b-2 border-[#2B170C]" />

        {/* Vintage Guest Check Header */}
        <div className="bg-[#EBF5EE] border-b-3 border-[#2B170C] p-3.5 text-[#2B170C] relative">
          <div className="flex items-center justify-between text-xs sm:text-sm font-ticket font-black uppercase tracking-wider pb-1.5 border-b border-[#2B170C]/30">
            <span>TABLE: #{recipe.tableNumber}</span>
            <span>GUEST CHECK #{recipe.orderNumber}</span>
            <span>SHORT ORDER</span>
          </div>

          <div className="flex items-start justify-between pt-2.5">
            <div>
              <div className="flex items-center flex-wrap gap-1.5">
                {/* Cuisine Badge */}
                {recipe.cuisine && (
                  <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    recipe.cuisine === 'indian'
                      ? 'bg-amber-100 text-amber-950 border-amber-400'
                      : recipe.cuisine === 'fusion'
                      ? 'bg-purple-100 text-purple-950 border-purple-400'
                      : 'bg-blue-100 text-blue-950 border-blue-400'
                  }`}>
                    {recipe.cuisine === 'indian' ? '🇮🇳 Indian' : recipe.cuisine === 'fusion' ? '🌮 Fusion' : '🍔 Western'}
                  </span>
                )}

                {/* Diet Badge */}
                {recipe.diet && (
                  <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    recipe.diet === 'veg'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : recipe.diet === 'egg'
                      ? 'bg-yellow-100 text-yellow-900 border-yellow-400'
                      : 'bg-rose-100 text-rose-900 border-rose-400'
                  }`}>
                    {recipe.diet === 'veg' ? '🟢 Veg' : recipe.diet === 'egg' ? '🟡 Egg' : '🔴 Meat/Fish'}
                  </span>
                )}

                <span className="text-[11px] bg-[#2B170C] text-[#FFF9C4] px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  {recipe.difficulty}
                </span>
                <span className="text-xs font-black text-[#B71C1C] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {recipe.cookTimeMin} MINS
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-retro text-[#E53935] tracking-wide mt-1 leading-tight retro-title-white">
                {recipe.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#2B170C] font-bold italic mt-0.5">
                "{recipe.tagline}"
              </p>
            </div>

            {/* Close Button (Accessible 44px) */}
            <button
              onClick={() => {
                sounds.playBoop(400);
                onClose();
              }}
              aria-label="Close recipe modal"
              className="min-w-[44px] min-h-[44px] rounded-xl bg-[#FFFDF8] border-2 border-[#2B170C] shadow-[2px_2px_0px_#2B170C] active:translate-y-0.5 active:shadow-none flex items-center justify-center shrink-0 ml-2 cursor-pointer hover:bg-[#FFE3E3]"
            >
              <X className="w-5 h-5 text-[#2B170C]" />
            </button>
          </div>

          {/* Red Rubber Stamp Decoration */}
          <div className="absolute right-4 bottom-2 pointer-events-none opacity-85 rotate-[-8deg] border-2 border-[#E53935] px-2 py-0.5 rounded text-xs font-black text-[#E53935] tracking-widest uppercase font-ticket">
            ★ ORDER UP! ★
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
          {/* Chaos Twist Banner if active */}
          {recipe.chaosTwist && (
            <div role="alert" className="p-3 bg-[#FFF9C4] border-2 border-[#2B170C] rounded-xl flex items-center gap-2 text-xs sm:text-sm font-black text-[#801B1B] shadow-[2px_2px_0px_#2B170C]">
              <Flame className="w-4 h-4 text-[#E53935] fill-[#E53935] shrink-0" />
              <span>{recipe.chaosTwist}</span>
            </div>
          )}

          {/* Ingredients Section */}
          <div>
            <div className="flex items-center justify-between pb-1 border-b-2 border-[#2B170C]/20 mb-2">
              <h3 className="font-heading font-black text-xs sm:text-sm text-[#2B170C] uppercase tracking-wider flex items-center gap-1.5">
                <span>🛒</span> Recipe Ingredients
              </h3>
              <span className="text-xs text-emerald-900 font-black bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400">
                🌱 {recipe.wasteSavedLbs || 0.7} lbs rescued
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border-2 border-[#2B170C] shadow-[1px_2px_0px_#2B170C] flex flex-col justify-between gap-1.5 ${
                    ing.isExpiring
                      ? 'bg-[#FFF9C4] border-[#E53935]'
                      : ing.inPantry
                      ? 'bg-[#FFFDF8]'
                      : 'bg-[#FBE9E7] border-dashed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <IngredientIcon
                        name={ing.name}
                        emoji={ing.emoji}
                        category={ing.category.toLowerCase() as any}
                        className="w-8 h-8 text-2xl shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs sm:text-sm font-black text-[#2B170C] truncate leading-tight">
                          {ing.name}
                        </p>
                        <p className="text-xs text-[#2B170C]/80 font-bold truncate">
                          {ing.amount}
                        </p>
                      </div>
                    </div>

                    {/* Required vs Optional Tag */}
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded shrink-0 uppercase border ${
                      ing.required
                        ? 'bg-[#E53935] text-white border-[#2B170C]'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}>
                      {ing.required ? 'Req' : 'Opt'}
                    </span>
                  </div>

                  {/* Stock Status Pill */}
                  <div className="flex items-center justify-between text-[11px] font-black pt-1 border-t border-[#2B170C]/10">
                    {ing.isExpiring ? (
                      <span className="text-[#C62828] flex items-center gap-1 animate-pulse">
                        ⚠️ Expiring soon in fridge!
                      </span>
                    ) : ing.inPantry ? (
                      <span className="text-[#2E7D32] flex items-center gap-1">
                        ✓ In your pantry
                      </span>
                    ) : (
                      <span className="text-[#D84315] flex items-center gap-1">
                        ✕ Missing {ing.substitution ? `(swap with: ${ing.substitution})` : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Substitution Guide */}
            <p className="mt-2 text-xs sm:text-sm text-[#2B170C] font-semibold bg-[#FFF5EE] p-2.5 rounded-xl border border-[#2B170C]/20">
              💡 <b>Substitutions & Swaps:</b> {recipe.substitutions}
            </p>
          </div>

          {/* Cooking Steps Section */}
          <div>
            <h3 className="font-heading font-black text-xs sm:text-sm text-[#2B170C] uppercase tracking-wider pb-1 border-b-2 border-[#2B170C]/20 mb-2 flex items-center gap-1.5">
              <span>🍳</span> Short-Order Cook Method
            </h3>

            <div className="flex flex-col gap-2.5">
              {recipe.steps.map(s => {
                const isDone = !!completedSteps[s.step];
                return (
                  <div
                    key={s.step}
                    onClick={() => toggleStep(s.step)}
                    className={`p-3 rounded-xl border-2 border-[#2B170C] transition-all cursor-pointer flex items-start gap-3 ${
                      isDone
                        ? 'bg-[#E8F5E9] border-[#2E7D32] opacity-85'
                        : 'bg-[#FFFDF8] hover:bg-[#FFF9C4]/40 shadow-[1px_2px_0px_#2B170C]'
                    }`}
                  >
                    <button
                      type="button"
                      aria-label={isDone ? `Step ${s.step} completed` : `Mark step ${s.step} complete`}
                      aria-pressed={isDone}
                      className="mt-0.5 shrink-0 min-w-[28px] min-h-[28px] flex items-center justify-center"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[#2B170C] bg-[#FFFDF8] flex items-center justify-center text-xs font-black">
                          {s.step}
                        </div>
                      )}
                    </button>

                    <div className="flex-1">
                      <p className={`text-xs sm:text-sm font-bold text-[#2B170C] leading-snug ${isDone ? 'line-through text-gray-600' : ''}`}>
                        {s.instruction}
                      </p>
                      {s.tip && !isDone && (
                        <p className="text-xs text-[#801B1B] font-bold mt-1 bg-[#FFE3E3] px-2 py-0.5 rounded inline-block">
                          Chef Note: {s.tip}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Short-Order Cook Secret Pro Tip */}
          <div className="p-3 bg-[#FFF9C4] border-2 border-[#2B170C] rounded-xl shadow-[2px_2px_0px_#2B170C]">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase text-[#801B1B] tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#FBC02D] fill-[#FBC02D]" />
              <span>Diner Counter Secret</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#2B170C] leading-relaxed">
              {recipe.shortOrderTip}
            </p>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="p-3 bg-[#F5EEDC] border-t-3 border-[#2B170C] flex items-center gap-2">
          {/* Enter Cook Mode */}
          <button
            onClick={() => {
              sounds.playBoop(600);
              onStartCookMode(recipe);
            }}
            className="flex-1 py-3 px-3 rounded-xl font-retro text-xs sm:text-sm uppercase flex items-center justify-center gap-1.5 cursor-pointer btn-tactile-red"
          >
            <Play className="w-4 h-4 fill-white shrink-0" />
            <span>START COOK MODE</span>
          </button>

          {/* Share / Copy Recipe Ticket */}
          <button
            onClick={handleShareOrCopy}
            title="Share or copy diner ticket"
            aria-label="Share Recipe Ticket"
            className="py-3 px-3 rounded-xl border-3 border-[#2B170C] bg-[#FFFDF8] text-[#2B170C] shadow-[2px_3px_0px_#2B170C] active:translate-y-0.5 active:shadow-none hover:bg-[#FFF9C4] flex items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline text-emerald-800">COPIED!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#2B170C]" />
                <span className="hidden sm:inline">SHARE</span>
              </>
            )}
          </button>

          {/* Save to Favorites / Hall of Fame */}
          <button
            onClick={() => {
              sounds.playBoop(700);
              onToggleSaveFavorite(recipe);
            }}
            aria-label={isFavorite ? 'Remove Favorite' : 'Save Favorite'}
            className={`py-3 px-3 rounded-xl border-3 border-[#2B170C] flex items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer ${
              isFavorite
                ? 'bg-[#FBC02D] text-[#2B170C] shadow-[1px_2px_0px_#2B170C]'
                : 'bg-[#FFFDF8] text-[#2B170C] shadow-[2px_3px_0px_#2B170C] hover:bg-[#FFF9C4]'
            }`}
          >
            {isFavorite ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-[#2B170C]" />
                <span className="hidden sm:inline">SAVED</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-[#2B170C]" />
                <span className="hidden sm:inline">SAVE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
