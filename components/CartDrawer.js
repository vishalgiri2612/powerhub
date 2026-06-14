"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../app/context/CartContext";
import { ShoppingBag, Tag } from "lucide-react";

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    coupon,
    discount,
    applyCouponCode,
    removeCoupon,
    getSubtotal,
    clearCart,
    showToast
  } = useCart();

  const [promoInput, setPromoInput] = useState("");

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const shipping = subtotal > 999 ? 0 : subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyCouponCode(promoInput);
      setPromoInput("");
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[999] bg-[#3674B5]/40 backdrop-blur-sm flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div 
        className="w-full max-w-md h-full bg-[#FFFFFF] border-l border-[#1E293B]/15 flex flex-col shadow-2xl animate-fade-in-up"
        style={{ animationDuration: '0.4s' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#1E293B]/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-[#1E293B] font-display">Your Cart</h3>
            <span className="bg-[#3674B5] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-[#3674B5]/5 text-[#1E293B]/60 hover:text-[#1E293B] transition-all"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#F8F9FA] flex items-center justify-center mb-4 text-[#1E293B]/25">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-[#1E293B]">Your cart is empty</h4>
              <p className="text-sm text-[#1E293B]/60 mt-1 max-w-xs">
                Fill it with our state-of-the-art fast chargers and smart accessories.
              </p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-6 py-3 rounded-full bg-[#3674B5] hover:bg-[#578FCA] text-white text-sm font-bold transition-all hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id}
                className="flex gap-4 p-3 rounded-2xl bg-[#F8F9FA] border border-[#1E293B]/10 transition-all hover:border-[#1E293B]/15"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 rounded-xl object-contain bg-white p-1 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="font-bold text-sm text-[#1E293B] truncate">{item.name}</h5>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#1E293B]/40 hover:text-[#3674B5] transition-all flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-[#1E293B]/60 truncate mt-0.5">{item.color || item.shortSpec}</p>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 bg-white rounded-lg p-1 border border-[#1E293B]/10">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#1E293B] font-semibold text-xs transition-all"
                      >
                        –
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#1E293B]">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#1E293B] font-semibold text-xs transition-all"
                      >
                        +
                      </button>
                    </div>
                    {/* Price */}
                    <div className="text-right">
                      <span className="font-bold text-sm text-[#3674B5]">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Calculator */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#1E293B]/15 bg-[#F8F9FA] space-y-4">
            {/* Promo Code Input */}
            {coupon ? (
              <div className="flex items-center justify-between bg-[#3674B5]/10 border border-[#3674B5]/40 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#3674B5]" />
                  <span className="text-xs font-bold text-[#3674B5]">
                    Promo Code "{coupon}" Active
                  </span>
                </div>
                <button 
                  onClick={removeCoupon}
                  className="text-xs text-[#3674B5] hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Promo Code (e.g. FIRST200)"
                  className="flex-1 bg-white border border-[#1E293B]/15 rounded-xl px-4 py-2 text-xs font-medium text-[#1E293B] outline-none placeholder-[#334155]/40 focus:border-[#3674B5]"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-bold transition-all"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-sm text-[#1E293B]/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#3674B5]">
                  <span>Discount</span>
                  <span className="font-semibold">– ₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-[#3674B5] font-semibold">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="border-t border-[#1E293B]/15 pt-2 flex justify-between text-base font-bold text-[#1E293B]">
                <span>Total Amount</span>
                <span className="text-[#3674B5]">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                const session = localStorage.getItem("ravtron_session");
                if (!session) {
                  showToast("Please log in to complete your checkout", "error");
                  setIsCartOpen(false);
                  router.push("/login");
                  return;
                }

                // Close drawer and redirect to checkout page
                setIsCartOpen(false);
                router.push("/checkout");
              }}
              className="w-full py-4 rounded-xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
