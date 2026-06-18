"use client";

import React, { useState, useEffect, useRef } from "react";
import { Users, Package, Star, Shield } from "lucide-react";

export default function Stats() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const statsList = [
    { target: 50000, label: "Happy Customers", icon: Users, format: (v) => `${Math.floor(v).toLocaleString()}+` },
    { target: 200, label: "Products Available", icon: Package, format: (v) => `${Math.floor(v)}+` },
    { target: 4.9, label: "Average Rating", icon: Star, format: (v) => `${v.toFixed(1)}` },
    { target: 2, label: "Warranty Provided", icon: Shield, format: (v) => `${Math.round(v)} Year` }
  ];

  const [counts, setCounts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) {
      setCounts([0, 0, 0, 0]);
      return;
    }

    let start = null;
    const duration = 1500; // 1.5 seconds animation duration
    let animationFrameId;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easedProgress = progress * (2 - progress);
      
      setCounts(statsList.map((stat) => stat.target * easedProgress));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [visible]);

  return (
    <section ref={sectionRef} className="px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      <div className="max-w-7xl mx-auto rounded-3xl bg-[#F8F9FA]/60 border border-[#1E293B]/10 p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center">
          {statsList.map((stat, idx) => {
            const IconComponent = stat.icon;
            const displayValue = stat.format(counts[idx]);
            
            return (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center p-2 relative ${idx !== statsList.length - 1 ? "md:border-r border-[#1E293B]/15" : ""
                  }`}
              >
                <div className="mb-2 text-[#3674B5]">
                  <IconComponent className={`w-6 h-6 ${stat.label === "Average Rating" ? "fill-amber-400 text-amber-400" : "text-[#3674B5]"}`} />
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#1E293B] tracking-tight">
                  {displayValue}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#1E293B]/50 mt-0.5">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
