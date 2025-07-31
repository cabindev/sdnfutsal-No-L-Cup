// app/dashboard/training/participants/page.tsx
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/lib/configs/auth/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { 
  Users, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronRight,
  Search,
  FileText,
  UserCheck,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import prisma from "@/app/lib/db";
import { 
  approveParticipant, 
  rejectParticipant 
} from "@/app/coach/actions/training-batch/participant-actions";
import { BatchSelector } from "./components/BatchSelector";

export default async function ParticipantsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ filter?: string; search?: string; batch?: string; }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect("/auth/signin?callbackUrl=/dashboard/training/participants");
  }
  
  // ต้อง await searchParams ก่อนที่จะเข้าถึงค่าภายใน
  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams.filter || 'all';
  const search = resolvedSearchParams.search || '';
  const batchId = resolvedSearchParams.batch ? parseInt(resolvedSearchParams.batch) : undefined;
  
  // สร้างเงื่อนไขการค้นหา
  let where: any = {};
  
  // กรองตามสถานะ
  if (filter === 'pending') {
    where.status = 'PENDING';
  } else if (filter === 'approved') {
    where.status = 'APPROVED';
  } else if (filter === 'rejected') {
    where.status = 'REJECTED';
  } else if (filter === 'canceled') {
    where.status = 'CANCELED';
  }
  
  // กรองตามรุ่นอบรม
  if (batchId) {
    where.batchId = batchId;
  }
  
  // ค้นหาตามชื่อหรืออีเมล
  if (search) {
    where.coach = {
      user: {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } }
        ]
      }
    };
  }
  
  // ดึงข้อมูลการลงทะเบียนทั้งหมด
  const participants = await prisma.batchParticipant.findMany({
    where,
    include: {
      coach: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              image: true
            }
          },
          location: true
        }
      },
      batch: true
    },
    orderBy: [
      { status: 'asc' },
      { registeredAt: 'desc' }
    ]
  });
  
  // ดึงข้อมูลรุ่นอบรมทั้งหมดสำหรับตัวกรอง
  const batches = await prisma.trainingBatch.findMany({
    select: {
      id: true,
      batchNumber: true,
      year: true,
      _count: {
        select: { participants: true }
      }
    },
    orderBy: [
      { year: 'desc' },
      { batchNumber: 'desc' }
    ]
  });
  
  // สถิติการลงทะเบียน
  const stats = {
    total: await prisma.batchParticipant.count(),
    pending: await prisma.batchParticipant.count({ where: { status: 'PENDING' } }),
    approved: await prisma.batchParticipant.count({ where: { status: 'APPROVED' } }),
    rejected: await prisma.batchParticipant.count({ where: { status: 'REJECTED' } })
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

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-futsal-navy">
            จัดการผู้เข้าร่วมอบรม
          </h1>
          <p className="text-sm text-gray-600">อนุมัติและจัดการการลงทะเบียนของโค้ช</p>
        </div>

        <Button
          asChild
          size="sm"
          className="mt-3 sm:mt-0 bg-futsal-orange hover:bg-futsal-orange/90 text-sm"
        >
          <Link href="/dashboard/training/batch">
            จัดการรุ่นอบรม
            <ChevronRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </div>

      {/* สถิติการลงทะเบียน */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Card className="bg-gradient-to-br from-futsal-blue/10 to-futsal-navy/5 border-futsal-blue/20">
          <CardContent className="p-3 flex items-center">
            <div className="bg-futsal-blue/20 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
              <Users className="h-4 w-4 text-futsal-blue" />
            </div>
            <div>
              <p className="text-xs text-gray-500">ผู้ลงทะเบียนทั้งหมด</p>
              <h3 className="text-lg font-bold text-futsal-navy">
                {stats.total}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="p-3 flex items-center">
            <div className="bg-amber-500/20 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">รอการอนุมัติ</p>
              <h3 className="text-lg font-bold text-amber-600">
                {stats.pending}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-futsal-green/10 to-futsal-green/5 border-futsal-green/20">
          <CardContent className="p-3 flex items-center">
            <div className="bg-futsal-green/20 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
              <CheckCircle className="h-4 w-4 text-futsal-green" />
            </div>
            <div>
              <p className="text-xs text-gray-500">อนุมัติแล้ว</p>
              <h3 className="text-lg font-bold text-futsal-green">
                {stats.approved}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="p-3 flex items-center">
            <div className="bg-red-500/20 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">ไม่อนุมัติ</p>
              <h3 className="text-lg font-bold text-red-600">
                {stats.rejected}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ตัวกรองและการค้นหา */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex flex-wrap gap-2 md:flex-1">
          <Link href="/dashboard/training/participants">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              className={filter === "all" ? "bg-futsal-navy" : ""}
            >
              ทั้งหมด
            </Button>
          </Link>
          <Link href="/dashboard/training/participants?filter=pending">
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              className={filter === "pending" ? "bg-amber-500" : ""}
            >
              รอการอนุมัติ
            </Button>
          </Link>
          <Link href="/dashboard/training/participants?filter=approved">
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              size="sm"
              className={filter === "approved" ? "bg-futsal-green" : ""}
            >
              อนุมัติแล้ว
            </Button>
          </Link>
          <Link href="/dashboard/training/participants?filter=rejected">
            <Button
              variant={filter === "rejected" ? "default" : "outline"}
              size="sm"
              className={filter === "rejected" ? "bg-red-600" : ""}
            >
              ไม่อนุมัติ
            </Button>
          </Link>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <form action="/dashboard/training/participants" method="get">
              {filter !== "all" && (
                <input type="hidden" name="filter" value={filter} />
              )}
              {batchId && (
                <input type="hidden" name="batch" value={batchId.toString()} />
              )}
              <Input
                type="text"
                name="search"
                placeholder="ค้นหาชื่อหรืออีเมล"
                defaultValue={search}
                className="pl-8 w-full md:w-56 text-sm h-8"
              />
              <Search className="h-3 w-3 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <Button type="submit" className="sr-only">
                ค้นหา
              </Button>
            </form>
          </div>

          <BatchSelector
            batches={batches}
            currentBatchId={batchId}
            filter={filter}
            search={search}
          />
        </div>
      </div>

      {/* แสดงรายชื่อผู้ลงทะเบียน */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <UserCheck className="h-4 w-4 mr-2 text-futsal-blue" />
            รายชื่อผู้ลงทะเบียน {filter === "pending" ? "(รอการอนุมัติ)" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {participants.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <h3 className="text-base font-medium text-gray-700 mb-1">
                ไม่พบข้อมูลการลงทะเบียน
              </h3>
              <p className="text-sm text-gray-500">
                {search
                  ? "ไม่พบผลลัพธ์ที่ตรงกับการค้นหา"
                  : filter !== "all"
                  ? "ไม่พบข้อมูลสำหรับตัวกรองที่เลือก"
                  : "ยังไม่มีการลงทะเบียนในขณะนี้"}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-xs">
                      ชื่อ-นามสกุล
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-xs">
                      รุ่นที่สมัคร
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-xs">
                      วันที่ลงทะเบียน
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-xs">สถานะ</th>
                    <th className="px-3 py-2 text-right font-medium text-xs">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {participants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="text-xs bg-futsal-blue/10 text-futsal-blue">
                              {participant.coach.user.firstName?.charAt(0) ||
                                ""}
                              {participant.coach.user.lastName?.charAt(0) || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900 text-xs">
                              {participant.coach.user.firstName}{" "}
                              {participant.coach.user.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {participant.coach.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs font-medium">
                          รุ่นที่ {participant.batch.batchNumber}/
                          {participant.batch.year}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(participant.batch.startDate)} -{" "}
                          {formatDate(participant.batch.endDate)}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs">{formatDate(participant.registeredAt)}</div>
                        <div className="text-xs text-gray-500">
                          {formatTime(participant.registeredAt)}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Badge
                          className={
                            participant.status === "APPROVED"
                              ? "bg-green-100 text-green-800 text-xs px-2 py-0.5"
                              : participant.status === "REJECTED"
                              ? "bg-red-100 text-red-800 text-xs px-2 py-0.5"
                              : participant.status === "CANCELED"
                              ? "bg-red-100 text-red-800 text-xs px-2 py-0.5"
                              : "bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5"
                          }
                        >
                          {participant.status === "APPROVED"
                            ? "อนุมัติแล้ว"
                            : participant.status === "REJECTED"
                            ? "ไม่อนุมัติ"
                            : participant.status === "CANCELED"
                            ? "ยกเลิก"
                            : "รอการอนุมัติ"}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-1">
                          <Link
                            href={`/dashboard/training/participants/${participant.id}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-700 text-xs h-7 px-2"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              รายละเอียด
                            </Button>
                          </Link>

                          {participant.status === "PENDING" && (
                            <>
                              <form
                                action={async () => {
                                  "use server";
                                  await approveParticipant(participant.id);
                                }}
                              >
                                <Button
                                  type="submit"
                                  size="sm"
                                  className="bg-futsal-green hover:bg-futsal-green/90 text-xs h-7 px-2"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  อนุมัติ
                                </Button>
                              </form>

                              <form
                                action={async () => {
                                  "use server";
                                  await rejectParticipant(participant.id);
                                }}
                              >
                                <Button
                                  type="submit"
                                  size="sm"
                                  variant="destructive"
                                  className="text-xs h-7 px-2"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  ไม่อนุมัติ
                                </Button>
                              </form>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}