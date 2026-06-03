"use client";

import React from "react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Aarav Mehta",
      initials: "AM",
      rating: 5,
      text: "The GaN charger is a total lifesaver. It charges my MacBook Pro and iPhone simultaneously without breaking a sweat, and it fits into my pocket easily! The sand cream finish looks incredibly premium on my desk.",
      product: "PowerHub 65W GaN Wall Charger"
    },
    {
      name: "Priya Sharma",
      initials: "PS",
      rating: 5,
      text: "Absolutely stunning power bank. The smart OLED screen is so helpful to see exactly how much speed is entering my iPad. Highly recommend this brand for premium aesthetics!",
      product: "PowerHub Smart OLED 20K Power Bank"
    },
    {
      name: "Rohan Das",
      initials: "RD",
      rating: 5,
      text: "This display cable is amazing. Seeing the live charging wattage in real-time is fascinating. The braided fabric feels like it will last for ages, doesn't tangle at all.",
      product: "PowerHub Braided 100W Wattage Cable"
    },
    {
      name: "Karan Johar",
      initials: "KJ",
      rating: 5,
      text: "Fitted the 4K webcam onto my monitor. The built-in ring light has completely changed how I look in zoom calls. Absolute value for money and beautiful design.",
      product: "PowerHub Ultra HD 4K Ringlight Webcam"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F3F4F6]/40">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8C9985]/10 border border-[#8C9985]/20">
              <span className="text-[10px] font-extrabold text-[#8C9985] uppercase tracking-wider">
                User Satisfaction
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1A1917] tracking-tight">
              What Our Customers Say
            </h2>
          </div>
          <p className="text-sm font-semibold text-[#1A1917]/50 max-w-sm">
            Read authentic experiences from creators, tech enthusiasts, and professionals.
          </p>
        </div>

        {/* Reviews Marquee */}
        <div className="relative w-full overflow-hidden py-4 -my-4">
          {/* Subtle fade effect on the left and right edges */}
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#F8F9FA] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#F8F9FA] to-transparent z-10 pointer-events-none"></div>

          <div className="animate-marquee flex gap-8">
            {[...reviews, ...reviews].map((rev, index) => (
              <div
                key={`${rev.name}-${index}`}
                className="w-[320px] sm:w-[380px] flex-shrink-0 rounded-3xl bg-white border border-[#1A1917]/5 p-6 flex flex-col justify-between hover-lift transition-all"
              >
                <div className="space-y-4">
                  {/* Star Rating Row */}
                  <div className="flex items-center gap-1 text-sm">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-[#1A1917]/80 leading-relaxed font-medium italic">
                    "{rev.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-[#1A1917]/5 mt-6">
                  <div className="w-10 h-10 rounded-full bg-[#F8F9FA] text-[#C39281] flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                    {rev.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-[#1A1917] truncate">{rev.name}</h4>
                    <span className="text-[10px] font-bold text-[#8C9985] truncate block mt-0.5 uppercase tracking-wide">
                      Verified Purchase: {rev.product.replace("PowerHub ", "")}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
