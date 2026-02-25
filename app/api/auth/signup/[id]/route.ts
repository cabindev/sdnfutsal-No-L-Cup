//api/auth/signup/[id]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/lib/configs/auth/authOptions';

const prisma = new PrismaClient();

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
  }

  const id = request.nextUrl.pathname.split('/').pop();
  const userId = Number(id);

  // อนุญาตให้ดูข้อมูลตัวเองหรือ ADMIN ดูได้ทุกคน
  if (session.user.id !== userId && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
  }

  const id = request.nextUrl.pathname.split('/').pop();
  const userId = Number(id);

  // อนุญาตให้แก้ไขข้อมูลตัวเองหรือ ADMIN แก้ไขได้ทุกคน
  if (session.user.id !== userId && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 });
  }

  const formData = await request.formData();
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const image = formData.get('image') as File | null;

  let imageUrl: string | undefined;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (image) {
      // ตรวจสอบประเภทไฟล์
      if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
        return NextResponse.json(
          { error: 'อนุญาตเฉพาะไฟล์รูปภาพ (JPEG, PNG, WebP, GIF) เท่านั้น' },
          { status: 400 }
        );
      }

      // ตรวจสอบขนาดไฟล์
      if (image.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'ขนาดไฟล์ต้องไม่เกิน 5MB' },
          { status: 400 }
        );
      }

      const byteLength = await image.arrayBuffer();
      const bufferData = Buffer.from(byteLength);

      const timestamp = new Date().getTime();
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const fileExtension = path.extname(image.name).toLowerCase();
      const safeExtension = allowedExtensions.includes(fileExtension) ? fileExtension : '.jpg';
      const fileName = `${timestamp}${safeExtension}`;
      const imagePath = `./public/img/${fileName}`;
      imageUrl = `/img/${fileName}`;

      await writeFile(imagePath, bufferData);

      // ลบภาพเก่า
      if (existingUser?.image) {
        const oldImagePath = path.join(process.cwd(), 'public', existingUser.image);
        await unlink(oldImagePath).catch(() => {});
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้' }, { status: 500 });
  }
}
