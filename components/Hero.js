"use client";

import React, { useState, useEffect } from "react";
import { Plug, Monitor, Globe } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const [animationState, setAnimationState] = useState("retracted"); // "retracted" | "connecting" | "connected" | "disconnecting"
  const [cycleIndex, setCycleIndex] = useState(0);

  // Gallery of product pairs (Disconnected state vs Connected state)
  const products = [
    { 
      disconnected: "/images/hero.png", 
      connected: "/images/cable.png",
      tag1: "Pro HDMI 2.1", tag1Desc: "8K Resolution",
      tag2: "Docking Hub", tag2Desc: "10-in-1 output",
      tag3: "CAT6 SFTP", tag3Desc: "10Gbps Speed"
    },
    { 
      disconnected: "/images/charger.png", 
      connected: "/images/webcam.png",
      tag1: "GaN Pro 65W", tag1Desc: "Fast Charging",
      tag2: "Ring Webcam", tag2Desc: "4K Video Stream",
      tag3: "Power Cord", tag3Desc: "Heavy Duty"
    },
    { 
      disconnected: "/images/powerbank.png", 
      connected: "/images/earbuds.png",
      tag1: "Smart Bank", tag1Desc: "OLED Diagnostics",
      tag2: "Hi-Fi Buds", tag2Desc: "ANC Workspace",
      tag3: "USB-C Cable", tag3Desc: "100W PD Power"
    }
  ];

  useEffect(() => {
    let active = true;
    let timerId = null;

    const runSequence = () => {
      if (!active) return;
      
      // Step 1: Retracted (start of cycle)
      setAnimationState("retracted");
      
      // After 2000ms, start connecting
      timerId = setTimeout(() => {
        if (!active) return;
        setAnimationState("connecting");
        
        // After 1000ms (cables meet), set connected (triggers image change, spark, text, pulse)
        timerId = setTimeout(() => {
          if (!active) return;
          setAnimationState("connected");
          
          // After 3200ms (stay connected), start disconnecting
          timerId = setTimeout(() => {
            if (!active) return;
            setAnimationState("disconnecting");
            
            // After 1000ms (cables fully retracted), reset to retracted and switch product pair
            timerId = setTimeout(() => {
              if (!active) return;
              setAnimationState("retracted");
              setCycleIndex((prev) => (prev + 1) % products.length);
              
              // Wait 800ms before starting the next cycle
              timerId = setTimeout(() => {
                if (active) {
                  runSequence();
                }
              }, 800);
              
            }, 1000);
          }, 3200);
        }, 1000);
      }, 2000);
    };

    runSequence();

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return (
    <section 
      id="home" 
      className="hero-radial-bg pt-16 pb-24 px-4 sm:px-8 lg:px-16 overflow-hidden relative"
    >
      {/* Dynamic Cable Connection Animation Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-95">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Gradients */}
          <defs>
            <linearGradient id="left-cable-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="60%" stopColor="#3674B5" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="right-cable-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="40%" stopColor="#DEC89E" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="metal-dark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="40%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="gold-plated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFECA1" />
              <stop offset="50%" stopColor="#D9B46C" />
              <stop offset="100%" stopColor="#B58F4A" />
            </linearGradient>
            <radialGradient id="connection-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="30%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="65%" stopColor="#DEC89E" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Faint background grid lines */}
          <path d="M 0 400 L 1440 400" stroke="#3674B5" strokeWidth="1" strokeDasharray="8 8" opacity="0.08" />
          
          {/* PCB Circuit Tracks (Background Details) */}
          <g 
            style={{ 
              opacity: (animationState === "connected") ? 0.35 : 0.12, 
              transition: "opacity 0.5s ease-in-out" 
            }}
          >
            {/* Top Left Track */}
            <path d="M 100 150 L 400 150 L 500 250 L 700 250" stroke="#3674B5" strokeWidth="1.5" strokeLinecap="round" />
            {/* Bottom Right Track */}
            <path d="M 1340 650 L 1040 650 L 940 550 L 740 550" stroke="#DEC89E" strokeWidth="1.5" strokeLinecap="round" />
            {/* Top Right Track */}
            <path d="M 1200 200 L 1000 200 L 900 300 L 800 300" stroke="#3674B5" strokeWidth="1.5" strokeLinecap="round" />
            {/* Bottom Left Track */}
            <path d="M 200 600 L 450 600 L 550 500 L 650 500" stroke="#DEC89E" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Glowing pulse rings at connection point */}
          <g 
            className={(animationState === "connected") ? "animate-pulse-ring-once" : "opacity-0"}
            style={{ transformOrigin: "720px 400px" }}
          >
            <circle cx="0" cy="0" r="100" fill="url(#connection-glow)" />
          </g>
          <g 
            className={(animationState === "connected") ? "animate-pulse-ring-once" : "opacity-0"}
            style={{ transformOrigin: "720px 400px", animationDelay: "0.4s" }}
          >
            <circle cx="0" cy="0" r="100" fill="url(#connection-glow)" />
          </g>
          <g 
            className={(animationState === "connected") ? "animate-pulse-ring-stroke-once" : "opacity-0"}
            style={{ transformOrigin: "720px 400px" }}
          >
            <circle cx="0" cy="0" r="60" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
          </g>

          {/* Left Cable Group (Sleek USB-C Male Connector) */}
          <g 
            style={{ 
              transform: (animationState === "connecting" || animationState === "connected") ? "translateX(14px)" : "translateX(-95px)", 
              transition: "transform 1s cubic-bezier(0.25, 1, 0.5, 1)" 
            }}
          >
            {/* Outer main cable */}
            <path d="M -100 400 C 150 420 350 380 500 400 H 620" stroke="url(#left-cable-grad)" strokeWidth="7" strokeLinecap="round" />
            {/* Inner glowing braided texture wire */}
            <path d="M -100 400 C 150 420 350 380 500 400 H 620" stroke="#578FCA" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" opacity="0.75" />
            {/* Data flow packet stream overlay */}
            <path 
              d="M -100 400 C 150 420 350 380 500 400 H 620" 
              stroke="#38BDF8" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeDasharray="15 45" 
              className="animate-flow-left"
              style={{
                opacity: (animationState === "connected") ? 0.9 : 0,
                transition: "opacity 0.3s ease-in-out"
              }}
            />

            {/* Strain relief ribbing */}
            <rect x="606" y="394" width="5" height="12" rx="1.5" fill="#334155" />
            <rect x="614" y="393" width="6" height="14" rx="2" fill="#1E293B" />
            <rect x="623" y="392" width="7" height="16" rx="2" fill="#0F172A" />

            {/* Metal connector body */}
            <rect x="633" y="389" width="36" height="22" rx="5" fill="url(#metal-dark)" stroke="#334155" strokeWidth="1.5" />
            {/* Specular high-tech highlight */}
            <rect x="637" y="391" width="28" height="2" rx="1" fill="#64748B" opacity="0.4" />
            {/* LED Indicator Light */}
            <circle cx="651" cy="400" r="2" fill="#38BDF8" className="animate-led" />

            {/* Gold-plated tip (USB-C profile) */}
            <rect x="669" y="394" width="18" height="12" rx="3.5" fill="url(#gold-plated)" stroke="#D9B46C" strokeWidth="1" />
            {/* Internal USB-C pin divide line */}
            <line x1="673" y1="400" x2="683" y2="400" stroke="#1E293B" strokeWidth="1" />
          </g>

          {/* Right Cable Group (Blocky HDMI Female Port) */}
          <g 
            style={{ 
              transform: (animationState === "connecting" || animationState === "connected") ? "translateX(-14px)" : "translateX(95px)", 
              transition: "transform 1s cubic-bezier(0.25, 1, 0.5, 1)" 
            }}
          >
            {/* Outer main cable */}
            <path d="M 1540 400 C 1290 380 1090 420 940 400 H 820" stroke="url(#right-cable-grad)" strokeWidth="9" strokeLinecap="round" />
            {/* Inner glowing braided texture wire */}
            <path d="M 1540 400 C 1290 380 1090 420 940 400 H 820" stroke="#DEC89E" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 4" opacity="0.75" />
            {/* Data flow packet stream overlay */}
            <path 
              d="M 1540 400 C 1290 380 1090 420 940 400 H 820" 
              stroke="#DEC89E" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeDasharray="15 45" 
              className="animate-flow-right"
              style={{
                opacity: (animationState === "connected") ? 0.9 : 0,
                transition: "opacity 0.3s ease-in-out"
              }}
            />

            {/* Strain relief ribbing */}
            <rect x="819" y="393" width="5" height="14" rx="1.5" fill="#334155" />
            <rect x="810" y="392" width="6" height="16" rx="2" fill="#1E293B" />
            <rect x="800" y="391" width="7" height="18" rx="2" fill="#0F172A" />

            {/* Metal connector body (Boxy receptacle adapter) */}
            <rect x="734" y="384" width="46" height="32" rx="4" fill="url(#metal-dark)" stroke="#334155" strokeWidth="1.5" />
            {/* Specular highlight */}
            <rect x="738" y="387" width="38" height="2" rx="1" fill="#64748B" opacity="0.4" />
            {/* LED Indicator Light */}
            <circle cx="757" cy="400" r="2" fill="#FBBF24" className="animate-led" />

            {/* Gold-plated socket collar (receptacle entrance) */}
            <rect x="711" y="390" width="6" height="20" rx="1.5" fill="url(#gold-plated)" stroke="#D9B46C" strokeWidth="1" />
            {/* Hollow port opening */}
            <rect x="717" y="392" width="17" height="16" rx="1" fill="#060A12" />
          </g>

          {/* Connection Sparkle Flash */}
          <g 
            style={{ 
              transform: "translate(720px, 400px)",
              opacity: (animationState === "connected") ? 1 : 0, 
              scale: (animationState === "connected") ? "1.4" : "0",
              transition: "opacity 0.2s ease-out, scale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }}
          >
            <circle cx="0" cy="0" r="8" fill="#FFFFFF" />
            <circle cx="0" cy="0" r="24" fill="#38BDF8" opacity="0.5" />
            <circle cx="0" cy="0" r="48" fill="#FBBF24" opacity="0.25" />
            {/* Star Rays */}
            <path d="M -30 0 L 30 0 M 0 -30 L 0 30" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M -20 -20 L 20 20 M -20 20 L 20 -20" stroke="#FBBF24" strokeWidth="1.5" />
          </g>

          {/* Floating tech particles in background */}
          <g className="tech-particles" opacity="0.5">
            <circle cx="200" cy="150" r="2" fill="#38BDF8" className="particle-float-1" />
            <circle cx="350" cy="600" r="3" fill="#DEC89E" className="particle-float-2" />
            <circle cx="580" cy="180" r="1.5" fill="#38BDF8" className="particle-float-3" />
            <circle cx="850" cy="620" r="2.5" fill="#38BDF8" className="particle-float-1" />
            <circle cx="1100" cy="220" r="2" fill="#DEC89E" className="particle-float-2" />
            <circle cx="1250" cy="550" r="3.5" fill="#38BDF8" className="particle-float-3" />
            <circle cx="950" cy="120" r="1.5" fill="#FBBF24" className="particle-float-2" />
            <circle cx="150" cy="500" r="2" fill="#38BDF8" className="particle-float-3" />
          </g>
        </svg>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse-ring-grows-once {
            0% { transform: translate(720px, 400px) scale(0.1); opacity: 0; }
            10% { transform: translate(720px, 400px) scale(0.2); opacity: 1; }
            100% { transform: translate(720px, 400px) scale(3.5); opacity: 0; }
          }
          @keyframes pulse-ring-stroke-once {
            0% { transform: translate(720px, 400px) scale(0.1); opacity: 0; }
            10% { transform: translate(720px, 400px) scale(0.25); opacity: 0.8; }
            100% { transform: translate(720px, 400px) scale(3); opacity: 0; }
          }
          @keyframes flow-left-loop {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -60; }
          }
          @keyframes flow-right-loop {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: 60; }
          }
          @keyframes led-breathe {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          @keyframes particle-float-1 {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
            50% { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
          }
          @keyframes particle-float-2 {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
            50% { transform: translateY(40px) translateX(-20px); opacity: 0.9; }
          }
          @keyframes particle-float-3 {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
            50% { transform: translateY(-20px) translateX(-25px); opacity: 0.7; }
          }

          .animate-pulse-ring-once {
            animation: pulse-ring-grows-once 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-pulse-ring-stroke-once {
            animation: pulse-ring-stroke-once 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-flow-left {
            animation: flow-left-loop 2s linear infinite;
          }
          .animate-flow-right {
            animation: flow-right-loop 2s linear infinite;
          }
          .animate-led {
            animation: led-breathe 2s ease-in-out infinite;
          }
          .particle-float-1 { animation: particle-float-1 7s ease-in-out infinite; }
          .particle-float-2 { animation: particle-float-2 9s ease-in-out infinite; }
          .particle-float-3 { animation: particle-float-3 11s ease-in-out infinite; }
        `}} />
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">

        {/* Left Text Column */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 max-w-xl">

          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] animate-pulse"></span>
            <span className="text-xs font-extrabold text-[#3674B5] uppercase tracking-wider">
              5,000+ Products Available
            </span>
          </div>

          {/* Big Headline */}
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-[#1E293B]">
            Connecting Every <span className="text-[#3674B5]">Device</span>.<br />Powering Every Business.
          </h1>

          {/* Short Subtext */}
          <p className="text-base sm:text-lg text-[#1E293B]/70 leading-relaxed font-semibold max-w-lg">
            Enterprise-grade connectivity, networking, surveillance, and workspace solutions built for the modern digital world.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold shadow-lg transition-all hover:scale-105 active:scale-95 text-center"
            >
              Explore Products
            </Link>
            <button
              onClick={() => alert("Quote Request: Our B2B support desk will contact you within 2 business hours.")}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/70 hover:bg-white text-[#1E293B] text-xs font-extrabold border border-[#1E293B]/15 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Get a Quote
            </button>
          </div>

        </div>

        {/* Right Image Column */}
        <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[480px] lg:max-w-[450px]">

            {/* Floating Ambient Glow Background Ring */}
            <div className="absolute inset-0 bg-[#E5D0C6]/40 rounded-full blur-3xl scale-95 z-0"></div>

            {/* Realistic Hero Image Frame */}
            <div className="relative z-10 rounded-[2.5rem] bg-[#F8F9FA] p-4 shadow-xl border border-white/40 overflow-hidden group hover:scale-[1.01] transition-all duration-700 h-[300px] sm:h-[380px] lg:h-[400px]">
              {/* Disconnected Image */}
              <img
                src={products[cycleIndex].disconnected}
                alt="Ravtron B2B Solutions"
                className="w-full h-full rounded-[2rem] object-cover absolute inset-4"
                style={{
                  opacity: (animationState === "connected") ? 0 : 1,
                  transform: (animationState === "connected") ? "scale(0.95)" : "scale(1)",
                  width: "calc(100% - 2rem)",
                  height: "calc(100% - 2rem)",
                  transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out"
                }}
              />
              {/* Connected Image */}
              <img
                src={products[cycleIndex].connected}
                alt="Ravtron Connected Active State"
                className="w-full h-full rounded-[2rem] object-cover absolute inset-4"
                style={{
                  opacity: (animationState === "connected") ? 1 : 0,
                  transform: (animationState === "connected") ? "scale(1)" : "scale(1.05)",
                  width: "calc(100% - 2rem)",
                  height: "calc(100% - 2rem)",
                  transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out"
                }}
              />
            </div>

            {/* Floating Info Chips */}
            <div className="absolute -top-4 -left-4 z-20 glass-pill px-4.5 py-2.5 rounded-2xl shadow-lg border flex items-center gap-2 hover:scale-105 transition-all">
              <span className="p-1.5 rounded-lg bg-[#3674B5]/10 text-[#3674B5] flex items-center justify-center">
                <Plug className="w-4 h-4 fill-current" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#1E293B] transition-all">
                  {animationState === "connected" ? products[cycleIndex].tag1 : "Pro HDMI 2.1"}
                </h4>
                <p className="text-[10px] text-[#1E293B]/60">
                  {animationState === "connected" ? products[cycleIndex].tag1Desc : "8K Resolution"}
                </p>
              </div>
            </div>

            <div className="absolute top-[45%] -right-6 z-20 glass-pill px-4.5 py-2.5 rounded-2xl shadow-lg border flex items-center gap-2 hover:scale-105 transition-all">
              <span className="p-1.5 rounded-lg bg-[#3674B5]/10 text-[#3674B5] flex items-center justify-center">
                <Monitor className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#1E293B] transition-all">
                  {animationState === "connected" ? products[cycleIndex].tag2 : "Docking Hub"}
                </h4>
                <p className="text-[10px] text-[#1E293B]/60">
                  {animationState === "connected" ? products[cycleIndex].tag2Desc : "10-in-1 output"}
                </p>
              </div>
            </div>

            <div className="absolute -bottom-4 left-[20%] z-20 glass-pill px-4.5 py-2.5 rounded-2xl shadow-lg border flex items-center gap-2 hover:scale-105 transition-all">
              <span className="p-1.5 rounded-lg bg-[#DEC89E]/20 text-[#DEC89E] flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#1E293B] transition-all">
                  {animationState === "connected" ? products[cycleIndex].tag3 : "CAT6 SFTP"}
                </h4>
                <p className="text-[10px] text-[#1E293B]/60">
                  {animationState === "connected" ? products[cycleIndex].tag3Desc : "10Gbps Speed"}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
