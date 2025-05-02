// app/dashboard/coach/page.tsx
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/lib/configs/auth/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/app/lib/db";
import { Button } from "@/app/components/ui/button";
import { Plus, Download, Users, Clock, CheckCircle, XCircle, Filter, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import Image from "next/image";
import ClientSearchFilter from "./components/ClientSearchFilter";
import { Badge } from "@/app/components/ui/badge";
import CoachCard from "./components/CoachCard";
import CoachTable from "./components/CoachTable";
import EmptyState from "./components/EmptyState";
import Pagination from "@/app/components/ui/pagination";
import ExportCSVDropdown from "./components/ExportCSVDropdown";
import RefreshButton from './components/RefreshButton';

// ประกาศ type สำหรับ searchParams เพื่อให้เข้ากับ Next.js 15
interface SearchParamsType {
  q?: string;
  status?: string;
  batch?: string;
  page?: string;
}

export default async function CoachListPage({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParamsType>  // เปลี่ยนเป็น Promise
}) {
  // ตรวจสอบ session ของผู้ใช้
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/coach");
  }
  
  // ใช้ await กับ searchParams ตามข้อกำหนดของ Next.js 15
  const resolvedParams = await searchParams;
  
  const isAdmin = session.user.role === 'ADMIN';
  const page = Number(resolvedParams.page) || 1;
  const pageSize = 10;
  const search = resolvedParams.q || '';
  const status = resolvedParams.status || 'all';
  const batchId = resolvedParams.batch || 'all';
  
  // ค้นหาโค้ชตามเงื่อนไข
  const where: Record<string, any> = {}; // ใช้ Record<string, any> แทน any เพื่อความปลอดภัยมากขึ้น
  
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

  // ดึงรุ่นการอบรมทั้งหมดสำหรับตัวกรอง
  const trainingBatches = await prisma.trainingBatch.findMany({
    orderBy: [
      { year: 'desc' },
      { batchNumber: 'desc' }
    ],
    select: {
      id: true,
      batchNumber: true,
      year: true,
      isActive: true
    }
  });

  // ดึงข้อมูลสถิติสำหรับแสดงบน dashboard
  const stats = {
    total: await prisma.coach.count(),
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
              <h3 className="text-2xl font-bold text-futsal-navy">
                {stats.total}
              </h3>
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
              <h3 className="text-2xl font-bold text-futsal-green">
                {stats.approved}
              </h3>
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
              <h3 className="text-2xl font-bold text-futsal-orange">
                {stats.pending}
              </h3>
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
              <h3 className="text-2xl font-bold text-purple-600">
                {stats.registeredToday}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-futsal-navy">
            รายชื่อโค้ชฟุตซอล
          </h1>
          <p className="text-gray-600">
            จัดการรายชื่อโค้ช และดูสถานะการลงทะเบียน
            {batchId !== "all" && ` - ${currentBatchName}`}
          </p>
        </div>
        {isAdmin && (
          <div className="mt-4 md:mt-0 flex space-x-2">
            <ExportCSVDropdown batches={trainingBatches} />
            <RefreshButton />
            <Button
              asChild
              className="bg-futsal-orange hover:bg-futsal-orange/90"
            >
              <Link
                href="/dashboard/coach/add"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>เพิ่มโค้ช</span>
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* ส่วนการค้นหาและกรอง */}
      <ClientSearchFilter
        defaultStatus={status}
        defaultSearch={search}
        defaultBatch={batchId}
        batches={trainingBatches}
      />

      {/* สรุปผลการค้นหา */}
      {(search || status !== "all" || batchId !== "all") && (
        <div className="mt-4 bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">
            พบทั้งหมด <span className="font-semibold">{totalCount}</span> รายการ
            {batchId !== "all" && ` ในรุ่น ${currentBatchName}`}
            {status !== "all" &&
              ` สถานะ: ${
                status === "pending" ? "รอการอนุมัติ" : "อนุมัติแล้ว"
              }`}
            {search && ` ที่ตรงกับ "${search}"`}
          </p>
        </div>
      )}

      {/* แสดงรายการโค้ช */}
      {coaches.length > 0 ? (
        <>
          {/* แสดงแบบตารางบนหน้าจอขนาดใหญ่ */}
          <div className="hidden md:block mt-6">
            <CoachTable coaches={coaches} isAdmin={isAdmin} />
          </div>

          {/* แสดงแบบการ์ดบนหน้าจอขนาดเล็ก */}
          <div className="md:hidden grid grid-cols-1 gap-4 mt-6">
            {coaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/dashboard/coach"
                searchParams={{
                  q: search || undefined,
                  status: status !== "all" ? status : undefined,
                  batch: batchId !== "all" ? batchId : undefined,
                }}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          search={search}
          status={status}
          batch={batchId}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}