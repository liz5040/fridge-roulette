import React from 'react';
import type { IngredientCategory } from '../data/ingredients';

/**
 * Reusable Ingredient Icon Registry with Normalization and Aliases
 * Handles all food cultures: Indian, Western, Fusion, Asian, etc.
 * Never returns broken or blank icons; includes custom SVG illustrations where emojis are missing (e.g. Cauliflower).
 */

// Normalized name to icon mapping
export interface IngredientIconEntry {
  emoji: string;
  category: IngredientCategory;
  svg?: 'cauliflower' | 'curry_leaves' | 'paneer';
}

const ALIAS_MAP: Record<string, IngredientIconEntry> = {
  // --- PRODUCE & VEGETABLES ---
  cauliflower: { emoji: '🥦', category: 'produce', svg: 'cauliflower' },
  gobi: { emoji: '🥦', category: 'produce', svg: 'cauliflower' },
  gobhi: { emoji: '🥦', category: 'produce', svg: 'cauliflower' },
  phoolgobi: { emoji: '🥦', category: 'produce', svg: 'cauliflower' },

  tomato: { emoji: '🍅', category: 'produce' },
  tomatoes: { emoji: '🍅', category: 'produce' },
  tamatar: { emoji: '🍅', category: 'produce' },
  thakkali: { emoji: '🍅', category: 'produce' },

  capsicum: { emoji: '🫑', category: 'produce' },
  'bell pepper': { emoji: '🫑', category: 'produce' },
  'bell peppers': { emoji: '🫑', category: 'produce' },
  'sweet pepper': { emoji: '🫑', category: 'produce' },
  shimla: { emoji: '🫑', category: 'produce' },
  'shimla mirch': { emoji: '🫑', category: 'produce' },

  potato: { emoji: '🥔', category: 'carb' },
  potatoes: { emoji: '🥔', category: 'carb' },
  aloo: { emoji: '🥔', category: 'carb' },
  alu: { emoji: '🥔', category: 'carb' },
  batata: { emoji: '🥔', category: 'carb' },
  urulaikkizhangu: { emoji: '🥔', category: 'carb' },

  onion: { emoji: '🧅', category: 'produce' },
  onions: { emoji: '🧅', category: 'produce' },
  pyaz: { emoji: '🧅', category: 'produce' },
  pyaaz: { emoji: '🧅', category: 'produce' },
  shallot: { emoji: '🧅', category: 'produce' },
  shallots: { emoji: '🧅', category: 'produce' },
  savala: { emoji: '🧅', category: 'produce' },
  ulli: { emoji: '🧅', category: 'produce' },
  'sambar onion': { emoji: '🧅', category: 'produce' },

  carrot: { emoji: '🥕', category: 'produce' },
  carrots: { emoji: '🥕', category: 'produce' },
  gajar: { emoji: '🥕', category: 'produce' },

  coconut: { emoji: '🥥', category: 'produce' },
  'grated coconut': { emoji: '🥥', category: 'produce' },
  'coconut milk': { emoji: '🥥', category: 'produce' },
  nariyal: { emoji: '🥥', category: 'produce' },
  thenga: { emoji: '🥥', category: 'produce' },
  copra: { emoji: '🥥', category: 'produce' },

  coriander: { emoji: '🌿', category: 'produce' },
  cilantro: { emoji: '🌿', category: 'produce' },
  dhania: { emoji: '🌿', category: 'produce' },
  'dhania patta': { emoji: '🌿', category: 'produce' },
  kothmir: { emoji: '🌿', category: 'produce' },
  malli: { emoji: '🌿', category: 'produce' },
  malliyila: { emoji: '🌿', category: 'produce' },

  'curry leaves': { emoji: '🍃', category: 'produce', svg: 'curry_leaves' },
  'curry leaf': { emoji: '🍃', category: 'produce', svg: 'curry_leaves' },
  'kadi patta': { emoji: '🍃', category: 'produce', svg: 'curry_leaves' },
  kadipatta: { emoji: '🍃', category: 'produce', svg: 'curry_leaves' },
  kariveppila: { emoji: '🍃', category: 'produce', svg: 'curry_leaves' },
  karuveppilai: { emoji: '🍃', category: 'produce', svg: 'curry_leaves' },

  brinjal: { emoji: '🍆', category: 'produce' },
  eggplant: { emoji: '🍆', category: 'produce' },
  aubergine: { emoji: '🍆', category: 'produce' },
  baingan: { emoji: '🍆', category: 'produce' },
  vazhuthananga: { emoji: '🍆', category: 'produce' },

  spinach: { emoji: '🥬', category: 'produce' },
  palak: { emoji: '🥬', category: 'produce' },
  cheera: { emoji: '🥬', category: 'produce' },
  greens: { emoji: '🥬', category: 'produce' },
  kale: { emoji: '🥬', category: 'produce' },
  lettuce: { emoji: '🥬', category: 'produce' },

  mushroom: { emoji: '🍄', category: 'produce' },
  mushrooms: { emoji: '🍄', category: 'produce' },
  khumb: { emoji: '🍄', category: 'produce' },
  koon: { emoji: '🍄', category: 'produce' },

  peas: { emoji: '🟢', category: 'produce' },
  'green peas': { emoji: '🟢', category: 'produce' },
  matar: { emoji: '🟢', category: 'produce' },
  muttar: { emoji: '🟢', category: 'produce' },

  avocado: { emoji: '🥑', category: 'produce' },
  guacamole: { emoji: '🥑', category: 'produce' },

  cucumber: { emoji: '🥒', category: 'produce' },
  kheera: { emoji: '🥒', category: 'produce' },
  vellarikka: { emoji: '🥒', category: 'produce' },
  pickle: { emoji: '🥒', category: 'produce' },
  pickles: { emoji: '🥒', category: 'produce' },

  lemon: { emoji: '🍋', category: 'produce' },
  lime: { emoji: '🍋', category: 'produce' },
  nimbu: { emoji: '🍋', category: 'produce' },
  cherunaranga: { emoji: '🍋', category: 'produce' },

  ginger: { emoji: '🫚', category: 'produce' },
  adrak: { emoji: '🫚', category: 'produce' },
  inji: { emoji: '🫚', category: 'produce' },

  garlic: { emoji: '🧄', category: 'produce' },
  lehsun: { emoji: '🧄', category: 'produce' },
  veluthulli: { emoji: '🧄', category: 'produce' },
  poondu: { emoji: '🧄', category: 'produce' },
  'ginger garlic': { emoji: '🧄', category: 'produce' },
  'ginger garlic paste': { emoji: '🧄', category: 'produce' },

  chilli: { emoji: '🌶️', category: 'spices' },
  chili: { emoji: '🌶️', category: 'spices' },
  chillies: { emoji: '🌶️', category: 'spices' },
  'green chilli': { emoji: '🌶️', category: 'spices' },
  'green chili': { emoji: '🌶️', category: 'spices' },
  'red chilli': { emoji: '🌶️', category: 'spices' },
  mirchi: { emoji: '🌶️', category: 'spices' },
  pacha_mulaku: { emoji: '🌶️', category: 'spices' },
  jalapeno: { emoji: '🌶️', category: 'spices' },

  // --- PROTEINS ---
  paneer: { emoji: '🧀', category: 'protein', svg: 'paneer' },
  'cottage cheese': { emoji: '🧀', category: 'protein', svg: 'paneer' },

  egg: { emoji: '🥚', category: 'protein' },
  eggs: { emoji: '🥚', category: 'protein' },
  anda: { emoji: '🥚', category: 'protein' },
  mutta: { emoji: '🥚', category: 'protein' },
  'fried egg': { emoji: '🍳', category: 'protein' },
  omelette: { emoji: '🍳', category: 'protein' },

  chicken: { emoji: '🍗', category: 'protein' },
  murgh: { emoji: '🍗', category: 'protein' },
  kozhi: { emoji: '🍗', category: 'protein' },
  poultry: { emoji: '🍗', category: 'protein' },

  bacon: { emoji: '🥓', category: 'protein' },
  pork: { emoji: '🥓', category: 'protein' },
  ham: { emoji: '🥓', category: 'protein' },

  beef: { emoji: '🥩', category: 'protein' },
  steak: { emoji: '🥩', category: 'protein' },
  meat: { emoji: '🥩', category: 'protein' },
  mutton: { emoji: '🥩', category: 'protein' },
  lamb: { emoji: '🥩', category: 'protein' },
  gosht: { emoji: '🥩', category: 'protein' },
  keema: { emoji: '🥩', category: 'protein' },

  fish: { emoji: '🐟', category: 'protein' },
  tuna: { emoji: '🐟', category: 'protein' },
  salmon: { emoji: '🐟', category: 'protein' },
  meen: { emoji: '🐟', category: 'protein' },
  machli: { emoji: '🐟', category: 'protein' },
  prawn: { emoji: '🦐', category: 'protein' },
  prawns: { emoji: '🦐', category: 'protein' },
  shrimp: { emoji: '🦐', category: 'protein' },
  chemmeen: { emoji: '🦐', category: 'protein' },

  tofu: { emoji: '🧈', category: 'protein' },
  soya: { emoji: '🫘', category: 'protein' },
  soy: { emoji: '🫘', category: 'protein' },
  'soy chunks': { emoji: '🫘', category: 'protein' },

  chickpeas: { emoji: '🫘', category: 'protein' },
  chana: { emoji: '🫘', category: 'protein' },
  chole: { emoji: '🫘', category: 'protein' },
  kadala: { emoji: '🫘', category: 'protein' },
  beans: { emoji: '🫘', category: 'protein' },
  'black beans': { emoji: '🫘', category: 'protein' },
  rajma: { emoji: '🫘', category: 'protein' },
  dal: { emoji: '🥣', category: 'protein' },
  lentils: { emoji: '🥣', category: 'protein' },
  parippu: { emoji: '🥣', category: 'protein' },

  sausage: { emoji: '🌭', category: 'protein' },
  hotdog: { emoji: '🌭', category: 'protein' },
  frankfurter: { emoji: '🌭', category: 'protein' },

  // --- CARBS & GRAINS ---
  rice: { emoji: '🍚', category: 'carb' },
  basmati: { emoji: '🍚', category: 'carb' },
  chawal: { emoji: '🍚', category: 'carb' },
  choru: { emoji: '🍚', category: 'carb' },
  poha: { emoji: '🍚', category: 'carb' },
  aval: { emoji: '🍚', category: 'carb' },

  bread: { emoji: '🍞', category: 'carb' },
  sourdough: { emoji: '🍞', category: 'carb' },
  toast: { emoji: '🍞', category: 'carb' },
  loaf: { emoji: '🍞', category: 'carb' },
  pav: { emoji: '🍞', category: 'carb' },
  bun: { emoji: '🍔', category: 'carb' },
  buns: { emoji: '🍔', category: 'carb' },
  brioche: { emoji: '🍔', category: 'carb' },
  bagel: { emoji: '🥯', category: 'carb' },

  dosa: { emoji: '🥞', category: 'carb' },
  'dosa batter': { emoji: '🥞', category: 'carb' },
  idli: { emoji: '🥞', category: 'carb' },
  'idli batter': { emoji: '🥞', category: 'carb' },
  uttapam: { emoji: '🥞', category: 'carb' },

  appam: { emoji: '🫓', category: 'carb' },
  vellayappam: { emoji: '🫓', category: 'carb' },
  palappam: { emoji: '🫓', category: 'carb' },
  idiyappam: { emoji: '🫓', category: 'carb' },

  roti: { emoji: '🫓', category: 'carb' },
  chapati: { emoji: '🫓', category: 'carb' },
  phulka: { emoji: '🫓', category: 'carb' },
  paratha: { emoji: '🫓', category: 'carb' },
  parotta: { emoji: '🫓', category: 'carb' },
  naan: { emoji: '🫓', category: 'carb' },
  tortilla: { emoji: '🫓', category: 'carb' },
  tortillas: { emoji: '🫓', category: 'carb' },
  wrap: { emoji: '🌯', category: 'carb' },
  pita: { emoji: '🫓', category: 'carb' },

  pasta: { emoji: '🍝', category: 'carb' },
  macaroni: { emoji: '🍝', category: 'carb' },
  spaghetti: { emoji: '🍝', category: 'carb' },
  noodles: { emoji: '🍜', category: 'carb' },
  penne: { emoji: '🍝', category: 'carb' },

  waffle: { emoji: '🧇', category: 'carb' },
  waffles: { emoji: '🧇', category: 'carb' },
  pancake: { emoji: '🥞', category: 'carb' },
  pancakes: { emoji: '🥞', category: 'carb' },

  // --- DAIRY & MELTS ---
  cheese: { emoji: '🧀', category: 'dairy' },
  cheddar: { emoji: '🧀', category: 'dairy' },
  mozzarella: { emoji: '🧀', category: 'dairy' },
  parmesan: { emoji: '🧀', category: 'dairy' },
  'american cheese': { emoji: '🧀', category: 'dairy' },

  butter: { emoji: '🧈', category: 'dairy' },
  ghee: { emoji: '🧈', category: 'dairy' },
  makhan: { emoji: '🧈', category: 'dairy' },
  neyy: { emoji: '🧈', category: 'dairy' },

  yogurt: { emoji: '🥣', category: 'dairy' },
  curd: { emoji: '🥣', category: 'dairy' },
  dahi: { emoji: '🥣', category: 'dairy' },
  thayir: { emoji: '🥣', category: 'dairy' },
  raita: { emoji: '🥣', category: 'dairy' },

  milk: { emoji: '🥛', category: 'dairy' },
  paal: { emoji: '🥛', category: 'dairy' },
  doodh: { emoji: '🥛', category: 'dairy' },
  cream: { emoji: '🥛', category: 'dairy' },
  malai: { emoji: '🥛', category: 'dairy' },

  // --- SPICES & FLAVOR ---
  'mustard seeds': { emoji: '🟡', category: 'spices' },
  mustard: { emoji: '🟡', category: 'spices' },
  rai: { emoji: '🟡', category: 'spices' },
  kaduku: { emoji: '🟡', category: 'spices' },

  cumin: { emoji: '🟤', category: 'spices' },
  jeera: { emoji: '🟤', category: 'spices' },
  seeragam: { emoji: '🟤', category: 'spices' },

  turmeric: { emoji: '🟡', category: 'spices' },
  haldi: { emoji: '🟡', category: 'spices' },
  manjal: { emoji: '🟡', category: 'spices' },

  'garam masala': { emoji: '🧂', category: 'spices' },
  masala: { emoji: '🧂', category: 'spices' },
  pepper: { emoji: '🧂', category: 'spices' },
  salt: { emoji: '🧂', category: 'spices' },
  chaat: { emoji: '🧂', category: 'spices' },
  'chaat masala': { emoji: '🧂', category: 'spices' },
  cardamom: { emoji: '🟢', category: 'spices' },
  cinnamon: { emoji: '🪵', category: 'spices' },
  clove: { emoji: '🟤', category: 'spices' },

  sauce: { emoji: '🥣', category: 'flavor' },
  ketchup: { emoji: '🍅', category: 'flavor' },
  mayo: { emoji: '🥣', category: 'flavor' },
  mayonnaise: { emoji: '🥣', category: 'flavor' },
  chutney: { emoji: '🥣', category: 'flavor' },
  'green chutney': { emoji: '🥣', category: 'flavor' },
  'mint chutney': { emoji: '🥣', category: 'flavor' },
  salsa: { emoji: '🥣', category: 'flavor' },
  syrup: { emoji: '🍯', category: 'flavor' },
  honey: { emoji: '🍯', category: 'flavor' },
  oil: { emoji: '🫗', category: 'flavor' },
  'olive oil': { emoji: '🫗', category: 'flavor' },
  'coconut oil': { emoji: '🥥', category: 'flavor' },
};

// Category fallback emojis
export const CATEGORY_FALLBACK_EMOJIS: Record<IngredientCategory, string> = {
  protein: '🥩',
  carb: '🍞',
  produce: '🥗',
  dairy: '🧀',
  flavor: '🥣',
  spices: '🧂',
  other: '🥫',
};

/**
 * Normalizes an ingredient name for lookups
 */
export function normalizeIngredientName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove special chars except spaces/hyphens
    .replace(/\s+/g, ' ');
}

/**
 * Looks up the best icon / entry for any given ingredient name
 */
export function resolveIngredientIcon(name: string, fallbackCategory?: IngredientCategory): IngredientIconEntry {
  const norm = normalizeIngredientName(name);

  // 1. Direct match in registry
  if (ALIAS_MAP[norm]) {
    return ALIAS_MAP[norm];
  }

  // 2. Singularize (strip ending 's' or 'es')
  const singular = norm.replace(/(?:es|s)$/, '');
  if (ALIAS_MAP[singular]) {
    return ALIAS_MAP[singular];
  }

  // 3. Substring / word matching
  const words = norm.split(' ');
  for (const word of words) {
    if (word.length >= 3 && ALIAS_MAP[word]) {
      return ALIAS_MAP[word];
    }
  }

  // Check if any registry key is inside the normalized name
  for (const key of Object.keys(ALIAS_MAP)) {
    if (norm.includes(key)) {
      return ALIAS_MAP[key];
    }
  }

  // 4. Fallback based on category
  const cat = fallbackCategory || 'other';
  return {
    emoji: CATEGORY_FALLBACK_EMOJIS[cat] || '🍽️',
    category: cat,
  };
}

/**
 * Returns the best emoji representation for text/clipboard
 */
export function getIngredientEmoji(name: string, fallbackCategory?: IngredientCategory): string {
  return resolveIngredientIcon(name, fallbackCategory).emoji;
}

/**
 * Reusable Vector Cauliflower Illustration
 * Renders a crisp retro diner style cauliflower (creamy florets framed by fresh green leaves)
 */
export const CauliflowerSVG: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Cauliflower"
    role="img"
  >
    {/* Outer green leaves wrapping around */}
    <path
      d="M10 32C8 24 12 16 19 12C15 20 16 28 20 34C16 35 12 34 10 32Z"
      fill="#43A047"
      stroke="#2B170C"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M38 32C40 24 36 16 29 12C33 20 32 28 28 34C32 35 36 34 38 32Z"
      fill="#43A047"
      stroke="#2B170C"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M18 42C14 38 16 34 20 32C22 38 26 40 30 40C24 44 20 44 18 42Z"
      fill="#2E7D32"
      stroke="#2B170C"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Main cauliflower florets (creamy white with soft shading) */}
    <ellipse cx="24" cy="22" rx="14" ry="12" fill="#FFFDF0" />
    {/* Bubbly florets */}
    <circle cx="17" cy="18" r="6" fill="#FFFBE6" stroke="#2B170C" strokeWidth="2" />
    <circle cx="31" cy="18" r="6" fill="#FFFBE6" stroke="#2B170C" strokeWidth="2" />
    <circle cx="24" cy="15" r="7" fill="#FFFFF5" stroke="#2B170C" strokeWidth="2" />
    <circle cx="16" cy="26" r="6.5" fill="#FDF8DC" stroke="#2B170C" strokeWidth="2" />
    <circle cx="32" cy="26" r="6.5" fill="#FDF8DC" stroke="#2B170C" strokeWidth="2" />
    <circle cx="24" cy="26" r="7.5" fill="#FFFDF0" stroke="#2B170C" strokeWidth="2" />
    {/* Tiny floret detail dots */}
    <circle cx="22" cy="23" r="1" fill="#D7CCC8" />
    <circle cx="26" cy="27" r="1" fill="#D7CCC8" />
    <circle cx="16" cy="20" r="1" fill="#D7CCC8" />
    <circle cx="32" cy="20" r="1" fill="#D7CCC8" />
    {/* Bottom stem base */}
    <path
      d="M20 36C22 41 26 41 28 36"
      stroke="#2E7D32"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Reusable Vector Curry Leaves Illustration
 * Crisp sprig of emerald curry leaves for South Indian & home cooking
 */
export const CurryLeavesSVG: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Curry Leaves"
    role="img"
  >
    {/* Curved central stem */}
    <path
      d="M10 40C16 32 26 18 36 8"
      stroke="#5D4037"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Leaf pairs */}
    <path
      d="M36 8C33 11 32 15 35 18C37 15 39 12 36 8Z"
      fill="#43A047"
      stroke="#2B170C"
      strokeWidth="1.5"
    />
    <path
      d="M28 14C23 15 20 18 21 22C24 21 27 18 28 14Z"
      fill="#4CAF50"
      stroke="#2B170C"
      strokeWidth="1.5"
    />
    <path
      d="M32 17C37 17 40 21 38 25C35 23 33 20 32 17Z"
      fill="#388E3C"
      stroke="#2B170C"
      strokeWidth="1.5"
    />
    <path
      d="M22 23C17 25 15 29 16 33C19 31 22 28 22 23Z"
      fill="#4CAF50"
      stroke="#2B170C"
      strokeWidth="1.5"
    />
    <path
      d="M26 26C31 27 34 31 32 35C29 33 27 29 26 26Z"
      fill="#388E3C"
      stroke="#2B170C"
      strokeWidth="1.5"
    />
    <path
      d="M16 32C11 34 10 39 12 42C14 39 16 36 16 32Z"
      fill="#4CAF50"
      stroke="#2B170C"
      strokeWidth="1.5"
    />
  </svg>
);

/**
 * Reusable Vector Paneer Cube Illustration
 * Soft golden-white paneer block with rustic grill lines
 */
export const PaneerSVG: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-label="Paneer"
    role="img"
  >
    {/* 3D isometric paneer block */}
    {/* Top face */}
    <path
      d="M12 18L24 10L38 17L26 25L12 18Z"
      fill="#FFFDF0"
      stroke="#2B170C"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Left face */}
    <path
      d="M12 18L26 25V39L12 32V18Z"
      fill="#FFF9E0"
      stroke="#2B170C"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Right face */}
    <path
      d="M26 25L38 17V31L26 39V25Z"
      fill="#EDE4C8"
      stroke="#2B170C"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Grill marks / spice speckles */}
    <line x1="17" y1="23" x2="21" y2="21" stroke="#D7CCC8" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="22" y1="26" x2="25" y2="24" stroke="#D7CCC8" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="19" cy="30" r="0.8" fill="#FFB74D" />
    <circle cx="31" cy="27" r="0.8" fill="#FFB74D" />
  </svg>
);

interface IngredientIconProps {
  name: string;
  emoji?: string;
  category?: IngredientCategory;
  className?: string;
}

/**
 * Unified IngredientIcon Component
 * Uses the registry to provide crisp SVGs for special items (Cauliflower, Curry Leaves, Paneer)
 * or beautiful matching emojis for everything else.
 * Always renders smoothly, with guaranteed fallback.
 */
export const IngredientIcon: React.FC<IngredientIconProps> = ({
  name,
  emoji,
  category,
  className = 'w-7 h-7 text-2xl',
}) => {
  const entry = resolveIngredientIcon(name, category);

  // If entry specifies a custom SVG illustration
  if (entry.svg === 'cauliflower') {
    return <CauliflowerSVG className={className} />;
  }
  if (entry.svg === 'curry_leaves') {
    return <CurryLeavesSVG className={className} />;
  }
  if (entry.svg === 'paneer') {
    return <PaneerSVG className={className} />;
  }

  // Display emoji: prefer entry emoji, then prop emoji, then fallback
  const displayEmoji = entry.emoji || emoji || CATEGORY_FALLBACK_EMOJIS[category || 'other'] || '🍽️';

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 leading-none select-none ${className}`}
      aria-hidden="true"
    >
      {displayEmoji}
    </span>
  );
};

