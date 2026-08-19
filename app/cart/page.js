"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Lock,
  Check
} from "lucide-react";
import Navbar from "../../components/Navbar";
import SearchModal from "../../components/SearchModal";
import CartDrawer from "../../components/CartDrawer";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    coupon,
    discount,
    applyCouponCode,
    removeCoupon,
    getSubtotal,
    clearCart,
    coupons,
    showToast
  } = useCart();

  const [promoInput, setPromoInput] = useState("");

  const subtotal = getSubtotal();
  const shipping = subtotal > 999 ? 0 : subtotal === 0 ? 0 : 99;
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = Math.round(taxableAmount * 0.18); // 18% GST
  const grandTotal = taxableAmount + shipping + taxAmount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyCouponCode(promoInput);
      setPromoInput("");
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty. Add products to proceed.", "error");
      return;
    }
    const session = localStorage.getItem("ravtron_session");
    if (!session) {
      showToast("Please log in to proceed to checkout", "error");
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-bg-brand text-text-brand antialiased selection:bg-[#3674B5] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 relative z-10 w-full flex-grow">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8">
          <button
            onClick={() => router.push("/shop")}
            className="hover:text-[#3674B5] transition-colors flex items-center gap-1.5 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Shop</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-[#1E293B] font-bold">Shopping Cart Bag</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#1E293B]/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/20 text-[#3674B5] text-[10px] font-black uppercase tracking-wider mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Your Selected Items</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-[#1E293B] tracking-tight">
              Shopping Cart
            </h1>
          </div>

          {cart.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearCart}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cart</span>
              </button>
              <span className="bg-[#3674B5] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
              </span>
            </div>
          )}
        </div>

        {/* Content Layout */}
        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="py-20 text-center space-y-6 max-w-md mx-auto">
            <div className="w-24 h-24 rounded-full bg-white border border-[#1E293B]/10 flex items-center justify-center mx-auto text-[#1E293B]/20 shadow-md">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display font-black text-2xl text-[#1E293B]">
                Your Shopping Bag is Empty
              </h2>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Explore our catalog of high-performance fast chargers, premium cables, and smart accessories to populate your bag.
              </p>
            </div>
            <button
              onClick={() => router.push("/shop")}
              className="px-8 py-4 rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-lg shadow-[#3674B5]/20 inline-flex items-center gap-2"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Cart Items & Summary Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item, index) => {
                const itemKey = `${item.id || item._id || "item"}-${item.selectedSize || ""}-${item.selectedPrivacySize || ""}-${item.selectedChannel || ""}-${index}`;
                const variantTag =
                  item.selectedSize ||
                  item.selectedPrivacySize ||
                  item.selectedChannel;

                return (
                  <div
                    key={itemKey}
                    className="bg-white border border-[#1E293B]/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Item Image & Description */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#F8F9FA] border border-[#1E293B]/5 p-2 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="text-[9px] font-extrabold text-[#3674B5] uppercase tracking-widest bg-[#3674B5]/10 px-2.5 py-0.5 rounded-full inline-block">
                          {item.category || "Accessory"}
                        </span>
                        <h3 className="font-display font-bold text-sm sm:text-base text-[#1E293B] truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 truncate">
                          {item.color || item.shortSpec || "Premium finish"}
                          {variantTag ? ` · Option: ${variantTag}` : ""}
                        </p>
                        <div className="text-sm font-extrabold text-[#3674B5] pt-0.5">
                          ₹{item.price.toLocaleString()}{" "}
                          <span className="text-[10px] font-medium text-slate-400">
                            / each
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Total Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl px-2 py-1 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item, -1)}
                          className="w-7 h-7 rounded-lg hover:bg-white text-[#1E293B] font-bold flex items-center justify-center transition-colors text-xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-black text-xs text-[#1E293B]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item, 1)}
                          className="w-7 h-7 rounded-lg hover:bg-white text-[#1E293B] font-bold flex items-center justify-center transition-colors text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Subtotal */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-xs font-semibold text-slate-400 block text-[10px] uppercase tracking-wider">
                          Subtotal
                        </span>
                        <span className="font-black text-base text-[#1E293B]">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors hover:bg-rose-50 rounded-xl cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Free Delivery Incentive Ribbon */}
              <div className="bg-[#F8F9FA] border border-[#1E293B]/10 rounded-2xl p-4 flex items-center justify-between text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#3674B5]/10 text-[#3674B5] flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    {subtotal >= 999 ? (
                      <p className="font-bold text-[#1E293B]">
                        🎉 You qualify for <span className="text-[#3674B5]">FREE Standard Delivery!</span>
                      </p>
                    ) : (
                      <p>
                        Add <span className="font-bold text-[#3674B5]">₹{(999 - subtotal).toLocaleString()}</span> more to unlock <span className="font-bold text-[#1E293B]">Free Shipping</span>.
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  href="/shop"
                  className="text-xs font-bold text-[#3674B5] hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Add More</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                <div className="bg-white border border-[#1E293B]/10 rounded-2xl p-3.5 space-y-1">
                  <ShieldCheck className="w-5 h-5 text-[#3674B5] mx-auto" />
                  <h4 className="text-xs font-bold text-[#1E293B]">100% Authentic</h4>
                  <p className="text-[10px] font-semibold text-slate-400">Genuine RAVTRON® Products</p>
                </div>
                <div className="bg-white border border-[#1E293B]/10 rounded-2xl p-3.5 space-y-1">
                  <Truck className="w-5 h-5 text-[#3674B5] mx-auto" />
                  <h4 className="text-xs font-bold text-[#1E293B]">Fast Dispatch</h4>
                  <p className="text-[10px] font-semibold text-slate-400">Ships within 24 Hours</p>
                </div>
                <div className="bg-white border border-[#1E293B]/10 rounded-2xl p-3.5 space-y-1">
                  <RotateCcw className="w-5 h-5 text-[#3674B5] mx-auto" />
                  <h4 className="text-xs font-bold text-[#1E293B]">7-Day Return</h4>
                  <p className="text-[10px] font-semibold text-slate-400">Easy Replacement Policy</p>
                </div>
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <div className="bg-white border border-[#1E293B]/10 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
                <h3 className="font-display font-black text-lg text-[#1E293B] border-b border-[#1E293B]/10 pb-4">
                  Order Summary
                </h3>

                {/* Promo Code Input */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Promotional Coupon Code
                  </label>
                  {coupon ? (
                    <div className="flex items-center justify-between bg-[#3674B5]/10 border border-[#3674B5]/40 rounded-xl px-3.5 py-2.5">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#3674B5]" />
                        <span className="text-xs font-bold text-[#3674B5]">
                          Code "{coupon}" Active
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <form onSubmit={handleApplyPromo} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. WELCOME100"
                          className="flex-1 bg-[#F8F9FA] border border-[#1E293B]/15 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1E293B] outline-none placeholder-slate-400 focus:bg-white focus:border-[#3674B5]"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 rounded-xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-2xs cursor-pointer"
                        >
                          Apply
                        </button>
                      </form>

                      {/* Dropdown for existing active coupon offers */}
                      {Array.isArray(coupons) && coupons.filter((c) => c.active).length > 0 && (
                        <div className="relative">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                applyCouponCode(e.target.value);
                              }
                            }}
                            defaultValue=""
                            className="w-full bg-[#FFFDF7] border border-[#EAE3D2] hover:border-[#3674B5]/40 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E293B] outline-none focus:border-[#3674B5] transition-all cursor-pointer appearance-none pr-8 shadow-2xs"
                          >
                            <option value="" disabled>
                              🏷️ Select an existing coupon offer ({coupons.filter((c) => c.active).length} available)
                            </option>
                            {coupons
                              .filter((c) => c.active)
                              .map((c) => {
                                const discountText = c.type === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`;
                                const minText = c.minPurchase > 0 ? ` (Min ₹${c.minPurchase})` : "";
                                return (
                                  <option key={c._id || c.code} value={c.code} className="text-slate-900 font-medium py-1">
                                    [{c.code}] - {discountText}{minText} ({c.title || "Special Offer"})
                                  </option>
                                );
                              })}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                            ▼
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Breakdown List */}
                <div className="space-y-3.5 text-xs font-semibold text-slate-600 border-t border-[#1E293B]/10 pt-4">
                  <div className="flex justify-between items-center">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-[#1E293B]">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center text-[#3674B5]">
                      <span>Discount Coupon</span>
                      <span className="font-bold">– ₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-[#1E293B]">
                      {shipping === 0 ? (
                        <span className="text-[#3674B5] font-black uppercase text-[10px]">
                          Free
                        </span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Estimated GST Tax (18%)</span>
                    <span className="font-bold text-[#1E293B]">
                      ₹{taxAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t border-[#1E293B]/10 pt-4 flex justify-between items-center text-base font-bold text-[#1E293B]">
                    <span>Total Amount</span>
                    <span className="font-black text-xl text-[#3674B5]">
                      ₹{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Main Action CTAs */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-4 rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#3674B5]/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Proceed to Checkout</span>
                  </button>

                  <button
                    onClick={() => router.push("/shop")}
                    className="w-full py-3.5 rounded-2xl border border-[#1E293B]/10 hover:bg-[#F8F9FA] text-[#1E293B] text-xs font-extrabold uppercase tracking-widest transition-all text-center block"
                  >
                    Continue Shopping
                  </button>
                </div>

                <p className="text-[9px] text-center text-slate-400 font-semibold leading-normal pt-2">
                  🔒 Encrypted checkout tunnel. Taxes calculated based on destination postal state.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <SearchModal />
      <CartDrawer />
    </div>
  );
}
