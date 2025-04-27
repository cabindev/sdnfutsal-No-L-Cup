//app/coach/register/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/lib/configs/auth/authOptions';
import CoachForm from '../components/CoachForm';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export const metadata: Metadata = {
  title: 'ลงทะเบียนโค้ช | SDN Futsal No L CUP',
  description: 'ลงทะเบียนเป็นโค้ชฟุตซอลกับทาง SDN Futsal No L CUP เพื่อเข้าร่วมกิจกรรมและรับข้อมูลข่าวสาร',
};

export default async function CoachRegisterPage() {
  const session = await getServerSession(authOptions);
  
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
              กรอกข้อมูลของคุณเพื่อลงทะเบียนเป็นโค้ชฟุตซอลกับ SDN Futsal No L CUP 
              และเข้าร่วมกิจกรรมต่างๆ ของเรา
            </p>
          </div>
          
          {session ? (
            <CoachForm isPublicRegistration={true} />
          ) : (
            <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-100">
              <h2 className="text-lg font-medium text-gray-900 mb-2">กรุณาเข้าสู่ระบบก่อนลงทะเบียน</h2>
              <p className="text-gray-600 mb-4">
                คุณจำเป็นต้องเข้าสู่ระบบก่อนจึงจะสามารถลงทะเบียนเป็นโค้ชได้
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/signin">
                  <Button variant="default" className="w-full sm:w-auto">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full sm:w-auto">
                    สมัครสมาชิก
                  </Button>
                </Link>
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-3">ข้อมูลเพิ่มเติม</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-1">สิทธิประโยชน์</h4>
                <p className="text-sm text-gray-600">
                  โค้ชที่ลงทะเบียนจะได้รับสิทธิพิเศษในการเข้าร่วมการแข่งขัน การอบรม 
                  และกิจกรรมพิเศษต่างๆ ที่ทาง SDN Futsal No L CUP จัดขึ้น
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