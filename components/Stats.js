"use client";

import React from "react";

export default function Stats() {
  const statsList = [
    { value: "50,000+", label: "Happy Customers", icon: "👥" },
    { value: "200+", label: "Products Available", icon: "📦" },
    { value: "4.9★", label: "Average Rating", icon: "⭐" },
    { value: "2 Year", label: "Warranty Provided", icon: "🛡️" }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto rounded-3xl bg-[#F3F4F6]/60 border border-[#1A1917]/5 p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center">
          {statsList.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center p-2 relative ${idx !== statsList.length - 1 ? "md:border-r border-[#1A1917]/10" : ""
                }`}
            >
              <div className="text-2xl mb-1.5">{stat.icon}</div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#1A1917] tracking-tight">
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#1A1917]/50 mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
