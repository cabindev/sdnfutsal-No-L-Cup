// app/dashboard/training/batch/edit/[id]/page.tsx
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/lib/configs/auth/authOptions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/app/lib/db";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BatchForm } from "../../components/BatchForm";

export default async function EditBatchPage({ 
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
    where: { id: batchId }
  });
  
  if (!batch) {
    notFound();
  }

  // แปลงข้อมูลให้เข้ากับ FormData
  const initialData = {
    id: batch.id.toString(),
    batchNumber: batch.batchNumber.toString(),
    year: batch.year.toString(),
    startDate: batch.startDate.toISOString().split('T')[0], // แปลงเป็นรูปแบบ YYYY-MM-DD
    endDate: batch.endDate.toISOString().split('T')[0],
    location: batch.location,
    maxParticipants: batch.maxParticipants,
    registrationEndDate: batch.registrationEndDate.toISOString().split('T')[0],
    description: batch.description || '',
    isActive: batch.isActive
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href={`/dashboard/training/batch/${batch.id}`}>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            กลับไปหน้ารายละเอียด
          </Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-futsal-navy">แก้ไขรุ่นอบรม</h1>
        <p className="text-gray-600">แก้ไขข้อมูลรุ่นที่ {batch.batchNumber}/{batch.year}</p>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <BatchForm initialData={initialData} isEditing={true} />
      </div>
    </div>
  );
}