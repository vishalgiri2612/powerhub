"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../context/CartContext";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import Footer from "../../components/Footer";
import SearchModal from "../../components/SearchModal";
import CartDrawer from "../../components/CartDrawer";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search") || searchParams.get("q") || searchParams.get("tag") || searchParams.get("sub");

  const {
    addToCart,
    toggleWishlist,
    wishlist,
    products: productList,
    productsLoading,
    categories: categoriesList,
    categoriesLoading,
  } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const loading = productsLoading || categoriesLoading;

  // Sync category state with query parameter
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory("All");
    }
  }, [categoryParam]);

  const handleFilterClick = (categoryName) => {
    if (categoryName === "All") {
      router.push("/shop");
    } else {
      router.push(`/shop?category=${encodeURIComponent(categoryName)}`);
    }
  };

  const handleClearSearch = () => {
    if (categoryParam) {
      router.push(`/shop?category=${encodeURIComponent(categoryParam)}`);
    } else {
      router.push("/shop");
    }
  };

  const filteredProducts = !Array.isArray(productList)
    ? []
    : productList.filter((p) => {
        const matchesCategory = activeCategory === "All" || p.category.toLowerCase() === activeCategory.toLowerCase();
        
        if (!searchParam) return matchesCategory;

        const term = searchParam.toLowerCase().trim();
        const fullText = `${p.name} ${p.category} ${p.subcategory || ""} ${p.shortSpec || ""} ${p.description || ""} ${p.color || ""}`.toLowerCase();

        // 1. Direct exact substring match
        if (fullText.includes(term)) return matchesCategory;

        // 2. Tokenized & plural-insensitive match (e.g., "HDMI Cables" -> "hdmi", "cable")
        const tokens = term
          .split(/[\s,·\-\/]+/)
          .map((w) => w.trim().replace(/s$/, "")) // stem trailing 's'
          .filter((w) => w.length > 1);

        const matchesTokens = tokens.length > 0 && tokens.every((tok) => fullText.includes(tok));

        return matchesCategory && matchesTokens;
      });

  const filterOptions = ["All", ...(Array.isArray(categoriesList) ? categoriesList.map((c) => c.name) : [])];

  return (
    <div className="min-h-screen bg-bg-brand text-text-brand antialiased selection:bg-[#3674B5] selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-12 pb-16 md:pb-24 relative z-10 space-y-6 md:space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-2 md:space-y-4 max-w-2xl mx-auto border-b border-[#1E293B]/10 pb-4 md:pb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3.5 md:py-1 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
              Browse RAVTRON
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-5xl lg:text-6xl text-[#1E293B] tracking-tight leading-tight">
            RAVTRON <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3674B5] to-[#578FCA]">Shop</span>
          </h1>
          <p className="text-xs md:text-sm font-semibold text-[#1E293B]/50 leading-relaxed max-w-md mx-auto">
            Our complete catalog of professional GaN power delivery adapters, display cabling, and workstation gear.
          </p>
        </div>

        {/* Filter Pills (Horizontal Scroll on Mobile, Flex Wrap on Desktop) */}
        <div className="flex overflow-x-auto justify-start md:justify-center gap-2 md:gap-3 py-2.5 border-y border-[#1E293B]/5 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => handleFilterClick(opt)}
              className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[11px] md:text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-97 border flex-shrink-0 ${activeCategory === opt
                  ? "bg-[#3674B5] text-white border-[#3674B5] shadow-md shadow-[#3674B5]/15"
                  : "bg-white text-[#1E293B]/60 border-[#1E293B]/10 hover:text-[#1E293B] hover:border-[#1E293B]/20"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Active Subcategory / Search Filter Indicator Banner */}
        {searchParam && (
          <div className="flex items-center justify-between bg-[#3674B5]/8 border border-[#3674B5]/20 rounded-2xl px-5 py-3 text-xs font-bold text-[#1E293B] max-w-xl mx-auto shadow-2xs">
            <span>
              Showing results for <span className="text-[#3674B5] font-extrabold">&ldquo;{searchParam}&rdquo;</span>
              {activeCategory !== "All" && <span> in <span className="text-[#1E293B] font-extrabold">{activeCategory}</span></span>}
            </span>
            <button
              onClick={handleClearSearch}
              className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider hover:underline bg-white px-2.5 py-1 rounded-lg border border-[#3674B5]/20 shadow-2xs transition-all hover:scale-105"
            >
              Clear Filter ✕
            </button>
          </div>
        )}

        {/* Products Grid (2 columns on mobile, 4 columns on desktop) */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl sm:rounded-3xl bg-white border border-[#1E293B]/10 p-2.5 sm:p-4.5 flex flex-col justify-between overflow-hidden shadow-2xs w-full max-w-[300px] mx-auto h-[320px] xs:h-[360px] sm:h-[420px] md:h-[450px] animate-pulse animate-duration-1000"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-4.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
                    <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800" />
                  </div>
                  <div className="aspect-square w-full rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 mt-2 mb-2 sm:mt-2.5 sm:mb-2.5" />
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-6 bg-slate-100 dark:bg-slate-800 rounded-full" />
                    </div>
                    <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="hidden sm:flex gap-1">
                      <div className="h-3.5 w-12 bg-slate-50 dark:bg-slate-800 rounded" />
                      <div className="h-3.5 w-16 bg-slate-50 dark:bg-slate-800 rounded" />
                    </div>
                    <div className="h-3 w-1/4 bg-slate-100 dark:bg-slate-800 rounded" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                  <div className="space-y-1">
                    <div className="h-2.5 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
                  </div>
                  <div className="h-7 w-12 sm:h-9 sm:w-16 rounded-xl bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.some((item) => item.id === product.id);
              const specItems = product.shortSpec.split(" · ").filter(spec => spec.length < 25 && spec.trim().length > 0);

              const glowColor =
                product.id === "p1" ? "rgba(140, 153, 133, 0.15)" :
                  product.id === "p2" ? "rgba(222, 200, 158, 0.25)" :
                    "rgba(195, 146, 129, 0.15)";

              const swatchColor =
                product.color.includes("Sage") ? "#8C9985" :
                  product.color.includes("Sand") || product.color.includes("Gold") ? "#DEC89E" :
                    product.color.includes("Clay") ? "#C39281" :
                      product.color.includes("Cream") ? "#EDECE6" : "#1A1917";

              return (
                <div
                  key={product.id}
                  className="group relative rounded-xl sm:rounded-3xl bg-white border border-[#1E293B]/10 p-2.5 sm:p-4.5 flex flex-col justify-between hover-lift transition-all duration-500 overflow-hidden cursor-pointer shadow-2xs w-full max-w-[300px] mx-auto"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  {/* Hover ambient light */}
                  <div
                    className="absolute -top-20 -left-20 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`
                    }}
                  />

                  <div>
                    {/* Top Row: Badges & Wishlist */}
                    <div className="flex items-center justify-between z-10 relative">
                      {Boolean(product.discountBadge && product.discountBadge.trim()) ? (
                        <span className="text-[8px] sm:text-[9px] font-extrabold uppercase px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full backdrop-blur-md bg-white/80 border border-[#1E293B]/10 text-[#1E293B] tracking-wider shadow-xs">
                          {product.discountBadge}
                        </span>
                      ) : <div />}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`p-1.5 sm:p-2 rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 shadow-xs ${isWishlisted
                            ? "bg-[#3674B5]/15 border-[#3674B5]/40 text-[#3674B5]"
                            : "bg-white/80 border-[#1E293B]/10 text-[#1E293B]/40 hover:text-[#1E293B] hover:bg-white"
                          }`}
                        aria-label="Add to Wishlist"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill={isWishlisted ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Image Area */}
                    <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl bg-[#FFFFFF] overflow-hidden mt-2 mb-2 sm:mt-2.5 sm:mb-2.5 transition-colors duration-500 group-hover:bg-[#F8F9FA] flex items-center justify-center hover-lift-inner">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1917]/0 to-[#1A1917]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 150px, (max-width: 768px) 250px, 300px"
                        className="object-cover transition-all duration-500 group-hover:scale-106 group-hover:rotate-1 pointer-events-none"
                        style={{
                          filter: "drop-shadow(0 12px 20px rgba(26,25,23,0.06))"
                        }}
                      />
                    </div>

                    {/* Meta info block */}
                    <div className="space-y-1 sm:space-y-1.5">
                      <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-bold text-[#1E293B]/40 uppercase tracking-wider">
                        <span>{product.category}</span>
                        {product.color && product.color.toLowerCase() !== "standard" && (
                          <span className="flex items-center gap-1 sm:gap-1.5">
                            <span
                              className="w-2 h-2 sm:w-2 sm:h-2 rounded-full border border-[#1E293B]/15 shadow-xs"
                              style={{ backgroundColor: swatchColor }}
                              title={product.color}
                            />
                            <span className="text-[8px] sm:text-[9px] font-semibold tracking-normal text-[#1E293B]/50 lowercase first-letter:uppercase">{product.color}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-[11px] sm:text-sm md:text-base text-[#1E293B] tracking-tight line-clamp-1 group-hover:text-[#3674B5] transition-colors duration-300">
                        {product.name}
                      </h3>

                      {/* Hidden on mobile to fit 2-column grid cleanly */}
                      <div className="hidden sm:flex flex-wrap gap-1">
                        {specItems.map((spec, i) => (
                          <span
                            key={i}
                            className="text-[8px] sm:text-[9px] font-semibold text-[#1E293B]/60 bg-[#F8F9FA] px-1.5 py-0.5 rounded-md border border-[#1E293B]/2 line-clamp-2"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < Math.floor(product.rating) ? "fill-current" : "stroke-current fill-none"
                                }`}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.178 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.77-.57-.37-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.518-4.674z"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[9px] sm:text-xs font-bold text-[#1E293B]">{product.rating}</span>
                        <span className="text-[8px] sm:text-[9px] text-[#1E293B]/40 font-medium">({product.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/10 mt-2 relative z-10">
                    <div className="space-y-0.5">
                      <span className="text-[8px] sm:text-[9px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                        Save ₹{(product.originalPrice - product.price).toLocaleString()}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs sm:text-sm md:text-base font-black text-[#3674B5]">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-[#1E293B]/30 line-through font-medium">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-[9px] sm:text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-97 flex items-center justify-center gap-1 shadow-md shadow-[#1A1917]/5"
                    >
                      <span>Add</span>
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 space-y-4">
            <h2 className="font-display font-black text-2xl text-[#1E293B]">No products found</h2>
            <p className="text-sm font-semibold text-[#1E293B]/40">We currently don't have items in this category.</p>
          </div>
        )}
      </main>

      <Footer />
      <SearchModal />
      <CartDrawer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-brand flex items-center justify-center text-sm font-bold text-[#1E293B]/40 uppercase tracking-widest">Loading RAVTRON Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
