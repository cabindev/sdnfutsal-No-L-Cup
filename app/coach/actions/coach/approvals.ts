// app/coach/actions/coach/approvals.ts
'use server'

import { revalidatePath } from 'next/cache';
import prisma from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/lib/configs/auth/authOptions';

export async function approveCoach(id: number) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'คุณไม่มีสิทธิ์ในการดำเนินการนี้' };
    }
    
    // ใช้ transaction เพื่อความสอดคล้อง
    await prisma.$transaction(async (tx) => {
      // อัพเดตสถานะโค้ช
      await tx.coach.update({
        where: { id },
        data: { 
          isApproved: true,
          updatedAt: new Date() // บังคับให้อัพเดต
        }
      });
      
      // อัพเดตสถานะผู้เข้าร่วมที่รอการอนุมัติด้วย
      await tx.batchParticipant.updateMany({
        where: {
          coachId: id,
          status: 'PENDING'
        },
        data: { status: 'APPROVED' }
      });
    });
    
    // revalidate ทุกเส้นทางที่เกี่ยวข้อง
    revalidatePath('/dashboard/coach');
    revalidatePath(`/dashboard/coach/${id}`);
    revalidatePath('/dashboard/training');
    revalidatePath('/dashboard/training/participants');
    
    // ล้าง cache ทั้งหมด (อาจใช้เมื่อมีปัญหากับ cache)
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error('Error approving coach:', error);
    return { success: false, error: 'ไม่สามารถอนุมัติโค้ชได้' };
  }
}