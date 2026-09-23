import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../services/currency';
import { X, Star, Heart, ShoppingBag, ArrowRight, ShieldCheck, Truck, ArrowLeftRight } from 'lucide-react';

export const ProductQuickView: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    currency,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openProductDetail,
    isInCompare,
    toggleCompare,
  } = useApp();

  if (!quickViewProduct) return null;

  const [selectedImage, setSelectedImage] = useState<string>(
    quickViewProduct.gallery?.[0] || quickViewProduct.image
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    quickViewProduct.colors?.[0]?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    quickViewProduct.sizes?.[0] || ''
  );
  const [quantity, setQuantity] = useState<number>(1);

  const isSaved = isInWishlist(quickViewProduct.id);

  const handleAdd = () => {
    addToCart(quickViewProduct, selectedColor, selectedSize, quantity);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative bg-white dark:bg-[#1C1D21] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Gallery Image Column */}
        <div className="md:w-1/2 p-6 bg-neutral-50 dark:bg-neutral-900/50 flex flex-col items-center justify-center gap-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <img
              src={selectedImage}
              alt={quickViewProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {quickViewProduct.gallery && quickViewProduct.gallery.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-1">
              {quickViewProduct.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-blue-600 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                {quickViewProduct.categoryName}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star size={14} fill="currentColor" />
                <span>{quickViewProduct.rating}</span>
                <span className="text-neutral-400 font-normal">({quickViewProduct.reviewCount})</span>
              </div>
            </div>

            <h2 className="text-xl font-black text-neutral-900 dark:text-white leading-tight">
              {quickViewProduct.name}
            </h2>

            <div className="text-2xl font-black text-neutral-900 dark:text-white">
              {formatPrice(quickViewProduct.priceUSD, currency)}
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {quickViewProduct.description}
            </p>
          </div>

          {/* Color Selector */}
          {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Color: <span className="text-neutral-500 font-normal">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2">
                {quickViewProduct.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`p-1 rounded-full border-2 transition-all ${
                      selectedColor === c.name ? 'border-blue-600 scale-110' : 'border-transparent'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full block border border-neutral-300 dark:border-neutral-700"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Size: <span className="text-neutral-500 font-normal">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {quickViewProduct.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedSize === s
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 border border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-700 rounded-lg"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-700 rounded-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => toggleCompare(quickViewProduct)}
                className={`p-3 rounded-xl border transition-colors ${
                  isInCompare(quickViewProduct.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                title={isInCompare(quickViewProduct.id) ? 'Remove from comparison' : 'Compare product'}
              >
                <ArrowLeftRight size={18} />
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct)}
                className={`p-3 rounded-xl border transition-colors ${
                  isSaved
                    ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-950/40'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
                aria-label={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
              >
                <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-extrabold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              <span>ADD TO CART ({formatPrice(quickViewProduct.priceUSD * quantity, currency)})</span>
            </button>

            <button
              onClick={() => {
                openProductDetail(quickViewProduct);
                closeQuickView();
              }}
              className="w-full text-xs font-bold text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center gap-1 transition-colors pt-1"
            >
              <span>View Full Product Page & Reviews</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
