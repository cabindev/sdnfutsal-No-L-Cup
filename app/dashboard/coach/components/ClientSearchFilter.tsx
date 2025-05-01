// app/dashboard/coach/components/ClientSearchFilter.tsx
'use client';

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface ClientSearchFilterProps {
  defaultSearch?: string;
  defaultStatus?: string;
  defaultBatch?: string;
  batches?: Array<{
    id: number;
    batchNumber: number;
    year: number;
    isActive: boolean;
  }>;
}

export default function ClientSearchFilter({
  defaultSearch = '',
  defaultStatus = 'all',
  defaultBatch = 'all',
  batches = []
}: ClientSearchFilterProps) {
  const router = useRouter();
  const [search, setSearch] = useState(defaultSearch);
  const [status, setStatus] = useState(defaultStatus);
  const [batch, setBatch] = useState(defaultBatch);
  
  // อัพเดท query params และนำทางไปยัง URL ใหม่
  const updateSearch = useCallback(() => {
    const params = new URLSearchParams();
    
    if (search) {
      params.set('q', search);
    }
    
    if (status !== 'all') {
      params.set('status', status);
    }
    
    if (batch !== 'all') {
      params.set('batch', batch);
    }
    
    // รีเซ็ตหน้าเป็นหน้าแรกเมื่อมีการค้นหาใหม่
    params.set('page', '1');
    
    const queryString = params.toString();
    router.push(`/dashboard/coach${queryString ? `?${queryString}` : ''}`);
  }, [search, status, batch, router]);
  
  // reset การค้นหา
  const resetSearch = () => {
    setSearch('');
    setStatus('all');
    setBatch('all');
    router.push('/dashboard/coach');
  };
  
  // มีการใช้ตัวกรองหรือไม่
  const hasFilters = search || status !== 'all' || batch !== 'all';

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* ช่องค้นหา */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="ค้นหาโค้ช..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateSearch();
              }
            }}
          />
        </div>
        
        {/* ตัวกรองสถานะ */}
        <div className="w-full md:w-60">
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              // อัพเดทการค้นหาทันทีเมื่อเปลี่ยนสถานะ
              setTimeout(() => updateSearch(), 0);
            }}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <span>สถานะ:</span>
                <SelectValue placeholder="ทั้งหมด" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
              <SelectItem value="pending">รอการอนุมัติ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* ตัวกรองรุ่นอบรม */}
        <div className="w-full md:w-72">
          <Select
            value={batch}
            onValueChange={(value) => {
              setBatch(value);
              // อัพเดทการค้นหาทันทีเมื่อเปลี่ยนรุ่น
              setTimeout(() => updateSearch(), 0);
            }}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <span>รุ่นอบรม:</span>
                <SelectValue placeholder="ทั้งหมด" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              {batches.map((b) => (
                <SelectItem key={b.id} value={b.id.toString()}>
                  รุ่นที่ {b.batchNumber}/{b.year}
                  {b.isActive && " (เปิดรับสมัคร)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* ปุ่มค้นหา */}
        <div className="flex space-x-2">
          <Button 
            variant="default" 
            onClick={updateSearch}
            className="bg-futsal-navy hover:bg-futsal-navy/90"
          >
            <Search className="h-4 w-4 mr-2" />
            ค้นหา
          </Button>
          
          {hasFilters && (
            <Button 
              variant="outline" 
              onClick={resetSearch}
              className="border-gray-300"
            >
              <X className="h-4 w-4 mr-2" />
              ล้าง
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}