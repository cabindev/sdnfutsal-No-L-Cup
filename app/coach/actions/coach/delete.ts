'use server'

import { revalidatePath } from 'next/cache';
import prisma from '@/app/lib/db';
import { getServerSession } from "next-auth/next";
import authOptions from '@/app/lib/configs/auth/authOptions';

export async function deleteCoach(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { success: false, error: 'ไม่ได้รับอนุญาตให้ดำเนินการ' };
  }
    
  try {
    // ตรวจสอบว่ามีสิทธิ์ลบข้อมูลหรือไม่
    const coach = await prisma.coach.findUnique({
      where: { id },
      select: { 
        userId: true,
        batchParticipations: true  // เพิ่มการเลือกข้อมูลการเข้าร่วมรุ่น
      },
    });
        
    if (!coach) {
      return { success: false, error: 'ไม่พบข้อมูลโค้ช' };
    }
        
    if (coach.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return { success: false, error: 'ไม่มีสิทธิ์ลบข้อมูลนี้' };
    }
    
    // ต้องลบข้อมูลที่เกี่ยวข้องก่อน
    // ลบข้อมูลการเข้าร่วมรุ่นอบรม
    await prisma.batchParticipant.deleteMany({
      where: { coachId: id },
    });
        
    // ลบข้อมูลโค้ช
    await prisma.coach.delete({
      where: { id },
    });
        
    revalidatePath('/dashboard/coach');
    return { success: true };
  } catch (error) {
    console.error('Error deleting coach:', error);
    return { success: false, error: 'ไม่สามารถลบข้อมูลโค้ชได้' };
  }
}