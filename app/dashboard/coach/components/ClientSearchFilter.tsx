// app/dashboard/coach/components/ClientSearchFilter.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Search, X } from "lucide-react";

interface ClientSearchFilterProps {
  defaultSearch: string;
  defaultStatus: string;
  defaultBatch: string;
  defaultZone: string;
  batches: { id: number; batchNumber: number; year: number; isActive: boolean }[];
  zones: { zone: string; count: number }[];
}

export default function ClientSearchFilter({
  defaultSearch,
  defaultStatus,
  defaultBatch,
  defaultZone,
  batches,
  zones,
}: ClientSearchFilterProps) {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(defaultSearch);
  const [status, setStatus] = useState(defaultStatus);
  const [batch, setBatch] = useState(defaultBatch);
  const [zone, setZone] = useState(defaultZone);
  const [isPending, setIsPending] = useState(false);

  // เมื่อมีการเปลี่ยนค่าใดๆ ให้รีเซ็ต page เป็น 1
  const applyFilters = () => {
    setIsPending(true);
    
    // สร้าง URLSearchParams จาก searchParams ปัจจุบัน
    const params = new URLSearchParams();
    
    // เก็บค่า pageSize เดิมไว้ (ถ้ามี)
    const currentPageSize = searchParams.get("pageSize");
    if (currentPageSize) {
      params.set("pageSize", currentPageSize);
    }
    
    // ตั้งค่าใหม่
    if (search) params.set("q", search);
    if (status !== "all") params.set("status", status);
    if (batch !== "all") params.set("batch", batch);
    if (zone !== "all") params.set("zone", zone);
    
    // รีเซ็ต page เป็น 1 เสมอเมื่อเปลี่ยนฟิลเตอร์
    params.set("page", "1");
    
    // นำทางไปยัง URL ใหม่
    const url = `/dashboard/coach?${params.toString()}`;
    console.log("Applying filters, navigating to:", url);
    
    // ใช้ window.location.href เพื่อทำ hard refresh
    window.location.href = url;
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setBatch("all");
    setZone("all");
    
    // สร้าง URLSearchParams ใหม่
    const params = new URLSearchParams();
    
    // เก็บค่า pageSize เดิมไว้ (ถ้ามี)
    const currentPageSize = searchParams.get("pageSize");
    if (currentPageSize) {
      params.set("pageSize", currentPageSize);
    }
    
    // นำทางไปยัง URL ใหม่
    const url = `/dashboard/coach${params.toString() ? `?${params.toString()}` : ''}`;
    console.log("Clearing filters, navigating to:", url);
    
    // ใช้ window.location.href เพื่อทำ hard refresh
    window.location.href = url;
  };

  useEffect(() => {
    setIsPending(false);
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Input
            placeholder="ค้นหาโค้ช..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10"
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-10 top-0 h-full flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสถานะ</SelectItem>
            <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
            <SelectItem value="pending">รอการอนุมัติ</SelectItem>
          </SelectContent>
        </Select>

        <Select value={batch} onValueChange={setBatch}>
          <SelectTrigger>
            <SelectValue placeholder="รุ่นอบรม" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกรุ่น</SelectItem>
            {batches.map((b) => (
              <SelectItem key={b.id} value={b.id.toString()}>
                รุ่น {b.batchNumber}/{b.year}
                {b.isActive && " (ปัจจุบัน)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={zone} onValueChange={setZone}>
          <SelectTrigger>
            <SelectValue placeholder="ภูมิภาค" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกภูมิภาค</SelectItem>
            {zones.map((z) => (
              <SelectItem key={z.zone} value={z.zone}>
                {z.zone} ({z.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button
          variant="default"
          onClick={applyFilters}
          disabled={isPending}
          className="bg-futsal-blue hover:bg-futsal-blue/90"
        >
          ค้นหา
        </Button>
        <Button
          variant="outline"
          onClick={clearFilters}
          disabled={
            isPending ||
            (search === "" && status === "all" && batch === "all" && zone === "all")
          }
        >
          ล้าง
        </Button>
      </div>
    </div>
  );
}