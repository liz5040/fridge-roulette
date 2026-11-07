export type IngredientCategory =
  | 'protein'
  | 'carb'
  | 'produce'
  | 'flavor'
  | 'dairy'
  | 'spices'
  | 'other';

export type IngredientUnit = 'pieces' | 'grams' | 'kg' | 'ml' | 'litres';

export type StorageLocation = 'fridge' | 'freezer' | 'pantry';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  location: StorageLocation; // 'fridge' (perishable) | 'freezer' (frozen) | 'pantry' (essentials/staples)
  emoji: string;
  quantity: number;
  unit: IngredientUnit;
  inFridge: boolean; // true if available in house
  expiryDate?: string; // Format: 'YYYY-MM-DD'
  expiringSoon?: boolean; // legacy flag / quick toggle
  freshnessDays?: number;
  dinerDesc?: string;
  isPantryEssential?: boolean; // true for staple essentials like salt, oil, spices
}

export const LOCATION_LABELS: Record<StorageLocation, { label: string; emoji: string; shortDesc: string; title: string }> = {
  fridge: { label: 'The Fridge', emoji: '🧊', shortDesc: 'Vegetables, dairy, eggs, paneer & fresh leftovers', title: 'REFRIGERATOR' },
  freezer: { label: 'The Freezer', emoji: '❄️', shortDesc: 'Frozen meats, fish, frozen veggies & snacks', title: 'FREEZER' },
  pantry: { label: 'Pantry Essentials', emoji: '🥫', shortDesc: 'Oils, salt, spices, rice, flour & staples', title: 'PANTRY' },
};

export const CATEGORY_LABELS: Record<IngredientCategory, { label: string; emoji: string }> = {
  protein: { label: 'Protein', emoji: '🥓' },
  carb: { label: 'Carbs', emoji: '🍞' },
  produce: { label: 'Produce', emoji: '🍅' },
  dairy: { label: 'Dairy', emoji: '🧀' },
  flavor: { label: 'Flavor', emoji: '🥣' },
  spices: { label: 'Spices', emoji: '🧂' },
  other: { label: 'Other', emoji: '🥫' },
};

export const UNIT_LABELS: Record<IngredientUnit, { label: string; short: string }> = {
  pieces: { label: 'pieces', short: 'pcs' },
  grams: { label: 'grams', short: 'g' },
  kg: { label: 'kilograms', short: 'kg' },
  ml: { label: 'millilitres', short: 'ml' },
  litres: { label: 'litres', short: 'L' },
};

// Helper: Calculate days offset from today in YYYY-MM-DD format
export function getDateOffset(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export type ExpiryStatus = 'expired' | 'expiring_soon' | 'fresh' | 'none';

export interface ExpiryInfo {
  status: ExpiryStatus;
  daysRemaining?: number;
  label: string;
  badgeClass: string;
}

// Helper: Determine expiry status and formatting
export function getExpiryInfo(item: Ingredient): ExpiryInfo {
  if (item.location === 'pantry' && !item.expiryDate) {
    return {
      status: 'none',
      label: 'Staple',
      badgeClass: 'bg-[#FFF9C4] text-[#827717] border-[#D4E157]',
    };
  }

  if (!item.expiryDate) {
    if (item.expiringSoon) {
      return {
        status: 'expiring_soon',
        daysRemaining: 1,
        label: 'USE SOON!',
        badgeClass: 'bg-[#FFE3E3] text-[#C62828] border-[#E53935] animate-pulse',
      };
    }
    return {
      status: 'none',
      label: 'Fresh',
      badgeClass: 'bg-[#E8F5E9] text-[#2E7D32] border-[#81C784]',
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse YYYY-MM-DD safely in local time
  const [year, month, day] = item.expiryDate.split('-').map(Number);
  const expDate = new Date(year, month - 1, day);
  expDate.setHours(0, 0, 0, 0);

  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: 'expired',
      daysRemaining: diffDays,
      label: `EXPIRED (${Math.abs(diffDays)}d ago)`,
      badgeClass: 'bg-[#B71C1C] text-white border-[#2B170C] font-black shadow-[1px_1px_0px_#2B170C]',
    };
  }

  if (diffDays === 0) {
    return {
      status: 'expiring_soon',
      daysRemaining: 0,
      label: 'EXPIRES TODAY!',
      badgeClass: 'bg-[#FF5252] text-white border-[#2B170C] font-black animate-pulse shadow-[1px_1px_0px_#2B170C]',
    };
  }

  if (diffDays <= 3) {
    return {
      status: 'expiring_soon',
      daysRemaining: diffDays,
      label: diffDays === 1 ? 'Expires in 1 day!' : `Expires in ${diffDays} days!`,
      badgeClass: 'bg-[#FFF9C4] text-[#C62828] border-[#E53935] font-black animate-pulse',
    };
  }

  return {
    status: 'fresh',
    daysRemaining: diffDays,
    label: `${diffDays}d left`,
    badgeClass: 'bg-[#E8F5E9] text-[#2E7D32] border-[#81C784]',
  };
}

export function isItemExpiringSoon(item: Ingredient): boolean {
  const info = getExpiryInfo(item);
  return info.status === 'expiring_soon';
}

export function isItemExpired(item: Ingredient): boolean {
  const info = getExpiryInfo(item);
  return info.status === 'expired';
}

/**
 * INITIAL INVENTORY
 * Strictly categorized into:
 * 1. FRIDGE: vegetables, dairy, eggs, paneer, cheeses, fresh sauces, leftovers
 * 2. FREEZER: meats, fish, frozen veggies, frozen snacks
 * 3. PANTRY ESSENTIALS: salt, oil, basic spices, seasonings, sugar, flour, rice, pasta
 */
export const INITIAL_INGREDIENTS: Ingredient[] = [
  // ==========================================
  // 1. THE FRIDGE (Perishable & Fresh)
  // ==========================================
  {
    id: 'paneer',
    name: 'Fresh Malai Paneer',
    category: 'protein',
    location: 'fridge',
    emoji: '🧀',
    quantity: 250,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(4),
    freshnessDays: 5,
    dinerDesc: 'Soft, creamy cubes ready to sizzle and soak up masala',
  },
  {
    id: 'eggs',
    name: 'Farm Fresh Eggs',
    category: 'protein',
    location: 'fridge',
    emoji: '🍳',
    quantity: 8,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(7),
    freshnessDays: 7,
    dinerDesc: 'Sunny side up, scrambled, or poached',
  },
  {
    id: 'tofu',
    name: 'Crispy Pressed Tofu',
    category: 'protein',
    location: 'fridge',
    emoji: '🧈',
    quantity: 1,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(5),
    freshnessDays: 6,
    dinerDesc: 'Soaks up grill marinades like magic',
  },
  {
    id: 'sourdough',
    name: 'Sourdough Bread',
    category: 'carb',
    location: 'fridge',
    emoji: '🍞',
    quantity: 6,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(2), // Expiring soon
    expiringSoon: true,
    freshnessDays: 3,
    dinerDesc: 'Golden buttery griddle crunch',
  },
  {
    id: 'dosa_batter',
    name: 'Fermented Dosa Batter',
    category: 'carb',
    location: 'fridge',
    emoji: '🥞',
    quantity: 500,
    unit: 'ml',
    inFridge: true,
    expiryDate: getDateOffset(3),
    freshnessDays: 4,
    dinerDesc: 'Fermented batter for paper-thin golden dosas',
  },
  {
    id: 'appam',
    name: 'Kerala Palappam',
    category: 'carb',
    location: 'fridge',
    emoji: '🫓',
    quantity: 4,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(2),
    freshnessDays: 2,
    dinerDesc: 'Lacy, soft fermented rice pancakes',
  },
  {
    id: 'buns',
    name: 'Brioche Buns',
    category: 'carb',
    location: 'fridge',
    emoji: '🍔',
    quantity: 4,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(4),
    freshnessDays: 4,
    dinerDesc: 'Toasted till glossy and golden',
  },
  {
    id: 'tortillas',
    name: 'Flour Tortillas',
    category: 'carb',
    location: 'fridge',
    emoji: '🫓',
    quantity: 6,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(8),
    freshnessDays: 8,
    dinerDesc: 'Pliable wrap for melts & tacos',
  },
  {
    id: 'potatoes',
    name: 'Russet Potatoes',
    category: 'carb',
    location: 'fridge',
    emoji: '🥔',
    quantity: 4,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(10),
    freshnessDays: 10,
    dinerDesc: 'Diner hashbrowns or crispy home fries',
  },
  {
    id: 'tomatoes',
    name: 'Vine Ripe Tomatoes',
    category: 'produce',
    location: 'fridge',
    emoji: '🍅',
    quantity: 3,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(1), // Expiring soon (1 day)
    expiringSoon: true,
    freshnessDays: 2,
    dinerDesc: 'Juicy thick slices with flaky salt',
  },
  {
    id: 'onions',
    name: 'Sweet Yellow Onion',
    category: 'produce',
    location: 'fridge',
    emoji: '🧅',
    quantity: 2,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(9),
    freshnessDays: 9,
    dinerDesc: 'Caramelized until rich mahogany',
  },
  {
    id: 'peppers',
    name: 'Green Capsicum',
    category: 'produce',
    location: 'fridge',
    emoji: '🫑',
    quantity: 2,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(4),
    freshnessDays: 4,
    dinerDesc: 'Fajita style griddled strips',
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower Florets',
    category: 'produce',
    location: 'fridge',
    emoji: '🥦',
    quantity: 1,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(4),
    freshnessDays: 5,
    dinerDesc: 'Crunchy florets for spiced gobi roasts and pulao',
  },
  {
    id: 'curry_leaves',
    name: 'Curry Leaves',
    category: 'produce',
    location: 'fridge',
    emoji: '🍃',
    quantity: 1,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(7),
    freshnessDays: 10,
    dinerDesc: 'Aromatic emerald sprigs for crackling tadka',
  },
  {
    id: 'coriander',
    name: 'Fresh Coriander',
    category: 'produce',
    location: 'fridge',
    emoji: '🌿',
    quantity: 1,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(3),
    freshnessDays: 4,
    dinerDesc: 'Fragrant cilantro garnish for bright citrus kick',
  },
  {
    id: 'spinach',
    name: 'Baby Spinach',
    category: 'produce',
    location: 'fridge',
    emoji: '🥗',
    quantity: 150,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(1), // Expiring soon (1 day)
    expiringSoon: true,
    freshnessDays: 1,
    dinerDesc: 'Quick-wilts into cheesy goodness',
  },
  {
    id: 'mushrooms',
    name: 'Button Mushrooms',
    category: 'produce',
    location: 'fridge',
    emoji: '🍄',
    quantity: 200,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(3),
    freshnessDays: 3,
    dinerDesc: 'Buttery sautéed skillet toppers',
  },
  {
    id: 'avocado',
    name: 'Hass Avocado',
    category: 'produce',
    location: 'fridge',
    emoji: '🥑',
    quantity: 2,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(2), // Expiring soon (2 days)
    freshnessDays: 2,
    dinerDesc: 'Creamy slices for retro melts',
  },
  {
    id: 'lettuce',
    name: 'Crispy Iceberg',
    category: 'produce',
    location: 'fridge',
    emoji: '🥬',
    quantity: 1,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(5),
    freshnessDays: 5,
    dinerDesc: 'Signature cool diner crunch',
  },
  {
    id: 'coconut',
    name: 'Grated Coconut',
    category: 'produce',
    location: 'fridge',
    emoji: '🥥',
    quantity: 200,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(4),
    freshnessDays: 5,
    dinerDesc: 'Sweet coconut for Kerala stews & coconut milk',
  },
  {
    id: 'cheddar',
    name: 'Sharp Cheddar',
    category: 'dairy',
    location: 'fridge',
    emoji: '🧀',
    quantity: 200,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(12),
    freshnessDays: 12,
    dinerDesc: 'Ultra-gooey melt with a sharp bite',
  },
  {
    id: 'butter',
    name: 'Salted Butter',
    category: 'dairy',
    location: 'fridge',
    emoji: '🧈',
    quantity: 150,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(20),
    freshnessDays: 20,
    dinerDesc: 'The secret to golden diner toast',
  },
  {
    id: 'american_cheese',
    name: 'Classic American Melter',
    category: 'dairy',
    location: 'fridge',
    emoji: '🧀',
    quantity: 6,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(18),
    freshnessDays: 18,
    dinerDesc: 'The unrivaled master of meltiness',
  },
  {
    id: 'special_sauce',
    name: 'Chef Special Sauce',
    category: 'flavor',
    location: 'fridge',
    emoji: '🥣',
    quantity: 200,
    unit: 'ml',
    inFridge: true,
    expiryDate: getDateOffset(10),
    freshnessDays: 10,
    dinerDesc: 'Mayo, relish, ketchup & secret spices',
  },
  {
    id: 'pickles',
    name: 'Dill Pickle Spears',
    category: 'produce',
    location: 'fridge',
    emoji: '🥒',
    quantity: 6,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(30),
    freshnessDays: 30,
    dinerDesc: 'Tangy, briny, mouthwatering bite',
  },

  // ==========================================
  // 2. THE FREEZER (Frozen Meats, Seafood & Snacks)
  // ==========================================
  {
    id: 'beef',
    name: 'Ground Beef Patty',
    category: 'protein',
    location: 'freezer',
    emoji: '🥩',
    quantity: 2,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(20),
    freshnessDays: 30,
    dinerDesc: 'Ready for a classic smash burger',
  },
  {
    id: 'bacon',
    name: 'Thick-Cut Bacon',
    category: 'protein',
    location: 'freezer',
    emoji: '🥓',
    quantity: 6,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(25),
    freshnessDays: 30,
    dinerDesc: 'Smoky, sizzling griddle hero',
  },
  {
    id: 'chicken',
    name: 'Chicken Breast Fillets',
    category: 'protein',
    location: 'freezer',
    emoji: '🍗',
    quantity: 300,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(20),
    freshnessDays: 30,
    dinerDesc: 'Versatile lean protein for stir-fries & curries',
  },
  {
    id: 'fish',
    name: 'White Fish Fillets',
    category: 'protein',
    location: 'freezer',
    emoji: '🐟',
    quantity: 2,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(30),
    freshnessDays: 45,
    dinerDesc: 'Tender fillets for Kerala tawa fry or fish burgers',
  },
  {
    id: 'sausage',
    name: 'Breakfast Sausage',
    category: 'protein',
    location: 'freezer',
    emoji: '🌭',
    quantity: 4,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(25),
    freshnessDays: 30,
    dinerDesc: 'Sage and pepper seasoned links',
  },
  {
    id: 'green_peas',
    name: 'Frozen Green Peas',
    category: 'produce',
    location: 'freezer',
    emoji: '🟢',
    quantity: 300,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(60),
    freshnessDays: 90,
    dinerDesc: 'Sweet tender peas for pulao & curries',
  },
  {
    id: 'waffles',
    name: 'Homestyle Waffles',
    category: 'carb',
    location: 'freezer',
    emoji: '🧇',
    quantity: 4,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(30),
    freshnessDays: 45,
    dinerDesc: 'Deep pockets for butter & syrup',
  },

  // ==========================================
  // 3. PANTRY ESSENTIALS (Pre-populated Staples)
  // ==========================================
  {
    id: 'cooking_oil',
    name: 'Cooking Oil',
    category: 'flavor',
    location: 'pantry',
    emoji: '🫗',
    quantity: 500,
    unit: 'ml',
    inFridge: true,
    isPantryEssential: true,
    dinerDesc: 'Everyday neutral cooking oil',
  },
  {
    id: 'salt_pepper',
    name: 'Salt & Black Pepper',
    category: 'spices',
    location: 'pantry',
    emoji: '🧂',
    quantity: 200,
    unit: 'grams',
    inFridge: true,
    isPantryEssential: true,
    dinerDesc: 'The universal seasoning duo',
  },
  {
    id: 'ghee',
    name: 'Pure Desi Ghee',
    category: 'dairy',
    location: 'pantry',
    emoji: '🧈',
    quantity: 200,
    unit: 'grams',
    inFridge: true,
    isPantryEssential: true,
    expiryDate: getDateOffset(90),
    freshnessDays: 90,
    dinerDesc: 'Nutty golden clarified butter for authentic aroma',
  },
  {
    id: 'rice',
    name: 'Basmati Rice',
    category: 'carb',
    location: 'pantry',
    emoji: '🍚',
    quantity: 1000,
    unit: 'grams',
    inFridge: true,
    isPantryEssential: true,
    expiryDate: getDateOffset(180),
    freshnessDays: 180,
    dinerDesc: 'Aromatic long-grain rice for pulao, lemon rice & bowls',
  },
  {
    id: 'pasta',
    name: 'Macaroni Pasta',
    category: 'carb',
    location: 'pantry',
    emoji: '🍝',
    quantity: 500,
    unit: 'grams',
    inFridge: true,
    isPantryEssential: true,
    expiryDate: getDateOffset(180),
    freshnessDays: 180,
    dinerDesc: 'Comfort food in a skillet',
  },
  {
    id: 'flour',
    name: 'All-Purpose Flour',
    category: 'carb',
    location: 'pantry',
    emoji: '🌾',
    quantity: 500,
    unit: 'grams',
    inFridge: true,
    isPantryEssential: true,
    dinerDesc: 'For batters, roux & crisp coatings',
  },
  {
    id: 'garam_masala',
    name: 'Garam Masala Blend',
    category: 'spices',
    location: 'pantry',
    emoji: '🧂',
    quantity: 100,
    unit: 'grams',
    inFridge: true,
    isPantryEssential: true,
    expiryDate: getDateOffset(180),
    freshnessDays: 180,
    dinerDesc: 'Aromatic cinnamon, cloves, cardamom & cumin',
  },
  {
    id: 'turmeric_cumin',
    name: 'Turmeric & Cumin Seeds',
    category: 'spices',
    location: 'pantry',
    emoji: '🟡',
    quantity: 150,
    unit: 'grams',
    inFridge: true,
    isPantryEssential: true,
    expiryDate: getDateOffset(180),
    freshnessDays: 180,
    dinerDesc: 'Golden color and earthy aroma for tadka',
  },
  {
    id: 'sugar_honey',
    name: 'Sugar / Honey',
    category: 'flavor',
    location: 'pantry',
    emoji: '🍯',
    quantity: 250,
    unit: 'grams',
    inFridge: true,
    isPantryEssential: true,
    dinerDesc: 'For balancing tomato acidity & sweet glazes',
  },
  {
    id: 'hotsauce',
    name: 'Diner Hot Sauce',
    category: 'spices',
    location: 'pantry',
    emoji: '🌶️',
    quantity: 150,
    unit: 'ml',
    inFridge: true,
    isPantryEssential: true,
    expiryDate: getDateOffset(60),
    freshnessDays: 60,
    dinerDesc: 'Vinegary kick of heat',
  },
  {
    id: 'beans',
    name: 'Black Beans / Chickpeas',
    category: 'protein',
    location: 'pantry',
    emoji: '🫘',
    quantity: 400,
    unit: 'grams',
    inFridge: true,
    isPantryEssential: true,
    expiryDate: getDateOffset(180),
    freshnessDays: 180,
    dinerDesc: 'Hearty shelf-stable protein',
  },
  {
    id: 'tuna',
    name: 'Canned Tuna',
    category: 'protein',
    location: 'pantry',
    emoji: '🐟',
    quantity: 2,
    unit: 'pieces',
    inFridge: true,
    isPantryEssential: true,
    expiryDate: getDateOffset(180),
    freshnessDays: 180,
    dinerDesc: 'The retro diner tuna melt staple',
  },
];

export interface PresetStockItem {
  id: string;
  name: string;
  category: IngredientCategory;
  location: StorageLocation;
  emoji: string;
  quantity: number;
  unit: IngredientUnit;
  dinerDesc: string;
  expiryOffsetDays: number;
}

export interface PantryPreset {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  items: PresetStockItem[];
}

export const PANTRY_PRESETS: PantryPreset[] = [
  {
    id: 'classic_diner',
    name: 'Classic Diner 1955',
    emoji: '🍳',
    desc: 'Bacon, eggs, toast, hashbrowns & sharp cheese',
    items: [
      { id: 'bacon', name: 'Thick-Cut Bacon', category: 'protein', location: 'freezer', emoji: '🥓', quantity: 6, unit: 'pieces', dinerDesc: 'Smoky, sizzling griddle hero', expiryOffsetDays: 25 },
      { id: 'eggs', name: 'Farm Fresh Eggs', category: 'protein', location: 'fridge', emoji: '🍳', quantity: 8, unit: 'pieces', dinerDesc: 'Sunny side up, scrambled, or poached', expiryOffsetDays: 7 },
      { id: 'sourdough', name: 'Sourdough Bread', category: 'carb', location: 'fridge', emoji: '🍞', quantity: 6, unit: 'pieces', dinerDesc: 'Golden buttery griddle crunch', expiryOffsetDays: 4 },
      { id: 'potatoes', name: 'Russet Potatoes', category: 'carb', location: 'fridge', emoji: '🥔', quantity: 4, unit: 'pieces', dinerDesc: 'Diner hashbrowns or crispy home fries', expiryOffsetDays: 10 },
      { id: 'tomatoes', name: 'Vine Ripe Tomatoes', category: 'produce', location: 'fridge', emoji: '🍅', quantity: 3, unit: 'pieces', dinerDesc: 'Juicy thick slices with flaky salt', expiryOffsetDays: 3 },
      { id: 'cheddar', name: 'Sharp Cheddar', category: 'dairy', location: 'fridge', emoji: '🧀', quantity: 200, unit: 'grams', dinerDesc: 'Ultra-gooey melt with a sharp bite', expiryOffsetDays: 12 },
      { id: 'butter', name: 'Salted Butter', category: 'dairy', location: 'fridge', emoji: '🧈', quantity: 150, unit: 'grams', dinerDesc: 'The secret to golden diner toast', expiryOffsetDays: 20 },
      { id: 'pickles', name: 'Dill Pickle Spears', category: 'produce', location: 'fridge', emoji: '🥒', quantity: 6, unit: 'pieces', dinerDesc: 'Tangy, briny, mouthwatering bite', expiryOffsetDays: 30 },
    ],
  },
  {
    id: 'midnight_munchies',
    name: 'Midnight Melts',
    emoji: '🌙',
    desc: 'Quick, gooey comfort food for late night hunger',
    items: [
      { id: 'beef', name: 'Ground Beef Patty', category: 'protein', location: 'freezer', emoji: '🥩', quantity: 2, unit: 'pieces', dinerDesc: 'Ready for a classic smash burger', expiryOffsetDays: 20 },
      { id: 'buns', name: 'Brioche Buns', category: 'carb', location: 'fridge', emoji: '🍔', quantity: 4, unit: 'pieces', dinerDesc: 'Toasted till glossy and golden', expiryOffsetDays: 4 },
      { id: 'tortillas', name: 'Flour Tortillas', category: 'carb', location: 'fridge', emoji: '🫓', quantity: 6, unit: 'pieces', dinerDesc: 'Pliable wrap for melts & tacos', expiryOffsetDays: 8 },
      { id: 'onions', name: 'Sweet Yellow Onion', category: 'produce', location: 'fridge', emoji: '🧅', quantity: 2, unit: 'pieces', dinerDesc: 'Caramelized until rich mahogany', expiryOffsetDays: 9 },
      { id: 'pickles', name: 'Dill Pickle Spears', category: 'produce', location: 'fridge', emoji: '🥒', quantity: 4, unit: 'pieces', dinerDesc: 'Tangy, briny, mouthwatering bite', expiryOffsetDays: 30 },
      { id: 'cheddar', name: 'Sharp Cheddar', category: 'dairy', location: 'fridge', emoji: '🧀', quantity: 150, unit: 'grams', dinerDesc: 'Ultra-gooey melt with a sharp bite', expiryOffsetDays: 12 },
      { id: 'american_cheese', name: 'Classic American Melter', category: 'dairy', location: 'fridge', emoji: '🧀', quantity: 6, unit: 'pieces', dinerDesc: 'The unrivaled master of meltiness', expiryOffsetDays: 18 },
      { id: 'special_sauce', name: 'Chef Special Sauce', category: 'flavor', location: 'fridge', emoji: '🥣', quantity: 200, unit: 'ml', dinerDesc: 'Mayo, relish, ketchup & secret spices', expiryOffsetDays: 10 },
      { id: 'hotsauce', name: 'Diner Hot Sauce', category: 'spices', location: 'pantry', emoji: '🌶️', quantity: 150, unit: 'ml', dinerDesc: 'Vinegary kick of heat', expiryOffsetDays: 60 },
    ],
  },
  {
    id: 'clean_the_fridge',
    name: 'Zero Waste Sweep',
    emoji: '🧹',
    desc: 'Puts expiring perishable items front and center',
    items: [
      { id: 'eggs', name: 'Farm Fresh Eggs', category: 'protein', location: 'fridge', emoji: '🍳', quantity: 4, unit: 'pieces', dinerDesc: 'Sunny side up, scrambled, or poached', expiryOffsetDays: 1 },
      { id: 'beef', name: 'Ground Beef Patty', category: 'protein', location: 'freezer', emoji: '🥩', quantity: 2, unit: 'pieces', dinerDesc: 'Ready for a classic smash burger', expiryOffsetDays: 2 },
      { id: 'spinach', name: 'Baby Spinach', category: 'produce', location: 'fridge', emoji: '🥗', quantity: 150, unit: 'grams', dinerDesc: 'Quick-wilts into cheesy goodness', expiryOffsetDays: 1 },
      { id: 'tomatoes', name: 'Vine Ripe Tomatoes', category: 'produce', location: 'fridge', emoji: '🍅', quantity: 2, unit: 'pieces', dinerDesc: 'Juicy thick slices with flaky salt', expiryOffsetDays: 2 },
      { id: 'sourdough', name: 'Sourdough Bread', category: 'carb', location: 'fridge', emoji: '🍞', quantity: 4, unit: 'pieces', dinerDesc: 'Golden buttery griddle crunch', expiryOffsetDays: 2 },
      { id: 'butter', name: 'Salted Butter', category: 'dairy', location: 'fridge', emoji: '🧈', quantity: 100, unit: 'grams', dinerDesc: 'The secret to golden diner toast', expiryOffsetDays: 15 },
      { id: 'cheddar', name: 'Sharp Cheddar', category: 'dairy', location: 'fridge', emoji: '🧀', quantity: 120, unit: 'grams', dinerDesc: 'Ultra-gooey melt with a sharp bite', expiryOffsetDays: 3 },
      { id: 'onions', name: 'Sweet Yellow Onion', category: 'produce', location: 'fridge', emoji: '🧅', quantity: 1, unit: 'pieces', dinerDesc: 'Caramelized until rich mahogany', expiryOffsetDays: 7 },
    ],
  },
  {
    id: 'desi_diner_express',
    name: 'Desi Diner Spice Box',
    emoji: '🌶️',
    desc: 'Paneer, curry leaves, basmati rice, cauliflower, capsicum & aromatics',
    items: [
      { id: 'paneer', name: 'Fresh Malai Paneer', category: 'protein', location: 'fridge', emoji: '🧀', quantity: 250, unit: 'grams', dinerDesc: 'Soft creamy cubes ready for the griddle', expiryOffsetDays: 4 },
      { id: 'eggs', name: 'Farm Fresh Eggs', category: 'protein', location: 'fridge', emoji: '🍳', quantity: 6, unit: 'pieces', dinerDesc: 'For masala omelettes & egg roast', expiryOffsetDays: 7 },
      { id: 'rice', name: 'Basmati Rice', category: 'carb', location: 'pantry', emoji: '🍚', quantity: 500, unit: 'grams', dinerDesc: 'Long-grain rice for fragrant pulao & lemon rice', expiryOffsetDays: 180 },
      { id: 'dosa_batter', name: 'Fermented Dosa Batter', category: 'carb', location: 'fridge', emoji: '🥞', quantity: 500, unit: 'ml', dinerDesc: 'Paper-thin golden dosas', expiryOffsetDays: 4 },
      { id: 'cauliflower', name: 'Cauliflower Florets', category: 'produce', location: 'fridge', emoji: '🥦', quantity: 1, unit: 'pieces', dinerDesc: 'For spicy aloo gobi & pulao', expiryOffsetDays: 4 },
      { id: 'curry_leaves', name: 'Curry Leaves', category: 'produce', location: 'fridge', emoji: '🍃', quantity: 1, unit: 'pieces', dinerDesc: 'Aromatic emerald sprigs for crackling tadka', expiryOffsetDays: 8 },
      { id: 'coriander', name: 'Fresh Coriander', category: 'produce', location: 'fridge', emoji: '🌿', quantity: 1, unit: 'pieces', dinerDesc: 'Fresh citrus herb garnish', expiryOffsetDays: 3 },
      { id: 'peppers', name: 'Green Capsicum', category: 'produce', location: 'fridge', emoji: '🫑', quantity: 2, unit: 'pieces', dinerDesc: 'Crunchy bell pepper for stir-fries', expiryOffsetDays: 5 },
      { id: 'tomatoes', name: 'Vine Ripe Tomatoes', category: 'produce', location: 'fridge', emoji: '🍅', quantity: 3, unit: 'pieces', dinerDesc: 'Juicy base for curries and gravies', expiryOffsetDays: 3 },
      { id: 'onions', name: 'Sweet Yellow Onion', category: 'produce', location: 'fridge', emoji: '🧅', quantity: 2, unit: 'pieces', dinerDesc: 'Slowly caramelized for rich base', expiryOffsetDays: 9 },
      { id: 'ghee', name: 'Pure Desi Ghee', category: 'dairy', location: 'pantry', emoji: '🧈', quantity: 200, unit: 'grams', dinerDesc: 'Nutty clarified butter', expiryOffsetDays: 90 },
      { id: 'garam_masala', name: 'Garam Masala Blend', category: 'spices', location: 'pantry', emoji: '🧂', quantity: 100, unit: 'grams', dinerDesc: 'Warm aromatic spices', expiryOffsetDays: 180 },
    ],
  },
];

export const CHAOS_TWISTS = [
  '🔥 Diner Rule: Everything must get a crispy griddle crust!',
  '🧈 Short Order Secret: Butter both sides of the bread before cooking!',
  '🍳 Sunny Side Bonus: Top the entire dish with a runny fried egg!',
  '🧀 Double Melt Hazard: Add a blanket of melted cheese over everything!',
  '🌶️ Fire Alarm: Add a splash of hot sauce to the skillet!',
  '🧇 Waffle Iron Hack: Press the entire sandwich in a waffle maker or panini press!',
  '🧅 Diner Special: Caramelize the onions until golden brown first!',
];
