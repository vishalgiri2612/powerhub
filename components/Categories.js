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

  const getCategoryDetails = (catName, defaultImg) => {
    const dbCat = categoriesList.find((c) => c.name === catName);
    return {
      name: catName,
      image: dbCat?.image || defaultImg
    };
  };

  const cables = getCategoryDetails("Cables", "/images/cable.png");
  const hdmi = getCategoryDetails("HDMI Cables", "/images/cable.png");
  const vga = getCategoryDetails("VGA Cables", "/images/cable.png");
  const power = getCategoryDetails("Power Cords", "/images/charger.png");
  const converters = getCategoryDetails("Converters", "/images/charger.png");

  return (
    <section id="categories" className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 bg-bg-brand relative overflow-hidden">
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
            Premium connectivity solutions and hardware collections tailored for your workspace.
          </p>
        </div>

        {/* Premium Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Card 1: Cables (Large Left Card, spans 6 cols on desktop) */}
          <div
            onClick={() => handleCategoryClick(cables.name)}
            className="group relative rounded-[2rem] bg-white border border-[#1E293B]/10 overflow-hidden cursor-pointer md:col-span-6 md:row-span-2 h-[280px] sm:h-[380px] md:h-[464px] shadow-xs flex items-center justify-center hover-lift transition-all duration-500"
          >
            <img
              src={cables.image}
              alt={cables.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
            <span className="bg-black/80 backdrop-blur-xs text-white text-[10px] sm:text-xs font-black uppercase px-4 py-2 rounded-lg absolute bottom-4 left-4 sm:bottom-6 sm:left-6 tracking-wider z-10">
              {cables.name}
            </span>
          </div>

          {/* Card 2: HDMI Cables (Small, spans 3 cols on desktop) */}
          <div
            onClick={() => handleCategoryClick(hdmi.name)}
            className="group relative rounded-[2rem] bg-white border border-[#1E293B]/10 overflow-hidden cursor-pointer md:col-span-3 h-[180px] md:h-[220px] shadow-xs flex items-center justify-center hover-lift transition-all duration-500"
          >
            <img
              src={hdmi.image}
              alt={hdmi.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
            <span className="bg-black/80 backdrop-blur-xs text-white text-[10px] sm:text-xs font-black uppercase px-4 py-2 rounded-lg absolute bottom-4 left-4 sm:bottom-6 sm:left-6 tracking-wider z-10">
              {hdmi.name}
            </span>
          </div>

          {/* Card 3: VGA Cables (Small, spans 3 cols on desktop) */}
          <div
            onClick={() => handleCategoryClick(vga.name)}
            className="group relative rounded-[2rem] bg-white border border-[#1E293B]/10 overflow-hidden cursor-pointer md:col-span-3 h-[180px] md:h-[220px] shadow-xs flex items-center justify-center hover-lift transition-all duration-500"
          >
            <img
              src={vga.image}
              alt={vga.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
            <span className="bg-black/80 backdrop-blur-xs text-white text-[10px] sm:text-xs font-black uppercase px-4 py-2 rounded-lg absolute bottom-4 left-4 sm:bottom-6 sm:left-6 tracking-wider z-10">
              {vga.name}
            </span>
          </div>

          {/* Card 4: Power Cords (Small, spans 3 cols on desktop) */}
          <div
            onClick={() => handleCategoryClick(power.name)}
            className="group relative rounded-[2rem] bg-white border border-[#1E293B]/10 overflow-hidden cursor-pointer md:col-span-3 h-[180px] md:h-[220px] shadow-xs flex items-center justify-center hover-lift transition-all duration-500"
          >
            <img
              src={power.image}
              alt={power.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
            <span className="bg-black/80 backdrop-blur-xs text-white text-[10px] sm:text-xs font-black uppercase px-4 py-2 rounded-lg absolute bottom-4 left-4 sm:bottom-6 sm:left-6 tracking-wider z-10">
              {power.name}
            </span>
          </div>

          {/* Card 5: Converters (Small, spans 3 cols on desktop) */}
          <div
            onClick={() => handleCategoryClick(converters.name)}
            className="group relative rounded-[2rem] bg-white border border-[#1E293B]/10 overflow-hidden cursor-pointer md:col-span-3 h-[180px] md:h-[220px] shadow-xs flex items-center justify-center hover-lift transition-all duration-500"
          >
            <img
              src={converters.image}
              alt={converters.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
            <span className="bg-black/80 backdrop-blur-xs text-white text-[10px] sm:text-xs font-black uppercase px-4 py-2 rounded-lg absolute bottom-4 left-4 sm:bottom-6 sm:left-6 tracking-wider z-10">
              {converters.name}
            </span>
          </div>
        </div>

        {/* Other Active Categories Row (Horizontal scroll below the grid for Accessories, Docking Stations etc.) */}
        {categoriesList.filter(c => !["Cables", "HDMI Cables", "VGA Cables", "Power Cords", "Converters"].includes(c.name)).length > 0 && (
          <div className="space-y-4 pt-6 text-left">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#1E293B]/40">More Categories</h3>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x -mx-4 px-4 md:mx-0 md:px-0">
              {categoriesList
                .filter(c => !["Cables", "HDMI Cables", "VGA Cables", "Power Cords", "Converters"].includes(c.name))
                .map((cat) => (
                  <div
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="group relative rounded-2xl bg-white border border-[#1E293B]/10 p-4 flex items-center gap-3 hover-lift cursor-pointer min-w-[200px] snap-center shadow-3xs hover:border-[#3674B5]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden p-1">
                      <img src={cat.image || "/images/charger.png"} alt={cat.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-[#3674B5] transition-colors">{cat.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{cat.subcategories?.length || 0} types</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
