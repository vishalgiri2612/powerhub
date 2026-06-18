"use client";

import React from "react";
import { useRouter } from "next/navigation";

/**
 * Dynamic home page categories grid.
 * Renders up to 6 categories sorted by homePosition (1-6) from the DB.
 * Layout:
 *   Slot 1 → Big card (left, spans 2 rows)
 *   Slots 2-3 → Medium cards (right, top row)
 *   Slots 4-6 → Small cards (right, bottom row)
 */
export default function Categories() {
  const router = useRouter();
  const [categoriesList, setCategoriesList] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("API response was not ok");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // Only keep categories with a valid homePosition (1-6), sorted by position
          const visible = data
            .filter((c) => c.homePosition >= 1 && c.homePosition <= 6)
            .sort((a, b) => a.homePosition - b.homePosition)
            .slice(0, 6);
          setCategoriesList(visible);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch categories list dynamically for home", err);
      });
  }, []);

  const handleCategoryClick = (categoryName) => {
    router.push(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  // Map slots to layout classes
  // Slot 0 (index 0, position 1) → big card: col-span-6, row-span-2, tall
  // Slots 1-2 (index 1-2) → medium cards: col-span-3, normal height
  // Slots 3-5 (index 3-5) → small cards: col-span-2, normal height
  const getColClass = (index) => {
    if (index === 0) return "md:col-span-6 md:row-span-2";
    if (index <= 2) return "md:col-span-3";
    return "md:col-span-2";
  };

  const getHeightClass = (index) => {
    if (index === 0) return "h-[280px] sm:h-[380px] md:h-[464px]";
    return "h-[180px] md:h-[220px]";
  };

  if (categoriesList.length === 0) return null;

  return (
    <section id="categories" className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-bg-brand relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-radial from-[#F3F4F6] to-transparent opacity-40 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 md:space-y-5 max-w-2xl mx-auto pb-4 md:pb-5 border-b border-[#1E293B]/10">
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
            Premium connectivity solutions and hardware collections tailored for your workspace.
          </p>
        </div>

        {/* Dynamic 6-slot Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {categoriesList.map((cat, index) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`group relative rounded-[2rem] bg-white border border-[#1E293B]/10 overflow-hidden cursor-pointer shadow-xs flex items-center justify-center hover-lift transition-all duration-500 ${getColClass(index)} ${getHeightClass(index)}`}
            >
              <img
                src={cat.image || "/images/charger.png"}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
              <span className="bg-black/80 backdrop-blur-xs text-white text-[10px] sm:text-xs font-black uppercase px-4 py-2 rounded-lg absolute bottom-4 left-4 sm:bottom-6 sm:left-6 tracking-wider z-10">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
