// app/dashboard/coach/page.tsx
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/lib/configs/auth/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/app/lib/db";
import { Button } from "@/app/components/ui/button";
import { Plus, Users, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import ClientSearchFilter from "./components/ClientSearchFilter";
import CoachCard from "./components/CoachCard";
import CoachTable from "./components/CoachTable";
import EmptyState from "./components/EmptyState";
import Pagination from "@/app/components/ui/pagination";
import ExportCSVButton from "./components/ExportCSVButton";
import RefreshButton from './components/RefreshButton';
import PageSizeSelector from './components/PageSizeSelector'; 

interface SearchParamsType {
  q?: string;
  status?: string;
  batch?: string;
  zone?: string;
  page?: string;
  pageSize?: string;
}

export default async function CoachListPage({ searchParams }: { searchParams: Promise<SearchParamsType> }) {
  const resolvedParams = await searchParams;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin?callbackUrl=/dashboard/coach");

  const isAdmin = session.user.role === 'ADMIN';
  const page = Number(resolvedParams.page) || 1;
  const requestedPageSize = resolvedParams.pageSize ? Number(resolvedParams.pageSize) : 10;
  const pageSize = Math.min(Math.max(1, requestedPageSize), 100);

  const search = resolvedParams.q || '';
  const status = resolvedParams.status || 'all';
  const batchId = resolvedParams.batch || 'all';
  const zone = resolvedParams.zone || 'all';

  let where: Record<string, any> = {};

  if (search) {
    where.OR = [
      { user: { firstName: { contains: search } } },
      { user: { lastName: { contains: search } } },
      { nickname: { contains: search } },
      { teamName: { contains: search } },
      { phoneNumber: { contains: search } },
    ];
  }

  if (status === 'pending') where.isApproved = false;
  else if (status === 'approved') where.isApproved = true;

  if (batchId !== 'all') {
    where.batchParticipations = { some: { batchId: parseInt(batchId) } };
  }

  if (zone !== 'all') {
    where.location = { zone };
  }

  if (!isAdmin) where.userId = session.user.id;

  const [coaches, totalCount] = await Promise.all([
    prisma.coach.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: { firstName: true, lastName: true, email: true, image: true } },
        location: true,
        batchParticipations: { include: { batch: true } }
      }
    }),
    prisma.coach.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  let currentBatchName = 'ทุกรุ่น';
  if (batchId !== 'all') {
    const batchInfo = await prisma.trainingBatch.findUnique({
      where: { id: parseInt(batchId) },
      select: { batchNumber: true, year: true }
    });
    if (batchInfo) currentBatchName = `รุ่นที่ ${batchInfo.batchNumber}/${batchInfo.year}`;
  }

  const trainingBatches = await prisma.trainingBatch.findMany({
    orderBy: [{ year: 'desc' }, { batchNumber: 'desc' }],
    select: { id: true, batchNumber: true, year: true, isActive: true }
  });

  const zoneResults = await prisma.$queryRaw`
    SELECT DISTINCT l.zone, COUNT(c.id) as count
    FROM Location l
    LEFT JOIN Coach c ON l.id = c.locationId
    WHERE l.zone IS NOT NULL AND l.zone != ''
    GROUP BY l.zone
    ORDER BY l.zone`;

  const zones = (zoneResults as Array<{ zone: string, count: number }>).
    filter(z => z.zone && z.zone.trim() !== '');

  const stats = {
    total: await prisma.coach.count(),
    approved: await prisma.coach.count({ where: { isApproved: true } }),
    pending: await prisma.coach.count({ where: { isApproved: false } }),
    registeredToday: await prisma.coach.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
    })
  };

  const currentZoneName = zone !== 'all' ? zone : 'ทุกภูมิภาค';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="จำนวนโค้ชทั้งหมด" value={stats.total} color="futsal-navy" bg="futsal-blue" />
        <StatCard icon={CheckCircle} label="อนุมัติแล้ว" value={stats.approved} color="futsal-green" bg="futsal-green" />
        <StatCard icon={Clock} label="รอการอนุมัติ" value={stats.pending} color="futsal-orange" bg="futsal-orange" />
        <StatCard icon={Users} label="ลงทะเบียนวันนี้" value={stats.registeredToday} color="purple-600" bg="purple-500" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-futsal-navy">รายชื่อโค้ชฟุตซอล</h1>
          <p className="text-gray-600">
            จัดการรายชื่อโค้ช และดูสถานะการลงทะเบียน
            {batchId !== "all" && ` - ${currentBatchName}`}
            {zone !== "all" && ` - ${currentZoneName}`}
          </p>
        </div>
        {isAdmin && (
          <div className="mt-4 md:mt-0 flex space-x-2">
            <ExportCSVButton currentFilters={{ search, status, batchId, zone }} />
            <RefreshButton />
            <Button asChild className="bg-futsal-orange hover:bg-futsal-orange/90">
              <Link href="/dashboard/coach/add" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>เพิ่มโค้ช</span>
              </Link>
            </Button>
          </div>
        )}
      </div>

      <ClientSearchFilter
        defaultStatus={status}
        defaultSearch={search}
        defaultBatch={batchId}
        defaultZone={zone}
        batches={trainingBatches}
        zones={zones}
      />

      {coaches.length > 0 ? (
        <>
          <div className="hidden md:block mt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                กำลังแสดง <span className="font-semibold">{(page - 1) * pageSize + 1}</span> - <span className="font-semibold">{Math.min(page * pageSize, totalCount)}</span> จากทั้งหมด <span className="font-semibold">{totalCount}</span> รายการ
              </div>
              <PageSizeSelector pageSize={pageSize} />
            </div>
            <CoachTable 
              coaches={coaches}
              isAdmin={isAdmin}
              currentPage={page}
              pageSize={pageSize}
            />
          </div>

          <div className="md:hidden grid grid-cols-1 gap-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                กำลังแสดง {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalCount)} จากทั้งหมด {totalCount} รายการ
              </div>
              <PageSizeSelector pageSize={pageSize} />
            </div>
            {coaches.map((coach, index) => (
              <CoachCard 
                key={coach.id} 
                coach={coach} 
                index={(page - 1) * pageSize + index + 1}
              />
            ))}
          </div>

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
                  zone: zone !== "all" ? zone : undefined,
                  pageSize: pageSize !== 10 ? pageSize.toString() : undefined,
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
          zone={zone}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: number; color: string; bg: string }) {
  return (
    <Card className={`bg-gradient-to-br from-${bg}/10 to-${bg}/5 border-${bg}/20`}>
      <CardContent className="p-4 flex items-center">
        <div className={`bg-${bg}/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h3 className={`text-2xl font-bold text-${color}`}>{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
