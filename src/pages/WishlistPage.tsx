import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../services/currency';
import {
  Heart,
  ShoppingBag,
  Trash2,
  Share2,
  ArrowRight,
  ArrowLeftRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PackageOpen,
  Filter,
  Check,
} from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    openProductDetail,
    currency,
    navigate,
    showToast,
    toggleCompare,
    isInCompare,
  } = useApp();

  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'rating'>('recent');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Derive categories present in current wishlist
  const categories = useMemo(() => {
    const set = new Set<string>();
    wishlist.forEach((item) => set.add(item.product.categoryName));
    return ['all', ...Array.from(set)];
  }, [wishlist]);

  // Filtered and sorted wishlist items
  const processedItems = useMemo(() => {
    let items = [...wishlist];

    if (selectedCategory !== 'all') {
      items = items.filter((item) => item.product.categoryName === selectedCategory);
    }

    if (sortBy === 'price-low') {
      items.sort((a, b) => a.product.priceUSD - b.product.priceUSD);
    } else if (sortBy === 'price-high') {
      items.sort((a, b) => b.product.priceUSD - a.product.priceUSD);
    } else if (sortBy === 'rating') {
      items.sort((a, b) => b.product.rating - a.product.rating);
    }

    return items;
  }, [wishlist, selectedCategory, sortBy]);

  const inStockItems = wishlist.filter((item) => item.product.inStock);
  const totalValueUSD = wishlist.reduce((acc, item) => acc + item.product.priceUSD, 0);

  const handleAddAllInStockToCart = () => {
    if (inStockItems.length === 0) {
      showToast('No in-stock items available to add.');
      return;
    }
    inStockItems.forEach((item) => {
      addToCart(item.product);
    });
    showToast(`Added ${inStockItems.length} items to your cart! 🛍️`);
  };

  const handleShareWishlist = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast('Wishlist link copied to clipboard! 📋');
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      showToast('Wishlist ready to share!');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all items from your wishlist?')) {
      wishlist.forEach((item) => {
        toggleWishlist(item.product);
      });
      showToast('Cleared all items from your wishlist.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-wider mb-2">
            <Heart size={13} fill="currentColor" />
            <span>Saved For Later</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {wishlist.length === 0
              ? 'Keep track of limited edition Google gear and apparel you love.'
              : `${wishlist.length} item${wishlist.length === 1 ? '' : 's'} saved • Total value ${formatPrice(totalValueUSD, currency)}`}
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handleShareWishlist}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Share your wishlist"
            >
              {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied' : 'Share Wishlist'}</span>
            </button>

            <button
              onClick={handleAddAllInStockToCart}
              disabled={inStockItems.length === 0}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm hover:scale-102"
            >
              <ShoppingBag size={14} />
              <span>Add All In-Stock ({inStockItems.length}) to Cart</span>
            </button>

            <button
              onClick={handleClearAll}
              className="p-2 text-neutral-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40"
              title="Clear entire wishlist"
            >
              <Trash2 size={17} />
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-500 flex items-center justify-center mx-auto shadow-sm">
            <Heart size={36} />
          </div>
          <h2 className="text-xl font-black text-neutral-900 dark:text-white">
            Your wishlist is empty
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Click the heart icon on any Google Gear product to save it here for later. You can monitor stock, compare items, and purchase them whenever you are ready.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/shop')}
              className="w-full sm:w-auto px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-black rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Explore All Gear</span>
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigate('/new-drops')}
              className="w-full sm:w-auto px-6 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} className="text-amber-500" />
              <span>Browse New Drops</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Controls Bar: Category Filters & Sorting */}
          <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              <span className="text-xs font-bold text-neutral-400 flex items-center gap-1 mr-1">
                <Filter size={13} />
                <span>Filter:</span>
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xs'
                      : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {cat === 'all' ? 'All Saved' : cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-300 self-end sm:self-auto">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Wishlist Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedItems.map(({ product, addedAt }) => {
              const isCompared = isInCompare(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-[#1A1B1E] rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Image Container with Badges */}
                  <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => openProductDetail(product)}
                    />

                    {/* Remove from Wishlist button (Heart toggle) */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white shadow-md hover:scale-110 active:scale-95 transition-all z-10"
                      title="Remove from Wishlist"
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.inStock ? (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/90 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                          <CheckCircle2 size={10} />
                          <span>In Stock</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-500/90 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                          <AlertTriangle size={10} />
                          <span>Out of Stock</span>
                        </span>
                      )}
                      {product.isLimited && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-yellow-400 text-neutral-950 shadow-xs">
                          Limited Drop
                        </span>
                      )}
                    </div>

                    {/* Date Saved Tag */}
                    {addedAt && (
                      <div className="absolute bottom-2 left-3 text-[10px] font-medium text-white/90 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        Saved {addedAt}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                        <span>{product.categoryName}</span>
                        <span className="font-bold text-amber-500">★ {product.rating}</span>
                      </div>
                      <h3
                        onClick={() => openProductDetail(product)}
                        className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {product.tagline}
                      </p>
                    </div>

                    {/* Price and Stock Notice */}
                    <div>
                      <div className="text-base font-black text-neutral-900 dark:text-white">
                        {formatPrice(product.priceUSD, currency)}
                      </div>
                      {product.stockCount && product.stockCount < 15 && (
                        <div className="text-[10px] font-bold text-red-500 mt-0.5">
                          Only {product.stockCount} units remaining!
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <button
                        onClick={() => {
                          addToCart(product);
                          showToast(`Moved "${product.name}" to cart!`);
                        }}
                        disabled={!product.inStock}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <ShoppingBag size={14} />
                        <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCompare(product)}
                          className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-bold transition-colors flex items-center justify-center gap-1 ${
                            isCompared
                              ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                              : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                          }`}
                        >
                          <ArrowLeftRight size={12} />
                          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                        </button>

                        <button
                          onClick={() => toggleWishlist(product)}
                          className="py-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-red-500 dark:hover:text-red-400 text-[11px] font-medium transition-colors flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Remove item"
                        >
                          <Trash2 size={12} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
