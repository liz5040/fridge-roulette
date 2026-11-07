export type IngredientCategory =
  | 'protein'
  | 'carb'
  | 'produce'
  | 'flavor'
  | 'dairy'
  | 'spices'
  | 'other';

export type IngredientUnit = 'pieces' | 'grams' | 'kg' | 'ml' | 'litres';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  emoji: string;
  quantity: number;
  unit: IngredientUnit;
  inFridge: boolean;
  expiryDate?: string; // Format: 'YYYY-MM-DD'
  expiringSoon?: boolean; // legacy flag / quick toggle
  freshnessDays?: number;
  dinerDesc?: string;
}

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

export const INITIAL_INGREDIENTS: Ingredient[] = [
  // --- PROTEINS ---
  {
    id: 'paneer',
    name: 'Fresh Malai Paneer',
    category: 'protein',
    emoji: '🧀',
    quantity: 250,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(4),
    freshnessDays: 5,
    dinerDesc: 'Soft, creamy cubes ready to sizzle and soak up masala',
  },
  {
    id: 'bacon',
    name: 'Thick-Cut Bacon',
    category: 'protein',
    emoji: '🥓',
    quantity: 6,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(4),
    freshnessDays: 4,
    dinerDesc: 'Smoky, sizzling griddle hero',
  },
  {
    id: 'eggs',
    name: 'Farm Fresh Eggs',
    category: 'protein',
    emoji: '🍳',
    quantity: 8,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(7),
    freshnessDays: 7,
    dinerDesc: 'Sunny side up, scrambled, or poached',
  },
  {
    id: 'beef',
    name: 'Ground Beef Patty',
    category: 'protein',
    emoji: '🥩',
    quantity: 2,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(2), // Expiring soon (within 3 days)
    expiringSoon: true,
    freshnessDays: 2,
    dinerDesc: 'Ready for a classic smash burger',
  },
  {
    id: 'tofu',
    name: 'Crispy Pressed Tofu',
    category: 'protein',
    emoji: '🧈',
    quantity: 1,
    unit: 'pieces',
    inFridge: false,
    expiryDate: getDateOffset(6),
    freshnessDays: 6,
    dinerDesc: 'Soaks up grill marinades like magic',
  },
  {
    id: 'chicken',
    name: 'Roasted Chicken',
    category: 'protein',
    emoji: '🍗',
    quantity: 300,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(3), // Expiring soon (within 3 days)
    freshnessDays: 3,
    dinerDesc: 'Shredded rotisserie leftover gold',
  },
  {
    id: 'tuna',
    name: 'Canned Tuna',
    category: 'protein',
    emoji: '🐟',
    quantity: 2,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(60),
    freshnessDays: 90,
    dinerDesc: 'The retro diner tuna melt kingpin',
  },
  {
    id: 'sausage',
    name: 'Breakfast Sausage',
    category: 'protein',
    emoji: '🌭',
    quantity: 4,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(5),
    freshnessDays: 4,
    dinerDesc: 'Sage and pepper seasoned links',
  },
  {
    id: 'beans',
    name: 'Black Beans',
    category: 'protein',
    emoji: '🫘',
    quantity: 400,
    unit: 'grams',
    inFridge: false,
    expiryDate: getDateOffset(30),
    freshnessDays: 14,
    dinerDesc: 'Hearty protein boost',
  },

  // --- CARBS & BASES ---
  {
    id: 'dosa_batter',
    name: 'Fermented Dosa Batter',
    category: 'carb',
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
    emoji: '🫓',
    quantity: 4,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(2),
    freshnessDays: 2,
    dinerDesc: 'Lacy, soft fermented rice pancakes',
  },
  {
    id: 'sourdough',
    name: 'Sourdough Bread',
    category: 'carb',
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
    id: 'buns',
    name: 'Brioche Buns',
    category: 'carb',
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
    emoji: '🥔',
    quantity: 4,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(10),
    freshnessDays: 10,
    dinerDesc: 'Diner hashbrowns or crispy home fries',
  },
  {
    id: 'waffles',
    name: 'Homestyle Waffles',
    category: 'carb',
    emoji: '🧇',
    quantity: 4,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(14),
    freshnessDays: 14,
    dinerDesc: 'Deep pockets for butter & syrup',
  },
  {
    id: 'pasta',
    name: 'Macaroni Elbows',
    category: 'carb',
    emoji: '🍜',
    quantity: 500,
    unit: 'grams',
    inFridge: false,
    expiryDate: getDateOffset(90),
    freshnessDays: 60,
    dinerDesc: 'Comfort food in a skillet',
  },
  {
    id: 'rice',
    name: 'Jasmine Rice',
    category: 'carb',
    emoji: '🍚',
    quantity: 500,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(5),
    freshnessDays: 4,
    dinerDesc: 'Fluffy base for savory skillet bowls',
  },
  {
    id: 'bagel',
    name: 'Everything Bagel',
    category: 'carb',
    emoji: '🥯',
    quantity: 2,
    unit: 'pieces',
    inFridge: false,
    expiryDate: getDateOffset(3),
    freshnessDays: 3,
    dinerDesc: 'Toasted diner staple',
  },

  // --- PRODUCE & CRUNCH ---
  {
    id: 'cauliflower',
    name: 'Cauliflower Florets',
    category: 'produce',
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
    emoji: '🌿',
    quantity: 1,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(3),
    freshnessDays: 4,
    dinerDesc: 'Fragrant cilantro garnish for bright citrus kick',
  },
  {
    id: 'coconut',
    name: 'Grated Coconut',
    category: 'produce',
    emoji: '🥥',
    quantity: 200,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(4),
    freshnessDays: 5,
    dinerDesc: 'Sweet coconut for Kerala stews & coconut milk',
  },
  {
    id: 'tomatoes',
    name: 'Vine Ripe Tomatoes',
    category: 'produce',
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
    id: 'lettuce',
    name: 'Crispy Iceberg',
    category: 'produce',
    emoji: '🥬',
    quantity: 1,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(5),
    freshnessDays: 5,
    dinerDesc: 'Signature cool diner crunch',
  },
  {
    id: 'onions',
    name: 'Sweet Yellow Onion',
    category: 'produce',
    emoji: '🧅',
    quantity: 2,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(9),
    freshnessDays: 9,
    dinerDesc: 'Caramelized until rich mahogany',
  },
  {
    id: 'pickles',
    name: 'Dill Pickle Spears',
    category: 'produce',
    emoji: '🥒',
    quantity: 6,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(30),
    freshnessDays: 30,
    dinerDesc: 'Tangy, briny, mouthwatering bite',
  },
  {
    id: 'peppers',
    name: 'Bell Peppers',
    category: 'produce',
    emoji: '🫑',
    quantity: 2,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(4),
    freshnessDays: 4,
    dinerDesc: 'Fajita style griddled strips',
  },
  {
    id: 'mushrooms',
    name: 'Button Mushrooms',
    category: 'produce',
    emoji: '🍄',
    quantity: 200,
    unit: 'grams',
    inFridge: false,
    expiryDate: getDateOffset(3),
    freshnessDays: 3,
    dinerDesc: 'Buttery sautéed skillet toppers',
  },
  {
    id: 'spinach',
    name: 'Baby Spinach',
    category: 'produce',
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
    id: 'avocado',
    name: 'Hass Avocado',
    category: 'produce',
    emoji: '🥑',
    quantity: 2,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(2), // Expiring soon (2 days)
    freshnessDays: 2,
    dinerDesc: 'Creamy slices for retro melts',
  },

  // --- DAIRY & MELTERS ---
  {
    id: 'ghee',
    name: 'Pure Desi Ghee',
    category: 'dairy',
    emoji: '🧈',
    quantity: 200,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(90),
    freshnessDays: 90,
    dinerDesc: 'Nutty golden clarified butter for that authentic aroma',
  },
  {
    id: 'cheddar',
    name: 'Sharp Cheddar',
    category: 'dairy',
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
    emoji: '🧀',
    quantity: 6,
    unit: 'pieces',
    inFridge: true,
    expiryDate: getDateOffset(18),
    freshnessDays: 18,
    dinerDesc: 'The unrivaled master of meltiness',
  },

  // --- FLAVORS & SAUCES ---
  {
    id: 'special_sauce',
    name: 'Chef Special Sauce',
    category: 'flavor',
    emoji: '🥣',
    quantity: 200,
    unit: 'ml',
    inFridge: true,
    expiryDate: getDateOffset(10),
    freshnessDays: 10,
    dinerDesc: 'Mayo, relish, ketchup & secret spices',
  },
  {
    id: 'maple',
    name: 'Pure Maple Syrup',
    category: 'flavor',
    emoji: '🍁',
    quantity: 250,
    unit: 'ml',
    inFridge: true,
    expiryDate: getDateOffset(45),
    freshnessDays: 45,
    dinerDesc: 'Sweet amber drizzle',
  },
  {
    id: 'bbq',
    name: 'Smoky BBQ Glaze',
    category: 'flavor',
    emoji: '🍯',
    quantity: 250,
    unit: 'ml',
    inFridge: false,
    expiryDate: getDateOffset(40),
    freshnessDays: 40,
    dinerDesc: 'Sweet and hickory-kissed',
  },

  // --- SPICES & CONDIMENTS ---
  {
    id: 'garam_masala',
    name: 'Garam Masala Blend',
    category: 'spices',
    emoji: '🧂',
    quantity: 100,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(180),
    freshnessDays: 180,
    dinerDesc: 'Aromatic cinnamon, cloves, cardamom & cumin',
  },
  {
    id: 'hotsauce',
    name: 'Diner Hot Sauce',
    category: 'spices',
    emoji: '🌶️',
    quantity: 150,
    unit: 'ml',
    inFridge: true,
    expiryDate: getDateOffset(60),
    freshnessDays: 60,
    dinerDesc: 'Vinegary kick of heat',
  },
  {
    id: 'garlic_herb',
    name: 'Garlic Herb Spread',
    category: 'spices',
    emoji: '🧄',
    quantity: 80,
    unit: 'grams',
    inFridge: true,
    expiryDate: getDateOffset(15),
    freshnessDays: 15,
    dinerDesc: 'Savory aroma that fills the room',
  },
];

export interface PresetStockItem {
  id: string;
  name: string;
  category: IngredientCategory;
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
      { id: 'bacon', name: 'Thick-Cut Bacon', category: 'protein', emoji: '🥓', quantity: 6, unit: 'pieces', dinerDesc: 'Smoky, sizzling griddle hero', expiryOffsetDays: 4 },
      { id: 'eggs', name: 'Farm Fresh Eggs', category: 'protein', emoji: '🍳', quantity: 8, unit: 'pieces', dinerDesc: 'Sunny side up, scrambled, or poached', expiryOffsetDays: 7 },
      { id: 'sourdough', name: 'Sourdough Bread', category: 'carb', emoji: '🍞', quantity: 6, unit: 'pieces', dinerDesc: 'Golden buttery griddle crunch', expiryOffsetDays: 4 },
      { id: 'potatoes', name: 'Russet Potatoes', category: 'carb', emoji: '🥔', quantity: 4, unit: 'pieces', dinerDesc: 'Diner hashbrowns or crispy home fries', expiryOffsetDays: 10 },
      { id: 'tomatoes', name: 'Vine Ripe Tomatoes', category: 'produce', emoji: '🍅', quantity: 3, unit: 'pieces', dinerDesc: 'Juicy thick slices with flaky salt', expiryOffsetDays: 3 },
      { id: 'cheddar', name: 'Sharp Cheddar', category: 'dairy', emoji: '🧀', quantity: 200, unit: 'grams', dinerDesc: 'Ultra-gooey melt with a sharp bite', expiryOffsetDays: 12 },
      { id: 'butter', name: 'Salted Butter', category: 'dairy', emoji: '🧈', quantity: 150, unit: 'grams', dinerDesc: 'The secret to golden diner toast', expiryOffsetDays: 20 },
      { id: 'pickles', name: 'Dill Pickle Spears', category: 'produce', emoji: '🥒', quantity: 6, unit: 'pieces', dinerDesc: 'Tangy, briny, mouthwatering bite', expiryOffsetDays: 30 },
    ],
  },
  {
    id: 'midnight_munchies',
    name: 'Midnight Melts',
    emoji: '🌙',
    desc: 'Quick, gooey comfort food for late night hunger',
    items: [
      { id: 'beef', name: 'Ground Beef Patty', category: 'protein', emoji: '🥩', quantity: 2, unit: 'pieces', dinerDesc: 'Ready for a classic smash burger', expiryOffsetDays: 3 },
      { id: 'buns', name: 'Brioche Buns', category: 'carb', emoji: '🍔', quantity: 4, unit: 'pieces', dinerDesc: 'Toasted till glossy and golden', expiryOffsetDays: 4 },
      { id: 'tortillas', name: 'Flour Tortillas', category: 'carb', emoji: '🫓', quantity: 6, unit: 'pieces', dinerDesc: 'Pliable wrap for melts & tacos', expiryOffsetDays: 8 },
      { id: 'onions', name: 'Sweet Yellow Onion', category: 'produce', emoji: '🧅', quantity: 2, unit: 'pieces', dinerDesc: 'Caramelized until rich mahogany', expiryOffsetDays: 9 },
      { id: 'pickles', name: 'Dill Pickle Spears', category: 'produce', emoji: '🥒', quantity: 4, unit: 'pieces', dinerDesc: 'Tangy, briny, mouthwatering bite', expiryOffsetDays: 30 },
      { id: 'cheddar', name: 'Sharp Cheddar', category: 'dairy', emoji: '🧀', quantity: 150, unit: 'grams', dinerDesc: 'Ultra-gooey melt with a sharp bite', expiryOffsetDays: 12 },
      { id: 'american_cheese', name: 'Classic American Melter', category: 'dairy', emoji: '🧀', quantity: 6, unit: 'pieces', dinerDesc: 'The unrivaled master of meltiness', expiryOffsetDays: 18 },
      { id: 'special_sauce', name: 'Chef Special Sauce', category: 'flavor', emoji: '🥣', quantity: 200, unit: 'ml', dinerDesc: 'Mayo, relish, ketchup & secret spices', expiryOffsetDays: 10 },
      { id: 'hotsauce', name: 'Diner Hot Sauce', category: 'spices', emoji: '🌶️', quantity: 150, unit: 'ml', dinerDesc: 'Vinegary kick of heat', expiryOffsetDays: 60 },
    ],
  },
  {
    id: 'clean_the_fridge',
    name: 'Zero Waste Sweep',
    emoji: '🧹',
    desc: 'Puts expiring items front and center',
    items: [
      { id: 'eggs', name: 'Farm Fresh Eggs', category: 'protein', emoji: '🍳', quantity: 4, unit: 'pieces', dinerDesc: 'Sunny side up, scrambled, or poached', expiryOffsetDays: 1 },
      { id: 'beef', name: 'Ground Beef Patty', category: 'protein', emoji: '🥩', quantity: 2, unit: 'pieces', dinerDesc: 'Ready for a classic smash burger', expiryOffsetDays: 2 },
      { id: 'spinach', name: 'Baby Spinach', category: 'produce', emoji: '🥗', quantity: 150, unit: 'grams', dinerDesc: 'Quick-wilts into cheesy goodness', expiryOffsetDays: 1 },
      { id: 'tomatoes', name: 'Vine Ripe Tomatoes', category: 'produce', emoji: '🍅', quantity: 2, unit: 'pieces', dinerDesc: 'Juicy thick slices with flaky salt', expiryOffsetDays: 2 },
      { id: 'sourdough', name: 'Sourdough Bread', category: 'carb', emoji: '🍞', quantity: 4, unit: 'pieces', dinerDesc: 'Golden buttery griddle crunch', expiryOffsetDays: 2 },
      { id: 'butter', name: 'Salted Butter', category: 'dairy', emoji: '🧈', quantity: 100, unit: 'grams', dinerDesc: 'The secret to golden diner toast', expiryOffsetDays: 15 },
      { id: 'cheddar', name: 'Sharp Cheddar', category: 'dairy', emoji: '🧀', quantity: 120, unit: 'grams', dinerDesc: 'Ultra-gooey melt with a sharp bite', expiryOffsetDays: 3 },
      { id: 'onions', name: 'Sweet Yellow Onion', category: 'produce', emoji: '🧅', quantity: 1, unit: 'pieces', dinerDesc: 'Caramelized until rich mahogany', expiryOffsetDays: 7 },
    ],
  },
  {
    id: 'veggie_delight',
    name: 'Green & Cheesy',
    emoji: '🌱',
    desc: 'Hearty vegetarian spins with extra crunch',
    items: [
      { id: 'eggs', name: 'Farm Fresh Eggs', category: 'protein', emoji: '🍳', quantity: 6, unit: 'pieces', dinerDesc: 'Sunny side up, scrambled, or poached', expiryOffsetDays: 7 },
      { id: 'tofu', name: 'Crispy Pressed Tofu', category: 'protein', emoji: '🧈', quantity: 2, unit: 'pieces', dinerDesc: 'Soaks up grill marinades like magic', expiryOffsetDays: 5 },
      { id: 'sourdough', name: 'Sourdough Bread', category: 'carb', emoji: '🍞', quantity: 6, unit: 'pieces', dinerDesc: 'Golden buttery griddle crunch', expiryOffsetDays: 4 },
      { id: 'potatoes', name: 'Russet Potatoes', category: 'carb', emoji: '🥔', quantity: 3, unit: 'pieces', dinerDesc: 'Diner hashbrowns or crispy home fries', expiryOffsetDays: 10 },
      { id: 'spinach', name: 'Baby Spinach', category: 'produce', emoji: '🥗', quantity: 200, unit: 'grams', dinerDesc: 'Quick-wilts into cheesy goodness', expiryOffsetDays: 3 },
      { id: 'mushrooms', name: 'Button Mushrooms', category: 'produce', emoji: '🍄', quantity: 250, unit: 'grams', dinerDesc: 'Buttery sautéed skillet toppers', expiryOffsetDays: 3 },
      { id: 'avocado', name: 'Hass Avocado', category: 'produce', emoji: '🥑', quantity: 2, unit: 'pieces', dinerDesc: 'Creamy slices for retro melts', expiryOffsetDays: 2 },
      { id: 'tomatoes', name: 'Vine Ripe Tomatoes', category: 'produce', emoji: '🍅', quantity: 3, unit: 'pieces', dinerDesc: 'Juicy thick slices with flaky salt', expiryOffsetDays: 4 },
      { id: 'cheddar', name: 'Sharp Cheddar', category: 'dairy', emoji: '🧀', quantity: 200, unit: 'grams', dinerDesc: 'Ultra-gooey melt with a sharp bite', expiryOffsetDays: 12 },
      { id: 'butter', name: 'Salted Butter', category: 'dairy', emoji: '🧈', quantity: 120, unit: 'grams', dinerDesc: 'The secret to golden diner toast', expiryOffsetDays: 20 },
    ],
  },
  {
    id: 'desi_diner_express',
    name: 'Desi Diner Spice Box',
    emoji: '🌶️',
    desc: 'Paneer, curry leaves, basmati rice, cauliflower, capsicum & aromatics',
    items: [
      { id: 'paneer', name: 'Fresh Malai Paneer', category: 'protein', emoji: '🧀', quantity: 250, unit: 'grams', dinerDesc: 'Soft creamy cubes ready for the griddle', expiryOffsetDays: 4 },
      { id: 'eggs', name: 'Farm Fresh Eggs', category: 'protein', emoji: '🍳', quantity: 6, unit: 'pieces', dinerDesc: 'For masala omelettes & egg roast', expiryOffsetDays: 7 },
      { id: 'rice', name: 'Basmati Rice', category: 'carb', emoji: '🍚', quantity: 500, unit: 'grams', dinerDesc: 'Long-grain rice for fragrant pulao & lemon rice', expiryOffsetDays: 30 },
      { id: 'dosa_batter', name: 'Fermented Dosa Batter', category: 'carb', emoji: '🥞', quantity: 500, unit: 'ml', dinerDesc: 'Paper-thin golden dosas', expiryOffsetDays: 4 },
      { id: 'cauliflower', name: 'Cauliflower Florets', category: 'produce', emoji: '🥦', quantity: 1, unit: 'pieces', dinerDesc: 'For spicy aloo gobi & pulao', expiryOffsetDays: 4 },
      { id: 'curry_leaves', name: 'Curry Leaves', category: 'produce', emoji: '🍃', quantity: 1, unit: 'pieces', dinerDesc: 'Aromatic emerald sprigs for crackling tadka', expiryOffsetDays: 8 },
      { id: 'coriander', name: 'Fresh Coriander', category: 'produce', emoji: '🌿', quantity: 1, unit: 'pieces', dinerDesc: 'Fresh citrus herb garnish', expiryOffsetDays: 3 },
      { id: 'peppers', name: 'Green Capsicum', category: 'produce', emoji: '🫑', quantity: 2, unit: 'pieces', dinerDesc: 'Crunchy bell pepper for stir-fries', expiryOffsetDays: 5 },
      { id: 'tomatoes', name: 'Vine Ripe Tomatoes', category: 'produce', emoji: '🍅', quantity: 3, unit: 'pieces', dinerDesc: 'Juicy base for curries and gravies', expiryOffsetDays: 3 },
      { id: 'onions', name: 'Sweet Yellow Onion', category: 'produce', emoji: '🧅', quantity: 2, unit: 'pieces', dinerDesc: 'Slowly caramelized for rich base', expiryOffsetDays: 9 },
      { id: 'ghee', name: 'Pure Desi Ghee', category: 'dairy', emoji: '🧈', quantity: 200, unit: 'grams', dinerDesc: 'Nutty clarified butter', expiryOffsetDays: 60 },
      { id: 'garam_masala', name: 'Garam Masala Blend', category: 'spices', emoji: '🧂', quantity: 100, unit: 'grams', dinerDesc: 'Warm aromatic spices', expiryOffsetDays: 180 },
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
