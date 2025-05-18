// ✅ /app/api/export/coach/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/app/lib/db';
import authOptions from '@/app/lib/configs/auth/authOptions';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(req.url);
    const batchId = url.searchParams.get('batchId');
    const zone = url.searchParams.get('zone');
    const status = url.searchParams.get('status');
    const q = url.searchParams.get('q');

    const where: Record<string, any> = {};

    if (q) {
      where.OR = [
        { user: { firstName: { contains: q } } },
        { user: { lastName: { contains: q } } },
        { nickname: { contains: q } },
        { teamName: { contains: q } },
        { phoneNumber: { contains: q } },
      ];
    }

    if (status === 'approved') {
      where.isApproved = true;
    } else if (status === 'pending') {
      where.isApproved = false;
    }

    if (batchId) {
      where.batchParticipations = {
        some: {
          batchId: parseInt(batchId)
        }
      };
    }

    if (zone) {
      where.location = {
        zone: zone
      };
    }

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
  zone: coach.location?.zone, 
  status: coach.isApproved ? "อนุมัติแล้ว" : "รอการอนุมัติ",
  batches: coach.batchParticipations
    .map((p) => `รุ่นที่ ${p.batch.batchNumber}/${p.batch.year}`)
    .join(", "),
  registrationDate: coach.createdAt.toLocaleDateString("th-TH"),
}));

    const header = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(coach =>
      Object.values(coach).map(v => `"${v ?? ''}"`).join(',')
    );
    const csv = [header, ...rows].join('\n');

    const fileName = `coaches_export_${new Date().toISOString().split('T')[0]}.csv`;

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