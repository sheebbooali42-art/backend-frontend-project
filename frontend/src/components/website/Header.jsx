"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { toast } from "sonner";
import ThemeToggle from "./ThemeToggle";

import { client } from "@/utils/helper";
import { lsToCart } from "@/redux/features/cartSlice";

// Static Configuration moved outside component to prevent re-creation on render
const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "ur", name: "اردو" },
  { code: "ar", name: "العربية" },
];

const translations = {
  en: {
    home: "Home",
    store: "Store",
    about: "About",
    contact: "Contact",
    checkout: "Checkout",
  },
  hi: {
    home: "होम",
    store: "स्टोर",
    about: "हमारे बारे में",
    contact: "संपर्क",
    checkout: "चेकआउट",
  },
  ur: {
    home: "ہوم",
    store: "اسٹور",
    about: "ہمارے بارے میں",
    contact: "رابطہ",
    checkout: "چیک آؤٹ",
  },
  ar: {
    home: "الرئيسية",
    store: "المتجر",
    about: "من نحن",
    contact: "اتصل بنا",
    checkout: "الدفع",
  },
};

export default function Header({ user }) {
  const [language, setLanguage] = useState("en");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useSelector((state) => state.cart.items);

  const t = translations[language] || translations.en;

  // Dynamic Navigation setup using translated strings
  const menus = [
    { name: t.home, path: "/" },
    { name: t.store, path: "/store" },
    { name: t.about, path: "/about" },
    { name: t.contact, path: "/contact" },
    { name: t.checkout, path: "/checkout" },
  ];

  // Sync Language from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) {
      setLanguage(saved);
    }
  }, []);

  // Sync Cart items
  useEffect(() => {
    dispatch(lsToCart());
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      const { data } = await client.post("/user/logout");
      toast.success(data.message);
      setOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-[#f8f6f2] shadow dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <h1 className="cursor-pointer text-2xl font-semibold tracking-[0.3em] text-black dark:text-white md:text-3xl">
              NESTRO.
            </h1>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden items-center gap-4 md:flex">
            {menus.map((menu) => (
              <Link
                key={menu.path}
                href={menu.path}
                className={`rounded-md px-4 py-2 transition ${
                  pathname === menu.path
                    ? "bg-[#3a2418] text-white"
                    : "text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                }`}
              >
                {menu.name}
              </Link>
            ))}
          </nav>

          {/* Action Shell */}
          <div className="flex items-center gap-5">
            {/* Cart Counter */}
            <Link href="/cart" className="relative text-black dark:text-white">
              <FaShoppingCart size={30} />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-semibold text-white">
                {cartItems?.length || 0}
              </span>
            </Link>

            {/* Profile Tag (Desktop) */}
            {user && (
              <span className="hidden rounded-full bg-[#3a2418] px-4 py-2 text-sm font-medium text-white md:block">
                {user.name}
              </span>
            )}

            <ThemeToggle />

            {/* Language Selector */}
            <select
              value={language}
              onChange={handleLanguageChange}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>

            {/* Settings Dropdown Wrapper */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="rounded-full p-2 transition hover:bg-gray-200 dark:hover:bg-zinc-700"
              >
                <IoSettingsOutline
                  size={28}
                  className="text-gray-700 dark:text-white"
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900 text-gray-700 dark:text-zinc-200">
                  {user ? (
                    <>
                      <div className="border-b border-gray-200 px-4 py-3 dark:border-zinc-700">
                        <p className="font-medium text-black dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Welcome back 👋
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800"
                      >
                        Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800"
                      >
                        Logout
                      </button>

                      <Link href="/login">
                        <button
                          onClick={() => setOpen(false)}
                          className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        >
                          Login
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Fallback Login Button */}
            {!user && (
              <Link href="/login" className="md:hidden">
                <button className="flex items-center gap-2 rounded-full border border-gray-300 dark:border-zinc-700 px-4 py-2 text-sm text-black dark:text-white hover:bg-[#3a2418] hover:text-white transition">
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
