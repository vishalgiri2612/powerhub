"use client";

import React from "react";

export default function BrandTrust() {
  const brands = [
    "Apple Compatible",
    "Samsung Super Fast",
    "OnePlus Warp Ready",
    "Dell Power Delivery",
    "HP Smart Charge",
    "Lenovo Type-C",
    "BIS Safe Certified",
    "CE Safety Compliant"
  ];

  return (
    <section className="py-12 bg-white border-y border-[#1E293B]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-col items-center text-center">
        <span className="text-[10px] font-extrabold text-[#1E293B]/40 uppercase tracking-widest">
          Universal Compatibility & Safety Standards
        </span>
      </div>

      {/* Infinite scrolling marquee wrapper */}
      <div className="relative w-full flex items-center overflow-hidden pointer-events-none">
        
        {/* Left Blur Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
        
        {/* Right Blur Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>

        {/* Marquee Body */}
        <div className="animate-marquee whitespace-nowrap flex gap-12 sm:gap-20 items-center">
          {/* Double list to support seamless infinite loop */}
          {[...brands, ...brands].map((brand, idx) => (
            <div 
              key={`${brand}-${idx}`}
              className="flex items-center gap-2.5 font-display font-extrabold text-[#1E293B]/40 hover:text-[#1E293B]/80 transition-colors text-base sm:text-lg tracking-wider uppercase"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#3674B5]/30"></span>
              <span>{brand}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
