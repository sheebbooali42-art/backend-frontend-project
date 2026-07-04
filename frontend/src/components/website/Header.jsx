"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { toast } from "sonner";

import { client } from "@/utils/helper";
import { lsToCart } from "@/redux/features/cartSlice";

export default function Header({ user }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(lsToCart());
  }, [dispatch]);
 


  const handleLogout = async () => {
  try {
    const { data } = await client.post("/user/logout");

    toast.success(data.message);

    router.replace("/");
    router.refresh();
  } catch (error) {
    toast.error(error.response?.data?.message || "Logout failed");
  }
};


  const menus = [
    { name: "Home", path: "/" },
    { name: "Store", path: "/store" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Checkout", path: "/checkout" },
    { name: "SignIn", path: "/login" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#f8f6f2] shadow">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <h1 className="cursor-pointer text-2xl font-semibold tracking-[0.3em] text-black md:text-3xl">
              NESTRO.
            </h1>
          </Link>

          {/* Menu */}
          <nav className="hidden items-center gap-4 md:flex">
            {menus.map((menu) => (
              <Link
                key={menu.path}
                href={menu.path}
                className={`rounded-md px-4 py-2 transition ${
                  pathname === menu.path
                    ? "bg-[#3a2418] text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {menu.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-5">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <FaShoppingCart className="text-xl" size={30} />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-semibold text-white">
                {cartItems?.length || 0}
              </span>
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#3a2418] p-3 text-sm font-medium text-white">
                  
                  {user.name}

                </span>

                <button
                  onClick={handleLogout}
                  className="rounded-md border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>


<Link href="login">
                 <button
                  className="rounded-md border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
                >
                  Login
                </button>
</Link>

              </div>
            ) : (
              <Link href="/login">
                <button className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-[#3a2418] hover:text-white">
                  <FaUser />
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}