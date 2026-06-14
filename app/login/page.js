"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchModal from "../../components/SearchModal";
import CartDrawer from "../../components/CartDrawer";
import { useCart } from "../context/CartContext";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useCart();
  
  // Login states
  const [loginMode, setLoginMode] = useState("client"); // client or admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (loginMode === "admin") {
        // Administrative Authentication
        if (password !== "admin123" && password !== "admin") {
          throw new Error("Invalid administrative security password.");
        }

        // Query registered users list
        const usersRes = await fetch("/api/users");
        if (!usersRes.ok) {
          throw new Error("Failed to communicate with user authentication directory");
        }
        const users = await usersRes.json();

        // Search for user matching email address
        const adminUser = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

        if (!adminUser) {
          throw new Error("Email is not registered as an Administrator in database.");
        }

        if (adminUser.role !== "Administrator") {
          throw new Error("Access denied. User does not possess Administrator rights.");
        }

        setIsLoading(false);
        setSuccess(true);

        const sessionUser = {
          name: adminUser.name,
          email: adminUser.email,
          phone: "",
          avatar: "",
          joinDate: adminUser.joinDate,
          role: "Administrator",
          isLoggedIn: true
        };
        localStorage.setItem("ravtron_session", JSON.stringify(sessionUser));
        window.dispatchEvent(new Event("ravtron_auth_change"));

        showToast("Administrator terminal access authorized.");
        setTimeout(() => {
          router.push("/admin");
        }, 1500);

      } else {
        // Customer / Client Portal Authentication
        // Query users in database
        const usersRes = await fetch("/api/users");
        if (!usersRes.ok) {
          throw new Error("Failed to communicate with user directory services.");
        }
        const users = await usersRes.json();

        let clientUser = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

        // Automatically register client if they don't exist yet!
        if (!clientUser) {
          const defaultName = email.split("@")[0].split(".").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "Ravtron Client";
          const registerRes = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: defaultName,
              email: email,
              role: "Customer"
            })
          });
          if (!registerRes.ok) {
            throw new Error("Failed to register client profile record in database");
          }
          clientUser = await registerRes.json();
        }

        if (clientUser.role === "Administrator") {
          throw new Error("Please use the Administrator tab to log in with an admin account.");
        }

        setIsLoading(false);
        setSuccess(true);

        const sessionUser = {
          name: clientUser.name,
          email: clientUser.email,
          phone: "",
          avatar: "",
          joinDate: clientUser.joinDate,
          role: "Customer",
          isLoggedIn: true
        };
        localStorage.setItem("ravtron_session", JSON.stringify(sessionUser));
        window.dispatchEvent(new Event("ravtron_auth_change"));

        showToast("Access granted. Welcome back.");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Authentication failed.");
    }
  };

  return (
    <div className="min-h-screen bg-bg-brand text-text-brand antialiased selection:bg-[#3674B5] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16 md:py-24 relative overflow-hidden">
        {/* Dynamic decorative warm light radial glows */}
        <div className="absolute top-1/10 left-1/10 w-96 h-96 rounded-full bg-[#E5D0C6] opacity-40 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-1/10 right-1/10 w-96 h-96 rounded-full bg-[#E8EFE5] opacity-30 blur-3xl pointer-events-none z-0" />

        {/* Center Card */}
        <div className="w-full max-w-[460px] rounded-3xl bg-white border border-[#1E293B]/10 p-6 md:p-10 shadow-2xl relative z-10 hover-lift duration-500">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
              <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                {loginMode === "admin" ? "Console Terminal" : "Secure Access"}
              </span>
            </div>
            <h1 className="font-display font-black text-3xl text-[#1E293B] tracking-tight">
              {loginMode === "admin" ? "Admin Auth" : "Welcome Back"}
            </h1>
            <p className="text-xs font-semibold text-[#1E293B]/50">
              {loginMode === "admin" 
                ? "Enter console credentials to access system directories." 
                : "Log in to manage your orders and workspace profile."}
            </p>
          </div>

          {/* Toggle Tab Selector */}
          <div className="flex bg-[#F8F9FA] p-1 rounded-2xl border border-[#1E293B]/5 mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginMode("client");
                setError("");
              }}
              className={`flex-1 py-3 text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 ${
                loginMode === "client"
                  ? "bg-white text-[#3674B5] shadow-xs"
                  : "text-[#1E293B]/50 hover:text-[#1E293B]"
              }`}
            >
              Client Login
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode("admin");
                setError("");
              }}
              className={`flex-1 py-3 text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 ${
                loginMode === "admin"
                  ? "bg-white text-[#3674B5] shadow-xs"
                  : "text-[#1E293B]/50 hover:text-[#1E293B]"
              }`}
            >
              Admin Login
            </button>
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
                  {loginMode === "admin" ? "Redirecting to Admin Panel..." : "Redirecting to homepage..."}
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
              <label className="block text-[10px] font-extrabold text-[#1E293B]/60 uppercase tracking-wider">
                {loginMode === "admin" ? "Administrator Email" : "Email Address"}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#1E293B]/40">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder={loginMode === "admin" ? "ravtron@admin.com" : "name@company.com"}
                  className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:bg-white focus:border-[#3674B5] focus:ring-1 focus:ring-[#3674B5] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || success}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-extrabold text-[#1E293B]/60 uppercase tracking-wider">
                  {loginMode === "admin" ? "Access Key Password" : "Password"}
                </label>
                {loginMode === "client" && (
                  <button
                    type="button"
                    onClick={() => alert("Password reset link sent to your registered email.")}
                    className="text-[10px] font-extrabold text-[#3674B5] hover:text-[#578FCA] uppercase tracking-wider hover:underline"
                    disabled={isLoading || success}
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#1E293B]/40">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={loginMode === "admin" ? "Enter admin password" : "••••••••"}
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
            </div>

            {/* Remember Me Box */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4.5 h-4.5 rounded-lg border-[#1E293B]/10 text-[#3674B5] focus:ring-[#3674B5]"
                disabled={isLoading || success}
              />
              <label htmlFor="remember" className="text-[11px] text-[#1E293B]/60 font-semibold cursor-pointer select-none">
                Keep me signed in on this device
              </label>
            </div>

            {/* Action Submit Button */}
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
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{loginMode === "admin" ? "Authorize Console" : "Sign In"}</span>
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

          {/* Direct link to Signup */}
          <div className="mt-8 text-center text-xs font-semibold text-[#1E293B]/50">
            Don't have an account yet?{" "}
            <Link href="/signup" className="text-[#3674B5] hover:text-[#578FCA] font-extrabold hover:underline">
              Create one here
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
