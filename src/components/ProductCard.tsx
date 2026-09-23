import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../services/currency';
import { Heart, Star, Eye, ShoppingBag, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    currency,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openQuickView,
    openProductDetail,
    lowBandwidth,
  } = useApp();

  const isSaved = isInWishlist(product.id);

  const badgeColor = (badge: string) => {
    switch (badge) {
      case 'New Drop':
        return 'bg-blue-600 text-white';
      case 'Trending':
        return 'bg-amber-500 text-neutral-900';
      case 'Limited Drop':
        return 'bg-red-600 text-white';
      case 'Sustainable':
        return 'bg-emerald-600 text-white';
      case 'Hidden Gem':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-neutral-800 text-white';
    }
  };

  return (
    <div className="group relative bg-white dark:bg-[#1E1F23] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-900 overflow-hidden cursor-pointer"
           onClick={() => openProductDetail(product)}>
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading={lowBandwidth ? "lazy" : "eager"}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            lowBandwidth ? '' : 'group-hover:scale-105'
          }`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs tracking-wider ${badgeColor(
                badge
              )}`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isSaved
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-200 hover:bg-white hover:text-red-500'
          }`}
          title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="bg-white/90 hover:bg-white text-neutral-900 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Eye size={15} />
            Quick View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
          >
            <ShoppingBag size={15} />
            Quick Add
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            <span>{product.categoryName}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={13} fill="currentColor" />
              <span className="font-bold text-neutral-900 dark:text-neutral-100">
                {product.rating}
              </span>
              <span className="text-neutral-400">({product.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => openProductDetail(product)}
            className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 font-normal">
            {product.tagline}
          </p>
        </div>

        {/* Color swatches preview if available */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                className="w-3 h-3 rounded-full border border-neutral-300 dark:border-neutral-700 shadow-xs"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              ></span>
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-neutral-400 font-bold">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 mt-1">
          <div>
            <div className="text-base font-black text-neutral-900 dark:text-white">
              {formatPrice(product.priceUSD, currency)}
            </div>
            {product.stockCount && product.stockCount < 15 && (
              <span className="text-[10px] font-bold text-red-500">
                Only {product.stockCount} left!
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 text-neutral-900 dark:text-neutral-100 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
          >
            <ShoppingBag size={14} />
            <span>Add</span>
          </button>
        </div>

      </div>
    </div>
  );
};
