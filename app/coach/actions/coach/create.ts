// app/coach/actions/coach/create.ts
'use server'

import { revalidatePath } from 'next/cache';
import prisma from '@/app/lib/db';
import { getServerSession } from "next-auth/next";
import authOptions from '@/app/lib/configs/auth/authOptions';
import { Gender, Religion, FoodPreference, CoachStatus, ShirtSize, ParticipationStatus, Prisma } from '@prisma/client';

// กำหนด interface สำหรับผลลัพธ์
interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function createCoach(formData: FormData): Promise<ActionResult> {
  try {
    // ตรวจสอบ session สำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { success: false, error: "คุณต้องเข้าสู่ระบบก่อนลงทะเบียนเป็นโค้ช" };
    }
    
    // ตรวจสอบว่ามี userId หรือไม่
    let userId = session.user.id;
    
    if (!userId) {
      return { success: false, error: "ไม่สามารถระบุตัวตนผู้ใช้ได้" };
    }
    
    // ถ้ามีการส่ง userId มาใน formData ให้ใช้ค่านั้น (สำหรับ admin ที่เพิ่มโค้ชให้ผู้ใช้อื่น)
    const formDataUserId = formData.get('userId');
    if (formDataUserId) {
      userId = Number(formDataUserId);
    }
    
    // ตรวจสอบว่า userId เป็นตัวเลขหรือไม่
    if (typeof userId !== 'number') {
      // ถ้า userId เป็น string แต่มีค่าเป็นตัวเลข ให้แปลงเป็น number
      if (typeof userId === 'string' && !isNaN(Number(userId))) {
        userId = Number(userId);
      } else {
        return { success: false, error: "ไม่สามารถระบุตัวตนผู้ใช้ได้" };
      }
    }

    // ตรวจสอบว่า User มีอยู่จริงหรือไม่
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return { success: false, error: "ไม่พบข้อมูลผู้ใช้ในระบบ" };
    }

    // ดึงข้อมูลจาก FormData
    const gender = formData.get('gender') as string;
    const age = Number(formData.get('age'));
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
    // ข้อมูลอาจมาในรูปแบบต่างๆ ขึ้นอยู่กับว่าฟอร์มส่งมาอย่างไร
    let selectedBatchIds: number[] = [];
    
    // กรณีส่งมาเป็น array ในชื่อ selectedBatchIds[]
    const batchIdsFromArray = formData.getAll('selectedBatchIds[]');
    if (batchIdsFromArray.length > 0) {
      selectedBatchIds = batchIdsFromArray.map(id => Number(id));
    } 
    // กรณีส่งมาเป็น string ในชื่อ selectedBatchIds คั่นด้วยเครื่องหมาย , หรือ ;
    else {
      const batchIdsStr = formData.get('selectedBatchIds') as string;
      if (batchIdsStr) {
        if (batchIdsStr.includes(',')) {
          selectedBatchIds = batchIdsStr.split(',').map(id => Number(id.trim()));
        } else if (batchIdsStr.includes(';')) {
          selectedBatchIds = batchIdsStr.split(';').map(id => Number(id.trim()));
        } else {
          // กรณีมีเพียงค่าเดียว
          selectedBatchIds = [Number(batchIdsStr)];
        }
      }
    }
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!gender || !age || !idCardNumber || !address || !phoneNumber || !religion || 
        !foodPreference || !coachStatus || !shirtSize || !district || !amphoe || !province) {
      return { success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
    }
    
    // ตรวจสอบว่ามี Coach ที่ใช้ idCardNumber เดียวกันอยู่แล้วหรือไม่
    const existingCoach = await prisma.coach.findUnique({
      where: { idCardNumber }
    });

    if (existingCoach) {
      return { success: false, error: 'เลขบัตรประชาชนนี้ถูกใช้ลงทะเบียนแล้ว' };
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
    } catch (locationError) {
      console.error('Error handling location:', locationError);
      return { success: false, error: 'เกิดข้อผิดพลาดในการจัดการข้อมูลตำแหน่ง' };
    }
    
    // เตรียมข้อมูลสำหรับการสร้างโค้ช
    const coachData = {
      userId,
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
      isApproved: false,
      registrationCompleted: true,
    };
    
    // สร้างข้อมูลโค้ช
    const coach = await prisma.coach.create({
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
    
    // สร้าง BatchParticipant สำหรับแต่ละรุ่นที่เลือก
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
        // สร้างข้อมูลการลงทะเบียน
        await Promise.all(
          validBatchIds.map(batchId => 
            prisma.batchParticipant.create({
              data: {
                coachId: coach.id,
                batchId,
                status: 'PENDING',
                isAttended: false
              }
            })
          )
        );
      }
    }
    
    // ดึงข้อมูลโค้ชพร้อมการลงทะเบียนหลังจากบันทึกเรียบร้อยแล้ว
    const coachWithRegistrations = await prisma.coach.findUnique({
      where: { id: coach.id },
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
    
    // Revalidate หน้าที่เกี่ยวข้อง
    revalidatePath('/dashboard/coach');
    revalidatePath('/dashboard/training/participants');
    revalidatePath('/dashboard/training/batch');
    
    return { 
      success: true, 
      data: {
        ...coachWithRegistrations,
        selectedBatchIds: selectedBatchIds.length > 0 ? selectedBatchIds : undefined
      }
    };
      
  } catch (error) {
    console.error('Error creating coach:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: 'ไม่สามารถสร้างข้อมูลโค้ชได้' };
  }
}