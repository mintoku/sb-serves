"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  // Step 1: email input
  const [email, setEmail] = useState("");

  // Step 2: 6-digit code input
  const [code, setCode] = useState("");

  // UI state
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function sendCode() {
    setLoading(true);
    setStatus(null);

    const cleanEmail = email.trim();

    // Sends a 6-digit OTP (if your Supabase Email provider is set to OTP)
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        // This helps ensure new sellers can be created automatically
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setStatus("Sent! Check your email for a 6-digit code ✉️");
    setStep("code");
    setLoading(false);
  }

  async function verifyCode() {
    setLoading(true);
    setStatus(null);

    const cleanEmail = email.trim();
    const cleanCode = code.replace(/\s+/g, ""); // remove spaces

    // Verify 6-digit code
    const { error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanCode,
      type: "email",
    });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setStatus("Signed in ✅ Redirecting…");

    // Go to dashboard
    router.push("/dashboard");
    router.refresh();
    setLoading(false);
  }

  async function goBack() {
    setStatus(null);
    setCode("");
    setStep("email");
  }

  return (
    <section className="p-6 sm:p-10">
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Seller sign in
        </h1>

        <p className="mt-2 text-zinc-600">
          {step === "email"
            ? "Enter your email and we’ll send a 6-digit code."
            : "Enter the 6-digit code we emailed you."}
        </p>

        <div className="mt-6 space-y-4">
          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@ucsb.edu"
            className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
            disabled={loading || step === "code"} // lock email once we move to code
          />

          {/* Code input (only shows on step 2) */}
          {step === "code" && (
            <input
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 tracking-widest"
              disabled={loading}
            />
          )}

          {status && (
            <p className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              {status}
            </p>
          )}

          {step === "email" ? (
            <button
              onClick={sendCode}
              disabled={loading || !email.trim()}
              className="w-full rounded-2xl bg-black px-4 py-3 text-white disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send 6-digit code"}
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={verifyCode}
                disabled={loading || code.replace(/\s+/g, "").length < 6}
                className="w-full rounded-2xl bg-black px-4 py-3 text-white disabled:opacity-60"
              >
                {loading ? "Verifying…" : "Verify code"}
              </button>

              <button
                onClick={sendCode}
                disabled={loading}
                className="w-full rounded-2xl border px-4 py-3 hover:bg-zinc-50 disabled:opacity-60"
              >
                Resend code
              </button>

              <button
                onClick={goBack}
                disabled={loading}
                className="w-full rounded-2xl border px-4 py-3 hover:bg-zinc-50 disabled:opacity-60"
              >
                Use a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
