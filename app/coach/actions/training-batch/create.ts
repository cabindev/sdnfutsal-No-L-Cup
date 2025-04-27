// app/actions/training-batch/create.ts
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

export async function createBatch(formData: FormData): Promise<ActionResult> {
  try {
    // ตรวจสอบ session สำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: "คุณไม่มีสิทธิ์ในการสร้างรุ่นอบรม" };
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
    
    // ตรวจสอบว่ามีรุ่นที่ซ้ำกันหรือไม่
    const existingBatch = await prisma.trainingBatch.findFirst({
      where: {
        batchNumber,
        year
      }
    });
    
    if (existingBatch) {
      return { success: false, error: `มีรุ่นที่ ${batchNumber}/${year} อยู่แล้วในระบบ` };
    }
    
    // สร้างรุ่นอบรมใหม่
    const batch = await prisma.trainingBatch.create({
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
    
    return { success: true, data: batch };
  } catch (error) {
    console.error('Error creating batch:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: 'ไม่สามารถสร้างรุ่นอบรมได้' };
  }
}