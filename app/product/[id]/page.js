"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { Star, Package, Zap, RotateCcw } from "lucide-react";

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

  // Fetch product detail dynamically
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [allProductsList, setAllProductsList] = useState([]);

  useEffect(() => {
    // 1. Fetch all products (for related accessories)
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("API response was not ok");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setAllProductsList(data);
        } else {
          console.error("Expected array for products but got:", data);
        }
      })
      .catch((err) => console.error("Failed to fetch all products for related", err));

    // 2. Fetch specific product detail
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.image || "");
      })
      .catch((err) => {
        console.error("Failed to fetch product details", err);
        setProduct(null);
      });
  }, [id]);

  useEffect(() => {
    setQuantity(1);
    setActiveTab("overview");
    window.scrollTo(0, 0);
  }, [id]);

  // Auto-cycle gallery images every 3 seconds
  useEffect(() => {
    if (!product || !product.gallery || product.gallery.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((currentImg) => {
        const currentIndex = product.gallery.indexOf(currentImg);
        const nextIndex = (currentIndex + 1) % product.gallery.length;
        return product.gallery[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [product, selectedImage]);

  if (!product) {
    return (
      <div className="min-h-screen bg-bg-brand text-text-brand antialiased">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-36 text-center space-y-4">
          <h2 className="font-display font-black text-3xl text-[#1E293B]">Product Not Found</h2>
          <p className="text-sm font-semibold text-[#1E293B]/50">The accessory you are looking for does not exist or has been removed.</p>
          <button 
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl bg-[#3674B5] text-white text-xs font-bold uppercase tracking-wider"
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
  const relatedProducts = Array.isArray(allProductsList)
    ? allProductsList.filter((p) => p.id !== product.id).slice(0, 3)
    : [];

  // Styling accents based on product ID/theme
  const isSage = product.id === "p1" || product.id === "p5";
  const isSand = product.id === "p2" || product.id === "p6";
  const brandAccent = isSage ? "#8C9985" : isSand ? "#DEC89E" : "#C39281";
  const brandBgLight = isSage ? "bg-[#3674B5]/10" : isSand ? "bg-[#DEC89E]/10" : "bg-[#3674B5]/10";
  const brandBorder = isSage ? "border-[#3674B5]/30" : isSand ? "border-[#DEC89E]/20" : "border-[#3674B5]/30";
  const brandText = isSage ? "text-[#3674B5]" : isSand ? "text-[#DEC89E]" : "text-[#3674B5]";

  const handleAdd = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(true);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-bg-brand text-text-brand antialiased selection:bg-[#3674B5] selection:text-white">
      {/* Dynamic Header Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 relative z-10">
        
        {/* Back navigation */}
        <div className="pb-8">
          <button 
            onClick={() => router.push("/shop")}
            className="group inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#1E293B]/50 hover:text-[#1E293B] transition-all bg-white border border-[#1E293B]/10 rounded-full px-5 py-2.5 hover-lift shadow-2xs"
          >
            <span className="group-hover:-translate-x-1.5 transition-transform duration-300">←</span>
            <span>Back to Shop</span>
          </button>
        </div>

        {/* Two-Column Details Showcase */}
        {/* Two-Column Details Showcase */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch">
          
          {/* Left Column: Image Gallery Showcase (Full-frame cover layout) */}
          <div className="w-full lg:w-1/2 bg-white border border-[#1E293B]/10 rounded-3xl md:rounded-[3rem] flex flex-col justify-between relative overflow-hidden shadow-sm min-h-[350px] sm:min-h-[500px] lg:min-h-[580px]">
            
            {/* Top Aspect-Square Image Cover Container */}
            <div className="w-full aspect-square relative overflow-hidden bg-[#FFFFFF] group">
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
                className={`absolute top-4 left-4 md:top-6 md:left-6 z-20 p-2.5 md:p-3.5 rounded-full border backdrop-blur-xs transition-all duration-300 hover:scale-110 active:scale-95 shadow-xs ${
                  isWishlisted
                    ? "bg-[#3674B5]/15 border-[#3674B5]/40 text-[#3674B5]"
                    : "bg-white/80 border-[#1E293B]/10 text-[#1E293B]/40 hover:text-[#1E293B] hover:bg-white"
                }`}
                aria-label="Add to Wishlist"
              >
                <svg
                  className="w-4.5 h-4.5 md:w-5.5 md:h-5.5"
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



              {/* Full-Frame Edge-to-Edge Image */}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
              />
            </div>

            {/* Bottom Controls Area (Padded separately) */}
            <div className="p-4 md:p-8 flex flex-col items-center w-full bg-white">
              {/* Horizontal divider line */}
              <div className="w-full h-[1px] bg-[#3674B5]/5 mb-4 md:mb-6" />

              {/* Thumbnails list */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="flex justify-center gap-3 md:gap-4 w-full">
                  {product.gallery.map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl border-2 overflow-hidden bg-[#FFFFFF] p-1.5 md:p-2 flex items-center justify-center transition-all duration-300 ${
                        selectedImage === imgUrl 
                          ? "border-[#3674B5] scale-105 shadow-xs bg-white" 
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
          <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-6 md:space-y-8">
            <div className="space-y-8">
              
              {/* Category tags */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full ${brandBgLight} ${brandBorder} border ${brandText} tracking-widest`}>
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 text-sm">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-[#1E293B]">{product.rating}</span>
                  <span className="text-xs text-[#1E293B]/40">({product.reviewsCount} verified reviews)</span>
                </div>
              </div>

              {/* Title & short specs */}
              <div className="space-y-3">
                <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-[#1E293B] tracking-tight leading-[1.1]">
                  {product.name}
                </h1>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {specItems.map((spec, i) => (
                    <span key={i} className="text-[9px] md:text-[10px] font-extrabold text-[#1E293B]/50 bg-[#3674B5]/5 px-2.5 py-1 md:py-1.5 rounded-lg uppercase tracking-wider">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tab Selector */}
              <div className="space-y-5">
                <div className="flex items-center border-b border-[#1E293B]/10 text-xs font-extrabold text-[#1E293B]/40 uppercase tracking-widest gap-4 sm:gap-8 overflow-x-auto scrollbar-none pb-1.5">
                  <button 
                    onClick={() => setActiveTab("overview")} 
                    className={`pb-2 transition-all relative flex-shrink-0 ${activeTab === "overview" ? "text-[#1E293B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#3674B5]" : "hover:text-[#1E293B]"}`}
                  >
                    Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab("specs")} 
                    className={`pb-2 transition-all relative flex-shrink-0 ${activeTab === "specs" ? "text-[#1E293B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#3674B5]" : "hover:text-[#1E293B]"}`}
                  >
                    Specifications
                  </button>
                  <button 
                    onClick={() => setActiveTab("shipping")} 
                    className={`pb-2 transition-all relative flex-shrink-0 ${activeTab === "shipping" ? "text-[#1E293B] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#3674B5]" : "hover:text-[#1E293B]"}`}
                  >
                    Shipping & Return
                  </button>
                </div>

                {/* Tab content view */}
                <div className="min-h-[120px] text-sm sm:text-base text-[#1E293B]/70 leading-relaxed font-semibold">
                  {activeTab === "overview" && (
                    <p className="animate-fade-in-up">{getDescription(product.id)}</p>
                  )}
                  {activeTab === "specs" && (
                    <div className="space-y-3.5 animate-fade-in-up">
                      <div className="flex justify-between border-b border-[#1E293B]/10 pb-2">
                        <span className="text-[#1E293B]/40 uppercase text-xs tracking-widest">Model Color</span>
                        <span className="text-[#1E293B]/85 font-extrabold">{product.color}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#1E293B]/10 pb-2">
                        <span className="text-[#1E293B]/40 uppercase text-xs tracking-widest">Material Finish</span>
                        <span className="text-[#1E293B]/85 font-extrabold">Ultra-premium matte finish</span>
                      </div>
                      <div className="flex justify-between border-b border-[#1E293B]/10 pb-2">
                        <span className="text-[#1E293B]/40 uppercase text-xs tracking-widest">Warranty Protection</span>
                        <span className="text-[#1E293B]/85 font-extrabold">1 Year Official Warranty</span>
                      </div>
                    </div>
                  )}
                  {activeTab === "shipping" && (
                    <div className="space-y-3.5 animate-fade-in-up text-sm text-left">
                      <div className="flex items-start gap-2.5">
                        <Package className="w-4 h-4 text-[#3674B5] mt-0.5 flex-shrink-0" />
                        <p><strong className="text-[#1E293B]">Standard Free Delivery</strong> on all order totals across India.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Zap className="w-4 h-4 text-[#3674B5] mt-0.5 flex-shrink-0" />
                        <p><strong className="text-[#1E293B]">Dispatched within 24 hours</strong> from our nearest automated fulfillment center.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <RotateCcw className="w-4 h-4 text-[#DEC89E] mt-0.5 flex-shrink-0" />
                        <p><strong className="text-[#1E293B]">7-day replacement period</strong> for any manufacturing discrepancies.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing section with custom controls */}
              <div className="flex items-center justify-between bg-white border border-[#1E293B]/10 rounded-2xl md:rounded-[2rem] p-4 md:p-5 shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()} ({product.discountBadge})
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-black text-[#3674B5]">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs md:text-sm text-[#1E293B]/30 line-through font-semibold">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center bg-[#FFFFFF] border border-[#1E293B]/10 rounded-xl px-1.5 py-1 md:px-2.5 md:py-1.5 shadow-2xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 md:w-9 md:h-9 rounded-lg hover:bg-white text-[#1E293B] font-extrabold flex items-center justify-center transition-colors shadow-2xs"
                  >
                    -
                  </button>
                  <span className="w-8 md:w-12 text-center font-black text-xs md:text-sm text-[#1E293B]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 md:w-9 md:h-9 rounded-lg hover:bg-white text-[#1E293B] font-extrabold flex items-center justify-center transition-colors shadow-2xs"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Direct action rows */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={handleAdd}
                className="py-3.5 md:py-5 rounded-2xl border-2 border-[#1E293B] hover:bg-[#F8F9FA] text-[#1E293B] text-xs font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-97 flex items-center justify-center gap-2.5"
              >
                <svg className="w-4 h-4 md:w-4.5 md:h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add to Bag</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="py-3.5 md:py-5 rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-97 flex items-center justify-center gap-2.5 shadow-lg shadow-[#1A1917]/10"
              >
                <svg className="w-4 h-4 md:w-4.5 md:h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Buy Now</span>
              </button>
            </div>

          </div>

        </div>

        {/* Related Products Section */}
        <div className="pt-10 md:pt-16 space-y-6 md:space-y-10 border-t border-[#1E293B]/10 mt-10 md:mt-16">
          <div className="space-y-1.5 md:space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
              <span className="text-[9px] font-extrabold text-[#3674B5] uppercase tracking-wider">Complete the Setup</span>
            </div>
            <h3 className="font-display font-black text-xl md:text-3xl text-[#1E293B] tracking-tight">
              Related Accessories
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {relatedProducts.map((p) => {
              const specList = p.shortSpec.split(" · ");
              return (
                <div 
                  key={p.id}
                  onClick={() => router.push(`/product/${p.id}`)}
                  className="group relative rounded-2xl md:rounded-[2.5rem] bg-white border border-[#1E293B]/10 p-3 md:p-5 flex flex-col justify-between hover-lift transition-all duration-500 cursor-pointer shadow-2xs"
                >
                  <div className="relative aspect-square w-full rounded-xl md:rounded-[2rem] bg-[#FFFFFF] overflow-hidden mb-3 md:mb-5">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{
                        filter: "drop-shadow(0 10px 15px rgba(26,25,23,0.06))"
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2 md:space-y-3.5">
                    <span className="text-[8px] md:text-[9px] font-extrabold text-[#1E293B]/40 uppercase tracking-widest">{p.category}</span>
                    <h4 className="font-display font-bold text-xs md:text-base text-[#1E293B] group-hover:text-[#3674B5] transition-colors line-clamp-1">{p.name}</h4>
                    
                    {/* Hidden on mobile to fit two-column grid cleanly */}
                    <div className="hidden sm:flex flex-wrap gap-1">
                      {specList.slice(0, 2).map((sp, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-[#1E293B]/50 bg-[#F8F9FA] px-2 py-0.5 rounded-md">{sp}</span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2.5 border-t border-[#1E293B]/10 mt-3 md:mt-4">
                      <span className="font-black text-[#3674B5] text-sm md:text-base">₹{p.price.toLocaleString()}</span>
                      <span className="text-[10px] md:text-xs font-bold text-[#1E293B]/40 group-hover:text-[#1E293B] transition-all flex items-center gap-0.5 md:gap-1">
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
