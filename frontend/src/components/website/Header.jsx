"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { toast } from "sonner";

import ThemeToggle from "./ThemeToggle";
import { client } from "@/utils/helper";
import { lsToCart } from "@/redux/features/cartSlice";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "ur", name: "اردو" },
  { code: "ar", name: "العربية" },
];

const TRANSLATIONS = {
  en: {
    home: "Home",
    store: "Store",
    about: "About",
    contact: "Contact",
    checkout: "Checkout",
    forgetPassword: "Forget Password",
  },
  hi: {
    home: "होम",
    store: "स्टोर",
    about: "हमारे बारे में",
    contact: "संपर्क",
    checkout: "चेकआउट",
    forgetPassword: "पासवर्ड भूल गए",
  },
  ur: {
    home: "ہوم",
    store: "اسٹور",
    about: "ہمارے بارے میں",
    contact: "رابطہ",
    checkout: "چیک آؤٹ",
    forgetPassword: "پاس ورڈ بھول گئے",
  },
  ar: {
    home: "الرئيسية",
    store: "المتجر",
    about: "من نحن",
    contact: "اتصل بنا",
    checkout: "الدفع",
    forgetPassword: "نسيت كلمة المرور",
  },
};

export default function Header({ user }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const dropdownRef = useRef(null);

  const [language, setLanguage] = useState("en");
  const [open, setOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);

  const t = TRANSLATIONS[language];

  const menus = useMemo(
    () => [
      { name: t.home, path: "/" },
      { name: t.store, path: "/store" },
      { name: t.about, path: "/about" },
      { name: t.contact, path: "/contact" },
      { name: t.checkout, path: "/checkout" },
    ],
    [t],
  );

  useEffect(() => {
    const savedLanguage = localStorage.getItem("lang");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    dispatch(lsToCart());
  }, [dispatch]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLanguageChange = ({ target }) => {
    setLanguage(target.value);
    localStorage.setItem("lang", target.value);
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
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/">
          <h1 className="cursor-pointer text-3xl font-semibold tracking-[0.3em] text-black dark:text-white">
            NESTRO.
          </h1>
        </Link>

        {/* Navigation */}
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

        {/* Right Section */}
        <div className="flex items-center gap-5">
          <Link href="/cart" className="relative">
            <FaShoppingCart size={30} className="text-black dark:text-white" />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-semibold text-white">
              {cartItems.length}
            </span>
          </Link>

          {user && (
            <span className="hidden rounded-full bg-[#3a2418] px-4 py-2 text-sm font-medium text-white md:block">
              {user.name}
            </span>
          )}

          <ThemeToggle />

          <select
            value={language}
            onChange={handleLanguageChange}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          {/* Settings */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-zinc-700"
            >
              <IoSettingsOutline
                size={28}
                className="text-gray-700 dark:text-white"
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                {user ? (
                  <>
                    <div className="border-b border-gray-200 px-4 py-3 dark:border-zinc-700">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">Welcome back 👋</p>
                    </div>

                    <Link
                      href="/forget-Password"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                      Forget-Password
                    </Link>

                    <Link
                      href="/login"
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                      Login
                    </Link>
                    

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                      Logout
                    </button>
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

          {!user && (
            <Link href="/login" className="md:hidden">
              <button className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm hover:bg-[#3a2418] hover:text-white dark:border-zinc-700">
                <FaUser />
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
