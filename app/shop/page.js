"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../context/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchModal from "../../components/SearchModal";
import CartDrawer from "../../components/CartDrawer";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [productList, setProductList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  // Load custom products from MongoDB APIs
  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("API response was not ok");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProductList(data);
        } else {
          console.error("Expected array for products but got:", data);
        }
      })
      .catch((e) => console.error("Failed to fetch products for shop", e));

    fetch("/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("API response was not ok");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCategoriesList(data);
        } else {
          console.error("Expected array for categories but got:", data);
        }
      })
      .catch((e) => console.error("Failed to fetch categories for shop", e));
  }, []);

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

  const filteredProducts = !Array.isArray(productList)
    ? []
    : activeCategory === "All"
    ? productList
    : productList.filter((p) => p.category === activeCategory);

  const filterOptions = ["All", ...(Array.isArray(categoriesList) ? categoriesList.map((c) => c.name) : [])];

  return (
    <div className="min-h-screen bg-bg-brand text-text-brand antialiased selection:bg-[#3674B5] selection:text-white">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pt-6 md:pt-12 pb-16 md:pb-24 relative z-10 space-y-6 md:space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-2 md:space-y-4 max-w-2xl mx-auto border-b border-[#1E293B]/10 pb-4 md:pb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3.5 md:py-1 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
              Browse Ravtron
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-5xl lg:text-6xl text-[#1E293B] tracking-tight leading-tight">
            Ravtron <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3674B5] to-[#578FCA]">Shop</span>
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
              className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[11px] md:text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-97 border flex-shrink-0 ${
                activeCategory === opt
                  ? "bg-[#3674B5] text-white border-[#3674B5] shadow-md shadow-[#3674B5]/15"
                  : "bg-white text-[#1E293B]/60 border-[#1E293B]/10 hover:text-[#1E293B] hover:border-[#1E293B]/20"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Products Grid (2 columns on mobile, 4 columns on desktop) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.some((item) => item.id === product.id);
              const specItems = product.shortSpec.split(" · ");

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
                  className="group relative rounded-2xl md:rounded-[2.5rem] bg-white border border-[#1E293B]/10 p-3 md:p-6 flex flex-col justify-between hover-lift transition-all duration-500 overflow-hidden cursor-pointer shadow-2xs"
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
                      <span className="text-[8px] md:text-[10px] font-extrabold uppercase px-2 py-0.5 md:px-3 md:py-1 rounded-full backdrop-blur-md bg-white/80 border border-[#1E293B]/10 text-[#1E293B] tracking-wider flex items-center gap-1.5 shadow-xs">
                        <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
                        {product.discountBadge}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`p-2 md:p-2.5 rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 shadow-xs ${
                          isWishlisted
                            ? "bg-[#3674B5]/15 border-[#3674B5]/40 text-[#3674B5]"
                            : "bg-white/80 border-[#1E293B]/10 text-[#1E293B]/40 hover:text-[#1E293B] hover:bg-white"
                        }`}
                        aria-label="Add to Wishlist"
                      >
                        <svg
                          className="w-3.5 h-3.5 md:w-4.5 md:h-4.5"
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
                    <div className="relative aspect-square w-full rounded-xl md:rounded-[2rem] bg-[#FFFFFF] overflow-hidden mt-2 md:mt-3 mb-2 md:mb-3 transition-colors duration-500 group-hover:bg-[#F8F9FA] flex items-center justify-center p-3 md:p-5">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1917]/0 to-[#1A1917]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-106 group-hover:rotate-1"
                        style={{
                          filter: "drop-shadow(0 12px 20px rgba(26,25,23,0.06))"
                        }}
                      />
                    </div>

                    {/* Meta info block */}
                    <div className="space-y-1.5 md:space-y-2">
                      <div className="flex items-center justify-between text-[8px] md:text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-widest">
                        <span>{product.category}</span>
                        <span className="flex items-center gap-1 md:gap-1.5">
                          <span
                            className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border border-[#1E293B]/15 shadow-xs"
                            style={{ backgroundColor: swatchColor }}
                            title={product.color}
                          />
                          <span className="text-[8px] md:text-[9px] font-semibold tracking-normal text-[#1E293B]/50 lowercase first-letter:uppercase">{product.color}</span>
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-xs md:text-lg text-[#1E293B] tracking-tight line-clamp-1 group-hover:text-[#3674B5] transition-colors duration-300">
                        {product.name}
                      </h3>

                      {/* Hidden on mobile to fit 2-column grid cleanly */}
                      <div className="hidden sm:flex flex-wrap gap-1.5">
                        {specItems.map((spec, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold text-[#1E293B]/60 bg-[#F8F9FA] px-2.5 py-1 rounded-lg border border-[#1E293B]/2"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 md:gap-2">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 ${
                                  i < Math.floor(product.rating) ? "fill-current" : "stroke-current fill-none"
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
                        <span className="text-[10px] md:text-xs font-bold text-[#1E293B]">{product.rating}</span>
                        <span className="text-[9px] md:text-[10px] text-[#1E293B]/40 font-medium">({product.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-[#1E293B]/10 mt-2 md:mt-4 relative z-10">
                    <div className="space-y-0.5">
                      <span className="text-[8px] md:text-[9px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                        Save ₹{(product.originalPrice - product.price).toLocaleString()}
                      </span>
                      <div className="flex items-baseline gap-1 md:gap-1.5">
                        <span className="text-sm md:text-xl font-black text-[#3674B5]">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] md:text-xs text-[#1E293B]/30 line-through font-medium">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-[10px] md:text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-97 flex items-center gap-1 shadow-md shadow-[#1A1917]/5"
                    >
                      <span>Add</span>
                      <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    <Suspense fallback={<div className="min-h-screen bg-bg-brand flex items-center justify-center text-sm font-bold text-[#1E293B]/40 uppercase tracking-widest">Loading Ravtron Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
