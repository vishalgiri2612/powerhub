"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Bestsellers from "../components/Bestsellers";
import ShopSection from "../components/ShopSection";
import Categories from "../components/Categories";
import NewArrivals from "../components/NewArrivals";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import BrandTrust from "../components/BrandTrust";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import SearchModal from "../components/SearchModal";
import CartDrawer from "../components/CartDrawer";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-brand text-text-brand antialiased selection:bg-[#3674B5] selection:text-white">
      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Main Sections Body */}
      <main>
        <Hero />
        <Stats />
        <Bestsellers />
        <ShopSection />
        <Categories />
        <NewArrivals />
        <WhyChooseUs />
        <HowItWorks />
        <Testimonials />
        <BrandTrust />
        <Newsletter />
      </main>

      {/* Global Brand Footer */}
      <Footer />

      {/* State-Driven Overlay Panels */}
      <SearchModal />
      <CartDrawer />
    </div>
  );
}