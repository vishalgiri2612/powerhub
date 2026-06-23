"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";
import { Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HardwareThemeToggle from "./HardwareThemeToggle";

export default function Navbar() {
  const { 
    cart, 
    wishlist, 
    setIsCartOpen, 
    setIsSearchOpen, 
    getCartCount 
  } = useCart();
  
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    localStorage.removeItem("ravtron_session");
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Failed to sign out on server", e);
    }
    window.dispatchEvent(new Event("ravtron_auth_change"));
    window.location.href = "/";
  };

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href) || false;
  };

  useEffect(() => {
    const checkUser = () => {
      const session = localStorage.getItem("ravtron_session");
      if (session) {
        setUser(JSON.parse(session));
      } else {
        setUser(null);
      }
    };

    checkUser();

    window.addEventListener("storage", checkUser);
    window.addEventListener("ravtron_auth_change", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("ravtron_auth_change", checkUser);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "About Us", href: "/about" }
  ];

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hysteresis threshold to prevent scroll jitter/flicker at boundaries
      setIsScrolled((prev) => {
        if (window.scrollY > 60) return true;
        if (window.scrollY < 15) return false;
        return prev;
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`sticky z-[90] w-full overflow-visible transition-all duration-500 ease-in-out ${
        isScrolled
          ? "top-3 px-4 sm:px-6 lg:px-8"
          : "top-0 px-0"
      }`}>
        <nav className={`mx-auto flex items-center justify-between overflow-visible transition-all duration-500 ease-in-out ${
          isScrolled
            ? "max-w-5xl bg-white/95 backdrop-blur-md border border-[#1E293B]/10 rounded-full px-4 sm:px-6 py-2 shadow-lg hover:shadow-xl"
            : "max-w-full bg-white border-b border-[#1E293B]/10 rounded-none px-4 sm:px-12 py-3.5 sm:py-5 shadow-none"
        }`}>
          
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
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors relative py-1 after:absolute after:bottom-0 after:h-[2px] after:bg-[#3674B5] after:transition-all ${
                    active
                      ? "font-bold text-[#3674B5] after:w-full after:left-0"
                      : "font-semibold text-[#1E293B]/70 hover:text-[#1E293B] after:left-1/2 after:w-0 hover:after:w-full hover:after:left-0"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
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
            <Link 
              href="/wishlist"
              className="p-1.5 sm:p-2 rounded-full hover:bg-[#3674B5]/5 text-[#1E293B]/70 hover:text-[#1E293B] transition-all relative hover:scale-105 active:scale-95 inline-flex"
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
            </Link>

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

            {/* Hardware Theme Toggle */}
            <div className="relative z-50 flex items-center justify-center overflow-visible">
              <HardwareThemeToggle />
            </div>

            {/* Login / Sign Up or Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-[#3674B5]/5 border border-[#1E293B]/5 transition-all text-[#1E293B] hover:scale-102"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#3674B5]/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-[#3674B5]/20 bg-[#3674B5]/10 text-[#3674B5] flex items-center justify-center font-display font-extrabold text-xs uppercase">
                      {user.name ? user.name.charAt(0) : "U"}
                    </div>
                  )}
                  <span className="hidden lg:inline text-xs font-extrabold pr-2">{user.name ? user.name.split(" ")[0] : "User"}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-[#1E293B]/10 p-2.5 shadow-xl z-[999] animate-fade-in-up flex flex-col gap-1">
                    <div className="px-3 py-2 border-b border-[#1E293B]/5 mb-1.5 text-left">
                      <p className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider">Account</p>
                      <p className="text-xs font-black text-[#1E293B] truncate">{user.name}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="px-3 py-2.5 rounded-xl hover:bg-[#3674B5]/5 text-xs font-extrabold text-[#1E293B]/70 hover:text-[#1E293B] transition-all flex items-center gap-2 text-left"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="px-3 py-2.5 rounded-xl hover:bg-[#3674B5]/5 text-xs font-extrabold text-[#1E293B]/70 hover:text-[#1E293B] transition-all flex items-center gap-2 text-left"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Admin Panel</span>
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleSignOut();
                      }}
                      className="px-3 py-2.5 rounded-xl hover:bg-rose-50 text-xs font-extrabold text-rose-600 hover:text-rose-700 transition-all flex items-center gap-2 text-left w-full"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 text-center"
              >
                Login / Sign Up
              </Link>
            )}

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
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    active
                      ? "bg-[#3674B5]/10 text-[#3674B5]"
                      : "hover:bg-[#3674B5]/5 text-[#1E293B]/80 hover:text-[#1E293B]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {user ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-[#1E293B]/5 w-full">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#3674B5]/5 hover:bg-[#3674B5]/10 text-[#3674B5] text-sm font-bold transition-all text-center block"
                >
                  My Profile Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-bold transition-all text-center"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-[#3674B5] text-white text-sm font-bold transition-all text-center"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
