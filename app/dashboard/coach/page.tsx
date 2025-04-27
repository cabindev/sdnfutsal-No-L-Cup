// app/dashboard/coach/page.tsx
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/lib/configs/auth/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/app/lib/db";
import { Button } from "@/app/components/ui/button";
import { Plus, Download, Users, Clock, CheckCircle, XCircle, Filter, Search, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import Image from "next/image";
import ClientSearchFilter from "./components/ClientSearchFilter";


export default async function CoachListPage({ 
    searchParams 
  }: { 
    searchParams: Promise<{ q?: string; status?: string; batch?: string; page?: string; }>
  }) {
    // ตรวจสอบ session ของผู้ใช้
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      redirect("/auth/signin?callbackUrl=/dashboard/coach");
    }
    
    // แก้ไขให้ใช้ await สำหรับ searchParams
    const params = await searchParams;
    const isAdmin = session.user.role === 'ADMIN';
    const page = Number(params.page) || 1;
    const pageSize = 10;
    const search = params.q || '';
    const status = params.status || 'all';
    const batchId = params.batch || 'all';
    
    // ค้นหาโค้ชตามเงื่อนไข
    const where: any = {};
    
    if (search) {
      where.OR = [
        { user: { firstName: { contains: search } } },
        { user: { lastName: { contains: search } } },
        { nickname: { contains: search } },
        { teamName: { contains: search } },
        { phoneNumber: { contains: search } },
      ];
    }
    
    if (status === 'pending') {
      where.isApproved = false;
    } else if (status === 'approved') {
      where.isApproved = true;
    }
    
    // กรองตามรุ่นอบรม
    if (batchId !== 'all') {
      where.batchParticipations = {
        some: {
          batchId: parseInt(batchId)
        }
      };
    }
    
    // ถ้าไม่ใช่แอดมิน ให้แสดงเฉพาะข้อมูลของตัวเอง
    if (!isAdmin) {
      where.userId = session.user.id;
    }
  
  // ดึงข้อมูลโค้ชและทำการแบ่งหน้า
  const [coaches, totalCount] = await Promise.all([
    prisma.coach.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          }
        },
        location: true,
        batchParticipations: {
          include: {
            batch: true
          }
        }
      }
    }),
    prisma.coach.count({ where })
  ]);
  
  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(totalCount / pageSize);

  // ดึงข้อมูลรุ่นการอบรมเพื่อแสดงชื่อรุ่นในหน้าเว็บ (ถ้ามีการกรอง)
  let currentBatchName = 'ทุกรุ่น';
  if (batchId !== 'all') {
    const batchInfo = await prisma.trainingBatch.findUnique({
      where: { id: parseInt(batchId) },
      select: { batchNumber: true, year: true }
    });
    
    if (batchInfo) {
      currentBatchName = `รุ่นที่ ${batchInfo.batchNumber}/${batchInfo.year}`;
    }
  }

  // ดึงข้อมูลสถิติสำหรับแสดงบน dashboard
  const stats = {
    total: totalCount,
    approved: await prisma.coach.count({ where: { isApproved: true } }),
    pending: await prisma.coach.count({ where: { isApproved: false } }),
    registeredToday: await prisma.coach.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-futsal-blue/10 to-futsal-navy/5 border-futsal-blue/20">
          <CardContent className="p-4 flex items-center">
            <div className="bg-futsal-blue/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-futsal-blue" />
            </div>
            <div>
              <p className="text-sm text-gray-500">จำนวนโค้ชทั้งหมด</p>
              <h3 className="text-2xl font-bold text-futsal-navy">{stats.total}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-futsal-green/10 to-futsal-green/5 border-futsal-green/20">
          <CardContent className="p-4 flex items-center">
            <div className="bg-futsal-green/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-futsal-green" />
            </div>
            <div>
              <p className="text-sm text-gray-500">อนุมัติแล้ว</p>
              <h3 className="text-2xl font-bold text-futsal-green">{stats.approved}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-futsal-orange/10 to-futsal-orange/5 border-futsal-orange/20">
          <CardContent className="p-4 flex items-center">
            <div className="bg-futsal-orange/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <Clock className="h-6 w-6 text-futsal-orange" />
            </div>
            <div>
              <p className="text-sm text-gray-500">รอการอนุมัติ</p>
              <h3 className="text-2xl font-bold text-futsal-orange">{stats.pending}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-4 flex items-center">
            <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ลงทะเบียนวันนี้</p>
              <h3 className="text-2xl font-bold text-purple-600">{stats.registeredToday}</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-futsal-navy">รายชื่อโค้ชฟุตซอล</h1>
          <p className="text-gray-600">
            จัดการรายชื่อโค้ช และดูสถานะการลงทะเบียน
            {batchId !== 'all' && ` - ${currentBatchName}`}
          </p>
        </div>
        
        {isAdmin && (
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button asChild variant="outline" className="flex items-center gap-2 hover:border-futsal-navy hover:text-futsal-navy transition-colors">
              <Link href="/dashboard/coach/export">
                <Download className="h-4 w-4" />
                <span>ส่งออกข้อมูล</span>
              </Link>
            </Button>
            <Button asChild className="bg-futsal-orange hover:bg-futsal-orange/90 flex items-center gap-2 shadow-sm transition-all hover:shadow">
              <Link href="/dashboard/coach/add">
                <Plus className="h-4 w-4" />
                <span>เพิ่มโค้ช</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* ส่วนการค้นหาและกรอง */}
      <ClientSearchFilter defaultStatus={status} defaultSearch={search} defaultBatch={batchId} />
      
      {/* สรุปผลการค้นหา */}
      {(search || status !== 'all' || batchId !== 'all') && (
        <div className="mt-4 bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">
            พบทั้งหมด <span className="font-semibold">{totalCount}</span> รายการ
            {batchId !== 'all' && ` ในรุ่น ${currentBatchName}`}
            {status !== 'all' && ` (${status === 'pending' ? 'รอการอนุมัติ' : 'อนุมัติแล้ว'})`}
            {search && ` ที่ตรงกับ "${search}"`}
          </p>
        </div>
      )}
      
      {/* แสดงรายการโค้ช */}
      {coaches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {coaches.map((coach) => (
            <Link 
              href={`/dashboard/coach/${coach.id}`} 
              key={coach.id}
              className="block transition-all hover:-translate-y-1"
            >
              <Card className="overflow-hidden border border-gray-200 hover:border-futsal-orange/50 hover:shadow-md transition-all duration-200">
                <div className={`h-1.5 w-full ${coach.isApproved ? 'bg-futsal-green' : 'bg-futsal-orange'}`}></div>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-12 h-12 rounded-full bg-futsal-navy/10 flex items-center justify-center text-futsal-navy font-semibold border-2 border-futsal-navy/20">
                        {coach.user.firstName?.charAt(0)}{coach.user.lastName?.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {coach.user.firstName} {coach.user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {coach.nickname && <span>"{coach.nickname}" </span>}
                        {coach.teamName && <span>• {coach.teamName}</span>}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500 mb-1.5">
                      <span className="flex-shrink-0 w-24">เบอร์โทรศัพท์:</span>
                      <span className="font-medium text-gray-700">{coach.phoneNumber}</span>
                    </div>
                    {coach.location && (
                      <div className="flex items-start text-sm text-gray-500 mb-1.5">
                        <span className="flex-shrink-0 w-24">พื้นที่:</span>
                        <span className="font-medium text-gray-700">
                          {coach.location.amphoe}, {coach.location.province}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="flex-shrink-0 w-24">สถานะ:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        coach.isApproved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {coach.isApproved ? 'อนุมัติแล้ว' : 'รอการอนุมัติ'}
                      </span>
                    </div>
                  </div>
                  
                  {/* แสดงข้อมูลรุ่นอบรม */}
                  {coach.batchParticipations && coach.batchParticipations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-sm text-gray-500 mb-1.5">รุ่นการอบรม:</div>
                      <div className="flex flex-wrap gap-1">
                        {coach.batchParticipations.map((participation) => (
                          <span 
                            key={participation.id}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              participation.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800' 
                                : participation.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            รุ่น {participation.batch.batchNumber}/{participation.batch.year}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 flex justify-end">
                    <div className="flex items-center text-futsal-orange text-sm">
                      <span>ดูข้อมูลเพิ่มเติม</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg mt-6">
          <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-gray-100">
            <Users className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">ไม่พบข้อมูลโค้ช</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {search || status !== 'all' || batchId !== 'all'
              ? 'ไม่พบข้อมูลโค้ชที่ตรงกับเงื่อนไขการค้นหา ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่' 
              : 'ยังไม่มีข้อมูลโค้ชในระบบ'}
          </p>
          <Button 
            onClick={() => window.location.href = '/dashboard/coach'}
            variant="outline"
            className="mt-4 mr-2"
          >
            ล้างตัวกรอง
          </Button>
          {isAdmin && (
            <Button asChild className="mt-4 bg-futsal-orange hover:bg-futsal-orange/90">
              <Link href="/dashboard/coach/add">
                <Plus className="h-4 w-4 mr-1" />
                เพิ่มโค้ชใหม่
              </Link>
            </Button>
          )}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex rounded-md shadow-sm">
            <Link
              href={`/dashboard/coach?page=${Math.max(1, page-1)}${search ? `&q=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}${batchId !== 'all' ? `&batch=${batchId}` : ''}`}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md border border-gray-300 ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : 0}
            >
              &laquo; ก่อนหน้า
            </Link>
            
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const isActive = p === page;
              
              // แสดงเฉพาะหน้าปัจจุบัน หน้าแรก หน้าสุดท้าย และหน้าที่ใกล้กับหน้าปัจจุบัน
              if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                return (
                  <Link
                    key={p}
                    href={`/dashboard/coach?page=${p}${search ? `&q=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}${batchId !== 'all' ? `&batch=${batchId}` : ''}`}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 ${
                      isActive 
                        ? 'z-10 bg-futsal-orange text-white' 
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {p}
                  </Link>
                );
              }
              
              // แสดงจุดไข่ปลาสำหรับหน้าที่ถูกข้าม
              if (p === page - 2 || p === page + 2) {
                return (
                  <span
                    key={`ellipsis-${p}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-700"
                  >
                    ...
                  </span>
                );
              }
              
              return null;
            })}
            
            <Link
              href={`/dashboard/coach?page=${Math.min(totalPages, page+1)}${search ? `&q=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}${batchId !== 'all' ? `&batch=${batchId}` : ''}`}
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md border border-gray-300 ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              aria-disabled={page === totalPages}
              tabIndex={page === totalPages ? -1 : 0}
            >
              ถัดไป &raquo;
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}