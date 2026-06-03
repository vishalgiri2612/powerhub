"use client";

import React, { useState } from "react";
import { useCart } from "../app/context/CartContext";
import { Sparkles } from "lucide-react";

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
      <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-[#F8F9FA] border border-[#1E293B]/10 p-8 sm:p-16 text-center space-y-6 relative overflow-hidden shadow-sm">
        
        {/* Ambient background light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#E8EFE5] opacity-40 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
            <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
              Exclusive Privilege
            </span>
          </div>
          
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1E293B] tracking-tight">
            Get ₹200 Off Your First Order
          </h2>
          
          <p className="text-sm font-semibold text-[#1E293B]/60 leading-relaxed">
            Subscribe to our premium catalog updates for members-only deals, early access to new colorway launches, and expert hardware fast-charging tips.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-4">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="flex-1 bg-white border border-[#1E293B]/15 rounded-2xl px-5 py-3.5 text-sm font-semibold text-[#1E293B] outline-none placeholder-[#334155]/40 focus:border-[#3674B5] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-black shadow-lg transition-all hover:scale-103 active:scale-97"
              >
                Subscribe Now
              </button>
            </form>
          ) : (
            <div className="flex items-start gap-2.5 p-6 rounded-2xl bg-white border border-[#3674B5]/30 text-[#3674B5] font-bold text-sm animate-fade-in-up mt-4 text-left">
              <Sparkles className="w-5 h-5 text-[#3674B5] flex-shrink-0 mt-0.5" />
              <span>Thank you for subscribing! Your ₹200 coupon code <span className="underline font-black text-[#1E293B]">FIRST200</span> has been generated and automatically applied to your shopping cart!</span>
            </div>
          )}

          <p className="text-[10px] font-bold text-[#1E293B]/40 uppercase pt-2">
            No spam. Unsubscribe anytime in one click.
          </p>
        </div>

      </div>
    </section>
  );
}
