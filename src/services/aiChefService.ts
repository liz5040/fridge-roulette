import type { Ingredient } from '../data/ingredients';
import { generateDinerRecipe } from '../data/recipes';
import type { DinerRecipe, CuisineType, MealCategory, DietType } from '../data/recipes';

export interface AiChefRequestOptions {
  prompt?: string;
  pantry: Ingredient[];
  selectedReels?: {
    protein: Ingredient;
    carb: Ingredient;
    produce: Ingredient;
    flavor: Ingredient;
  };
  cuisineFilter?: 'all' | CuisineType;
  mealFilter?: 'all' | MealCategory;
  dietaryPreference?: 'all' | DietType;
  chaosTwist?: string;
  signal?: AbortSignal;
}

export interface AiChefResult {
  recipe: DinerRecipe;
  isAi: boolean;
  message?: string;
  notice?: {
    type: 'info' | 'warning' | 'error';
    text: string;
  };
}

/**
 * Calls the secure backend endpoint /api/chef powered by Groq.
 * If the Groq API key is unconfigured, offline, or returns an error,
 * it seamlessly and gracefully falls back to the verified rule-based matching engine.
 */
export async function requestAiChefRecipe(options: AiChefRequestOptions): Promise<AiChefResult> {
  const { prompt, pantry, selectedReels, cuisineFilter = 'all', mealFilter = 'all', dietaryPreference = 'all', chaosTwist, signal } = options;

  try {
    const response = await fetch('/api/chef', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        pantry,
        cuisineFilter,
        mealFilter,
        dietaryPreference,
        chaosTwist,
      }),
      signal,
    });

    const data = await response.json();

    if (response.ok && data.success && data.recipe) {
      return {
        recipe: data.recipe,
        isAi: true,
        message: 'Cooked fresh by the Short-Order AI Chef (Groq Llama 3.3)!',
      };
    }

    // Server returned an error or missing key
    const warningMsg =
      data.error === 'MISSING_API_KEY'
        ? 'Chef’s AI line is offline (add GROQ_API_KEY in .env). Switched to House Verified Recipe matching!'
        : data.message || 'AI Chef line busy. Switched to House Verified Recipe matching!';

    // Fallback to verified rule-based engine
    const fallbackRecipe = createVerifiedFallbackRecipe(selectedReels, pantry, cuisineFilter, mealFilter, chaosTwist, prompt);
    fallbackRecipe.matchReason = warningMsg;

    return {
      recipe: fallbackRecipe,
      isAi: false,
      notice: {
        type: 'warning',
        text: warningMsg,
      },
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }

    console.warn('AI Chef backend unreachable, falling back to verified recipes:', err);
    const fallbackRecipe = createVerifiedFallbackRecipe(selectedReels, pantry, cuisineFilter, mealFilter, chaosTwist, prompt);
    fallbackRecipe.matchReason = 'Network/AI service unreachable. Switched to verified Diner House Special!';

    return {
      recipe: fallbackRecipe,
      isAi: false,
      notice: {
        type: 'warning',
        text: 'Chef’s AI service unreachable. Showing verified House Special recipe!',
      },
    };
  }
}

/**
 * Creates a verified curated recipe using the existing rule-based engine
 */
function createVerifiedFallbackRecipe(
  selectedReels: AiChefRequestOptions['selectedReels'],
  pantry: Ingredient[],
  cuisineFilter: 'all' | CuisineType,
  mealFilter: 'all' | MealCategory,
  chaosTwist?: string,
  userPrompt?: string
): DinerRecipe {
  const inStock = pantry.filter(i => i.inFridge);
  const pool = inStock.length >= 4 ? inStock : pantry;

  const protein = selectedReels?.protein || pool.find(i => i.category === 'protein') || pool[0];
  const carb = selectedReels?.carb || pool.find(i => i.category === 'carb') || pool[1] || pool[0];
  const produce = selectedReels?.produce || pool.find(i => i.category === 'produce') || pool[2] || pool[0];
  const flavor = selectedReels?.flavor || pool.find(i => i.category === 'flavor' || i.category === 'dairy' || i.category === 'spices') || pool[3] || pool[0];

  const recipe = generateDinerRecipe(
    { protein, carb, produce, flavor },
    chaosTwist,
    pantry,
    cuisineFilter,
    mealFilter
  );

  if (userPrompt) {
    recipe.tagline = `${recipe.tagline} (Tailored for: "${userPrompt}")`;
  }

  recipe.isAiGenerated = false;
  return recipe;
}
