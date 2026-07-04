"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { client } from "@/utils/helper";

export default function OTPVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const type = searchParams.get("type");

  const isForgotPassword = type === "forgot-password";

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      router.replace("/register");
      return;
    }

    inputRefs.current[0]?.focus();
  }, [email, router]);

  function handleChange(value, index) {
    if (!/^\d?$/.test(value)) return;

    const copy = [...otp];
    copy[index] = value;

    setOtp(copy);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();

    const pasted = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pasted)) return;

    const arr = pasted.split("");

    setOtp([...arr, ...Array(6 - arr.length).fill("")]);

    inputRefs.current[arr.length - 1]?.focus();
  }

  async function verifyOTP(e) {
    e.preventDefault();

    const finalOTP = otp.join("");

    if (finalOTP.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const { data } = await client.post("/user/verify-otp",
        {
          email,
          otp: finalOTP,
        }
      );

      toast.success(data.message);

      if (isForgotPassword) {
        router.push(`/new-password?email=${email}`);
      } else {
        router.push("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function resendOTP() {
    try {
      setLoading(true);

      const { data } = await client.post("/user/resend-otp", {
        email,
      });

      toast.success(data.message);

      setOtp(Array(6).fill(""));
      setError("");

      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to resend OTP"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f6f2] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-center text-3xl font-bold">
          Verify OTP
        </h2>

        <p className="mt-2 text-center text-gray-500">
          Enter the 6-digit code sent to
        </p>

        <p className="mb-8 text-center font-semibold">
          {email}
        </p>

        <form
          onSubmit={verifyOTP}
          className="space-y-6"
        >
          <div
            className="flex justify-between gap-2"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                className="h-14 w-14 rounded-lg border text-center text-xl font-bold focus:border-black focus:outline-none"
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 text-white hover:bg-gray-900 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            disabled={loading}
            onClick={resendOTP}
            className="font-semibold text-black hover:underline"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}