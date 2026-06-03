"use client";

import React from "react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: "⚡",
      title: "GaN Fast Charging Technology",
      description: "Next-gen Gallium Nitride semiconductors deliver up to 3x faster charging speeds in a 40% smaller footprint with significantly lower heat generation."
    },
    {
      icon: "🛡️",
      title: "Multi-layer Safety Protection",
      description: "Equipped with active real-time chip temperature sensors, input over-current shutdown, voltage stabilizers, and anti-static circuit protection."
    },
    {
      icon: "🚀",
      title: "48-Hour Pan-India Delivery",
      description: "Get your essential gear fast. Same-day dispatch with express air shipping to all metros and major Indian cities within 48 hours."
    },
    {
      icon: "↩️",
      title: "30-Day Easy Returns",
      description: "Shop with absolute peace of mind. Not completely satisfied? Enjoy hassle-free returns with direct doorstep pickup and instant refunds."
    },
    {
      icon: "✅",
      title: "BIS / CE Certified Products",
      description: "Tested and approved. Every single power source is certified by national and international safety commissions to meet absolute standards."
    },
    {
      icon: "🎧",
      title: "24/7 Dedicated Support",
      description: "Our customer success squad is always online. Contact us via WhatsApp or email for instant hardware advice, setup, and troubleshooting."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F3F4F6]/20">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8C9985]/10 border border-[#8C9985]/20">
            <span className="text-[10px] font-extrabold text-[#8C9985] uppercase tracking-wider">
              Engineering Excellence
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1A1917] tracking-tight">
            Built Different. Built Better.
          </h2>
          <p className="text-sm font-semibold text-[#1A1917]/50">
            We merge premium material engineering with smart electrical design to power your lifestyle seamlessly.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="group rounded-3xl bg-white border border-[#1A1917]/5 p-8 hover-lift transition-all"
            >
              {/* Icon Sphere */}
              <div className="w-12 h-12 rounded-2xl bg-[#F8F9FA] group-hover:bg-[#8C9985] group-hover:text-white flex items-center justify-center text-2xl transition-all duration-300">
                {feat.icon}
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-lg text-[#1A1917] mt-6 transition-colors group-hover:text-[#C39281]">
                {feat.title}
              </h3>
              <p className="text-sm text-[#1A1917]/60 leading-relaxed mt-2.5 font-medium">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
