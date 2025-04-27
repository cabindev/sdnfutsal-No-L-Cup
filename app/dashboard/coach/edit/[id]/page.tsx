// app/dashboard/coach/edit/[id]/page.tsx
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/lib/configs/auth/authOptions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CoachEditForm from "../../components/CoachEditForm";
import { getCoach } from "@/app/coach/actions/coach/get";

export default async function EditCoachPage({ 
  params
}: { 
  params: Promise<{ id: string }>;
}) {
  // ตรวจสอบ session ของผู้ใช้
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/coach");
  }
  
  const resolvedParams = await params;
  const coachId = resolvedParams.id;
  
  if (!coachId) {
    notFound();
  }
  
  // ดึงข้อมูลโค้ชโดยใช้ server action
  const result = await getCoach(coachId);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const coach = result.data;
  const isAdmin = session.user.role === 'ADMIN';
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">แก้ไขข้อมูลโค้ช</h1>
          <p className="text-gray-600">
            {coach.user.firstName} {coach.user.lastName}
            {coach.nickname && <span> "{coach.nickname}"</span>}
          </p>
        </div>
        
        <Link href={`/dashboard/coach/${coach.id}`}>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            กลับไปหน้ารายละเอียด
          </Button>
        </Link>
      </div>
      
      {/* แสดงข้อมูลสถานะการอนุมัติ */}
      <div className={`p-4 rounded-lg mb-6 ${coach.isApproved ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${coach.isApproved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
            {coach.isApproved ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="ml-4">
            <h3 className={`font-medium ${coach.isApproved ? 'text-green-800' : 'text-yellow-800'}`}>
              {coach.isApproved ? 'อนุมัติแล้ว' : 'รอการอนุมัติ'}
            </h3>
            <p className={`text-sm ${coach.isApproved ? 'text-green-700' : 'text-yellow-700'}`}>
              {coach.isApproved 
                ? 'โค้ชท่านนี้ได้รับการอนุมัติให้เข้าร่วมแล้ว' 
                : 'โค้ชท่านนี้กำลังรอการอนุมัติจากผู้ดูแลระบบ'}
            </p>
          </div>
        </div>
      </div>
      
      {/* แบบฟอร์มแก้ไขข้อมูลโค้ช */}
      <CoachEditForm coach={coach} isAdmin={isAdmin} />
    </div>
  );
}