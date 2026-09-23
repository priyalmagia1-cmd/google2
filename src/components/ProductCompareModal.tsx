import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { formatPrice } from '../services/currency';
import {
  X,
  ArrowLeftRight,
  Plus,
  ShoppingBag,
  Star,
  CheckCircle2,
  XCircle,
  Sparkles,
  Leaf,
  Layers,
  Search,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Truck,
  AlertTriangle,
} from 'lucide-react';

export const ProductCompareModal: React.FC = () => {
  const {
    compareItems,
    isCompareModalOpen,
    setIsCompareModalOpen,
    removeFromCompare,
    clearCompare,
    addToCompare,
    addToCart,
    openProductDetail,
    currency,
    showToast,
  } = useApp();

  const [highlightDifferences, setHighlightDifferences] = useState<boolean>(false);
  const [addingSlotIndex, setAddingSlotIndex] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCompareModalOpen) {
        setIsCompareModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompareModalOpen, setIsCompareModalOpen]);

  // Candidates to add to comparison
  const availableProducts = useMemo(() => {
    const existingIds = new Set(compareItems.map((p) => p.id));
    let list = PRODUCTS.filter((p) => !existingIds.has(p.id));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [compareItems, searchQuery]);

  if (!isCompareModalOpen) return null;

  // Best/Lowest price indicator if multiple items
  const lowestPriceUSD =
    compareItems.length > 1
      ? Math.min(...compareItems.map((p) => p.priceUSD))
      : null;

  // Helper to check if row values differ across compared items
  const isRowDifferent = (getValue: (p: Product) => any): boolean => {
    if (compareItems.length <= 1) return false;
    const firstVal = JSON.stringify(getValue(compareItems[0]));
    return compareItems.some((p) => JSON.stringify(getValue(p)) !== firstVal);
  };

  const isPriceDiff = isRowDifferent((p) => p.priceUSD);
  const isStockDiff = isRowDifferent((p) => p.inStock);
  const isRatingDiff = isRowDifferent((p) => p.rating);
  const isCategoryDiff = isRowDifferent((p) => p.category);
  const isMaterialsDiff = isRowDifferent((p) => p.materials || 'Standard');
  const isSustainabilityDiff = isRowDifferent((p) => Boolean(p.isSustainable));
  const isSizesDiff = isRowDifferent((p) => (p.sizes || []).join(','));

  const maxSlots = 3;
  const emptySlotsCount = Math.max(0, maxSlots - compareItems.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsCompareModalOpen(false)}
    >
      <div
        className="bg-white dark:bg-[#18191C] rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 bg-neutral-50/70 dark:bg-[#121315]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ArrowLeftRight size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white">
                  Side-by-Side Comparison
                </h2>
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                  ({compareItems.length}/3 products)
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">
                Compare prices, availability, materials, and features of Google Gear
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Highlight Differences Toggle */}
            {compareItems.length > 1 && (
              <button
                onClick={() => setHighlightDifferences(!highlightDifferences)}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  highlightDifferences
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
                title="Highlight features that differ between products"
              >
                <Sparkles size={14} />
                <span>Highlight Differences</span>
              </button>
            )}

            {/* Clear All */}
            {compareItems.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-3 py-1.5 text-xs font-bold text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 transition-colors flex items-center gap-1.5"
                title="Remove all products from comparison"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}

            {/* Close Modal */}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Close Comparison (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-6">
          {compareItems.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                <ArrowLeftRight size={32} />
              </div>
              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">
                No products selected yet
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Add up to 3 Google Gear items to compare features, specs, and prices side-by-side. Click the compare button on any product card or detail page.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setAddingSlotIndex(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl transition-colors inline-flex items-center gap-2 shadow-sm"
                >
                  <Plus size={16} />
                  <span>Choose Products to Compare</span>
                </button>
              </div>
            </div>
          ) : (
            /* Comparison Table / Matrix */
            <div className="min-w-[620px] lg:min-w-full">
              {/* Product Cards Header Row */}
              <div className="grid grid-cols-4 gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800 items-start">
                <div className="font-extrabold text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 pt-3">
                  Product Details
                </div>

                {compareItems.map((product) => (
                  <div
                    key={product.id}
                    className="relative bg-neutral-50/80 dark:bg-[#1E1F23]/80 rounded-2xl p-4 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between h-full group"
                  >
                    {/* Remove from comparison */}
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 dark:bg-neutral-800 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 shadow-2xs hover:scale-105 transition-all z-10"
                      title="Remove from comparison"
                    >
                      <X size={14} />
                    </button>

                    <div>
                      {/* Image Thumbnail */}
                      <div
                        onClick={() => {
                          setIsCompareModalOpen(false);
                          openProductDetail(product);
                        }}
                        className="aspect-square w-full rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-3 cursor-pointer group-hover:opacity-95 transition-opacity"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Category & Badge */}
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">
                        <span>{product.categoryName}</span>
                        {product.isLimited && (
                          <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded-md bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                            Limited
                          </span>
                        )}
                      </div>

                      {/* Product Name */}
                      <h4
                        onClick={() => {
                          setIsCompareModalOpen(false);
                          openProductDetail(product);
                        }}
                        className="font-extrabold text-sm text-neutral-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                      >
                        {product.name}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 font-normal">
                        {product.tagline}
                      </p>
                    </div>

                    {/* Quick Add To Cart */}
                    <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/80 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          addToCart(product);
                          showToast(`Added "${product.name}" to cart!`);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <ShoppingBag size={14} />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsCompareModalOpen(false);
                          openProductDetail(product);
                        }}
                        className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>Full details</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[260px] bg-neutral-50/40 dark:bg-neutral-900/30"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mb-3">
                      <Plus size={24} />
                    </div>
                    <div className="font-bold text-xs text-neutral-800 dark:text-neutral-200 mb-1">
                      Compare Item {compareItems.length + idx + 1}
                    </div>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mb-4 max-w-[160px]">
                      Add another product to compare side-by-side
                    </p>
                    <button
                      onClick={() => setAddingSlotIndex(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shadow-2xs"
                    >
                      + Select Product
                    </button>
                  </div>
                ))}
              </div>

              {/* SPECIFICATION ROWS */}
              <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800 text-xs">
                {/* 1. PRICE ROW */}
                <div
                  className={`grid grid-cols-4 gap-4 py-3.5 items-center transition-colors ${
                    highlightDifferences && isPriceDiff
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 -mx-4 px-4 rounded-xl'
                      : ''
                  }`}
                >
                  <div className="font-extrabold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <span>Price</span>
                  </div>

                  {compareItems.map((product) => {
                    const isLowest =
                      lowestPriceUSD !== null && product.priceUSD === lowestPriceUSD;
                    return (
                      <div key={product.id} className="space-y-1">
                        <div className="text-base font-black text-neutral-900 dark:text-white flex items-center gap-2">
                          <span>{formatPrice(product.priceUSD, currency)}</span>
                          {isLowest && compareItems.length > 1 && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                              Lowest Price
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {product.priceUSD >= 50
                            ? 'Eligible for Free Shipping'
                            : '+ Standard $5.99 shipping'}
                        </div>
                      </div>
                    );
                  })}

                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <div key={`empty-price-${idx}`} className="text-neutral-300 dark:text-neutral-700">
                      —
                    </div>
                  ))}
                </div>

                {/* 2. AVAILABILITY & STOCK ROW */}
                <div
                  className={`grid grid-cols-4 gap-4 py-3.5 items-center transition-colors ${
                    highlightDifferences && isStockDiff
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 -mx-4 px-4 rounded-xl'
                      : ''
                  }`}
                >
                  <div className="font-extrabold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <span>Availability & Stock</span>
                  </div>

                  {compareItems.map((product) => (
                    <div key={product.id} className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        {product.inStock ? (
                          <>
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span className="text-emerald-700 dark:text-emerald-400">
                              In Stock
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle size={16} className="text-red-500" />
                            <span className="text-red-600 dark:text-red-400">
                              Out of Stock
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                        {product.stockCount && product.stockCount < 15 ? (
                          <span className="font-bold text-red-500 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            Only {product.stockCount} units remaining!
                          </span>
                        ) : product.stockCount ? (
                          <span>{product.stockCount} units ready to ship</span>
                        ) : (
                          <span>Ready to dispatch in 24h</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <div key={`empty-stock-${idx}`} className="text-neutral-300 dark:text-neutral-700">
                      —
                    </div>
                  ))}
                </div>

                {/* 3. RATINGS & REVIEWS ROW */}
                <div
                  className={`grid grid-cols-4 gap-4 py-3.5 items-center transition-colors ${
                    highlightDifferences && isRatingDiff
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 -mx-4 px-4 rounded-xl'
                      : ''
                  }`}
                >
                  <div className="font-extrabold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <span>Customer Rating</span>
                  </div>

                  {compareItems.map((product) => (
                    <div key={product.id} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm">
                        <Star size={16} fill="currentColor" />
                        <span className="text-neutral-900 dark:text-white">{product.rating}</span>
                      </div>
                      <span className="text-neutral-400 dark:text-neutral-500 text-xs">
                        ({product.reviewCount} verified reviews)
                      </span>
                    </div>
                  ))}

                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <div key={`empty-rating-${idx}`} className="text-neutral-300 dark:text-neutral-700">
                      —
                    </div>
                  ))}
                </div>

                {/* 4. MATERIALS & SPECIFICATIONS ROW */}
                <div
                  className={`grid grid-cols-4 gap-4 py-3.5 items-center transition-colors ${
                    highlightDifferences && isMaterialsDiff
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 -mx-4 px-4 rounded-xl'
                      : ''
                  }`}
                >
                  <div className="font-extrabold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <span>Materials & Build</span>
                  </div>

                  {compareItems.map((product) => (
                    <div key={product.id} className="text-xs text-neutral-700 dark:text-neutral-300">
                      {product.materials ? (
                        <span className="font-medium">{product.materials}</span>
                      ) : (
                        <span className="text-neutral-400 dark:text-neutral-500">Premium Google Gear specs</span>
                      )}
                    </div>
                  ))}

                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <div key={`empty-mat-${idx}`} className="text-neutral-300 dark:text-neutral-700">
                      —
                    </div>
                  ))}
                </div>

                {/* 5. SIZES ROW */}
                <div
                  className={`grid grid-cols-4 gap-4 py-3.5 items-center transition-colors ${
                    highlightDifferences && isSizesDiff
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 -mx-4 px-4 rounded-xl'
                      : ''
                  }`}
                >
                  <div className="font-extrabold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <span>Available Sizes</span>
                  </div>

                  {compareItems.map((product) => (
                    <div key={product.id} className="flex flex-wrap gap-1">
                      {product.sizes && product.sizes.length > 0 ? (
                        product.sizes.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[11px] font-bold text-neutral-700 dark:text-neutral-300"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-neutral-400 dark:text-neutral-500 text-xs">
                          One Size / Universal
                        </span>
                      )}
                    </div>
                  ))}

                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <div key={`empty-size-${idx}`} className="text-neutral-300 dark:text-neutral-700">
                      —
                    </div>
                  ))}
                </div>

                {/* 6. COLORS ROW */}
                <div className="grid grid-cols-4 gap-4 py-3.5 items-center">
                  <div className="font-extrabold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <span>Colorways</span>
                  </div>

                  {compareItems.map((product) => (
                    <div key={product.id} className="space-y-1.5">
                      {product.colors && product.colors.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {product.colors.map((c) => (
                            <div
                              key={c.name}
                              className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md text-[11px]"
                              title={c.name}
                            >
                              <span
                                className="w-3 h-3 rounded-full border border-neutral-300 dark:border-neutral-700 flex-shrink-0"
                                style={{ backgroundColor: c.hex }}
                              />
                              <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                                {c.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-neutral-400 dark:text-neutral-500 text-xs">
                          Single Signature Color
                        </span>
                      )}
                    </div>
                  ))}

                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <div key={`empty-colors-${idx}`} className="text-neutral-300 dark:text-neutral-700">
                      —
                    </div>
                  ))}
                </div>

                {/* 7. SUSTAINABILITY & ECO ROW */}
                <div
                  className={`grid grid-cols-4 gap-4 py-3.5 items-center transition-colors ${
                    highlightDifferences && isSustainabilityDiff
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 -mx-4 px-4 rounded-xl'
                      : ''
                  }`}
                >
                  <div className="font-extrabold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <span>Sustainability</span>
                  </div>

                  {compareItems.map((product) => (
                    <div key={product.id}>
                      {product.isSustainable ? (
                        <div className="flex items-start gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                          <Leaf size={15} className="flex-shrink-0 mt-0.5" />
                          <span className="text-xs">
                            {product.sustainabilityNote || 'Eco-friendly sustainable materials'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 dark:text-neutral-500 text-xs">
                          Standard responsible production
                        </span>
                      )}
                    </div>
                  ))}

                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <div key={`empty-eco-${idx}`} className="text-neutral-300 dark:text-neutral-700">
                      —
                    </div>
                  ))}
                </div>

                {/* 8. COLLECTION / THEME ROW */}
                <div
                  className={`grid grid-cols-4 gap-4 py-3.5 items-center transition-colors ${
                    highlightDifferences && isCategoryDiff
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 -mx-4 px-4 rounded-xl'
                      : ''
                  }`}
                >
                  <div className="font-extrabold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <span>Collection Theme</span>
                  </div>

                  {compareItems.map((product) => (
                    <div key={product.id} className="flex flex-wrap gap-1.5">
                      {product.isChromeDino && (
                        <span className="px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
                          🦖 Chrome Dino
                        </span>
                      )}
                      {product.isAndroid && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                          🤖 Android Tech
                        </span>
                      )}
                      {product.isStreetwear && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-[11px] font-bold text-purple-700 dark:text-purple-300">
                          ⚡ Streetwear
                        </span>
                      )}
                      {product.isWorldLocation && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                          🌏 {product.isWorldLocation} Edition
                        </span>
                      )}
                      {product.isHiddenGem && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                          💎 Hidden Gem
                        </span>
                      )}
                    </div>
                  ))}

                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <div key={`empty-theme-${idx}`} className="text-neutral-300 dark:text-neutral-700">
                      —
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 bg-neutral-50 dark:bg-[#121315] border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Truck size={14} className="text-blue-500" />
              <span>Fast Global Shipping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Official Google Merchandise Guarantee</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareItems.length > 0 && emptySlotsCount > 0 && (
              <button
                onClick={() => setAddingSlotIndex(true)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add Product ({emptySlotsCount} left)</span>
              </button>
            )}

            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="px-5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-extrabold hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* SUB-MODAL: Quick Product Picker to Add to Comparison */}
      {addingSlotIndex && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setAddingSlotIndex(false)}
        >
          <div
            className="bg-white dark:bg-[#1C1D21] rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-blue-600" />
                <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white">
                  Add Item to Comparison ({compareItems.length}/3)
                </h3>
              </div>
              <button
                onClick={() => setAddingSlotIndex(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gear by name, category, or keyword..."
                  className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {availableProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  No matching products found.
                </div>
              ) : (
                availableProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-between gap-3 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex-shrink-0"
                      />
                      <div>
                        <h5 className="font-bold text-xs text-neutral-900 dark:text-white line-clamp-1">
                          {p.name}
                        </h5>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                          <span>{p.categoryName}</span>
                          <span>•</span>
                          <span className="font-bold text-neutral-900 dark:text-neutral-200">
                            {formatPrice(p.priceUSD, currency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const added = addToCompare(p);
                        if (added && compareItems.length + 1 >= 3) {
                          setAddingSlotIndex(false);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-colors flex-shrink-0"
                    >
                      <Plus size={14} />
                      <span>Compare</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
