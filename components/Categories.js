"use client";

import React from "react";
import { categories } from "../app/data/products";

const themeMap = {
  "Power Banks": {
    bg: "bg-[#DEC89E]/10",
    border: "border-[#DEC89E]/30",
    text: "text-[#3674B5]",
    glow: "rgba(222, 200, 158, 0.2)",
    image: "/images/powerbank.png"
  },
  "Wall Chargers": {
    bg: "bg-[#3674B5]/10",
    border: "border-[#3674B5]/40",
    text: "text-[#3674B5]",
    glow: "rgba(195, 146, 129, 0.2)",
    image: "/images/charger.png"
  },
  "Charging Cables": {
    bg: "bg-[#3674B5]/10",
    border: "border-[#3674B5]/40",
    text: "text-[#3674B5]",
    glow: "rgba(140, 153, 133, 0.2)",
    image: "/images/cable.png"
  },
  "Webcams": {
    bg: "bg-[#DEC89E]/10",
    border: "border-[#DEC89E]/30",
    text: "text-[#3674B5]",
    glow: "rgba(222, 200, 158, 0.2)",
    image: "/images/webcam.png"
  },
  "Earbuds / Audio": {
    bg: "bg-[#3674B5]/10",
    border: "border-[#3674B5]/40",
    text: "text-[#3674B5]",
    glow: "rgba(195, 146, 129, 0.2)",
    image: "/images/earbuds.png"
  },
  "Smart Accessories": {
    bg: "bg-[#3674B5]/10",
    border: "border-[#3674B5]/40",
    text: "text-[#3674B5]",
    glow: "rgba(140, 153, 133, 0.2)",
    image: "/images/magsafe.png"
  }
};

export default function Categories() {
  return (
    <section id="categories" className="py-8 px-4 sm:px-6 lg:px-8 bg-bg-brand relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-radial from-[#F3F4F6] to-transparent opacity-40 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">

        {/* Section Header */}
        <div className="text-center space-y-5 max-w-2xl mx-auto pb-5 border-b border-[#1E293B]/10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
            <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
              Explore Our Collection
            </span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#1E293B] tracking-tight leading-tight">
            Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3674B5] to-[#578FCA]">Category</span>
          </h2>
          <p className="text-sm sm:text-base font-semibold text-[#1E293B]/50 leading-relaxed">
            Tailored hardware designed specifically to match your creative ecosystem and lifestyle.
          </p>
        </div>

        {/* Categories Grid (Increased Card Sizes, Gap, and Spacing) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          {categories.map((category) => {
            const theme = themeMap[category.name] || {
              bg: "bg-[#3674B5]/5",
              border: "border-[#1E293B]/15",
              text: "text-[#1E293B]",
              glow: "rgba(26, 25, 23, 0.05)",
              image: "/images/charger.png"
            };

            return (
              <div
                key={category.name}
                className="group relative rounded-[3rem] bg-white border border-[#1E293B]/10 p-8 text-center hover-lift transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-between min-h-[340px]"
                style={{
                  boxShadow: "0 15px 40px -20px rgba(26, 25, 23, 0.04)"
                }}
                onClick={() => alert(`Navigating to ${category.name} section...`)}
              >
                {/* Ambient Glow */}
                <div 
                  className="absolute -top-20 -left-20 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`
                  }}
                />

                {/* Larger Photo Container (increased size to w-32 h-32 / rounded-[2.2rem]) */}
                <div className={`w-32 h-32 rounded-[2.2rem] ${theme.bg} ${theme.border} border flex items-center justify-center p-3 relative overflow-hidden transition-all duration-500 group-hover:scale-105 shadow-sm`}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1917]/0 to-[#1A1917]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={theme.image} 
                    alt={category.name}
                    className="w-full h-full object-cover rounded-[1.6rem] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                    style={{
                      filter: "drop-shadow(0 8px 12px rgba(26,25,23,0.08))"
                    }}
                  />
                </div>

                {/* Text Content Block */}
                <div className="space-y-1.5">
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#1E293B] group-hover:text-[#3674B5] transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-xs font-bold text-[#1E293B]/40 uppercase tracking-widest">
                    {category.count} Products
                  </p>
                </div>

                {/* Bottom Browse Indicator (increased size & gap) */}
                <div className="mt-5 flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#3674B5] uppercase tracking-widest opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span>Browse</span>
                  <span className="translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
