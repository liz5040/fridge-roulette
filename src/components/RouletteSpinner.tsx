import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Flame, RotateCw, Sparkles, ChefHat, AlertCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CHAOS_TWISTS, getExpiryInfo } from '../data/ingredients';
import type { Ingredient } from '../data/ingredients';
import { generateDinerRecipe } from '../data/recipes';
import type { DinerRecipe, CuisineType, DietType } from '../data/recipes';
import { sounds } from '../utils/soundEffects';
import { IngredientIcon } from '../utils/ingredientIcons';
import { requestAiChefRecipe } from '../services/aiChefService';

interface RouletteSpinnerProps {
  pantry: Ingredient[];
  onRecipeGenerated: (recipe: DinerRecipe) => void;
  onIncrementSpins: () => void;
  onUnlockChaosBadge: () => void;
  onCookWithWhatYouHave?: () => void;
}

// Helper: Pick ingredient with higher weight for expiring-soon items & cuisine affinity
function pickPrioritizedIngredient(pool: Ingredient[], cuisineFilter: 'all' | CuisineType = 'all'): Ingredient {
  if (pool.length === 0) return pool[0];
  if (pool.length === 1) return pool[0];

  const indianKeywords = ['paneer', 'dosa', 'appam', 'curry', 'coriander', 'cauliflower', 'gobi', 'rice', 'dal', 'ghee', 'masala', 'pepper', 'egg'];
  const westernKeywords = ['bacon', 'beef', 'sourdough', 'buns', 'cheddar', 'american', 'macaroni', 'tuna', 'waffles', 'potatoes', 'butter'];

  const weightedList: Ingredient[] = [];
  for (const item of pool) {
    const info = getExpiryInfo(item);
    let weight = 1;
    if (info.status === 'expiring_soon') {
      weight += 4; // High chance to rescue expiring ingredients!
    } else if (info.status === 'expired') {
      weight = 0.3;
    }

    const lowerName = item.name.toLowerCase();
    if (cuisineFilter === 'indian' && indianKeywords.some(k => lowerName.includes(k) || item.id.includes(k))) {
      weight += 3;
    } else if (cuisineFilter === 'western' && westernKeywords.some(k => lowerName.includes(k) || item.id.includes(k))) {
      weight += 3;
    } else if (cuisineFilter === 'fusion') {
      weight += 1.5;
    }

    const count = Math.max(1, Math.round(weight));
    for (let i = 0; i < count; i++) {
      weightedList.push(item);
    }
  }

  return weightedList[Math.floor(Math.random() * weightedList.length)] || pool[0];
}

export const RouletteSpinner: React.FC<RouletteSpinnerProps> = ({
  pantry,
  onRecipeGenerated,
  onIncrementSpins,
  onUnlockChaosBadge,
  onCookWithWhatYouHave,
}) => {
  // Separate ingredients by category from the user's active pantry
  // Reel 4 includes Flavor, Dairy, and Spices
  const getCategoryPool = (category: 'protein' | 'carb' | 'produce' | 'flavor') => {
    let inFridge: Ingredient[] = [];
    if (category === 'flavor') {
      inFridge = pantry.filter(i => (i.category === 'flavor' || i.category === 'dairy' || i.category === 'spices') && i.inFridge);
    } else {
      inFridge = pantry.filter(i => i.category === category && i.inFridge);
    }
    if (inFridge.length > 0) return inFridge;

    // fallback to any item in that category
    if (category === 'flavor') {
      const allFlavor = pantry.filter(i => i.category === 'flavor' || i.category === 'dairy' || i.category === 'spices');
      if (allFlavor.length > 0) return allFlavor;
    } else {
      const allCat = pantry.filter(i => i.category === category);
      if (allCat.length > 0) return allCat;
    }
    return pantry.filter(i => i.inFridge).length > 0 ? pantry.filter(i => i.inFridge) : pantry;
  };

  const proteins = getCategoryPool('protein');
  const carbs = getCategoryPool('carb');
  const produce = getCategoryPool('produce');
  const flavors = getCategoryPool('flavor');

  // Currently displayed ingredients on each reel
  const [currentProtein, setCurrentProtein] = useState<Ingredient>(() => proteins[0] || pantry[0]);
  const [currentCarb, setCurrentCarb] = useState<Ingredient>(() => carbs[0] || pantry[1]);
  const [currentProduce, setCurrentProduce] = useState<Ingredient>(() => produce[0] || pantry[2]);
  const [currentFlavor, setCurrentFlavor] = useState<Ingredient>(() => flavors[0] || pantry[3]);

  // Hold / Lock state for each reel
  const [lockedReels, setLockedReels] = useState<{ [key: string]: boolean }>({
    protein: false,
    carb: false,
    produce: false,
    flavor: false,
  });

  // Spinning states
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningReels, setSpinningReels] = useState<{ [key: string]: boolean }>({
    protein: false,
    carb: false,
    produce: false,
    flavor: false,
  });

  // Chaos mode toggle
  const [chaosMode, setChaosMode] = useState(false);
  const [activeTwist, setActiveTwist] = useState<string | null>(null);

  // Cuisine & Meal Filters
  const [cuisineFilter, setCuisineFilter] = useState<'all' | CuisineType>('all');
  const [mealFilter, setMealFilter] = useState<'all' | 'breakfast' | 'melts' | 'speedy'>('all');

  // AI Chef State
  const [aiPrompt, setAiPrompt] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState<'all' | DietType>('all');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiLoadingMessage, setAiLoadingMessage] = useState('Short-Order Chef is checking your fridge...');
  const [aiNotice, setAiNotice] = useState<{ type: 'info' | 'warning' | 'error'; text: string } | null>(null);
  const [isAiPadOpen, setIsAiPadOpen] = useState(true);

  // Quick Chef prompt chips
  const QUICK_PROMPTS = [
    { label: '🌶️ Spicy Veg in 15m', prompt: 'I want a spicy vegetarian dinner under 15 minutes', diet: 'veg' as const },
    { label: '🇮🇳 Kerala / Desi Comfort', prompt: 'Homestyle Indian comfort meal with spices, curry leaves and aromatics', diet: 'all' as const },
    { label: '🧀 Late-Night Cheesy Melt', prompt: 'Crispy diner melt with gooey cheese and caramelized goodness', diet: 'all' as const },
    { label: '🌮 Fusion Street Mashup', prompt: 'Creative cross-culture fusion street food using my fridge items', diet: 'all' as const },
    { label: '🧹 Rescue Expiring Items', prompt: 'Prioritize and rescue whatever is expiring in my fridge right now', diet: 'all' as const },
  ];

  // Request recipe from AI Diner Chef powered by Groq
  const handleAskAiChef = async (overridePrompt?: string, overrideDiet?: DietType | 'all') => {
    if (isAiLoading || isSpinning) return;
    const promptToUse = (overridePrompt ?? aiPrompt).trim() || 'Cook me an unforgettable diner meal using my fridge ingredients!';
    const dietToUse = overrideDiet ?? dietaryPreference;

    sounds.playBoop(700);
    setIsAiLoading(true);
    setAiNotice(null);

    const loadingStages = [
      '🍳 Short-Order AI Chef is reading your fridge...',
      '🔥 Firing up the griddle & checking expiring ingredients...',
      '🌶️ Crafting authentic Indian, Western or Fusion variations...',
      '🧾 Balancing cook times & writing step-by-step instructions...',
    ];
    let stage = 0;
    setAiLoadingMessage(loadingStages[0]);
    const timer = window.setInterval(() => {
      stage = (stage + 1) % loadingStages.length;
      setAiLoadingMessage(loadingStages[stage]);
    }, 1300);

    try {
      const result = await requestAiChefRecipe({
        prompt: promptToUse,
        pantry,
        selectedReels: {
          protein: currentProtein,
          carb: currentCarb,
          produce: currentProduce,
          flavor: currentFlavor,
        },
        cuisineFilter,
        mealFilter,
        dietaryPreference: dietToUse,
        chaosTwist: chaosMode && activeTwist ? activeTwist : undefined,
      });

      clearInterval(timer);
      setIsAiLoading(false);

      if (result.notice) {
        setAiNotice(result.notice);
        setTimeout(() => setAiNotice(null), 7000);
      }

      sounds.playDinerBell();
      sounds.playWinJingle();

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#E53935', '#FBC02D', '#2B170C', '#4CAF50'],
      });

      onIncrementSpins();
      onRecipeGenerated(result.recipe);
    } catch (err: any) {
      clearInterval(timer);
      setIsAiLoading(false);
      console.warn('AI Chef exception, using verified house recipe:', err);

      const fallback = generateDinerRecipe(
        { protein: currentProtein, carb: currentCarb, produce: currentProduce, flavor: currentFlavor },
        chaosMode && activeTwist ? activeTwist : undefined,
        pantry,
        cuisineFilter,
        mealFilter
      );
      fallback.matchReason = 'Switched to verified House Special recipe.';
      sounds.playDinerBell();
      onRecipeGenerated(fallback);
    }
  };

  // Audio interval ref for ticking sound
  const tickIntervalRef = useRef<number | null>(null);

  // Handle Reel Lock Toggle
  const toggleLock = (reelKey: 'protein' | 'carb' | 'produce' | 'flavor') => {
    if (isSpinning) return;
    const nextLocked = !lockedReels[reelKey];
    setLockedReels(prev => ({ ...prev, [reelKey]: nextLocked }));
    sounds.playLockSound(nextLocked);
  };

  // Perform the spin!
  const spinRoulette = () => {
    if (isSpinning) return;

    // Trigger lever pull sound
    sounds.playLeverPull();
    setIsSpinning(true);
    onIncrementSpins();

    if (chaosMode) {
      onUnlockChaosBadge();
      const randomTwist = CHAOS_TWISTS[Math.floor(Math.random() * CHAOS_TWISTS.length)];
      setActiveTwist(randomTwist);
    } else {
      setActiveTwist(null);
    }

    // Determine which reels should spin (unlocked ones)
    const reelsToSpin = {
      protein: !lockedReels.protein,
      carb: !lockedReels.carb,
      produce: !lockedReels.produce,
      flavor: !lockedReels.flavor,
    };
    setSpinningReels(reelsToSpin);

    // Start rapid audio ticks
    let tickCount = 0;
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    tickIntervalRef.current = window.setInterval(() => {
      sounds.playTick(1 + (tickCount % 4) * 0.1);
      tickCount++;
    }, 75);

    // Pick final target ingredients for unlocked reels with expiring-item prioritization & cuisine affinity
    const finalProtein = reelsToSpin.protein
      ? pickPrioritizedIngredient(proteins, cuisineFilter)
      : currentProtein;
    const finalCarb = reelsToSpin.carb
      ? pickPrioritizedIngredient(carbs, cuisineFilter)
      : currentCarb;
    const finalProduce = reelsToSpin.produce
      ? pickPrioritizedIngredient(produce, cuisineFilter)
      : currentProduce;
    const finalFlavor = reelsToSpin.flavor
      ? pickPrioritizedIngredient(flavors, cuisineFilter)
      : currentFlavor;

    // Rapid shuffle animation for visible feedback
    const shuffleInterval = setInterval(() => {
      if (reelsToSpin.protein) setCurrentProtein(proteins[Math.floor(Math.random() * proteins.length)]);
      if (reelsToSpin.carb) setCurrentCarb(carbs[Math.floor(Math.random() * carbs.length)]);
      if (reelsToSpin.produce) setCurrentProduce(produce[Math.floor(Math.random() * produce.length)]);
      if (reelsToSpin.flavor) setCurrentFlavor(flavors[Math.floor(Math.random() * flavors.length)]);
    }, 90);

    // Staggered reel deceleration & stop (1.1s, 1.6s, 2.1s, 2.6s)
    setTimeout(() => {
      if (reelsToSpin.protein) {
        setCurrentProtein(finalProtein);
        setSpinningReels(prev => ({ ...prev, protein: false }));
        sounds.playBoop(480);
      }
    }, 1100);

    setTimeout(() => {
      if (reelsToSpin.carb) {
        setCurrentCarb(finalCarb);
        setSpinningReels(prev => ({ ...prev, carb: false }));
        sounds.playBoop(560);
      }
    }, 1600);

    setTimeout(() => {
      if (reelsToSpin.produce) {
        setCurrentProduce(finalProduce);
        setSpinningReels(prev => ({ ...prev, produce: false }));
        sounds.playBoop(640);
      }
    }, 2100);

    setTimeout(() => {
      if (reelsToSpin.flavor) {
        setCurrentFlavor(finalFlavor);
        setSpinningReels(prev => ({ ...prev, flavor: false }));
      }

      // All reels stopped!
      clearInterval(shuffleInterval);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      setIsSpinning(false);

      // Play brass diner bell and confetti!
      sounds.playDinerBell();
      sounds.playWinJingle();

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#E53935', '#FBC02D', '#FFFDF9', '#2B170C'],
      });

      // Generate the curated diner recipe ticket matching user ingredients, cuisine & style
      const recipe = generateDinerRecipe(
        {
          protein: finalProtein,
          carb: finalCarb,
          produce: finalProduce,
          flavor: finalFlavor,
        },
        chaosMode && activeTwist ? activeTwist : undefined,
        pantry,
        cuisineFilter,
        mealFilter
      );

      // Promptly notify parent
      onRecipeGenerated(recipe);
    }, 2600);
  };

  // Clean up timers
  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  const reels = [
    { key: 'protein' as const, label: 'PROTEIN', sub: 'The Star', item: currentProtein, isSpinning: spinningReels.protein, isLocked: lockedReels.protein, color: 'bg-rose-50 border-rose-300' },
    { key: 'carb' as const, label: 'BASE', sub: 'The Crunch', item: currentCarb, isSpinning: spinningReels.carb, isLocked: lockedReels.carb, color: 'bg-amber-50 border-amber-300' },
    { key: 'produce' as const, label: 'CRISP', sub: 'The Produce', item: currentProduce, isSpinning: spinningReels.produce, isLocked: lockedReels.produce, color: 'bg-emerald-50 border-emerald-300' },
    { key: 'flavor' as const, label: 'MELT', sub: 'The Secret', item: currentFlavor, isSpinning: spinningReels.flavor, isLocked: lockedReels.flavor, color: 'bg-orange-50 border-orange-300' },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col gap-3 select-none" role="region" aria-label="Roulette Spinner">
      {/* Top Filter Bar: Cuisines & Meal Styles */}
      <div className="flex flex-col gap-2 bg-[#FFFDF8] border-2 border-[#2B170C] p-2.5 rounded-2xl shadow-[2px_2px_0px_#2B170C]">
        {/* Row 1: Cuisines */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
          <span className="font-heading font-black text-[#2B170C] text-xs sm:text-sm tracking-wider uppercase flex items-center gap-1 shrink-0">
            🌶️ Cuisine:
          </span>
          <div className="flex items-center gap-1.5 shrink-0" role="radiogroup" aria-label="Cuisine filter">
            {[
              { id: 'all', label: 'All', icon: '🌎' },
              { id: 'indian', label: 'Indian', icon: '🇮🇳' },
              { id: 'western', label: 'Western', icon: '🍔' },
              { id: 'fusion', label: 'Fusion', icon: '🌮' },
            ].map(c => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={cuisineFilter === c.id}
                onClick={() => {
                  sounds.playBoop(520);
                  setCuisineFilter(c.id as typeof cuisineFilter);
                }}
                className={`min-h-[34px] px-2.5 py-1 rounded-full text-xs font-black border-2 transition-all cursor-pointer flex items-center gap-1 ${
                  cuisineFilter === c.id
                    ? 'bg-[#E53935] text-white border-[#2B170C] shadow-[1px_2px_0px_#2B170C]'
                    : 'bg-[#FFFDF8] text-[#2B170C] border-[#2B170C]/30 hover:border-[#2B170C]'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Styles */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs border-t border-[#2B170C]/15 pt-1.5">
          <span className="font-heading font-black text-[#2B170C] text-xs sm:text-sm tracking-wider uppercase flex items-center gap-1 shrink-0">
            ⏱️ Style:
          </span>
          <div className="flex items-center gap-1.5 shrink-0" role="radiogroup" aria-label="Meal style filter">
            {[
              { id: 'all', label: 'All Grub' },
              { id: 'breakfast', label: 'Breakfast' },
              { id: 'melts', label: 'Melts' },
              { id: 'speedy', label: 'Under 15m' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={mealFilter === f.id}
                onClick={() => {
                  sounds.playBoop(500);
                  setMealFilter(f.id as typeof mealFilter);
                }}
                className={`min-h-[30px] px-2.5 py-0.5 rounded-full text-xs font-black border-2 transition-all cursor-pointer ${
                  mealFilter === f.id
                    ? 'bg-[#2B170C] text-[#FFF9C4] border-[#2B170C] shadow-[1px_1px_0px_#E53935]'
                    : 'bg-[#FFFDF8] text-[#2B170C] border-[#2B170C]/30 hover:border-[#2B170C]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Retro Diner Slot Machine Casing */}
      <div className="relative bg-[#FFFDF8] border-4 border-[#2B170C] rounded-3xl p-3.5 shadow-[5px_6px_0px_#2B170C] overflow-hidden">
        {/* Decorative Diner Chrome & Arch Header */}
        <div className="bg-[#E53935] text-[#FFFDF8] -mx-3.5 -mt-3.5 px-3.5 py-2.5 border-b-3 border-[#2B170C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FFF9C4] border border-[#2B170C] animate-pulse" />
            <span className="font-retro text-sm sm:text-base tracking-wider text-[#FBC02D] drop-shadow-[1px_1px_0px_#2B170C]">
              LUCKY DINER SPINNER
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#2B170C] px-2.5 py-1 rounded-full text-xs text-[#FBC02D] font-mono font-black tracking-widest border border-[#FBC02D]/50">
            <span>READY TO COOK</span>
          </div>
        </div>

        {/* 4 Interactive Slot Reels Grid + Side Lever */}
        <div className="flex items-center gap-2 relative">
          <div className="flex-1 grid grid-cols-4 gap-1.5 my-3 relative">
            {reels.map(reel => (
              <div
                key={reel.key}
                className="flex flex-col items-center gap-1.5 relative"
              >
                {/* Category Pill Tag */}
                <div className="w-full text-center py-1 rounded-md bg-[#2B170C] text-[#FFFDF8] text-xs font-black uppercase tracking-wider">
                  {reel.label}
                </div>

                {/* The Reel Window */}
                <div
                  className={`w-full aspect-[4/5] rounded-xl border-3 border-[#2B170C] flex flex-col items-center justify-center p-1 relative overflow-hidden transition-all shadow-[inset_0_3px_6px_rgba(43,23,12,0.15)] ${
                    reel.color
                  } ${reel.isSpinning ? 'animate-reel-blur scale-[0.98]' : 'scale-100'} ${
                    reel.isLocked ? 'ring-3 ring-[#E53935] ring-offset-1' : ''
                  }`}
                >
                  {/* Vintage Reel Highlight reflection */}
                  <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

                  {/* Big Dynamic Ingredient Icon */}
                  <div className="w-10 h-10 flex items-center justify-center">
                    <IngredientIcon
                      name={reel.item?.name || 'Empty'}
                      emoji={reel.item?.emoji}
                      category={reel.key}
                      className="w-9 h-9 text-3xl sm:text-4xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]"
                    />
                  </div>

                  {/* Ingredient Label (Enlarged) */}
                  <span className="text-xs sm:text-sm font-heading font-black text-[#2B170C] text-center leading-tight line-clamp-2 mt-1 px-0.5">
                    {reel.item?.name || 'Empty'}
                  </span>

                  {/* Expiring Soon / Freshness Badge */}
                  {reel.item && getExpiryInfo(reel.item).status === 'expiring_soon' && (
                    <span className="absolute top-1 right-1 text-[9px] bg-[#E53935] text-white font-black px-1.5 py-0.5 rounded-full animate-bounce shadow-[1px_1px_0px_#2B170C]">
                      RESCUE!
                    </span>
                  )}
                  {reel.item && getExpiryInfo(reel.item).status === 'expired' && (
                    <span className="absolute top-1 right-1 text-[9px] bg-black text-white font-black px-1 rounded-full">
                      EXP
                    </span>
                  )}
                </div>

                {/* HOLD / LOCK Button (Enlarged touch target) */}
                <button
                  type="button"
                  onClick={() => toggleLock(reel.key)}
                  disabled={isSpinning}
                  aria-pressed={reel.isLocked}
                  aria-label={reel.isLocked ? `Unlock ${reel.label} reel` : `Hold ${reel.label} reel`}
                  className={`w-full min-h-[38px] py-1.5 px-1 rounded-xl border-2 border-[#2B170C] flex items-center justify-center gap-1 text-xs font-black transition-all cursor-pointer ${
                    reel.isLocked
                      ? 'bg-[#E53935] text-white shadow-[0_1px_0px_#2B170C]'
                      : 'bg-[#FFFDF8] text-[#2B170C] shadow-[1px_2px_0px_#2B170C] hover:bg-[#FFF9C4]'
                  }`}
                >
                  {reel.isLocked ? (
                    <>
                      <Lock className="w-3 h-3 stroke-[2.5]" />
                      <span>HELD</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3 text-gray-700 stroke-[2.5]" />
                      <span>HOLD</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Retro Mechanical Pull Lever */}
          <div className="flex flex-col items-center justify-center select-none pt-2">
            <button
              type="button"
              onClick={spinRoulette}
              disabled={isSpinning}
              title="Pull the Lucky Lever to spin!"
              aria-label="Pull mechanical diner slot lever"
              className={`group flex flex-col items-center cursor-pointer transition-transform duration-300 min-h-[80px] justify-center ${
                isSpinning ? 'translate-y-6 rotate-6' : 'hover:-translate-y-1'
              }`}
            >
              {/* Red Ball Handle */}
              <div className="w-7 h-7 rounded-full bg-[#E53935] border-2 border-[#2B170C] shadow-[2px_2px_0px_#2B170C] group-hover:bg-[#FF5252] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white/80 -translate-y-1 -translate-x-1" />
              </div>
              {/* Chrome Shaft */}
              <div className="w-2.5 h-16 bg-gradient-to-r from-gray-200 via-white to-gray-400 border-x-2 border-[#2B170C]" />
              {/* Pivot Base */}
              <div className="w-6 h-6 rounded-md bg-[#2B170C] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FBC02D]" />
              </div>
            </button>
          </div>
        </div>

        {/* Chaos / Mystery Twist Bar */}
        <div className="mt-2.5 pt-2.5 border-t-2 border-[#2B170C]/20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              sounds.playBoop(chaosMode ? 400 : 700);
              setChaosMode(!chaosMode);
            }}
            aria-pressed={chaosMode}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-[#2B170C] text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              chaosMode
                ? 'bg-[#FFF176] text-[#2B170C] shadow-[2px_2px_0px_#2B170C]'
                : 'bg-[#F5EEDC] text-[#2B170C] hover:bg-[#FFFDF8]'
            }`}
          >
            <Flame className={`w-4 h-4 ${chaosMode ? 'text-[#E53935] fill-[#E53935]' : 'text-gray-700'}`} />
            <span>Chaos Mystery Twist</span>
            <span className={`text-xs px-2 py-0.5 rounded font-black uppercase ${chaosMode ? 'bg-[#E53935] text-white' : 'bg-gray-300 text-gray-800'}`}>
              {chaosMode ? 'ON' : 'OFF'}
            </span>
          </button>

          <span className="text-xs font-bold text-[#2B170C]/80 italic hidden sm:inline">
            Lock any reel & spin the rest!
          </span>
        </div>

        {/* Active Chaos Twist Callout if triggered */}
        {activeTwist && (
          <div
            role="alert"
            className="mt-2.5 p-3 bg-[#FFF9C4] border-2 border-dashed border-[#E53935] rounded-xl text-center text-xs sm:text-sm font-black text-[#B71C1C] animate-pulse"
          >
            {activeTwist}
          </div>
        )}
      </div>

      {/* Big Chunky 3D Tactile "SPIN THE REELS" Button */}
      <button
        type="button"
        onClick={spinRoulette}
        disabled={isSpinning || isAiLoading}
        aria-label={isSpinning ? 'Reels are spinning...' : 'Pull and spin the roulette reels'}
        className={`w-full min-h-[56px] py-3.5 rounded-2xl font-retro text-lg sm:text-xl tracking-wider uppercase flex items-center justify-center gap-2.5 cursor-pointer btn-tactile-red ${
          isSpinning || isAiLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
        <span>{isSpinning ? 'SPINNING THE GRIDDLE...' : 'PULL & SPIN ROULETTE!'}</span>
        <Sparkles className="w-5 h-5 text-[#FBC02D]" />
      </button>

      {/* Immediate Zero-Waste: Cook With What You Have */}
      {onCookWithWhatYouHave && (
        <button
          type="button"
          onClick={onCookWithWhatYouHave}
          disabled={isSpinning || isAiLoading}
          aria-label="Directly match recipes with available fridge and freezer ingredients"
          className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-[#FFF9C4] hover:bg-[#FFF59D] border-3 border-[#2B170C] font-retro text-sm sm:text-base text-[#2B170C] tracking-wide uppercase flex items-center justify-center gap-2 shadow-[2px_3px_0px_#2B170C] active:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
        >
          <span className="text-xl">🍳</span>
          <span>COOK WHAT YOU HAVE (RESCUE FOOD)</span>
          <span className="text-xs font-mono font-bold bg-[#E53935] text-white px-1.5 py-0.5 rounded">
            {pantry.filter(i => (i.location === 'fridge' || i.location === 'freezer') && i.inFridge).length} FRESH
          </span>
        </button>
      )}

      {/* Mini Helper Info */}
      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#2B170C] font-semibold">
        <ChefHat className="w-4 h-4 text-[#E53935]" />
        <span>Tap <b>HOLD</b> on reels to lock ingredients, or ask AI Chef below!</span>
      </div>

      {/* Toast Notice Banner if Fallback or AI Info */}
      {aiNotice && (
        <div
          role="alert"
          className="p-3 bg-[#FFF9C4] border-2 border-[#2B170C] rounded-xl flex items-center justify-between gap-2 shadow-[2px_2px_0px_#2B170C] animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#2B170C]">
            <AlertCircle className="w-4 h-4 text-[#E53935] shrink-0" />
            <span>{aiNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setAiNotice(null)}
            className="p-1 text-gray-700 hover:text-black cursor-pointer"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SHORT-ORDER AI DINER CHEF ORDER PAD (POWERED BY GROQ)                     */}
      {/* ========================================================================= */}
      <div className="bg-[#FFFDF8] border-3 border-[#2B170C] rounded-2xl p-3 sm:p-4 shadow-[4px_4px_0px_#2B170C] flex flex-col gap-3">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-[#2B170C]/15">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FBC02D] border-2 border-[#2B170C] flex items-center justify-center text-xl shadow-[1px_1px_0px_#2B170C]">
              👨‍🍳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-xs sm:text-sm text-[#2B170C] uppercase tracking-wider">
                  Short-Order AI Chef
                </h3>
                <span className="text-[10px] bg-[#2E7D32] text-white px-1.5 py-0.2 rounded font-mono font-bold tracking-wide">
                  GROQ LLAMA 3.3
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#2B170C]/80 font-semibold">
                Cooks creative meals tailored to your fridge stock
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAiPadOpen(!isAiPadOpen)}
            className="text-xs font-black text-[#E53935] hover:underline cursor-pointer py-1 px-1.5 shrink-0"
          >
            {isAiPadOpen ? 'Hide Pad ▲' : 'Open Pad ▾'}
          </button>
        </div>

        {/* Collapsible Order Pad Body */}
        {isAiPadOpen && (
          <div className="flex flex-col gap-3 animate-in fade-in duration-150">
            {/* Natural Language Prompt Input */}
            <div>
              <label htmlFor="ai-chef-prompt" className="block text-[11px] font-heading font-black text-[#2B170C] uppercase tracking-wider mb-1">
                Special Request / Craving:
              </label>
              <div className="relative flex items-center">
                <input
                  id="ai-chef-prompt"
                  type="text"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAskAiChef();
                    }
                  }}
                  placeholder='e.g. "Spicy vegetarian dinner under 20 minutes"'
                  disabled={isAiLoading}
                  className="w-full px-3 py-2 pr-9 text-xs sm:text-sm font-bold text-[#2B170C] bg-[#FBF5E6] border-2 border-[#2B170C] rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#E53935] min-h-[42px]"
                />
                {aiPrompt ? (
                  <button
                    type="button"
                    onClick={() => setAiPrompt('')}
                    className="absolute right-2.5 p-1 text-gray-500 hover:text-black cursor-pointer"
                    aria-label="Clear request input"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <ChefHat className="w-4 h-4 text-gray-400 absolute right-2.5 pointer-events-none" />
                )}
              </div>
            </div>

            {/* Quick Prompt Suggestion Chips */}
            <div>
              <p className="text-[10px] font-black text-[#2B170C]/70 uppercase tracking-wider mb-1">
                Quick Diner Cravings:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map(qp => (
                  <button
                    key={qp.label}
                    type="button"
                    onClick={() => {
                      setAiPrompt(qp.prompt);
                      handleAskAiChef(qp.prompt, qp.diet);
                    }}
                    disabled={isAiLoading}
                    className="min-h-[28px] px-2.5 py-0.5 rounded-lg text-[11px] font-black bg-[#FBF5E6] hover:bg-[#FFF9C4] text-[#2B170C] border border-[#2B170C]/40 transition-all cursor-pointer shadow-[1px_1px_0px_#2B170C] active:translate-y-0.5"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preference Filter Row */}
            <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#2B170C]/10 text-xs">
              <span className="text-[11px] font-black text-[#2B170C] uppercase tracking-wider shrink-0">
                Dietary:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto">
                {[
                  { id: 'all', label: 'All Diets' },
                  { id: 'veg', label: '🟢 Veg' },
                  { id: 'egg', label: '🟡 Egg' },
                  { id: 'non-veg', label: '🔴 Non-Veg' },
                ].map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDietaryPreference(d.id as any)}
                    className={`min-h-[26px] px-2 py-0.5 rounded-full text-[11px] font-black border transition-all cursor-pointer ${
                      dietaryPreference === d.id
                        ? 'bg-[#2B170C] text-[#FFF9C4] border-[#2B170C]'
                        : 'bg-[#FFFDF8] text-[#2B170C] border-[#2B170C]/30 hover:border-[#2B170C]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cook with AI Chef Action Button */}
            <button
              type="button"
              onClick={() => handleAskAiChef()}
              disabled={isAiLoading || isSpinning}
              className={`w-full min-h-[48px] py-2.5 px-4 rounded-xl font-retro text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isAiLoading
                  ? 'bg-amber-300 text-[#2B170C] cursor-not-allowed opacity-90'
                  : 'bg-[#FBC02D] hover:bg-[#FDD835] text-[#2B170C] border-2 border-[#2B170C] shadow-[3px_3px_0px_#2B170C] active:translate-y-0.5 active:shadow-none'
              }`}
            >
              <ChefHat className={`w-5 h-5 ${isAiLoading ? 'animate-bounce text-[#E53935]' : 'text-[#E53935]'}`} />
              <span>{isAiLoading ? 'CHEFFING UP YOUR DISH...' : '👨‍🍳 COOK WITH AI CHEF'}</span>
              <Sparkles className="w-4 h-4 text-[#E65100]" />
            </button>
          </div>
        )}
      </div>

      {/* Full Loading Screen Overlay when AI Chef is cooking */}
      {isAiLoading && (
        <div
          role="status"
          aria-live="assertive"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-[#FFFDF8] border-4 border-[#2B170C] rounded-3xl p-6 max-w-sm w-full text-center shadow-[6px_8px_0px_#2B170C] flex flex-col items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF9C4] border-3 border-[#2B170C] flex items-center justify-center text-4xl shadow-[2px_2px_0px_#2B170C] animate-bounce">
              🍳
            </div>
            <div>
              <h3 className="font-retro text-xl sm:text-2xl text-[#E53935] tracking-wide leading-tight">
                ORDER IN PROGRESS!
              </h3>
              <p className="text-xs sm:text-sm font-heading font-black text-[#2B170C] mt-1">
                {aiLoadingMessage}
              </p>
            </div>
            <div className="w-full bg-[#F5EEDC] rounded-full h-2.5 border-2 border-[#2B170C] overflow-hidden">
              <div className="bg-[#E53935] h-full rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-[11px] text-[#2B170C]/80 font-bold italic">
              Analyzing available fridge items & checking freshness...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
