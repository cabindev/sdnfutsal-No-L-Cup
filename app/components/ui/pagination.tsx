// app/components/ui/pagination.tsx
"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string | undefined>;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
}: PaginationProps) {
  // สร้าง query string จาก searchParams
  const createQueryString = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());

    // เพิ่ม params อื่นๆ
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    return params.toString();
  };

  // สร้าง href สำหรับลิงก์
  const createHref = (page: number) => {
    const queryString = createQueryString(page);
    return `${baseUrl}?${queryString}`;
  };

  return (
    <nav className="flex justify-center">
      <ul className="inline-flex items-center space-x-1 rounded-md shadow-sm">
        <li>
          <Link
            href={createHref(Math.max(1, currentPage - 1))}
            className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md border border-gray-300 ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            ก่อนหน้า
          </Link>
        </li>

        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;

          // แสดงเฉพาะหน้าปัจจุบัน หน้าแรก หน้าสุดท้าย และหน้าที่ใกล้กับหน้าปัจจุบัน
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <li key={page}>
                <Link
                  href={createHref(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 ${
                    isActive
                      ? "z-10 bg-futsal-orange text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </Link>
              </li>
            );
          }

          // แสดงจุดไข่ปลาสำหรับหน้าที่ถูกข้าม
          if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <li key={`ellipsis-${page}`}>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-700">
                  ...
                </span>
              </li>
            );
          }

          return null;
        })}

        <li>
          <Link
            href={createHref(Math.min(totalPages, currentPage + 1))}
            className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md border border-gray-300 ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : 0}
          >
            ถัดไป
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
