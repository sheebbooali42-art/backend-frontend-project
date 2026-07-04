"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { toast } from "sonner";
import { client } from "@/utils/helper";

export default function NewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { password, confirmPassword } = formData;

  useEffect(() => {
    if (!email) {
      toast.error("Invalid request");
      router.replace("/forgot-password");
    }
  }, [email, router]);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is missing");
    }

    if (!password || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const { data } = await client.post("/user/reset-password", {
        email,
        password,
        confirmPassword,
      });
      if (data.success) {
        toast.success(data.message);

        setFormData({
          password: "",
          confirmPassword: "",
        });

        router.replace("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f8f6f2] via-white to-[#ece8df] px-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
            <FaLock size={24} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Create New Password
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={password}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 py-4 pl-12 pr-12 outline-none transition focus:border-black focus:ring-2 focus:ring-black/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 py-4 pl-12 pr-12 outline-none transition focus:border-black focus:ring-2 focus:ring-black/20"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
