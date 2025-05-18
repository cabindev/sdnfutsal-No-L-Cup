// app/components/ui/pagination.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: {
    q?: string;
    status?: string;
    batch?: string;
    zone?: string;
    pageSize?: string;
    [key: string]: string | undefined;
  };
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationProps) {
  const currentSearchParams = useSearchParams();
  
  // สร้าง URL สำหรับการเปลี่ยนหน้า
  const getPageUrl = (page: number) => {
    // สร้าง URLSearchParams จาก searchParams ปัจจุบัน
    const params = new URLSearchParams();
    
    // เก็บค่า parameters ทั้งหมดจาก URL ปัจจุบัน
    for (const [key, value] of currentSearchParams.entries()) {
      if (key !== 'page') {
        params.set(key, value);
      }
    }
    
    // ใช้ค่า searchParams ที่ส่งมา (ถ้าไม่มีในปัจจุบัน)
    for (const key in searchParams) {
      if (searchParams[key] && !params.has(key)) {
        params.set(key, searchParams[key]!);
      }
    }
    
    // ตั้งค่าหน้าปัจจุบัน
    params.set('page', page.toString());
    
    // สร้าง URL
    const queryString = params.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
  };

  // ฟังก์ชันสร้างปุ่มหมายเลขหน้า
  const renderPageNumbers = () => {
    const pages = [];
    
    // คำนวณว่าจะแสดงปุ่มเลขหน้าจากหน้าไหนถึงหน้าไหน
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(startPage + 4, totalPages);
    
    if (endPage - startPage < 4 && startPage > 1) {
      startPage = Math.max(1, endPage - 4);
    }

    // เพิ่มปุ่ม "หน้าแรก" ถ้าไม่ได้อยู่ที่หน้าแรกหรือใกล้ๆ
    if (startPage > 2) {
      pages.push(
        <Link key="first" href={getPageUrl(1)}>
          <Button
            variant="outline"
            size="sm"
            className="w-10"
          >
            1
          </Button>
        </Link>
      );
      
      // เพิ่ม ellipsis ถ้าหน้าแรกไม่ติดกับช่วงปัจจุบัน
      if (startPage > 3) {
        pages.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>
        );
      }
    }

    // สร้างปุ่มเลขหน้า
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={getPageUrl(i)}
          aria-current={currentPage === i ? "page" : undefined}
        >
          <Button
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            className={`w-10 ${
              currentPage === i ? "bg-futsal-orange hover:bg-futsal-orange/90" : ""
            }`}
          >
            {i}
          </Button>
        </Link>
      );
    }
    
    // เพิ่ม ellipsis และปุ่ม "หน้าสุดท้าย" ถ้าไม่ได้อยู่ที่หน้าสุดท้ายหรือใกล้ๆ
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>
        );
      }
      
      pages.push(
        <Link key="last" href={getPageUrl(totalPages)}>
          <Button
            variant="outline"
            size="sm"
            className="w-10"
          >
            {totalPages}
          </Button>
        </Link>
      );
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            หน้า <span className="font-medium">{currentPage}</span> จาก{" "}
            <span className="font-medium">{totalPages}</span> หน้า
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {/* ปุ่มก่อนหน้า */}
            <Link
              href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
              aria-disabled={currentPage <= 1}
              tabIndex={currentPage <= 1 ? -1 : 0}
              className={currentPage <= 1 ? "pointer-events-none" : ""}
            >
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                className="rounded-l-md p-2"
              >
                <span className="sr-only">ก่อนหน้า</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            
            {/* ปุ่มหมายเลขหน้า */}
            {renderPageNumbers()}
            
            {/* ปุ่มถัดไป */}
            <Link
              href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
              aria-disabled={currentPage >= totalPages}
              tabIndex={currentPage >= totalPages ? -1 : 0}
              className={currentPage >= totalPages ? "pointer-events-none" : ""}
            >
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                className="rounded-r-md p-2"
              >
                <span className="sr-only">ถัดไป</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </div>
      
      {/* สำหรับมือถือ */}
      <div className="flex w-full sm:hidden justify-between">
        <Link
          href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
          aria-disabled={currentPage <= 1}
          tabIndex={currentPage <= 1 ? -1 : 0}
          className={currentPage <= 1 ? "pointer-events-none" : ""}
        >
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            ก่อนหน้า
          </Button>
        </Link>
        
        <span className="flex items-center text-sm">
          หน้า {currentPage} จาก {totalPages}
        </span>
        
        <Link
          href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
          aria-disabled={currentPage >= totalPages}
          tabIndex={currentPage >= totalPages ? -1 : 0}
          className={currentPage >= totalPages ? "pointer-events-none" : ""}
        >
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1"
          >
            ถัดไป
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}