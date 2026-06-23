"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import {
  CreditCard,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  User,
  Lock,
  CheckCircle,
  AlertTriangle,
  X,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Percent,
  Truck,
  Check,
  Edit2
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchModal from "../../components/SearchModal";
import CartDrawer from "../../components/CartDrawer";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, coupon, discount, getSubtotal, clearCart, showToast } = useCart();

  // Steps control
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Contact, Step 2: Shipping, Step 3: Delivery, Step 4: Payment

  // Checkout flow states
  const [currentUser, setCurrentUser] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [shippingForm, setShippingForm] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India"
  });

  const [deliveryPref, setDeliveryPref] = useState("standard"); // "standard" or "express"
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card", "upi", "netbanking", "cod"

  // Card Inputs
  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  // UPI Input
  const [upiId, setUpiId] = useState("");

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState("sbi");

  // Payment Processing Simulation
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [paymentResult, setPaymentResult] = useState(null); // null, "success", "failure"
  const [createdOrder, setCreatedOrder] = useState(null);

  // Load user details and addresses
  useEffect(() => {
    const session = localStorage.getItem("ravtron_session");
    if (!session) {
      showToast("Please log in to checkout", "error");
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(session);
    setCurrentUser(parsedUser);
    setContactForm({
      name: parsedUser.name || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || ""
    });

    const savedAddress = localStorage.getItem("ravtron_address");
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        setShippingForm({
          street: parsedAddress.street || "",
          city: parsedAddress.city || "",
          state: parsedAddress.state || "",
          zip: parsedAddress.zip || "",
          country: parsedAddress.country || "India"
        });
      } catch (e) {
        console.error("Failed to parse address data", e);
      }
    }
  }, []);

  // Validation functions for each step
  const validateStep1 = () => {
    if (!contactForm.name.trim()) {
      showToast("Please enter your name.", "error");
      return false;
    }
    if (!contactForm.email.trim() || !contactForm.email.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return false;
    }
    // Minimal phone number digits check
    const digits = contactForm.phone.replace(/\D/g, "");
    if (!contactForm.phone.trim() || digits.length < 10) {
      showToast("Please enter a valid 10-digit phone number.", "error");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!shippingForm.street.trim()) {
      showToast("Please enter your street address.", "error");
      return false;
    }
    if (!shippingForm.city.trim()) {
      showToast("Please enter your city.", "error");
      return false;
    }
    if (!shippingForm.state.trim()) {
      showToast("Please enter your state.", "error");
      return false;
    }
    const pinDigits = shippingForm.zip.replace(/\D/g, "");
    if (!shippingForm.zip.trim() || pinDigits.length < 5) {
      showToast("Please enter a valid postal code.", "error");
      return false;
    }
    return true;
  };

  // Step Navigations
  const handleContinueToShipping = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleContinueToDelivery = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    setCurrentStep(4);
  };

  // Form Input Helpers
  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    let val = e.target.value;
    if (e.target.name === "number") {
      val = val.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim();
      if (val.length > 19) return;
    }
    if (e.target.name === "expiry") {
      val = val.replace(/\D/g, "");
      if (val.length > 2) {
        val = val.substring(0, 2) + "/" + val.substring(2, 4);
      }
      if (val.length > 5) return;
    }
    if (e.target.name === "cvv") {
      val = val.replace(/\D/g, "");
      if (val.length > 3) return;
    }
    setCardForm({ ...cardForm, [e.target.name]: val });
  };

  // Pricing calculations
  const subtotal = getSubtotal();
  const deliveryCharge = deliveryPref === "express" ? 199 : subtotal > 999 ? 0 : 99;
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxAmount = Math.round(taxableAmount * 0.18); // 18% GST
  const grandTotal = taxableAmount + deliveryCharge + taxAmount;

  // Simulated gateway messages sequence
  const processingMessages = [
    "Securing 256-bit encrypted gateway tunnel...",
    "Authenticating transaction token credentials...",
    "Awaiting secure authorization from bank...",
    "Finalizing processing approvals..."
  ];

  // Start Payment Processing Modal
  const handleFinalSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast("Your cart is empty. Add products to proceed.", "error");
      return;
    }

    // Double check all step validations
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }

    if (paymentMethod === "card") {
      if (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv) {
        showToast("Please fill out all card fields.", "error");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId.includes("@")) {
        showToast("Please enter a valid UPI ID (e.g. username@upi).", "error");
        return;
      }
    }

    // Trigger loader
    setIsProcessing(true);
    setProcessingStep(0);
    setPaymentResult(null);
  };

  // Cycle through simulation processing steps
  useEffect(() => {
    if (!isProcessing || paymentResult !== null) return;

    if (processingStep < processingMessages.length - 1) {
      const timer = setTimeout(() => {
        setProcessingStep(prev => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, processingStep, paymentResult]);

  const simulatePaymentSuccess = () => {
    const orderId = "RVT-" + Math.floor(10000 + Math.random() * 90000) + "-IN";

    // Save address locally to pre-populate next checkouts
    localStorage.setItem("ravtron_address", JSON.stringify(shippingForm));

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
      status: "Order Placed",
      statusColor: "text-amber-500 bg-amber-50",
      total: grandTotal,
      savings: discount,
      coupon: coupon || "",
      customerName: contactForm.name,
      customerEmail: contactForm.email,
      customerPhone: contactForm.phone,
      shippingAddress: shippingForm,
      deliveryPref: deliveryPref,
      paymentMethod: paymentMethod.toUpperCase(),
      items: cart.map(item => ({
        productId: item.id,
        selectedSize: item.selectedSize || null,
        name: item.selectedSize ? `${item.name} (${item.selectedSize})` : item.name,
        image: item.image,
        price: item.price,
        qty: item.quantity
      })),
      trackingSteps: [
        { title: "Order Placed", date: new Date().toLocaleString(), done: true },
        { title: "Packed & Verified", date: "Pending", done: false },
        { title: "Shipped", date: "Pending", done: false },
        { title: "In Transit", date: "Pending", done: false },
        { title: "Delivered", date: "Pending", done: false }
      ]
    };

    // POST order to MongoDB API
    fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newOrder)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save order to database");
        return res.json();
      })
      .then((data) => {
        setCreatedOrder(newOrder);
        setPaymentResult("success");
        clearCart();
        showToast("Payment Successful! Order Confirmed.", "success");
      })
      .catch((err) => {
        console.error("Order database error:", err);
        showToast("Failed to secure order details in database", "error");
      });
  };

  const simulatePaymentFailure = () => {
    setPaymentResult("failure");
    showToast("Payment Failed. Please verify credentials.", "error");
  };

  const cancelPayment = () => {
    setIsProcessing(false);
    setPaymentResult(null);
    setProcessingStep(0);
    showToast("Transaction cancelled by user.", "info");
  };

  const resetFailureState = () => {
    setPaymentResult(null);
    setIsProcessing(false);
    setProcessingStep(0);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-bg-brand flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        Loading Secure Checkout tunnel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-brand text-text-brand antialiased selection:bg-[#3674B5] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 pt-6 pb-24 relative z-10 w-full flex-grow">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <button onClick={() => router.push("/shop")} className="hover:text-[#3674B5] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shop</span>
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1E293B] font-bold">Checkout</span>
        </div>

        {paymentResult === "success" && createdOrder ? (
          /* Success Screen */
          <div className="max-w-2xl mx-auto bg-white border border-[#1E293B]/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center space-y-8 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1E293B] tracking-tight">Order Confirmed!</h2>
              <p className="text-sm font-semibold text-slate-600 max-w-md mx-auto">
                Thank you for your purchase. Your payment was verified securely, and your order has been registered in the dashboard queue.
              </p>
            </div>

            <div className="bg-[#F8F9FA] rounded-2xl border border-[#1E293B]/5 p-6 text-left space-y-4 max-w-lg mx-auto">
              <div className="flex justify-between items-center text-xs border-b border-[#1E293B]/5 pb-3 font-semibold text-[#1E293B]">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Order ID</p>
                  <p className="font-black text-[#3674B5] text-sm mt-0.5">{createdOrder.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Date</p>
                  <p className="font-bold mt-0.5">{createdOrder.date}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Delivery Details</p>
                <div className="text-xs font-semibold text-slate-700 space-y-1">
                  <p className="font-bold text-[#1E293B]">{createdOrder.customerName}</p>
                  <p>{createdOrder.shippingAddress.street}</p>
                  <p>{createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.state} - {createdOrder.shippingAddress.zip}</p>
                  <p className="text-[#3674B5] font-bold mt-2">
                    Method: {createdOrder.deliveryPref === "express" ? "Express Priority (1-2 Days)" : "Standard Shipping (3-5 Days)"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#1E293B]/5 text-xs font-bold text-[#1E293B]">
                <span className="text-[#1E293B]/40 uppercase tracking-wider text-[10px]">Total Paid</span>
                <span className="font-black text-sm text-[#3674B5]">₹{createdOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 max-w-sm mx-auto">
              <button
                onClick={() => router.push("/profile")}
                className="w-full py-3.5 rounded-xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-[#3674B5]/10"
              >
                Track in Dashboard
              </button>
              <button
                onClick={() => router.push("/shop")}
                className="w-full py-3.5 rounded-xl border border-[#1E293B]/10 hover:bg-slate-50 text-xs font-extrabold uppercase tracking-wider text-[#1E293B]/70 hover:text-[#1E293B] transition-all bg-white"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Forms Column */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Steps Column */}
            <div className="lg:col-span-8 space-y-6">

              {/* STEP 1: CONTACT DETAILS */}
              <div className={`bg-white border rounded-3xl p-6 md:p-8 transition-all ${currentStep === 1
                  ? "border-[#3674B5] shadow-md"
                  : currentStep > 1
                    ? "border-[#1E293B]/10 opacity-95"
                    : "border-[#1E293B]/10 opacity-50"
                }`}>
                {/* Header Row */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]/5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-xs ${currentStep > 1
                        ? "bg-emerald-500 text-white"
                        : "bg-[#3674B5]/10 text-[#3674B5]"
                      }`}>
                      {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
                    </div>
                    <div>
                      <h3 className="font-display font-black text-base md:text-lg text-[#1E293B]">Contact Details</h3>
                      <p className="text-[10px] md:text-xs font-semibold text-[#1E293B]/40">For sending shipping tracker credentials and invoice receipts.</p>
                    </div>
                  </div>
                  {currentStep > 1 && (
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-[#3674B5] hover:text-[#578FCA] text-xs font-extrabold flex items-center gap-1 hover:underline"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {/* Collapsed summary when completed */}
                {currentStep > 1 ? (
                  <div className="text-xs font-semibold text-slate-700 grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-0.5">Name</span>
                      <span className="font-black text-[#1E293B]">{contactForm.name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-0.5">Email</span>
                      <span className="font-black text-[#1E293B]">{contactForm.email}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-0.5">Phone</span>
                      <span className="font-black text-[#1E293B]">{contactForm.phone}</span>
                    </div>
                  </div>
                ) : (
                  /* Expanded Inputs Form */
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 w-4 h-4 text-[#1E293B]/30" />
                          <input
                            type="text"
                            required
                            name="name"
                            placeholder="Your full name"
                            className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl pl-11 pr-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-slate-400 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                            value={contactForm.name}
                            onChange={handleContactChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#1E293B]/30" />
                          <input
                            type="email"
                            required
                            name="email"
                            placeholder="name@company.com"
                            className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl pl-11 pr-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-slate-400 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                            value={contactForm.email}
                            onChange={handleContactChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-3.5 w-4 h-4 text-[#1E293B]/30" />
                          <input
                            type="tel"
                            required
                            name="phone"
                            placeholder="10-digit number"
                            className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl pl-11 pr-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-slate-400 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                            value={contactForm.phone}
                            onChange={handleContactChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleContinueToShipping}
                        className="px-6 py-3 rounded-xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Continue to Shipping</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 2: SHIPPING ADDRESS */}
              <div className={`bg-white border rounded-3xl p-6 md:p-8 transition-all ${currentStep === 2
                  ? "border-[#3674B5] shadow-md"
                  : currentStep > 2
                    ? "border-[#1E293B]/10 opacity-95"
                    : "border-[#1E293B]/10 opacity-50"
                }`}>
                {/* Header Row */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]/5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-xs ${currentStep > 2
                        ? "bg-emerald-500 text-white"
                        : "bg-[#3674B5]/10 text-[#3674B5]"
                      }`}>
                      {currentStep > 2 ? <Check className="w-4 h-4" /> : "2"}
                    </div>
                    <div>
                      <h3 className={`font-display font-black text-base md:text-lg text-[#1E293B] ${currentStep < 2 ? "text-slate-400" : ""}`}>Shipping Address</h3>
                      <p className="text-[10px] md:text-xs font-semibold text-slate-500">Specify physical destination coordinates for priority shipping dispatch.</p>
                    </div>
                  </div>
                  {currentStep > 2 && (
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-[#3674B5] hover:text-[#578FCA] text-xs font-extrabold flex items-center gap-1 hover:underline"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {/* Collapsed summary when completed */}
                {currentStep > 2 ? (
                  <div className="text-xs font-semibold text-slate-700 pt-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-0.5">Delivery Address</span>
                    <span className="font-black text-[#1E293B]">
                      {shippingForm.street}, {shippingForm.city}, {shippingForm.state} - {shippingForm.zip}, {shippingForm.country}
                    </span>
                  </div>
                ) : currentStep === 2 ? (
                  /* Expanded Inputs Form */
                  <div className="space-y-5">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Street Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-[#1E293B]/30" />
                          <input
                            type="text"
                            required
                            name="street"
                            placeholder="House No, Apartment, Suite, Street name"
                            className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl pl-11 pr-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-slate-400 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                            value={shippingForm.street}
                            onChange={handleShippingChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">City</label>
                          <input
                            type="text"
                            required
                            name="city"
                            placeholder="City"
                            className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl px-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-slate-400 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                            value={shippingForm.city}
                            onChange={handleShippingChange}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">State</label>
                          <input
                            type="text"
                            required
                            name="state"
                            placeholder="State"
                            className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl px-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-slate-400 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                            value={shippingForm.state}
                            onChange={handleShippingChange}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">ZIP / Postal Code</label>
                          <input
                            type="text"
                            required
                            name="zip"
                            placeholder="110001"
                            className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl px-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-slate-400 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                            value={shippingForm.zip}
                            onChange={handleShippingChange}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Country</label>
                          <input
                            type="text"
                            required
                            name="country"
                            className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl px-4 py-3.5 text-xs font-semibold text-[#1E293B] outline-none cursor-not-allowed opacity-80"
                            value={shippingForm.country}
                            disabled
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-xs font-extrabold text-slate-500 hover:text-[#1E293B] transition-all flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleContinueToDelivery}
                        className="px-6 py-3 rounded-xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Continue to Delivery</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* STEP 3: DELIVERY METHOD */}
              <div className={`bg-white border rounded-3xl p-6 md:p-8 transition-all ${currentStep === 3
                  ? "border-[#3674B5] shadow-md"
                  : currentStep > 3
                    ? "border-[#1E293B]/10 opacity-95"
                    : "border-[#1E293B]/10 opacity-50"
                }`}>
                {/* Header Row */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]/5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-xs ${currentStep > 3
                        ? "bg-emerald-500 text-white"
                        : "bg-[#3674B5]/10 text-[#3674B5]"
                      }`}>
                      {currentStep > 3 ? <Check className="w-4 h-4" /> : "3"}
                    </div>
                    <div>
                      <h3 className={`font-display font-black text-base md:text-lg text-[#1E293B] ${currentStep < 3 ? "text-slate-400" : ""}`}>Delivery Method</h3>
                      <p className="text-[10px] md:text-xs font-semibold text-slate-500">Select shipping velocity preferences.</p>
                    </div>
                  </div>
                  {currentStep > 3 && (
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="text-[#3674B5] hover:text-[#578FCA] text-xs font-extrabold flex items-center gap-1 hover:underline"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {/* Collapsed summary when completed */}
                {currentStep > 3 ? (
                  <div className="text-xs font-semibold text-slate-700 pt-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block mb-0.5">Shipping Speed</span>
                    <span className="font-black text-[#1E293B]">
                      {deliveryPref === "express" ? "Priority Express (1-2 Business Days · ₹199)" : "Standard Dispatch (3-5 Business Days · Free)"}
                    </span>
                  </div>
                ) : currentStep === 3 ? (
                  /* Expanded Inputs Form */
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Standard Option */}
                      <label className={`rounded-2xl border p-5 flex items-start gap-4 cursor-pointer transition-all ${deliveryPref === "standard"
                          ? "bg-[#3674B5]/5 border-[#3674B5] text-[#1E293B]"
                          : "bg-white border-[#1E293B]/15 hover:border-[#1E293B]/30 text-[#1E293B]/70"
                        }`}>
                        <input
                          type="radio"
                          name="delivery"
                          value="standard"
                          checked={deliveryPref === "standard"}
                          onChange={() => setDeliveryPref("standard")}
                          className="mt-1 text-[#3674B5] focus:ring-[#3674B5]"
                        />
                        <div className="space-y-1.5 text-xs font-semibold">
                          <div className="flex justify-between items-center gap-2">
                            <span className="font-black text-[#1E293B]">Standard Dispatch</span>
                            <span className="text-[#3674B5] font-black uppercase text-[10px]">
                              {subtotal > 999 ? "Free" : "₹99"}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">3 to 5 business days estimation. Perfect for general orders.</p>
                        </div>
                      </label>

                      {/* Express Option */}
                      <label className={`rounded-2xl border p-5 flex items-start gap-4 cursor-pointer transition-all ${deliveryPref === "express"
                          ? "bg-[#3674B5]/5 border-[#3674B5] text-[#1E293B]"
                          : "bg-white border-[#1E293B]/15 hover:border-[#1E293B]/30 text-[#1E293B]/70"
                        }`}>
                        <input
                          type="radio"
                          name="delivery"
                          value="express"
                          checked={deliveryPref === "express"}
                          onChange={() => setDeliveryPref("express")}
                          className="mt-1 text-[#3674B5] focus:ring-[#3674B5]"
                        />
                        <div className="space-y-1.5 text-xs font-semibold">
                          <div className="flex justify-between items-center gap-2">
                            <span className="font-black text-[#1E293B]">Priority Express</span>
                            <span className="text-[#3674B5] font-black text-[10px]">₹199</span>
                          </div>
                          <p className="text-[10px] text-slate-500">Guaranteed dispatch in 24 hours. Express air shipping (1-2 business days).</p>
                        </div>
                      </label>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs font-extrabold text-slate-500 hover:text-[#1E293B] transition-all flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleContinueToPayment}
                        className="px-6 py-3 rounded-xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Continue to Payment</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* STEP 4: PAYMENT INFORMATION */}
              <div className={`bg-white border rounded-3xl p-6 md:p-8 transition-all ${currentStep === 4
                  ? "border-[#3674B5] shadow-md"
                  : "border-[#1E293B]/10 opacity-50"
                }`}>
                {/* Header Row */}
                <div className="flex items-center gap-3 pb-4 border-b border-[#1E293B]/5 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#3674B5]/10 text-[#3674B5] flex items-center justify-center font-display font-black text-xs">4</div>
                  <div>
                    <h3 className={`font-display font-black text-base md:text-lg text-[#1E293B] ${currentStep < 4 ? "text-slate-400" : ""}`}>Payment Information</h3>
                    <p className="text-[10px] md:text-xs font-semibold text-slate-500">Choose from secure banking or Cash on Delivery channels.</p>
                  </div>
                </div>

                {currentStep === 4 ? (
                  /* Expanded Inputs Form */
                  <div className="space-y-6">
                    {/* Horizontal Payment Selectors */}
                    <div className="grid grid-cols-4 gap-2 border-b border-[#1E293B]/5 pb-4">
                      {[
                        { id: "card", label: "Card", desc: "Credit / Debit" },
                        { id: "upi", label: "UPI", desc: "Instant Pay" },
                        { id: "netbanking", label: "Banking", desc: "Net Banking" },
                        { id: "cod", label: "COD", desc: "Pay on Arrival" }
                      ].map((pay) => (
                        <button
                          key={pay.id}
                          type="button"
                          onClick={() => setPaymentMethod(pay.id)}
                          className={`px-2.5 py-3 rounded-xl border transition-all text-center flex flex-col justify-center items-center gap-0.5 ${paymentMethod === pay.id
                              ? "bg-[#3674B5] text-white border-[#3674B5]"
                              : "bg-[#F8F9FA] text-slate-700 border-[#1E293B]/10 hover:border-[#1E293B]/25 hover:bg-slate-50"
                            }`}
                        >
                          <span className="text-xs font-bold">{pay.label}</span>
                          <span className={`text-[8px] font-semibold ${paymentMethod === pay.id ? "text-white/80" : "text-slate-500"}`}>{pay.desc}</span>
                        </button>
                      ))}
                    </div>

                    {/* Conditional Fields */}
                    <div className="pt-2 animate-fade-in-up">
                      {paymentMethod === "card" && (
                        <div className="space-y-4 max-w-md text-left">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Card Number</label>
                            <div className="relative">
                              <CreditCard className="absolute left-4 top-3.5 w-4 h-4 text-[#1E293B]/30" />
                              <input
                                type="text"
                                name="number"
                                placeholder="0000 0000 0000 0000"
                                className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl pl-11 pr-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-slate-400 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                                value={cardForm.number}
                                onChange={handleCardChange}
                                required={paymentMethod === "card"}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Cardholder Name</label>
                            <input
                              type="text"
                              name="name"
                              placeholder="AS WRITTEN ON CARD"
                              className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl px-4 py-3.5 text-xs font-semibold text-[#1E293B] uppercase placeholder-slate-400 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                              value={cardForm.name}
                              onChange={handleCardChange}
                              required={paymentMethod === "card"}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Expiry (MM/YY)</label>
                              <input
                                type="text"
                                name="expiry"
                                placeholder="MM/YY"
                                className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl px-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-slate-400 outline-none focus:bg-white focus:border-[#3674B5] transition-all text-center"
                                value={cardForm.expiry}
                                onChange={handleCardChange}
                                required={paymentMethod === "card"}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Security CVV</label>
                              <input
                                type="password"
                                name="cvv"
                                placeholder="···"
                                className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl px-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-slate-400 outline-none focus:bg-white focus:border-[#3674B5] transition-all text-center"
                                value={cardForm.cvv}
                                onChange={handleCardChange}
                                required={paymentMethod === "card"}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "upi" && (
                        <div className="space-y-4 text-left max-w-md">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Virtual Payment Address (UPI ID)</label>
                            <input
                              type="text"
                              placeholder="e.g. mobile@ybl, name@oksbi"
                              className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl px-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-slate-400 outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              required={paymentMethod === "upi"}
                            />
                            <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                              A checkout verification request will be dispatched to your selected UPI mobile app upon confirmation.
                            </p>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "netbanking" && (
                        <div className="space-y-4 text-left max-w-md">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Choose Bank</label>
                            <select
                              className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-xl px-4 py-3.5 text-xs font-semibold text-[#1E293B] outline-none focus:bg-white focus:border-[#3674B5] transition-all"
                              value={selectedBank}
                              onChange={(e) => setSelectedBank(e.target.value)}
                            >
                              <option value="sbi">State Bank of India</option>
                              <option value="hdfc">HDFC Bank</option>
                              <option value="icici">ICICI Bank</option>
                              <option value="axis">Axis Bank</option>
                              <option value="kotak">Kotak Mahindra Bank</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "cod" && (
                        <div className="bg-[#1E293B]/5 border border-[#1E293B]/10 rounded-2xl p-4 max-w-lg space-y-1.5 text-left">
                          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            <span>Cash on Delivery active</span>
                          </div>
                          <p className="text-[10px] text-slate-700 font-semibold leading-relaxed">
                            An additional safety verify check will be conducted by dispatch courier agents upon physical packet delivery. Please ensure correct payable sum is available on delivery day.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-[#1E293B]/5">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="text-xs font-extrabold text-slate-500 hover:text-[#1E293B] transition-all flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleFinalSubmit}
                        className="px-6 py-3 rounded-xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Confirm & Pay</span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

            </div>

            {/* Right Sticky Order Summary Column */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">

              <div className="bg-white border border-[#1E293B]/10 rounded-3xl p-6 shadow-xs space-y-6">
                <div className="border-b border-[#1E293B]/5 pb-4">
                  <h3 className="font-display font-black text-base text-[#1E293B]">Order Summary</h3>
                </div>

                {/* Items loop */}
                <div className="space-y-4 max-h-60 overflow-y-auto pr-1 text-left">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-xs font-semibold text-[#1E293B]">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-[#1E293B]/5 p-0.5 flex-shrink-0 flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-black text-[11px] leading-tight text-[#1E293B] truncate">{item.name}</h4>
                          <p className="text-[9px] text-slate-500 font-bold mt-0.5">Qty: {item.quantity}{item.selectedSize ? ` · Size: ${item.selectedSize}` : ''} · ₹{item.price.toLocaleString()}</p>
                        </div>
                        <span className="font-black text-[#1E293B]/90 pl-1">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 font-semibold text-center py-4">No products in cart.</p>
                  )}
                </div>

                {/* Calculative Summary List */}
                <div className="border-t border-[#1E293B]/5 pt-4 space-y-3.5 text-xs font-semibold text-slate-700 text-left">
                  <div className="flex justify-between items-center">
                    <span>Cart Subtotal</span>
                    <span className="font-bold text-[#1E293B]">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center text-[#3674B5]">
                      <span className="flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5" />
                        <span>Promo Code Applied</span>
                      </span>
                      <span className="font-bold">– ₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      <span>Delivery Cost</span>
                    </span>
                    <span className="font-bold text-[#1E293B]">
                      {deliveryCharge === 0 ? (
                        <span className="text-[#3674B5] font-black uppercase text-[10px]">Free</span>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Estimated Tax (18% GST)</span>
                    <span className="font-bold text-[#1E293B]">₹{taxAmount.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-[#1E293B]/5 pt-4 flex justify-between items-center text-sm font-bold text-[#1E293B]">
                    <span>Final Amount</span>
                    <span className="text-[#3674B5] font-black text-base">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-[#1E293B]/5 pt-4 flex items-start gap-2.5 text-left">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                    Transactions are secured using a simulated 256-bit bank connection. Powerhub stores no plain credit credentials on files.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Simulated Secure Payment gateway Loader Overlay */}
      {isProcessing && paymentResult === null && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-[#1E293B]/10 p-8 shadow-2xl relative text-center space-y-6 animate-fade-in-up">

            <button
              onClick={cancelPayment}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-[#1E293B]/60"
              title="Cancel Transaction"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Spinner indicator */}
            <div className="w-16 h-16 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/20 flex items-center justify-center mx-auto text-[#3674B5]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-black text-lg text-[#1E293B]">Secure Gateway Tunnel</h3>
              <p className="text-xs font-semibold text-[#3674B5] tracking-wider uppercase">Simulated Payment Processing</p>
            </div>

            {/* Steps text animation */}
            <div className="h-10 flex items-center justify-center">
              <p className="text-xs font-bold text-[#1E293B]/60 transition-all duration-300">
                {processingMessages[processingStep]}
              </p>
            </div>

            <div className="w-full bg-[#1E293B]/5 rounded-full h-1">
              <div
                className="bg-[#3674B5] h-1 rounded-full transition-all duration-500"
                style={{ width: `${((processingStep + 1) / processingMessages.length) * 100}%` }}
              />
            </div>

            {/* Developer Simulation controls panel */}
            <div className="border-t border-[#1E293B]/10 pt-5 space-y-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gateway Simulation Panel</p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={simulatePaymentSuccess}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Simulate Success
                </button>
                <button
                  onClick={simulatePaymentFailure}
                  className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Simulate Failure
                </button>
              </div>

              <button
                onClick={cancelPayment}
                className="w-full py-2.5 rounded-xl border border-[#1E293B]/10 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
              >
                Cancel Processing (Return)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Simulated Payment Gateway Failure Dialog Overlay */}
      {isProcessing && paymentResult === "failure" && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-rose-500/20 p-8 shadow-2xl text-center space-y-6 animate-fade-in-up">

            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
              <X className="w-8 h-8 font-black" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-black text-lg text-rose-800">Transaction Declined</h3>
              <p className="text-xs font-bold text-rose-600 tracking-wider uppercase">Payment Simulation Failure</p>
            </div>

            <p className="text-xs font-semibold text-[#1E293B]/60 leading-relaxed max-w-xs mx-auto">
              Your simulated bank declined the payment query. This could occur due to insufficient mock balance, invalid CVV code, or request timeout.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={simulatePaymentSuccess}
                className="w-full py-3 rounded-xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all"
              >
                Override & Force Success
              </button>
              <button
                onClick={resetFailureState}
                className="w-full py-3 rounded-xl border border-rose-500/20 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-extrabold uppercase tracking-wider transition-all"
              >
                Modify Payment Method
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
      <SearchModal />
      <CartDrawer />
    </div>
  );
}
