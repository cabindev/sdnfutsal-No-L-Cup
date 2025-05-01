// app/dashboard/training/page.tsx
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/lib/configs/auth/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  ChevronRight, 
  CalendarDays, 
  BookOpen,
  GraduationCap,
  UserPlus,
  Activity
} from "lucide-react";
import prisma from "@/app/lib/db";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";

export default async function TrainingPage({
  searchParams
}: {
  searchParams: Promise<{ filter?: string; }>
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/training");
  }
  
  const userId = session.user.id;
  const isAdmin = session.user.role === 'ADMIN';
  const resolvedParams = await searchParams;
  const filter = resolvedParams.filter || 'all';
  
  // ดึงข้อมูลโค้ชของผู้ใช้งานปัจจุบัน (ถ้ามี)
  const coach = await prisma.coach.findFirst({
    where: { userId }
  });
  
  // สร้างเงื่อนไขการค้นหารุ่นอบรม
  let where: any = { isActive: true };
  
  if (filter === 'registered' && coach) {
    where = {
      participants: {
        some: {
          coachId: coach.id
        }
      }
    };
  } else if (filter === 'upcoming') {
    where.startDate = {
      gte: new Date()
    };
  } else if (filter === 'past') {
    where.endDate = {
      lt: new Date()
    };
  }
  
  // ดึงรุ่นอบรมตามเงื่อนไข
  const batches = await prisma.trainingBatch.findMany({
    where,
    orderBy: [
      { year: 'desc' },
      { batchNumber: 'desc' }
    ],
    include: {
      _count: {
        select: { participants: true }
      },
      participants: coach ? {
        where: { coachId: coach.id },
        select: { id: true, status: true }
      } : undefined
    }
  });
  
  // ดึงข้อมูลผู้ลงทะเบียนล่าสุด 5 คน
  const recentRegistrations = await prisma.batchParticipant.findMany({
    take: 5,
    orderBy: {
      registeredAt: 'desc'
    },
    include: {
      coach: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      },
      batch: true
    }
  });
  
  // สถิติการอบรม
  const stats = {
    totalBatches: await prisma.trainingBatch.count(),
    openBatches: await prisma.trainingBatch.count({ where: { isActive: true } }),
    myRegistrations: coach ? await prisma.batchParticipant.count({
      where: { coachId: coach.id }
    }) : 0,
    completedCourses: coach ? await prisma.batchParticipant.count({
      where: { 
        coachId: coach.id,
        status: 'APPROVED',
        batch: {
          endDate: {
            lt: new Date()
          }
        }
      }
    }) : 0
  };
  
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
  
  // คำนวณสถานะของการลงทะเบียน
  const getRegistrationStatus = (batch: any) => {
    if (!coach || !batch.participants || batch.participants.length === 0) {
      return { status: 'NOT_REGISTERED', label: 'ยังไม่ได้ลงทะเบียน', color: 'bg-gray-100 text-gray-800' };
    }
    
    const status = batch.participants[0].status;
    
    if (status === 'PENDING') {
      return { status, label: 'รอการอนุมัติ', color: 'bg-yellow-100 text-yellow-800' };
    } else if (status === 'APPROVED') {
      return { status, label: 'อนุมัติแล้ว', color: 'bg-green-100 text-green-800' };
    } else if (status === 'REJECTED') {
      return { status, label: 'ไม่อนุมัติ', color: 'bg-red-100 text-red-800' };
    } else if (status === 'CANCELED') {
      return { status, label: 'ยกเลิกการเข้าร่วม', color: 'bg-red-100 text-red-800' };
    }
    
    return { status: 'UNKNOWN', label: 'ไม่ทราบสถานะ', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-futsal-navy">การอบรมโค้ชฟุตซอล</h1>
          <p className="text-gray-600">รายการอบรมและการลงทะเบียนเข้าร่วม</p>
        </div>
        
        {isAdmin && (
          <Button asChild className="mt-4 sm:mt-0 bg-futsal-orange hover:bg-futsal-orange/90">
            <Link href="/dashboard/training/batch">
              จัดการรุ่นการอบรม
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        )}
      </div>
      
      {/* สถิติการอบรม */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-futsal-blue/10 to-futsal-navy/5 border-futsal-blue/20">
          <CardContent className="p-4 flex items-center">
            <div className="bg-futsal-blue/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <Calendar className="h-6 w-6 text-futsal-blue" />
            </div>
            <div>
              <p className="text-sm text-gray-500">รุ่นอบรมทั้งหมด</p>
              <h3 className="text-2xl font-bold text-futsal-navy">{stats.totalBatches}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-futsal-green/10 to-futsal-green/5 border-futsal-green/20">
          <CardContent className="p-4 flex items-center">
            <div className="bg-futsal-green/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <BookOpen className="h-6 w-6 text-futsal-green" />
            </div>
            <div>
              <p className="text-sm text-gray-500">รุ่นที่เปิดรับสมัคร</p>
              <h3 className="text-2xl font-bold text-futsal-green">{stats.openBatches}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-futsal-orange/10 to-futsal-orange/5 border-futsal-orange/20">
          <CardContent className="p-4 flex items-center">
            <div className="bg-futsal-orange/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-futsal-orange" />
            </div>
            <div>
              <p className="text-sm text-gray-500">การลงทะเบียนของฉัน</p>
              <h3 className="text-2xl font-bold text-futsal-orange">{stats.myRegistrations}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-4 flex items-center">
            <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <GraduationCap className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">หลักสูตรที่สำเร็จ</p>
              <h3 className="text-2xl font-bold text-purple-600">{stats.completedCourses}</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* ตัวกรอง */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Link href="/dashboard/training">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                className={filter === 'all' ? 'bg-futsal-navy' : ''}
              >
                ทั้งหมด
              </Button>
            </Link>
            <Link href="/dashboard/training?filter=registered">
              <Button 
                variant={filter === 'registered' ? 'default' : 'outline'}
                size="sm"
                className={filter === 'registered' ? 'bg-futsal-orange' : ''}
              >
                ที่ลงทะเบียนแล้ว
              </Button>
            </Link>
            <Link href="/dashboard/training?filter=upcoming">
              <Button 
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                size="sm"
                className={filter === 'upcoming' ? 'bg-futsal-green' : ''}
              >
                กำลังจะมาถึง
              </Button>
            </Link>
            <Link href="/dashboard/training?filter=past">
              <Button 
                variant={filter === 'past' ? 'default' : 'outline'}
                size="sm"
                className={filter === 'past' ? 'bg-gray-600' : ''}
              >
                ผ่านไปแล้ว
              </Button>
            </Link>
          </div>
          
          {/* แสดงรายการรุ่นอบรม */}
          {batches.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">ไม่พบรุ่นการอบรม</h3>
              <p className="text-gray-600 mb-4">
                {filter !== 'all' 
                  ? 'ไม่พบรุ่นอบรมที่ตรงกับเงื่อนไขที่เลือก' 
                  : 'ขณะนี้ยังไม่มีรุ่นการอบรมที่เปิดรับสมัคร'}
              </p>
              <Link href="/dashboard/training">
                <Button variant="outline">
                  แสดงรุ่นอบรมทั้งหมด
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batches.map((batch) => {
                const registrationStatus = getRegistrationStatus(batch);
                const now = new Date();
                const batchStarted = new Date(batch.startDate) <= now;
                const batchEnded = new Date(batch.endDate) < now;
                const isFull = batch._count.participants >= batch.maxParticipants;
                const registrationClosed = new Date(batch.registrationEndDate) < now;
                
                return (
                  <Card key={batch.id} className="overflow-hidden border border-gray-200 hover:border-futsal-orange/50 hover:shadow-md transition-all duration-200">
                    <div className={`h-1.5 w-full ${batch.isActive ? 'bg-futsal-green' : 'bg-gray-300'}`}></div>
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-futsal-navy">
                            รุ่นที่ {batch.batchNumber}/{batch.year}
                          </h3>
                          <Badge className={registrationStatus.color}>
                            {registrationStatus.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          การอบรมโค้ชฟุตซอล รุ่นที่ {batch.batchNumber}/{batch.year}
                        </p>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start">
                          <CalendarDays className="h-4 w-4 text-futsal-orange mt-0.5 mr-2" />
                          <div className="text-sm text-gray-700">
                            {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 text-futsal-orange mt-0.5 mr-2" />
                          <div className="text-sm text-gray-700">
                            ตลอดวัน (เต็มวัน)
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-futsal-orange mt-0.5 mr-2" />
                          <div className="text-sm text-gray-700">{batch.location}</div>
                        </div>
                        <div className="flex items-start">
                          <Users className="h-4 w-4 text-futsal-orange mt-0.5 mr-2" />
                          <div className="text-sm text-gray-700">
                            {batch._count.participants} / {batch.maxParticipants} คน
                            {isFull && <span className="text-red-500 ml-1">(เต็มแล้ว)</span>}
                          </div>
                        </div>
                      </div>
                    </CardContent>

                  </Card>
                );
              })}
            </div>
          )}
        </div>
        
        {/* ข้อมูลเพิ่มเติม - สไตล์เรียบง่ายขึ้น */}
        <div>
          {/* ผู้ลงทะเบียนล่าสุด */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center">
                <Activity className="h-5 w-5 mr-2 text-futsal-orange" />
                ผู้ลงทะเบียนล่าสุด
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pt-0 pb-4">
              {recentRegistrations.length > 0 ? (
                <div className="space-y-4">
                  {recentRegistrations.map((registration) => (
                    <div key={registration.id} className="flex items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex-shrink-0 mr-3">
                        <Avatar className="h-10 w-10 bg-futsal-blue/10 border border-futsal-blue/20">
                          <AvatarFallback className="text-futsal-blue">
                            {registration.coach.user.firstName?.charAt(0) || ''}
                            {registration.coach.user.lastName?.charAt(0) || ''}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {registration.coach.user.firstName} {registration.coach.user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          ลงทะเบียนรุ่นที่ {registration.batch.batchNumber}/{registration.batch.year}
                        </p>
                        <div className="flex items-center mt-1">
                          <Badge className={
                            registration.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            registration.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            registration.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {registration.status === 'APPROVED' ? 'อนุมัติแล้ว' :
                            registration.status === 'REJECTED' ? 'ไม่อนุมัติ' :
                            registration.status === 'CANCELED' ? 'ยกเลิก' :
                            'รอการอนุมัติ'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <UserPlus className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>ยังไม่มีการลงทะเบียน</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gray-50 border-t px-6 py-3">
              <Link href="/dashboard/training/participants" className="text-sm text-futsal-orange hover:text-futsal-orange/80 flex items-center">
                ดูผู้ลงทะเบียนทั้งหมด
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>
          
          {/* แสดงรุ่นที่กำลังจะปิดรับสมัคร - แบบย่อลง */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-500" />
                กำลังจะปิดรับสมัคร
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pt-0 pb-4">
              {batches.filter(batch => 
                batch.isActive && 
                new Date(batch.registrationEndDate) > new Date() &&
                new Date(batch.registrationEndDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 // 7 วัน
              ).length > 0 ? (
                <div className="space-y-3">
                  {batches
                    .filter(batch => 
                      batch.isActive && 
                      new Date(batch.registrationEndDate) > new Date() &&
                      new Date(batch.registrationEndDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                    )
                    .sort((a, b) => new Date(a.registrationEndDate).getTime() - new Date(b.registrationEndDate).getTime())
                    .slice(0, 3)
                    .map(batch => (
                      <Link 
                        key={batch.id}
                        href={`/dashboard/training/${batch.id}`}
                        className="block p-3 border border-gray-100 rounded-lg hover:border-amber-300 hover:bg-amber-50/30"
                      >
                        <div className="font-medium text-gray-900">
                          รุ่นที่ {batch.batchNumber}/{batch.year}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <CalendarDays className="h-3 w-3 mr-1 text-amber-500" />
                          ปิดรับสมัคร {formatDate(batch.registrationEndDate)}
                        </div>
                      </Link>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>ไม่มีรุ่นที่กำลังจะปิดรับสมัคร</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}