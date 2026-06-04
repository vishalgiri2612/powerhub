"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, Heart, Zap, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchModal from "../../components/SearchModal";
import CartDrawer from "../../components/CartDrawer";

export default function AboutPage() {
  const router = useRouter();

  const pillars = [
    {
      icon: <Heart className="w-5 h-5 text-[#3674B5]" />,
      title: "Customer Satisfaction",
      desc: "Prioritizing user experience and building reliable, long-term partnerships."
    },
    {
      icon: <Zap className="w-5 h-5 text-[#DEC89E]" />,
      title: "Innovation & Excellence",
      desc: "Pushing technological boundaries continuously to deliver cutting-edge solutions."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#3674B5]" />,
      title: "Empathy & Dedication",
      desc: "Understanding and addressing evolving customer needs with precision and care."
    }
  ];

  return (
    <div className="min-h-screen bg-bg-brand text-text-brand antialiased selection:bg-[#3674B5] selection:text-white">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pt-12 pb-24 relative z-10 space-y-24">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto border-b border-[#1E293B]/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
            <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
              About Our Brand
            </span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#1E293B] tracking-tight leading-tight">
            RAVTRON®
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#1E293B]/50 max-w-xl mx-auto leading-relaxed">
            Exploring Ways To Connectivity
          </p>
        </div>

        {/* Section 1: Brand Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#3674B5]" />
              <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                Corporate Profile
              </span>
            </div>
            
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1E293B] tracking-tight leading-tight">
              Seamless Connectivity for <span className="text-[#3674B5]">Enterprises & Smart Homes.</span>
            </h2>
            
            <p className="text-sm sm:text-base font-semibold text-[#1E293B]/60 leading-relaxed">
              RAVTRON® is a globally recognized OEM manufacturer specializing in IT, Mobility, Telecommunication, Networking, Multimedia, Surveillance, Security and Lifestyle Utility Products & Solutions. Established by KSG Automation Pvt Ltd (India), we are committed to delivering seamless connectivity, enhanced security, and cutting-edge technology to Enterprises, SMBs, and Smart Homes worldwide.
            </p>
            
            <p className="text-sm font-semibold text-[#1E293B]/50 leading-relaxed">
              With our headquarter in Gurugram, India, and strategic branches in China, Singapore, and the USA, RAVTRON® has rapidly emerged as a trusted industry leader, setting new standards in intelligent connectivity and mobility solutions.
            </p>
          </div>

          {/* Image Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[2.5rem] bg-white border border-[#1E293B]/10 p-4 shadow-xl hover-lift duration-500 overflow-hidden group">
              <img 
                src="/images/ravtron_networking.png" 
                alt="Ravtron IT & Networking Hardware Products"
                className="w-full h-auto rounded-[2rem] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

        </div>

        {/* Section 2: Innovation & Inception */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Image Column (First on desktop) */}
          <div className="lg:col-span-5 lg:order-1">
            <div className="relative rounded-[2.5rem] bg-white border border-[#1E293B]/10 p-4 shadow-xl hover-lift duration-500 overflow-hidden group">
              <img 
                src="/images/ravtron_utility_dev.png" 
                alt="Ravtron Smart Security & Lifestyle Utility Products"
                className="w-full h-auto rounded-[2rem] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5]" />
              <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                Driven by Innovation, Defined by Excellence
              </span>
            </div>
            
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1E293B] tracking-tight leading-tight">
              Shaping the Future <span className="text-[#3674B5]">of Hardware Evolution.</span>
            </h2>
            
            <p className="text-sm sm:text-base font-semibold text-[#1E293B]/60 leading-relaxed">
              Since our inception in 2016, RAVTRON® has been at the forefront of technological evolution, delivering high-performance, reliable, and cost-effective solutions. Our unwavering commitment to quality, innovation, and sustainability ensures that businesses and homes remain securely and efficiently connected in today’s dynamic digital landscape.
            </p>
            
            <p className="text-sm font-semibold text-[#1E293B]/50 leading-relaxed">
              Through relentless R&D, strategic collaborations, and a customer-first approach, we continue to redefine global connectivity, shaping the future with cutting-edge solutions that power progress.
            </p>
          </div>

        </div>

        {/* Section 3: Why Choose Us & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pt-8 border-t border-[#1E293B]/10">
          
          {/* Why Choose Us */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
              <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                Why Choose RAVTRON®?
              </span>
            </div>
            
            <h3 className="font-display font-black text-2xl sm:text-3xl text-[#1E293B] tracking-tight leading-tight">
              Redefining Connectivity with Innovation & Excellence
            </h3>
            
            <p className="text-sm font-semibold text-[#1E293B]/60 leading-relaxed">
              At RAVTRON®, we go beyond connectivity—we empower possibilities. Our commitment to uncompromising quality, technological advancement, and a global vision sets us apart. Our solutions are meticulously engineered to exceed international benchmarks, delivering seamless, secure, and high-performance networking for a smarter, more connected world.
            </p>
            
            <p className="text-sm font-semibold text-[#1E293B]/50 leading-relaxed">
              As a forward-thinking brand, we continuously integrate next-generation technologies to enhance efficiency, scalability, and user experience. Our sustainability-driven approach ensures that innovation not only fuels progress but also contributes to a greener, more responsible future.
            </p>
          </div>

          {/* Mission & Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="font-display font-black text-2xl text-[#1E293B] tracking-tight">
              Our Core Mission
            </h3>
            
            <p className="text-sm font-semibold text-[#1E293B]/60 leading-relaxed">
              At RAVTRON®, our mission is to create exceptional value through breakthrough innovations, sustainable technology, and an unwavering customer-centric approach. We strive to establish RAVTRON® as the global benchmark for intelligent connectivity, driven by:
            </p>

            <div className="space-y-4 pt-2">
              {pillars.map((pillar, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#1E293B]/10 shadow-3xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F8F9FA] border border-[#1E293B]/5 flex items-center justify-center flex-shrink-0">
                    {pillar.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#1E293B]">{pillar.title}</h4>
                    <p className="text-xs text-[#1E293B]/50 leading-relaxed font-semibold">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Section 4: Final CTA Banner */}
        <div className="relative rounded-[3rem] bg-[#3674B5] text-white p-8 sm:p-12 overflow-hidden shadow-xl text-center space-y-6">
          {/* Subtle decoration lines */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
          
          <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight max-w-3xl mx-auto leading-tight">
            At RAVTRON®, we don’t just connect devices—we empower possibilities.
          </h3>
          
          <p className="text-xs sm:text-sm text-white/80 font-bold max-w-lg mx-auto uppercase tracking-wider">
            Join us in shaping the future of intelligent connectivity & mobility.
          </p>

          <div className="pt-4">
            <button
              onClick={() => router.push("/shop")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-[#F8F9FA] text-[#3674B5] text-xs font-black transition-all duration-300 hover:scale-[1.03] active:scale-97 shadow-lg"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 text-[#3674B5]" />
            </button>
          </div>
        </div>

      </main>

      <Footer />
      <SearchModal />
      <CartDrawer />
    </div>
  );
}
