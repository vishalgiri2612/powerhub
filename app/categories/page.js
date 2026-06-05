"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { categories } from "../data/products";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchModal from "../../components/SearchModal";
import CartDrawer from "../../components/CartDrawer";

const themeMap = {
  "Cables": {
    bg: "bg-[#3674B5]/10",
    border: "border-[#3674B5]/40",
    glow: "rgba(54, 116, 181, 0.15)",
    image: "/images/cable.png"
  },
  "Converters": {
    bg: "bg-[#DEC89E]/10",
    border: "border-[#DEC89E]/30",
    glow: "rgba(222, 200, 158, 0.2)",
    image: "/images/charger.png"
  },
  "Accessories": {
    bg: "bg-[#3674B5]/10",
    border: "border-[#3674B5]/40",
    glow: "rgba(54, 116, 181, 0.15)",
    image: "/images/webcam.png"
  },
  "Surveillance": {
    bg: "bg-[#DEC89E]/10",
    border: "border-[#DEC89E]/30",
    glow: "rgba(222, 200, 158, 0.2)",
    image: "/images/ravtron_utility_dev.png"
  },
  "Docking Stations": {
    bg: "bg-[#3674B5]/10",
    border: "border-[#3674B5]/40",
    glow: "rgba(54, 116, 181, 0.15)",
    image: "/images/magsafe.png"
  },
  "Audio Video": {
    bg: "bg-[#DEC89E]/10",
    border: "border-[#DEC89E]/30",
    glow: "rgba(222, 200, 158, 0.2)",
    image: "/images/hero.png"
  },
  "Networking": {
    bg: "bg-[#3674B5]/10",
    border: "border-[#3674B5]/40",
    glow: "rgba(54, 116, 181, 0.15)",
    image: "/images/ravtron_networking.png"
  }
};

export default function CategoriesPage() {
  const router = useRouter();

  const handleCategoryClick = (categoryName) => {
    router.push(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-bg-brand text-text-brand antialiased selection:bg-[#3674B5] selection:text-white">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pt-12 pb-24 space-y-12 relative z-10">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto border-b border-[#1E293B]/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
            <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
              Product Categories
            </span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#1E293B] tracking-tight leading-tight">
            Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3674B5] to-[#578FCA]">Category</span>
          </h1>
          <p className="text-sm font-semibold text-[#1E293B]/50 leading-relaxed">
            Select a category card below to browse products engineered specifically for that hardware setup.
          </p>
        </div>

        {/* Categories Grid - 4 Columns on Large Screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const theme = themeMap[category.name] || {
              bg: "bg-[#3674B5]/5",
              border: "border-[#1E293B]/15",
              glow: "rgba(26, 25, 23, 0.05)",
              image: "/images/charger.png"
            };

            return (
              <div
                key={category.name}
                className="group relative rounded-[2rem] bg-white border border-[#1E293B]/10 overflow-hidden flex flex-col justify-between hover-lift transition-all duration-500 cursor-pointer h-full shadow-2xs"
                onClick={() => handleCategoryClick(category.name)}
              >
                {/* Ambient Glow */}
                <div 
                  className="absolute -top-20 -left-20 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`
                  }}
                />

                {/* Studio-lit Large Photo Container */}
                <div className="relative w-full h-56 bg-[#F8F9FA] flex items-center justify-center p-0 border-b border-[#1E293B]/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1917]/0 to-[#1A1917]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={theme.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:rotate-1"
                    style={{
                      filter: "drop-shadow(0 12px 18px rgba(26,25,23,0.06))"
                    }}
                  />
                </div>

                {/* Text Content Block */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <h3 className="font-display font-black text-xl sm:text-2xl text-[#1E293B] group-hover:text-[#3674B5] transition-colors duration-300">
                      {category.name}
                    </h3>
                    {/* Inline list of subcategories */}
                    <div className="flex flex-wrap gap-1.5">
                      {category.subcategories.map((sub) => (
                        <span 
                          key={sub} 
                          className="text-[10px] font-bold text-[#1E293B]/60 bg-[#F8F9FA] px-2.5 py-1 rounded-md border border-[#1E293B]/5 hover:bg-[#3674B5]/5 hover:text-[#3674B5] transition-colors"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Browse CTA Link */}
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-extrabold text-[#3674B5] uppercase tracking-wider">
                    <span>Explore Category</span>
                    <span className="transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
 
        {/* Explore All Shop Products CTA Button */}
        <div className="pt-16 text-center">
          <button
            onClick={() => router.push("/shop")}
            className="inline-flex items-center gap-3 px-8 py-4.5 rounded-full bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-black uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] active:scale-97 shadow-lg shadow-[#3674B5]/15"
          >
            <span>Explore All Products</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
 
      </main>

      <Footer />
      <SearchModal />
      <CartDrawer />
    </div>
  );
}
