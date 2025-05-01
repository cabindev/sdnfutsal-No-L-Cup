// app/dashboard/coach/[id]/page.tsx
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/lib/configs/auth/authOptions';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/app/lib/db';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Edit, Calendar, Pencil, Award, User, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { CoachDeleteButton } from '../components/CoachDeleteButton';

export default async function CoachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard/coach');
  }
  
  // ต้องรอ params ด้วย await ก่อนเข้าถึง params.id
  const resolvedParams = await params;
  const coachId = Number(resolvedParams.id);
  
  if (isNaN(coachId)) {
    notFound();
  }
  
  const isAdmin = session.user.role === 'ADMIN';
  
  // ดึงข้อมูลโค้ช
  const coach = await prisma.coach.findUnique({
    where: { id: coachId },
    include: {
      user: true,
      location: true,
      batchParticipations: {
        include: {
          batch: true,
        },
      },
    },
  });
  
  if (!coach) {
    notFound();
  }
  
  // ตรวจสอบสิทธิ์การเข้าถึง
  if (!isAdmin && coach.userId !== session.user.id) {
    redirect('/dashboard/coach');
  }
  
  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // ฟังก์ชันแปลงค่า enum เป็นข้อความ
  const translateGender = (gender: string) => {
    switch (gender) {
      case 'MALE': return 'ชาย';
      case 'FEMALE': return 'หญิง';
      case 'LGBTQ': return 'LGBTQ+';
      default: return gender;
    }
  };
  
  const translateReligion = (religion: string) => {
    switch (religion) {
      case 'BUDDHIST': return 'พุทธ';
      case 'CHRISTIAN': return 'คริสต์';
      case 'ISLAM': return 'อิสลาม';
      case 'HINDU': return 'ฮินดู';
      case 'OTHER': return 'อื่นๆ';
      default: return religion;
    }
  };
  
  const translateFoodPreference = (food: string) => {
    switch (food) {
      case 'GENERAL': return 'ทั่วไป';
      case 'VEGETARIAN': return 'มังสวิรัติ';
      case 'HALAL': return 'ฮาลาล (อิสลาม)';
      case 'JAY': return 'เจ';
      default: return food;
    }
  };
  
  const translateCoachStatus = (status: string) => {
    switch (status) {
      case 'CIVIL_SERVANT': return 'ข้าราชการ';
      case 'GOVERNMENT_EMPLOYEE': return 'ลูกจ้างราชการ';
      case 'ACADEMY_EMPLOYEE': return 'ลูกจ้าง Academy';
      case 'ACADEMY_OWNER': return 'เจ้าของ Academy';
      case 'VOLUNTEER': return 'อาสาสมัครจิตอาสา';
      case 'OTHER': return 'อื่นๆ';
      default: return status;
    }
  };
  
  const translateParticipationStatus = (status: string) => {
    switch (status) {
      case 'PENDING': return 'รอการอนุมัติ';
      case 'APPROVED': return 'อนุมัติแล้ว';
      case 'REJECTED': return 'ไม่อนุมัติ';
      case 'CANCELED': return 'ยกเลิกการเข้าร่วม';
      default: return status;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">ข้อมูลโค้ช</h1>
          <p className="text-gray-600">
            {coach.user.firstName} {coach.user.lastName}
            {coach.nickname && <span> "{coach.nickname}"</span>}
          </p>
        </div>
        
        <div className="flex space-x-2">
  <Link href="/dashboard/coach">
    <Button variant="outline">กลับไปหน้ารายการ</Button>
  </Link>
  <Link href={`/dashboard/coach/edit/${coach.id}`}>
    <Button className="flex items-center gap-2">
      <Edit className="h-4 w-4" />
      แก้ไขข้อมูล
    </Button>
  </Link>
  
  {/* เพิ่มปุ่มลบสำหรับ admin เท่านั้น */}
  {isAdmin && (
    <CoachDeleteButton 
      coachId={coach.id} 
      coachName={`${coach.user.firstName} ${coach.user.lastName}`} 
    />
  )}
</div>
      </div>
      
      {/* สถานะการอนุมัติ */}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* ข้อมูลส่วนตัว */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              ข้อมูลส่วนตัว
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <p className="text-sm text-gray-500">ชื่อ-นามสกุล</p>
                <p className="font-medium">{coach.user.firstName} {coach.user.lastName}</p>
              </div>
              
              {coach.nickname && (
                <div>
                  <p className="text-sm text-gray-500">ชื่อเล่น</p>
                  <p className="font-medium">{coach.nickname}</p>
                </div>
              )}
              
              {coach.teamName && (
                <div>
                  <p className="text-sm text-gray-500">ชื่อทีม</p>
                  <p className="font-medium">{coach.teamName}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">เพศ</p>
                <p className="font-medium">{translateGender(coach.gender)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">อายุ</p>
                <p className="font-medium">{coach.age} ปี</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">ศาสนา</p>
                <p className="font-medium">{translateReligion(coach.religion)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">เลขบัตรประชาชน</p>
                <p className="font-medium">{coach.idCardNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* ข้อมูลการติดต่อ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              ข้อมูลการติดต่อ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <p className="text-sm text-gray-500">อีเมล</p>
                <p className="font-medium">{coach.user.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">เบอร์โทรศัพท์</p>
                <p className="font-medium">{coach.phoneNumber}</p>
              </div>
              
              {coach.lineId && (
                <div>
                  <p className="text-sm text-gray-500">LINE ID</p>
                  <p className="font-medium">{coach.lineId}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">ที่อยู่</p>
                <p className="font-medium">{coach.address}</p>
              </div>
              
              {coach.location && (
                <div>
                  <p className="text-sm text-gray-500">พื้นที่</p>
                  <p className="font-medium">
                    ต.{coach.location.district} อ.{coach.location.amphoe} จ.{coach.location.province}
                    {coach.location.zone && <span> ({coach.location.zone})</span>}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* ข้อมูลเพิ่มเติม */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              ข้อมูลการทำงาน
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <p className="text-sm text-gray-500">สถานะการทำงาน</p>
                <p className="font-medium">{translateCoachStatus(coach.coachStatus)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">ประสบการณ์การเป็นโค้ช</p>
                <p className="font-medium">{coach.coachExperience} ปี</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">จำนวนครั้งที่เข้าร่วมการแข่งขัน</p>
                <p className="font-medium">{coach.participationCount} ครั้ง</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* ข้อมูลอื่นๆ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              ข้อมูลอื่นๆ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <p className="text-sm text-gray-500">ประเภทอาหารที่รับประทาน</p>
                <p className="font-medium">{translateFoodPreference(coach.foodPreference)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">ขนาดเสื้อ</p>
                <p className="font-medium">ไซส์ {coach.shirtSize}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">ความต้องการเข้าพัก</p>
                <p className="font-medium">{coach.accommodation ? 'ต้องการเข้าพัก' : 'ไม่ต้องการเข้าพัก'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">โรคประจำตัว</p>
                <p className="font-medium">
                  {coach.hasMedicalCondition 
                    ? coach.medicalCondition 
                    : 'ไม่มีโรคประจำตัว'}
                </p>
              </div>
              
              {coach.expectations && (
                <div>
                  <p className="text-sm text-gray-500">ความคาดหวัง</p>
                  <p className="font-medium">{coach.expectations}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* ประวัติการเข้าร่วมรุ่นอบรม */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            ประวัติการเข้าร่วมรุ่นอบรม
          </CardTitle>
          <CardDescription>ข้อมูลการลงทะเบียนเข้าร่วมอบรมทั้งหมด</CardDescription>
        </CardHeader>
        <CardContent>
          {coach.batchParticipations && coach.batchParticipations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-medium">รุ่นที่</th>
                    <th className="py-3 text-left font-medium">ปี</th>
                    <th className="py-3 text-left font-medium">สถานที่</th>
                    <th className="py-3 text-left font-medium">วันที่</th>
                    <th className="py-3 text-left font-medium">สถานะ</th>
                    <th className="py-3 text-left font-medium">การเข้าร่วม</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {coach.batchParticipations.map((participation) => (
                    <tr key={participation.id} className="hover:bg-gray-50">
                      <td className="py-3">{participation.batch.batchNumber}</td>
                      <td className="py-3">{participation.batch.year}</td>
                      <td className="py-3">{participation.batch.location}</td>
                      <td className="py-3">{formatDate(participation.batch.startDate)} - {formatDate(participation.batch.endDate)}</td>
                      <td className="py-3">
                        <Badge
                          className={
                            participation.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            participation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            participation.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {translateParticipationStatus(participation.status)}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge className={participation.isAttended ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                          {participation.isAttended ? 'เข้าร่วมแล้ว' : 'ยังไม่ได้เข้าร่วม'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">ยังไม่มีประวัติการเข้าร่วมอบรม</p>
          )}
        </CardContent>
      </Card>
      
      {/* ข้อมูลการสร้างและอัพเดต */}
      <div className="text-sm text-gray-500 mt-6">
        <p>สร้างเมื่อ: {formatDate(coach.createdAt)}</p>
        <p>อัพเดตล่าสุด: {formatDate(coach.updatedAt)}</p>
      </div>
    </div>
  );
}