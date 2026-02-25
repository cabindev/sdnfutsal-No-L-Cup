//api/auth/signup/route.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/lib/configs/auth/authOptions';

const prisma = new PrismaClient();

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const image = formData.get('image') as File | null;

    // Check if user with the same email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse(JSON.stringify({ error: 'มีอีเมลนี้แล้วในระบบ' }), { status: 400 });
    }

    // Validate password strength (ขั้นต่ำ 8 ตัวอักษร ต้องมีตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ และตัวเลข)
    if (password.length < 8) {
      return new NextResponse(JSON.stringify({ error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' }), { status: 400 });
    }
    if (!/[a-z]/.test(password)) {
      return new NextResponse(JSON.stringify({ error: 'รหัสผ่านต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว' }), { status: 400 });
    }
    if (!/[A-Z]/.test(password)) {
      return new NextResponse(JSON.stringify({ error: 'รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว' }), { status: 400 });
    }
    if (!/[0-9]/.test(password)) {
      return new NextResponse(JSON.stringify({ error: 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว' }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    let imagePath = '';
    if (image) {
      // ตรวจสอบประเภทไฟล์
      if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
        return new NextResponse(JSON.stringify({ error: 'อนุญาตเฉพาะไฟล์รูปภาพ (JPEG, PNG, WebP, GIF) เท่านั้น' }), { status: 400 });
      }

      // ตรวจสอบขนาดไฟล์
      if (image.size > MAX_FILE_SIZE) {
        return new NextResponse(JSON.stringify({ error: 'ขนาดไฟล์ต้องไม่เกิน 5MB' }), { status: 400 });
      }

      const bufferData = Buffer.from(await image.arrayBuffer());
      const timestamp = new Date().getTime();
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const fileExtension = path.extname(image.name).toLowerCase();
      const safeExtension = allowedExtensions.includes(fileExtension) ? fileExtension : '.jpg';
      const fileName = `${timestamp}${safeExtension}`;
      const imageSavePath = path.join(process.cwd(), 'public/img', fileName);

      await fs.writeFile(imageSavePath, bufferData);
      imagePath = `/img/${fileName}`;
    }

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        image: imagePath || null,
      },
    });

    // Return success response
    return new NextResponse(JSON.stringify({ message: 'ลงทะเบียนสำเร็จ', userId: newUser.id }), { status: 200 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new NextResponse(JSON.stringify({ error: 'ไม่สามารถสร้างบัญชีผู้ใช้ได้ โปรดลองอีกครั้ง' }), { status: 500 });
  }
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
