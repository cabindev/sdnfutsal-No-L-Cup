// app/dashboard/coach/components/PageSizeSelector.tsx
"use client";

import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface PageSizeSelectorProps {
  pageSize: number;
}

export default function PageSizeSelector({ pageSize }: PageSizeSelectorProps) {
  const searchParams = useSearchParams();
  
  const handleChangePageSize = (value: string) => {
    console.log("Changing pageSize to:", value);
    
    // ใช้ hard refresh แทน client navigation
    const params = new URLSearchParams(searchParams.toString());
    
    // เอาค่าเดิมทั้งหมด
    searchParams.forEach((value, key) => {
      if (key !== 'pageSize' && key !== 'page') {
        params.set(key, value);
      }
    });
    
    // ตั้งค่า pageSize และ page
    params.set('pageSize', value);
    params.set('page', '1');
    
    const url = `/dashboard/coach?${params.toString()}`;
    console.log("Hard refreshing to:", url);
    
    // ใช้ window.location.href เพื่อทำ hard refresh
    window.location.href = url;
  };
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">แสดง:</span>
      <Select value={pageSize.toString()} onValueChange={handleChangePageSize}>
        <SelectTrigger className="w-24 h-9 rounded-md border border-gray-300 text-sm flex items-center justify-center">
          <SelectValue
            placeholder={pageSize.toString()}
            className="text-center"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm text-gray-600">รายการต่อหน้า</span>
    </div>
  );
}