// app/coach/register/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/lib/configs/auth/authOptions';
import CoachForm from '../components/CoachForm';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/db';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';

export const metadata: Metadata = {
  title: 'ลงทะเบียนโค้ช T-License | SDN Futsal No L CUP 2568',
  description: 'ลงทะเบียนเข้ารับการอบรมโค้ชฟุตซอล T-License ประจำปี 2568 กับทาง SDN Futsal No L CUP',
};

export default async function CoachRegisterPage() {
  const session = await getServerSession(authOptions);
  
  // ตรวจสอบว่ามี session หรือไม่
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/coach/register');
  }
  
  // ตรวจสอบว่าผู้ใช้ได้ลงทะเบียนเป็นโค้ชแล้วหรือไม่
  const existingCoach = await prisma.coach.findFirst({
    where: { userId: session.user.id },
    include: {
      batchParticipations: {
        include: {
          batch: true
        }
      }
    }
  });
  
  return (
    <div className="min-h-screen bg-[#2c2f72] pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* ปุ่มกลับหน้าหลักแบบเรียบง่าย */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            asChild
          >
            <Link href="/">
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>หน้าหลัก</span>
            </Link>
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8 border border-orange-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">ลงทะเบียนเป็นโค้ช T-License</h1>
            <p className="text-gray-600 mt-2 max-w-lg mx-auto">
              ลงทะเบียนเข้ารับการอบรมโค้ชฟุตซอล T-License ประจำปี 2568 กับ SDN Futsal No L CUP
            </p>
            
            {/* เพิ่มแถบบอกรุ่นที่เปิดรับสมัคร */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
              <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-100 inline-flex items-center">
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">รุ่น 1</span>
                <span className="text-blue-800">13-17 มิถุนายน 2568</span>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-full border border-green-100 inline-flex items-center">
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">รุ่น 2</span>
                <span className="text-green-800">19-23 มิถุนายน 2568</span>
              </div>
            </div>
          </div>
          
          {existingCoach ? (
            <div className="p-6 bg-orange-50 rounded-lg border border-orange-100 mb-6">
              <Alert variant="warning">
                <AlertTitle className="text-orange-800 text-lg font-medium">คุณได้ลงทะเบียนเป็นโค้ชแล้ว</AlertTitle>
                <AlertDescription className="text-orange-700 mt-2">
                  <p>คุณได้ลงทะเบียนเป็นโค้ชในระบบเรียบร้อยแล้ว</p>
                  
                  {existingCoach.batchParticipations && existingCoach.batchParticipations.length > 0 ? (
                    <div className="mt-4">
                      <p className="font-medium">รุ่นที่คุณลงทะเบียน:</p>
                      <ul className="mt-2 list-disc list-inside">
                        {existingCoach.batchParticipations.map((participation) => (
                          <li key={participation.id}>
                            รุ่นที่ {participation.batch.batchNumber}/{participation.batch.year}
                            <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {participation.status === 'PENDING' ? 'รอการอนุมัติ' : 
                               participation.status === 'APPROVED' ? 'อนุมัติแล้ว' : 
                               participation.status === 'REJECTED' ? 'ไม่อนุมัติ' : 'ยกเลิก'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-2">ยังไม่มีรุ่นการอบรมที่ลงทะเบียน</p>
                  )}
                  
                  <div className="mt-4 flex space-x-4">
                    <Button asChild>
                      <Link href="/dashboard/coach">
                        ดูข้อมูลการลงทะเบียน
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/coach/${existingCoach.id}`}>
                        แก้ไขข้อมูล
                      </Link>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <CoachForm isPublicRegistration={true} />
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-3">ข้อมูลเพิ่มเติม</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-1">สิทธิประโยชน์</h4>
                <p className="text-sm text-gray-600">
                  โค้ชที่ผ่านการอบรมจะได้รับประกาศนียบัตร T-License และสิทธิพิเศษในการเข้าร่วมกิจกรรมต่างๆ ที่ทาง SDN Futsal No L CUP จัดขึ้น
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h4 className="font-medium text-green-800 mb-1">การอนุมัติ</h4>
                <p className="text-sm text-gray-600">
                  หลังจากลงทะเบียน ทีมงานจะตรวจสอบข้อมูลและแจ้งผลการอนุมัติผ่านทางอีเมล
                  หรือเบอร์โทรศัพท์ที่คุณให้ไว้ภายใน 3-5 วันทำการ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}