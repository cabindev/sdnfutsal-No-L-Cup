// app/coach/actions/coach/get.ts
'use server'

import prisma from '@/app/lib/db';
import { getServerSession } from "next-auth/next";
import authOptions from '@/app/lib/configs/auth/authOptions';

interface GetCoachResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function getCoach(id: string): Promise<GetCoachResult> {
  try {
    // ตรวจสอบ session สำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { success: false, error: "คุณต้องเข้าสู่ระบบก่อนเข้าถึงข้อมูลโค้ช" };
    }
    
    const coachId = Number(id);
    
    if (isNaN(coachId)) {
      return { success: false, error: "รหัสโค้ชไม่ถูกต้อง" };
    }
    
    const coach = await prisma.coach.findUnique({
      where: { id: coachId },
      include: {
        location: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    if (!coach) {
      return { success: false, error: "ไม่พบข้อมูลโค้ช" };
    }
    
    // ตรวจสอบว่าเป็นเจ้าของหรือแอดมินหรือไม่
    if (coach.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return { success: false, error: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้" };
    }
    
    return { success: true, data: coach };
  } catch (error) {
    console.error('Error fetching coach:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลโค้ช' };
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลรุ่นอบรมทั้งหมด
export async function getAllTrainingBatches() {
  'use server';
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { success: false, error: 'ไม่ได้รับอนุญาต' };
    }
    
    // ดึงข้อมูลรุ่นอบรมทั้งหมด เรียงตามปีและรุ่นล่าสุด
    const batches = await prisma.trainingBatch.findMany({
      select: {
        id: true,
        batchNumber: true,
        year: true,
        isActive: true,
      },
      orderBy: [
        { year: 'desc' },
        { batchNumber: 'desc' },
      ],
    });
    
    return { success: true, data: batches };
  } catch (error) {
    console.error('Error fetching training batches:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรุ่นอบรม' };
  }
}

// ฟังก์ชันดึงข้อมูลสถิติสำหรับ dashboard
export async function getCoachStats() {
  'use server';
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { success: false, error: 'ไม่ได้รับอนุญาต' };
    }
    
    // สร้าง Date object สำหรับวันแรกของเดือนปัจจุบัน
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // คำนวณสถิติจากฐานข้อมูล
    const [totalCoaches, approvedCoaches, pendingCoaches, monthlyRegistrations, totalBatches, activeBatches, totalParticipants] = await Promise.all([
      prisma.coach.count(),
      prisma.coach.count({ where: { isApproved: true } }),
      prisma.coach.count({ where: { isApproved: false } }),
      prisma.coach.count({ 
        where: { 
          createdAt: { gte: firstDayOfMonth } 
        } 
      }),
      prisma.trainingBatch.count(),
      prisma.trainingBatch.count({ 
        where: { 
          isActive: true,
          endDate: { gte: now }
        } 
      }),
      prisma.batchParticipant.count()
    ]);
    
    return { 
      success: true, 
      data: {
        totalCoaches,
        approvedCoaches,
        pendingCoaches,
        monthlyRegistrations,
        totalBatches,
        activeTrainings: activeBatches,
        totalParticipants
      }
    };
  } catch (error) {
    console.error('Error fetching coach stats:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติโค้ช' };
  }
}

// ฟังก์ชันดึงรุ่นอบรมที่กำลังจะมาถึง
export async function getUpcomingBatches(limit = 3) {
  'use server';
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { success: false, error: 'ไม่ได้รับอนุญาต' };
    }
    
    const batches = await prisma.trainingBatch.findMany({
      where: {
        startDate: {
          gte: new Date()
        }
      },
      orderBy: [
        { startDate: 'asc' }
      ],
      take: limit,
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });
    
    return { success: true, data: batches };
  } catch (error) {
    console.error('Error fetching upcoming batches:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรุ่นอบรมที่กำลังจะมาถึง' };
  }
}

// ฟังก์ชันดึงรุ่นอบรมจัดกลุ่มตามปี
export async function getTrainingBatchesByYear() {
  'use server';
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { success: false, error: 'ไม่ได้รับอนุญาต' };
    }
    
    const batches = await prisma.trainingBatch.findMany({
      orderBy: [
        { year: 'desc' },
        { batchNumber: 'desc' }
      ],
      select: {
        id: true,
        batchNumber: true,
        year: true,
        startDate: true,
        endDate: true,
        isActive: true,
        _count: {
          select: { participants: true }
        }
      }
    });
    
    // จัดกลุ่มตามปี
    const batchesByYear = batches.reduce((acc, batch) => {
      const year = batch.year.toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(batch);
      return acc;
    }, {} as Record<string, typeof batches>);
    
    return { success: true, data: batchesByYear };
  } catch (error) {
    console.error('Error fetching batches by year:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรุ่นอบรมตามปี' };
  }
}