// app/actions/training-batch/delete.ts
'use server'

import { revalidatePath } from 'next/cache';
import prisma from '@/app/lib/db';
import { getServerSession } from "next-auth/next";
import authOptions from '@/app/lib/configs/auth/authOptions';

// กำหนด interface สำหรับผลลัพธ์
interface ActionResult {
  success: boolean;
  error?: string;
}

export async function deleteBatch(id: number): Promise<ActionResult> {
  try {
    // ตรวจสอบ session สำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: "คุณไม่มีสิทธิ์ในการลบรุ่นอบรม" };
    }
    
    // ตรวจสอบว่ารุ่นอบรมมีอยู่จริงหรือไม่
    const batch = await prisma.trainingBatch.findUnique({
      where: { id },
      include: {
        participants: true
      }
    });
    
    if (!batch) {
      return { success: false, error: "ไม่พบข้อมูลรุ่นอบรมในระบบ" };
    }
    
    // ลบข้อมูลการลงทะเบียนที่เกี่ยวข้องก่อน
    if (batch.participants.length > 0) {
      await prisma.batchParticipant.deleteMany({
        where: { batchId: id }
      });
    }
    
    // ลบข้อมูลรุ่นอบรม
    await prisma.trainingBatch.delete({
      where: { id }
    });
    
    // Revalidate หน้าที่เกี่ยวข้อง
    revalidatePath('/dashboard/training/batch');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting batch:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: 'ไม่สามารถลบรุ่นอบรมได้' };
  }
}