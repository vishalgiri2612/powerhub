"use client";

import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Browse & Pick Your Product",
      description: "Find the precise power capacity, charging wattage, and form factor engineered for your dynamic workspace."
    },
    {
      num: "02",
      title: "Add to Cart & Checkout Securely",
      description: "Complete your transaction with instant UPI, Razorpay, or credit card processing protected by bank-grade encryption."
    },
    {
      num: "03",
      title: "Fast Delivery to Your Door",
      description: "Unbox your device within 48 hours. Every delivery is packed with eco-conscious custom mailer cards."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C39281]/10 border border-[#C39281]/20">
            <span className="text-[10px] font-extrabold text-[#C39281] uppercase tracking-wider">
              Effortless Logistics
            </span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1A1917] tracking-tight">
            Order in 3 Simple Steps
          </h2>
          <p className="text-sm font-semibold text-[#1A1917]/50">
            Getting premium power has never been more straightforward or secure.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative">
          
          {/* Connector Line on Desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-[#1A1917]/10 z-0"></div>

          {steps.map((step) => (
            <div key={step.num} className="relative z-10 flex flex-col items-center text-center space-y-4">
              
              {/* Number Circle Badge */}
              <div className="w-20 h-20 rounded-full bg-[#F3F4F6] border border-white flex items-center justify-center shadow-sm">
                <span className="font-display font-black text-xl text-[#C39281]">
                  {step.num}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-lg text-[#1A1917] pt-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#1A1917]/60 leading-relaxed max-w-xs font-medium">
                {step.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
