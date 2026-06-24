"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { categories as defaultCategories } from "../app/data/products";

// Helper to sort categories
const sortCategories = (list) => {
  return [...list].sort((a, b) => {
    const aPos = a.homePosition > 0 ? a.homePosition : 999;
    const bPos = b.homePosition > 0 ? b.homePosition : 999;
    if (aPos !== bPos) return aPos - bPos;
    return a.name.localeCompare(b.name);
  });
};

export default function CircularCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState(() => sortCategories(defaultCategories));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = sortCategories(data);
          setCategories(sorted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load categories for circular navigation", err);
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (categoryName) => {
    router.push(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6 md:py-10 relative overflow-hidden bg-bg-brand">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative w-full overflow-hidden py-4 -my-4"
          style={{
            maskImage: "linear-gradient(to right, transparent, #fff 4%, #fff 96%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, #fff 4%, #fff 96%, transparent)"
          }}
        >
          <div className="animate-marquee-triple flex gap-6 sm:gap-10 lg:gap-14">
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-shrink-0 animate-pulse w-24 sm:w-32 lg:w-36">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3.5 w-16 bg-slate-200 dark:bg-slate-800 rounded mt-3" />
                  </div>
                ))
              : [...categories, ...categories, ...categories].map((cat, index) => (
                  <div
                    key={`${cat.name}-${index}`}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="group flex flex-col items-center flex-shrink-0 cursor-pointer w-24 sm:w-32 lg:w-36 transition-all duration-300"
                  >
                    {/* Circular Image Container */}
                    <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border border-[#1E293B]/10 bg-white flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:border-[#3674B5] group-hover:ring-4 group-hover:ring-[#3674B5]/15 shadow-xs">
                      <img
                        src={cat.image || "/images/charger.png"}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-[#3674B5]/0 group-hover:bg-[#3674B5]/5 transition-colors duration-500" />
                    </div>

                    {/* Caption */}
                    <span className="text-[11px] sm:text-xs lg:text-sm font-black uppercase text-[#1E293B]/70 tracking-wider text-center mt-3.5 group-hover:text-[#3674B5] transition-colors duration-300 line-clamp-1 max-w-full">
                      {cat.name}
                    </span>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
