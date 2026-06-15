"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { categories } from "../app/data/products";

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
          setCategoriesList(data.filter((c) => c.showOnHome !== false));
        } else {
          setCategoriesList(categories.filter((c) => c.showOnHome !== false));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch categories list dynamically for home", err);
        setCategoriesList(categories.filter((c) => c.showOnHome !== false));
      });
  }, []);

  const handleCategoryClick = (categoryName) => {
    router.push(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section id="categories" className="pt-4 pb-4 md:py-16 px-4 sm:px-6 lg:px-8 bg-bg-brand relative overflow-hidden">
      {/* Decorative background gradients */}
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
            Tailored hardware designed specifically to match your creative ecosystem and lifestyle.
          </p>
        </div>

        {/* Categories Grid (Horizontal Scroll on Mobile, Grid on Desktop) */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-none">
          {categoriesList.map((category) => {
            const theme = themeMap[category.name] || {
              bg: "bg-[#3674B5]/5",
              border: "border-[#1E293B]/15",
              glow: "rgba(26, 25, 23, 0.05)",
              image: "/images/charger.png"
            };

            const categoryImage = category.image || theme.image;

            return (
              <div
                key={category.name}
                className="group relative rounded-[2rem] bg-white border border-[#1E293B]/10 overflow-hidden flex flex-col justify-between hover-lift transition-all duration-500 cursor-pointer h-full flex-shrink-0 w-[280px] sm:w-[320px] md:w-auto snap-center"
                style={{
                  boxShadow: "0 10px 30px -15px rgba(26, 25, 23, 0.03)"
                }}
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
                    src={categoryImage} 
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
                    <h3 className="font-display font-black text-xl text-[#1E293B] group-hover:text-[#3674B5] transition-colors duration-300">
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

                  {/* Bottom Explore CTA */}
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-extrabold text-[#3674B5] uppercase tracking-wider">
                    <span>Explore Category</span>
                    <span className="transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
