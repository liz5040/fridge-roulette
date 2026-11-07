import React, { useState } from 'react';
import {
  Plus,
  Check,
  Clock,
  Sparkles,
  Pencil,
  Trash2,
  X,
  Search,
  AlertTriangle,
  Calendar,
  Layers,
  ChefHat,
  Info,
} from 'lucide-react';
import {
  PANTRY_PRESETS,
  CATEGORY_LABELS,
  UNIT_LABELS,
  getExpiryInfo,
  getDateOffset,
} from '../data/ingredients';
import type {
  Ingredient,
  IngredientCategory,
  IngredientUnit,
  PantryPreset,
} from '../data/ingredients';
import { sounds } from '../utils/soundEffects';
import { resolveIngredientIcon, IngredientIcon } from '../utils/ingredientIcons';

interface FridgePantryProps {
  pantry: Ingredient[];
  onToggleInFridge: (id: string) => void;
  onToggleExpiringSoon: (id: string) => void;
  onApplyPreset: (preset: PantryPreset) => void;
  onAddOrUpdateIngredient: (item: Omit<Ingredient, 'id'>, existingId?: string) => { updated: boolean; name: string };
  onDeleteIngredient: (id: string) => void;
  notificationMessage?: string | null;
  onClearNotification?: () => void;
}

const COMMON_EMOJIS = [
  '🥓', '🍳', '🥩', '🍗', '🌭', '🐟', '🫘', '🧈',
  '🍞', '🍔', '🥔', '🧇', '🫓', '🍜', '🍚', '🥯',
  '🍅', '🥬', '🧅', '🥒', '🫑', '🍄', '🥗', '🥑',
  '🧀', '🥛', '🍦', '🥣', '🍁', '🍯', '🌶️', '🧄',
  '🧂', '🥫', '📦', '🍽️'
];

export const FridgePantry: React.FC<FridgePantryProps> = ({
  pantry,
  onToggleInFridge,
  onApplyPreset,
  onAddOrUpdateIngredient,
  onDeleteIngredient,
}) => {
  // Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // Stock Status Filter ('all' | 'in_fridge' | 'expiring' | 'expired')
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_fridge' | 'expiring' | 'expired'>('all');
  // Search query
  const [searchQuery, setSearchQuery] = useState('');
  // Collapsible Quick Presets state (collapsed by default to give inventory priority!)
  const [showPresets, setShowPresets] = useState(false);

  // Local Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<IngredientCategory>('protein');
  const [formQuantity, setFormQuantity] = useState<string>('1');
  const [formUnit, setFormUnit] = useState<IngredientUnit>('pieces');
  const [formEmoji, setFormEmoji] = useState('🥓');
  const [formExpiryDate, setFormExpiryDate] = useState('');
  const [formInFridge, setFormInFridge] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [deletingItem, setDeletingItem] = useState<Ingredient | null>(null);

  // Show Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(current => (current === msg ? null : current));
    }, 3800);
  };

  // Open Add Modal
  const handleOpenAddModal = (presetCategory?: IngredientCategory) => {
    sounds.playBoop(550);
    setEditingItem(null);
    setFormName('');
    setFormCategory(presetCategory || 'protein');
    setFormQuantity('1');
    setFormUnit(presetCategory === 'produce' || presetCategory === 'dairy' ? 'grams' : 'pieces');
    setFormEmoji(presetCategory ? CATEGORY_LABELS[presetCategory]?.emoji || '🍽️' : '🥓');
    setFormExpiryDate('');
    setFormInFridge(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: Ingredient) => {
    sounds.playBoop(550);
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormQuantity(String(item.quantity || 1));
    setFormUnit(item.unit || 'pieces');
    setFormEmoji(item.emoji || '🍽️');
    setFormExpiryDate(item.expiryDate || '');
    setFormInFridge(item.inFridge);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Submit Add or Edit Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = formName.trim();
    if (!trimmed) {
      setFormError('Please enter an ingredient name.');
      sounds.playBoop(300);
      return;
    }

    const qtyNum = parseFloat(formQuantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setFormError('Please enter a valid quantity greater than 0.');
      sounds.playBoop(300);
      return;
    }

    sounds.playBoop(750);

    const payload: Omit<Ingredient, 'id'> = {
      name: trimmed,
      category: formCategory,
      // Auto-detect icon: use registry first, then user-chosen formEmoji
      emoji: resolveIngredientIcon(trimmed, formCategory).emoji || formEmoji,
      quantity: Number(qtyNum.toFixed(2)),
      unit: formUnit,
      inFridge: formInFridge,
      expiryDate: formExpiryDate.trim() ? formExpiryDate.trim() : undefined,
      dinerDesc: editingItem?.dinerDesc || 'Custom diner pantry essential',
    };

    const result = onAddOrUpdateIngredient(payload, editingItem ? editingItem.id : undefined);

    setIsModalOpen(false);

    if (editingItem) {
      triggerToast(`★ Updated "${payload.name}" in pantry!`);
    } else if (result.updated) {
      triggerToast(`★ Updated existing "${result.name}" quantity to ${payload.quantity} ${payload.unit}!`);
    } else {
      triggerToast(`★ Added "${payload.name}" (${payload.quantity} ${payload.unit}) to your fridge!`);
    }
  };

  // Delete Action
  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    sounds.playBoop(400);
    onDeleteIngredient(deletingItem.id);
    triggerToast(`★ Removed "${deletingItem.name}" from diner pantry.`);
    setDeletingItem(null);
  };

  // Quick Preset Click
  const handlePresetClick = (preset: PantryPreset) => {
    sounds.playWinJingle();
    onApplyPreset(preset);
    triggerToast(`★ Order Up! Restocked ${preset.items.length} staples from "${preset.name}"!`);
  };

  // Filter Logic
  const filteredItems = pantry.filter(item => {
    // 1. Category Filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    // 2. Status Filter
    const expiry = getExpiryInfo(item);
    if (statusFilter === 'in_fridge' && !item.inFridge) {
      return false;
    }
    if (statusFilter === 'expiring' && expiry.status !== 'expiring_soon') {
      return false;
    }
    if (statusFilter === 'expired' && expiry.status !== 'expired') {
      return false;
    }

    // 3. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchDesc = item.dinerDesc?.toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchDesc) return false;
    }

    return true;
  });

  // Calculate counts for badges
  const totalInFridge = pantry.filter(i => i.inFridge).length;
  const expiringCount = pantry.filter(i => i.inFridge && getExpiryInfo(i).status === 'expiring_soon').length;
  const expiredCount = pantry.filter(i => i.inFridge && getExpiryInfo(i).status === 'expired').length;

  const categoriesList: { id: string; label: string; emoji: string }[] = [
    { id: 'all', label: 'All Items', emoji: '🧺' },
    { id: 'protein', label: 'Protein', emoji: '🥓' },
    { id: 'carb', label: 'Carbs', emoji: '🍞' },
    { id: 'produce', label: 'Produce', emoji: '🍅' },
    { id: 'dairy', label: 'Dairy', emoji: '🧀' },
    { id: 'spices', label: 'Spices', emoji: '🧂' },
    { id: 'flavor', label: 'Flavor', emoji: '🥣' },
    { id: 'other', label: 'Other', emoji: '🥫' },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col gap-3 select-none pb-48">
      {/* Retro Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 inset-x-4 max-w-md mx-auto z-50 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <div className="bg-[#FFFDF8] border-3 border-[#2B170C] p-3.5 rounded-2xl shadow-[4px_5px_0px_#2B170C] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl" aria-hidden="true">🛎️</span>
              <p className="text-sm font-heading font-black text-[#B71C1C] leading-snug">
                {toastMessage}
              </p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1.5 text-gray-700 hover:text-black cursor-pointer rounded-lg hover:bg-gray-100"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP PANTRY HEADER CARD WITH BALANCED ALIGNMENT & COLLAPSIBLE PRESETS   */}
      {/* ========================================================================= */}
      <div className="bg-[#FFFDF8] border-3 border-[#2B170C] rounded-2xl p-3 sm:p-3.5 shadow-[4px_4px_0px_#2B170C] flex flex-col gap-2.5">
        {/* Main Heading Row — Aligned with Add Item Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FBC02D] border-3 border-[#2B170C] flex items-center justify-center text-2xl shadow-[2px_2px_0px_#2B170C] shrink-0">
              🧊
            </div>
            <div>
              <h2 className="font-retro text-xl sm:text-2xl text-[#E53935] tracking-wide leading-tight">
                DINER PANTRY
              </h2>
              <p className="text-xs sm:text-sm text-[#2B170C] font-semibold mt-0.5">
                Stock, quantities & freshness
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenAddModal()}
            className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl bg-[#E53935] text-white border-2 border-[#2B170C] text-xs sm:text-sm font-retro uppercase tracking-wider shadow-[2px_2px_0px_#2B170C] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer hover:bg-[#FF5252] transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Compact Collapsible Quick Presets Accordion */}
        <div className="pt-2 border-t border-[#2B170C]/15">
          <button
            type="button"
            onClick={() => {
              sounds.playBoop(500);
              setShowPresets(!showPresets);
            }}
            aria-expanded={showPresets}
            className="w-full py-1.5 px-3 rounded-xl bg-[#FBF5E6] hover:bg-[#FFF9C4]/70 border-2 border-[#2B170C]/25 hover:border-[#2B170C] transition-all flex items-center justify-between text-xs sm:text-sm font-black text-[#2B170C] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E65100] fill-[#FBC02D]" />
              <span>Quick Stock Presets (4)</span>
            </div>
            <span className="text-xs font-black text-[#E53935]">
              {showPresets ? 'Hide ▲' : 'Show Presets ▾'}
            </span>
          </button>

          {/* Collapsible Content */}
          {showPresets && (
            <div className="grid grid-cols-2 gap-2 mt-2 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
              {PANTRY_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className="p-2 rounded-xl border-2 border-[#2B170C] bg-[#FFFDF8] hover:bg-[#FFF9C4] text-left transition-colors flex items-center gap-2 cursor-pointer shadow-[1px_1px_0px_#2B170C] active:translate-y-0.5 min-h-[46px]"
                  title={`Stock ${preset.name}`}
                  aria-label={`Stock ${preset.name}: ${preset.desc}`}
                >
                  <span className="text-xl shrink-0">{preset.emoji}</span>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-[#2B170C] truncate leading-tight">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-[#2B170C]/75 truncate leading-tight font-semibold">
                      {preset.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. UNIFIED SEARCH & STOCK STATUS FILTERS SECTION                         */}
      {/* ========================================================================= */}
      <div className="bg-[#FFFDF8] border-3 border-[#2B170C] rounded-2xl p-2.5 sm:p-3 shadow-[3px_3px_0px_#2B170C] flex flex-col gap-2">
        {/* Search Bar Input */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
          <input
            id="pantry-search"
            type="text"
            placeholder="Search by ingredient name or note..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-xl border-2 border-[#2B170C] bg-[#FBF5E6] text-xs sm:text-sm font-bold text-[#2B170C] placeholder:text-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#E53935] min-h-[40px]"
            aria-label="Search pantry ingredients"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 text-gray-600 hover:text-black cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Stock Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs font-black pt-1 border-t border-[#2B170C]/15" role="tablist" aria-label="Stock status filters">
          <button
            onClick={() => {
              sounds.playBoop(500);
              setStatusFilter('all');
            }}
            aria-selected={statusFilter === 'all'}
            className={`min-h-[34px] px-2.5 py-1 rounded-lg border-2 transition-all cursor-pointer shrink-0 ${
              statusFilter === 'all'
                ? 'bg-[#2B170C] text-[#FFFDF8] border-[#2B170C]'
                : 'bg-[#FFFDF8] text-[#2B170C] border-[#2B170C]/35 hover:border-[#2B170C]'
            }`}
          >
            All ({pantry.length})
          </button>

          <button
            onClick={() => {
              sounds.playBoop(500);
              setStatusFilter('in_fridge');
            }}
            aria-selected={statusFilter === 'in_fridge'}
            className={`min-h-[34px] px-2.5 py-1 rounded-lg border-2 transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
              statusFilter === 'in_fridge'
                ? 'bg-[#2E7D32] text-white border-[#2B170C]'
                : 'bg-[#FFFDF8] text-[#2E7D32] border-[#2B170C]/35 hover:border-[#2B170C]'
            }`}
          >
            <span>In Fridge</span>
            <span className="px-1 rounded bg-black/10 text-[11px] font-black">{totalInFridge}</span>
          </button>

          <button
            onClick={() => {
              sounds.playBoop(500);
              setStatusFilter('expiring');
            }}
            aria-selected={statusFilter === 'expiring'}
            className={`min-h-[34px] px-2.5 py-1 rounded-lg border-2 transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
              statusFilter === 'expiring'
                ? 'bg-[#E53935] text-white border-[#2B170C]'
                : 'bg-[#FFE3E3] text-[#B71C1C] border-[#E53935] hover:bg-[#FFCDD2]'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Expiring</span>
            <span className="px-1 rounded bg-black/15 text-[11px] font-black">{expiringCount}</span>
          </button>

          {expiredCount > 0 && (
            <button
              onClick={() => {
                sounds.playBoop(500);
                setStatusFilter('expired');
              }}
              aria-selected={statusFilter === 'expired'}
              className={`min-h-[34px] px-2.5 py-1 rounded-lg border-2 transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                statusFilter === 'expired'
                  ? 'bg-black text-white border-[#2B170C]'
                  : 'bg-gray-200 text-black border-black/40'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-red-500" />
              <span>Expired</span>
              <span className="px-1 rounded bg-red-600 text-white text-[11px] font-black">{expiredCount}</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SEPARATE HORIZONTALLY SCROLLABLE INGREDIENT CATEGORY CHIPS ROW         */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs sm:text-sm" role="tablist" aria-label="Category tabs">
        {categoriesList.map(c => {
          const count = c.id === 'all'
            ? pantry.length
            : pantry.filter(i => i.category === c.id).length;

          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={selectedCategory === c.id}
              onClick={() => {
                sounds.playBoop(500);
                setSelectedCategory(c.id);
              }}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black border-2 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-[#E53935] text-white border-[#2B170C] shadow-[2px_2px_0px_#2B170C]'
                  : 'bg-[#FFFDF8] text-[#2B170C] border-[#2B170C]/35 hover:border-[#2B170C]'
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.label}</span>
              <span
                className={`text-xs px-1.5 py-0.2 rounded-full font-black ${
                  selectedCategory === c.id ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. INVENTORY VISUAL PRIORITY SUBHEADER                                    */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between px-1 text-xs sm:text-sm font-black text-[#2B170C] pt-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base" aria-hidden="true">🛒</span>
          <span className="font-heading font-black tracking-wide uppercase">
            {selectedCategory === 'all' ? 'All Pantry Items' : CATEGORY_LABELS[selectedCategory as IngredientCategory]?.label || selectedCategory}
          </span>
          <span className="text-xs bg-[#2B170C] text-[#FFF9C4] px-2 py-0.5 rounded-full font-mono font-black">
            {filteredItems.length}
          </span>
        </div>

        {filteredItems.length > 0 && (
          <span className="text-[11px] text-[#2B170C]/75 font-bold hidden sm:inline">
            Tap checkbox to toggle fridge stock
          </span>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. BALANCED INGREDIENT CARDS WITH UNIFORM DIMENSIONS & ALIGNMENT          */}
      {/* ========================================================================= */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#FFFDF8] border-3 border-dashed border-[#2B170C] rounded-2xl p-6 text-center shadow-[4px_4px_0px_#2B170C] flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-[#FFF9C4] border-2 border-[#2B170C] flex items-center justify-center text-4xl shadow-[2px_2px_0px_#2B170C]">
            🍽️
          </div>
          <div>
            <h3 className="font-retro text-lg text-[#E53935]">
              PANTRY SHELF IS EMPTY!
            </h3>
            <p className="text-xs sm:text-sm text-[#2B170C] font-semibold max-w-xs mt-1">
              {searchQuery
                ? `No ingredients matched "${searchQuery}". Clear your search or add a new item.`
                : statusFilter !== 'all'
                ? `No items match the "${statusFilter.replace('_', ' ')}" filter right now.`
                : `No items in ${selectedCategory === 'all' ? 'the pantry' : selectedCategory} yet.`}
            </p>
          </div>

          <div className="flex gap-2 mt-1">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="min-h-[44px] px-4 py-2 rounded-xl border-2 border-[#2B170C] bg-[#FFFDF8] text-xs font-bold cursor-pointer"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={() => handleOpenAddModal(selectedCategory !== 'all' ? (selectedCategory as IngredientCategory) : undefined)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl font-retro text-sm text-white btn-tactile-red flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Item</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {filteredItems.map(item => {
            const expiry = getExpiryInfo(item);
            const unitLabel = UNIT_LABELS[item.unit]?.short || item.unit;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border-3 border-[#2B170C] transition-all flex flex-col justify-between h-[162px] relative shadow-[2px_3px_0px_#2B170C] ${
                  item.inFridge
                    ? 'bg-[#FFFDF8]'
                    : 'bg-[#ECEFF1] opacity-75 border-dashed'
                } ${expiry.status === 'expired' ? 'ring-2 ring-red-600' : ''}`}
              >
                {/* Top Row: Ingredient Icon on left, actions on right with uniform alignment */}
                <div className="flex items-start justify-between gap-1">
                  <IngredientIcon
                    name={item.name}
                    emoji={item.emoji}
                    category={item.category}
                    className="w-10 h-10 text-3xl sm:text-4xl filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)] shrink-0"
                  />

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      title={`Edit ${item.name}`}
                      aria-label={`Edit ${item.name}`}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 border-[#2B170C] bg-[#FFF9C4] text-[#2B170C] flex items-center justify-center hover:bg-[#FDD835] transition-colors cursor-pointer shadow-[1px_1px_0px_#2B170C] active:translate-y-0.5"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeletingItem(item)}
                      title={`Delete ${item.name}`}
                      aria-label={`Delete ${item.name}`}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 border-[#2B170C] bg-[#FFE3E3] text-[#B71C1C] flex items-center justify-center hover:bg-[#FFCDD2] transition-colors cursor-pointer shadow-[1px_1px_0px_#2B170C] active:translate-y-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Stock Status Toggle Checkbox */}
                    <button
                      onClick={() => {
                        sounds.playBoop(item.inFridge ? 450 : 650);
                        onToggleInFridge(item.id);
                      }}
                      title={item.inFridge ? `Mark ${item.name} Out of Stock` : `Mark ${item.name} In Fridge`}
                      aria-label={item.inFridge ? `Mark ${item.name} out of stock` : `Mark ${item.name} in fridge`}
                      aria-pressed={item.inFridge}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 border-[#2B170C] flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
                        item.inFridge
                          ? 'bg-[#2E7D32] text-white shadow-[1px_1px_0px_#2B170C]'
                          : 'bg-[#FFFDF8] text-gray-400'
                      }`}
                    >
                      {item.inFridge && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                  </div>
                </div>

                {/* Middle Row: Name, Quantity & Category with fixed bounds */}
                <div className="my-auto overflow-hidden">
                  <p className="text-sm sm:text-base font-heading font-black text-[#2B170C] leading-snug line-clamp-1">
                    {item.name}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1">
                    {/* Quantity & Unit Pill */}
                    <span className="text-xs font-mono font-black bg-[#FBF5E6] text-[#2B170C] px-2 py-0.5 rounded border border-[#2B170C]/35">
                      {item.quantity} {unitLabel}
                    </span>

                    {/* Category Pill */}
                    <span className="text-xs font-black text-[#2B170C]/75 uppercase truncate">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Expiry Badge pinned cleanly to bottom */}
                <div className="pt-1.5 border-t border-[#2B170C]/15 flex items-center justify-between mt-auto">
                  <span className={`text-xs font-black px-2 py-0.5 rounded border flex items-center gap-1 truncate ${expiry.badgeClass}`}>
                    {expiry.status === 'expired' ? (
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                    ) : expiry.status === 'expiring_soon' ? (
                      <Clock className="w-3 h-3 shrink-0" />
                    ) : null}
                    <span className="truncate">{expiry.label}</span>
                  </span>

                  {!item.inFridge && (
                    <span className="text-[10px] font-black text-gray-600 uppercase shrink-0">
                      Out
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT INGREDIENT MODAL                                               */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 overflow-y-auto animate-in fade-in duration-150"
        >
          <div className="w-full max-w-sm my-auto bg-[#FFFDF8] border-4 border-[#2B170C] rounded-2xl shadow-[6px_8px_0px_#2B170C] overflow-hidden max-h-[90vh] flex flex-col overscroll-contain">
            {/* Header */}
            <div className="bg-[#E53935] text-white p-3.5 border-b-3 border-[#2B170C] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#FBC02D]" />
                <h3 id="modal-title" className="font-retro text-lg tracking-wide text-white">
                  {editingItem ? 'EDIT INGREDIENT' : 'STOCK NEW INGREDIENT'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="min-w-[36px] min-h-[36px] rounded-lg bg-[#FFFDF8] text-[#2B170C] border-2 border-[#2B170C] flex items-center justify-center cursor-pointer hover:bg-[#FFE3E3]"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleFormSubmit} className="p-4 overflow-y-auto flex flex-col gap-3.5">
              {/* Validation Error Banner */}
              {formError && (
                <div role="alert" className="p-3 bg-[#FFE3E3] border-2 border-[#E53935] rounded-xl text-xs sm:text-sm font-black text-[#B71C1C] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Ingredient Name */}
              <div>
                <label htmlFor="ingredient-name" className="block text-xs sm:text-sm font-heading font-black text-[#2B170C] uppercase tracking-wider mb-1">
                  Ingredient Name *
                </label>
                <input
                  id="ingredient-name"
                  type="text"
                  placeholder="e.g. Sliced Bacon, Sharp Cheddar"
                  value={formName}
                  onChange={e => {
                    setFormName(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="w-full px-3.5 py-2.5 text-sm sm:text-base font-bold text-[#2B170C] bg-[#FBF5E6] border-2 border-[#2B170C] rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#E53935] min-h-[44px]"
                  autoFocus
                />
                <span className="text-xs text-gray-700 font-semibold mt-0.5 block">
                  Duplicates are merged into the existing item automatically.
                </span>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs sm:text-sm font-heading font-black text-[#2B170C] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Category *</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5" role="radiogroup" aria-label="Category selection">
                  {(['protein', 'carb', 'produce', 'dairy', 'spices', 'flavor', 'other'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      role="radio"
                      aria-checked={formCategory === cat}
                      onClick={() => setFormCategory(cat)}
                      className={`min-h-[42px] py-1.5 px-1 rounded-xl border-2 border-[#2B170C] text-xs font-black capitalize flex items-center justify-center gap-1 cursor-pointer ${
                        formCategory === cat
                          ? 'bg-[#E53935] text-white shadow-[1px_1px_0px_#2B170C]'
                          : 'bg-[#FFFDF8] text-[#2B170C] hover:bg-[#FFF9C4]'
                      }`}
                    >
                      <span>{CATEGORY_LABELS[cat]?.emoji}</span>
                      <span className="truncate">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Unit Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="ingredient-quantity" className="block text-xs sm:text-sm font-heading font-black text-[#2B170C] uppercase tracking-wider mb-1">
                    Quantity *
                  </label>
                  <input
                    id="ingredient-quantity"
                    type="number"
                    min="0.1"
                    step="any"
                    inputMode="decimal"
                    value={formQuantity}
                    onChange={e => {
                      setFormQuantity(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm sm:text-base font-bold text-[#2B170C] bg-[#FBF5E6] border-2 border-[#2B170C] rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#E53935] min-h-[44px]"
                  />
                </div>

                <div>
                  <label htmlFor="ingredient-unit" className="block text-xs sm:text-sm font-heading font-black text-[#2B170C] uppercase tracking-wider mb-1">
                    Unit *
                  </label>
                  <select
                    id="ingredient-unit"
                    value={formUnit}
                    onChange={e => setFormUnit(e.target.value as IngredientUnit)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm font-black text-[#2B170C] bg-[#FBF5E6] border-2 border-[#2B170C] rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#E53935] min-h-[44px]"
                  >
                    <option value="pieces">pieces (pcs)</option>
                    <option value="grams">grams (g)</option>
                    <option value="kg">kilograms (kg)</option>
                    <option value="ml">millilitres (ml)</option>
                    <option value="litres">litres (L)</option>
                  </select>
                </div>
              </div>

              {/* Expiry Date (Optional) */}
              <div>
                <label htmlFor="ingredient-expiry" className="block text-xs sm:text-sm font-heading font-black text-[#2B170C] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Expiry Date (Optional)</span>
                  </span>
                  {formExpiryDate && (
                    <button
                      type="button"
                      onClick={() => setFormExpiryDate('')}
                      className="text-xs text-[#B71C1C] underline font-bold cursor-pointer"
                    >
                      Clear Date
                    </button>
                  )}
                </label>
                <input
                  id="ingredient-expiry"
                  type="date"
                  value={formExpiryDate}
                  onChange={e => setFormExpiryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold text-[#2B170C] bg-[#FBF5E6] border-2 border-[#2B170C] rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#E53935] min-h-[44px]"
                />

                {/* Quick Date Presets */}
                <div className="flex items-center gap-1.5 mt-1.5 text-xs font-black">
                  <span className="text-gray-700">Quick:</span>
                  {[
                    { label: 'Today', offset: 0 },
                    { label: '+2 Days', offset: 2 },
                    { label: '+5 Days', offset: 5 },
                    { label: '+14 Days', offset: 14 },
                  ].map(p => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setFormExpiryDate(getDateOffset(p.offset))}
                      className="min-h-[32px] px-2 py-0.5 rounded-lg bg-[#FBF5E6] border border-[#2B170C]/50 hover:bg-[#FBC02D] cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emoji Picker */}
              <div>
                <label className="block text-xs sm:text-sm font-heading font-black text-[#2B170C] uppercase tracking-wider mb-1">
                  Ingredient Icon
                </label>
                <div className="flex items-center gap-2.5">
                  <span className="w-12 h-12 rounded-xl bg-[#FFF9C4] border-2 border-[#2B170C] flex items-center justify-center text-3xl shrink-0">
                    {formEmoji}
                  </span>
                  <div className="flex-1 flex gap-1.5 overflow-x-auto p-1.5 bg-[#FBF5E6] rounded-xl border border-[#2B170C]/40">
                    {COMMON_EMOJIS.map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setFormEmoji(em)}
                        className={`text-2xl p-1 rounded-lg hover:bg-white transition-transform cursor-pointer ${
                          formEmoji === em ? 'scale-125 bg-white border border-[#2B170C]' : ''
                        }`}
                        aria-label={`Select icon ${em}`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* In Fridge Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border-2 border-[#2B170C] bg-[#FBF5E6]">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🧊</span>
                  <div>
                    <label htmlFor="modal-in-fridge" className="text-xs sm:text-sm font-black text-[#2B170C] cursor-pointer block">
                      Currently In Fridge
                    </label>
                    <p className="text-xs text-[#2B170C]/80 font-medium">Ready to be spun on the roulette reels</p>
                  </div>
                </div>

                <input
                  id="modal-in-fridge"
                  type="checkbox"
                  checked={formInFridge}
                  onChange={e => setFormInFridge(e.target.checked)}
                  className="w-6 h-6 accent-[#E53935] cursor-pointer"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-[#2B170C]/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 min-h-[48px] py-2.5 rounded-xl border-2 border-[#2B170C] bg-[#FFFDF8] font-black text-xs sm:text-sm cursor-pointer hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[48px] py-2.5 rounded-xl font-retro text-xs sm:text-sm text-white btn-tactile-red cursor-pointer uppercase tracking-wider"
                >
                  {editingItem ? 'Save Changes' : 'Stock Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION DIALOG                                                */}
      {/* ========================================================================= */}
      {deletingItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm ingredient deletion"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-xs bg-[#FFFDF8] border-4 border-[#2B170C] rounded-2xl shadow-[6px_8px_0px_#2B170C] p-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#FFE3E3] border-2 border-[#E53935] text-[#E53935] flex items-center justify-center mx-auto mb-2.5 text-3xl">
              🗑️
            </div>
            <h3 className="font-retro text-lg text-[#2B170C]">
              REMOVE INGREDIENT?
            </h3>
            <p className="text-xs sm:text-sm text-[#2B170C] mt-1.5 font-bold">
              Are you sure you want to remove <b>"{deletingItem.name}"</b> from your diner pantry?
            </p>

            <div className="flex items-center gap-2.5 mt-5">
              <button
                onClick={() => setDeletingItem(null)}
                className="flex-1 min-h-[44px] py-2 rounded-xl border-2 border-[#2B170C] bg-[#FFFDF8] text-xs sm:text-sm font-black cursor-pointer hover:bg-gray-100"
              >
                Keep Item
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 min-h-[44px] py-2 rounded-xl font-retro text-xs sm:text-sm text-white bg-[#E53935] border-2 border-[#2B170C] shadow-[2px_2px_0px_#2B170C] active:translate-y-0.5 cursor-pointer uppercase tracking-wider"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Diner Note */}
      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#2B170C] font-semibold text-center">
        <Info className="w-4 h-4 text-[#E53935] shrink-0" />
        <span>Ingredients marked with <b>⚠️ USE SOON</b> are favored when spinning the reels!</span>
      </div>
    </div>
  );
};
