// app/dashboard/training/batch/[id]/page.tsx
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/lib/configs/auth/authOptions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/app/lib/db";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CalendarDays, Users, MapPin, ArrowLeft, Edit } from "lucide-react";
import { BatchDeleteButton } from "../components/BatchDeleteButton";

export default async function BatchDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect("/auth/signin?callbackUrl=/dashboard/training/batch");
  }
  
  const resolvedParams = await params;
  const batchId = Number(resolvedParams.id);
  
  if (isNaN(batchId)) {
    notFound();
  }
  
  // ดึงข้อมูลรุ่นอบรม
  const batch = await prisma.trainingBatch.findUnique({
    where: { id: batchId },
    include: {
      participants: {
        include: {
          coach: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                }
              },
              location: true
            }
          }
        }
      },
      _count: {
        select: {
          participants: true
        }
      }
    }
  });
  
  if (!batch) {
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
  
  // จัดกลุ่มผู้เข้าร่วมตามสถานะ
  const participantsByStatus = {
    PENDING: batch.participants.filter(p => p.status === 'PENDING'),
    APPROVED: batch.participants.filter(p => p.status === 'APPROVED'),
    REJECTED: batch.participants.filter(p => p.status === 'REJECTED'),
    CANCELED: batch.participants.filter(p => p.status === 'CANCELED'),
  };
  
  // สถานะเป็นภาษาไทย
  const statusLabels: Record<string, string> = {
    PENDING: 'รอการอนุมัติ',
    APPROVED: 'อนุมัติแล้ว',
    REJECTED: 'ไม่อนุมัติ',
    CANCELED: 'ยกเลิกการเข้าร่วม',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard/training/batch">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            กลับไปหน้ารายการ
          </Button>
        </Link>

        <div className="flex space-x-2">
          <Link href={`/dashboard/training/batch/edit/${batch.id}`}>
            <Button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-colors">
              <Edit className="h-4 w-4" />
              แก้ไขรุ่นอบรม
            </Button>
          </Link>

          <BatchDeleteButton
            batchId={batch.id}
            batchName={`${batch.batchNumber}/${batch.year}`}
          />
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-futsal-navy">
          รุ่นที่ {batch.batchNumber}/{batch.year}
        </h1>
        <div
          className={`inline-block px-3 py-1 text-sm rounded-full mt-2 ${
            batch.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {batch.isActive ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-futsal-navy">ข้อมูลรุ่นอบรม</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <CalendarDays className="h-5 w-5 text-futsal-orange mr-3 mt-0.5" />
              <div>
                <p className="font-medium">วันที่จัดอบรม</p>
                <p className="text-gray-600">
                  {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-futsal-orange mr-3 mt-0.5" />
              <div>
                <p className="font-medium">สถานที่จัดอบรม</p>
                <p className="text-gray-600">{batch.location}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Users className="h-5 w-5 text-futsal-orange mr-3 mt-0.5" />
              <div>
                <p className="font-medium">จำนวนผู้เข้าร่วม</p>
                <p className="text-gray-600">
                  {batch._count.participants} / {batch.maxParticipants} คน
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CalendarDays className="h-5 w-5 text-futsal-orange mr-3 mt-0.5" />
              <div>
                <p className="font-medium">วันสิ้นสุดการรับสมัคร</p>
                <p className="text-gray-600">
                  {formatDate(batch.registrationEndDate)}
                </p>
              </div>
            </div>

            {batch.description && (
              <div className="pt-4 border-t">
                <p className="font-medium mb-2">รายละเอียดเพิ่มเติม</p>
                <p className="text-gray-600 whitespace-pre-line">
                  {batch.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-futsal-navy">สรุปผู้เข้าร่วม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="font-medium">สถานะ</span>
                <span className="font-medium">จำนวน</span>
              </div>

              {Object.entries(participantsByStatus).map(
                ([status, participants]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-700">
                      {statusLabels[status] || status}
                    </span>
                    <span className="font-medium">
                      {participants.length} คน
                    </span>
                  </div>
                )
              )}

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="font-medium">ทั้งหมด</span>
                <span className="font-medium">
                  {batch._count.participants} คน
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-futsal-navy mb-4">
          รายชื่อผู้เข้าร่วม
        </h2>

        {batch.participants.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              ยังไม่มีผู้เข้าร่วม
            </h3>
            <p className="text-gray-600">
              ยังไม่มีโค้ชลงทะเบียนเข้าร่วมรุ่นนี้
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      ชื่อ-นามสกุล
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      อีเมล
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      พื้นที่
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      วันที่ลงทะเบียน
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      สถานะ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {batch.participants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link
                          href={`/dashboard/coach/${participant.coach.id}`}
                          className="text-futsal-blue hover:underline"
                        >
                          {participant.coach.user.firstName}{" "}
                          {participant.coach.user.lastName}
                          {participant.coach.nickname && (
                            <span> "{participant.coach.nickname}"</span>
                          )}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        {participant.coach.user.email}
                      </td>
                      <td className="py-3 px-4">
                        {participant.coach.location
                          ? `${participant.coach.location.amphoe}, ${participant.coach.location.province}`
                          : "-"}
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(participant.registeredAt)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            participant.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : participant.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : participant.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {statusLabels[participant.status] ||
                            participant.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}