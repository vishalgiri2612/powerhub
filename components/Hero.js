"use client";

import React from "react";

export default function Hero() {
  return (
    <section id="home" className="hero-radial-bg pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        {/* Left Text Column */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 max-w-xl">

          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[#C39281]/10 border border-[#C39281]/20 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C39281]"></span>
            <span className="text-xs font-extrabold text-[#C39281] uppercase tracking-wider">
              5,000+ Products Available
            </span>
          </div>

          {/* Big Headline */}
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-[#1A1917]">
            Connecting Every <span className="text-[#C39281]">Device</span>. Powering Every Business.
          </h1>

          {/* Short Subtext */}
          <p className="text-base sm:text-lg text-[#1A1917]/70 leading-relaxed font-semibold">
            Enterprise-grade connectivity, networking, surveillance, and workspace solutions built for the modern digital world.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
            <a
              href="#store"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1A1917] hover:bg-[#8C9985] text-white text-xs font-extrabold shadow-lg transition-all hover:scale-105 active:scale-95 text-center"
            >
              Explore Products
            </a>
            <button
              onClick={() => alert("Quote Request: Our B2B support desk will contact you within 2 business hours.")}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/70 hover:bg-white text-[#1A1917] text-xs font-extrabold border border-[#1A1917]/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Get a Quote
            </button>
          </div>

          {/* Trust Bar */}
          <div className="flex items-center gap-4 pt-6 border-t border-[#1A1917]/10 w-full">
            {/* Overlapping User Avatars */}
            <div className="flex -space-x-3 overflow-hidden">
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-[#F8F9FA]"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Business Client"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-[#F8F9FA]"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Business Client"
              />
              <img
                className="inline-block h-10 w-10 rounded-full ring-2 ring-[#F8F9FA]"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Business Client"
              />
            </div>
            <div className="text-sm font-medium text-[#1A1917]/80">
              <div className="flex items-center gap-1">
                <span className="text-[#C39281]">⭐⭐⭐⭐⭐</span>
                <span className="font-bold">4.9/5</span>
              </div>
              <p className="text-xs text-[#1A1917]/50 mt-0.5">Trusted by 1,000+ global business clients</p>
            </div>
          </div>
        </div>

        {/* Right Image Column */}
        <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[480px] lg:max-w-[450px]">

            {/* Floating Ambient Glow Background Ring */}
            <div className="absolute inset-0 bg-[#E5D0C6]/40 rounded-full blur-3xl scale-95 z-0"></div>

            {/* Realistic Hero Image */}
            <div className="relative z-10 rounded-[2.5rem] bg-[#F3F4F6] p-4 shadow-xl border border-white/40 overflow-hidden group hover:scale-[1.01] transition-transform duration-700">
              <img
                src="/images/hero.png"
                alt="PowerHub B2B Enterprise Connectivity Solutions"
                className="w-full h-auto rounded-[2rem] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Floating Info Chips */}
            <div className="absolute -top-4 -left-4 z-20 glass-pill px-4.5 py-2.5 rounded-2xl shadow-lg border flex items-center gap-2 hover:scale-105 transition-all">
              <span className="text-[#8C9985] text-lg font-bold">🔌</span>
              <div>
                <h4 className="text-xs font-bold text-[#1A1917]">Pro HDMI 2.1</h4>
                <p className="text-[10px] text-[#1A1917]/60">8K Resolution</p>
              </div>
            </div>

            <div className="absolute top-[45%] -right-6 z-20 glass-pill px-4.5 py-2.5 rounded-2xl shadow-lg border flex items-center gap-2 hover:scale-105 transition-all">
              <span className="text-[#C39281] text-lg font-bold">🖥️</span>
              <div>
                <h4 className="text-xs font-bold text-[#1A1917]">Docking Hub</h4>
                <p className="text-[10px] text-[#1A1917]/60">10-in-1 output</p>
              </div>
            </div>

            <div className="absolute -bottom-4 left-[20%] z-20 glass-pill px-4.5 py-2.5 rounded-2xl shadow-lg border flex items-center gap-2 hover:scale-105 transition-all">
              <span className="text-[#DEC89E] text-lg font-bold">🌐</span>
              <div>
                <h4 className="text-xs font-bold text-[#1A1917]">CAT6 SFTP</h4>
                <p className="text-[10px] text-[#1A1917]/60">10Gbps Speed</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
