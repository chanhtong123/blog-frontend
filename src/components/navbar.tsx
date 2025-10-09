"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar as MTNavbar } from "@material-tailwind/react";
import {
  RectangleStackIcon,
  CommandLineIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";

const NAV_MENU = [
  { name: "Home", icon: RectangleStackIcon, href: "/" },
  { name: "Blog", icon: Squares2X2Icon, href: "/blog" },
  { name: "Docs", icon: CommandLineIcon, href: "/docs" },
];

function NavItem({ name, href, icon, onClick }: any) {
  const Icon = icon;
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 font-medium text-gray-900 hover:text-blue-600 transition-colors"
    >
      <Icon className="h-5 w-5" />
      {name}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [openMenu, setOpenMenu] = useState(false); // 👈 menu toggle

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("search", q.trim());
    router.push(`/blog?${params.toString()}`);
    setOpenMenu(false); // đóng menu nếu search từ mobile
  }

  return (
    <MTNavbar
      shadow={false}
      fullWidth
      className="bg-white border-gray-200 sticky top-0 z-50 border-b"
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-1/552403725_2861723887358331_3843461949434406898_n.jpg"
            alt="Logo"
            width={32}
            height={32}
            unoptimized
            className="rounded-full"
          />
          <span className="text-2xl font-semibold text-black">Chanh blog</span>
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_MENU.map((item) => (
            <li key={item.name}>
              <NavItem {...item} />
            </li>
          ))}
        </ul>

        {/* SEARCH BAR (DESKTOP) */}
        <form
          onSubmit={onSearch}
          className="hidden lg:flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400"
        >
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search posts..."
            className="bg-transparent outline-none text-sm text-gray-900 w-48"
          />
        </form>

        {/* TOGGLE MENU (MOBILE) */}
        <button
          className="lg:hidden text-gray-600 hover:text-gray-900"
          aria-label="Toggle menu"
          onClick={() => setOpenMenu(!openMenu)}
        >
          {openMenu ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {openMenu && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pb-4 animate-slide-down">
          <ul className="flex flex-col gap-3 pt-3">
            {NAV_MENU.map((item) => (
              <li key={item.name}>
                <NavItem {...item} onClick={() => setOpenMenu(false)} />
              </li>
            ))}
          </ul>

          {/* SEARCH (MOBILE) */}
          <form
            onSubmit={onSearch}
            className="mt-3 flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search posts..."
              className="bg-transparent outline-none text-sm text-gray-900 w-full"
            />
          </form>
        </div>
      )}
    </MTNavbar>
  );
}
