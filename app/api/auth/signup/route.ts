//api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/lib/configs/auth/authOptions';

const prisma = new PrismaClient();

// ปิดระบบสมัครสมาชิกชั่วคราว
export async function POST() {
  return new NextResponse(JSON.stringify({ error: 'ระบบสมัครสมาชิกปิดให้บริการชั่วคราว' }), { status: 403 });
}

export async function GET(request: NextRequest) {
  try {
    // ต้องเป็น ADMIN เท่านั้นถึงจะดูจำนวนผู้ใช้ได้
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: 'ไม่มีสิทธิ์เข้าถึง' }), { status: 403 });
    }

    const userCount = await prisma.user.count();
    return new NextResponse(JSON.stringify({ userCount }), { status: 200 });
  } catch (error) {
    console.error('Error fetching user count:', error);
    return new NextResponse(JSON.stringify({ error: 'ไม่สามารถดึงจำนวนผู้ใช้ได้' }), { status: 500 });
  }
}
