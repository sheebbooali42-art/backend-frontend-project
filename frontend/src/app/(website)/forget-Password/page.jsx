"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { client } from "@/utils/helper";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      return toast.error("Email or Mobile Number is required");
    }

    // Check if input is email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    // Check if input is 10 digit mobile number
    const isMobile = /^[6-9]\d{9}$/.test(identifier);

    if (!isEmail && !isMobile) {
      return toast.error("Enter a valid Email or Mobile Number");
    }

    try {
      setLoading(true);

      const payload = isEmail
        ? { email: identifier }
        : { mobile: identifier };

      const { data } = await client.post(
        "user/forgot-password",
        payload
      );

      if (data.success) {
        toast.success(data.message);

        router.push(
          `/inter-otp?${
            isEmail
              ? `email=${identifier}`
              : `mobile=${identifier}`
          }&type=forgot-password`
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f3ef] px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center">
          Forgot Password
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-8">
          Enter your Email or Mobile Number to receive an OTP.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Enter Email or Mobile Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}