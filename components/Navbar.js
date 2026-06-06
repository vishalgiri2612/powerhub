"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { 
    cart, 
    wishlist, 
    setIsCartOpen, 
    setIsSearchOpen, 
    getCartCount 
  } = useCart();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    alert(`Success: Logged in as ${authEmail}`);
    setAuthOpen(false);
    setAuthEmail("");
    setAuthPassword("");
    setAuthName("");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "About Us", href: "/about" }
  ];

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={
        isScrolled
          ? "sticky top-4 z-[90] w-full px-4 sm:px-6 lg:px-8 navbar-transition"
          : "sticky top-0 z-[90] w-full px-0 navbar-transition"
      }>
        <nav className={
          isScrolled
            ? "max-w-5xl mx-auto bg-[#FFFFFF] border border-[#1E293B]/10 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between shadow-lg hover:shadow-xl navbar-transition"
            : "max-w-full mx-auto bg-[#FFFFFF] border-b border-[#1E293B]/10 rounded-none px-4 sm:px-12 py-3.5 sm:py-5 flex items-center justify-between navbar-transition"
        }>
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center group">
            <img 
              src="/images/logo.png" 
              alt="RAVTRON®" 
              className="h-[24px] sm:h-[28px] w-auto object-contain mix-blend-multiply transition-all duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-[#1E293B]/70 hover:text-[#1E293B] relative py-1 transition-colors after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-[#3674B5] after:transition-all hover:after:w-full hover:after:left-0"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Icons & CTAs */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Search Icon */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 sm:p-2 rounded-full hover:bg-[#3674B5]/5 text-[#1E293B]/70 hover:text-[#1E293B] transition-all hover:scale-105 active:scale-95"
              aria-label="Search Products"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist Button */}
            <button 
              onClick={() => alert(`Your Wishlist contains ${wishlist.length} item(s)`)}
              className="p-1.5 sm:p-2 rounded-full hover:bg-[#3674B5]/5 text-[#1E293B]/70 hover:text-[#1E293B] transition-all relative hover:scale-105 active:scale-95"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#3674B5] text-white text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 sm:p-2 rounded-full hover:bg-[#3674B5]/5 text-[#1E293B]/70 hover:text-[#1E293B] transition-all relative hover:scale-105 active:scale-95"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#3674B5] text-white text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Login / Sign Up Button */}
            <button 
              onClick={() => {
                setAuthMode("login");
                setAuthOpen(true);
              }}
              className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-bold transition-all hover:scale-105 active:scale-95"
            >
              Login / Sign Up
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-full hover:bg-[#3674B5]/5 text-[#1E293B]/70 hover:text-[#1E293B]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 mx-4 max-w-5xl rounded-3xl bg-[#FFFFFF] border border-[#1E293B]/10 p-4 flex flex-col gap-3 shadow-lg animate-fade-in-up">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl hover:bg-[#3674B5]/5 text-sm font-bold text-[#1E293B]/80 hover:text-[#1E293B] transition-all"
              >
                {link.name}
              </Link>
            ))}
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthMode("login");
                setAuthOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-[#3674B5] text-white text-sm font-bold transition-all text-center"
            >
              Login / Sign Up
            </button>
          </div>
        )}
      </header>

      {/* Authentication Modal Popup */}
      {authOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-[#3674B5]/40 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl glass-panel p-8 shadow-2xl relative">
            <button 
              onClick={() => setAuthOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#3674B5]/5 text-[#1E293B]/60"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold font-display text-[#1E293B] text-center mb-6">
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </h3>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-[#1E293B]/60 uppercase mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl px-4 py-3 text-sm font-medium text-[#1E293B] outline-none focus:border-[#3674B5]"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-[#1E293B]/60 uppercase mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl px-4 py-3 text-sm font-medium text-[#1E293B] outline-none focus:border-[#3674B5]"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1E293B]/60 uppercase mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl px-4 py-3 text-sm font-medium text-[#1E293B] outline-none focus:border-[#3674B5]"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-95 mt-2"
              >
                {authMode === "login" ? "Login" : "Sign Up"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-[#1E293B]/60">
              {authMode === "login" ? (
                <p>
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setAuthMode("signup")}
                    className="text-[#3674B5] font-bold hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button 
                    onClick={() => setAuthMode("login")}
                    className="text-[#3674B5] font-bold hover:underline"
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
