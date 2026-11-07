import type { Ingredient } from './ingredients';
import { getIngredientEmoji } from '../utils/ingredientIcons';

export type CuisineType = 'indian' | 'western' | 'fusion';
export type DietType = 'veg' | 'egg' | 'non-veg';
export type MealCategory = 'breakfast' | 'melts' | 'speedy' | 'comfort' | 'dinner';

export interface RecipeStep {
  step: number;
  instruction: string;
  durationMin?: number;
  tip?: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  emoji: string;
  category: string;
  inPantry: boolean;
  required: boolean;
  isMissing?: boolean;
  isExpiring?: boolean;
  substitution?: string;
}

export interface DinerRecipe {
  id: string;
  title: string;
  tagline: string;
  orderNumber: number;
  tableNumber: number;
  cookTimeMin: number;
  difficulty: 'Easy Peasy' | 'Short Order Cook' | 'Griddle Master';
  caloriesEst: number;
  cuisine: CuisineType;
  mealStyle: MealCategory;
  diet: DietType;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  shortOrderTip: string;
  substitutions: string;
  chaosTwist?: string;
  wasteSavedLbs: number;
  matchScore?: number;
}

export interface CuratedRecipeDefinition {
  id: string;
  title: string;
  tagline: string;
  cuisine: CuisineType;
  mealStyle: MealCategory;
  diet: DietType;
  cookTimeMin: number;
  difficulty: 'Easy Peasy' | 'Short Order Cook' | 'Griddle Master';
  caloriesEst: number;
  ingredients: {
    name: string;
    amount: string;
    category: string;
    required: boolean;
    substitution?: string;
    keywords: string[];
  }[];
  steps: RecipeStep[];
  shortOrderTip: string;
  substitutions: string;
  wasteSavedLbs: number;
}

/**
 * 50 Curated, Highly Authentic Recipes Across Indian, Western, and Fusion Cuisines
 */
export const CURATED_RECIPES: CuratedRecipeDefinition[] = [
  // ==========================================
  // INDIAN CUISINES (South, North, Everyday)
  // ==========================================
  {
    id: 'kerala-egg-roast-appam',
    title: 'Kerala Egg Roast & Lacy Appam',
    tagline: 'Caramelized shallots, curry leaves & hard-boiled eggs in spicy tomato gravy',
    cuisine: 'indian',
    mealStyle: 'breakfast',
    diet: 'egg',
    cookTimeMin: 18,
    difficulty: 'Short Order Cook',
    caloriesEst: 420,
    ingredients: [
      { name: 'Eggs', amount: '2 boiled', category: 'Protein', required: true, keywords: ['egg', 'eggs', 'anda', 'mutta'] },
      { name: 'Appam or Parotta', amount: '2 pieces', category: 'Carbs', required: true, substitution: 'Warm toast or chapati', keywords: ['appam', 'parotta', 'bread', 'roti'] },
      { name: 'Onions', amount: '2 sliced', category: 'Produce', required: true, keywords: ['onion', 'onions', 'pyaz', 'shallot'] },
      { name: 'Curry Leaves', amount: '1 sprig', category: 'Produce', required: true, substitution: 'Fresh coriander', keywords: ['curry leaves', 'curry leaf', 'kariveppila'] },
      { name: 'Tomatoes', amount: '1 diced', category: 'Produce', required: false, keywords: ['tomato', 'tomatoes'] },
      { name: 'Garam Masala', amount: '1 tsp', category: 'Spices', required: true, keywords: ['garam masala', 'spices', 'masala'] }
    ],
    steps: [
      { step: 1, instruction: 'Hard boil eggs for 8 minutes, peel, and make shallow diagonal slits along the whites.' },
      { step: 2, instruction: 'Heat coconut oil or ghee in a pan. Sputter curry leaves and add thinly sliced onions. Sauté until deeply golden brown.' },
      { step: 3, instruction: 'Add diced tomatoes, ginger-garlic, turmeric, and garam masala. Cook till oil separates.' },
      { step: 4, instruction: 'Toss the boiled eggs into the masala gravy so the sauce clings to every slit.' },
      { step: 5, instruction: 'Serve piping hot with lacy fermented appams or flaky Malabar parottas.' }
    ],
    shortOrderTip: 'Slowly browning the onions until deep mahogany is the true secret of Kerala Thattukada roast!',
    substitutions: 'Swap appam for toasted sourdough, pav, or warm chapati.',
    wasteSavedLbs: 0.65
  },
  {
    id: 'paneer-bhurji-toast',
    title: 'Amritsari Paneer Bhurji & Butter Toast',
    tagline: 'Scrambled spiced paneer with crunchy onions, capsicum & golden griddled toast',
    cuisine: 'indian',
    mealStyle: 'breakfast',
    diet: 'veg',
    cookTimeMin: 12,
    difficulty: 'Easy Peasy',
    caloriesEst: 480,
    ingredients: [
      { name: 'Paneer', amount: '200g crumbled', category: 'Protein', required: true, substitution: 'Pressed tofu or scrambled eggs', keywords: ['paneer', 'tofu', 'cheese'] },
      { name: 'Bread or Pav', amount: '2 thick slices', category: 'Carbs', required: true, keywords: ['bread', 'toast', 'sourdough', 'pav'] },
      { name: 'Capsicum', amount: '1/2 diced', category: 'Produce', required: true, keywords: ['capsicum', 'bell pepper'] },
      { name: 'Onions & Tomatoes', amount: '1 each, finely chopped', category: 'Produce', required: true, keywords: ['onion', 'tomato'] },
      { name: 'Butter', amount: '2 tbsp', category: 'Dairy', required: true, keywords: ['butter', 'ghee'] },
      { name: 'Coriander', amount: 'Handful fresh', category: 'Produce', required: false, keywords: ['coriander', 'cilantro'] }
    ],
    steps: [
      { step: 1, instruction: 'Melt a generous knob of butter in your skillet over medium heat. Sauté chopped onions and green chillies until translucent.' },
      { step: 2, instruction: 'Toss in crunchy diced capsicum and tomatoes. Cook for 2 minutes until aromatic.' },
      { step: 3, instruction: 'Crumble fresh paneer by hand directly into the pan. Dust with turmeric, garam masala, and salt.' },
      { step: 4, instruction: 'Stir vigorously for 2 minutes. Do not overcook to keep the paneer tender and juicy.' },
      { step: 5, instruction: 'Toast thick bread slices in extra butter until golden crisp. Heap the steaming bhurji on top.' }
    ],
    shortOrderTip: 'Add 2 tablespoons of warm milk or a splash of cream at the end to keep the bhurji wonderfully moist.',
    substitutions: 'Works identically with crumbled firm tofu for a dairy-free version.',
    wasteSavedLbs: 0.70
  },
  {
    id: 'homestyle-vegetable-pulao',
    title: 'Fragrant Homestyle Vegetable Pulao',
    tagline: 'Long-grain basmati rice simmered with carrots, peas, cauliflower & whole spices',
    cuisine: 'indian',
    mealStyle: 'comfort',
    diet: 'veg',
    cookTimeMin: 22,
    difficulty: 'Short Order Cook',
    caloriesEst: 410,
    ingredients: [
      { name: 'Basmati Rice', amount: '1 cup soaked', category: 'Carbs', required: true, keywords: ['rice', 'basmati'] },
      { name: 'Cauliflower & Carrots', amount: '1 cup florets & sliced', category: 'Produce', required: true, keywords: ['cauliflower', 'gobi', 'carrot'] },
      { name: 'Onions', amount: '1 sliced', category: 'Produce', required: true, keywords: ['onion', 'shallot'] },
      { name: 'Ghee or Oil', amount: '2 tbsp', category: 'Dairy', required: true, keywords: ['ghee', 'butter', 'oil'] },
      { name: 'Garam Masala or Cumin', amount: '1 tsp', category: 'Spices', required: true, keywords: ['garam masala', 'cumin', 'spices'] },
      { name: 'Green Peas', amount: '1/4 cup', category: 'Produce', required: false, keywords: ['peas', 'green peas'] }
    ],
    steps: [
      { step: 1, instruction: 'Rinse basmati rice until water runs clear and drain thoroughly.' },
      { step: 2, instruction: 'Heat ghee in a heavy pot. Add whole spices, cumin seeds, and sliced onions; sauté till lightly caramelized.' },
      { step: 3, instruction: 'Add cauliflower florets, diced carrots, and green peas. Sauté for 3 minutes to coat in ghee.' },
      { step: 4, instruction: 'Add soaked rice, 2 cups of water, and salt. Bring to a rapid rolling boil.' },
      { step: 5, instruction: 'Cover tightly with a lid, lower heat to lowest setting, and cook undisturbed for 12 minutes. Fluff gently with a fork.' }
    ],
    shortOrderTip: 'Rest the pulao covered for 5 minutes off the heat before opening—the grains will stay unbroken and separate.',
    substitutions: 'Add leftover boiled potatoes, paneer cubes, or mushrooms if available.',
    wasteSavedLbs: 0.85
  },
  {
    id: 'crispy-masala-dosa',
    title: 'Crispy Dosa & Spiced Potato Masala',
    tagline: 'Golden fermented crepe stuffed with turmeric-mustard potato roast & curry leaves',
    cuisine: 'indian',
    mealStyle: 'breakfast',
    diet: 'veg',
    cookTimeMin: 14,
    difficulty: 'Griddle Master',
    caloriesEst: 390,
    ingredients: [
      { name: 'Dosa Batter', amount: '2 ladles', category: 'Carbs', required: true, keywords: ['dosa', 'dosa batter', 'batter'] },
      { name: 'Potatoes', amount: '2 boiled & mashed', category: 'Carbs', required: true, keywords: ['potato', 'potatoes', 'aloo'] },
      { name: 'Mustard Seeds', amount: '1/2 tsp', category: 'Spices', required: true, keywords: ['mustard', 'mustard seeds', 'rai'] },
      { name: 'Curry Leaves', amount: '1 sprig', category: 'Produce', required: true, keywords: ['curry leaves', 'curry leaf'] },
      { name: 'Onions', amount: '1 finely chopped', category: 'Produce', required: true, keywords: ['onion'] },
      { name: 'Ghee or Butter', amount: '1 tbsp', category: 'Dairy', required: false, keywords: ['ghee', 'butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Boil potatoes until fork-tender and lightly crush with your fingers into chunky pieces.' },
      { step: 2, instruction: 'Heat oil in a pan, crackle mustard seeds, and add curry leaves, chopped onions, and turmeric. Sauté for 2 minutes.' },
      { step: 3, instruction: 'Add crushed potatoes, a splash of water, and salt. Simmer 3 minutes until moist and aromatic.' },
      { step: 4, instruction: 'Heat a smooth flat griddle. Pour dosa batter in the center and spread in concentric spirals into a thin crepe.' },
      { step: 5, instruction: 'Drizzle ghee around the edges until golden and crisp. Place potato masala in center, fold, and serve.' }
    ],
    shortOrderTip: 'Splash cold water on the griddle and wipe clean before pouring each dosa to maintain ideal surface temperature.',
    substitutions: 'If you have no dosa batter, serve the spiced potato roast inside toasted bread for Mumbai Aloo Toast.',
    wasteSavedLbs: 0.60
  },
  {
    id: 'street-masala-omelette-pav',
    title: 'Street-Style Masala Omelette Pav',
    tagline: 'Fluffy two-egg omelette with chillies, onions & coriander tucked inside buttered pav',
    cuisine: 'indian',
    mealStyle: 'speedy',
    diet: 'egg',
    cookTimeMin: 8,
    difficulty: 'Easy Peasy',
    caloriesEst: 380,
    ingredients: [
      { name: 'Eggs', amount: '2 fresh', category: 'Protein', required: true, keywords: ['egg', 'eggs', 'anda'] },
      { name: 'Pav or Bread', amount: '2 pav buns', category: 'Carbs', required: true, keywords: ['pav', 'bread', 'buns', 'toast'] },
      { name: 'Onion & Green Chilli', amount: 'Finely minced', category: 'Produce', required: true, keywords: ['onion', 'chilli'] },
      { name: 'Tomatoes', amount: '2 tbsp diced', category: 'Produce', required: false, keywords: ['tomato'] },
      { name: 'Coriander', amount: '1 tbsp chopped', category: 'Produce', required: false, keywords: ['coriander', 'cilantro'] },
      { name: 'Butter', amount: '1.5 tbsp', category: 'Dairy', required: true, keywords: ['butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Beat eggs vigorously in a bowl with minced onions, chillies, tomatoes, coriander, turmeric, and pinch of salt.' },
      { step: 2, instruction: 'Heat butter on a cast-iron skillet until foaming. Pour egg mixture and swirl to cover pan.' },
      { step: 3, instruction: 'Cook until bottom sets and turns speckled golden. Flip once and cook for 30 seconds.' },
      { step: 4, instruction: 'Slice pav buns horizontally. Toast inside-down on the buttery griddle with extra butter.' },
      { step: 5, instruction: 'Fold the hot masala omelette into quarters and tuck snugly inside the toasted pav.' }
    ],
    shortOrderTip: 'Whisk the eggs with a fork for a full 45 seconds to incorporate air for that signature fluffy street-side texture.',
    substitutions: 'Regular sandwich bread or brioche buns make an incredible substitute for pav.',
    wasteSavedLbs: 0.50
  },
  {
    id: 'south-indian-lemon-rice',
    title: 'South Indian Lemon Rice with Curry Leaves',
    tagline: 'Zesty turmeric rice tempered with crackling mustard seeds, curry leaves & roasted peanuts',
    cuisine: 'indian',
    mealStyle: 'speedy',
    diet: 'veg',
    cookTimeMin: 10,
    difficulty: 'Easy Peasy',
    caloriesEst: 340,
    ingredients: [
      { name: 'Cooked Rice', amount: '2 cups cooled', category: 'Carbs', required: true, keywords: ['rice', 'basmati'] },
      { name: 'Fresh Lemon Juice', amount: '2 tbsp', category: 'Produce', required: true, keywords: ['lemon', 'lime', 'nimbu'] },
      { name: 'Mustard Seeds', amount: '1 tsp', category: 'Spices', required: true, keywords: ['mustard', 'mustard seeds'] },
      { name: 'Curry Leaves', amount: '1 sprig fresh', category: 'Produce', required: true, keywords: ['curry leaves', 'curry leaf'] },
      { name: 'Green Chillies & Ginger', amount: '1 tsp minced', category: 'Produce', required: true, keywords: ['chilli', 'ginger'] },
      { name: 'Turmeric & Oil', amount: '1/2 tsp turmeric + 1 tbsp oil', category: 'Spices', required: true, keywords: ['turmeric', 'oil'] }
    ],
    steps: [
      { step: 1, instruction: 'Spread cold cooked rice onto a flat plate and sprinkle turmeric and salt gently over the grains.' },
      { step: 2, instruction: 'Heat oil in a skillet. Crackle mustard seeds, add curry leaves, slit green chillies, and ginger.' },
      { step: 3, instruction: 'Turn off the stove. Immediately stir in freshly squeezed lemon juice to keep the citrus flavor bright.' },
      { step: 4, instruction: 'Pour hot aromatic tadka over the seasoned rice and mix gently with a wooden spoon without breaking grains.' },
      { step: 5, instruction: 'Serve warm or at room temperature with crispy pappadoms or potato chips.' }
    ],
    shortOrderTip: 'Always turn off the heat before adding fresh lemon juice so it never turns bitter in hot oil.',
    substitutions: 'Great way to repurpose day-old leftover fridge rice into a restaurant-quality meal in 10 minutes.',
    wasteSavedLbs: 0.60
  },
  {
    id: 'homestyle-chana-masala',
    title: 'Homestyle Chana Masala with Warm Rice',
    tagline: 'Plump chickpeas simmered in a spiced onion, ginger & tomato gravy with garam masala',
    cuisine: 'indian',
    mealStyle: 'comfort',
    diet: 'veg',
    cookTimeMin: 20,
    difficulty: 'Short Order Cook',
    caloriesEst: 460,
    ingredients: [
      { name: 'Chickpeas', amount: '1 can / 1.5 cups boiled', category: 'Protein', required: true, keywords: ['chickpeas', 'chana', 'beans'] },
      { name: 'Rice or Roti', amount: '1 portion', category: 'Carbs', required: true, keywords: ['rice', 'roti', 'bread', 'paratha'] },
      { name: 'Tomatoes', amount: '2 pureed or diced', category: 'Produce', required: true, keywords: ['tomato', 'tomatoes'] },
      { name: 'Onions', amount: '1 finely chopped', category: 'Produce', required: true, keywords: ['onion'] },
      { name: 'Garam Masala & Cumin', amount: '1.5 tsp', category: 'Spices', required: true, keywords: ['garam masala', 'cumin', 'spices'] },
      { name: 'Coriander', amount: 'Handful chopped', category: 'Produce', required: false, keywords: ['coriander'] }
    ],
    steps: [
      { step: 1, instruction: 'Heat oil or ghee in a pan. Sauté chopped onions till deep amber.' },
      { step: 2, instruction: 'Add ginger-garlic paste and diced tomatoes. Cook till tomatoes break down into a thick jammy gravy.' },
      { step: 3, instruction: 'Add garam masala, turmeric, red chilli, and salt. Stir for 1 minute till fragrant.' },
      { step: 4, instruction: 'Add cooked chickpeas along with 1/2 cup of their water. Lightly mash a few chickpeas to thicken gravy.' },
      { step: 5, instruction: 'Simmer for 10 minutes. Garnish with chopped coriander and serve with steaming basmati rice.' }
    ],
    shortOrderTip: 'Mashing just 10% of the chickpeas against the pan wall creates a luscious, restaurant-thick sauce naturally.',
    substitutions: 'Swap chickpeas for black beans or kidney beans (rajma).',
    wasteSavedLbs: 0.75
  },
  {
    id: 'kerala-vegetable-stew-appam',
    title: 'Kerala Vegetable Stew & Soft Appam',
    tagline: 'Delicate potatoes, carrots & cauliflower poached in creamy spiced coconut milk',
    cuisine: 'indian',
    mealStyle: 'comfort',
    diet: 'veg',
    cookTimeMin: 22,
    difficulty: 'Short Order Cook',
    caloriesEst: 390,
    ingredients: [
      { name: 'Coconut Milk or Grated Coconut', amount: '1 cup rich milk', category: 'Produce', required: true, keywords: ['coconut', 'coconut milk'] },
      { name: 'Potatoes & Carrots', amount: '1 cup diced', category: 'Produce', required: true, keywords: ['potato', 'carrot'] },
      { name: 'Cauliflower', amount: '1/2 cup florets', category: 'Produce', required: false, keywords: ['cauliflower', 'gobi'] },
      { name: 'Curry Leaves', amount: '2 sprigs', category: 'Produce', required: true, keywords: ['curry leaves', 'curry leaf'] },
      { name: 'Appam or Bread', amount: '2 pieces', category: 'Carbs', required: true, keywords: ['appam', 'bread', 'sourdough'] },
      { name: 'Ginger & Green Chillies', amount: '1 tbsp julienned', category: 'Produce', required: true, keywords: ['ginger', 'chilli'] }
    ],
    steps: [
      { step: 1, instruction: 'In a pot, boil diced potatoes, carrots, cauliflower, julienned ginger, and split chillies in thin coconut milk or water until tender.' },
      { step: 2, instruction: 'Once veggies are tender, lower heat and pour thick coconut milk.' },
      { step: 3, instruction: 'Bring to a very gentle simmer; do not boil rapidly or coconut milk may separate.' },
      { step: 4, instruction: 'In a small pan, heat 1 tsp coconut oil, toss curry leaves until glossy, and pour immediately over the stew.' },
      { step: 5, instruction: 'Ladle the fragrant white stew over warm appams or crusty toasted bread.' }
    ],
    shortOrderTip: 'Keep the flame low after adding the thick coconut milk to preserve its velvety sweetness.',
    substitutions: 'French bread or soft dinner rolls are fantastic for soaking up this coconut stew.',
    wasteSavedLbs: 0.70
  },
  {
    id: 'malabar-chicken-pepper-fry',
    title: 'Malabar Chicken Pepper Fry',
    tagline: 'Seared chicken pieces tossed with cracked black pepper, curry leaves & caramelized onions',
    cuisine: 'indian',
    mealStyle: 'dinner',
    diet: 'non-veg',
    cookTimeMin: 20,
    difficulty: 'Griddle Master',
    caloriesEst: 490,
    ingredients: [
      { name: 'Chicken', amount: '300g boneless / cubed', category: 'Protein', required: true, keywords: ['chicken', 'poultry'] },
      { name: 'Curry Leaves', amount: '2 sprigs', category: 'Produce', required: true, keywords: ['curry leaves', 'curry leaf'] },
      { name: 'Onions', amount: '2 sliced', category: 'Produce', required: true, keywords: ['onion', 'shallots'] },
      { name: 'Black Pepper & Garam Masala', amount: '1.5 tbsp freshly ground', category: 'Spices', required: true, keywords: ['pepper', 'garam masala', 'spices'] },
      { name: 'Rice or Parotta', amount: '1 portion', category: 'Carbs', required: true, keywords: ['rice', 'bread', 'paratha', 'roti'] },
      { name: 'Ginger Garlic', amount: '1 tbsp paste', category: 'Flavor', required: true, keywords: ['ginger', 'garlic'] }
    ],
    steps: [
      { step: 1, instruction: 'Marinate chicken cubes with turmeric, 1 tsp crushed pepper, ginger-garlic, and salt for 10 minutes.' },
      { step: 2, instruction: 'Heat coconut oil or ghee in a heavy skillet. Add curry leaves and sliced onions; cook until dark brown.' },
      { step: 3, instruction: 'Toss in marinated chicken. Sear over high heat for 5 minutes to lock in juices.' },
      { step: 4, instruction: 'Lower heat, cover, and cook 8 minutes until chicken is tender.' },
      { step: 5, instruction: 'Uncover, crank the heat, shower with extra freshly crushed black pepper, and roast dry until edges are crisp.' }
    ],
    shortOrderTip: 'Crush whole black peppercorns coarsely right before cooking for maximum aroma and punch.',
    substitutions: 'Swap chicken for paneer cubes or button mushrooms for a vegetarian pepper fry.',
    wasteSavedLbs: 0.80
  },
  {
    id: 'dhaba-aloo-gobi-roast',
    title: 'Dhaba-Style Aloo Gobi Skillet Roast',
    tagline: 'Crispy pan-roasted cauliflower and potatoes coated in dry roasted cumin & ginger masala',
    cuisine: 'indian',
    mealStyle: 'dinner',
    diet: 'veg',
    cookTimeMin: 18,
    difficulty: 'Short Order Cook',
    caloriesEst: 360,
    ingredients: [
      { name: 'Cauliflower', amount: '1.5 cups bite-sized florets', category: 'Produce', required: true, keywords: ['cauliflower', 'gobi'] },
      { name: 'Potatoes', amount: '2 medium diced', category: 'Carbs', required: true, keywords: ['potato', 'potatoes', 'aloo'] },
      { name: 'Ginger & Green Chillies', amount: '1 tbsp julienned', category: 'Produce', required: true, keywords: ['ginger', 'chilli'] },
      { name: 'Cumin Seeds', amount: '1 tsp', category: 'Spices', required: true, keywords: ['cumin', 'jeera'] },
      { name: 'Turmeric & Garam Masala', amount: '1 tsp each', category: 'Spices', required: true, keywords: ['turmeric', 'garam masala'] },
      { name: 'Roti or Toast', amount: '2 pieces', category: 'Carbs', required: true, keywords: ['roti', 'bread', 'toast'] }
    ],
    steps: [
      { step: 1, instruction: 'Cut cauliflower into small bite-sized florets and pat completely dry.' },
      { step: 2, instruction: 'Heat 2 tbsp oil in a wide skillet. Sputter cumin seeds and add diced potatoes; fry 5 minutes until half-cooked.' },
      { step: 3, instruction: 'Add cauliflower florets, turmeric, and salt. Sauté on medium-high until florets get roasted brown speckles.' },
      { step: 4, instruction: 'Add julienned ginger, green chillies, and garam masala. Cover with a lid for 4 minutes to steam tender.' },
      { step: 5, instruction: 'Remove lid, cook 2 minutes on high for a final crisp crust, and serve with hot rotis.' }
    ],
    shortOrderTip: 'Make sure your cauliflower florets are completely dry before hitting the hot pan to ensure crispy roasting instead of soggy steaming.',
    substitutions: 'Add green peas or capsicum strips for extra crunch and sweetness.',
    wasteSavedLbs: 0.75
  },
  {
    id: 'creamy-palak-paneer-skillet',
    title: 'Creamy Palak Paneer Skillet',
    tagline: 'Golden pan-seared paneer cubes folded into garlicky creamed spinach gravy',
    cuisine: 'indian',
    mealStyle: 'comfort',
    diet: 'veg',
    cookTimeMin: 18,
    difficulty: 'Short Order Cook',
    caloriesEst: 440,
    ingredients: [
      { name: 'Paneer', amount: '200g cubed', category: 'Protein', required: true, keywords: ['paneer', 'cheese', 'tofu'] },
      { name: 'Fresh Spinach', amount: '200g washed', category: 'Produce', required: true, keywords: ['spinach', 'palak', 'greens'] },
      { name: 'Garlic', amount: '4 cloves minced', category: 'Produce', required: true, keywords: ['garlic', 'lehsun'] },
      { name: 'Butter or Cream', amount: '2 tbsp', category: 'Dairy', required: true, keywords: ['butter', 'cream'] },
      { name: 'Rice or Naan', amount: '1 portion', category: 'Carbs', required: true, keywords: ['rice', 'bread', 'naan', 'roti'] },
      { name: 'Garam Masala', amount: '1/2 tsp', category: 'Spices', required: false, keywords: ['garam masala'] }
    ],
    steps: [
      { step: 1, instruction: 'Blanch spinach leaves in boiling water for 90 seconds, then blend or finely chop into a vibrant emerald puree.' },
      { step: 2, instruction: 'Lightly sear paneer cubes in 1 tsp butter until pale golden; set aside.' },
      { step: 3, instruction: 'In the same skillet, sizzle minced garlic and cumin in butter until fragrant.' },
      { step: 4, instruction: 'Pour in the spinach puree, add salt, garam masala, and 1 tbsp butter/cream. Simmer 3 minutes.' },
      { step: 5, instruction: 'Gently slide the seared paneer cubes into the sauce and warm through.' }
    ],
    shortOrderTip: 'Blanching spinach and quenching in cold water preserves the vibrant bright green color.',
    substitutions: 'Swap paneer for crispy tofu or hard-boiled eggs.',
    wasteSavedLbs: 0.70
  },
  {
    id: 'tadka-dal-jeera-rice',
    title: 'Comfort Tadka Dal & Jeera Rice',
    tagline: 'Yellow lentils simmered tender and tempered with sizzling garlic, cumin & ghee',
    cuisine: 'indian',
    mealStyle: 'comfort',
    diet: 'veg',
    cookTimeMin: 16,
    difficulty: 'Easy Peasy',
    caloriesEst: 380,
    ingredients: [
      { name: 'Lentils / Dal', amount: '1 cup cooked', category: 'Protein', required: true, keywords: ['dal', 'lentils', 'beans'] },
      { name: 'Rice', amount: '1.5 cups cooked', category: 'Carbs', required: true, keywords: ['rice', 'basmati'] },
      { name: 'Ghee or Butter', amount: '2 tbsp', category: 'Dairy', required: true, keywords: ['ghee', 'butter'] },
      { name: 'Garlic', amount: '4 cloves sliced', category: 'Produce', required: true, keywords: ['garlic'] },
      { name: 'Cumin & Mustard Seeds', amount: '1 tsp', category: 'Spices', required: true, keywords: ['cumin', 'mustard'] },
      { name: 'Tomatoes', amount: '1 small diced', category: 'Produce', required: false, keywords: ['tomato'] }
    ],
    steps: [
      { step: 1, instruction: 'Warm cooked lentils in a saucepan with a splash of water and salt until smooth and creamy.' },
      { step: 2, instruction: 'In a small tadka pan, heat pure desi ghee until shimmering hot.' },
      { step: 3, instruction: 'Add cumin seeds, sliced garlic, and a pinch of chilli powder. Fry until garlic turns golden brown.' },
      { step: 4, instruction: 'Pour the sizzling ghee tadka directly into the dal with an audible sizzle! Cover immediately.' },
      { step: 5, instruction: 'Serve steaming hot over jeera rice with a squeeze of fresh lemon.' }
    ],
    shortOrderTip: 'Let the garlic turn crisp and nutty brown in the ghee—that browned garlic is pure diner magic!',
    substitutions: 'Any canned or boiled beans or lentils work wonderfully.',
    wasteSavedLbs: 0.65
  },
  {
    id: 'south-indian-curd-rice',
    title: 'South Indian Curd Rice with Mustard Tadka',
    tagline: 'Cool creamy yogurt rice tempered with mustard seeds, curry leaves & ginger',
    cuisine: 'indian',
    mealStyle: 'speedy',
    diet: 'veg',
    cookTimeMin: 8,
    difficulty: 'Easy Peasy',
    caloriesEst: 310,
    ingredients: [
      { name: 'Cooked Rice', amount: '1.5 cups soft/mashed', category: 'Carbs', required: true, keywords: ['rice'] },
      { name: 'Yogurt / Curd', amount: '1 cup fresh', category: 'Dairy', required: true, keywords: ['yogurt', 'curd', 'dahi'] },
      { name: 'Curry Leaves', amount: '1 sprig', category: 'Produce', required: true, keywords: ['curry leaves', 'curry leaf'] },
      { name: 'Mustard Seeds', amount: '1/2 tsp', category: 'Spices', required: true, keywords: ['mustard', 'mustard seeds'] },
      { name: 'Ginger & Green Chilli', amount: '1 tsp finely minced', category: 'Produce', required: true, keywords: ['ginger', 'chilli'] },
      { name: 'Cucumber or Carrot', amount: '2 tbsp grated', category: 'Produce', required: false, keywords: ['cucumber', 'carrot'] }
    ],
    steps: [
      { step: 1, instruction: 'Lightly mash warm cooked rice with a fork and let cool to room temperature.' },
      { step: 2, instruction: 'Stir in fresh creamy yogurt and salt until smooth and velvety.' },
      { step: 3, instruction: 'Heat 1 tsp oil in a tiny skillet, sputter mustard seeds, and add curry leaves, minced ginger, and green chillies.' },
      { step: 4, instruction: 'Pour the crackling tempering over the yogurt rice.' },
      { step: 5, instruction: 'Top with grated cucumber or carrots and serve chilled or room temp.' }
    ],
    shortOrderTip: 'Never mix cold yogurt into steaming hot rice or it will curdle—let the rice cool down first.',
    substitutions: 'Add a splash of milk to keep the curd rice creamy if packing for later.',
    wasteSavedLbs: 0.55
  },
  {
    id: 'street-egg-fried-rice',
    title: 'Desi Street-Style Egg Fried Rice',
    tagline: 'High-heat wok-tossed rice with scrambled eggs, capsicum, onions & black pepper',
    cuisine: 'indian',
    mealStyle: 'speedy',
    diet: 'egg',
    cookTimeMin: 12,
    difficulty: 'Short Order Cook',
    caloriesEst: 430,
    ingredients: [
      { name: 'Cooked Rice', amount: '2 cups cold day-old', category: 'Carbs', required: true, keywords: ['rice', 'basmati'] },
      { name: 'Eggs', amount: '2 beaten', category: 'Protein', required: true, keywords: ['egg', 'eggs', 'anda'] },
      { name: 'Capsicum & Onions', amount: '1 cup finely diced', category: 'Produce', required: true, keywords: ['capsicum', 'onion'] },
      { name: 'Black Pepper & Garam Masala', amount: '1 tsp each', category: 'Spices', required: true, keywords: ['pepper', 'garam masala'] },
      { name: 'Butter or Oil', amount: '2 tbsp', category: 'Dairy', required: true, keywords: ['butter', 'oil'] },
      { name: 'Green Chillies', amount: '1 chopped', category: 'Produce', required: false, keywords: ['chilli'] }
    ],
    steps: [
      { step: 1, instruction: 'Heat oil in a wide skillet or wok on high heat until smoking.' },
      { step: 2, instruction: 'Pour in beaten eggs and scramble rapidly for 45 seconds; slide to the side.' },
      { step: 3, instruction: 'Toss diced onions and capsicum in the center; stir-fry for 1 minute on high heat.' },
      { step: 4, instruction: 'Add cold cooked rice, black pepper, garam masala, and salt.' },
      { step: 5, instruction: 'Toss vigorously for 2 minutes until rice grains are smoking hot and separated.' }
    ],
    shortOrderTip: 'Cold, refrigerated rice is essential for fried rice so the grains don’t turn to mush in the hot pan.',
    substitutions: 'Add shredded cabbage, carrots, or leftover chicken.',
    wasteSavedLbs: 0.65
  },
  {
    id: 'butter-chicken-skillet',
    title: 'Quick Butter Chicken Skillet with Warm Bread',
    tagline: 'Tender chicken bites simmered in rich buttery tomato cream gravy',
    cuisine: 'indian',
    mealStyle: 'comfort',
    diet: 'non-veg',
    cookTimeMin: 20,
    difficulty: 'Short Order Cook',
    caloriesEst: 560,
    ingredients: [
      { name: 'Chicken', amount: '250g cubed', category: 'Protein', required: true, keywords: ['chicken', 'poultry'] },
      { name: 'Tomatoes', amount: '2 blended/pureed', category: 'Produce', required: true, keywords: ['tomato', 'tomatoes'] },
      { name: 'Butter', amount: '3 tbsp', category: 'Dairy', required: true, keywords: ['butter', 'ghee'] },
      { name: 'Cream or Milk', amount: '3 tbsp', category: 'Dairy', required: true, keywords: ['cream', 'milk', 'yogurt'] },
      { name: 'Bread or Naan', amount: '2 pieces', category: 'Carbs', required: true, keywords: ['bread', 'naan', 'toast', 'roti'] },
      { name: 'Garam Masala', amount: '1 tsp', category: 'Spices', required: true, keywords: ['garam masala', 'spices'] }
    ],
    steps: [
      { step: 1, instruction: 'Sear chicken cubes in 1 tbsp butter on high heat until golden on both sides (4 min).' },
      { step: 2, instruction: 'In the same pan, melt remaining butter and add ginger-garlic and tomato puree.' },
      { step: 3, instruction: 'Simmer tomato sauce 6 minutes until darkened, then stir in garam masala and cream.' },
      { step: 4, instruction: 'Return seared chicken to the simmering sauce and cook for 5 minutes.' },
      { step: 5, instruction: 'Toast thick bread or naan with extra butter and serve immediately.' }
    ],
    shortOrderTip: 'A pinch of sugar or honey balances the acidity of the tomatoes perfectly.',
    substitutions: 'Swap chicken for paneer cubes for iconic Paneer Butter Masala.',
    wasteSavedLbs: 0.75
  },
  {
    id: 'kerala-fish-fry',
    title: 'Kerala Tawa Fish Fry',
    tagline: 'Crispy pan-fried fish steak crusted in red chilli, turmeric, black pepper & curry leaves',
    cuisine: 'indian',
    mealStyle: 'dinner',
    diet: 'non-veg',
    cookTimeMin: 15,
    difficulty: 'Short Order Cook',
    caloriesEst: 380,
    ingredients: [
      { name: 'Fish Fillet or Steaks', amount: '2 pieces (250g)', category: 'Protein', required: true, keywords: ['fish', 'tuna', 'salmon'] },
      { name: 'Curry Leaves', amount: '2 sprigs', category: 'Produce', required: true, keywords: ['curry leaves', 'curry leaf'] },
      { name: 'Lemon Juice', amount: '1 tbsp', category: 'Produce', required: true, keywords: ['lemon', 'lime'] },
      { name: 'Red Chilli & Pepper', amount: '1.5 tsp combined', category: 'Spices', required: true, keywords: ['chilli', 'pepper', 'spices'] },
      { name: 'Rice or Bread', amount: '1 portion', category: 'Carbs', required: true, keywords: ['rice', 'bread'] },
      { name: 'Coconut Oil or Butter', amount: '2 tbsp', category: 'Flavor', required: true, keywords: ['oil', 'butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Make a thick spice paste with chilli powder, turmeric, black pepper, lemon juice, and salt.' },
      { step: 2, instruction: 'Coat the fish pieces evenly with the spice paste and let sit for 10 minutes.' },
      { step: 3, instruction: 'Heat coconut oil or butter on a flat tawa. Scatter fresh curry leaves in the hot oil.' },
      { step: 4, instruction: 'Place the fish over the curry leaves and shallow fry 4 minutes per side until deeply crisp.' },
      { step: 5, instruction: 'Serve with onion rings, lemon wedges, and warm steamed rice.' }
    ],
    shortOrderTip: 'Frying the fish directly on a bed of fresh curry leaves infuses the oil and prevents sticking!',
    substitutions: 'Any firm white fish, salmon, or prawns can be cooked with this exact spice crust.',
    wasteSavedLbs: 0.70
  },
  {
    id: 'kanda-batata-poha',
    title: 'Kanda Batata Poha with Peanuts & Lemon',
    tagline: 'Light, fluffy flattened rice tossed with golden potatoes, onions, turmeric & fresh coriander',
    cuisine: 'indian',
    mealStyle: 'breakfast',
    diet: 'veg',
    cookTimeMin: 12,
    difficulty: 'Easy Peasy',
    caloriesEst: 320,
    ingredients: [
      { name: 'Poha (Flattened Rice)', amount: '2 cups rinsed', category: 'Carbs', required: true, keywords: ['poha', 'rice'] },
      { name: 'Potatoes', amount: '1 small finely cubed', category: 'Carbs', required: true, keywords: ['potato', 'potatoes', 'aloo'] },
      { name: 'Onions', amount: '1 finely chopped', category: 'Produce', required: true, keywords: ['onion', 'pyaz'] },
      { name: 'Mustard Seeds & Turmeric', amount: '1/2 tsp each', category: 'Spices', required: true, keywords: ['mustard', 'turmeric'] },
      { name: 'Lemon Juice & Coriander', amount: '1 tbsp each', category: 'Produce', required: true, keywords: ['lemon', 'coriander'] },
      { name: 'Green Chillies', amount: '1 slit', category: 'Produce', required: false, keywords: ['chilli'] }
    ],
    steps: [
      { step: 1, instruction: 'Rinse poha in a colander under running water for 30 seconds. Drain completely and gently fluff.' },
      { step: 2, instruction: 'Heat oil in a pan, crackle mustard seeds, and fry small diced potatoes until crispy and cooked through.' },
      { step: 3, instruction: 'Add chopped onions and green chillies; sauté until soft and sweet.' },
      { step: 4, instruction: 'Add turmeric and salt, then fold in the drained poha. Cover and steam on low for 2 minutes.' },
      { step: 5, instruction: 'Finish with a shower of lemon juice and fresh coriander leaves.' }
    ],
    shortOrderTip: 'Do not soak poha in a bowl of water—a quick rinse in a colander keeps it light and separate.',
    substitutions: 'If poha is unavailable, make this recipe with leftover cooked rice for instant Lemon-Potato Rice.',
    wasteSavedLbs: 0.50
  },

  // ==========================================
  // WESTERN DINER & COMFORT FOOD CLASSICS
  // ==========================================
  {
    id: 'bacon-sourdough-tomatoes-cheddar',
    title: 'The Route 66 Deluxe BLT Melt',
    tagline: 'Golden griddled sourdough with smoky thick-cut bacon, melted cheddar & juicy tomatoes',
    cuisine: 'western',
    mealStyle: 'melts',
    diet: 'non-veg',
    cookTimeMin: 12,
    difficulty: 'Short Order Cook',
    caloriesEst: 540,
    ingredients: [
      { name: 'Thick-Cut Bacon', amount: '4 strips', category: 'Protein', required: true, keywords: ['bacon', 'pork'] },
      { name: 'Sourdough Bread', amount: '2 thick slices', category: 'Carbs', required: true, keywords: ['sourdough', 'bread'] },
      { name: 'Vine Ripe Tomatoes', amount: '3 thick slices', category: 'Produce', required: true, keywords: ['tomatoes', 'tomato'] },
      { name: 'Sharp Cheddar', amount: '2 thick slices', category: 'Dairy', required: true, keywords: ['cheddar', 'cheese'] },
      { name: 'Butter', amount: '2 tbsp softened', category: 'Dairy', required: false, keywords: ['butter'] },
      { name: 'Pickle Chips', amount: 'Handful', category: 'Produce', required: false, keywords: ['pickles', 'pickle'] }
    ],
    steps: [
      { step: 1, instruction: 'Fire up your skillet to medium heat. Slather the outside of sourdough slices with softened butter.' },
      { step: 2, instruction: 'Fry thick-cut bacon until deeply crisp and mahogany brown. Drain on a paper towel.' },
      { step: 3, instruction: 'In the seasoned skillet, lay bread butter-side down. Stack sharp cheddar, bacon, and tomato slices.' },
      { step: 4, instruction: 'Top with second bread slice. Flip when bottom is deep golden (approx 3 min). Press gently with spatula.' },
      { step: 5, instruction: 'Slice diagonally and serve immediately with dill pickle chips!' }
    ],
    shortOrderTip: 'Steam the cheese under a pot lid with two drops of water on the hot skillet for an instant diner melt!',
    substitutions: 'Swap bacon for crispy pressed tofu or turkey bacon. Any hard melt cheese works.',
    wasteSavedLbs: 0.75
  },
  {
    id: 'beef-buns-onions-american_cheese',
    title: 'The All-American Midnight Smash',
    tagline: 'Lacy crispy-edge beef patty, caramelized diner onions & dripping yellow cheese',
    cuisine: 'western',
    mealStyle: 'melts',
    diet: 'non-veg',
    cookTimeMin: 10,
    difficulty: 'Short Order Cook',
    caloriesEst: 620,
    ingredients: [
      { name: 'Ground Beef Patty', amount: '1/3 lb loosely packed', category: 'Protein', required: true, keywords: ['beef', 'meat'] },
      { name: 'Brioche Buns', amount: '1 split bun', category: 'Carbs', required: true, keywords: ['buns', 'bun', 'brioche'] },
      { name: 'Sweet Yellow Onion', amount: '1/2 paper-thin sliced', category: 'Produce', required: true, keywords: ['onions', 'onion'] },
      { name: 'American Melter Cheese', amount: '2 slices', category: 'Dairy', required: true, keywords: ['american cheese', 'cheese', 'cheddar'] },
      { name: 'Dill Pickles', amount: '3 slices', category: 'Produce', required: false, keywords: ['pickles', 'pickle'] }
    ],
    steps: [
      { step: 1, instruction: 'Heat a dry cast-iron skillet until smoking hot. Lightly toast brioche bun halves in butter and set aside.' },
      { step: 2, instruction: 'Place paper-thin sliced onions directly on top of the raw beef ball. Place ball onion-side down on screaming hot iron.' },
      { step: 3, instruction: 'Using a heavy spatula, SMASH down with full body weight until paper-thin with ragged lacy edges.' },
      { step: 4, instruction: 'Season heavily with salt and coarse pepper. Cook undisturbed for 2.5 minutes until edges are deeply brown.' },
      { step: 5, instruction: 'Scrape under the crust to flip. Slap on 2 slices of American cheese, stack buns on top to steam, and serve.' }
    ],
    shortOrderTip: 'Smash the patty as thin as humanly possible during the first 30 seconds for maximum crispy caramelized edges.',
    substitutions: 'Works great with ground turkey, plant-based patties, or portobello mushroom caps.',
    wasteSavedLbs: 0.75
  },
  {
    id: 'creamy-stovetop-mac-cheese',
    title: 'Creamy Stovetop Macaroni & Sharp Cheddar',
    tagline: 'Al dente macaroni elbows bathed in velvety cheddar cheese sauce with butter & black pepper',
    cuisine: 'western',
    mealStyle: 'comfort',
    diet: 'veg',
    cookTimeMin: 15,
    difficulty: 'Easy Peasy',
    caloriesEst: 510,
    ingredients: [
      { name: 'Macaroni Pasta', amount: '200g elbows', category: 'Carbs', required: true, keywords: ['pasta', 'macaroni'] },
      { name: 'Sharp Cheddar Cheese', amount: '1.5 cups shredded', category: 'Dairy', required: true, keywords: ['cheddar', 'cheese'] },
      { name: 'Butter', amount: '2 tbsp', category: 'Dairy', required: true, keywords: ['butter'] },
      { name: 'Milk or Cream', amount: '1/2 cup', category: 'Dairy', required: true, keywords: ['milk', 'cream'] },
      { name: 'Black Pepper', amount: '1/2 tsp freshly cracked', category: 'Spices', required: false, keywords: ['pepper'] }
    ],
    steps: [
      { step: 1, instruction: 'Boil macaroni in heavily salted water until tender with a slight bite (al dente, ~8 minutes). Drain and reserve 1/4 cup pasta water.' },
      { step: 2, instruction: 'In the same hot pot, melt butter over low heat and whisk in milk.' },
      { step: 3, instruction: 'Gradually add shredded cheddar in small batches, stirring constantly until completely melted and glossy.' },
      { step: 4, instruction: 'Fold the hot cooked macaroni into the cheese sauce. Splash reserved pasta water to loosen if needed.' },
      { step: 5, instruction: 'Crack plenty of black pepper on top and serve steaming hot.' }
    ],
    shortOrderTip: 'Grate cheese fresh from the block—pre-shredded cheese contains anti-caking starch that prevents a smooth melt.',
    substitutions: 'Any pasta shape (penne, spirals, shells) works identically.',
    wasteSavedLbs: 0.60
  },
  {
    id: 'tuna-sourdough-cheddar-melt',
    title: 'Golden Griddled Diner Tuna Melt',
    tagline: 'Flaky albacore tuna salad, melted sharp cheddar & juicy tomato on butter-toasted sourdough',
    cuisine: 'western',
    mealStyle: 'melts',
    diet: 'non-veg',
    cookTimeMin: 12,
    difficulty: 'Short Order Cook',
    caloriesEst: 490,
    ingredients: [
      { name: 'Canned Tuna', amount: '1 can drained', category: 'Protein', required: true, keywords: ['tuna', 'fish'] },
      { name: 'Sourdough Bread', amount: '2 thick slices', category: 'Carbs', required: true, keywords: ['sourdough', 'bread'] },
      { name: 'Sharp Cheddar', amount: '2 slices', category: 'Dairy', required: true, keywords: ['cheddar', 'cheese'] },
      { name: 'Tomatoes', amount: '2 slices', category: 'Produce', required: true, keywords: ['tomato', 'tomatoes'] },
      { name: 'Onions or Pickles', amount: '2 tbsp finely chopped', category: 'Produce', required: false, keywords: ['onion', 'pickles'] },
      { name: 'Butter', amount: '2 tbsp', category: 'Dairy', required: true, keywords: ['butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Mix drained tuna with finely chopped pickles or onions, a pinch of pepper, and 1 tbsp mayo or melted butter.' },
      { step: 2, instruction: 'Butter the outsides of both sourdough slices.' },
      { step: 3, instruction: 'In a hot skillet, place one bread slice butter-side down. Layer cheddar, tuna salad, tomato slices, and second cheese slice.' },
      { step: 4, instruction: 'Top with second bread slice. Cook 3-4 minutes per side until deeply golden and cheese is molten.' },
      { step: 5, instruction: 'Cut in half on the bias and serve with extra pickles.' }
    ],
    shortOrderTip: 'Bookending the tuna between two slices of cheese locks the sandwich together and keeps the bread from getting soggy.',
    substitutions: 'Canned salmon, shredded chicken, or mashed chickpeas work wonderfully.',
    wasteSavedLbs: 0.70
  },
  {
    id: 'crispy-chicken-caesar-wrap',
    title: 'Crispy Chicken Caesar Wrap',
    tagline: 'Sliced roasted chicken, crisp greens, creamy dressing & parmesan rolled in a warm tortilla',
    cuisine: 'western',
    mealStyle: 'speedy',
    diet: 'non-veg',
    cookTimeMin: 10,
    difficulty: 'Easy Peasy',
    caloriesEst: 460,
    ingredients: [
      { name: 'Roasted Chicken', amount: '150g sliced or shredded', category: 'Protein', required: true, keywords: ['chicken', 'poultry'] },
      { name: 'Flour Tortilla', amount: '1 large 10-inch', category: 'Carbs', required: true, keywords: ['tortilla', 'tortillas', 'wrap'] },
      { name: 'Greens or Spinach', amount: '1 cup crisp leaves', category: 'Produce', required: true, keywords: ['spinach', 'greens', 'lettuce'] },
      { name: 'Parmesan or Cheddar', amount: '3 tbsp grated', category: 'Dairy', required: true, keywords: ['cheese', 'cheddar'] },
      { name: 'Tomatoes', amount: '1/2 diced', category: 'Produce', required: false, keywords: ['tomato'] }
    ],
    steps: [
      { step: 1, instruction: 'Warm the tortilla for 15 seconds in a dry pan so it becomes pliable and easy to roll.' },
      { step: 2, instruction: 'Toss shredded chicken and crisp greens with 2 tbsp dressing or mayo and black pepper.' },
      { step: 3, instruction: 'Pile the filling into the center third of the warm tortilla and shower with grated cheese.' },
      { step: 4, instruction: 'Fold the sides inward, then tightly roll from the bottom up into a snug cylinder.' },
      { step: 5, instruction: 'Optional: Sear seam-side down on the skillet for 1 minute for a toasted crust.' }
    ],
    shortOrderTip: 'Toasting the seam side for 60 seconds seals the wrap shut without needing toothpicks!',
    substitutions: 'Use crispy bacon or hard-boiled eggs for protein swaps.',
    wasteSavedLbs: 0.65
  },
  {
    id: 'potato-egg-skillet-hash',
    title: 'Diner Potato & Sunny Egg Skillet Hash',
    tagline: 'Golden crispy russet home fries, caramelized onions & twin sunny-side eggs',
    cuisine: 'western',
    mealStyle: 'breakfast',
    diet: 'egg',
    cookTimeMin: 16,
    difficulty: 'Short Order Cook',
    caloriesEst: 440,
    ingredients: [
      { name: 'Russet Potatoes', amount: '2 cubed bite-sized', category: 'Carbs', required: true, keywords: ['potatoes', 'potato'] },
      { name: 'Farm Fresh Eggs', amount: '2 eggs', category: 'Protein', required: true, keywords: ['eggs', 'egg'] },
      { name: 'Sweet Yellow Onion', amount: '1/2 diced', category: 'Produce', required: true, keywords: ['onion', 'onions'] },
      { name: 'Butter or Oil', amount: '2 tbsp', category: 'Dairy', required: true, keywords: ['butter', 'oil'] },
      { name: 'Cheddar Cheese', amount: '1/4 cup shredded', category: 'Dairy', required: false, keywords: ['cheddar', 'cheese'] }
    ],
    steps: [
      { step: 1, instruction: 'Dice potatoes into small 1/2-inch cubes. Par-cook in microwave for 3 minutes or boil 4 minutes to jumpstart cooking.' },
      { step: 2, instruction: 'Melt butter in a cast iron skillet over medium-high heat. Add potatoes in a single layer and let sear undisturbed for 4 minutes.' },
      { step: 3, instruction: 'Toss in diced onions. Stir and continue frying until potatoes are deeply golden and crispy on all sides.' },
      { step: 4, instruction: 'Create two wells in the potato hash. Crack an egg into each well.' },
      { step: 5, instruction: 'Cover the skillet with a lid for 2-3 minutes until egg whites are set and yolks remain luscious and runny.' }
    ],
    shortOrderTip: 'Par-cooking the diced potatoes before skillet frying cuts cooking time in half and guarantees fluffy interiors with crisp crusts.',
    substitutions: 'Add leftover bacon, diced ham, or bell peppers.',
    wasteSavedLbs: 0.70
  },
  {
    id: 'classic-diner-french-toast',
    title: 'Golden Diner French Toast with Honey & Butter',
    tagline: 'Custard-soaked thick sourdough slices griddled in sizzling butter with cinnamon',
    cuisine: 'western',
    mealStyle: 'breakfast',
    diet: 'egg',
    cookTimeMin: 10,
    difficulty: 'Easy Peasy',
    caloriesEst: 420,
    ingredients: [
      { name: 'Bread or Brioche', amount: '2 thick slices', category: 'Carbs', required: true, keywords: ['bread', 'sourdough', 'brioche'] },
      { name: 'Farm Fresh Eggs', amount: '2 beaten', category: 'Protein', required: true, keywords: ['eggs', 'egg'] },
      { name: 'Milk', amount: '1/4 cup', category: 'Dairy', required: true, keywords: ['milk'] },
      { name: 'Butter', amount: '2 tbsp for the griddle', category: 'Dairy', required: true, keywords: ['butter'] },
      { name: 'Honey or Syrup', amount: '2 tbsp', category: 'Flavor', required: false, keywords: ['syrup', 'honey'] }
    ],
    steps: [
      { step: 1, instruction: 'Whisk eggs, milk, a pinch of cinnamon, and a tiny pinch of salt in a shallow pie dish.' },
      { step: 2, instruction: 'Dip bread slices into the custard, soaking for 20 seconds on each side.' },
      { step: 3, instruction: 'Melt generous butter in a wide skillet over medium heat until bubbling.' },
      { step: 4, instruction: 'Griddle soaked bread for 3 minutes per side until rich mahogany brown.' },
      { step: 5, instruction: 'Transfer to a warm plate, top with a pat of butter, and drizzle with honey or maple syrup.' }
    ],
    shortOrderTip: 'Slightly stale day-old bread absorbs the custard without tearing or falling apart.',
    substitutions: 'Works with any bread on hand—sourdough, sandwich bread, buns, or bagels.',
    wasteSavedLbs: 0.50
  },
  {
    id: 'cheesy-mushroom-sourdough-melt',
    title: 'Cheesy Sautéed Mushroom Sourdough Melt',
    tagline: 'Caramelized buttery button mushrooms, melted Swiss or cheddar & fresh thyme on sourdough',
    cuisine: 'western',
    mealStyle: 'melts',
    diet: 'veg',
    cookTimeMin: 14,
    difficulty: 'Short Order Cook',
    caloriesEst: 460,
    ingredients: [
      { name: 'Button Mushrooms', amount: '200g sliced', category: 'Produce', required: true, keywords: ['mushrooms', 'mushroom'] },
      { name: 'Sourdough Bread', amount: '2 slices', category: 'Carbs', required: true, keywords: ['sourdough', 'bread'] },
      { name: 'Sharp Cheddar or Mozzarella', amount: '2 thick slices', category: 'Dairy', required: true, keywords: ['cheddar', 'cheese', 'mozzarella'] },
      { name: 'Sweet Yellow Onion', amount: '1/2 sliced', category: 'Produce', required: true, keywords: ['onion', 'onions'] },
      { name: 'Butter', amount: '2 tbsp', category: 'Dairy', required: true, keywords: ['butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Heat 1 tbsp butter in a skillet. Sauté sliced onions and mushrooms on high heat undisturbed for 3 minutes until caramelized.' },
      { step: 2, instruction: 'Season mushrooms with salt and black pepper; transfer to a plate.' },
      { step: 3, instruction: 'Butter one side of each bread slice. Place one slice butter-side down in the hot skillet.' },
      { step: 4, instruction: 'Layer cheese, warm caramelized mushrooms, and second layer of cheese; top with second bread slice.' },
      { step: 5, instruction: 'Griddle 3 minutes per side until deep golden and cheese stretches when cut.' }
    ],
    shortOrderTip: 'Don’t salt mushrooms until they get browned—salting too early draws out water and steams them instead of browning.',
    substitutions: 'Add baby spinach leaves or a splash of balsamic vinegar.',
    wasteSavedLbs: 0.65
  },
  {
    id: 'rustic-tomato-garlic-pasta',
    title: 'Rustic Tomato & Garlic Spaghetti Toss',
    tagline: 'Al dente spaghetti tossed in blistered cherry tomatoes, garlic butter & fresh herbs',
    cuisine: 'western',
    mealStyle: 'speedy',
    diet: 'veg',
    cookTimeMin: 14,
    difficulty: 'Easy Peasy',
    caloriesEst: 420,
    ingredients: [
      { name: 'Pasta', amount: '200g spaghetti or elbows', category: 'Carbs', required: true, keywords: ['pasta', 'macaroni'] },
      { name: 'Tomatoes', amount: '2 ripe diced or cherry', category: 'Produce', required: true, keywords: ['tomato', 'tomatoes'] },
      { name: 'Garlic', amount: '4 cloves sliced thin', category: 'Produce', required: true, keywords: ['garlic'] },
      { name: 'Butter or Olive Oil', amount: '2 tbsp', category: 'Dairy', required: true, keywords: ['butter', 'oil'] },
      { name: 'Parmesan or Cheddar', amount: '2 tbsp grated', category: 'Dairy', required: false, keywords: ['cheese', 'cheddar'] }
    ],
    steps: [
      { step: 1, instruction: 'Boil pasta in salted water for 9 minutes. Reserve 1/3 cup cooking water, then drain.' },
      { step: 2, instruction: 'In a wide skillet, heat butter or oil over medium heat. Sauté sliced garlic until pale straw gold.' },
      { step: 3, instruction: 'Toss in diced tomatoes and a pinch of salt. Cook 4 minutes until tomatoes burst into a saucy glaze.' },
      { step: 4, instruction: 'Add cooked pasta and reserved pasta water to the skillet. Toss vigorously on high heat for 1 minute.' },
      { step: 5, instruction: 'Finish with freshly grated cheese and black pepper.' }
    ],
    shortOrderTip: 'Emulsify pasta water with butter by swirling rapidly in the pan for a glossy restaurant-quality coat.',
    substitutions: 'Add grilled chicken, bacon crumbles, or spinach leaves.',
    wasteSavedLbs: 0.60
  },
  {
    id: 'crispy-fish-burger',
    title: 'Crispy Griddled Fish Burger with Tartar',
    tagline: 'Golden pan-seared fish fillet, crunchy lettuce & tangy dill tartar on a toasted brioche bun',
    cuisine: 'western',
    mealStyle: 'comfort',
    diet: 'non-veg',
    cookTimeMin: 12,
    difficulty: 'Short Order Cook',
    caloriesEst: 480,
    ingredients: [
      { name: 'Fish Fillet', amount: '1 thick fillet (150g)', category: 'Protein', required: true, keywords: ['fish', 'tuna', 'salmon'] },
      { name: 'Brioche Bun', amount: '1 split', category: 'Carbs', required: true, keywords: ['buns', 'bun', 'brioche'] },
      { name: 'Pickles', amount: '3 slices or relish', category: 'Produce', required: true, keywords: ['pickles', 'pickle'] },
      { name: 'American Cheese', amount: '1 slice', category: 'Dairy', required: false, keywords: ['cheese', 'american cheese'] },
      { name: 'Butter', amount: '1.5 tbsp', category: 'Dairy', required: true, keywords: ['butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Season fish fillet with salt, black pepper, and a light dusting of flour or cornstarch.' },
      { step: 2, instruction: 'Toast brioche bun halves in melted butter on the skillet until golden.' },
      { step: 3, instruction: 'Sear fish in hot butter for 3.5 minutes per side until flakey and golden.' },
      { step: 4, instruction: 'Slap a slice of cheese on top of the hot fish during the final 30 seconds of cooking.' },
      { step: 5, instruction: 'Spread tartar or mayo and pickles on the bun, add fish, and cap.' }
    ],
    shortOrderTip: 'Dusting the fish lightly with flour before hitting hot butter ensures a shatteringly crisp crust.',
    substitutions: 'Can be made with salmon, tilapia, or cod.',
    wasteSavedLbs: 0.65
  },
  {
    id: 'skillet-shakshuka-feta',
    title: 'Sizzling Skillet Shakshuka with Crusty Bread',
    tagline: 'Poached eggs nestled in spiced tomato-pepper sauce, topped with cheese & toasted sourdough',
    cuisine: 'western',
    mealStyle: 'breakfast',
    diet: 'egg',
    cookTimeMin: 16,
    difficulty: 'Short Order Cook',
    caloriesEst: 410,
    ingredients: [
      { name: 'Eggs', amount: '2 fresh', category: 'Protein', required: true, keywords: ['eggs', 'egg'] },
      { name: 'Tomatoes', amount: '2 ripe chopped', category: 'Produce', required: true, keywords: ['tomato', 'tomatoes'] },
      { name: 'Capsicum', amount: '1/2 diced', category: 'Produce', required: true, keywords: ['capsicum', 'bell pepper'] },
      { name: 'Onion', amount: '1/2 diced', category: 'Produce', required: true, keywords: ['onion'] },
      { name: 'Sourdough Bread', amount: '2 thick slices', category: 'Carbs', required: true, keywords: ['bread', 'sourdough'] },
      { name: 'Cheese or Feta', amount: '2 tbsp crumbled', category: 'Dairy', required: false, keywords: ['cheese'] }
    ],
    steps: [
      { step: 1, instruction: 'Heat olive oil or butter in a skillet. Sauté onions and capsicum for 3 minutes until soft.' },
      { step: 2, instruction: 'Add diced tomatoes, garlic, cumin, and black pepper. Simmer 6 minutes until rich and thick.' },
      { step: 3, instruction: 'Make two small hollows in the sauce with a spoon. Crack an egg into each pocket.' },
      { step: 4, instruction: 'Cover pan and simmer on low for 4 minutes until whites are firm and yolks remain runny.' },
      { step: 5, instruction: 'Scatter cheese on top and serve straight out of the skillet with thick toasted bread.' }
    ],
    shortOrderTip: 'Keep the sauce thick before cracking in the eggs so the whites don’t spread all over the pan.',
    substitutions: 'Add leftover sausage, bacon, or spinach to the tomato base.',
    wasteSavedLbs: 0.70
  },
  {
    id: 'bbq-bacon-cheeseburger',
    title: 'BBQ Bacon Cheddar Burger Stacker',
    tagline: 'Seared beef patty smothered in smoky BBQ sauce, melted sharp cheddar & crispy bacon',
    cuisine: 'western',
    mealStyle: 'melts',
    diet: 'non-veg',
    cookTimeMin: 14,
    difficulty: 'Short Order Cook',
    caloriesEst: 640,
    ingredients: [
      { name: 'Ground Beef Patty', amount: '1 patty (150g)', category: 'Protein', required: true, keywords: ['beef', 'meat'] },
      { name: 'Thick-Cut Bacon', amount: '2 strips', category: 'Protein', required: true, keywords: ['bacon', 'pork'] },
      { name: 'Brioche Bun', amount: '1 bun', category: 'Carbs', required: true, keywords: ['buns', 'bun'] },
      { name: 'Sharp Cheddar', amount: '2 slices', category: 'Dairy', required: true, keywords: ['cheddar', 'cheese'] },
      { name: 'BBQ Sauce', amount: '2 tbsp', category: 'Flavor', required: true, keywords: ['bbq', 'sauce'] },
      { name: 'Onions', amount: '2 thick rings', category: 'Produce', required: false, keywords: ['onion'] }
    ],
    steps: [
      { step: 1, instruction: 'Fry bacon strips in skillet until crisp; set aside.' },
      { step: 2, instruction: 'Sear beef patty in hot skillet for 3.5 minutes per side. Spoon BBQ glaze over patty during the last minute.' },
      { step: 3, instruction: 'Place cheddar slices on top of glazed patty and cover with a lid to melt completely.' },
      { step: 4, instruction: 'Toast buns lightly in the skillet drippings.' },
      { step: 5, instruction: 'Stack bun bottom, BBQ cheeseburger patty, crispy bacon, onion rings, extra BBQ drizzle, and top bun.' }
    ],
    shortOrderTip: 'Glaze the burger with BBQ sauce in the final minute so the sugars caramelize without scorching.',
    substitutions: 'Swap beef for chicken breast or plant-based patty.',
    wasteSavedLbs: 0.75
  },
  {
    id: 'sourdough-avocado-egg-toast',
    title: 'Sourdough Avocado & Poached Egg Toast',
    tagline: 'Crushed creamy avocado, sunny griddled egg & flaky salt on thick rustic sourdough',
    cuisine: 'western',
    mealStyle: 'breakfast',
    diet: 'egg',
    cookTimeMin: 8,
    difficulty: 'Easy Peasy',
    caloriesEst: 390,
    ingredients: [
      { name: 'Sourdough Bread', amount: '2 thick slices', category: 'Carbs', required: true, keywords: ['sourdough', 'bread'] },
      { name: 'Farm Fresh Egg', amount: '1-2 eggs', category: 'Protein', required: true, keywords: ['eggs', 'egg'] },
      { name: 'Avocado', amount: '1 ripe', category: 'Produce', required: true, keywords: ['avocado'] },
      { name: 'Lemon Juice', amount: '1 tsp', category: 'Produce', required: false, keywords: ['lemon'] },
      { name: 'Butter', amount: '1 tbsp', category: 'Dairy', required: true, keywords: ['butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Mash ripe avocado in a bowl with lemon juice, salt, and black pepper.' },
      { step: 2, instruction: 'Toast sourdough slices in foaming butter on the skillet until deep amber.' },
      { step: 3, instruction: 'Fry egg sunny-side up in the same skillet with a pinch of salt until edges are crispy and yolk is liquid.' },
      { step: 4, instruction: 'Spread generous mashed avocado across the hot toast.' },
      { step: 5, instruction: 'Crown with the sunny egg, slice in half, and let the yolk spill across the avocado.' }
    ],
    shortOrderTip: 'Toast the bread slow in butter so it stays crunchy even under the moisture of the mashed avocado.',
    substitutions: 'If avocado is missing, use cream cheese or melted sharp cheddar.',
    wasteSavedLbs: 0.50
  },
  {
    id: 'homestyle-chicken-noodle-skillet',
    title: 'Homestyle Chicken & Pasta Skillet Toss',
    tagline: 'Juicy shredded chicken, macaroni elbows & tender carrots in garlic butter pan sauce',
    cuisine: 'western',
    mealStyle: 'comfort',
    diet: 'non-veg',
    cookTimeMin: 15,
    difficulty: 'Easy Peasy',
    caloriesEst: 460,
    ingredients: [
      { name: 'Roasted Chicken', amount: '150g shredded', category: 'Protein', required: true, keywords: ['chicken'] },
      { name: 'Pasta', amount: '150g cooked macaroni', category: 'Carbs', required: true, keywords: ['pasta', 'macaroni'] },
      { name: 'Carrots & Onions', amount: '1 cup finely sliced', category: 'Produce', required: true, keywords: ['carrot', 'onion'] },
      { name: 'Butter', amount: '2 tbsp', category: 'Dairy', required: true, keywords: ['butter'] },
      { name: 'Garlic', amount: '2 cloves minced', category: 'Produce', required: false, keywords: ['garlic'] }
    ],
    steps: [
      { step: 1, instruction: 'Melt butter in a wide skillet. Sauté carrots and onions for 4 minutes until tender.' },
      { step: 2, instruction: 'Add minced garlic and shredded chicken; toss until hot and fragrant.' },
      { step: 3, instruction: 'Add cooked pasta along with 2 tbsp water or broth.' },
      { step: 4, instruction: 'Toss everything together on high heat with cracked black pepper and salt.' },
      { step: 5, instruction: 'Finish with a sprinkle of fresh herbs or cheese.' }
    ],
    shortOrderTip: 'A spoonful of leftover chicken pan drippings turns simple butter pasta into a deeply savory meal.',
    substitutions: 'Swap chicken for tuna or crispy bacon.',
    wasteSavedLbs: 0.65
  },
  {
    id: 'turkey-bacon-avocado-club',
    title: 'Griddled Turkey Bacon Avocado Club',
    tagline: 'Triple-decker toasted club with crispy bacon, roast chicken/turkey, avocado & tomatoes',
    cuisine: 'western',
    mealStyle: 'melts',
    diet: 'non-veg',
    cookTimeMin: 14,
    difficulty: 'Short Order Cook',
    caloriesEst: 560,
    ingredients: [
      { name: 'Thick-Cut Bacon', amount: '3 strips crisp', category: 'Protein', required: true, keywords: ['bacon'] },
      { name: 'Roasted Chicken or Turkey', amount: '100g sliced', category: 'Protein', required: true, keywords: ['chicken'] },
      { name: 'Bread', amount: '3 slices toasted', category: 'Carbs', required: true, keywords: ['bread', 'sourdough'] },
      { name: 'Avocado & Tomato', amount: 'Sliced', category: 'Produce', required: true, keywords: ['avocado', 'tomato'] },
      { name: 'Cheddar Cheese', amount: '1 slice', category: 'Dairy', required: false, keywords: ['cheese', 'cheddar'] }
    ],
    steps: [
      { step: 1, instruction: 'Griddle three slices of bread in butter until golden.' },
      { step: 2, instruction: 'Layer bottom slice with mayo, sliced chicken/turkey, and tomato slices.' },
      { step: 3, instruction: 'Add middle bread slice, top with crispy bacon, avocado slices, and cheddar.' },
      { step: 4, instruction: 'Cap with third bread slice, press down firmly with spatula.' },
      { step: 5, instruction: 'Secure with toothpicks and cut diagonally into four classic diner triangles.' }
    ],
    shortOrderTip: 'Pressing the sandwich firmly before slicing prevents the layers from sliding out.',
    substitutions: 'Any deli meats or tofu slices make a great substitution.',
    wasteSavedLbs: 0.70
  },
  {
    id: 'loaded-potato-skins-hash',
    title: 'Loaded Skillet Potato Hash with Cheese & Bacon',
    tagline: 'Crispy skin-on potato home fries loaded with melted cheddar, bacon bits & green onions',
    cuisine: 'western',
    mealStyle: 'comfort',
    diet: 'non-veg',
    cookTimeMin: 18,
    difficulty: 'Short Order Cook',
    caloriesEst: 520,
    ingredients: [
      { name: 'Russet Potatoes', amount: '2 medium cubed', category: 'Carbs', required: true, keywords: ['potatoes', 'potato'] },
      { name: 'Thick-Cut Bacon', amount: '3 strips chopped', category: 'Protein', required: true, keywords: ['bacon'] },
      { name: 'Sharp Cheddar', amount: '1/2 cup shredded', category: 'Dairy', required: true, keywords: ['cheddar', 'cheese'] },
      { name: 'Onions', amount: '1/4 cup diced', category: 'Produce', required: false, keywords: ['onion'] },
      { name: 'Butter', amount: '1 tbsp', category: 'Dairy', required: true, keywords: ['butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Fry chopped bacon in skillet until crisp; remove bacon and leave flavorful bacon drippings in pan.' },
      { step: 2, instruction: 'Add par-cooked diced potatoes into the bacon fat. Sear 8 minutes until golden and deeply crispy.' },
      { step: 3, instruction: 'Stir in onions and cook 2 minutes.' },
      { step: 4, instruction: 'Cover the potatoes with shredded cheddar and crispy bacon. Put a lid on pan for 2 minutes to melt cheese into a blanket.' },
      { step: 5, instruction: 'Serve straight from the hot skillet with sour cream or yogurt.' }
    ],
    shortOrderTip: 'Cooking the potatoes in the rendered bacon fat gives unmatched diner crunch and smoky flavor.',
    substitutions: 'Leave out bacon or swap with sautéed mushrooms for a vegetarian loaded hash.',
    wasteSavedLbs: 0.65
  },
  {
    id: 'classic-american-grilled-cheese',
    title: 'The All-American Golden Grilled Cheese',
    tagline: 'Triple-cheese melt on butter-crusted sourdough with silky, gooey cheese pull',
    cuisine: 'western',
    mealStyle: 'melts',
    diet: 'veg',
    cookTimeMin: 8,
    difficulty: 'Easy Peasy',
    caloriesEst: 440,
    ingredients: [
      { name: 'Bread or Sourdough', amount: '2 thick slices', category: 'Carbs', required: true, keywords: ['bread', 'sourdough'] },
      { name: 'Sharp Cheddar', amount: '2 thick slices', category: 'Dairy', required: true, keywords: ['cheddar', 'cheese'] },
      { name: 'American Cheese', amount: '1 slice (for the pull)', category: 'Dairy', required: true, keywords: ['american cheese', 'cheese'] },
      { name: 'Butter', amount: '2 tbsp salted', category: 'Dairy', required: true, keywords: ['butter'] },
      { name: 'Tomato Soup or Dip', amount: 'Optional side', category: 'Produce', required: false, keywords: ['tomato'] }
    ],
    steps: [
      { step: 1, instruction: 'Butter both slices of bread generously all the way to the crust edges.' },
      { step: 2, instruction: 'Place one slice butter-side down on medium-low griddle.' },
      { step: 3, instruction: 'Stack American cheese and sharp cheddar. Top with second bread slice butter-side up.' },
      { step: 4, instruction: 'Griddle low and slow for 3.5 minutes per side, pressing gently until golden and cheese is molten.' },
      { step: 5, instruction: 'Cut in half and pull apart for that iconic diner stretch.' }
    ],
    shortOrderTip: 'Keep the flame medium-low! High heat burns the bread before the cheese in the middle has time to melt.',
    substitutions: 'Slip in sliced tomato, bacon, or pickles for a deluxe variation.',
    wasteSavedLbs: 0.50
  },

  // ==========================================
  // FUSION & CROSS-CULTURE COMFORT
  // ==========================================
  {
    id: 'crispy-paneer-quesadilla',
    title: 'Crispy Paneer Quesadilla with Mint Crema',
    tagline: 'Griddled flour tortilla packed with spiced crumbled paneer, capsicum & oozing cheddar',
    cuisine: 'fusion',
    mealStyle: 'melts',
    diet: 'veg',
    cookTimeMin: 12,
    difficulty: 'Short Order Cook',
    caloriesEst: 510,
    ingredients: [
      { name: 'Paneer', amount: '150g crumbled or sliced', category: 'Protein', required: true, keywords: ['paneer', 'cheese'] },
      { name: 'Flour Tortilla', amount: '1 large (10-inch)', category: 'Carbs', required: true, keywords: ['tortilla', 'tortillas', 'wrap'] },
      { name: 'Capsicum & Onions', amount: '1/2 cup thinly sliced', category: 'Produce', required: true, keywords: ['capsicum', 'onion'] },
      { name: 'Sharp Cheddar or Mozzarella', amount: '1/2 cup shredded', category: 'Dairy', required: true, keywords: ['cheddar', 'cheese'] },
      { name: 'Garam Masala or Chaat', amount: '1/2 tsp', category: 'Spices', required: true, keywords: ['garam masala', 'spices'] },
      { name: 'Butter', amount: '1 tbsp for skillet', category: 'Dairy', required: true, keywords: ['butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Quickly toss crumbled paneer and sliced capsicum in 1 tsp butter with garam masala and salt for 2 minutes.' },
      { step: 2, instruction: 'Melt remaining butter in skillet over medium heat. Lay the flour tortilla flat.' },
      { step: 3, instruction: 'Cover one half of the tortilla with shredded cheese, the warm spiced paneer mixture, and extra cheese.' },
      { step: 4, instruction: 'Fold the empty half over the filling into a neat half-moon. Griddle 2.5 minutes per side until golden brown and crispy.' },
      { step: 5, instruction: 'Slice into 3 wedges and serve with yogurt mint dip or hot sauce.' }
    ],
    shortOrderTip: 'Putting cheese on both top and bottom of the paneer acts as edible glue that seals the tortilla shut.',
    substitutions: 'Swap paneer for seasoned black beans, tofu, or shredded chicken.',
    wasteSavedLbs: 0.70
  },
  {
    id: 'spiced-masala-mac-cheese',
    title: 'Spiced Masala Mac & Cheese with Green Chillies',
    tagline: 'Classic cheesy macaroni infused with cumin-mustard tadka, ginger, turmeric & green chillies',
    cuisine: 'fusion',
    mealStyle: 'comfort',
    diet: 'veg',
    cookTimeMin: 15,
    difficulty: 'Short Order Cook',
    caloriesEst: 530,
    ingredients: [
      { name: 'Macaroni Pasta', amount: '200g cooked', category: 'Carbs', required: true, keywords: ['pasta', 'macaroni'] },
      { name: 'Sharp Cheddar', amount: '1.5 cups shredded', category: 'Dairy', required: true, keywords: ['cheddar', 'cheese'] },
      { name: 'Onion & Tomatoes', amount: '1/2 cup finely chopped', category: 'Produce', required: true, keywords: ['onion', 'tomato'] },
      { name: 'Green Chillies & Ginger', amount: '1 tsp minced', category: 'Produce', required: true, keywords: ['chilli', 'ginger'] },
      { name: 'Mustard Seeds & Cumin', amount: '1/2 tsp each', category: 'Spices', required: true, keywords: ['mustard', 'cumin'] },
      { name: 'Butter & Milk', amount: '2 tbsp butter + 1/3 cup milk', category: 'Dairy', required: true, keywords: ['butter', 'milk'] }
    ],
    steps: [
      { step: 1, instruction: 'Boil macaroni until al dente and drain.' },
      { step: 2, instruction: 'In a saucepan, melt butter. Crackle mustard seeds and cumin, then sauté onions, ginger, and green chillies till fragrant.' },
      { step: 3, instruction: 'Add diced tomatoes and a pinch of turmeric; cook 3 minutes until softened.' },
      { step: 4, instruction: 'Pour in milk, then gradually whisk in shredded cheddar until molten and creamy.' },
      { step: 5, instruction: 'Fold in the cooked macaroni and crack fresh black pepper over top.' }
    ],
    shortOrderTip: 'The contrast of sharp American cheddar with aromatic cumin-mustard tempering takes mac and cheese to another dimension!',
    substitutions: 'Add leftover boiled peas, corn, or crispy bacon.',
    wasteSavedLbs: 0.65
  },
  {
    id: 'tandoori-paneer-naan-pizza',
    title: 'Tandoori Paneer Naan Pizza',
    tagline: 'Crisp griddled naan topped with spiced paneer, onions, capsicum & bubbling melted cheese',
    cuisine: 'fusion',
    mealStyle: 'melts',
    diet: 'veg',
    cookTimeMin: 12,
    difficulty: 'Short Order Cook',
    caloriesEst: 490,
    ingredients: [
      { name: 'Paneer', amount: '120g cubed small', category: 'Protein', required: true, keywords: ['paneer', 'cheese'] },
      { name: 'Naan or Flatbread', amount: '1 piece', category: 'Carbs', required: true, keywords: ['naan', 'roti', 'bread', 'tortilla'] },
      { name: 'Mozzarella or Cheddar', amount: '1/2 cup shredded', category: 'Dairy', required: true, keywords: ['cheese', 'cheddar', 'mozzarella'] },
      { name: 'Capsicum & Onions', amount: '1/2 cup diced', category: 'Produce', required: true, keywords: ['capsicum', 'onion'] },
      { name: 'Tomato Sauce or Ketchup', amount: '2 tbsp', category: 'Flavor', required: true, keywords: ['sauce', 'tomato', 'ketchup'] },
      { name: 'Garam Masala', amount: '1/2 tsp', category: 'Spices', required: false, keywords: ['garam masala'] }
    ],
    steps: [
      { step: 1, instruction: 'Toss small paneer cubes, capsicum, and onions with garam masala, pinch of chilli, and 1 tsp oil.' },
      { step: 2, instruction: 'Spread tomato sauce evenly across the naan surface.' },
      { step: 3, instruction: 'Top generously with shredded cheese, then scatter the seasoned paneer, capsicum, and onion cubes.' },
      { step: 4, instruction: 'Place in a hot covered skillet with 2 drops of water on the side, or broil in toaster oven for 5 minutes.' },
      { step: 5, instruction: 'Cook until bottom of naan is deeply crisp and cheese is bubbly and browned.' }
    ],
    shortOrderTip: 'Putting two drops of water on the hot skillet floor and covering with a lid creates a mini pizza steam oven that melts cheese fast.',
    substitutions: 'Can be made using pita bread, sourdough slices, or flour tortillas.',
    wasteSavedLbs: 0.70
  },
  {
    id: 'mumbai-chilli-cheese-toast',
    title: 'Mumbai Chilli Cheese Toast',
    tagline: 'Thick sourdough toast loaded with sharp cheddar, spicy green chillies, capsicum & butter',
    cuisine: 'fusion',
    mealStyle: 'speedy',
    diet: 'veg',
    cookTimeMin: 10,
    difficulty: 'Easy Peasy',
    caloriesEst: 420,
    ingredients: [
      { name: 'Bread or Sourdough', amount: '2 thick slices', category: 'Carbs', required: true, keywords: ['bread', 'sourdough', 'toast'] },
      { name: 'Sharp Cheddar', amount: '1 cup shredded', category: 'Dairy', required: true, keywords: ['cheddar', 'cheese'] },
      { name: 'Green Chillies', amount: '2 finely minced', category: 'Produce', required: true, keywords: ['chilli', 'chillies'] },
      { name: 'Capsicum', amount: '3 tbsp finely minced', category: 'Produce', required: true, keywords: ['capsicum', 'bell pepper'] },
      { name: 'Butter', amount: '2 tbsp softened', category: 'Dairy', required: true, keywords: ['butter'] },
      { name: 'Garlic', amount: '1 clove minced', category: 'Produce', required: false, keywords: ['garlic'] }
    ],
    steps: [
      { step: 1, instruction: 'Mix shredded cheddar, minced green chillies, finely diced capsicum, and minced garlic in a bowl.' },
      { step: 2, instruction: 'Butter one side of each bread slice and toast butter-side down on skillet until pale golden; flip.' },
      { step: 3, instruction: 'Heap the cheesy chilli-capsicum mixture generously on the toasted side.' },
      { step: 4, instruction: 'Cover the skillet with a lid, lower heat to medium-low, and cook 3 minutes until cheese is molten and bubbling.' },
      { step: 5, instruction: 'Dust with chaat masala or black pepper and slice diagonally.' }
    ],
    shortOrderTip: 'Pre-toasting the bottom side of the bread guarantees a crunchy crust that never gets soggy under hot cheese.',
    substitutions: 'Add finely diced onions, sweet corn, or coriander leaves.',
    wasteSavedLbs: 0.50
  },
  {
    id: 'creamy-tikka-curry-pasta',
    title: 'Creamy Tikka Curry Pasta',
    tagline: 'Penne or elbows tossed in a velvety spiced tomato cream tikka sauce with garlic butter',
    cuisine: 'fusion',
    mealStyle: 'comfort',
    diet: 'veg',
    cookTimeMin: 16,
    difficulty: 'Short Order Cook',
    caloriesEst: 480,
    ingredients: [
      { name: 'Pasta', amount: '200g penne or macaroni', category: 'Carbs', required: true, keywords: ['pasta', 'macaroni'] },
      { name: 'Tomatoes', amount: '2 pureed or 1/2 can', category: 'Produce', required: true, keywords: ['tomato', 'tomatoes'] },
      { name: 'Cream or Butter', amount: '3 tbsp', category: 'Dairy', required: true, keywords: ['cream', 'butter'] },
      { name: 'Garlic & Ginger', amount: '1 tbsp paste', category: 'Flavor', required: true, keywords: ['garlic', 'ginger'] },
      { name: 'Garam Masala', amount: '1 tsp', category: 'Spices', required: true, keywords: ['garam masala', 'spices'] },
      { name: 'Cheese', amount: '2 tbsp grated for garnish', category: 'Dairy', required: false, keywords: ['cheese'] }
    ],
    steps: [
      { step: 1, instruction: 'Boil pasta in salted water until al dente; reserve 1/4 cup cooking water and drain.' },
      { step: 2, instruction: 'Melt butter in a wide pan, cook ginger-garlic paste for 1 minute until fragrant.' },
      { step: 3, instruction: 'Add tomato puree, garam masala, turmeric, and salt. Simmer 5 minutes until thickened.' },
      { step: 4, instruction: 'Pour in cream and stir until sauce turns a silky burnt-orange color.' },
      { step: 5, instruction: 'Toss cooked pasta in the velvety tikka sauce and finish with fresh coriander or grated cheese.' }
    ],
    shortOrderTip: 'Add seared chicken pieces or paneer cubes to make this an ultra-filling restaurant-style entree.',
    substitutions: 'Swap cream for thick Greek yogurt or milk simmered with 1 tbsp flour.',
    wasteSavedLbs: 0.65
  },
  {
    id: 'spicy-masala-potato-tacos',
    title: 'Spicy Masala Potato & Bean Tacos',
    tagline: 'Crispy pan-fried flour tortillas stuffed with turmeric potato hash, black beans & crunchy onions',
    cuisine: 'fusion',
    mealStyle: 'speedy',
    diet: 'veg',
    cookTimeMin: 12,
    difficulty: 'Easy Peasy',
    caloriesEst: 390,
    ingredients: [
      { name: 'Tortillas', amount: '2 small flour/corn', category: 'Carbs', required: true, keywords: ['tortilla', 'tortillas', 'wrap'] },
      { name: 'Potatoes', amount: '1 large boiled & cubed', category: 'Carbs', required: true, keywords: ['potato', 'potatoes', 'aloo'] },
      { name: 'Black Beans or Chana', amount: '1/2 cup cooked', category: 'Protein', required: true, keywords: ['beans', 'black beans', 'chickpeas'] },
      { name: 'Onions & Coriander', amount: 'Finely diced', category: 'Produce', required: true, keywords: ['onion', 'coriander'] },
      { name: 'Cumin & Chaat Masala', amount: '1 tsp', category: 'Spices', required: true, keywords: ['cumin', 'spices'] },
      { name: 'Cheddar or Hot Sauce', amount: 'To taste', category: 'Dairy', required: false, keywords: ['cheddar', 'hotsauce'] }
    ],
    steps: [
      { step: 1, instruction: 'Sauté cubed potatoes and beans in 1 tbsp oil with cumin, turmeric, and salt until potato edges are browned.' },
      { step: 2, instruction: 'Warm tortillas in a dry skillet until flexible.' },
      { step: 3, instruction: 'Spoon the spicy potato-bean filling into each tortilla.' },
      { step: 4, instruction: 'Top with crunchy diced onions, fresh coriander, squeeze of lemon, and hot sauce.' },
      { step: 5, instruction: 'Fold and enjoy with a side of crispy chips.' }
    ],
    shortOrderTip: 'Slightly mashing half of the beans helps hold the taco filling together so it doesn’t spill out when bitten.',
    substitutions: 'Use sweet potatoes or add scrambled eggs for a hearty breakfast taco.',
    wasteSavedLbs: 0.60
  },
  {
    id: 'masala-omelette-burrito',
    title: 'Masala Omelette Breakfast Burrito',
    tagline: 'Two-egg spiced masala omelette rolled in a warm tortilla with melted cheddar & salsa',
    cuisine: 'fusion',
    mealStyle: 'breakfast',
    diet: 'egg',
    cookTimeMin: 10,
    difficulty: 'Easy Peasy',
    caloriesEst: 440,
    ingredients: [
      { name: 'Eggs', amount: '2 fresh', category: 'Protein', required: true, keywords: ['eggs', 'egg', 'anda'] },
      { name: 'Flour Tortilla', amount: '1 large (10-inch)', category: 'Carbs', required: true, keywords: ['tortilla', 'wrap'] },
      { name: 'Sharp Cheddar', amount: '1/3 cup shredded', category: 'Dairy', required: true, keywords: ['cheddar', 'cheese'] },
      { name: 'Onion & Tomatoes', amount: '2 tbsp each minced', category: 'Produce', required: true, keywords: ['onion', 'tomato'] },
      { name: 'Green Chillies', amount: '1 minced', category: 'Produce', required: false, keywords: ['chilli'] },
      { name: 'Butter', amount: '1 tbsp', category: 'Dairy', required: true, keywords: ['butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Whisk eggs with onions, tomatoes, chillies, turmeric, and salt.' },
      { step: 2, instruction: 'Pour into hot buttered skillet to make a large round omelette. Cook 2 minutes until set.' },
      { step: 3, instruction: 'Lay warm tortilla directly on top of the cooked egg in the skillet.' },
      { step: 4, instruction: 'Flip both together so the tortilla is on the skillet floor. Sprinkle cheddar across the egg.' },
      { step: 5, instruction: 'Tightly roll into a burrito cylinder and toast seam-side down until crispy.' }
    ],
    shortOrderTip: 'Flipping the omelette with the tortilla attached welds them together into a seamless breakfast wrap.',
    substitutions: 'Add crispy bacon strips or avocado slices inside.',
    wasteSavedLbs: 0.55
  },
  {
    id: 'butter-chicken-loaded-fries',
    title: 'Butter Chicken Loaded Hashbrown Skillet',
    tagline: 'Crispy golden potato hash smothered in rich butter chicken gravy, chicken chunks & melted cheese',
    cuisine: 'fusion',
    mealStyle: 'comfort',
    diet: 'non-veg',
    cookTimeMin: 16,
    difficulty: 'Short Order Cook',
    caloriesEst: 590,
    ingredients: [
      { name: 'Roasted Chicken', amount: '150g shredded', category: 'Protein', required: true, keywords: ['chicken'] },
      { name: 'Russet Potatoes', amount: '2 cubed/shredded', category: 'Carbs', required: true, keywords: ['potatoes', 'potato'] },
      { name: 'Tomato Sauce / Puree', amount: '1/2 cup', category: 'Produce', required: true, keywords: ['tomato', 'sauce'] },
      { name: 'Butter & Cream', amount: '2 tbsp butter + 2 tbsp cream', category: 'Dairy', required: true, keywords: ['butter', 'cream'] },
      { name: 'Cheddar or Mozzarella', amount: '1/2 cup shredded', category: 'Dairy', required: true, keywords: ['cheese', 'cheddar'] },
      { name: 'Garam Masala', amount: '1 tsp', category: 'Spices', required: true, keywords: ['garam masala'] }
    ],
    steps: [
      { step: 1, instruction: 'Pan-fry diced potatoes in 1 tbsp butter/oil until deeply golden brown and crunchy.' },
      { step: 2, instruction: 'In another small pan, simmer tomato sauce with butter, cream, garam masala, and chicken for 4 minutes.' },
      { step: 3, instruction: 'Pour the bubbling hot butter chicken gravy directly over the crispy potatoes.' },
      { step: 4, instruction: 'Blanket with shredded cheese and cover pan for 2 minutes to melt.' },
      { step: 5, instruction: 'Garnish with green chillies or coriander and serve straight from the skillet.' }
    ],
    shortOrderTip: 'Keep the hashbrowns ultra-crispy before ladling the sauce so you get the ultimate contrast of crunch and velvet.',
    substitutions: 'Make with paneer or crispy pressed tofu for a vegetarian loaded hash.',
    wasteSavedLbs: 0.75
  },
  {
    id: 'spicy-keema-sloppy-joe',
    title: 'Spicy Keema Sloppy Joe on Brioche',
    tagline: 'Spiced minced beef or lamb simmered in aromatics, heaped onto buttered brioche with melted cheese',
    cuisine: 'fusion',
    mealStyle: 'melts',
    diet: 'non-veg',
    cookTimeMin: 16,
    difficulty: 'Short Order Cook',
    caloriesEst: 580,
    ingredients: [
      { name: 'Ground Beef', amount: '200g minced', category: 'Protein', required: true, keywords: ['beef', 'meat'] },
      { name: 'Brioche Buns', amount: '1-2 buns split', category: 'Carbs', required: true, keywords: ['buns', 'bun', 'brioche'] },
      { name: 'Onions & Tomatoes', amount: '1 each finely chopped', category: 'Produce', required: true, keywords: ['onion', 'tomato'] },
      { name: 'Garam Masala & Ginger', amount: '1 tsp each', category: 'Spices', required: true, keywords: ['garam masala', 'ginger'] },
      { name: 'Cheddar Cheese', amount: '1 slice', category: 'Dairy', required: false, keywords: ['cheese', 'cheddar'] },
      { name: 'Butter', amount: '1.5 tbsp', category: 'Dairy', required: true, keywords: ['butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Heat butter in a skillet. Sauté onions and ginger-garlic until lightly caramelized.' },
      { step: 2, instruction: 'Add ground meat, break up with spatula, and brown over high heat for 5 minutes.' },
      { step: 3, instruction: 'Add tomatoes, garam masala, cumin, and salt. Simmer 6 minutes until rich and thick.' },
      { step: 4, instruction: 'Toast brioche buns in butter until glossy and golden.' },
      { step: 5, instruction: 'Ladle the steaming spiced keema onto bun base, add a slice of cheese, and cap with top bun.' }
    ],
    shortOrderTip: 'Toast the brioche bun deeply so it stands up to the juicy keema without disintegrating.',
    substitutions: 'Works identically with minced chicken, turkey, or crushed soya chunks.',
    wasteSavedLbs: 0.80
  },
  {
    id: 'crispy-gobi-manchurian-wraps',
    title: 'Crispy Cauliflower (Gobi) Manchurian Wraps',
    tagline: 'Pan-roasted cauliflower florets tossed in sweet-spicy garlic glaze, rolled in warm tortillas',
    cuisine: 'fusion',
    mealStyle: 'speedy',
    diet: 'veg',
    cookTimeMin: 14,
    difficulty: 'Short Order Cook',
    caloriesEst: 410,
    ingredients: [
      { name: 'Cauliflower', amount: '1.5 cups bite-sized florets', category: 'Produce', required: true, keywords: ['cauliflower', 'gobi'] },
      { name: 'Tortillas or Flatbread', amount: '2 pieces', category: 'Carbs', required: true, keywords: ['tortilla', 'tortillas', 'roti'] },
      { name: 'Capsicum & Onions', amount: '1/2 cup diced', category: 'Produce', required: true, keywords: ['capsicum', 'onion'] },
      { name: 'Garlic & Chillies', amount: '1 tbsp minced', category: 'Produce', required: true, keywords: ['garlic', 'chilli'] },
      { name: 'Hot Sauce or Ketchup', amount: '2 tbsp', category: 'Flavor', required: true, keywords: ['sauce', 'hotsauce', 'ketchup'] }
    ],
    steps: [
      { step: 1, instruction: 'Sear dry cauliflower florets in 2 tbsp hot oil until crisp and brown at the edges (6 minutes).' },
      { step: 2, instruction: 'Toss in minced garlic, green chillies, onions, and capsicum; stir-fry 2 minutes on high heat.' },
      { step: 3, instruction: 'Drizzle hot sauce, splash of soy or ketchup, and toss rapidly to glaze every floret.' },
      { step: 4, instruction: 'Warm tortillas in dry skillet.' },
      { step: 5, instruction: 'Fill warm tortillas with the crunchy glazed gobi and roll snugly.' }
    ],
    shortOrderTip: 'High heat is key—sear the cauliflower fast so the florets stay tender-crisp rather than soft.',
    substitutions: 'Swap cauliflower for crispy tofu cubes or paneer.',
    wasteSavedLbs: 0.65
  },
  {
    id: 'curried-egg-salad-toast',
    title: 'Curried Egg Salad Toast with Pickled Onions',
    tagline: 'Creamy smashed boiled eggs with mild yellow curry powder & celery on buttered sourdough',
    cuisine: 'fusion',
    mealStyle: 'breakfast',
    diet: 'egg',
    cookTimeMin: 10,
    difficulty: 'Easy Peasy',
    caloriesEst: 390,
    ingredients: [
      { name: 'Eggs', amount: '2 hard boiled', category: 'Protein', required: true, keywords: ['eggs', 'egg', 'anda'] },
      { name: 'Sourdough Bread', amount: '2 slices', category: 'Carbs', required: true, keywords: ['sourdough', 'bread'] },
      { name: 'Curry Powder or Garam Masala', amount: '1/2 tsp', category: 'Spices', required: true, keywords: ['garam masala', 'spices'] },
      { name: 'Onions or Pickles', amount: '2 tbsp finely chopped', category: 'Produce', required: true, keywords: ['onion', 'pickles'] },
      { name: 'Butter or Mayo', amount: '1.5 tbsp', category: 'Dairy', required: true, keywords: ['butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Roughly chop hard-boiled eggs with a fork in a bowl.' },
      { step: 2, instruction: 'Mix in curry powder, pinch of turmeric, salt, black pepper, and mayo or softened butter.' },
      { step: 3, instruction: 'Toast sourdough slices in butter on the skillet until crisp and golden.' },
      { step: 4, instruction: 'Spread curried egg salad generously over the hot toast.' },
      { step: 5, instruction: 'Top with pickled onions or fresh coriander.' }
    ],
    shortOrderTip: 'A pinch of turmeric and curry powder gives humble egg salad an irresistible golden glow and warmth.',
    substitutions: 'Can also be packed inside a croissant or rolled in a tortilla.',
    wasteSavedLbs: 0.50
  },
  {
    id: 'desi-spiced-grilled-cheese',
    title: 'Desi Spiced Grilled Cheese with Green Chutney',
    tagline: 'Oozing sharp cheddar, spicy green herb spread & crisp sliced tomatoes on griddled bread',
    cuisine: 'fusion',
    mealStyle: 'melts',
    diet: 'veg',
    cookTimeMin: 8,
    difficulty: 'Easy Peasy',
    caloriesEst: 430,
    ingredients: [
      { name: 'Bread or Sourdough', amount: '2 slices', category: 'Carbs', required: true, keywords: ['bread', 'sourdough'] },
      { name: 'Sharp Cheddar or Mozzarella', amount: '2 slices', category: 'Dairy', required: true, keywords: ['cheddar', 'cheese'] },
      { name: 'Coriander or Green Chutney', amount: '2 tbsp', category: 'Produce', required: true, keywords: ['coriander', 'chutney'] },
      { name: 'Tomatoes', amount: '2 thin slices', category: 'Produce', required: false, keywords: ['tomato', 'tomatoes'] },
      { name: 'Chaat Masala', amount: 'Pinch', category: 'Spices', required: false, keywords: ['spices'] },
      { name: 'Butter', amount: '2 tbsp', category: 'Dairy', required: true, keywords: ['butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Spread green coriander chutney on the inner faces of both bread slices.' },
      { step: 2, instruction: 'Layer sharp cheddar, tomato slices, pinch of chaat masala, and second cheese slice.' },
      { step: 3, instruction: 'Butter the outsides generously.' },
      { step: 4, instruction: 'Griddle in skillet over medium-low heat for 3 minutes per side until deep golden brown.' },
      { step: 5, instruction: 'Cut in half and enjoy the spicy, gooey cheese pull.' }
    ],
    shortOrderTip: 'Chaat masala sprinkled over the tomatoes brings an authentic Mumbai sandwich zing.',
    substitutions: 'Any cheese that melts well (cheddar, provolone, mozzarella) works wonderfully.',
    wasteSavedLbs: 0.55
  },
  {
    id: 'tandoori-chicken-quesadilla',
    title: 'Tandoori Chicken Quesadilla with Cheddar',
    tagline: 'Spiced chicken bites, peppers & molten cheese pressed in a crispy golden tortilla',
    cuisine: 'fusion',
    mealStyle: 'melts',
    diet: 'non-veg',
    cookTimeMin: 12,
    difficulty: 'Short Order Cook',
    caloriesEst: 540,
    ingredients: [
      { name: 'Roasted Chicken', amount: '150g diced', category: 'Protein', required: true, keywords: ['chicken'] },
      { name: 'Flour Tortilla', amount: '1 large', category: 'Carbs', required: true, keywords: ['tortilla', 'wrap'] },
      { name: 'Sharp Cheddar or Mozzarella', amount: '1/2 cup shredded', category: 'Dairy', required: true, keywords: ['cheddar', 'cheese'] },
      { name: 'Capsicum & Onions', amount: '1/3 cup diced', category: 'Produce', required: true, keywords: ['capsicum', 'onion'] },
      { name: 'Garam Masala or Tikka Spices', amount: '1 tsp', category: 'Spices', required: true, keywords: ['garam masala', 'spices'] },
      { name: 'Butter', amount: '1 tbsp', category: 'Dairy', required: true, keywords: ['butter'] }
    ],
    steps: [
      { step: 1, instruction: 'Quickly toss diced chicken and peppers in 1 tsp butter with tikka spices and salt.' },
      { step: 2, instruction: 'Lay tortilla in buttered skillet over medium heat.' },
      { step: 3, instruction: 'Cover half the tortilla with cheese, hot spiced chicken, and remaining cheese.' },
      { step: 4, instruction: 'Fold over and press down with spatula. Cook 3 minutes per side until golden brown.' },
      { step: 5, instruction: 'Cut into triangles and serve with sour cream or spicy ketchup.' }
    ],
    shortOrderTip: 'Pressing firmly with your spatula while cooking creates an even, crunchy quesadilla shell.',
    substitutions: 'Swap chicken for paneer cubes or black beans.',
    wasteSavedLbs: 0.70
  },
  {
    id: 'spiced-egg-bhurji-hotdog-roll',
    title: 'Spiced Egg Bhurji Brioche Roll',
    tagline: 'Buttery scrambled eggs with chillies, onions & coriander loaded into toasted brioche',
    cuisine: 'fusion',
    mealStyle: 'speedy',
    diet: 'egg',
    cookTimeMin: 8,
    difficulty: 'Easy Peasy',
    caloriesEst: 410,
    ingredients: [
      { name: 'Eggs', amount: '2 fresh', category: 'Protein', required: true, keywords: ['eggs', 'egg', 'anda'] },
      { name: 'Brioche Bun or Pav', amount: '1 split bun', category: 'Carbs', required: true, keywords: ['buns', 'bun', 'pav', 'bread'] },
      { name: 'Onions & Green Chillies', amount: '2 tbsp each minced', category: 'Produce', required: true, keywords: ['onion', 'chilli'] },
      { name: 'Tomatoes', amount: '2 tbsp diced', category: 'Produce', required: false, keywords: ['tomato'] },
      { name: 'Butter', amount: '2 tbsp', category: 'Dairy', required: true, keywords: ['butter'] },
      { name: 'Coriander', amount: '1 tbsp fresh', category: 'Produce', required: false, keywords: ['coriander'] }
    ],
    steps: [
      { step: 1, instruction: 'Melt 1 tbsp butter in skillet. Sauté onions and chillies for 1 minute.' },
      { step: 2, instruction: 'Pour in beaten eggs and scramble on medium-low for 90 seconds until soft curds form.' },
      { step: 3, instruction: 'Toast brioche roll or bun in remaining butter until golden and fragrant.' },
      { step: 4, instruction: 'Spoon the warm, fluffy egg bhurji into the toasted roll.' },
      { step: 5, instruction: 'Top with chopped coriander and serve hot.' }
    ],
    shortOrderTip: 'Pull the eggs off heat while they are still slightly glossy; residual heat will finish them to perfection.',
    substitutions: 'Add a slice of melted cheese or crispy bacon.',
    wasteSavedLbs: 0.50
  }
];

/**
 * Intelligent Recipe Matching Engine
 * Selects the best curated recipe matching:
 * - Selected ingredients (from roulette reels or manual picks)
 * - User's pantry stock (inFridge, expiring soon)
 * - Cuisine filter ('all', 'indian', 'western', 'fusion')
 * - Meal filter ('all', 'breakfast', 'melts', 'speedy')
 */
export function matchBestRecipe(
  selected: {
    protein: Ingredient;
    carb: Ingredient;
    produce: Ingredient;
    flavor: Ingredient;
  },
  pantry: Ingredient[],
  cuisineFilter: 'all' | CuisineType = 'all',
  mealFilter: 'all' | MealCategory = 'all',
  chaosTwist?: string
): DinerRecipe {
  // Pool of candidate recipes filtered by cuisine and meal filter
  let candidates = CURATED_RECIPES.filter(recipe => {
    if (cuisineFilter !== 'all' && recipe.cuisine !== cuisineFilter) {
      return false;
    }
    if (mealFilter !== 'all') {
      if (mealFilter === 'speedy' && recipe.cookTimeMin > 15) return false;
      if (mealFilter === 'breakfast' && recipe.mealStyle !== 'breakfast') return false;
      if (mealFilter === 'melts' && recipe.mealStyle !== 'melts') return false;
    }
    return true;
  });

  // If filter is too strict, fallback to matching by cuisine only or full pool
  if (candidates.length === 0) {
    candidates = CURATED_RECIPES.filter(r => cuisineFilter === 'all' || r.cuisine === cuisineFilter);
  }
  if (candidates.length === 0) {
    candidates = CURATED_RECIPES;
  }

  const selectedKeywords = [
    selected.protein.name.toLowerCase(),
    selected.protein.id.toLowerCase(),
    selected.carb.name.toLowerCase(),
    selected.carb.id.toLowerCase(),
    selected.produce.name.toLowerCase(),
    selected.produce.id.toLowerCase(),
    selected.flavor.name.toLowerCase(),
    selected.flavor.id.toLowerCase(),
  ];

  // Map user pantry items for fast keyword & expiry lookups
  const pantryItemsInStock = pantry.filter(item => item.inFridge);
  const expiringPantryItemNames = pantryItemsInStock
    .filter(item => {
      if (item.expiringSoon) return true;
      if (!item.expiryDate) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [y, m, d] = item.expiryDate.split('-').map(Number);
      const exp = new Date(y, m - 1, d);
      exp.setHours(0, 0, 0, 0);
      const diff = Math.round((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 3;
    })
    .map(i => i.name.toLowerCase());

  // Score candidates
  let bestScore = -1;
  let bestRecipeDef = candidates[0];

  for (const def of candidates) {
    let score = 0;

    for (const req of def.ingredients) {
      // Check match against spun 4 items
      const matchesSpun = req.keywords.some(k =>
        selectedKeywords.some(sk => sk.includes(k) || k.includes(sk))
      );
      if (matchesSpun) {
        score += req.required ? 10 : 5;
      }

      // Check match against user's active pantry
      const inPantry = pantryItemsInStock.some(p =>
        req.keywords.some(k => p.name.toLowerCase().includes(k) || p.id.toLowerCase().includes(k))
      );
      if (inPantry) {
        score += req.required ? 8 : 4;
      }

      // Priority boost if user has expiring items used in this recipe
      const isExpiring = expiringPantryItemNames.some(expName =>
        req.keywords.some(k => expName.includes(k))
      );
      if (isExpiring) {
        score += 15; // Huge bonus for saving expiring food!
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestRecipeDef = def;
    }
  }

  // Build the complete DinerRecipe instance
  const orderNum = Math.floor(1000 + Math.random() * 9000);
  const tableNum = Math.floor(1 + Math.random() * 18);

  const enrichedIngredients: RecipeIngredient[] = bestRecipeDef.ingredients.map(ing => {
    // Check if ingredient is currently in user's pantry
    const matchedPantryItem = pantry.find(p =>
      ing.keywords.some(k => p.name.toLowerCase().includes(k) || p.id.toLowerCase().includes(k))
    );

    const inPantry = matchedPantryItem ? matchedPantryItem.inFridge : false;
    const isMissing = !inPantry;

    let isExpiring = false;
    if (matchedPantryItem && matchedPantryItem.inFridge) {
      if (matchedPantryItem.expiringSoon) isExpiring = true;
      if (matchedPantryItem.expiryDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [y, m, d] = matchedPantryItem.expiryDate.split('-').map(Number);
        const exp = new Date(y, m - 1, d);
        exp.setHours(0, 0, 0, 0);
        const diff = Math.round((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff >= 0 && diff <= 3) isExpiring = true;
      }
    }

    const emoji = getIngredientEmoji(ing.name, matchedPantryItem?.category);

    return {
      name: ing.name,
      amount: ing.amount,
      emoji,
      category: ing.category,
      inPantry,
      required: ing.required,
      isMissing,
      isExpiring,
      substitution: ing.substitution || (ing.required ? 'Check substitution tips below' : 'Optional—can omit')
    };
  });

  return {
    id: `${bestRecipeDef.id}-${Date.now()}`,
    title: bestRecipeDef.title,
    tagline: bestRecipeDef.tagline,
    orderNumber: orderNum,
    tableNumber: tableNum,
    cookTimeMin: bestRecipeDef.cookTimeMin,
    difficulty: bestRecipeDef.difficulty,
    caloriesEst: bestRecipeDef.caloriesEst,
    cuisine: bestRecipeDef.cuisine,
    mealStyle: bestRecipeDef.mealStyle,
    diet: bestRecipeDef.diet,
    ingredients: enrichedIngredients,
    steps: bestRecipeDef.steps,
    shortOrderTip: bestRecipeDef.shortOrderTip,
    substitutions: bestRecipeDef.substitutions,
    chaosTwist,
    wasteSavedLbs: bestRecipeDef.wasteSavedLbs,
    matchScore: bestScore
  };
}

/**
 * Backward compatibility wrapper
 */
export function generateDinerRecipe(
  selected: {
    protein: Ingredient;
    carb: Ingredient;
    produce: Ingredient;
    flavor: Ingredient;
  },
  chaosTwist?: string,
  pantry?: Ingredient[],
  cuisineFilter: 'all' | CuisineType = 'all',
  mealFilter: 'all' | MealCategory = 'all'
): DinerRecipe {
  return matchBestRecipe(
    selected,
    pantry || [selected.protein, selected.carb, selected.produce, selected.flavor],
    cuisineFilter,
    mealFilter,
    chaosTwist
  );
}
