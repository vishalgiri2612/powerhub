import React from "react";
import { Zap, MessageCircle, CreditCard } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const shopLinks = [
    { name: "Power Banks", href: "/shop?category=Power Banks" },
    { name: "Wall Chargers", href: "/shop?category=Wall Chargers" },
    { name: "Charging Cables", href: "/shop?category=Charging Cables" },
    { name: "Webcams", href: "/shop?category=Webcams" },
    { name: "Accessories", href: "/shop?category=Smart Accessories" }
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
    { name: "Career Opportunities", href: "#" },
    { name: "Press & Media Kit", href: "#" },
    { name: "Privacy & Terms", href: "#" }
  ];

  const socialLinks = [
    { name: "Instagram", href: "#" },
    { name: "YouTube", href: "#" },
    { name: "Twitter / X", href: "#" },
    { name: "LinkedIn", href: "#" }
  ];

  return (
    <footer className="bg-[#F8F9FA] border-t border-[#1E293B]/15 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main Footer Links Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info Column */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center group">
              <img 
                src="/images/logo.png" 
                alt="RAVTRON®" 
                className="h-[28px] w-auto object-contain mix-blend-multiply transition-all duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-sm font-semibold text-[#1E293B]/60 leading-relaxed max-w-sm">
              We engineer state-of-the-art Gallium Nitride (GaN) charging hardware and lifestyle workspace accessories, prioritizing tactile textures and absolute safety.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  className="w-10 h-10 rounded-full bg-[#FFFFFF] hover:bg-[#578FCA] hover:text-white text-[#1E293B]/70 flex items-center justify-center shadow-sm transition-all hover:scale-105"
                  aria-label={soc.name}
                >
                  {soc.name === "Instagram" && (
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  )}
                  {soc.name === "YouTube" && (
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                    </svg>
                  )}
                  {soc.name === "Twitter / X" && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                  {soc.name === "LinkedIn" && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#1E293B] uppercase tracking-widest">Shop Gear</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-[#1E293B]/60 hover:text-[#3674B5] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#1E293B] uppercase tracking-widest">Customer Care</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm font-semibold text-[#1E293B]/60 hover:text-[#3674B5] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Contact Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-[#1E293B] uppercase tracking-widest">Contact Details</h4>
            <ul className="space-y-3.5 text-sm font-semibold text-[#1E293B]/70">
              <li className="flex flex-col">
                <span className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wide">Write to Us</span>
                <a href="mailto:support@ravtron.co" className="hover:text-[#3674B5] transition-colors mt-0.5">
                  support@ravtron.co
                </a>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wide">Call Support</span>
                <a href="tel:+919876543210" className="hover:text-[#3674B5] transition-colors mt-0.5">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-1.5 pt-1">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#3674B5] text-white text-[10px] font-extrabold uppercase tracking-wide hover:bg-[#3674B5] transition-all flex items-center gap-1.5 hover:scale-103"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp Chat</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and payment gateway strip */}
        <div className="pt-8 border-t border-[#1E293B]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-[#1E293B]/50 text-center sm:text-left">
            © {new Date().getFullYear()} Ravtron India. All rights reserved. Made for premium workspace aesthetics.
          </p>
          
          {/* Payment gateway icons */}
          <div className="flex items-center gap-2 flex-wrap">
            {["Visa", "Mastercard", "UPI Pay", "Razorpay", "NetBanking"].map((pay) => (
              <span 
                key={pay} 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FFFFFF] border border-[#1E293B]/10 text-[9px] font-extrabold text-[#1E293B]/50 uppercase tracking-wider"
              >
                <CreditCard className="w-3 h-3" />
                <span>{pay}</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
