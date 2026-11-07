import type { Ingredient } from '../src/data/ingredients.ts';
import type { DinerRecipe, CuisineType, DietType, MealCategory } from '../src/data/recipes.ts';

export interface ChefRequestPayload {
  prompt?: string;
  pantry: Ingredient[];
  cuisineFilter?: 'all' | CuisineType;
  mealFilter?: 'all' | MealCategory;
  dietaryPreference?: 'all' | DietType;
  chaosTwist?: string;
}

export interface ChefResponseSuccess {
  success: true;
  recipe: DinerRecipe;
  source: 'groq_ai';
}

export interface ChefResponseFallback {
  success: false;
  error: string;
  message: string;
  source: 'fallback_rule_based';
}

export type ChefResponse = ChefResponseSuccess | ChefResponseFallback;

/**
 * Calls the Groq API securely on the server with user's fridge context.
 * Never exposes the GROQ_API_KEY to the browser.
 */
export async function generateRecipeWithGroq(
  payload: ChefRequestPayload,
  apiKey: string
): Promise<DinerRecipe> {
  const { prompt, pantry, cuisineFilter, mealFilter, dietaryPreference, chaosTwist } = payload;

  // Filter in-fridge items vs out-of-stock items
  const inFridgeItems = pantry.filter(i => i.inFridge);
  const expiringItems = inFridgeItems.filter(i => {
    if (i.expiringSoon) return true;
    if (!i.expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = i.expiryDate.split('-').map(Number);
    const exp = new Date(y, m - 1, d);
    exp.setHours(0, 0, 0, 0);
    const diff = Math.round((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 3;
  });

  const fridgeSummary = inFridgeItems
    .map(i => {
      const isExp = expiringItems.some(exp => exp.id === i.id);
      return `- ${i.name} (${i.quantity} ${i.unit}, category: ${i.category}${isExp ? ' [EXPIRING SOON - HIGH PRIORITY]' : ''})`;
    })
    .join('\n');

  const systemInstructions = `You are the Head Short-Order Chef of "Fridge Roulette", a nostalgic 1950s retro American diner famous for creative comfort food across three culinary traditions:
1. Indian (South Indian, Kerala, North Indian, street style, homestyle)
2. Western (diner melts, smash burgers, skillet hash, pasta, comfort classics)
3. Fusion (Paneer Quesadillas, Masala Mac & Cheese, Chilli Cheese Toast, Curry Pasta, Spicy Potato Tacos)

RULES:
1. You MUST examine the user's available fridge ingredients provided below.
2. STICK TO REALITY: Never claim an ingredient is currently in their fridge unless it appears in the AVAILABLE INGREDIENTS list.
3. If an essential ingredient (like a common condiment, bread, or cooking oil) is needed but NOT in their fridge, list it with "inPantry": false and "isMissing": true, and provide a realistic "substitution".
4. PRIORITIZE items marked [EXPIRING SOON - HIGH PRIORITY] to rescue food waste.
5. Provide a warm, 1-2 sentence "matchReason" explaining why this dish fits their available ingredients and natural-language craving.
6. Return purely valid JSON according to the schema provided without markdown code blocks.`;

  const userQuery = `USER REQUEST: "${prompt || 'Surprise me with a delicious diner meal from my fridge!'}"
CUISINE PREFERENCE: ${cuisineFilter || 'all'}
STYLE PREFERENCE: ${mealFilter || 'all'}
DIETARY PREFERENCE: ${dietaryPreference || 'all'}
${chaosTwist ? `CHAOS RULE: "${chaosTwist}"` : ''}

AVAILABLE INGREDIENTS IN USER'S FRIDGE:
${fridgeSummary || 'Fridge is currently empty! Use pantry staples with clear missing flags.'}

Respond ONLY with a JSON object matching this schema:
{
  "title": "Retro Diner Dish Name",
  "tagline": "Punchy mouthwatering one-sentence description",
  "cuisine": "indian" | "western" | "fusion",
  "mealStyle": "breakfast" | "melts" | "speedy" | "comfort" | "dinner",
  "diet": "veg" | "egg" | "non-veg",
  "cookTimeMin": 15,
  "difficulty": "Easy Peasy" | "Short Order Cook" | "Griddle Master",
  "caloriesEst": 480,
  "matchReason": "Why this dish matches your fridge and request in 1-2 friendly sentences",
  "ingredients": [
    {
      "name": "Ingredient Name",
      "amount": "Exact quantity (e.g. 200g, 2 slices)",
      "category": "Protein" | "Carbs" | "Produce" | "Dairy" | "Spices" | "Flavor",
      "required": true | false,
      "inPantry": true | false,
      "isMissing": true | false,
      "substitution": "Alternative if missing"
    }
  ],
  "steps": [
    {
      "step": 1,
      "instruction": "Detailed, practical step-by-step cooking instruction",
      "tip": "Short-order tip or timing advice"
    }
  ],
  "shortOrderTip": "Secret diner tip for this dish",
  "substitutions": "Summary of substitutions for missing ingredients",
  "wasteSavedLbs": 0.75
}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: userQuery },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.65,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API responded with status ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error('Groq returned an empty response.');
  }

  const parsed = JSON.parse(rawContent);

  // Validate and post-process ingredients against user's actual pantry
  const processedIngredients = (parsed.ingredients || []).map((ing: any) => {
    const lowerName = (ing.name || '').toLowerCase();
    const matchedPantryItem = inFridgeItems.find(p => {
      const pName = p.name.toLowerCase();
      return pName.includes(lowerName) || lowerName.includes(pName) || p.id.toLowerCase() === lowerName;
    });

    const isActualInPantry = !!matchedPantryItem;
    const isExp = matchedPantryItem
      ? expiringItems.some(exp => exp.id === matchedPantryItem.id)
      : false;

    return {
      name: ing.name || 'Pantry Item',
      amount: ing.amount || '1 portion',
      emoji: ing.emoji || matchedPantryItem?.emoji || '🍽️',
      category: ing.category || matchedPantryItem?.category || 'Produce',
      inPantry: isActualInPantry,
      required: ing.required !== false,
      isMissing: !isActualInPantry,
      isExpiring: isExp,
      substitution: ing.substitution || (!isActualInPantry ? 'Check pantry for similar items' : undefined),
    };
  });

  const orderNum = Math.floor(1000 + Math.random() * 9000);
  const tableNum = Math.floor(1 + Math.random() * 18);

  const finalRecipe: DinerRecipe = {
    id: `ai-chef-${Date.now()}`,
    title: parsed.title || 'Chef Special of the Day',
    tagline: parsed.tagline || 'Crafted especially for your fridge by the AI Diner Chef',
    orderNumber: orderNum,
    tableNumber: tableNum,
    cookTimeMin: Number(parsed.cookTimeMin) || 15,
    difficulty: parsed.difficulty || 'Short Order Cook',
    caloriesEst: Number(parsed.caloriesEst) || 480,
    cuisine: (parsed.cuisine as CuisineType) || (cuisineFilter && cuisineFilter !== 'all' ? (cuisineFilter as CuisineType) : 'fusion'),
    mealStyle: (parsed.mealStyle as MealCategory) || (mealFilter && mealFilter !== 'all' ? (mealFilter as MealCategory) : 'comfort'),
    diet: (parsed.diet as DietType) || (dietaryPreference && dietaryPreference !== 'all' ? (dietaryPreference as DietType) : 'veg'),
    ingredients: processedIngredients,
    steps: Array.isArray(parsed.steps) ? parsed.steps : [],
    shortOrderTip: parsed.shortOrderTip || 'Always warm your skillet before food touches the surface.',
    substitutions: parsed.substitutions || 'Any similar ingredients in your fridge will work nicely.',
    chaosTwist,
    wasteSavedLbs: Number(parsed.wasteSavedLbs) || 0.75,
    matchReason: parsed.matchReason || 'Curated to match your fridge items and reduce food waste.',
    isAiGenerated: true,
  };

  return finalRecipe;
}
