// app/api/export/coach/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/app/lib/db';
import authOptions from '@/app/lib/configs/auth/authOptions';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // ตรวจสอบว่าเป็น admin หรือไม่
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const url = new URL(req.url);
    const batchId = url.searchParams.get('batchId');
    
    // สร้าง query condition
    const where: Record<string, any> = {};
    
    if (batchId) {
      where.batchParticipations = {
        some: {
          batchId: parseInt(batchId)
        }
      };
    }
    
    // ดึงข้อมูลโค้ช
    const coaches = await prisma.coach.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        location: true,
        batchParticipations: {
          include: {
            batch: true
          }
        }
      }
    });
    
    // แปลงข้อมูลเป็นรูปแบบที่เหมาะสำหรับ CSV
    const csvData = coaches.map((coach) => ({
      id: coach.id,
      firstName: coach.user.firstName,
      lastName: coach.user.lastName,
      email: coach.user.email,
      nickname: coach.nickname,
      phoneNumber: coach.phoneNumber,
      teamName: coach.teamName,
      province: coach.location?.province,
      district: coach.location?.district,
      status: coach.isApproved ? 'อนุมัติแล้ว' : 'รอการอนุมัติ',
      batches: coach.batchParticipations
        .map(p => `รุ่นที่ ${p.batch.batchNumber}/${p.batch.year}`)
        .join(', '),
      registrationDate: coach.createdAt.toLocaleDateString('th-TH')
    }));
    
    // สร้าง CSV header
    const header = Object.keys(csvData[0]).join(',');
    
    // สร้าง CSV rows
    const rows = csvData.map(coach => 
      Object.values(coach)
        .map(value => `"${value}"`)
        .join(',')
    );
    
    // สร้าง CSV content
    const csv = [header, ...rows].join('\n');
    
    // กำหนดชื่อไฟล์ CSV
    const fileName = batchId 
      ? `coach_batch_${batchId}_${new Date().toISOString().split('T')[0]}.csv`
      : `coaches_all_${new Date().toISOString().split('T')[0]}.csv`;
    
    // สร้าง HTTP response
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });
    
  } catch (error) {
    console.error('Error exporting coaches:', error);
    return new NextResponse('Error exporting data', { status: 500 });
  }
}