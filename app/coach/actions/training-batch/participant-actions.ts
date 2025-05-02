// app/coach/actions/training-batch/participant-actions.ts
'use server'

import { revalidatePath } from 'next/cache';
import prisma from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/lib/configs/auth/authOptions';

/**
 * อนุมัติการเข้าร่วมอบรมของโค้ช
 * และอัพเดตสถานะการอนุมัติโค้ชด้วย
 */
export async function approveParticipant(participantId: number) {
  try {
    // ตรวจสอบสิทธิ์ผู้ใช้งาน
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

    // ใช้ transaction เพื่อให้ทั้งสองการอัพเดตต้องสำเร็จพร้อมกัน
    const [updatedParticipant, updatedCoach] = await prisma.$transaction([
      // อัพเดตสถานะผู้เข้าร่วม
      prisma.batchParticipant.update({
        where: { id: participantId },
        data: { status: 'APPROVED' }
      }),
      // อัพเดตสถานะโค้ช
      prisma.coach.update({
        where: { id: participant.coachId },
        data: { isApproved: true }
      })
    ]);
    
    // revalidate ทุกเส้นทางที่เกี่ยวข้อง
    revalidatePath('/dashboard/training/participants');
    revalidatePath('/dashboard/training');
    revalidatePath('/dashboard/coach');
    revalidatePath(`/dashboard/coach/${participant.coachId}`);
    
    return { 
      success: true, 
      data: { 
        participant: updatedParticipant, 
        coach: updatedCoach 
      } 
    };
  } catch (error) {
    console.error('Error approving participant:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'ไม่สามารถอนุมัติผู้เข้าร่วมได้' 
    };
  }
}

/**
 * ปฏิเสธการเข้าร่วมอบรมของโค้ช
 */
export async function rejectParticipant(participantId: number) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'คุณไม่มีสิทธิ์ในการดำเนินการนี้' };
    }
    
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
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'ไม่สามารถปฏิเสธผู้เข้าร่วมได้' 
    };
  }
}

/**
 * ยกเลิกการเข้าร่วมอบรมของโค้ช
 */
export async function cancelParticipation(participantId: number) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'คุณไม่มีสิทธิ์ในการดำเนินการนี้' };
    }
    
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
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'ไม่สามารถยกเลิกการเข้าร่วมได้' 
    };
  }
}

/**
 * บันทึกการเข้าร่วมอบรม (เช็คชื่อ)
 */
export async function markAttendance(participantId: number, attended: boolean) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'คุณไม่มีสิทธิ์ในการดำเนินการนี้' };
    }
    
    const updated = await prisma.batchParticipant.update({
      where: { id: participantId },
      data: { isAttended: attended }
    });
    
    // revalidate paths
    revalidatePath('/dashboard/training/participants');
    
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error marking attendance:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'ไม่สามารถบันทึกการเข้าร่วมได้' 
    };
  }
}

/**
 * เพิ่มหมายเหตุสำหรับผู้เข้าร่วม
 */
export async function addParticipantNote(participantId: number, note: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'คุณไม่มีสิทธิ์ในการดำเนินการนี้' };
    }
    
    const updated = await prisma.batchParticipant.update({
      where: { id: participantId },
      data: { notes: note }
    });
    
    // revalidate paths
    revalidatePath('/dashboard/training/participants');
    
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error adding note:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'ไม่สามารถเพิ่มหมายเหตุได้' 
    };
  }
}