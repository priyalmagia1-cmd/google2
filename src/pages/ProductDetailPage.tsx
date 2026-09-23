import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../services/currency';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  Leaf,
  Award,
  ArrowLeftRight,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    detailProduct,
    currency,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigate,
    setIsCartDrawerOpen,
    isInCompare,
    toggleCompare,
    setIsCompareModalOpen,
    compareItems,
    recordProductView,
  } = useApp();

  // Fallback to first product if none selected
  const product = detailProduct || PRODUCTS[0];

  useEffect(() => {
    if (product) {
      recordProductView(product);
    }
  }, [product?.id]);

  const [selectedImage, setSelectedImage] = useState(product.gallery?.[0] || product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  const isSaved = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  // Recommendations
  const recommendations = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="py-10 bg-neutral-50 dark:bg-[#151618] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/shop')}
          className="text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>

        {/* Product Display Main Card */}
        <div className="bg-white dark:bg-[#1C1D21] rounded-3xl p-6 sm:p-10 border border-neutral-200 dark:border-neutral-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Gallery Column (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 relative">
              <img
                src={selectedImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={() => toggleCompare(product)}
                  className={`p-3 rounded-full backdrop-blur-md transition-all shadow-xs ${
                    isCompared
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-200 hover:text-blue-600'
                  }`}
                  title={isCompared ? 'Remove from Comparison' : 'Compare product side-by-side'}
                >
                  <ArrowLeftRight size={18} />
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-full backdrop-blur-md transition-all ${
                    isSaved
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-200 hover:text-red-500'
                  }`}
                  title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
                >
                  <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {product.gallery && product.gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl border-2 overflow-hidden flex-shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-blue-600 shadow-md scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full">
                  {product.categoryName}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star size={15} fill="currentColor" />
                  <span>{product.rating}</span>
                  <span className="text-neutral-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              <div className="text-3xl font-black text-neutral-900 dark:text-white">
                {formatPrice(product.priceUSD, currency)}
              </div>

              {/* Loyalty Points Callout */}
              <div className="flex items-center gap-2 pt-1 text-xs font-bold text-amber-800 dark:text-amber-200 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 px-3 py-1.5 rounded-xl w-fit">
                <Award size={16} className="text-amber-600 dark:text-amber-400" />
                <span>Earn +{Math.round(product.priceUSD * 10)} Google Gear Points with this item!</span>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed pt-1">
                {product.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {product.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-900 dark:text-white">
                  Color Option: <span className="text-neutral-500 font-medium">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`p-1 rounded-full border-2 transition-all ${
                        selectedColor === c.name ? 'border-blue-600 scale-110' : 'border-transparent'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full block border border-neutral-300 dark:border-neutral-700 shadow-xs"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-900 dark:text-white">
                  Size: <span className="text-neutral-500 font-medium">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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

            {/* Materials & Eco Notes */}
            {(product.materials || product.sustainabilityNote) && (
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                {product.materials && (
                  <div className="font-bold text-neutral-800 dark:text-neutral-200">
                    Materials: <span className="font-normal text-neutral-600 dark:text-neutral-400">{product.materials}</span>
                  </div>
                )}
                {product.sustainabilityNote && (
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
                    <Leaf size={14} /> {product.sustainabilityNote}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 border border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-700 rounded-lg"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-700 rounded-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  <span>ADD TO CART ({formatPrice(product.priceUSD * quantity, currency)})</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-center ${
                    isSaved
                      ? 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-500'
                      : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-red-500 hover:border-red-300'
                  }`}
                  title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  aria-label={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
                >
                  <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-extrabold text-xs py-3.5 rounded-xl transition-colors"
              >
                BUY NOW WITH INSTANT CHECKOUT
              </button>

              {/* Compare Button Row */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => toggleCompare(product)}
                  className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isCompared
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  <ArrowLeftRight size={15} />
                  <span>
                    {isCompared
                      ? 'In Comparison Set (Click to Remove)'
                      : 'Compare with Other Gear (up to 3 items)'}
                  </span>
                </button>

                {compareItems.length > 0 && (
                  <button
                    onClick={() => setIsCompareModalOpen(true)}
                    className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-xs flex-shrink-0"
                    title="Open Side-by-Side Comparison"
                  >
                    <span>View ({compareItems.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-blue-500" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={16} className="text-green-500" />
                <span>30-Day Easy Returns Policy</span>
              </div>
            </div>

          </div>

        </div>

        {/* You May Also Like Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-6 pt-6">
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
              <Sparkles size={22} className="text-yellow-500" /> YOU MAY ALSO LIKE
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <ProductCard key={rec.id} product={rec} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
