"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "@/components/admin-sidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { id: "blog", label: "Blog", href: "/admin/blog" },
    { id: "category", label: "Category", href: "/admin/category" },
    { id: "tag", label: "Tag", href: "/admin/tag" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Admin Panel
        </h1>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed md:sticky md:top-0 z-40 w-64 h-[calc(100vh-4rem)] md:h-screen transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out 
            ${open ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 md:block`}
        >
          <AdminSidebar
            open={open}
            items={menuItems}
            top="4rem"
            onClose={() => setOpen(false)}
          />
        </aside>

        {/* Overlay khi mở trên mobile */}
        {open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 w-full mt-16 md:mt-0">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
