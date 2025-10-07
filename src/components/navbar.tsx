"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar as MTNavbar } from "@material-tailwind/react";
import {
  RectangleStackIcon,
  CommandLineIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/solid";

const NAV_MENU = [
  { name: "Home", icon: RectangleStackIcon, href: "/" },
  { name: "Blog", icon: Squares2X2Icon, href: "/blog" },
  { name: "Docs", icon: CommandLineIcon, href: "/docs" },
];

function NavItem({ name, href, icon }: any) {
  const Icon = icon; // Assign the prop to a variable that starts with a capital letter
  return (
    <Link
      href={href}
      className="flex items-center gap-2 font-medium text-gray-900 hover:text-blue-600 transition-colors"
    >
      <Icon className="h-5 w-5" />
      {name}
    </Link>
  );
}


export default function Navbar() {
  const router = useRouter();
  const [q, setQ] = React.useState("");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("search", q.trim());
    router.push(`/blog?${params.toString()}`);
  }

  return (
    <MTNavbar
      shadow={false}
      fullWidth
      className="bg-white border-gray-200 sticky top-0 z-50 border-b"
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-3">
          <img
            src="https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-1/552403725_2861723887358331_3843461949434406898_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=111&ccb=1-7&_nc_sid=1d2534&_nc_ohc=i3RM-VRi9osQ7kNvwGcbsvr&_nc_oc=AdmBTFDmrk0H1dhhKWnt6B3RQN7TW-mj6Ps4tIR3LqUW8BsPmesGEa4lPHENrRWVgV_Dz7-N2FaioDFvkw2hPLnY&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fsgn5-15.fna&_nc_gid=LQ8F-bLTIkRAn4e7SH_p4g&oh=00_AfcETGAPrt3hNnxs6AwrX3TnixTSk1cT_CgA3Gh3Nfo6Cw&oe=68E69973"
            alt="Logo"
            className="h-8 rounded-full"
          />
          <span className="text-2xl font-semibold text-black">Chanh blog</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {NAV_MENU.map((item) => (
            <li key={item.name}>
              <NavItem {...item} />
            </li>
          ))}
        </ul>

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

        <button
          className="lg:hidden text-gray-600 hover:text-gray-900"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </MTNavbar>
  );
}
