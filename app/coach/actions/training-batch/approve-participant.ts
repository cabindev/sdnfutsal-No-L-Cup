// app/coach/actions/training-batch/participant-actions.ts
'use server'

import { revalidatePath } from 'next/cache';
import prisma from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/lib/configs/auth/authOptions';

export async function approveParticipant(participantId: number) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'คุณไม่มีสิทธิ์ในการดำเนินการนี้' };
    }
    
    // ดึงข้อมูลผู้เข้าร่วมพร้อม coachId
    const participant = await prisma.batchParticipant.findUnique({
      where: { id: participantId },
      include: { coach: true }
    });
    
    if (!participant) {
      return { success: false, error: 'ไม่พบข้อมูลผู้เข้าร่วม' };
    }

    // ใช้ transaction เพื่ออัพเดตทั้งสองส่วนพร้อมกัน
    await prisma.$transaction([
      // อัพเดตสถานะผู้เข้าร่วม
      prisma.batchParticipant.update({
        where: { id: participantId },
        data: { status: 'APPROVED' }
      }),
      // อัพเดตสถานะโค้ชด้วย
      prisma.coach.update({
        where: { id: participant.coachId },
        data: { 
          isApproved: true,
          updatedAt: new Date() // บังคับให้อัพเดต
        }
      })
    ]);
    
    // revalidate ทุกเส้นทางที่เกี่ยวข้อง
    revalidatePath('/dashboard/training/participants');
    revalidatePath('/dashboard/training');
    revalidatePath('/dashboard/coach');
    revalidatePath(`/dashboard/coach/${participant.coachId}`);
    
    // ล้าง cache ทั้งหมด
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error('Error approving participant:', error);
    return { success: false, error: 'ไม่สามารถอนุมัติผู้เข้าร่วมได้' };
  }
}

// ปรับปรุงฟังก์ชันอื่นๆ ให้มีการ revalidate ด้วย
export async function rejectParticipant(participantId: number) {
  try {
    const updated = await prisma.batchParticipant.update({
      where: { id: participantId },
      data: { status: 'REJECTED' }
    });
    
    // revalidate paths
    revalidatePath('/dashboard/training/participants');
    revalidatePath('/dashboard/training');
    
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error rejecting participant:', error);
    return { success: false, error: 'ไม่สามารถปฏิเสธผู้เข้าร่วมได้' };
  }
}

export async function cancelParticipation(participantId: number) {
  try {
    const updated = await prisma.batchParticipant.update({
      where: { id: participantId },
      data: { status: 'CANCELED' }
    });
    
    // revalidate paths
    revalidatePath('/dashboard/training/participants');
    revalidatePath('/dashboard/training');
    
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error canceling participation:', error);
    return { success: false, error: 'ไม่สามารถยกเลิกการเข้าร่วมได้' };
  }
}

export async function markAttendance(participantId: number, attended: boolean) {
  try {
    const updated = await prisma.batchParticipant.update({
      where: { id: participantId },
      data: { isAttended: attended }
    });
    
    // revalidate paths
    revalidatePath('/dashboard/training/participants');
    
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error marking attendance:', error);
    return { success: false, error: 'ไม่สามารถบันทึกการเข้าร่วมได้' };
  }
}

export async function addParticipantNote(participantId: number, note: string) {
  try {
    const updated = await prisma.batchParticipant.update({
      where: { id: participantId },
      data: { notes: note }
    });
    
    // revalidate paths
    revalidatePath('/dashboard/training/participants');
    
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error adding note:', error);
    return { success: false, error: 'ไม่สามารถเพิ่มหมายเหตุได้' };
  }
}