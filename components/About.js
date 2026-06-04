"use client";

import React from "react";
import { Cpu, ShieldCheck, Sparkles, Box } from "lucide-react";

export default function About() {
  const pillars = [
    {
      icon: <Cpu className="w-6 h-6 text-[#3674B5]" />,
      title: "GaN Charging Engineering",
      desc: "We utilize next-generation Gallium Nitride (GaN) semiconductors to pack multi-port high-wattage speed into pocket-sized chargers that operate at maximum efficiency with minimal heat.",
      glow: "rgba(54, 116, 181, 0.1)"
    },
    {
      icon: <Box className="w-6 h-6 text-[#DEC89E]" />,
      title: "Workspace Craftsmanship",
      desc: "Our hardware design emphasizes tactile textures like sage green, sand beige, and braided cord finishes. We build premium accessories that double as desk decor pieces.",
      glow: "rgba(222, 200, 158, 0.15)"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#3674B5]" />,
      title: "Device Intelligence & Safety",
      desc: "Every product is built with custom smart circuitry. Real-time OLED power bank status tracking, digital wattage display cables, and advanced thermal protection keep your devices protected.",
      glow: "rgba(54, 116, 181, 0.1)"
    }
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#F8F9FA]/40 border-t border-[#1E293B]/5">
      {/* Dynamic background ambient lights */}
      <div className="absolute top-1/2 right-0 w-[450px] h-[450px] bg-[#E8EFE5] opacity-25 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#E5D0C6] opacity-30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* About Section Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Mission Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#3674B5] animate-pulse" />
              <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                Who We Are
              </span>
            </div>
            
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#1E293B] tracking-tight leading-tight">
              A Design-First Hardware Collective <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3674B5] to-[#578FCA]">For Modern Workspace Creators.</span>
            </h2>
            
            <p className="text-sm sm:text-base font-semibold text-[#1E293B]/60 leading-relaxed">
              At Ravtron, we believe workspace hardware should never be generic. We are an engineering collective focused on fusing high-performance connectivity with premium aesthetic precision.
            </p>
            
            <p className="text-sm font-semibold text-[#1E293B]/50 leading-relaxed">
              Whether it is our 65W GaN wall chargers wrapped in a muted Sage Green, our smart OLED power banks displaying live speed diagnostics, or our 4K ringlight webcams, each piece is engineered to elevate your daily digital production. We design for creators, tech enthusiasts, and professionals who curate their setups with intention.
            </p>
          </div>

          {/* Right Column: Values Cards Grid */}
          <div className="lg:col-span-6 space-y-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="group relative rounded-[2rem] bg-white border border-[#1E293B]/10 p-6 sm:p-8 hover-lift transition-all duration-500 overflow-hidden"
                style={{
                  boxShadow: "0 10px 30px -15px rgba(26, 25, 23, 0.03)"
                }}
              >
                {/* Hover Glow Light */}
                <div 
                  className="absolute -top-16 -left-16 w-44 h-44 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${pillar.glow} 0%, transparent 70%)`
                  }}
                />

                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F9FA] border border-[#1E293B]/5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {pillar.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-extrabold text-base sm:text-lg text-[#1E293B] group-hover:text-[#3674B5] transition-colors duration-300">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#1E293B]/60 leading-relaxed font-semibold">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
