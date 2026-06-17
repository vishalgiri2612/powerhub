"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../app/context/CartContext";

export default function ShopSection() {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [productList, setProductList] = useState([]);

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
      .catch((e) => console.error("Failed to fetch products for shop section", e));
  }, []);

  // Display exactly 8 products that are featured on the home page shop catalog
  const shopProducts = Array.isArray(productList) ? productList.filter((p) => p.featured).slice(0, 8) : [];

  return (
    <section id="homepage-shop" className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-bg-brand">
      {/* Decorative subtle background ambient glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-[#E5D0C6] opacity-35 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-[#E8EFE5] opacity-25 blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#1E293B]/10 pb-4 md:pb-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
              <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                Our Catalog
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#1E293B] tracking-tight leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3674B5] to-[#578FCA]">Shop</span>
            </h2>
          </div>
        </div>

        {/* Products Grid: 2 columns on mobile, 4 columns on desktop (forms 2 rows of 4 items) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {shopProducts.map((product) => {
            const isWishlisted = wishlist.some((item) => item.id === product.id);
            const specItems = product.shortSpec.split(" · ");

            // Ambient hover glow
            const glowColor =
              product.id === "p1" ? "rgba(140, 153, 133, 0.15)" :
              product.id === "p2" ? "rgba(222, 200, 158, 0.25)" :
              "rgba(195, 146, 129, 0.15)";

            // Swatch color
            const swatchColor =
              product.color.includes("Sage") ? "#8C9985" :
              product.color.includes("Sand") || product.color.includes("Gold") ? "#DEC89E" :
              product.color.includes("Clay") ? "#C39281" :
              product.color.includes("Cream") ? "#EDECE6" : "#1A1917";

            return (
              <div
                key={product.id}
                className="group relative rounded-[1.5rem] sm:rounded-[2.5rem] bg-white border border-[#1E293B]/10 p-3 sm:p-6 flex flex-col justify-between hover-lift transition-all duration-500 overflow-hidden cursor-pointer"
                style={{
                  boxShadow: "0 10px 30px -15px rgba(26, 25, 23, 0.03)"
                }}
                onClick={() => router.push(`/product/${product.id}`)}
              >
                {/* Hover Glow */}
                <div
                  className="absolute -top-20 -left-20 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`
                  }}
                />

                <div>
                  {/* Card Header: Badges & Wishlist */}
                  <div className="flex items-center justify-between z-10 relative">
                    <span className="text-[8px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-md bg-white/80 border border-[#1E293B]/10 text-[#1E293B] tracking-wider flex items-center gap-1 sm:gap-1.5 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
                      {product.discountBadge || "BESTSELLER"}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`p-1.5 sm:p-2.5 rounded-full border backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 shadow-xs ${
                        isWishlisted
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

                  {/* Image */}
                  <div className="relative aspect-square w-full rounded-[1.2rem] sm:rounded-[2rem] bg-[#FFFFFF] overflow-hidden mt-2 mb-2 sm:mt-4 sm:mb-4 transition-colors duration-500 group-hover:bg-[#F8F9FA] flex items-center justify-center p-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-106 group-hover:rotate-1"
                      style={{
                        filter: "drop-shadow(0 12px 20px rgba(26,25,23,0.06))"
                      }}
                    />
                  </div>

                  {/* Specs & Name */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between text-[8px] sm:text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider">
                      <span>{product.category}</span>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full border border-[#1E293B]/15 shadow-xs"
                          style={{ backgroundColor: swatchColor }}
                        />
                        <span className="text-[8px] sm:text-[9px] font-semibold text-[#1E293B]/50 lowercase first-letter:uppercase">{product.color}</span>
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xs sm:text-lg text-[#1E293B] tracking-tight line-clamp-1 group-hover:text-[#3674B5] transition-colors duration-300">
                      {product.name}
                    </h3>

                    <div className="flex flex-wrap gap-1">
                      {specItems.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[8px] sm:text-[10px] font-semibold text-[#1E293B]/60 bg-[#F8F9FA] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border border-[#1E293B]/2"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Buy Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 sm:pt-4 border-t border-[#1E293B]/10 mt-2 sm:mt-4 gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[8px] sm:text-[9px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                      Save ₹{(product.originalPrice - product.price).toLocaleString()}
                    </span>
                    <div className="flex items-baseline gap-1.5">
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
                    className="w-full sm:w-auto px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-[10px] sm:text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-97 flex items-center justify-center gap-1 sm:gap-1.5 shadow-md"
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

        {/* Explore All Products Button */}
        <div className="flex justify-center pt-4 sm:pt-8">
          <button
            onClick={() => router.push("/shop")}
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-black hover:bg-slate-900 text-white rounded-full text-xs font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-[1.05] active:scale-95 hover:shadow-lg hover:shadow-black/10"
          >
            <span>Explore All Products</span>
            <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </button>
        </div>

      </div>
    </section>
  );
}
