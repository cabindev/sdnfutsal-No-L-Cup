// app/coach/actions/coach/update.ts
'use server'

import { revalidatePath } from 'next/cache';
import prisma from '@/app/lib/db';
import { getServerSession } from "next-auth/next";
import authOptions from '@/app/lib/configs/auth/authOptions';
import { Gender, Religion, FoodPreference, CoachStatus, ShirtSize } from '@prisma/client';

// กำหนด interface สำหรับผลลัพธ์
interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function updateCoach(formData: FormData): Promise<ActionResult> {
  try {
    // ตรวจสอบ session สำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { success: false, error: "คุณต้องเข้าสู่ระบบก่อนแก้ไขข้อมูลโค้ช" };
    }
    
    // รับค่า id ของโค้ชที่ต้องการแก้ไข
    const formCoachId = formData.get('id');
    if (!formCoachId) {
      return { success: false, error: "ไม่พบรหัสโค้ช" };
    }

    const coachId = Number(formCoachId);
    if (isNaN(coachId)) {
      return { success: false, error: "รหัสโค้ชไม่ถูกต้อง" };
    }
    
    // ตรวจสอบว่าโค้ชมีอยู่จริงหรือไม่
    const existingCoach = await prisma.coach.findUnique({
      where: { id: coachId },
      include: { 
        user: true,
        batchParticipations: true
      }
    });

    if (!existingCoach) {
      return { success: false, error: "ไม่พบข้อมูลโค้ชในระบบ" };
    }
    
    // ตรวจสอบสิทธิ์การแก้ไข (เฉพาะเจ้าของหรือแอดมิน)
    if (existingCoach.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return { success: false, error: "คุณไม่มีสิทธิ์แก้ไขข้อมูลนี้" };
    }

    // ดึงข้อมูลจาก FormData
    const gender = formData.get('gender') as string;
    const age = Number(formData.get('age') || 0);
    const nickname = formData.get('nickname') as string || null;
    const teamName = formData.get('teamName') as string || null;
    const idCardNumber = formData.get('idCardNumber') as string;
    const address = formData.get('address') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const lineId = formData.get('lineId') as string || null;
    const religion = formData.get('religion') as string;
    const hasMedicalCondition = formData.get('hasMedicalCondition') === 'true';
    const medicalCondition = formData.get('medicalCondition') as string || null;
    const foodPreference = formData.get('foodPreference') as string;
    const coachStatus = formData.get('coachStatus') as string;
    const coachExperience = Number(formData.get('coachExperience') || 0);
    const participationCount = Number(formData.get('participationCount') || 0);
    const accommodation = formData.get('accommodation') === 'true';
    const shirtSize = formData.get('shirtSize') as string;
    const expectations = formData.get('expectations') as string || null;
    
    // ดึงข้อมูลตำแหน่ง
    const district = formData.get('district') as string;
    const amphoe = formData.get('amphoe') as string;
    const province = formData.get('province') as string;
    const zone = formData.get('zone') as string || null;
    
    // ดึงข้อมูลรุ่นที่เลือก
    let selectedBatchIds: number[] = [];
    
    // กรณีส่งมาเป็น array ในชื่อ selectedBatchIds[]
    const batchIdsFromArray = formData.getAll('selectedBatchIds[]');
    if (batchIdsFromArray.length > 0) {
      // ตรวจสอบกรณีที่มีการส่งค่าว่างมา (สำหรับกรณีไม่เลือกรุ่นใดๆ)
      if (batchIdsFromArray.length === 1 && batchIdsFromArray[0] === '') {
        selectedBatchIds = [];
      } else {
        for (const idValue of batchIdsFromArray) {
          const id = Number(idValue);
          if (!isNaN(id)) {
            selectedBatchIds.push(id);
          }
        }
      }
    } 
    // กรณีส่งมาเป็น string ในชื่อ selectedBatchIds คั่นด้วยเครื่องหมาย , หรือ ;
    else {
      const batchIdsStr = formData.get('selectedBatchIds') as string;
      if (batchIdsStr) {
        let idArray: string[] = [];
        
        if (batchIdsStr.includes(',')) {
          idArray = batchIdsStr.split(',');
        } else if (batchIdsStr.includes(';')) {
          idArray = batchIdsStr.split(';');
        } else {
          // กรณีมีเพียงค่าเดียว
          idArray = [batchIdsStr];
        }
        
        for (const idStr of idArray) {
          const id = Number(idStr.trim());
          if (!isNaN(id)) {
            selectedBatchIds.push(id);
          }
        }
      }
    }
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!gender || !idCardNumber || !address || !phoneNumber || !religion || 
        !foodPreference || !coachStatus || !shirtSize || !district || !amphoe || !province) {
      return { success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
    }
    
    // ตรวจสอบว่ามี Coach คนอื่นที่ใช้ idCardNumber เดียวกันอยู่แล้วหรือไม่
    if (idCardNumber !== existingCoach.idCardNumber) {
      const duplicateCoach = await prisma.coach.findUnique({
        where: { idCardNumber }
      });
      
      if (duplicateCoach) {
        return { success: false, error: 'เลขบัตรประชาชนนี้ถูกใช้ลงทะเบียนแล้ว' };
      }
    }
      
    // ค้นหาหรือสร้างข้อมูลตำแหน่ง
    let location = null;
    try {
      // ค้นหาตำแหน่งที่มีอยู่แล้ว
      location = await prisma.location.findFirst({
        where: {
          AND: [
            { district },
            { amphoe },
            { province }
          ]
        }
      });
      
      // ถ้าไม่พบ ให้สร้างใหม่
      if (!location) {
        location = await prisma.location.create({
          data: {
            district,
            amphoe,
            province,
            zone,
          },
        });
      } 
      // ถ้าพบแล้วแต่ค่า zone ไม่ตรงกัน ให้อัพเดทค่า zone
      else if (location.zone !== zone) {
        location = await prisma.location.update({
          where: { id: location.id },
          data: { zone }
        });
      }
    } catch (locationError) {
      console.error('Error handling location:', locationError);
      return { success: false, error: 'เกิดข้อผิดพลาดในการจัดการข้อมูลตำแหน่ง' };
    }
    
    // เตรียมข้อมูลสำหรับการอัพเดทโค้ช
    const coachData = {
      teamName,
      nickname,
      gender: gender as Gender,
      age,
      idCardNumber,
      address,
      phoneNumber,
      lineId,
      religion: religion as Religion,
      hasMedicalCondition,
      medicalCondition,
      foodPreference: foodPreference as FoodPreference,
      coachStatus: coachStatus as CoachStatus,
      coachExperience,
      participationCount,
      accommodation,
      shirtSize: shirtSize as ShirtSize,
      expectations,
      locationId: location?.id,
    };
    
    // อัพเดทข้อมูลโค้ช
    const coach = await prisma.coach.update({
      where: { id: coachId },
      data: coachData,
      include: {
        location: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            image: true
          }
        }
      }
    });
    
    // จัดการการลงทะเบียนรุ่น (BatchParticipant)
    if (selectedBatchIds.length > 0) {
      // ตรวจสอบว่ารุ่นมีอยู่จริงหรือไม่
      const existingBatches = await prisma.trainingBatch.findMany({
        where: {
          id: {
            in: selectedBatchIds
          }
        },
        select: {
          id: true
        }
      });
      
      const validBatchIds = existingBatches.map(batch => batch.id);
      
      if (validBatchIds.length > 0) {
        // ดึงข้อมูลการลงทะเบียนที่มีอยู่แล้ว
        const existingRegistrations = await prisma.batchParticipant.findMany({
          where: {
            coachId: coachId
          },
          select: {
            batchId: true
          }
        });
        
        const existingBatchIds = existingRegistrations.map(reg => reg.batchId);
        
        // หา batchId ที่ต้องเพิ่มใหม่
        const batchIdsToAdd = validBatchIds.filter(id => !existingBatchIds.includes(id));
        
        // หา batchId ที่ต้องลบออก
        const batchIdsToRemove = existingBatchIds.filter(id => !validBatchIds.includes(id));
        
        // สร้างข้อมูลการลงทะเบียนใหม่
        if (batchIdsToAdd.length > 0) {
          for (const batchId of batchIdsToAdd) {
            await prisma.batchParticipant.create({
              data: {
                coachId: coachId,
                batchId,
                status: 'PENDING',
                isAttended: false
              }
            });
          }
        }
        
        // ลบข้อมูลการลงทะเบียนเก่าที่ไม่ได้เลือกแล้ว
        if (batchIdsToRemove.length > 0) {
          await prisma.batchParticipant.deleteMany({
            where: {
              coachId: coachId,
              batchId: {
                in: batchIdsToRemove
              }
            }
          });
        }
      }
    } else {
      // กรณีไม่เลือกรุ่นใดๆ ให้ลบการลงทะเบียนทั้งหมด
      await prisma.batchParticipant.deleteMany({
        where: {
          coachId: coachId
        }
      });
    }
    
    // ดึงข้อมูลโค้ชพร้อมการลงทะเบียนหลังจากอัพเดทเรียบร้อยแล้ว
    const coachWithRegistrations = await prisma.coach.findUnique({
      where: { id: coachId },
      include: {
        location: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            image: true
          }
        },
        batchParticipations: {
          include: {
            batch: true
          }
        }
      }
    });
    
    // สร้างข้อมูลที่จะส่งกลับ
    const responseData = {
      ...coachWithRegistrations,
      selectedBatchIds: selectedBatchIds.length > 0 ? selectedBatchIds : []
    };
    
    // Revalidate หน้าที่เกี่ยวข้อง
    revalidatePath('/dashboard/coach');
    revalidatePath(`/dashboard/coach/${coachId}`);
    revalidatePath('/dashboard/training/participants');
    revalidatePath('/dashboard/training/batch');
    revalidatePath('/dashboard/coach/training');
    
    return { 
      success: true, 
      data: responseData
    };
      
  } catch (error) {
    console.error('Error updating coach:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: 'ไม่สามารถอัพเดทข้อมูลโค้ชได้' };
  }
}