// app/actions/training-batch/get-all.ts
'use server'

import prisma from '@/app/lib/db';
import { getServerSession } from "next-auth/next";
import authOptions from '@/app/lib/configs/auth/authOptions';

export async function getAllTrainingBatches() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { success: false, error: "คุณไม่มีสิทธิ์เข้าถึงข้อมูล" };
    }
    
    const batches = await prisma.trainingBatch.findMany({
      orderBy: [
        { year: 'desc' },
        { batchNumber: 'desc' }
      ],
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });
    
    return { success: true, data: batches };
  } catch (error) {
    console.error('Error getting all batches:', error);
    return { success: false, error: 'ไม่สามารถดึงข้อมูลรุ่นการอบรมได้' };
  }
}