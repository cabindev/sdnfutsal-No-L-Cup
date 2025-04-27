// app/coach/common/RegistrationSuccess.tsx
'use client';

import { Coach } from '../types/coach';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Check, User, MapPin, Phone, Calendar } from 'lucide-react';

interface RegistrationSuccessProps {
  formData: Partial<Coach>;
}

export default function RegistrationSuccess({ formData }: RegistrationSuccessProps) {
  return (
    <div className="space-y-8 text-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">ลงทะเบียนสำเร็จ!</h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
         ขอบคุณที่ลงทะเบียนเป็นโค้ชกับเรา ข้อมูลของคุณได้รับการบันทึกแล้ว
       </p>
     </div>

     <div className="bg-orange-50 rounded-lg border border-orange-100 p-4 max-w-md mx-auto text-left">
       <h3 className="font-medium text-orange-800 mb-3">ข้อมูลของคุณ</h3>
       
       <div className="space-y-3">
         <div className="flex items-center">
           <User className="h-4 w-4 text-orange-600 mr-2" />
           <div>
             <p className="text-sm font-medium text-gray-900">
               {formData.gender === 'MALE' ? 'นาย' : formData.gender === 'FEMALE' ? 'นางสาว' : ''} {formData.user?.firstName} {formData.user?.lastName}
             </p>
             {formData.nickname && (
               <p className="text-xs text-gray-600">"{formData.nickname}"</p>
             )}
           </div>
         </div>
         
         {formData.location && (
           <div className="flex items-start">
             <MapPin className="h-4 w-4 text-orange-600 mr-2 mt-0.5" />
             <div>
               <p className="text-sm text-gray-900">
                 ตำบล{formData.location.district}, อำเภอ{formData.location.amphoe}, จังหวัด{formData.location.province}
               </p>
             </div>
           </div>
         )}
         
         {formData.phoneNumber && (
           <div className="flex items-center">
             <Phone className="h-4 w-4 text-orange-600 mr-2" />
             <p className="text-sm text-gray-900">{formData.phoneNumber}</p>
           </div>
         )}
         
         <div className="flex items-center">
           <Calendar className="h-4 w-4 text-orange-600 mr-2" />
           <p className="text-sm text-gray-900">
             ประสบการณ์ {formData.coachExperience || 0} ปี
           </p>
         </div>
       </div>
     </div>
     
     <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
       <Link href="/auth/signin">
         <Button variant="default" className="w-full sm:w-auto">
           เข้าสู่ระบบ
         </Button>
       </Link>
       
       <Link href="/">
         <Button variant="outline" className="w-full sm:w-auto">
           กลับไปยังหน้าหลัก
         </Button>
       </Link>
     </div>
   </div>
 );
}