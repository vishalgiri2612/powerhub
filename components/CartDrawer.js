"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";

export default function CartDrawer() {
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
      className="fixed inset-0 z-[999] bg-[#1A1917]/40 backdrop-blur-sm flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div 
        className="w-full max-w-md h-full bg-[#F8F9FA] border-l border-[#1A1917]/10 flex flex-col shadow-2xl animate-fade-in-up"
        style={{ animationDuration: '0.4s' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#1A1917]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-[#1A1917] font-display">Your Cart</h3>
            <span className="bg-[#8C9985] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-[#1A1917]/5 text-[#1A1917]/60 hover:text-[#1A1917] transition-all"
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
              <div className="w-20 h-20 rounded-full bg-[#F3F4F6] flex items-center justify-center text-4xl mb-4">
                🛍️
              </div>
              <h4 className="text-lg font-bold text-[#1A1917]">Your cart is empty</h4>
              <p className="text-sm text-[#1A1917]/60 mt-1 max-w-xs">
                Fill it with our state-of-the-art fast chargers and smart accessories.
              </p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-6 py-3 rounded-full bg-[#1A1917] hover:bg-[#8C9985] text-white text-sm font-bold transition-all hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id}
                className="flex gap-4 p-3 rounded-2xl bg-[#F3F4F6] border border-[#1A1917]/5 transition-all hover:border-[#1A1917]/10"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 rounded-xl object-contain bg-white p-1 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="font-bold text-sm text-[#1A1917] truncate">{item.name}</h5>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#1A1917]/40 hover:text-[#C39281] transition-all flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-[#1A1917]/60 truncate mt-0.5">{item.color || item.shortSpec}</p>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 bg-white rounded-lg p-1 border border-[#1A1917]/5">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#F3F4F6] text-[#1A1917] font-semibold text-xs transition-all"
                      >
                        –
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#1A1917]">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#F3F4F6] text-[#1A1917] font-semibold text-xs transition-all"
                      >
                        +
                      </button>
                    </div>
                    {/* Price */}
                    <div className="text-right">
                      <span className="font-bold text-sm text-[#C39281]">
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
          <div className="p-6 border-t border-[#1A1917]/10 bg-[#F3F4F6] space-y-4">
            {/* Promo Code Input */}
            {coupon ? (
              <div className="flex items-center justify-between bg-[#8C9985]/10 border border-[#8C9985]/30 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs">🏷️</span>
                  <span className="text-xs font-bold text-[#8C9985]">
                    Promo Code "{coupon}" Active
                  </span>
                </div>
                <button 
                  onClick={removeCoupon}
                  className="text-xs text-[#C39281] hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Promo Code (e.g. FIRST200)"
                  className="flex-1 bg-white border border-[#1A1917]/10 rounded-xl px-4 py-2 text-xs font-medium text-[#1A1917] outline-none placeholder-[#1A1917]/40 focus:border-[#C39281]"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1A1917] hover:bg-[#8C9985] text-white text-xs font-bold transition-all"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-sm text-[#1A1917]/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#8C9985]">
                  <span>Discount</span>
                  <span className="font-semibold">– ₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-[#8C9985] font-semibold">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="border-t border-[#1A1917]/10 pt-2 flex justify-between text-base font-bold text-[#1A1917]">
                <span>Total Amount</span>
                <span className="text-[#C39281]">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                alert(`Proceeding to checkout with total amount: ₹${grandTotal.toLocaleString()}`);
              }}
              className="w-full py-4 rounded-xl bg-[#1A1917] hover:bg-[#8C9985] text-white text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Secure Checkout</span>
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
