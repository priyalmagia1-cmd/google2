import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { Search, X, History, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export const SearchOverlay: React.FC = () => {
  const {
    isSearchOverlayOpen,
    setIsSearchOverlayOpen,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    navigate,
    openProductDetail,
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isSearchOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSearchOverlayOpen]);

  if (!isSearchOverlayOpen) return null;

  const popularTags = [
    'Chrome Dino',
    'Google Hoodie',
    'Android Bot',
    'Kyoto Tote',
    'Sustainable',
    'Rubber Ducky',
    'Corduroy Cap',
    'Pour-Over',
  ];

  const searchResults = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(query.toLowerCase()) ||
          p.tagline.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query.trim());
      setIsSearchOverlayOpen(false);
      navigate('/shop', query.trim());
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    addRecentSearch(tag);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md animate-fade-in flex flex-col">
      {/* Search Header Input */}
      <div className="bg-white dark:bg-[#18191C] border-b border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Search className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={24} />
          
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Google gear (e.g. Chrome Dino, Hoodie, Mug, Kyoto)..."
              className="w-full bg-transparent text-lg md:text-xl font-bold text-neutral-900 dark:text-white focus:outline-none placeholder:text-neutral-400 placeholder:font-normal"
            />
          </form>

          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-bold text-neutral-400 hover:text-neutral-700 dark:hover:text-white px-2 py-1 rounded-lg"
            >
              Clear
            </button>
          )}

          <button
            onClick={() => setIsSearchOverlayOpen(false)}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Main Search Suggestions & Results Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-8">
        {!query.trim() ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <History size={16} /> Recent Searches
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleTagClick(s)}
                      className="bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 text-xs font-medium px-3.5 py-2 rounded-xl transition-colors border border-neutral-700/50 flex items-center gap-1.5"
                    >
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Search Terms */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={16} className="text-amber-400" /> Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/50 text-blue-300 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles size={12} className="text-blue-400" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Live Search Results */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-white text-sm font-bold border-b border-neutral-800 pb-3">
              <span>
                Found {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} for "{query}"
              </span>
              {searchResults.length > 0 && (
                <button
                  onClick={() => {
                    addRecentSearch(query);
                    setIsSearchOverlayOpen(false);
                    navigate('/shop', query);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  View All Filters & Sorting <ArrowRight size={14} />
                </button>
              )}
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <p className="text-neutral-400 text-sm">No Google gear matches "{query}".</p>
                <p className="text-xs text-neutral-500">
                  Try searching for "Chrome Dino", "Hoodie", "Kyoto", "Mug", or "Android".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((prod) => (
                  <div key={prod.id} onClick={() => setIsSearchOverlayOpen(false)}>
                    <ProductCard product={prod} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
