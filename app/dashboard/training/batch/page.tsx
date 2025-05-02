// app/dashboard/training/batch/page.tsx
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/lib/configs/auth/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Plus, Edit, Calendar, Users, MapPin, ChevronRight, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { BatchDeleteButton } from "./components/BatchDeleteButton";
import { getAllTrainingBatches } from "@/app/coach/actions/training-batch/get-all";
import { Badge } from "@/app/components/ui/badge";
import prisma from "@/app/lib/db";
import BatchStatCards from "./components/BatchStatCards";
import BatchFilterTabs from "./components/BatchFilterTabs";
import EmptyBatchState from "./components/EmptyBatchState";
import { TrainingBatchWithCount } from "@/app/coach/types/training-batch";

export default async function TrainingBatchesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect("/auth/signin?callbackUrl=/dashboard/training/batch");
  }
  
  // แก้ไขโดยเพิ่ม await ให้กับ searchParams
  const resolvedParams = await searchParams;
  const filter = resolvedParams.filter || 'all';
  
  // สถิติรุ่นอบรม
  const stats = {
    total: await prisma.trainingBatch.count(),
    active: await prisma.trainingBatch.count({ where: { isActive: true } }),
    upcoming: await prisma.trainingBatch.count({ 
      where: { startDate: { gte: new Date() } } 
    }),
    participants: await prisma.batchParticipant.count()
  };

  // ดึงรุ่นอบรมทั้งหมด
  const batchesResult = await getAllTrainingBatches();
  const batches = (batchesResult.success && batchesResult.data)
    ? batchesResult.data.filter((batch) => {
        if (filter === 'active') return batch.isActive;
        if (filter === 'inactive') return !batch.isActive;
        if (filter === 'upcoming') return new Date(batch.startDate) >= new Date();
        if (filter === 'past') return new Date(batch.endDate) < new Date();
        return true;
      })
    : [];
  
  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper function สำหรับแสดงจำนวนผู้เข้าร่วม
  const getParticipantCount = (batch: TrainingBatchWithCount): number => {
    return batch._count?.participants || 0;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-futsal-navy">
            จัดการรุ่นการอบรม
          </h1>
          <p className="text-gray-600">สร้างและจัดการรุ่นการอบรมโค้ชฟุตซอล</p>
        </div>

        <Button
          asChild
          className="mt-4 sm:mt-0 bg-futsal-orange hover:bg-futsal-orange/90"
        >
          <Link href="/dashboard/training/batch/add">
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มรุ่นอบรมใหม่
          </Link>
        </Button>
      </div>

      {/* สถิติ Component */}
      <BatchStatCards stats={stats} />

      {/* เนื้อหาหลัก */}
      <div className="mt-6">
        {/* ตัวกรอง Component */}
        <BatchFilterTabs currentFilter={filter} />

        {/* แสดงรายการรุ่นอบรม */}
        {batches.length === 0 ? (
          <EmptyBatchState filter={filter} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {batches.map((batch) => {
              const participantCount = getParticipantCount(
                batch as TrainingBatchWithCount
              );
              const registrationPercentage =
                (participantCount / batch.maxParticipants) * 100;
              return (
                <Card
                  key={batch.id}
                  className="overflow-hidden border border-gray-200 hover:border-futsal-orange/50 hover:shadow-md transition-all duration-200"
                >
                  <div
                    className={`h-1.5 w-full ${
                      batch.isActive ? "bg-futsal-green" : "bg-gray-300"
                    }`}
                  ></div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium text-futsal-navy">
                        รุ่นที่ {batch.batchNumber}/{batch.year}
                      </h3>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-gray-500 hover:text-futsal-navy"
                        >
                          <Link href={`/dashboard/training/batch/${batch.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <BatchDeleteButton
                          batchId={batch.id}
                          batchName={`${batch.batchNumber}/${batch.year}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-start">
                        <CalendarDays className="h-4 w-4 text-futsal-orange mt-0.5 mr-2" />
                        <div className="text-sm text-gray-700">
                          {formatDate(batch.startDate)} -{" "}
                          {formatDate(batch.endDate)}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-futsal-orange mt-0.5 mr-2" />
                        <div className="text-sm text-gray-700">
                          {batch.location}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Users className="h-4 w-4 text-futsal-orange mt-0.5 mr-2" />
                        <div className="text-sm text-gray-700">
                          {participantCount} / {batch.maxParticipants} คน
                          {participantCount >= batch.maxParticipants && (
                            <span className="text-red-500 ml-1">
                              (เต็มแล้ว)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress bar แสดงจำนวนผู้ลงทะเบียน */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${
                            registrationPercentage >= 90
                              ? "bg-red-500"
                              : registrationPercentage >= 70
                              ? "bg-amber-500"
                              : "bg-futsal-green"
                          }`}
                          style={{
                            width: `${Math.min(registrationPercentage, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="border-t pt-3 flex justify-between items-center">
                      <Badge
                        className={
                          batch.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {batch.isActive ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
                      </Badge>

                      <Link href={`/dashboard/training/batch/${batch.id}`}>
                        <Button
                          variant="link"
                          className="text-futsal-blue p-0 h-auto flex items-center"
                        >
                          ดูรายละเอียด
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}