"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { client } from "@/utils/helper";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Email is required");
    }

    try {
      setLoading(true);

      const { data } = await client.post("user/forgot-password", {
        email,
      });

      if (data.success) {
        toast.success(data.message);

        router.push(`/verify-otp?email=${email}&type=forgot-password`);
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
          Enter your email to receive an OTP.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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