// app/coach/actions/coach/approvals.ts
'use server'

import { revalidatePath } from 'next/cache';
import prisma from '@/app/lib/db';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/lib/configs/auth/authOptions';

// อนุมัติโค้ช
export async function approveCoach(id: number) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'คุณไม่มีสิทธิ์ในการดำเนินการนี้' };
    }
    
    const coach = await prisma.coach.update({
      where: { id },
      data: { isApproved: true },
    });
    
    revalidatePath('/dashboard/coach');
    
    return { success: true, data: coach };
  } catch (error) {
    console.error('Error approving coach:', error);
    return { success: false, error: 'ไม่สามารถอนุมัติโค้ชได้' };
  }
}

