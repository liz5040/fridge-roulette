# 🎰 Fridge Roulette — Retro American Diner Cooking Game

A mobile-first cooking companion and meal generator that combines playful food-app design with a nostalgic 1950s retro American diner aesthetic.

---

## 🎨 Visual Identity & Design System

- **Color Palette**:
  - **Tomato Red** (`#E53935` / `#D32F2F`) — Primary action & header banners
  - **Butter Yellow** (`#FBC02D` / `#FFF9C4`) — Diner chrome, accents & badges
  - **Warm Cream** (`#FFFDF8` / `#FBF5E6`) — Cozy background & guest checks
  - **Diner Coffee Ink** (`#2B170C`) — High-contrast borders, tactile drop shadows & typography
- **Typography**:
  - `Titan One` — Big retro marquee headings & scores
  - `Fredoka` — Bold, rounded, cheerful buttons & titles
  - `Plus Jakarta Sans` — Clean, ultra-readable body copy
  - `Special Elite` — Vintage diner guest check order slips & rubber stamps
- **Tactile Details**:
  - 3D physical push-buttons with mechanical depression (`btn-tactile-red`, `btn-tactile-yellow`)
  - Subtle diner checkerboard patterns
  - Realistic slot machine mechanical lever & reels
  - Flashing neon sign marquee bulbs

---

## 🍳 Key Features

1. **Lucky Diner Slot Machine Spinner**:
   - 4 Spinning Reels: **Protein**, **Base / Carb**, **Produce**, and **Melter / Sauce**.
   - **HOLD / LOCK Mechanics**: Hold leftover ingredients and spin for companions.
   - **Chaos Mystery Twist (🌶️)**: Adds surprise diner cooking challenges.
   - **Meal Style Filter**: All Grub, Breakfast & Hash, Melts, or Under 15m.
   - **Interactive Mechanical Lever**: Pull down the vintage lever or press the big tomato button.

2. **Web Audio Sound Effects Synthesizer (Zero External MP3s)**:
   - Mechanical slot reel ticks with pitch variations.
   - Ratchet lever spring pulls.
   - Brass diner counter service bell (`DING! Order up!`).
   - Sizzling griddle sound effect during Cook Mode.
   - 1950s diner Doo-Wop Jukebox tunes toggle.

3. **Chef's Diner Guest Check**:
   - Vintage perforated order ticket with stamps and table numbers.
   - Ingredients breakdown with smart pantry substitution suggestions.
   - Interactive step-by-step checklist.
   - *"Short-Order Cook Secret"* diner pro-tips.

4. **Hands-Free Kitchen Cook Mode**:
   - Designed for propping the phone next to the skillet.
   - High-contrast large text and step navigation.
   - Built-in retro griddle timer with automatic sizzling audio and ding alert.
   - Confetti blast celebration when the plate is completed.

5. **Fridge Pantry & Inventory Manager**:
   - 1-tap stock status toggling & "Expiring Soon" priority badges.
   - 1-tap Quick Restock Presets: *Classic Diner 1955*, *Midnight Melts*, *Zero Waste Sweep*, *Green & Cheesy*.
   - Custom ingredient adder with emoji picker.

6. **Diner Hall of Fame & Badges**:
   - Lifetime stats: Spins pulled, Orders plated, Food waste saved (lbs), and Estimated money saved ($).
   - Unlockable retro diner merit badges (*Short-Order Rookie*, *Griddle Master*, *Zero-Waste Champion*, etc.).
   - Saved favorite recipe collection.

---

## 🛠️ Tech Stack

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Canvas Confetti**
- **Web Audio API**

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev

# Build for production
npm run build
```

