"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchModal from "../../components/SearchModal";
import CartDrawer from "../../components/CartDrawer";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password Strength Logic
  const [strength, setStrength] = useState({ score: 0, label: "Weak", color: "bg-rose-500" });

  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, label: "Weak", color: "bg-rose-500" });
      return;
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = "Weak";
    let color = "bg-rose-500 w-1/3";

    if (score >= 4) {
      label = "Strong";
      color = "bg-emerald-500 w-full";
    } else if (score >= 2) {
      label = "Medium";
      color = "bg-amber-500 w-2/3";
    }

    setStrength({ score, label, color });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name || "Ravtron User",
          email: email,
          role: "Customer",
          joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Registration failed");
      }

      const dbUser = await response.json();

      setIsLoading(false);
      setSuccess(true);

      // Save user profile data to localStorage
      const sessionUser = {
        name: dbUser.name,
        email: dbUser.email,
        phone: phone || "",
        avatar: "",
        joinDate: dbUser.joinDate,
        role: dbUser.role,
        isLoggedIn: true
      };
      localStorage.setItem("ravtron_session", JSON.stringify(sessionUser));
      window.dispatchEvent(new Event("ravtron_auth_change"));

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-bg-brand text-text-brand antialiased selection:bg-[#3674B5] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16 md:py-24 relative overflow-hidden">
        {/* Dynamic decorative warm light radial glows */}
        <div className="absolute top-1/10 right-1/10 w-96 h-96 rounded-full bg-[#E8EFE5] opacity-40 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-1/10 left-1/10 w-96 h-96 rounded-full bg-[#E5D0C6] opacity-30 blur-3xl pointer-events-none z-0" />

        {/* Center Card */}
        <div className="w-full max-w-[480px] rounded-3xl bg-white border border-[#1E293B]/10 p-6 md:p-10 shadow-2xl relative z-10 hover-lift duration-500">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
              <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                Registration
              </span>
            </div>
            <h1 className="font-display font-black text-3xl text-[#1E293B] tracking-tight">
              Create Account
            </h1>
            <p className="text-xs font-semibold text-[#1E293B]/50">
              Join RAVTRON® and enjoy members-only benefits and fast checkouts.
            </p>
          </div>

          {/* Success / Error Messages */}
          {success && (
            <div className="mb-6 p-4.5 rounded-2xl bg-emerald-50 border border-emerald-500/20 text-emerald-800 text-xs font-bold flex items-center gap-3 animate-fade-in-up">
              <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-extrabold">Account Created!</h4>
                <p className="text-[10px] text-emerald-800/60 font-semibold mt-0.5">Welcome! Redirecting you to home...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-500/20 text-rose-800 text-xs font-bold animate-fade-in-up">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-[#1E293B]/60 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#1E293B]/40">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:bg-white focus:border-[#3674B5] focus:ring-1 focus:ring-[#3674B5] transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading || success}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-[#1E293B]/60 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#1E293B]/40">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:bg-white focus:border-[#3674B5] focus:ring-1 focus:ring-[#3674B5] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || success}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-[#1E293B]/60 uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#1E293B]/40">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:bg-white focus:border-[#3674B5] focus:ring-1 focus:ring-[#3674B5] transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading || success}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-[#1E293B]/60 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#1E293B]/40">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Min. 8 characters"
                  className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-2xl pl-11 pr-11 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:bg-white focus:border-[#3674B5] focus:ring-1 focus:ring-[#3674B5] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#1E293B]/40 hover:text-[#1E293B]"
                  disabled={isLoading || success}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1 pt-1 animate-fade-in-up">
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#1E293B]/40">
                    <span>Password Strength:</span>
                    <span className="text-[#3674B5]">{strength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Agree to Terms */}
            <div className="flex items-start gap-2.5 pt-1.5">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4.5 h-4.5 rounded-lg border-[#1E293B]/10 text-[#3674B5] focus:ring-[#3674B5] mt-0.5"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={isLoading || success}
              />
              <label htmlFor="terms" className="text-[11px] text-[#1E293B]/60 font-semibold cursor-pointer select-none leading-normal">
                I agree to the{" "}
                <button type="button" onClick={() => alert("Terms of Service details...")} className="text-[#3674B5] hover:underline font-extrabold">Terms of Service</button>
                {" "}and{" "}
                <button type="button" onClick={() => alert("Privacy Policy details...")} className="text-[#3674B5] hover:underline font-extrabold">Privacy Policy</button>.
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-4 rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 shadow-lg shadow-[#1A1917]/5 disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Register */}
          <div className="my-6 flex items-center justify-between gap-3">
            <span className="h-[1px] bg-[#1E293B]/10 flex-grow" />
            <span className="text-[10px] font-bold text-[#1E293B]/30 uppercase tracking-widest">or sign up with</span>
            <span className="h-[1px] bg-[#1E293B]/10 flex-grow" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => alert("Connecting to Google authentication...")}
              className="py-3 px-4 border border-[#1E293B]/10 bg-[#FFFFFF] hover:bg-[#F8F9FA] rounded-2xl text-xs font-bold text-[#1E293B]/70 hover:text-[#1E293B] transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 shadow-3xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.5 5.5 0 0 1 8.5 13a5.5 5.5 0 0 1 5.5-5.5c1.47 0 2.79.52 3.82 1.48l3.12-3.12C18.98 3.83 16.69 3 14 3 8.477 3 4 7.477 4 13s4.477 10 10 10c5.52 0 10-4.48 10-10 0-.69-.06-1.35-.18-2.015H12.24z" />
              </svg>
              <span>Google</span>
            </button>
            <button
              onClick={() => alert("Connecting to Microsoft authentication...")}
              className="py-3 px-4 border border-[#1E293B]/10 bg-[#FFFFFF] hover:bg-[#F8F9FA] rounded-2xl text-xs font-bold text-[#1E293B]/70 hover:text-[#1E293B] transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 shadow-3xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 23 23">
                <path fill="#F25022" d="M1 1h10v10H1z" />
                <path fill="#7FBA00" d="M12 1h10v10H12z" />
                <path fill="#00A4EF" d="M1 12h10v10H1z" />
                <path fill="#FFB900" d="M12 12h10v10H12z" />
              </svg>
              <span>Microsoft</span>
            </button>
          </div>

          {/* Direct link to Login */}
          <div className="mt-8 text-center text-xs font-semibold text-[#1E293B]/50">
            Already have an account?{" "}
            <Link href="/login" className="text-[#3674B5] hover:text-[#578FCA] font-extrabold hover:underline">
              Log in here
            </Link>
          </div>

        </div>
      </main>

      <Footer />
      <SearchModal />
      <CartDrawer />
    </div>
  );
}
