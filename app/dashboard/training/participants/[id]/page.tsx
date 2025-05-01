import { getServerSession } from "next-auth/next";
import authOptions from "@/app/lib/configs/auth/authOptions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { 
  Users, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar, 
  MapPin, 
  Mail,
  Phone,
  FileText,
  UserCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Textarea } from "@/app/components/ui/textarea";
import prisma from "@/app/lib/db";
import { 
  approveParticipant, 
  rejectParticipant,
  cancelParticipation,
  markAttendance,
  addParticipantNote
} from "@/app/coach/actions/training-batch/participant-actions";

export default async function ParticipantDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect("/auth/signin");
  }
  
  const resolvedParams = await params;
  const participantId = parseInt(resolvedParams.id);
  
  if (isNaN(participantId)) {
    notFound();
  }
  
  // ดึงข้อมูลผู้เข้าร่วม
  const participant = await prisma.batchParticipant.findUnique({
    where: { id: participantId },
    include: {
      coach: {
        include: {
          user: true,
          location: true,
          trainings: {
            include: {
              course: true
            }
          }
        }
      },
      batch: true
    }
  });
  
  if (!participant) {
    notFound();
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
  
  // ฟังก์ชันจัดรูปแบบเวลา
  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/training/participants">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            กลับไปยังรายการผู้เข้าร่วม
          </Button>
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-futsal-navy">รายละเอียดผู้เข้าร่วมอบรม</h1>
            <p className="text-gray-600">ข้อมูลการลงทะเบียนและประวัติโค้ช</p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex gap-2">
            <Button asChild variant="outline" className="border-futsal-blue text-futsal-blue">
              <Link href={`/dashboard/training/batch/${participant.batchId}/participants`}>
                <Users className="h-4 w-4 mr-2" />
                ผู้เข้าร่วมรุ่นนี้
              </Link>
            </Button>
            
            <Button asChild className="bg-futsal-blue hover:bg-futsal-blue/90">
              <Link href={`/dashboard/training/batch/${participant.batchId}`}>
                <Calendar className="h-4 w-4 mr-2" />
                ข้อมูลรุ่นอบรม
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* แสดงสถานะและปุ่มดำเนินการ */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between bg-gray-50 p-4 rounded-lg border">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-4">
            <Badge className={
              participant.status === 'APPROVED' ? 'bg-green-100 text-green-800 text-sm px-3 py-1' :
              participant.status === 'REJECTED' ? 'bg-red-100 text-red-800 text-sm px-3 py-1' :
              participant.status === 'CANCELED' ? 'bg-red-100 text-red-800 text-sm px-3 py-1' :
              'bg-yellow-100 text-yellow-800 text-sm px-3 py-1'
            }>
              {participant.status === 'APPROVED' ? 'อนุมัติแล้ว' :
               participant.status === 'REJECTED' ? 'ไม่อนุมัติ' :
               participant.status === 'CANCELED' ? 'ยกเลิก' :
               'รอการอนุมัติ'}
            </Badge>
          </div>
          
          <div>
            <div className="text-sm text-gray-500">วันที่ลงทะเบียน</div>
            <div className="font-medium">
              {formatDate(participant.registeredAt)} ({formatTime(participant.registeredAt)})
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {participant.status === 'PENDING' && (
            <>
              <form action={async () => {
                'use server';
                await approveParticipant(participant.id);
              }}>
                <Button type="submit" size="sm" className="bg-futsal-green hover:bg-futsal-green/90">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  อนุมัติ
                </Button>
              </form>
              
              <form action={async () => {
                'use server';
                await rejectParticipant(participant.id);
              }}>
                <Button type="submit" size="sm" variant="destructive">
                  <XCircle className="h-4 w-4 mr-1" />
                  ไม่อนุมัติ
                </Button>
              </form>
            </>
          )}
          
          {participant.status === 'APPROVED' && (
            <>
              <form action={async () => {
                'use server';
                await markAttendance(participant.id, !participant.isAttended);
              }}>
                <Button 
                  type="submit" 
                  size="sm" 
                  variant={participant.isAttended ? "outline" : "default"}
                  className={participant.isAttended ? "border-futsal-green text-futsal-green" : "bg-futsal-blue"}
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  {participant.isAttended ? "ยกเลิกการเข้าร่วม" : "บันทึกการเข้าร่วม"}
                </Button>
              </form>
              
              <form action={async () => {
                'use server';
                await cancelParticipation(participant.id);
              }}>
                <Button type="submit" size="sm" variant="destructive">
                  <XCircle className="h-4 w-4 mr-1" />
                  ยกเลิกการอนุมัติ
                </Button>
              </form>
            </>
          )}
          
          {participant.status === 'REJECTED' && (
            <form action={async () => {
              'use server';
              await approveParticipant(participant.id);
            }}>
              <Button type="submit" size="sm" className="bg-futsal-green hover:bg-futsal-green/90">
                <CheckCircle className="h-4 w-4 mr-1" />
                เปลี่ยนเป็นอนุมัติ
              </Button>
            </form>
          )}
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* ข้อมูลส่วนตัวของโค้ช */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">ข้อมูลส่วนตัว</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center pb-4 pt-2 border-b">
              <Avatar className="h-24 w-24 mb-3">
                <AvatarFallback className="text-xl bg-futsal-blue/10 text-futsal-blue">
                  {participant.coach.user.firstName?.charAt(0) || ''}
                  {participant.coach.user.lastName?.charAt(0) || ''}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-semibold text-center">
                {participant.coach.user.firstName} {participant.coach.user.lastName}
              </h3>
              
              <p className="text-gray-500 text-center mt-1">
                {participant.coach.teamName || 'โค้ชฟุตซอล'}
              </p>
            </div>
            
            <div className="space-y-3 pt-4">
              <div className="flex items-start">
                <Mail className="h-4 w-4 text-futsal-blue mt-1 mr-3" />
                <div>
                  <div className="text-sm font-medium">อีเมล</div>
                  <div className="text-gray-700">{participant.coach.user.email}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-4 w-4 text-futsal-blue mt-1 mr-3" />
                <div>
                  <div className="text-sm font-medium">เบอร์โทรศัพท์</div>
                  <div className="text-gray-700">{participant.coach.phoneNumber || '-'}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-futsal-blue mt-1 mr-3" />
                <div>
                  <div className="text-sm font-medium">จังหวัด</div>
                  <div className="text-gray-700">
                    {participant.coach.location?.province || '-'}
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t mt-4">
                <div className="text-sm font-medium mb-2">ข้อมูลประจำตัว</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="font-medium">เพศ</div>
                    <div className="text-gray-700">
                      {participant.coach.gender === 'MALE' ? 'ชาย' : 
                       participant.coach.gender === 'FEMALE' ? 'หญิง' : 'อื่นๆ'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">อายุ</div>
                    <div className="text-gray-700">{participant.coach.age} ปี</div>
                  </div>
                  <div>
                    <div className="font-medium">ขนาดเสื้อ</div>
                    <div className="text-gray-700">{participant.coach.shirtSize}</div>
                  </div>
                  <div>
                    <div className="font-medium">ศาสนา</div>
                    <div className="text-gray-700">
                      {participant.coach.religion === 'BUDDHIST' ? 'พุทธ' :
                       participant.coach.religion === 'CHRISTIAN' ? 'คริสต์' :
                       participant.coach.religion === 'ISLAM' ? 'อิสลาม' :
                       participant.coach.religion === 'HINDU' ? 'ฮินดู' :
                       'อื่นๆ'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="text-sm font-medium mb-2">ประสบการณ์</div>
                <div className="text-gray-700">
                  {participant.coach.coachExperience > 0 ? 
                    `${participant.coach.coachExperience} ปี` : 
                    'ไม่มีข้อมูล'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* ข้อมูลการลงทะเบียนและรุ่นอบรม */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">ข้อมูลการลงทะเบียน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 bg-futsal-blue/5 rounded-lg p-4 border border-futsal-blue/20">
              <div className="flex items-center mb-3">
                <Calendar className="h-5 w-5 text-futsal-blue mr-2" />
                <h3 className="text-lg font-medium text-futsal-navy">
                  รุ่นที่ {participant.batch.batchNumber}/{participant.batch.year}
                </h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">วันที่จัดอบรม</div>
                  <div className="text-gray-700">
                    {formatDate(participant.batch.startDate)} - {formatDate(participant.batch.endDate)}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">สถานที่</div>
                  <div className="text-gray-700">{participant.batch.location}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">จำนวนผู้เข้าร่วมสูงสุด</div>
                  <div className="text-gray-700">{participant.batch.maxParticipants} คน</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">สถานะรุ่น</div>
                  <Badge className={participant.batch.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {participant.batch.isActive ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* ประวัติการอบรม */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3 pb-2 border-b">ประวัติการอบรมและคุณวุฒิ</h3>
              
              {participant.coach.trainings && participant.coach.trainings.length > 0 ? (
                <div className="space-y-3">
                  {participant.coach.trainings.map((training, idx) => (
                    <div key={idx} className="flex items-start">
                      <FileText className="h-4 w-4 text-futsal-blue mt-1 mr-3" />
                      <div>
                        <div className="font-medium">{training.course.name}</div>
                        <div className="text-sm text-gray-500">
                          {training.trainingYear ? `ปี ${training.trainingYear}` : ''}
                          {training.notes ? ` • ${training.notes}` : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">
                  ไม่มีประวัติการอบรมที่บันทึกไว้
                </div>
              )}
            </div>
            
            {/* ข้อมูลเพิ่มเติม */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3 pb-2 border-b">ข้อมูลเพิ่มเติม</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">สถานะโค้ช</div>
                  <div className="text-gray-700">
                    {participant.coach.coachStatus === 'GOVERNMENT_EMPLOYEE' ? 'ข้าราชการ' :
                     participant.coach.coachStatus === 'CIVIL_SERVANT' ? 'พนักงานของรัฐ' :
                     participant.coach.coachStatus === 'ACADEMY_EMPLOYEE' ? 'พนักงานอคาเดมี่' :
                     participant.coach.coachStatus === 'ACADEMY_OWNER' ? 'เจ้าของอคาเดมี่' :
                     participant.coach.coachStatus === 'VOLUNTEER' ? 'อาสาสมัคร' :
                     'อื่นๆ'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">อาหาร</div>
                  <div className="text-gray-700">
                    {participant.coach.foodPreference === 'GENERAL' ? 'ทั่วไป' :
                     participant.coach.foodPreference === 'VEGETARIAN' ? 'มังสวิรัติ' :
                     participant.coach.foodPreference === 'HALAL' ? 'ฮาลาล' :
                     participant.coach.foodPreference === 'JAY' ? 'เจ' :
                     'ไม่ระบุ'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">ต้องการที่พัก</div>
                  <div className="text-gray-700">
                    {participant.coach.accommodation ? 'ต้องการ' : 'ไม่ต้องการ'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">จำนวนครั้งที่เข้าร่วมอบรม</div>
                  <div className="text-gray-700">
                    {participant.coach.participationCount} ครั้ง
                  </div>
                </div>
              </div>
              
              {participant.coach.hasMedicalCondition && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                  <div className="text-sm font-medium text-red-800">โรคประจำตัว/การแพ้</div>
                  <div className="text-red-700">{participant.coach.medicalCondition || '-'}</div>
                </div>
              )}
              
              {participant.coach.expectations && (
                <div className="mt-4">
                  <div className="text-sm font-medium">ความคาดหวังในการอบรม</div>
                  <div className="text-gray-700 mt-1">{participant.coach.expectations}</div>
                </div>
              )}
            </div>
            
            {/* บันทึกเพื่มเติม */}
            <div>
              <h3 className="text-md font-medium mb-3 pb-2 border-b">บันทึกเพิ่มเติม</h3>
              
              <form action={async (formData: FormData) => {
                'use server';
                const note = formData.get('note') as string;
                await addParticipantNote(participant.id, note);
              }}>
                <Textarea
                  name="note"
                  placeholder="เพิ่มบันทึกหรือหมายเหตุเกี่ยวกับผู้เข้าร่วมคนนี้..."
                  className="mb-3"
                  defaultValue={participant.notes || ''}
                  rows={4}
                />
                
                <Button type="submit" className="bg-futsal-navy">
                  บันทึกหมายเหตุ
                </Button>
              </form>
            </div>
          </CardContent>
          <CardFooter className="flex justify-start pt-2 border-t bg-gray-50">
            <div className="text-sm text-gray-500">
              ID: {participant.id}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}