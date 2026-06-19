"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../app/context/CartContext";

export default function Bestsellers({ productList = [], loading = false }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useCart();

  // Filter to show only top selling products
  let bestsellerProducts = Array.isArray(productList) ? productList.filter((p) => p.topSelling) : [];

  // Fallback: If no products have topSelling flagged, show the first 4 products
  if (bestsellerProducts.length === 0 && Array.isArray(productList) && productList.length > 0) {
    bestsellerProducts = productList.slice(0, 4);
  }

  return (
    <section id="store" className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-bg-brand">
      {/* Decorative subtle background ambient glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-[#E5D0C6] opacity-35 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-[#E8EFE5] opacity-25 blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 relative z-10">

        {/* Section Header with Premium Styling */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1E293B]/10 pb-4 md:pb-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
              <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                Ravtron Shop
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#1E293B] tracking-tight leading-tight">
              Top Selling <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3674B5] to-[#578FCA]">Products</span>
            </h2>
          </div>
          <p className="text-sm font-semibold text-[#1E293B]/50 max-w-sm leading-relaxed">
            Explore our complete ecosystem of premium, high-performance electronics and workspace accessories.
          </p>
        </div>

        {/* Products Marquee Container with dynamic side fading mask */}
        {loading ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#3674B5] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse font-sans">Loading Bestsellers...</p>
          </div>
        ) : bestsellerProducts.length > 0 ? (
          <div
            className="relative w-full overflow-hidden py-4 -my-4"
            style={{
              maskImage: "linear-gradient(to right, transparent, #fff 4%, #fff 96%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, #fff 4%, #fff 96%, transparent)"
            }}
          >
            <div className="animate-marquee-triple flex gap-3 sm:gap-8">
              {[...bestsellerProducts, ...bestsellerProducts, ...bestsellerProducts].map((product, idx) => {
              const isWishlisted = wishlist.some((item) => item.id === product.id);
              const specItems = product.shortSpec.split(" · ");

              // Determine ambient glow color based on product ID/theme
              const glowColor =
                product.id === "p1" ? "rgba(140, 153, 133, 0.15)" :
                  product.id === "p2" ? "rgba(222, 200, 158, 0.25)" :
                    "rgba(195, 146, 129, 0.15)";

              // Determine swatch color
              const swatchColor =
                product.color.includes("Sage") ? "#8C9985" :
                  product.color.includes("Sand") || product.color.includes("Gold") ? "#DEC89E" :
                    product.color.includes("Clay") ? "#C39281" :
                      product.color.includes("Cream") ? "#EDECE6" : "#1A1917";

              return (
                <div
                  key={`${product.id}-${idx}`}
                  className="group relative w-[160px] sm:w-[340px] lg:w-[384px] flex-shrink-0 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white border border-[#1E293B]/10 p-3 sm:p-5 flex flex-col justify-between hover-lift transition-all duration-500 overflow-hidden cursor-pointer"
                  style={{
                    boxShadow: "0 10px 30px -15px rgba(26, 25, 23, 0.03)"
                  }}
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  {/* Floating Ambient Hover Glow */}
                  <div
                    className="absolute -top-20 -left-20 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`
                    }}
                  />

                  <div>
                    {/* Product Card Top: Badges & Wishlist */}
                    <div className="flex items-center justify-between z-10 relative">
                      <span className="text-[8px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-md bg-white/80 border border-[#1E293B]/10 text-[#1E293B] tracking-wider flex items-center gap-1.5 shadow-xs">
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
                        {product.discountBadge}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`p-1.5 sm:p-2.5 rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 shadow-xs ${isWishlisted
                          ? "bg-[#3674B5]/15 border-[#3674B5]/40 text-[#3674B5]"
                          : "bg-white/80 border-[#1E293B]/10 text-[#1E293B]/40 hover:text-[#1E293B] hover:bg-white"
                          }`}
                        aria-label="Add to Wishlist"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5"
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

                    {/* Product Image Frame */}
                    <div className="relative aspect-square w-full rounded-[1.2rem] sm:rounded-[2rem] bg-[#FFFFFF] overflow-hidden mt-2 mb-2 sm:mt-3 sm:mb-3 transition-colors duration-500 group-hover:bg-[#F8F9FA] flex items-center justify-center p-3 sm:p-5">
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

                    {/* Info Container */}
                    <div className="space-y-1.5 sm:space-y-2">
                      {/* Category & Color Indicator Row */}
                      <div className="flex items-center justify-between text-[8px] sm:text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider sm:tracking-widest">
                        <span>{product.category}</span>
                        <span className="flex items-center gap-1 sm:gap-1.5">
                          <span
                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-[#1E293B]/15 shadow-xs"
                            style={{ backgroundColor: swatchColor }}
                            title={product.color}
                          />
                          <span className="text-[8px] sm:text-[9px] font-semibold tracking-normal text-[#1E293B]/50 lowercase first-letter:uppercase">{product.color}</span>
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="font-display font-bold text-xs sm:text-lg text-[#1E293B] tracking-tight line-clamp-1 group-hover:text-[#3674B5] transition-colors duration-300">
                        {product.name}
                      </h3>

                      {/* Specifications Grid Tags */}
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {specItems.map((spec, i) => (
                          <span
                            key={i}
                            className="text-[8px] sm:text-[10px] font-semibold text-[#1E293B]/60 bg-[#F8F9FA] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border border-[#1E293B]/2 line-clamp-2"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                      {/* Star Rating & Reviews */}
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${i < Math.floor(product.rating) ? "fill-current" : "stroke-current fill-none"
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
                        <span className="text-[10px] sm:text-xs font-bold text-[#1E293B]">{product.rating}</span>
                        <span className="text-[8px] sm:text-[10px] text-[#1E293B]/40 font-medium line-clamp-1">({product.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Button row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 sm:pt-3 border-t border-[#1E293B]/10 mt-2 sm:mt-4 relative z-10 gap-2 sm:gap-0">
                    <div className="space-y-0.5">
                      <span className="text-[8px] sm:text-[9px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                        Save ₹{(product.originalPrice - product.price).toLocaleString()}
                      </span>
                      <div className="flex items-baseline gap-1 sm:gap-1.5">
                        <span className="text-sm sm:text-xl font-black text-[#3674B5]">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] sm:text-xs text-[#1E293B]/30 line-through font-medium">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-full sm:w-auto px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-[10px] sm:text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-97 flex items-center justify-center gap-1 sm:gap-1.5 shadow-md shadow-[#1A1917]/5"
                    >
                      <span>Add</span>
                      <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                </div>
              );
            })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-[#1E293B]/10 rounded-3xl bg-white/50">
            <p className="text-xs font-bold text-[#1E293B]/40 uppercase tracking-wider">No products available</p>
          </div>
        )}

      </div>
    </section>
  );
}

