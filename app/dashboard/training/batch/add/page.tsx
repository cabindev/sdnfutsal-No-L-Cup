// app/dashboard/training/batch/add/page.tsx
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/lib/configs/auth/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BatchForm } from "../components/BatchForm";

export default async function AddBatchPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect("/auth/signin?callbackUrl=/dashboard/training/batch");
  }
  
  // คำนวณค่าเริ่มต้นสำหรับฟอร์ม
  const currentDate = new Date();
  const thaiYear = currentDate.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
  
  // กำหนดค่าเริ่มต้นสำหรับวันที่จัดอบรม (ประมาณ 1 เดือนจากวันนี้)
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() + 1);
  
  // กำหนดค่าเริ่มต้นสำหรับวันสิ้นสุดการอบรม (3 วันหลังจากวันเริ่มต้น)
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 2);
  
  // กำหนดค่าเริ่มต้นสำหรับวันสิ้นสุดการรับสมัคร (1 สัปดาห์ก่อนวันเริ่มต้น)
  const registrationEndDate = new Date(startDate);
  registrationEndDate.setDate(registrationEndDate.getDate() - 7);
  
  // ฟังก์ชันสำหรับจัดรูปแบบวันที่ให้เป็น YYYY-MM-DD สำหรับ input type="date"
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // ค่าเริ่มต้นสำหรับการสร้างรุ่นใหม่
  const initialBatchData = {
    batchNumber: '',
    year: thaiYear.toString(),
    startDate: formatDateForInput(startDate),
    endDate: formatDateForInput(endDate),
    location: '',
    maxParticipants: 30,
    registrationEndDate: formatDateForInput(registrationEndDate),
    description: '',
    isActive: true
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard/training/batch">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            กลับไปหน้ารายการ
          </Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-futsal-navy">สร้างรุ่นอบรมใหม่</h1>
        <p className="text-gray-600">กรอกข้อมูลเพื่อสร้างรุ่นอบรมใหม่สำหรับโค้ชฟุตซอล</p>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <BatchForm initialData={initialBatchData} />
      </div>
    </div>
  );
}