"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "../../components/Navbar";
import SearchModal from "../../components/SearchModal";
import CartDrawer from "../../components/CartDrawer";
import { useCart } from "../context/CartContext";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import GoogleAuthProvider from "../../components/GoogleAuthProvider";

function LoginContent() {
  const router = useRouter();
  const { showToast } = useCart();

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userRole, setUserRole] = useState("");

  const handleGoogleSuccessResponse = async (payload) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Google authentication failed.");
      }

      const data = await response.json();
      const sessionUser = data.user;

      setIsLoading(false);
      setSuccess(true);
      setUserRole(sessionUser.role);

      localStorage.setItem("ravtron_session", JSON.stringify(sessionUser));
      window.dispatchEvent(new Event("ravtron_auth_change"));

      if (sessionUser.role === "Administrator") {
        showToast("Administrator access authorized with Google.");
        setTimeout(() => {
          window.location.href = "/admin";
        }, 1000);
      } else {
        showToast(`Welcome ${sessionUser.name}! Access granted.`);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Google login failed.");
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      handleGoogleSuccessResponse({ access_token: tokenResponse.access_token });
    },
    onError: (err) => {
      console.error("Google Login Error:", err);
      setIsLoading(false);
      if (err?.error === "popup_closed_by_user") {
        setError("Sign-in popup was closed.");
      } else {
        setError("Google Sign-In failed or popup was blocked by browser. Please use the Google button below.");
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Invalid email or password.");
      }

      const data = await response.json();
      const sessionUser = data.user;

      setIsLoading(false);
      setSuccess(true);
      setUserRole(sessionUser.role);

      localStorage.setItem("ravtron_session", JSON.stringify(sessionUser));
      window.dispatchEvent(new Event("ravtron_auth_change"));

      if (sessionUser.role === "Administrator") {
        showToast("Administrator session authenticated successfully!");
        setTimeout(() => {
          window.location.href = "/admin";
        }, 1000);
      } else {
        showToast(`Welcome back, ${sessionUser.name}!`);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Something went wrong. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1E293B] antialiased selection:bg-[#3674B5] selection:text-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16 md:py-24 relative overflow-hidden">
        {/* Dynamic decorative warm light radial glows */}
        <div className="absolute top-1/10 left-1/10 w-96 h-96 rounded-full bg-[#E5D0C6] opacity-40 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-1/10 right-1/10 w-96 h-96 rounded-full bg-[#E8EFE5] opacity-30 blur-3xl pointer-events-none z-0" />

        {/* Center Card */}
        <div className="w-full max-w-[460px] rounded-3xl bg-white border border-[#1E293B]/10 p-6 md:p-10 shadow-2xl relative z-10 hover-lift duration-500">

          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
              <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                Secure Access
              </span>
            </div>
            <h1 className="font-display font-black text-3xl text-[#1E293B] tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs font-semibold text-[#1E293B]/50">
              Log in to manage your orders, workspace profile, or admin console.
            </p>
          </div>

          {/* Success / Error Messages */}
          {success && (
            <div className="mb-6 p-4.5 rounded-2xl bg-emerald-50 border border-emerald-500/20 text-emerald-800 text-xs font-bold flex items-center gap-3 animate-fade-in-up">
              <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-extrabold">Login Successful!</h4>
                <p className="text-[10px] text-emerald-800/60 font-semibold mt-0.5">
                  {userRole === "Administrator" ? "Redirecting to Admin Panel..." : "Redirecting to homepage..."}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-500/20 text-rose-800 text-xs font-bold animate-fade-in-up">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1E293B]/70">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E293B]/40" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || success}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#F8F9FA] border border-[#1E293B]/10 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:border-[#3674B5] focus:bg-white focus:ring-2 focus:ring-[#3674B5]/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1E293B]/70">
                  Password
                </label>
                <Link
                  href="/support"
                  className="text-[11px] font-bold text-[#3674B5] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E293B]/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || success}
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-[#F8F9FA] border border-[#1E293B]/10 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:border-[#3674B5] focus:bg-white focus:ring-2 focus:ring-[#3674B5]/20 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E293B]/40 hover:text-[#1E293B]/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-4 mt-2 rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 shadow-lg shadow-[#1A1917]/5 disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="my-6 flex items-center justify-between gap-3">
            <span className="h-[1px] bg-[#1E293B]/10 flex-grow" />
            <span className="text-[10px] font-bold text-[#1E293B]/30 uppercase tracking-widest">or login with</span>
            <span className="h-[1px] bg-[#1E293B]/10 flex-grow" />
          </div>

          <div className="flex flex-col items-center justify-center gap-3 w-full">
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleGoogleSuccessResponse({ credential: credentialResponse.credential });
                }}
                onError={() => {
                  setError("Google Sign-In failed or popup was blocked by browser.");
                }}
                size="large"
                text="continue_with"
                shape="pill"
                width="100%"
              />
            </div>
          </div>

          {/* Footer Navigation Link */}
          <p className="mt-8 text-center text-xs font-semibold text-[#1E293B]/60">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/signup"
              className="font-extrabold text-[#3674B5] hover:underline"
            >
              Create Account
            </Link>
          </p>

        </div>
      </main>

      <SearchModal />
      <CartDrawer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <GoogleAuthProvider>
      <LoginContent />
    </GoogleAuthProvider>
  );
}
