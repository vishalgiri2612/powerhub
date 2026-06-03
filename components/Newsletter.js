"use client";

import React, { useState } from "react";
import { useCart } from "../app/context/CartContext";

export default function Newsletter() {
  const { applyCouponCode, showToast } = useCart();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // Simple email regex validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    // Success simulation
    setSubscribed(true);
    showToast("Subscription successful! Welcome to the family.");
    
    // Automatically apply coupon code "FIRST200" for the user
    setTimeout(() => {
      applyCouponCode("FIRST200");
    }, 1000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-[#F3F4F6] border border-[#1A1917]/5 p-8 sm:p-16 text-center space-y-6 relative overflow-hidden shadow-sm">
        
        {/* Ambient background light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#E8EFE5] opacity-40 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8C9985]/10 border border-[#8C9985]/20">
            <span className="text-[10px] font-extrabold text-[#8C9985] uppercase tracking-wider">
              Exclusive Privilege
            </span>
          </div>
          
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1A1917] tracking-tight">
            Get ₹200 Off Your First Order
          </h2>
          
          <p className="text-sm font-semibold text-[#1A1917]/60 leading-relaxed">
            Subscribe to our premium catalog updates for members-only deals, early access to new colorway launches, and expert hardware fast-charging tips.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-4">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="flex-1 bg-white border border-[#1A1917]/10 rounded-2xl px-5 py-3.5 text-sm font-semibold text-[#1A1917] outline-none placeholder-[#1A1917]/40 focus:border-[#C39281] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-[#1A1917] hover:bg-[#8C9985] text-white text-xs font-black shadow-lg transition-all hover:scale-103 active:scale-97"
              >
                Subscribe Now
              </button>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-white border border-[#8C9985]/20 text-[#8C9985] font-bold text-sm animate-fade-in-up mt-4">
              🎉 Thank you for subscribing! Your ₹200 coupon code <span className="underline font-black text-[#1A1917]">FIRST200</span> has been generated and automatically applied to your shopping cart!
            </div>
          )}

          <p className="text-[10px] font-bold text-[#1A1917]/40 uppercase pt-2">
            No spam. Unsubscribe anytime in one click.
          </p>
        </div>

      </div>
    </section>
  );
}
