// app/dashboard/coach/components/EmptyState.tsx
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Plus, Search, X, AlertCircle } from "lucide-react";

interface EmptyStateProps {
  search?: string;
  status?: string;
  batch?: string;
  zone?: string;
  isAdmin?: boolean;
}

export default function EmptyState({ 
  search, 
  status, 
  batch,
  zone,
  isAdmin = false 
}: EmptyStateProps) {
  // ตรวจสอบว่ามีการใช้ตัวกรองหรือไม่
  const hasFilter = search || status !== 'all' || batch !== 'all' || zone !== 'all';
  
  // แสดงข้อความตามเงื่อนไขการค้นหา
  const getFilterMessage = () => {
    let messages = [];
    
    if (search) {
      messages.push(`คำค้นหา "${search}"`);
    }
    
    if (status !== 'all') {
      messages.push(`สถานะ ${status === 'pending' ? 'รอการอนุมัติ' : 'อนุมัติแล้ว'}`);
    }
    
    if (batch !== 'all') {
      messages.push(`รุ่นอบรมที่เลือก`);
    }
    
    if (zone !== 'all') {
      messages.push(`ภูมิภาค ${zone}`);
    }
    
    return messages.join(', ');
  };

  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-8 text-center">
      {hasFilter ? (
        <div>
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">ไม่พบข้อมูลโค้ช</h3>
          <p className="text-gray-600 mb-4">
            ไม่พบข้อมูลที่ตรงกับ {getFilterMessage()}
          </p>
          <Link href="/dashboard/coach">
            <Button variant="outline" className="mr-2">
              <X className="h-4 w-4 mr-2" />
              ล้างตัวกรอง
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">ยังไม่มีข้อมูลโค้ช</h3>
          <p className="text-gray-600 mb-4">
            ยังไม่มีข้อมูลโค้ชในระบบ {isAdmin ? "คุณสามารถเพิ่มโค้ชใหม่ได้" : ""}
          </p>
          
          {isAdmin && (
            <Link href="/dashboard/coach/add">
              <Button className="bg-futsal-orange hover:bg-futsal-orange/90">
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มโค้ช
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}