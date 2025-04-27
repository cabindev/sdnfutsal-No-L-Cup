// app/dashboard/training/batch/components/EmptyBatchState.tsx
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Calendar, Plus } from "lucide-react";

interface EmptyBatchStateProps {
  filter: string;
}

export default function EmptyBatchState({ filter }: EmptyBatchStateProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-8 text-center mt-4">
      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-800 mb-1">ไม่พบรุ่นการอบรม</h3>
      <p className="text-gray-600 mb-4">
        {filter !== 'all' 
          ? 'ไม่พบรุ่นอบรมที่ตรงกับเงื่อนไขที่เลือก' 
          : 'เริ่มสร้างรุ่นการอบรมใหม่เพื่อเปิดรับสมัครโค้ช'}
      </p>
      <Button asChild className="bg-futsal-orange hover:bg-futsal-orange/90">
        <Link href="/dashboard/training/batch/add">
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มรุ่นอบรมใหม่
        </Link>
      </Button>
    </div>
  );
}