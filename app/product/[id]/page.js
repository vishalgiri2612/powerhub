"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { products } from "../../data/products";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const getDescription = (id) => {
  switch (id) {
    case "p1":
      return "Equipped with advanced Gallium Nitride (GaN) technology, this ultra-compact wall adapter delivers efficient power for up to three devices simultaneously. Smart power allocation ensures optimal wattage for your laptop, smartphone, and tablet while protecting against overheating and overvoltage.";
    case "p2":
      return "Power up on the move with confidence. This massive 20,000 mAh high-density portable charger supplies up to 65W power, capable of recharging laptops and phones at maximum speeds. The integrated real-time OLED screen keeps you updated on the precise remaining battery life.";
    case "p3":
      return "Engineered for durability and high-speed energy transfer. This heavy-duty nylon braided cable features an integrated digital live-wattage display that displays exact charging rates in real time. Supports Power Delivery up to 100W for quick-charging laptops and mobile devices.";
    case "p4":
      return "Elevate your professional workspace with stunning video clarity. This 4K ultra-high-definition webcam delivers crystal clear imagery, featuring an integrated LED ring light with adjustable touch-brightness controls to ensure optimal lighting in any environment.";
    case "p5":
      return "Immerse yourself in rich, high-fidelity acoustics. These wireless earbuds feature premium active noise cancellation up to 40dB, crystal-clear microphones for calls, and a sleek sand-gold charging case providing up to 40 hours of combined, uninterrupted playtime.";
    case "p6":
      return "A sophisticated multi-device charger for your modern nightstand or desk. Crafted from sustainable premium beechwood and solid aluminum, this stand magnetically mounts and charges your iPhone, Apple Watch, and AirPods simultaneously at maximum Qi wireless charging speeds.";
    default:
      return "A premium hardware accessory crafted with extreme precision and premium materials to match your modern workstation setup. Engineered with durability and visual aesthetics in mind.";
  }
};

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { 
    addToCart, 
    setIsCartOpen,
    wishlist,
    toggleWishlist
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch product detail
  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(product?.image || "");

  useEffect(() => {
    setQuantity(1);
    setActiveTab("overview");
    if (product) {
      setSelectedImage(product.image);
    }
    window.scrollTo(0, 0);
  }, [id, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-bg-brand text-text-brand antialiased">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-36 text-center space-y-4">
          <h2 className="font-display font-black text-3xl text-[#1A1917]">Product Not Found</h2>
          <p className="text-sm font-semibold text-[#1A1917]/50">The accessory you are looking for does not exist or has been removed.</p>
          <button 
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl bg-[#1A1917] text-white text-xs font-bold uppercase tracking-wider"
          >
            Go Back Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const specItems = product.shortSpec.split(" · ");

  // Related products (filtered from same category or next items in the list)
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

  // Styling accents based on product ID/theme
  const isSage = product.id === "p1" || product.id === "p5";
  const isSand = product.id === "p2" || product.id === "p6";
  const brandAccent = isSage ? "#8C9985" : isSand ? "#DEC89E" : "#C39281";
  const brandBgLight = isSage ? "bg-[#8C9985]/10" : isSand ? "bg-[#DEC89E]/10" : "bg-[#C39281]/10";
  const brandBorder = isSage ? "border-[#8C9985]/20" : isSand ? "border-[#DEC89E]/20" : "border-[#C39281]/20";
  const brandText = isSage ? "text-[#8C9985]" : isSand ? "text-[#DEC89E]" : "text-[#C39281]";

  const handleAdd = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(true);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-bg-brand text-text-brand antialiased selection:bg-[#C39281] selection:text-white">
      {/* Dynamic Header Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 relative z-10">
        
        {/* Back navigation */}
        <div className="pb-8">
          <button 
            onClick={() => router.push("/")}
            className="group inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#1A1917]/50 hover:text-[#1A1917] transition-all bg-white border border-[#1A1917]/5 rounded-full px-5 py-2.5 hover-lift shadow-2xs"
          >
            <span className="group-hover:-translate-x-1.5 transition-transform duration-300">←</span>
            <span>Back to Store</span>
          </button>
        </div>

        {/* Two-Column Details Showcase */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
          
          {/* Left Column: Image Gallery Showcase (Full-frame cover layout) */}
          <div className="w-full lg:w-1/2 bg-white border border-[#1A1917]/5 rounded-[3rem] flex flex-col justify-between relative overflow-hidden shadow-sm min-h-[500px] sm:min-h-[580px]">
            
            {/* Top Aspect-Square Image Cover Container */}
            <div className="w-full aspect-square relative overflow-hidden bg-[#F8F9FA] group">
              {/* Ambient radial lighting glow */}
              <div 
                className="absolute -top-48 -left-48 w-[140%] h-[140%] rounded-full blur-3xl opacity-25 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${brandAccent} 0%, transparent 70%)`
                }}
              />

              {/* Float Wishlist Trigger */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-6 left-6 z-20 p-3.5 rounded-full border backdrop-blur-xs transition-all duration-300 hover:scale-110 active:scale-95 shadow-xs ${
                  isWishlisted
                    ? "bg-[#C39281]/15 border-[#C39281]/30 text-[#C39281]"
                    : "bg-white/80 border-[#1A1917]/5 text-[#1A1917]/40 hover:text-[#1A1917] hover:bg-white"
                }`}
                aria-label="Add to Wishlist"
              >
                <svg
                  className="w-5.5 h-5.5"
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

              {/* Dynamic Swatch badge floating at top-right */}
              <div className="absolute top-6 right-6 z-20 inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-white/85 backdrop-blur-sm border border-[#1A1917]/5 shadow-2xs">
                <span 
                  className="w-2.5 h-2.5 rounded-full border border-[#1A1917]/10"
                  style={{
                    backgroundColor: 
                      product.color.includes("Sage") ? "#8C9985" :
                      product.color.includes("Sand") || product.color.includes("Gold") ? "#DEC89E" :
                      product.color.includes("Clay") ? "#C39281" :
                      product.color.includes("Cream") ? "#EDECE6" : "#1A1917"
                  }}
                />
                <span className="text-[10px] font-extrabold text-[#1A1917]/70 uppercase tracking-widest">{product.color}</span>
              </div>

              {/* Full-Frame Edge-to-Edge Image */}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
              />
            </div>

            {/* Bottom Controls Area (Padded separately) */}
            <div className="p-8 flex flex-col items-center w-full bg-white">
              {/* Horizontal divider line */}
              <div className="w-full h-[1px] bg-[#1A1917]/5 mb-6" />

              {/* Thumbnails list */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="flex justify-center gap-4 w-full">
                  {product.gallery.map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`w-20 h-20 rounded-2xl border-2 overflow-hidden bg-[#F8F9FA] p-2 flex items-center justify-center transition-all duration-300 ${
                        selectedImage === imgUrl 
                          ? "border-[#C39281] scale-105 shadow-xs bg-white" 
                          : "border-transparent opacity-60 hover:opacity-100 hover:scale-102"
                      }`}
                    >
                      <img 
                        src={imgUrl} 
                        alt={`${product.name} view ${index + 1}`} 
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Context Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-8">
            <div className="space-y-8">
              
              {/* Category tags */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full ${brandBgLight} ${brandBorder} border ${brandText} tracking-widest`}>
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">⭐</span>
                  <span className="text-sm font-bold text-[#1A1917]">{product.rating}</span>
                  <span className="text-xs text-[#1A1917]/40">({product.reviewsCount} verified reviews)</span>
                </div>
              </div>

              {/* Title & short specs */}
              <div className="space-y-3">
                <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#1A1917] tracking-tight leading-[1.1]">
                  {product.name}
                </h1>
                <div className="flex flex-wrap gap-2 pt-2">
                  {specItems.map((spec, i) => (
                    <span key={i} className="text-[10px] font-extrabold text-[#1A1917]/50 bg-[#1A1917]/5 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tab Selector */}
              <div className="space-y-5">
                <div className="flex items-center border-b border-[#1A1917]/5 text-xs font-extrabold text-[#1A1917]/40 uppercase tracking-widest gap-8">
                  <button 
                    onClick={() => setActiveTab("overview")} 
                    className={`pb-2.5 transition-all relative ${activeTab === "overview" ? "text-[#1A1917] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#C39281]" : "hover:text-[#1A1917]"}`}
                  >
                    Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab("specs")} 
                    className={`pb-2.5 transition-all relative ${activeTab === "specs" ? "text-[#1A1917] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#C39281]" : "hover:text-[#1A1917]"}`}
                  >
                    Specifications
                  </button>
                  <button 
                    onClick={() => setActiveTab("shipping")} 
                    className={`pb-2.5 transition-all relative ${activeTab === "shipping" ? "text-[#1A1917] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#C39281]" : "hover:text-[#1A1917]"}`}
                  >
                    Shipping & Return
                  </button>
                </div>

                {/* Tab content view */}
                <div className="min-h-[120px] text-sm sm:text-base text-[#1A1917]/70 leading-relaxed font-semibold">
                  {activeTab === "overview" && (
                    <p className="animate-fade-in-up">{getDescription(product.id)}</p>
                  )}
                  {activeTab === "specs" && (
                    <div className="space-y-3.5 animate-fade-in-up">
                      <div className="flex justify-between border-b border-[#1A1917]/5 pb-2">
                        <span className="text-[#1A1917]/40 uppercase text-xs tracking-widest">Model Color</span>
                        <span className="text-[#1A1917]/85 font-extrabold">{product.color}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#1A1917]/5 pb-2">
                        <span className="text-[#1A1917]/40 uppercase text-xs tracking-widest">Material Finish</span>
                        <span className="text-[#1A1917]/85 font-extrabold">Ultra-premium matte finish</span>
                      </div>
                      <div className="flex justify-between border-b border-[#1A1917]/5 pb-2">
                        <span className="text-[#1A1917]/40 uppercase text-xs tracking-widest">Warranty Protection</span>
                        <span className="text-[#1A1917]/85 font-extrabold">1 Year Official Warranty</span>
                      </div>
                    </div>
                  )}
                  {activeTab === "shipping" && (
                    <div className="space-y-2.5 animate-fade-in-up text-sm">
                      <p>📦 **Standard Free Delivery** on all order totals across India.</p>
                      <p>⚡ **Dispatched within 24 hours** from our nearest automated fulfillment center.</p>
                      <p>🔄 **7-day replacement period** for any manufacturing discrepancies.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing section with custom controls */}
              <div className="flex items-center justify-between bg-white border border-[#1A1917]/5 rounded-[2rem] p-5 shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-[#8C9985] uppercase tracking-wider">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()} ({product.discountBadge})
                  </span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-[#C39281]">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-[#1A1917]/30 line-through font-semibold">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center bg-[#F8F9FA] border border-[#1A1917]/5 rounded-xl px-2.5 py-1.5 shadow-2xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg hover:bg-white text-[#1A1917] font-extrabold flex items-center justify-center transition-colors shadow-2xs"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-black text-sm text-[#1A1917]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-lg hover:bg-white text-[#1A1917] font-extrabold flex items-center justify-center transition-colors shadow-2xs"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Direct action rows */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAdd}
                className="py-5 rounded-2xl border-2 border-[#1A1917] hover:bg-[#F3F4F6] text-[#1A1917] text-xs font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-97 flex items-center justify-center gap-2.5"
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add to Bag</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="py-5 rounded-2xl bg-[#1A1917] hover:bg-[#8C9985] text-white text-xs font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-97 flex items-center justify-center gap-2.5 shadow-lg shadow-[#1A1917]/10"
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Buy Now</span>
              </button>
            </div>

          </div>

        </div>

        {/* Related Products Section */}
        <div className="pt-28 space-y-10 border-t border-[#1A1917]/5 mt-28">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C39281]/10 border border-[#C39281]/20">
              <span className="text-[10px] font-extrabold text-[#C39281] uppercase tracking-wider">Complete the Setup</span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-[#1A1917] tracking-tight">
              Related Accessories
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => {
              const specList = p.shortSpec.split(" · ");
              return (
                <div 
                  key={p.id}
                  onClick={() => router.push(`/product/${p.id}`)}
                  className="group relative rounded-[2.5rem] bg-white border border-[#1A1917]/5 p-5 flex flex-col justify-between hover-lift transition-all duration-500 cursor-pointer shadow-2xs"
                >
                  <div className="relative aspect-square w-full rounded-[2rem] bg-[#F8F9FA] overflow-hidden mb-5">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{
                        filter: "drop-shadow(0 10px 15px rgba(26,25,23,0.06))"
                      }}
                    />
                  </div>
                  
                  <div className="space-y-3.5">
                    <span className="text-[9px] font-extrabold text-[#1A1917]/40 uppercase tracking-widest">{p.category}</span>
                    <h4 className="font-display font-bold text-base text-[#1A1917] group-hover:text-[#C39281] transition-colors line-clamp-1">{p.name}</h4>
                    <div className="flex flex-wrap gap-1">
                      {specList.slice(0, 2).map((sp, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-[#1A1917]/50 bg-[#F3F4F6] px-2 py-0.5 rounded-md">{sp}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#1A1917]/5 mt-4">
                      <span className="font-black text-[#C39281]">₹{p.price.toLocaleString()}</span>
                      <span className="text-xs font-bold text-[#1A1917]/40 group-hover:text-[#1A1917] transition-all flex items-center gap-1">
                        <span>Details</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Global Brand Footer */}
      <Footer />
    </div>
  );
}
