import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../services/currency';
import { PRODUCTS } from '../data/products';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Plus,
  Truck,
  CheckCircle,
  Gift,
  Tag,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    currency,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    navigate,
    addToCart,
    showToast,
    loyaltyPoints,
    appliedVoucher,
    removeVoucher,
    setIsLoyaltyModalOpen,
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);

  if (!isCartDrawerOpen) return null;

  const rawSubtotalUSD = cart.reduce((acc, item) => acc + item.product.priceUSD * item.quantity, 0);
  const voucherDiscountUSD = appliedVoucher ? appliedVoucher.discountAmountUSD : 0;
  const percentDiscountUSD = (rawSubtotalUSD * appliedDiscountPercent) / 100;
  const totalDiscountUSD = voucherDiscountUSD + percentDiscountUSD;

  const subtotalUSD = Math.max(0, rawSubtotalUSD - totalDiscountUSD);
  const freeShippingThresholdUSD = 50;
  const amountToFreeShippingUSD = Math.max(0, freeShippingThresholdUSD - subtotalUSD);
  const shippingUSD = subtotalUSD >= freeShippingThresholdUSD || subtotalUSD === 0 || (appliedVoucher && appliedVoucher.code === 'FREESHIP') ? 0 : 5.99;
  const totalUSD = subtotalUSD + shippingUSD;
  const estimatedPointsEarned = Math.round(totalUSD * 10);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'GOOGLE10' || promoCode.trim().toUpperCase() === 'GEAR2026') {
      setAppliedDiscountPercent(15);
      showToast('🎉 Promo code applied! 15% discount granted.');
    } else {
      showToast('Invalid promo code. Try "GOOGLE10" or "GEAR2026".');
    }
  };

  // Cross sell recommendations (items not in cart)
  const cartIds = cart.map((i) => i.product.id);
  const crossSells = PRODUCTS.filter((p) => !cartIds.includes(p.id)).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={() => setIsCartDrawerOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#18191C] shadow-2xl border-l border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-blue-600 dark:text-blue-400" size={20} />
              <h2 className="text-base font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider">
                Your Gear Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-5 py-3 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40">
            {amountToFreeShippingUSD === 0 ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle size={16} />
                <span>You unlocked FREE Global Shipping! 🚀</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
                  <span className="flex items-center gap-1">
                    <Truck size={14} /> Add {formatPrice(amountToFreeShippingUSD, currency)} more for FREE Shipping
                  </span>
                  <span>{Math.round((subtotalUSD / freeShippingThresholdUSD) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotalUSD / freeShippingThresholdUSD) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-neutral-100 dark:divide-neutral-800">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white">Your cart is empty</h3>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1">
                    Explore the latest Google Gear Drop catalog and discover streetwear, Chrome Dino, and tech accessories.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold px-6 py-2.5 rounded-full shadow-md transition-colors"
                >
                  EXPLORE ALL GEAR →
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0 flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-neutral-900 dark:text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-neutral-500 font-medium space-x-2">
                          {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                        className="text-neutral-400 hover:text-red-500 p-1"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center font-bold text-xs text-neutral-600 dark:text-neutral-300"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center font-bold text-xs text-neutral-600 dark:text-neutral-300"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-black text-neutral-900 dark:text-white">
                        {formatPrice(item.product.priceUSD * item.quantity, currency)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* You Might Also Like Recommendations */}
            {cart.length > 0 && crossSells.length > 0 && (
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1">
                    <Sparkles size={14} className="text-yellow-500" /> YOU MIGHT ALSO LIKE
                  </h4>
                </div>
                <div className="space-y-2">
                  {crossSells.map((cross) => (
                    <div
                      key={cross.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={cross.image}
                          alt={cross.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div>
                          <p className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">
                            {cross.name}
                          </p>
                          <p className="text-[10px] font-bold text-neutral-500">
                            {formatPrice(cross.priceUSD, currency)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(cross)}
                        className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-xs font-bold p-1.5 rounded-lg transition-colors"
                        title="Add to cart"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 space-y-3">
              {/* Loyalty Rewards Points Banner */}
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setIsLoyaltyModalOpen(true);
                }}
                className="w-full p-2.5 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl flex items-center justify-between text-xs transition-colors hover:bg-amber-500/20"
              >
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-amber-600 dark:text-amber-400" />
                  <span className="font-bold text-amber-900 dark:text-amber-200">
                    You'll earn <span className="font-black text-amber-600 dark:text-amber-400">+{estimatedPointsEarned} PTS</span> with this order
                  </span>
                </div>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 underline">
                  Redeem Rewards
                </span>
              </button>

              {/* Applied Loyalty Voucher Badge if present */}
              {appliedVoucher && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Tag size={15} className="text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="font-extrabold text-emerald-900 dark:text-emerald-200">
                        {appliedVoucher.title}
                      </div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                        Code: {appliedVoucher.code}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={removeVoucher}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Promo Code Form */}
              <form onSubmit={applyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. GOOGLE10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white px-3 py-2 rounded-xl flex-1 uppercase focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-900 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Summary Calculations */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatPrice(rawSubtotalUSD, currency)}</span>
                </div>
                {totalDiscountUSD > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Loyalty Voucher / Discount</span>
                    <span>-{formatPrice(totalDiscountUSD, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Estimated Shipping</span>
                  <span className="font-bold">
                    {shippingUSD === 0 ? 'FREE' : formatPrice(shippingUSD, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span>Total</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {formatPrice(totalUSD, currency)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/checkout');
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>CHECKOUT</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full text-center text-xs font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
