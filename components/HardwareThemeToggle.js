"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function HardwareThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sparks, setSparks] = useState([]);
  const [pulseRings, setPulseRings] = useState([]);

  // Framer Motion values for tracking plug positions
  const plugX = useMotionValue(0);
  const plugY = useMotionValue(65);
  const plugRotate = useMotionValue(0);

  // Initialize theme on client mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("ravtron_theme");
    
    // Default is dark mode. We only set light-mode if specifically saved as 'light'
    const isLight = savedTheme === "light";
    setIsConnected(isLight);

    if (isLight) {
      document.documentElement.classList.add("light-mode");
      plugY.set(16);
      plugX.set(0);
      plugRotate.set(0);
    } else {
      document.documentElement.classList.remove("light-mode");
      plugY.set(65);
      // Start gentle idle sway
      const animX = animate(plugX, [-0.8, 0.8, -0.8], {
        repeat: Infinity,
        duration: 5,
        ease: "easeInOut"
      });
      const animRot = animate(plugRotate, [-2, 2, -2], {
        repeat: Infinity,
        duration: 5,
        ease: "easeInOut"
      });
      return () => {
        animX.stop();
        animRot.stop();
      };
    }
  }, []);

  // Animate connection/disconnection
  const toggleConnection = () => {
    if (isConnecting) return;

    if (isConnected) {
      // Disconnect: turn dark immediately, pull plug down
      document.documentElement.classList.remove("light-mode");
      localStorage.setItem("ravtron_theme", "dark");
      window.dispatchEvent(new Event("ravtron_theme_change"));
      setIsConnected(false);

      const animY = animate(plugY, 65, {
        type: "spring",
        stiffness: 160,
        damping: 18,
        onComplete: () => {
          // Restart sway
          animate(plugX, [-0.8, 0.8, -0.8], {
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut"
          });
          animate(plugRotate, [-2, 2, -2], {
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut"
          });
        }
      });
    } else {
      // Connect: slide up to snap point, then transition theme on snap
      setIsConnecting(true);
      
      // Stop any active sway
      plugX.set(0);
      plugRotate.set(0);

      animate(plugY, 16, {
        type: "spring",
        stiffness: 350,
        damping: 22,
        onComplete: () => {
          setIsConnected(true);
          setIsConnecting(false);
          
          // Trigger spark and pulse effects
          triggerEffects();

          // Set theme
          document.documentElement.classList.add("light-mode");
          localStorage.setItem("ravtron_theme", "light");
          window.dispatchEvent(new Event("ravtron_theme_change"));
        }
      });
    }
  };

  const triggerEffects = () => {
    // Spark particles
    const newSparks = Array.from({ length: 16 }).map((_, i) => {
      const angle = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const speed = 3.0 + Math.random() * 4.0;
      return {
        id: Math.random(),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.7,
        size: 1.0 + Math.random() * 2.0,
        color: i % 2 === 0 ? "#FFD700" : "#00E5FF" // Gold & Cyber Cyan sparks
      };
    });
    setSparks(newSparks);

    // Pulse rings
    setPulseRings([
      { id: 1, delay: 0 },
      { id: 2, delay: 0.12 },
      { id: 3, delay: 0.24 }
    ]);
  };

  // Clear sparks/rings after animations finish
  useEffect(() => {
    if (sparks.length > 0) {
      const timer = setTimeout(() => setSparks([]), 800);
      return () => clearTimeout(timer);
    }
  }, [sparks]);

  useEffect(() => {
    if (pulseRings.length > 0) {
      const timer = setTimeout(() => setPulseRings([]), 1100);
      return () => clearTimeout(timer);
    }
  }, [pulseRings]);

  // Compute Bezier path for flexible cable
  const cablePathD = useTransform(
    [plugX, plugY, plugRotate],
    ([x, y, r]) => {
      const ax = 11; // Cable anchor point X inside navbar
      const ay = 12; // Cable anchor point Y
      
      const px = 30 + x; // Current plug X
      const py = y + 32; // Bottom of plug rubber sleeve

      // Control points depend on connection state to simulate realistic wire tension
      const isPluggedIn = y < 35;
      
      // Slack loops down lower when connected since plug is high
      const loopY = isPluggedIn ? 85 : y + 15;
      
      // Control points for a perfect sleek curve
      const cp1x = ax - 11;
      const cp1y = loopY;
      
      const cp2x = px - 9;
      const cp2y = loopY + 4;

      return `M ${ax} ${ay} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${px} ${py}`;
    }
  );

  if (!mounted) {
    // Render static placeholder during SSR to prevent layout shifting
    return (
      <div className="relative w-[60px] h-[50px] flex items-center justify-center select-none opacity-40">
        <svg width="60" height="110" viewBox="0 0 60 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-[-10px] left-0 pointer-events-none overflow-visible">
          <rect x="18" y="10" width="24" height="10" rx="3" fill="#1E293B" />
        </svg>
      </div>
    );
  }

  return (
    <div 
      className="relative w-[60px] h-[50px] flex items-center justify-center select-none group cursor-pointer"
      onClick={toggleConnection}
      title={isConnected ? "Disconnect for Dark Mode" : "Connect for Light Mode"}
    >
      <svg
        width="60"
        height="110"
        viewBox="0 0 60 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-[-10px] left-0 overflow-visible pointer-events-none"
      >
        <defs>
          {/* CNC-cut Bezel Metallic Gradient */}
          <linearGradient id="socketBezel" x1="16" y1="9" x2="44" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="25%" stopColor="#64748B" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="75%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Anodized Titanium/Gunmetal Plug Body Gradient */}
          <linearGradient id="plugBody" x1="22" y1="2" x2="38" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="30%" stopColor="#64748B" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="70%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* High-end Gold Plating */}
          <linearGradient id="goldPins" x1="23" y1="-5" x2="37" y2="2" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="30%" stopColor="#FBBF24" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Premium Braided Pattern Overlay */}
          <pattern id="cableBraid" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="1.5" height="3" fill="rgba(255,255,255,0.12)" />
            <rect x="1.5" width="1.5" height="3" fill="rgba(0,0,0,0.35)" />
          </pattern>
        </defs>

        {/* 1. Connection Glow behind the socket */}
        {isConnected && (
          <circle cx="30" cy="15" r="16" fill="#00E5FF" opacity="0.15" style={{ filter: "blur(6px)" }} />
        )}

        {/* 2. Cable Anchor Bracket */}
        <circle cx="11" cy="12" r="3" fill="#0F172A" stroke="#475569" strokeWidth="0.5" />

        {/* 3. Sleek Cable Shadow */}
        <motion.path
          d={cablePathD}
          stroke="rgba(0, 0, 0, 0.45)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          style={{ filter: "blur(2.5px)" }}
          transform="translate(1, 1.5)"
        />

        {/* 4. Sleek Braided Cable Body */}
        <motion.path
          d={cablePathD}
          stroke={isConnected ? "#334155" : "#1E293B"}
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* 5. Braided Pattern Overlay */}
        <motion.path
          d={cablePathD}
          stroke="url(#cableBraid)"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* 6. Socket Enclosure (Inner Bezel cutout details) */}
        <rect
          x="15"
          y="9"
          width="30"
          height="11"
          rx="3.5"
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="0.5"
        />

        {/* Female Socket Bezel */}
        <rect
          x="16"
          y="10"
          width="28"
          height="9"
          rx="2.5"
          fill="url(#socketBezel)"
          stroke={isConnected ? "rgba(0,229,255,0.4)" : "rgba(255,255,255,0.12)"}
          strokeWidth="0.75"
          style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))" }}
        />
        
        {/* Socket Recess */}
        <rect x="18.5" y="12" width="23" height="5" rx="1.2" fill="#020617" />

        {/* Delicate Golden Inner Pins */}
        <line x1="22" y1="13" x2="22" y2="16" stroke="#D97706" strokeWidth="0.6" opacity="0.8" />
        <line x1="25" y1="13" x2="25" y2="16" stroke="#D97706" strokeWidth="0.6" opacity="0.8" />
        <line x1="28" y1="13" x2="28" y2="16" stroke="#D97706" strokeWidth="0.6" opacity="0.8" />
        <line x1="31" y1="13" x2="31" y2="16" stroke="#D97706" strokeWidth="0.6" opacity="0.8" />
        <line x1="34" y1="13" x2="34" y2="16" stroke="#D97706" strokeWidth="0.6" opacity="0.8" />
        <line x1="38" y1="13" x2="38" y2="16" stroke="#D97706" strokeWidth="0.6" opacity="0.8" />

        {/* Sleek Subminiature Status LED */}
        <circle 
          cx="10.5" 
          cy="14.5" 
          r="1.2" 
          fill={isConnected ? "#00E5FF" : "#F43F5E"} 
          style={{ 
            filter: isConnected 
              ? "drop-shadow(0 0 2.5px #00E5FF) drop-shadow(0 0 0.5px #00E5FF)" 
              : "drop-shadow(0 0 1.5px #F43F5E)" 
          }} 
        />

        {/* 7. Male Plug Group (Sleeker & More Elongated Shape) */}
        <motion.g
          style={{
            x: plugX,
            y: plugY,
            rotate: plugRotate,
            originX: "30px",
            originY: "16px"
          }}
          className="pointer-events-auto"
        >
          {/* Gold Male Pin Shield */}
          <rect
            x="23.5"
            y="-5"
            width="13"
            height="7"
            rx="1.2"
            fill="url(#goldPins)"
            stroke="#92400E"
            strokeWidth="0.5"
          />
          {/* Pin center dividing lines */}
          <line x1="26" y1="-1.5" x2="34" y2="-1.5" stroke="#78350F" strokeWidth="0.5" opacity="0.6" />

          {/* Anodized Metal Plug Body */}
          <rect
            x="22"
            y="2"
            width="16"
            height="24"
            rx="3.5"
            fill="url(#plugBody)"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.5"
            style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.3))" }}
          />

          {/* Top Diamond-cut Highlight Ring */}
          <rect
            x="22.5"
            y="2.5"
            width="15"
            height="1.5"
            rx="1"
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="0.4"
          />

          {/* Glowing Status Strip (Flashed when connected) */}
          <motion.rect 
            x="25" 
            y="9" 
            width="10" 
            height="1.2" 
            rx="0.6" 
            fill={isConnected ? "#00E5FF" : "#475569"} 
            style={{ 
              filter: isConnected 
                ? "drop-shadow(0 0 3px #00E5FF) drop-shadow(0 0 0.5px #00E5FF)" 
                : "none" 
            }} 
            opacity={isConnected ? 0.95 : 0.4}
            transition={{ duration: 0.3 }}
          />

          {/* Laser Etched Logo text */}
          <text 
            x="30" 
            y="15.5" 
            fill={isConnected ? "rgba(255, 255, 255, 0.55)" : "rgba(255, 255, 255, 0.25)"} 
            fontSize="3.2" 
            fontWeight="bold" 
            textAnchor="middle" 
            letterSpacing="0.4"
            fontFamily="sans-serif"
            className="transition-colors duration-300"
          >
            RAVTRON
          </text>

          {/* Elegant Gold Accent Grip Band at bottom */}
          <rect x="22" y="19" width="16" height="1.8" fill="url(#goldPins)" />

          {/* Fine vertical rib grooves for grip below accent */}
          <line x1="25" y1="21.5" x2="25" y2="24.5" stroke="rgba(0,0,0,0.45)" strokeWidth="0.6" />
          <line x1="28" y1="21.5" x2="28" y2="24.5" stroke="rgba(0,0,0,0.45)" strokeWidth="0.6" />
          <line x1="32" y1="21.5" x2="32" y2="24.5" stroke="rgba(0,0,0,0.45)" strokeWidth="0.6" />
          <line x1="35" y1="21.5" x2="35" y2="24.5" stroke="rgba(0,0,0,0.45)" strokeWidth="0.6" />

          {/* High-fidelity Tapered Rubber Boot */}
          <path
            d="M 27.5 26 L 32.5 26 L 30.5 32 L 29.5 32 Z"
            fill="#0F172A"
            stroke="#1E293B"
            strokeWidth="0.4"
          />
          {/* Boot ribbed joints */}
          <line x1="28" y1="28" x2="32" y2="28" stroke="#334155" strokeWidth="0.6" />
          <line x1="28.5" y1="30" x2="31.5" y2="30" stroke="#334155" strokeWidth="0.6" />
        </motion.g>

        {/* 8. Glowing Pulse Rings */}
        {pulseRings.map((ring) => (
          <motion.circle
            key={ring.id}
            cx="30"
            cy="15"
            r="12"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="1.8"
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 3.8, opacity: 0 }}
            transition={{ duration: 0.95, ease: "easeOut", delay: ring.delay }}
          />
        ))}

        {/* 9. Particle Sparks */}
        {sparks.map((spark) => (
          <motion.circle
            key={spark.id}
            cx="30"
            cy="15"
            r={spark.size}
            fill={spark.color}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: spark.vx * 13,
              y: spark.vy * 13,
              opacity: 0,
              scale: 0.1
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 2px " + spark.color + ")" }}
          />
        ))}
      </svg>
    </div>
  );
}
