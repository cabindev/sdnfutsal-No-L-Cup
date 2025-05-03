import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  ChevronRight,
  Medal,
  Users,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import prisma from "@/app/lib/db";

export const metadata: Metadata = {
  title: "รายชื่อโค้ชฟุตซอล | SDN FUTSAL NO L CUP",
  description: "รายชื่อโค้ชฟุตซอลที่ผ่านการอบรมอย่างเป็นทางการจาก SDN FUTSAL NO L CUP และกรมพละศึกษา ",
};

interface ParticipationWithBatch {
  id: number;
  batch: {
    batchNumber: number;
    year: number;
    endDate: Date;
  };
}

interface CoachWithBatch {
  id: number;
  user: {
    firstName: string;
    lastName: string;
    image?: string | null;
  };
  teamName?: string | null;
  coachExperience: number;
  location?: {
    province: string;
  } | null;
  batchParticipations: ParticipationWithBatch[];
}

interface BatchInfo {
  id: number;
  batchNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  location: string;
  description?: string | null;
  isActive: boolean;
}

export default async function CoachesPage({
  searchParams
}: {
  searchParams: Promise<{ year?: string; batch?: string; search?: string; province?: string; }>
}) {
  // ดึงข้อมูลจาก URL params และตรวจสอบความถูกต้อง
  const resolvedParams = await searchParams;
  
  // ปีอบรม - ตรวจสอบว่าเป็นตัวเลขที่ถูกต้อง
  let year: number | undefined = undefined;
  if (resolvedParams.year) {
    const parsedYear = parseInt(resolvedParams.year);
    if (!isNaN(parsedYear)) {
      year = parsedYear;
    }
  }
  
  // รุ่นที่อบรม - ตรวจสอบว่าเป็นตัวเลขที่ถูกต้อง
  let batchNumber: number | undefined = undefined;
  if (resolvedParams.batch && resolvedParams.batch !== 'all') {
    const parsedBatch = parseInt(resolvedParams.batch);
    if (!isNaN(parsedBatch)) {
      batchNumber = parsedBatch;
    }
  }
  
  const search = resolvedParams.search || '';
  const province = resolvedParams.province || '';
  
  // ดึงข้อมูลปีที่มีการจัดอบรม
  const years = await prisma.trainingBatch.findMany({
    select: { year: true },
    distinct: ['year'],
    orderBy: { year: 'desc' }
  });
  
  const uniqueYears = years.map(item => item.year);
  const selectedYear = year || (uniqueYears.length > 0 ? uniqueYears[0] : new Date().getFullYear());
  
  // ดึงข้อมูลรุ่นตามปีที่เลือก
  const batches = await prisma.trainingBatch.findMany({
    where: { year: selectedYear },
    orderBy: { batchNumber: 'desc' }
  });
  
  // ดึงข้อมูลจังหวัดทั้งหมดที่มีโค้ช
  const provinces = await prisma.location.findMany({
    select: { province: true },
    distinct: ['province'],
    orderBy: { province: 'asc' }
  });
  
  // สร้างเงื่อนไขในการค้นหา
  const where: Record<string, any> = {
    batchParticipations: {
      some: {
        status: 'APPROVED',
        batch: { year: selectedYear }
      }
    }
  };
  
  // เพิ่มเงื่อนไขการค้นหาตามรุ่น (ถ้ามี)
  if (batchNumber !== undefined) {
    where.batchParticipations.some.batch.batchNumber = batchNumber;
  }
  
  // เพิ่มเงื่อนไขการค้นหาตามชื่อ (ถ้ามี)
  if (search) {
    where.OR = [
      { user: { firstName: { contains: search } } },
      { user: { lastName: { contains: search } } },
      { teamName: { contains: search } }
    ];
  }
  
  // เพิ่มเงื่อนไขการค้นหาตามจังหวัด (ถ้ามี)
  if (province && province !== 'all') {
    where.location = { province };
  }
  
  // ดึงข้อมูลโค้ชตามเงื่อนไข
  const coaches = await prisma.coach.findMany({
    where,
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          image: true
        }
      },
      location: true,
      batchParticipations: {
        where: { status: 'APPROVED' },
        include: {
          batch: true
        },
        orderBy: [
          { batch: { year: 'desc' } },
          { batch: { batchNumber: 'desc' } }
        ]
      }
    },
    orderBy: [
      { user: { firstName: 'asc' } },
      { user: { lastName: 'asc' } }
    ]
  });
  
  // สร้างข้อมูลสถิติ
  const uniqueProvinces = await prisma.location.findMany({
    select: { province: true },
    distinct: ['province']
  });

  const stats = {
    totalCoaches: await prisma.coach.count({
      where: {
        batchParticipations: {
          some: { status: 'APPROVED' }
        }
      }
    }),
    totalTrainings: await prisma.trainingBatch.count(),
    provinces: uniqueProvinces.length
  };

  // ดึงข้อมูลรุ่นที่เปิดรับสมัคร (ถ้ามี)
  const activeBatches = batches.filter(batch => batch.isActive);
  
  // วันที่ปัจจุบัน
  const currentDate = new Date();

  return (
    <div className="min-h-screen">
      {/* Hero Section with good spacing */}
      <section className="relative bg-futsal-navy overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-futsal-navy/90 to-futsal-navy/70 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/coaches-bg.jpg')] bg-cover bg-center opacity-40"></div>
        
        <div className="container mx-auto px-4 py-16 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              โค้ชฟุตซอลมืออาชีพ
              <span className="block text-futsal-orange">ที่ผ่านการรับรอง</span>
            </h1>
            <p className="text-gray-200 text-lg mb-8">
              รายชื่อโค้ชที่ผ่านการฝึกอบรมและได้รับการรับรองจากกรมพละศึกษา
              พร้อมนำความรู้และประสบการณ์มาพัฒนาวงการฟุตซอลไทย
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <div className="mr-3">
                  <Medal className="h-9 w-9 text-futsal-gold" />
                </div>
                <div>
                  <div className="text-sm text-gray-300">โค้ชที่ได้รับการรับรอง</div>
                  <div className="text-2xl font-bold text-white">{stats.totalCoaches}</div>
                </div>
              </div>
              
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                <div className="mr-3">
                  <Calendar className="h-9 w-9 text-futsal-green" />
                </div>
                <div>
                  <div className="text-sm text-gray-300">การอบรมที่จัดขึ้น</div>
                  <div className="text-2xl font-bold text-white">{stats.totalTrainings} รุ่น</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Cards */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
              <div className="h-14 w-14 rounded-full bg-futsal-blue/10 flex items-center justify-center mr-4">
                <Users className="h-7 w-7 text-futsal-blue" />
              </div>
              <div>
                <p className="text-gray-500 font-medium">โค้ชทั้งหมด</p>
                <p className="text-3xl font-bold text-futsal-navy">{stats.totalCoaches}</p>
                <p className="text-xs text-futsal-blue">พร้อมพัฒนาฟุตซอลไทย</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
              <div className="h-14 w-14 rounded-full bg-futsal-orange/10 flex items-center justify-center mr-4">
                <TrendingUp className="h-7 w-7 text-futsal-orange" />
              </div>
              <div>
                <p className="text-gray-500 font-medium">จำนวนรุ่น</p>
                <p className="text-3xl font-bold text-futsal-navy">{stats.totalTrainings}</p>
                <p className="text-xs text-futsal-orange">การอบรมอย่างต่อเนื่อง</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
              <div className="h-14 w-14 rounded-full bg-futsal-green/10 flex items-center justify-center mr-4">
                <MapPin className="h-7 w-7 text-futsal-green" />
              </div>
              <div>
                <p className="text-gray-500 font-medium">จังหวัด</p>
                <p className="text-3xl font-bold text-futsal-navy">{stats.provinces}</p>
                <p className="text-xs text-futsal-green">ครอบคลุมทั่วประเทศ</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-8 container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <Sparkles className="w-5 h-5 text-futsal-gold mr-2" />
            <h2 className="text-xl font-bold text-futsal-navy">ค้นหาโค้ชที่ผ่านการรับรอง</h2>
          </div>
          
          <form action="/coaches" method="get" className="grid gap-4 md:grid-cols-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">ปีที่อบรม</label>
              <Select name="year" defaultValue={selectedYear.toString()}>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="เลือกปี" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueYears.length > 0 ? (
                    uniqueYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        ปี {year}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value={new Date().getFullYear().toString()}>
                      ปี {new Date().getFullYear()}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">รุ่นที่อบรม</label>
              <Select name="batch" defaultValue={batchNumber ? batchNumber.toString() : "all"}>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="ทุกรุ่น" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกรุ่น</SelectItem>
                  {batches.map(batch => (
                    <SelectItem key={batch.id} value={batch.batchNumber.toString()}>
                      รุ่นที่ {batch.batchNumber}/{batch.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
              <Select name="province" defaultValue={province || "all"}>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="ทุกจังหวัด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกจังหวัด</SelectItem>
                  {provinces.map(p => (
                    <SelectItem key={p.province} value={p.province}>
                      {p.province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">ค้นหาชื่อ</label>
              <div className="relative">
                <Input
                  type="text"
                  name="search"
                  placeholder="ค้นหาชื่อโค้ช..."
                  defaultValue={search}
                  className="pl-9 bg-gray-50 border-gray-200"
                />
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="md:col-span-4 mt-2">
              <Button type="submit" className="bg-futsal-blue hover:bg-futsal-blue/90 text-white w-full md:w-auto">
                <Search className="h-4 w-4 mr-2" />
                ค้นหาโค้ช
              </Button>
            </div>
          </form>
        </div>
      </section>
      
      {/* Search Results Summary */}
      {(search || (province && province !== 'all') || batchNumber !== undefined) && (
        <div className="container mx-auto px-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700">
              พบข้อมูลโค้ช <span className="font-semibold text-futsal-blue">{coaches.length}</span> รายการ
              {batchNumber !== undefined ? ` ในรุ่นที่ ${batchNumber}/${selectedYear}` : ''}
              {province && province !== 'all' ? ` จังหวัด${province}` : ''}
              {search ? ` ที่ตรงกับคำค้นหา "${search}"` : ''}
            </p>
          </div>
        </div>
      )}
      
      {/* Coaches Grid */}
      <section className="py-8 container mx-auto px-4">
        {coaches.length === 0 ? (
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">ไม่พบข้อมูลโค้ช</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              ไม่พบข้อมูลโค้ชที่ตรงกับเงื่อนไขการค้นหา กรุณาลองปรับเปลี่ยนตัวกรองหรือคำค้นหาใหม่
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-futsal-navy mb-3 sm:mb-0">รายชื่อโค้ช</h2>
              
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500">เรียงตาม:</span>
                <Select defaultValue="name">
                  <SelectTrigger className="w-[160px] border-gray-200 bg-white">
                    <SelectValue placeholder="เรียงตามชื่อ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">ชื่อ (ก-ฮ)</SelectItem>
                    <SelectItem value="experience">ประสบการณ์ (มาก-น้อย)</SelectItem>
                    <SelectItem value="latest">เข้าร่วมล่าสุด</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {coaches.map((coach) => {
                // ตรวจสอบว่ามีการอบรมที่กำลังดำเนินการอยู่หรือไม่
                const hasActiveTraining = coach.batchParticipations.some(
                  participation => new Date(participation.batch.endDate) > currentDate
                );
                
                return (
                  <div key={coach.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100">
                    <div className="p-4 border-b border-gray-100 flex items-center">
                      <Avatar className="h-14 w-14 border-2 border-futsal-blue/20">
                        <AvatarFallback className="bg-futsal-blue/10 text-futsal-blue text-lg font-medium">
                          {coach.user.firstName?.charAt(0) || ''}
                          {coach.user.lastName?.charAt(0) || ''}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="ml-3 overflow-hidden">
                        <h3 className="font-semibold text-futsal-navy truncate">
                          {coach.user.firstName} {coach.user.lastName}
                        </h3>
                        
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                          <span className="truncate">{coach.location?.province || 'ไม่ระบุจังหวัด'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 pt-3">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-sm text-gray-500 mb-1">ประสบการณ์</div>
                          <div className="font-semibold text-futsal-navy">{coach.coachExperience} ปี</div>
                        </div>
                        
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-sm text-gray-500 mb-1">เข้าร่วมอบรม</div>
                          <div className="font-semibold text-futsal-navy">{coach.batchParticipations.length} ครั้ง</div>
                        </div>
                      </div>
                      
                      {coach.teamName && (
                        <div className="flex items-center mb-3 text-sm">
                          <div className="font-medium text-gray-700 mr-2">ทีม:</div>
                          <div className="text-futsal-blue">{coach.teamName}</div>
                        </div>
                      )}
                      
                      <div className="mb-3">
                        {hasActiveTraining ? (
                          <div className="font-medium text-sm mb-1.5 flex items-center">
                            <span className="text-futsal-orange">อยู่ระหว่างการอบรม</span>
                            <span className="ml-2 h-2 w-2 rounded-full bg-futsal-orange animate-pulse"></span>
                          </div>
                        ) : (
                          <div className="font-medium text-sm text-gray-700 mb-1.5">การอบรมที่ผ่านมา:</div>
                        )}
                        
                        <div className="flex flex-wrap gap-1.5">
                          {coach.batchParticipations.map((participation) => {
                            const isActive = new Date(participation.batch.endDate) > currentDate;
                            
                            return (
                              <Badge
                                key={participation.id}
                                className={`${isActive 
                                  ? "bg-futsal-orange/10 hover:bg-futsal-orange/20 text-futsal-orange" 
                                  : "bg-futsal-navy/10 hover:bg-futsal-navy/20 text-futsal-navy"
                                } border-none font-normal`}
                              >
                                {isActive && (
                                  <span className="inline-block h-2 w-2 rounded-full bg-futsal-orange animate-pulse mr-1.5"></span>
                                )}
                                รุ่น {participation.batch.batchNumber}/{participation.batch.year}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}