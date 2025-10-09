"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";

export type MenuItem = {
  id: string;
  label: string;
  href?: string;
  children?: MenuItem[];
  badge?: string;
};

export default function AdminSidebar({
  open,
  items,
  top = "4rem", // Chiều cao navbar mặc định 64px
  onClose,
}: {
  open: boolean;
  items: MenuItem[];
  top?: string;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (id: string) =>
    setOpenDropdowns((s) => ({ ...s, [id]: !s[id] }));

  const handleLinkClick = () => {
    if (onClose) onClose(); // Đóng sidebar khi click link ở mobile
  };

  return (
    <aside
      className={clsx(
        // Khi ở mobile => fixed để overlay, khi desktop => sticky
        "z-40 w-64 transition-transform duration-300 ease-in-out",
        open
          ? "translate-x-0 fixed left-0"
          : "-translate-x-full fixed left-0",
        "md:translate-x-0 md:sticky md:top-0 md:h-screen"
      )}
      style={{
        top, // cách top bằng chiều cao navbar
        height: `calc(100vh - ${top})`, // luôn đầy chiều cao dưới navbar
      }}
      aria-label="Sidebar"
    >
      <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <ul className="space-y-2 font-medium px-2 py-3">
          {items.map((item) => {
            const isActive = item.href && pathname.startsWith(item.href);

            if (item.children?.length) {
              return (
                <li key={item.id}>
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className="flex w-full items-center justify-between p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    <span>{item.label}</span>
                    <svg
                      className={clsx(
                        "w-3 h-3 transition-transform",
                        openDropdowns[item.id] && "rotate-180"
                      )}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  {openDropdowns[item.id] && (
                    <ul className="ml-4 mt-1 space-y-1 border-l pl-2 border-gray-200 dark:border-gray-700">
                      {item.children.map((child) => {
                        const childActive =
                          child.href && pathname.startsWith(child.href);
                        return (
                          <li key={child.id}>
                            <Link
                              href={child.href ?? "#"}
                              onClick={handleLinkClick}
                              className={clsx(
                                "block rounded-lg px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                                childActive
                                  ? "bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-white"
                                  : "text-gray-900 dark:text-gray-200"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.id}>
                <Link
                  href={item.href ?? "#"}
                  onClick={handleLinkClick}
                  className={clsx(
                    "flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-white"
                      : "text-gray-900 dark:text-gray-200"
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto inline-flex items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
