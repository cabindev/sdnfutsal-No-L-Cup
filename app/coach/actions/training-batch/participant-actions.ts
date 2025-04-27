// app/coach/actions/training-batch/participant-actions.ts
'use server'

import prisma from '@/app/lib/db';

export async function approveParticipant(participantId: number) {
  try {
    const updated = await prisma.batchParticipant.update({
      where: { id: participantId },
      data: { status: 'APPROVED' }
    });
    
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error approving participant:', error);
    return { success: false, error: 'ไม่สามารถอนุมัติผู้เข้าร่วมได้' };
  }
}

export async function rejectParticipant(participantId: number) {
  try {
    const updated = await prisma.batchParticipant.update({
      where: { id: participantId },
      data: { status: 'REJECTED' }
    });
    
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
    
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error adding note:', error);
    return { success: false, error: 'ไม่สามารถเพิ่มหมายเหตุได้' };
  }
}