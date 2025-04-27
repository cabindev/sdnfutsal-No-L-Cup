// app/actions/training-batch/update.ts
'use server'

import { revalidatePath } from 'next/cache';
import prisma from '@/app/lib/db';
import { getServerSession } from "next-auth/next";
import authOptions from '@/app/lib/configs/auth/authOptions';

// กำหนด interface สำหรับผลลัพธ์
interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function updateBatch(formData: FormData): Promise<ActionResult> {
  try {
    // ตรวจสอบ session สำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: "คุณไม่มีสิทธิ์ในการแก้ไขรุ่นอบรม" };
    }
    
    // รับค่า id ของรุ่นอบรมที่ต้องการแก้ไข
    const batchId = formData.get('id');
    if (!batchId) {
      return { success: false, error: "ไม่พบรหัสรุ่นอบรม" };
    }
    
    // ตรวจสอบว่ารุ่นอบรมมีอยู่จริงหรือไม่
    const existingBatch = await prisma.trainingBatch.findUnique({
      where: { id: Number(batchId) }
    });

    if (!existingBatch) {
      return { success: false, error: "ไม่พบข้อมูลรุ่นอบรมในระบบ" };
    }
    
    // ดึงข้อมูลจาก FormData
    const batchNumber = Number(formData.get('batchNumber'));
    const year = Number(formData.get('year'));
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const location = formData.get('location') as string;
    const maxParticipants = Number(formData.get('maxParticipants'));
    const registrationEndDate = new Date(formData.get('registrationEndDate') as string);
    const description = formData.get('description') as string || null;
    const isActive = formData.get('isActive') === 'true';
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!batchNumber || !year || !startDate || !endDate || !location || !maxParticipants || !registrationEndDate) {
      return { success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
    }
    
    // ตรวจสอบว่ามีรุ่นที่ซ้ำกันหรือไม่ (ยกเว้นรุ่นปัจจุบัน)
    const duplicateBatch = await prisma.trainingBatch.findFirst({
      where: {
        batchNumber,
        year,
        id: { not: Number(batchId) }
      }
    });
    
    if (duplicateBatch) {
      return { success: false, error: `มีรุ่นที่ ${batchNumber}/${year} อยู่แล้วในระบบ` };
    }
    
    // อัพเดทข้อมูลรุ่นอบรม
    const batch = await prisma.trainingBatch.update({
      where: { id: Number(batchId) },
      data: {
        batchNumber,
        year,
        startDate,
        endDate,
        location,
        maxParticipants,
        registrationEndDate,
        description,
        isActive
      }
    });
    
    // Revalidate หน้าที่เกี่ยวข้อง
    revalidatePath('/dashboard/training/batch');
    revalidatePath(`/dashboard/training/batch/${batch.id}`);
    
    return { success: true, data: batch };
      
  } catch (error) {
    console.error('Error updating batch:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: 'ไม่สามารถอัพเดทข้อมูลรุ่นอบรมได้' };
  }
}