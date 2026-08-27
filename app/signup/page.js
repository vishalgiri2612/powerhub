"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, ShieldCheck, KeyRound, RefreshCw, Edit3 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchModal from "../../components/SearchModal";
import { useCart } from "../context/CartContext";
import GoogleAuthProvider from "../../components/GoogleAuthProvider";

function SignupContent() {
  const router = useRouter();
  const { showToast } = useCart();

  // Wizard state: 1 = Details, 2 = OTP Verification
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [infoNotice, setInfoNotice] = useState("");

  // Resend Timer
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

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

  const handleGoogleSuccessResponse = async (payload) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Google registration failed.");
      }

      const data = await response.json();
      const sessionUser = data.user;

      setIsLoading(false);
      setSuccess(true);

      localStorage.setItem("ravtron_session", JSON.stringify(sessionUser));
      window.dispatchEvent(new Event("ravtron_auth_change"));

      if (sessionUser.role === "Administrator") {
        showToast("Administrator access authorized with Google.");
        setTimeout(() => { window.location.href = "/admin"; }, 1000);
      } else {
        showToast(`Welcome ${sessionUser.name}! Account created.`);
        setTimeout(() => { window.location.href = "/"; }, 1000);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Google authentication failed.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      if (accessToken) {
        window.history.replaceState(null, "", window.location.pathname);
        handleGoogleSuccessResponse({ access_token: accessToken });
      }
    }
  }, []);

  const triggerGoogleRedirect = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "538059283255-qc41jgp3n3287bgmcs16efjgdt2fcb1s.apps.googleusercontent.com";
    const redirectUri = typeof window !== "undefined"
      ? `${window.location.origin}/signup`
      : "https://powerhub-umber.vercel.app/signup";

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "token",
      scope: "openid profile email",
      prompt: "select_account"
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setInfoNotice("");

    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification code.");
      }

      setIsLoading(false);
      setStep(2);
      setResendTimer(45);
      setInfoNotice(data.message || `A 6-digit verification code was sent to ${email}.`);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  // Step 2: Verify OTP and complete signup
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.trim().length !== 6) {
      setError("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      setIsLoading(false);
      setSuccess(true);

      const sessionUser = data.user;
      localStorage.setItem("ravtron_session", JSON.stringify(sessionUser));
      window.dispatchEvent(new Event("ravtron_auth_change"));

      showToast(`Welcome ${sessionUser.name}! Your email is verified.`);
      setTimeout(() => {
        router.push("/");
      }, 1200);

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
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Resend failed");

      setIsLoading(false);
      setResendTimer(45);
      setInfoNotice(`New 6-digit verification code sent to ${email}.`);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-bg-brand text-text-brand antialiased selection:bg-[#3674B5] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-2 xs:px-4 py-8 sm:py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-1/10 right-1/10 w-96 h-96 rounded-full bg-[#E8EFE5] opacity-40 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-1/10 left-1/10 w-96 h-96 rounded-full bg-[#E5D0C6] opacity-30 blur-3xl pointer-events-none z-0" />

        <div className="w-full max-w-[480px] rounded-2xl sm:rounded-3xl bg-white border border-[#1E293B]/10 p-3.5 sm:p-6 md:p-10 shadow-2xl relative z-10 hover-lift duration-500">

          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3674B5]/10 border border-[#3674B5]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3674B5] animate-pulse" />
              <span className="text-[10px] font-extrabold text-[#3674B5] uppercase tracking-wider">
                {step === 1 ? "Step 1 of 2: Details" : "Step 2 of 2: Verify Email"}
              </span>
            </div>
            <h1 className="font-display font-black text-2.5xl sm:text-3xl text-[#1E293B] tracking-tight">
              {step === 1 ? "Create Account" : "Enter OTP Code"}
            </h1>
            <p className="text-xs font-semibold text-[#1E293B]/50">
              {step === 1
                ? "Join RAVTRON® and enjoy members-only benefits and fast checkouts."
                : `We sent a 6-digit verification code to ${email}`}
            </p>
          </div>

          {/* Success / Info / Error Messages */}
          {success && (
            <div className="mb-6 p-4.5 rounded-2xl bg-emerald-50 border border-emerald-500/20 text-emerald-800 text-xs font-bold flex items-center gap-3 animate-fade-in-up">
              <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-extrabold">Email Verified!</h4>
                <p className="text-[10px] text-emerald-800/60 font-semibold mt-0.5">Welcome to RAVTRON! Redirecting to home...</p>
              </div>
            </div>
          )}

          {infoNotice && !success && (
            <div className="mb-5 p-3.5 rounded-2xl bg-blue-50 border border-blue-500/20 text-blue-800 text-xs font-semibold animate-fade-in-up">
              {infoNotice}
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-500/20 text-rose-800 text-xs font-bold animate-fade-in-up">
              {error}
            </div>
          )}

          {/* Step 1: Input Registration Details */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">

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
                    placeholder="Enter your Name"
                    className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:bg-white focus:border-[#3674B5] focus:ring-1 focus:ring-[#3674B5] transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
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
                    placeholder="Enter Your Emailid"
                    className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:bg-white focus:border-[#3674B5] focus:ring-1 focus:ring-[#3674B5] transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
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
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number (Optional)"
                    className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:bg-white focus:border-[#3674B5] focus:ring-1 focus:ring-[#3674B5] transition-all"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    disabled={isLoading}
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
                    placeholder="Min. 6 characters"
                    className="w-full bg-[#F8F9FA] border border-[#1E293B]/10 rounded-2xl pl-11 pr-11 py-3.5 text-xs font-semibold text-[#1E293B] placeholder-[#1E293B]/30 outline-none focus:bg-white focus:border-[#3674B5] focus:ring-1 focus:ring-[#3674B5] transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#1E293B]/40 hover:text-[#1E293B]"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

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
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-[11px] text-[#1E293B]/60 font-semibold cursor-pointer select-none leading-normal">
                  I agree to the Terms of Service & Privacy Policy.
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 shadow-lg shadow-[#1A1917]/5 disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Input 6-Digit OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-in-up">

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-extrabold text-[#1E293B]/60 uppercase tracking-wider">
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
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#1E293B]/40">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    className="w-full bg-[#F8F9FA] border border-[#3674B5]/40 rounded-2xl pl-11 pr-4 py-4 text-center text-lg font-mono font-black tracking-widest text-[#1E293B] outline-none focus:bg-white focus:border-[#3674B5] focus:ring-2 focus:ring-[#3674B5]/20 transition-all"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    disabled={isLoading || success}
                  />
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading || success || otp.length !== 6}
                className="w-full py-4 rounded-2xl bg-[#3674B5] hover:bg-[#578FCA] text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <span>Verifying Code...</span>
                ) : (
                  <>
                    <span>Verify & Complete Registration</span>
                    <ShieldCheck className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend Code Section */}
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

          {/* Social Register */}
          {step === 1 && (
            <>
              <div className="my-6 flex items-center justify-between gap-3">
                <span className="h-[1px] bg-[#1E293B]/10 flex-grow" />
                <span className="text-[10px] font-bold text-[#1E293B]/30 uppercase tracking-widest">or sign up with</span>
                <span className="h-[1px] bg-[#1E293B]/10 flex-grow" />
              </div>

              <div className="flex flex-col items-center justify-center gap-3 w-full">
                <button
                  type="button"
                  onClick={triggerGoogleRedirect}
                  disabled={isLoading || success}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white border border-[#1E293B]/15 hover:bg-slate-50 text-xs font-extrabold text-[#1E293B] transition-all duration-300 hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-3 shadow-2xs cursor-pointer disabled:opacity-50 disabled:scale-100"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign up with Google</span>
                </button>
              </div>
            </>
          )}

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
    </div>
  );
}

export default function SignupPage() {
  return (
    <GoogleAuthProvider>
      <SignupContent />
    </GoogleAuthProvider>
  );
}
