"use client";

import { client } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { auth } from "@/firebase";
import { auth } from "@/firebase";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
export default function Page() {
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const response = await client.post("user/google-login", {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
      });

      if (response.data.success) {
        toast.success("Login Successful");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cart = JSON.parse(localStorage.getItem("cart"));

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function loginHandler(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await client.post("user/login", formData);

      if (response.data.success) {
        toast.success(response.data.message);

        const cartData = JSON.parse(localStorage.getItem("cart")) || {
          items: [],
        };

        try {
          const syncResponse = await client.post("cart/sync-cart", {
            localCart: JSON.stringify(cartData.items),
          });

          let final_total = 0;

          let original_total = 0;

          const updatedCart = syncResponse.data.cart.items.map((item) => {
            const product = item.productId;

            final_total += product.salePrice * item.qty;

            original_total += product.originalPrice * item.qty;

            return {
              id: product._id,

              name: product.name,

              thumbnail: product.thumbnail,

              salePrice: product.salePrice,

              originalPrice: product.originalPrice,

              qty: item.qty,
            };
          });

          localStorage.setItem(
            "cart",

            JSON.stringify({
              final_total,

              original_total,

              items: updatedCart,
            }),
          );
        } catch (err) {
          console.log("Cart Sync Error", err);
        }

        setFormData({
          email: "",

          password: "",
        });

        router.push("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f5f1] px-5">
      <form
        onSubmit={loginHandler}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow"
      >
        <h2 className="text-3xl font-semibold">Welcome back</h2>

        <p className="text-gray-500 mt-2 mb-10">
          Sign in to your Nestro account to continue.
        </p>

        {/* Email */}

        <label className="text-gray-600">Email address</label>

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="rahul@email.com"
          className="w-full mt-2 mb-6 px-5 py-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#93633e]"
        />

        {/* Password */}

        <label className="text-gray-600">Password</label>

        <div className="relative">
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full mt-2 px-5 py-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#93633e]"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-5"
          >
            👁
          </button>
        </div>

        <div className="text-right mt-3  ">
          <Link href="/forget-Password">
            <button type="button" className="text-[#93633e] cursor-pointer ">
              Forgot password?
            </button>
          </Link>
        </div>

        <button
          disabled={loading}
          className="w-full mt-6 bg-[#93633e] text-white py-4 rounded-xl hover:bg-[#7b5030] disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="flex items-center gap-3 my-7 text-gray-500">
          <div className="h-px bg-gray-300 flex-1"></div>
          or continue with
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        {/* Google */}
        <button
          onClick={googleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold shadow-sm hover:shadow-md transition-all duration-300"
        >
          <FcGoogle size={24} />
          Continue with Google
        </button>

        {/* Apple */}
        <button
          type="button"
          className="w-full mt-4 flex items-center justify-center gap-3 py-4 rounded-xl bg-black text-white font-semibold shadow-sm hover:bg-gray-900 hover:shadow-md transition-all duration-300"
        >
          <FaApple size={24} />
          Continue with Apple
        </button>

        <div className="text-center mt-8 text-gray-500">
          Don't have account?
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-[#93633e] ml-2"
          >
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}
