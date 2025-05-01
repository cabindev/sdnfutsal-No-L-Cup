// app/dashboard/coach/components/EmptyState.tsx
'use client';

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Users, Plus } from "lucide-react";

interface EmptyStateProps {
  search?: string;
  status?: string;
  batch?: string;
  isAdmin: boolean;
}

export default function EmptyState({ search, status, batch, isAdmin }: EmptyStateProps) {
  const hasFilters = search || (status && status !== 'all') || (batch && batch !== 'all');
  
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
      <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-gray-100">
        <Users className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-1">ไม่พบข้อมูลโค้ช</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {hasFilters
          ? 'ไม่พบข้อมูลโค้ชที่ตรงกับเงื่อนไขการค้นหา ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่' 
          : 'ยังไม่มีข้อมูลโค้ชในระบบ'}
      </p>
      
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {hasFilters && (
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/dashboard/coach'}
          >
            ล้างตัวกรอง
          </Button>
        )}
        
        {isAdmin && (
          <Button asChild className="bg-futsal-orange hover:bg-futsal-orange/90">
            <Link href="/dashboard/coach/add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              เพิ่มโค้ชใหม่
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}