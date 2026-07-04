"use client";

import Link from "next/link";

import { IoLogoInstagram } from "react-icons/io";
import { FaYoutube } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const FooterCompany = [
    { name: "Our Story", path: "/story" },
    { name: "Sustainability", path: "/sustainability" },
    { name: "Showrooms", path: "/showrooms" },
    { name: "Careers", path: "/career" },
  ];

  const FooterSupport = [
    { name: "Contact Us", path: "/contact" },
    { name: "Assembly Help", path: "/help" },
    { name: "Returns & Exchange", path: "/returns" },
    { name: "Track Order", path: "/trackOrder" },
  ];

  const FooterFollowUs = [
    { name: "Houzz", path: "/houzz" },
    { name: "Pinterest", path: "/pinterest" },
    {
      name: "Instagram",
      path: "https://www.instagram.com/___inaayat____/",
      target: "_blank",
    },
  ];

  const FooterItems = [
    { name: "Terms", path: "/terms" },
    { name: "Privacy", path: "/privacy" },
    { name: "Sitemap", path: "/sitemap" },
    { name: "Terms", path: "/terms" },
    { name: "Privacy", path: "/privacy" },
    { name: "Sitemap", path: "/sitemap" },
    { name: "Terms", path: "/terms" },
    { name: "Privacy", path: "/privacy" },
    { name: "Sitemap", path: "/sitemap" },
  ];
  return (
    <footer className="bg-[#120700] text-gray-400">
      <div className="max-w-7xl mx-auto py-3 px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
          <div>
            <h1 className="text-2xl  font-semibold tracking-[0.25em] text-[#f2d2b0]">
              NESTRO.
            </h1>
            <p className="mt-3 gap-7 text-md">
              Curated furniture for thoughtful homes. Crafted with
              intention,made to endure.
            </p>
            <div className="mt-8 flex overflow-hidden rounded-lg border border-[#3a2415]">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-[#2a1a10] px-3 py-2 outline-none text-white placeholder:text-gray-500"
              />
              <button className="bg-[#a87447] px-6 text-white font-medium hover:bg-[#925f35] transition">
                Subscribe
              </button>
            </div>
          </div>
          <div>
            <h2 className="text-md tracking-[0.3em] text-[#d9a66f] uppercase mb-4">
              Company
            </h2>
            <div className="flex flex-col gap-4 text-md">
              {FooterCompany.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    href={item.path}
                    key={index}
                    className={`${isActive ? "text-red-600" : ""}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div>
            <h2 className="text-md tracking-[0.3em] text-[#d9a66f] uppercase mb-4">
              Support
            </h2>

            <div className="flex flex-col gap-4 text-md">
              {FooterSupport.map((item, index) => {
                const isActive = pathname === item.path;

                return (
                  <Link
                    href={item.path}
                    key={index}
                    className={`${isActive ? "text-red-600" : ""}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          {/* For  follow us */}
          <div>
            <h2 className="text-md tracking-[0.3em] text-[#d9a66f] uppercase mb-4">
              Follow Us
            </h2>

            <div className="flex flex-col gap-4 text-md">
              {FooterFollowUs.map((item, index) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    href={item.path}
                    key={index}
                    rel="noopener noreferrer"
                    target={item.target}
                    className={`${isActive ? "text-red-500" : ""}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-8">
              <a
                href="https://www.instagram.com/reels/DVvuV6ciHFk?text=HA BHAI BOL  KYA HAAL CHAL  HAI TERE"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-[#5a3923] flex items-center justify-center hover:bg-[#2a1a10] transition"
              >
                <IoLogoInstagram size={20} />
              </a>
              <button className="w-12 h-12 rounded-full border border-[#5a3923] flex items-center justify-center hover:bg-[#2a1a10] transition">
               
                <a
                href="https://wa.me/918081010679?text=HA BHAI BOL  KYA HAAL CHAL  HAI TERE"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-[#5a3923] flex items-center justify-center hover:bg-[#2a1a10] transition"
              >

                <FaWhatsapp size={20} />
              </a>
              </button>

              <button className="w-12 h-12 rounded-full border border-[#5a3923] flex items-center justify-center hover:bg-[#2a1a10] transition">
                 <a
                href="https://www.youtube.com?text=HOTWIFE"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-[#5a3923] flex items-center justify-center hover:bg-[#2a1a10] transition"
              >

                <FaYoutube size={20} />
              </a>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#2a1a10]  mt-8 flex flex-col md:flex-row items-center justify-between gap-5 text-sm">
          <p>© 2026 Nestro. All rights reserved.</p>
          {
            FooterItems.map((item, index)=>{
              const isActive = pathname===item.path;
              return(
                <Link key={index} href={item.path} className={`${isActive?"text-2xl text-yellow-400":""}`}>{item.name}</Link>

              )
            })
          }

          {/* For button */}
          <div className="flex items-center gap-4"></div>
        </div>
      </div>
    </footer>
  );
}
