import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product, ProductBadge } from '../types';
import { formatPrice } from '../services/currency';
import { Filter, SlidersHorizontal, RotateCcw, Search, X, ArrowLeftRight } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    filters,
    setFilters,
    resetFilters,
    currency,
    viewParam,
    compareItems,
    setIsCompareModalOpen,
  } = useApp();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(viewParam || '');

  // Derived filtered products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Search query filter
    const activeSearch = localSearch || filters.searchQuery;
    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price filter
    result = result.filter((p) => p.priceUSD <= filters.maxPriceUSD);

    // Badges filter
    if (filters.badges.length > 0) {
      result = result.filter((p) =>
        filters.badges.some((badge) => p.badges.includes(badge))
      );
    }

    // Stock & Sustainable
    if (filters.onlyInStock) {
      result = result.filter((p) => p.inStock);
    }
    if (filters.onlySustainable) {
      result = result.filter((p) => p.isSustainable);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'newest':
        result = result.filter((p) => p.badges.includes('New Drop')).concat(
          result.filter((p) => !p.badges.includes('New Drop'))
        );
        break;
      case 'price-asc':
        result.sort((a, b) => a.priceUSD - b.priceUSD);
        break;
      case 'price-desc':
        result.sort((a, b) => b.priceUSD - a.priceUSD);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Featured
        break;
    }

    return result;
  }, [filters, localSearch]);

  const handleBadgeToggle = (badge: ProductBadge) => {
    setFilters((prev) => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter((b) => b !== badge)
        : [...prev.badges, badge],
    }));
  };

  return (
    <div className="py-10 bg-neutral-50 dark:bg-[#151618] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            ALL GOOGLE GEAR & DROPS
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Browse the complete Google Merchandise redesign catalog. Filter by category, price, and special collections.
          </p>
        </div>

        {/* Search Bar & Mobile Filter Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-[#1C1D21] p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
          
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-3 text-neutral-400" size={18} />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by keyword, product name, or collection..."
              className="w-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-900 dark:text-white rounded-xl pl-10 pr-8 py-2.5 focus:outline-none focus:border-blue-500"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center gap-2"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>

            {/* Compare Button */}
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-colors ${
                compareItems.length > 0
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-2xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
              title="Compare up to 3 products side-by-side"
            >
              <ArrowLeftRight size={14} className={compareItems.length > 0 ? 'text-blue-600 dark:text-blue-400' : ''} />
              <span>Compare ({compareItems.length}/3)</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none text-neutral-900 dark:text-white"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Drops</option>
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Main Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filters Sidebar */}
          <div className={`space-y-6 bg-white dark:bg-[#1C1D21] p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 h-fit ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal size={16} /> Filter Gear
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-neutral-400 hover:text-blue-600 flex items-center gap-1 font-bold"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Category
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
                  className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl transition-colors ${
                    filters.category === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  All Categories ({PRODUCTS.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setFilters((prev) => ({ ...prev, category: cat.slug }))}
                    className={`w-full text-left text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                      filters.category === cat.slug
                        ? 'bg-blue-600 text-white'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="opacity-60">{cat.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="uppercase text-neutral-500">Max Price</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {formatPrice(filters.maxPriceUSD, currency)}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={filters.maxPriceUSD}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPriceUSD: Number(e.target.value),
                  }))
                }
                className="w-full accent-blue-600"
              />
            </div>

            {/* Badges Checklist */}
            <div className="space-y-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Special Badges
              </label>
              <div className="space-y-1.5">
                {(['New Drop', 'Trending', 'Limited Drop', 'Sustainable', 'Hidden Gem'] as ProductBadge[]).map(
                  (badge) => (
                    <label
                      key={badge}
                      className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.badges.includes(badge)}
                        onChange={() => handleBadgeToggle(badge)}
                        className="rounded-md border-neutral-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{badge}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlyInStock}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, onlyInStock: e.target.checked }))
                  }
                  className="rounded-md border-neutral-300 text-blue-600"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlySustainable}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, onlySustainable: e.target.checked }))
                  }
                  className="rounded-md border-neutral-300 text-blue-600"
                />
                <span>Sustainable Materials Only ♻️</span>
              </label>
            </div>

          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="text-xs font-bold text-neutral-500">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-[#1C1D21] rounded-3xl p-12 text-center border border-neutral-200 dark:border-neutral-800 space-y-3">
                <p className="text-neutral-500 text-sm font-medium">
                  No Google gear matches your active filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
