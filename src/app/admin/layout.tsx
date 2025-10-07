"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "../../components/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);

  const menuItems = [
    { id: "blog", label: "Blog", href: "/admin/blog" },
    { id: "category", label: "Category", href: "/admin/category" },
    { id: "tag", label: "Tag", href: "/admin/tag" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 pt-6"> 

      <AdminSidebar open={open} items={menuItems} top="7rem" />

      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {children}
        </div>
      </main>
    </div>
  );
}
