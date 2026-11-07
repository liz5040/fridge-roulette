import { useState, useEffect } from 'react';
import { INITIAL_INGREDIENTS, getDateOffset } from './data/ingredients';
import type { Ingredient, IngredientCategory, IngredientUnit, PantryPreset } from './data/ingredients';
import type { DinerRecipe } from './data/recipes';
import { sounds } from './utils/soundEffects';
import { Header } from './components/Header';
import { RouletteSpinner } from './components/RouletteSpinner';
import { FridgePantry } from './components/FridgePantry';
import { HallOfFame } from './components/HallOfFame';
import type { DinerStats } from './components/HallOfFame';
import { RecipeModal } from './components/RecipeModal';
import { CookMode } from './components/CookMode';
import { BottomNav } from './components/BottomNav';
import type { NavTab } from './components/BottomNav';

// Helper: Normalize loaded pantry items from LocalStorage
function normalizePantry(items: unknown): Ingredient[] {
  if (!Array.isArray(items)) return INITIAL_INGREDIENTS;

  const validCategories: IngredientCategory[] = ['protein', 'carb', 'produce', 'flavor', 'dairy', 'spices', 'other'];
  const validUnits: IngredientUnit[] = ['pieces', 'grams', 'kg', 'ml', 'litres'];

  return items.map((item, idx) => {
    let cat: IngredientCategory = validCategories.includes(item.category) ? item.category : 'other';
    // Backwards compatibility fixes
    if (['cheddar', 'butter', 'american_cheese'].includes(item.id)) cat = 'dairy';
    if (['hotsauce', 'garlic_herb'].includes(item.id)) cat = 'spices';

    const unit: IngredientUnit = validUnits.includes(item.unit) ? item.unit : 'pieces';
    const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;

    let expiryDate = item.expiryDate;
    if (!expiryDate && item.expiringSoon) {
      expiryDate = getDateOffset(2);
    }

    return {
      id: item.id || `item-${Date.now()}-${idx}`,
      name: item.name || 'Unnamed Ingredient',
      category: cat,
      emoji: item.emoji || '🍽️',
      quantity,
      unit,
      inFridge: item.inFridge !== false,
      expiryDate,
      expiringSoon: item.expiringSoon,
      freshnessDays: item.freshnessDays,
      dinerDesc: item.dinerDesc,
    };
  });
}

export function App() {
  // Pantry state with LocalStorage persistence and normalization
  const [pantry, setPantry] = useState<Ingredient[]>(() => {
    try {
      const saved = localStorage.getItem('fridge_roulette_pantry');
      return saved ? normalizePantry(JSON.parse(saved)) : INITIAL_INGREDIENTS;
    } catch {
      return INITIAL_INGREDIENTS;
    }
  });

  // Lifetime Stats
  const [stats, setStats] = useState<DinerStats>(() => {
    try {
      const saved = localStorage.getItem('fridge_roulette_stats');
      return saved ? JSON.parse(saved) : { spinsCount: 0, cookedCount: 0, wasteSavedLbs: 0, hasChaosSpun: false };
    } catch {
      return { spinsCount: 0, cookedCount: 0, wasteSavedLbs: 0, hasChaosSpun: false };
    }
  });

  // Favorite Recipes
  const [favorites, setFavorites] = useState<DinerRecipe[]>(() => {
    try {
      const saved = localStorage.getItem('fridge_roulette_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('spin');

  // Currently generated recipe & modals
  const [activeRecipe, setActiveRecipe] = useState<DinerRecipe | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isCookModeOpen, setIsCookModeOpen] = useState(false);
  const [isFloatingTicketDismissed, setIsFloatingTicketDismissed] = useState(false);

  // Mute & Desktop Frame preferences
  const [isMuted, setIsMuted] = useState(sounds.isMuted);
  const [isDesktopFramed, setIsDesktopFramed] = useState(true);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('fridge_roulette_pantry', JSON.stringify(pantry));
  }, [pantry]);

  useEffect(() => {
    localStorage.setItem('fridge_roulette_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('fridge_roulette_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handlers
  const handleToggleMute = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleToggleDesktopFrame = () => {
    setIsDesktopFramed(!isDesktopFramed);
  };

  const handleIncrementSpins = () => {
    setStats(prev => ({ ...prev, spinsCount: prev.spinsCount + 1 }));
  };

  const handleUnlockChaosBadge = () => {
    setStats(prev => ({ ...prev, hasChaosSpun: true }));
  };

  const handleRecipeGenerated = (recipe: DinerRecipe) => {
    setActiveRecipe(recipe);
    setIsFloatingTicketDismissed(false);
    setIsRecipeModalOpen(true);
  };

  const handleToggleInFridge = (id: string) => {
    setPantry(prev =>
      prev.map(item => (item.id === id ? { ...item, inFridge: !item.inFridge } : item))
    );
  };

  const handleToggleExpiringSoon = (id: string) => {
    setPantry(prev =>
      prev.map(item => (item.id === id ? { ...item, expiringSoon: !item.expiringSoon } : item))
    );
  };

  // Add or Update Ingredient with Duplicate Prevention
  const handleAddOrUpdateIngredient = (
    itemData: Omit<Ingredient, 'id'>,
    existingId?: string
  ): { updated: boolean; name: string } => {
    let wasUpdated = false;
    let targetName = itemData.name;

    setPantry(prev => {
      // 1. Explicit ID passed -> Edit operation
      if (existingId) {
        wasUpdated = true;
        return prev.map(item =>
          item.id === existingId
            ? {
                ...item,
                ...itemData,
                id: existingId,
              }
            : item
        );
      }

      // 2. Duplicate Check: compare normalized trimmed names
      const normalizedName = itemData.name.trim().toLowerCase();
      const existingIndex = prev.findIndex(
        i => i.name.trim().toLowerCase() === normalizedName
      );

      if (existingIndex !== -1) {
        wasUpdated = true;
        targetName = prev[existingIndex].name;
        const updated = [...prev];
        const existing = updated[existingIndex];

        // If units match, add quantities; if different, update to new quantity and unit
        let newQuantity = itemData.quantity;
        if (existing.unit === itemData.unit) {
          newQuantity = Number(((existing.quantity || 0) + itemData.quantity).toFixed(2));
        }

        updated[existingIndex] = {
          ...existing,
          ...itemData,
          name: existing.name, // Keep existing capitalized styling
          quantity: newQuantity,
          inFridge: true, // Mark in fridge on re-stock
          expiryDate: itemData.expiryDate || existing.expiryDate,
        };

        return updated;
      }

      // 3. Brand New Ingredient
      const newItem: Ingredient = {
        ...itemData,
        id: `custom-${Date.now()}`,
      };
      return [newItem, ...prev];
    });

    return { updated: wasUpdated, name: targetName };
  };

  // Delete an ingredient
  const handleDeleteIngredient = (id: string) => {
    setPantry(prev => prev.filter(item => item.id !== id));
  };

  // Quick Stock Presets
  const handleApplyPreset = (preset: PantryPreset) => {
    setPantry(prev => {
      const updated = [...prev];

      for (const presetItem of preset.items) {
        const normalizedName = presetItem.name.trim().toLowerCase();
        const existingIndex = updated.findIndex(
          i => i.id === presetItem.id || i.name.trim().toLowerCase() === normalizedName
        );

        const targetExpiry = getDateOffset(presetItem.expiryOffsetDays);

        if (existingIndex !== -1) {
          const existing = updated[existingIndex];
          updated[existingIndex] = {
            ...existing,
            category: presetItem.category,
            emoji: presetItem.emoji || existing.emoji,
            quantity: Math.max(existing.quantity || 0, presetItem.quantity),
            unit: presetItem.unit,
            inFridge: true,
            expiryDate: targetExpiry,
            dinerDesc: presetItem.dinerDesc || existing.dinerDesc,
          };
        } else {
          const newItem: Ingredient = {
            id: presetItem.id,
            name: presetItem.name,
            category: presetItem.category,
            emoji: presetItem.emoji,
            quantity: presetItem.quantity,
            unit: presetItem.unit,
            inFridge: true,
            expiryDate: targetExpiry,
            dinerDesc: presetItem.dinerDesc,
          };
          updated.push(newItem);
        }
      }

      return updated;
    });
  };

  const handleToggleSaveFavorite = (recipe: DinerRecipe) => {
    setFavorites(prev => {
      const exists = prev.some(r => r.id === recipe.id);
      if (exists) {
        return prev.filter(r => r.id !== recipe.id);
      } else {
        return [recipe, ...prev];
      }
    });
  };

  const handleFinishCooking = (recipe: DinerRecipe) => {
    setStats(prev => ({
      ...prev,
      cookedCount: prev.cookedCount + 1,
      wasteSavedLbs: prev.wasteSavedLbs + (recipe.wasteSavedLbs || 0.7),
    }));
  };

  // Helper counts
  const inStockCount = pantry.filter(i => i.inFridge).length;
  const expiringCount = pantry.filter(i => {
    if (!i.inFridge) return false;
    if (i.expiringSoon) return true;
    if (i.expiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [year, month, day] = i.expiryDate.split('-').map(Number);
      const expDate = new Date(year, month - 1, day);
      expDate.setHours(0, 0, 0, 0);
      const diffDays = Math.round((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    }
    return false;
  }).length;

  const isFavorite = activeRecipe ? favorites.some(r => r.id === activeRecipe.id) : false;
  const showFloatingTicket = activeRecipe !== null && !isRecipeModalOpen && !isCookModeOpen && !isFloatingTicketDismissed;

  return (
    <div className={`min-h-screen bg-[#F5EEDC] flex flex-col justify-center items-center ${isDesktopFramed ? 'md:p-6 md:bg-checker-subtle' : ''}`}>
      {/* Mobile-first App Container (or Framed on desktop) */}
      <div
        className={`w-full bg-[#FBF5E6] flex flex-col min-h-screen relative transition-all ${
          isDesktopFramed
            ? 'md:max-w-md md:min-h-[820px] md:h-[860px] md:rounded-[2.5rem] md:border-6 md:border-[#2B170C] md:shadow-[10px_12px_0px_#2B170C] md:overflow-hidden'
            : 'max-w-md'
        }`}
      >
        {/* Top Diner Header */}
        <Header
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isDesktopFramed={isDesktopFramed}
          onToggleDesktopFrame={handleToggleDesktopFrame}
          inStockCount={inStockCount}
          expiringCount={expiringCount}
        />

        {/* Content Area with smooth view switching and generous bottom padding */}
        <main className={`flex-1 overflow-y-auto ${showFloatingTicket ? 'pb-40' : 'pb-28'}`}>
          {activeTab === 'spin' && (
            <RouletteSpinner
              pantry={pantry}
              onRecipeGenerated={handleRecipeGenerated}
              onIncrementSpins={handleIncrementSpins}
              onUnlockChaosBadge={handleUnlockChaosBadge}
            />
          )}

          {activeTab === 'pantry' && (
            <FridgePantry
              pantry={pantry}
              onToggleInFridge={handleToggleInFridge}
              onToggleExpiringSoon={handleToggleExpiringSoon}
              onApplyPreset={handleApplyPreset}
              onAddOrUpdateIngredient={handleAddOrUpdateIngredient}
              onDeleteIngredient={handleDeleteIngredient}
            />
          )}

          {activeTab === 'hall_of_fame' && (
            <HallOfFame
              stats={stats}
              favoriteRecipes={favorites}
              onOpenRecipe={recipe => {
                setActiveRecipe(recipe);
                setIsRecipeModalOpen(true);
              }}
              onRemoveFavorite={id => {
                setFavorites(prev => prev.filter(r => r.id !== id));
              }}
            />
          )}
        </main>

        {/* Bottom Diner Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          hasActiveRecipe={showFloatingTicket}
          onOpenActiveRecipe={() => setIsRecipeModalOpen(true)}
          onDismissActiveRecipe={() => setIsFloatingTicketDismissed(true)}
          fridgeCount={inStockCount}
        />

        {/* Recipe Guest Check Modal */}
        {isRecipeModalOpen && activeRecipe && (
          <RecipeModal
            recipe={activeRecipe}
            onClose={() => setIsRecipeModalOpen(false)}
            onStartCookMode={() => {
              setIsRecipeModalOpen(false);
              setIsCookModeOpen(true);
            }}
            onToggleSaveFavorite={handleToggleSaveFavorite}
            isFavorite={isFavorite}
          />
        )}

        {/* Fullscreen Interactive Cook Mode */}
        {isCookModeOpen && activeRecipe && (
          <CookMode
            recipe={activeRecipe}
            onClose={() => setIsCookModeOpen(false)}
            onFinishCooking={handleFinishCooking}
          />
        )}
      </div>
    </div>
  );
}

export default App;
