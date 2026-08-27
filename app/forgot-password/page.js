"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, KeyRound, RefreshCw, Edit3 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchModal from "../../components/SearchModal";
import { useCart } from "../context/CartContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useCart();

  // Wizard step: 1 = Email Input, 2 = OTP + New Password Input
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [infoNotice, setInfoNotice] = useState("");

  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Password Strength Indicator
  const [strength, setStrength] = useState({ score: 0, label: "Weak", color: "bg-rose-500" });

  useEffect(() => {
    if (!newPassword) {
      setStrength({ score: 0, label: "Weak", color: "bg-rose-500" });
      return;
    }

    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 10) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

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
  }, [newPassword]);

  // Step 1: Send Reset OTP Code
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setInfoNotice("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send password reset code.");
      }

      setIsLoading(false);
      setStep(2);
      setResendTimer(45);
      setInfoNotice(data.message || `A 6-digit reset code was sent to ${email}.`);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  // Step 2: Verify OTP and Save New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.trim().length !== 6) {
      setError("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim(), newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setIsLoading(false);
      setSuccessNotice(data.message || "Password reset successful! Redirecting to login...");
      showToast("Password reset successful!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Resend failed");

      setIsLoading(false);
      setResendTimer(45);
      setInfoNotice(`New 6-digit reset code sent to ${email}.`);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E293B] antialiased selection:bg-[#3674B5] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-2 xs:px-4 py-8 sm:py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-1/10 left-1/10 w-96 h-96 rounded-full bg-[#E5D0C6] opacity-40 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-1/10 right-1/10 w-96 h-96 rounded-full bg-[#E8EFE5] opacity-30 blur-3xl pointer-events-none z-0" />

        <div className="w-full max-w-[460px] rounded-2xl sm:rounded-3xl bg-white border border-[#1E293B]/10 p-3.5 sm:p-6 md:p-10 shadow-2xl relative z-10 hover-lift duration-500">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">
                {step === 1 ? "Password Reset" : "Step 2 of 2: Verify Code"}
              </span>
            </div>
            <h1 className="font-display font-black text-2.5xl sm:text-3xl text-[#1E293B] tracking-tight">
              {step === 1 ? "Forgot Password?" : "Reset Your Password"}
            </h1>
            <p className="text-xs font-semibold text-[#1E293B]/50">
              {step === 1
                ? "Enter your email address to receive a 6-digit OTP reset code."
                : `Enter the 6-digit code sent to ${email} and choose a new password.`}
            </p>
          </div>

          {/* Success Notice */}
          {successNotice && (
            <div className="mb-6 p-4.5 rounded-2xl bg-emerald-50 border border-emerald-500/20 text-emerald-800 text-xs font-bold flex items-center gap-3 animate-fade-in-up">
              <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-extrabold">Password Updated!</h4>
                <p className="text-[10px] text-emerald-800/60 font-semibold mt-0.5">{successNotice}</p>
              </div>
            </div>
          )}

          {/* Info Notice */}
          {infoNotice && !successNotice && (
            <div className="mb-5 p-3.5 rounded-2xl bg-blue-50 border border-blue-500/20 text-blue-800 text-xs font-semibold animate-fade-in-up">
              {infoNotice}
            </div>
          )}

          {/* Error Notice */}
          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-500/20 text-rose-800 text-xs font-bold animate-fade-in-up">
              {error}
            </div>
          )}

          {/* Step 1: Request OTP */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#1E293B]/70">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E293B]/40" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#F8F9FA] border border-[#1E293B]/10 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:border-[#3674B5] focus:bg-white focus:ring-2 focus:ring-[#3674B5]/20 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-2 rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 shadow-lg shadow-[#1A1917]/5 disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <span>Sending Reset Code...</span>
                ) : (
                  <>
                    <span>Send Reset OTP Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Input OTP & New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in-up">
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#1E293B]/60">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(""); }}
                    className="text-[10px] font-bold text-[#3674B5] hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> Edit Email
                  </button>
                </div>

                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E293B]/40" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    className="w-full bg-[#F8F9FA] border border-[#3674B5]/40 rounded-2xl pl-11 pr-4 py-3.5 text-center text-lg font-mono font-black tracking-widest text-[#1E293B] outline-none focus:bg-white focus:border-[#3674B5] focus:ring-2 focus:ring-[#3674B5]/20 transition-all"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    disabled={isLoading || !!successNotice}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#1E293B]/60">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E293B]/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading || !!successNotice}
                    className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-[#F8F9FA] border border-[#1E293B]/10 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:border-[#3674B5] focus:bg-white focus:ring-2 focus:ring-[#3674B5]/20 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E293B]/40 hover:text-[#1E293B]/70"
                    disabled={isLoading || !!successNotice}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {newPassword && (
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

              <button
                type="submit"
                disabled={isLoading || !!successNotice || otp.length !== 6}
                className="w-full py-4 rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <span>Updating Password...</span>
                ) : (
                  <>
                    <span>Reset Password & Log In</span>
                    <ShieldCheck className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                {resendTimer > 0 ? (
                  <p className="text-[11px] font-semibold text-[#1E293B]/50">
                    Resend code available in <span className="font-extrabold text-[#3674B5]">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-[11px] font-extrabold text-[#3674B5] hover:underline inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend 6-Digit Code</span>
                  </button>
                )}
              </div>

            </form>
          )}

          {/* Footer Back Link */}
          <div className="mt-8 text-center text-xs font-semibold text-[#1E293B]/60">
            Remember your password?{" "}
            <Link href="/login" className="font-extrabold text-[#3674B5] hover:underline">
              Back to Log In
            </Link>
          </div>

        </div>
      </main>

      <Footer />
      <SearchModal />
    </div>
  );
}
