"use client";

import React from "react";

export default function Footer() {
  const shopLinks = [
    { name: "Power Banks", href: "#categories" },
    { name: "Wall Chargers", href: "#categories" },
    { name: "Charging Cables", href: "#categories" },
    { name: "Webcams", href: "#categories" },
    { name: "Accessories", href: "#categories" }
  ];

  const supportLinks = [
    { name: "Track Order", href: "#" },
    { name: "Returns & Exchanges", href: "#" },
    { name: "Warranty Claim", href: "#" },
    { name: "Frequently Asked Questions", href: "#" },
    { name: "Contact Support Team", href: "#" }
  ];

  const companyLinks = [
    { name: "About Our Brand", href: "#about" },
    { name: "Technology Blog", href: "#blog" },
    { name: "Career Opportunities", href: "#" },
    { name: "Press & Media Kit", href: "#" },
    { name: "Privacy & Terms", href: "#" }
  ];

  const socialLinks = [
    { name: "Instagram", icon: "📷", href: "#" },
    { name: "YouTube", icon: "📺", href: "#" },
    { name: "Twitter / X", icon: "🐦", href: "#" },
    { name: "LinkedIn", icon: "💼", href: "#" }
  ];

  return (
    <footer className="bg-[#F3F4F6] border-t border-[#1A1917]/10 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main Footer Links Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info Column */}
          <div className="space-y-4 lg:col-span-2">
            <a href="#home" className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-[#1A1917] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                ⚡
              </span>
              <span className="font-display font-extrabold text-xl tracking-tight text-[#1A1917]">
                Power<span className="text-[#C39281]">Hub</span>
              </span>
            </a>
            <p className="text-sm font-semibold text-[#1A1917]/60 leading-relaxed max-w-sm">
              We engineer state-of-the-art Gallium Nitride (GaN) charging hardware and lifestyle workspace accessories, prioritizing tactile textures and absolute safety.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  className="w-10 h-10 rounded-full bg-[#F8F9FA] hover:bg-[#8C9985] hover:text-white text-[#1A1917]/70 flex items-center justify-center text-sm shadow-sm transition-all hover:scale-105"
                  aria-label={soc.name}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#1A1917] uppercase tracking-widest">Shop Gear</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm font-semibold text-[#1A1917]/60 hover:text-[#C39281] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#1A1917] uppercase tracking-widest">Customer Care</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm font-semibold text-[#1A1917]/60 hover:text-[#C39281] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Contact Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#1A1917] uppercase tracking-widest">Contact Details</h4>
            <ul className="space-y-3.5 text-sm font-semibold text-[#1A1917]/70">
              <li className="flex flex-col">
                <span className="text-[10px] font-bold text-[#1A1917]/40 uppercase tracking-wide">Write to Us</span>
                <a href="mailto:support@powerhub.co" className="hover:text-[#C39281] transition-colors mt-0.5">
                  support@powerhub.co
                </a>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] font-bold text-[#1A1917]/40 uppercase tracking-wide">Call Support</span>
                <a href="tel:+919876543210" className="hover:text-[#C39281] transition-colors mt-0.5">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-1.5 pt-1">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#8C9985] text-white text-[10px] font-extrabold uppercase tracking-wide hover:bg-[#1A1917] transition-all flex items-center gap-1 hover:scale-103"
                >
                  💬 WhatsApp Chat
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and payment gateway strip */}
        <div className="pt-8 border-t border-[#1A1917]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-[#1A1917]/50 text-center sm:text-left">
            © {new Date().getFullYear()} PowerHub India. All rights reserved. Made for premium workspace aesthetics.
          </p>
          
          {/* Payment gateway icons */}
          <div className="flex items-center gap-2 flex-wrap">
            {["Visa", "Mastercard", "UPI Pay", "Razorpay", "NetBanking"].map((pay) => (
              <span 
                key={pay} 
                className="px-2.5 py-1 rounded bg-[#F8F9FA] border border-[#1A1917]/5 text-[9px] font-extrabold text-[#1A1917]/50 uppercase tracking-wider"
              >
                💳 {pay}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
