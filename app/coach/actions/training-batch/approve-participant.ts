// app/coach/actions/training-batch/approve-participant.ts
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