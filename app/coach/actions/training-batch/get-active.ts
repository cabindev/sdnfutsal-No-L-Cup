// app/coach/actions/training-batch/get-active.ts
'use server'

import prisma from '@/app/lib/db';
import { TrainingBatch } from '@prisma/client';

// กำหนด type response ที่ตรงกับข้อมูลจาก Prisma
export interface TrainingBatchWithCount extends TrainingBatch {
  _count?: {
    participants: number;
  }
}

export interface TrainingBatchesResponse {
  success: boolean;
  data?: TrainingBatchWithCount[];
  error?: string;
}

export async function getActiveTrainingBatches(): Promise<TrainingBatchesResponse> {
  try {
    const batches = await prisma.trainingBatch.findMany({
      where: {
        isActive: true,
        registrationEndDate: {
          gte: new Date()
        }
      },
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
    console.error('Error getting active batches:', error);
    return { success: false, error: 'ไม่สามารถดึงข้อมูลรุ่นการอบรมได้' };
  }
}

export async function getBatchDetail(id: number) {
  try {
    const batch = await prisma.trainingBatch.findUnique({
      where: { id },
      include: {
        _count: {
          select: { participants: true }
        },
        participants: {
          include: {
            coach: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  }
                },
                location: true
              }
            }
          }
        }
      }
    });
    
    if (!batch) {
      return { success: false, error: 'ไม่พบข้อมูลรุ่นการอบรม' };
    }
    
    return { success: true, data: batch };
  } catch (error) {
    console.error('Error fetching batch detail:', error);
    return { success: false, error: 'ไม่สามารถดึงข้อมูลรุ่นการอบรมได้' };
  }
}

export async function registerToBatch(coachId: number, batchId: number) {
  try {
    // ตรวจสอบว่ามีโค้ชคนนี้หรือไม่
    const coach = await prisma.coach.findUnique({
      where: { id: coachId },
    });
    
    if (!coach) {
      return { success: false, error: 'ไม่พบข้อมูลโค้ช' };
    }
    
    // ตรวจสอบว่ามีรุ่นนี้หรือไม่ และยังเปิดรับสมัครอยู่หรือไม่
    const batch = await prisma.trainingBatch.findUnique({
      where: { 
        id: batchId,
        isActive: true,
        registrationEndDate: {
          gte: new Date()
        }
      },
      include: {
        participants: true
      }
    });
    
    if (!batch) {
      return { success: false, error: 'ไม่พบรุ่นการอบรมหรือการรับสมัครได้ปิดไปแล้ว' };
    }
    
    // ตรวจสอบว่าจำนวนผู้เข้าร่วมเต็มหรือยัง
    if (batch.participants.length >= batch.maxParticipants) {
      return { success: false, error: 'จำนวนผู้เข้าร่วมเต็มแล้ว' };
    }
    
    // ตรวจสอบว่าโค้ชลงทะเบียนไปแล้วหรือไม่
    const existingRegistration = await prisma.batchParticipant.findUnique({
      where: {
        batchId_coachId: {
          batchId,
          coachId
        }
      }
    });
    
    if (existingRegistration) {
      return { success: false, error: 'คุณได้ลงทะเบียนในรุ่นนี้ไปแล้ว' };
    }
    
    // สร้างการลงทะเบียนใหม่
    const registration = await prisma.batchParticipant.create({
      data: {
        batchId,
        coachId,
        status: 'PENDING'
      },
      include: {
        batch: true
      }
    });
    
    return { success: true, data: registration };
  } catch (error) {
    console.error('Error registering for batch:', error);
    return { success: false, error: 'ไม่สามารถลงทะเบียนได้ โปรดลองอีกครั้ง' };
  }
}

export async function getRecentRegistrations(limit: number = 5) {
    try {
      const registrations = await prisma.batchParticipant.findMany({
        take: limit,
        orderBy: {
          registeredAt: 'desc'
        },
        include: {
          coach: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          batch: true
        }
      });
      
      return { success: true, data: registrations };
    } catch (error) {
      console.error('Error getting recent registrations:', error);
      return { success: false, error: 'ไม่สามารถดึงข้อมูลการลงทะเบียนล่าสุดได้' };
    }
  }
  
  export async function getBatchRegistrationSummary() {
    try {
      const activeBatches = await prisma.trainingBatch.findMany({
        where: {
          isActive: true,
          registrationEndDate: {
            gte: new Date()
          }
        },
        orderBy: [
          { registrationEndDate: 'asc' } // เรียงตามวันที่ปิดรับสมัครที่ใกล้จะถึงก่อน
        ],
        include: {
          _count: {
            select: { participants: true }
          }
        },
        take: 5 // แสดง 5 รุ่นล่าสุด
      });
      
      return { success: true, data: activeBatches };
    } catch (error) {
      console.error('Error getting batch registration summary:', error);
      return { success: false, error: 'ไม่สามารถดึงข้อมูลสรุปการลงทะเบียนได้' };
    }
  }