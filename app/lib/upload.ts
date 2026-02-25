import path from 'path'
import fs from 'fs/promises'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function uploadFile(file: File | Blob, folder: 'documents' | 'covers'): Promise<string> {
  try {
    // ตรวจสอบขนาดไฟล์
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('ขนาดไฟล์ต้องไม่เกิน 10MB')
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = folder === 'covers' ? ALLOWED_IMAGE_TYPES : ALLOWED_DOC_TYPES
    if (file.type && !allowedTypes.includes(file.type)) {
      throw new Error('ประเภทไฟล์ไม่ได้รับอนุญาต')
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // สร้างชื่อไฟล์ใหม่ด้วย timestamp + random
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)

    // ตรวจสอบ extension ที่อนุญาต
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf']
    let ext = ''
    if ('name' in file) {
      ext = path.extname(file.name).toLowerCase()
      if (!allowedExtensions.includes(ext)) {
        ext = '.jpg' // fallback เป็น .jpg ถ้า extension ไม่ได้รับอนุญาต
      }
    }
    const fileName = `${timestamp}-${random}${ext}`

    // ป้องกัน path traversal
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      throw new Error('ชื่อไฟล์ไม่ถูกต้อง')
    }

    // สร้าง path สำหรับบันทึกไฟล์
    const uploadDir = path.join(process.cwd(), 'public', folder)
    const filePath = path.join(uploadDir, fileName)

    // ตรวจสอบว่า path อยู่ภายใน upload directory
    const resolvedPath = path.resolve(filePath)
    const resolvedDir = path.resolve(uploadDir)
    if (!resolvedPath.startsWith(resolvedDir)) {
      throw new Error('เส้นทางไฟล์ไม่ถูกต้อง')
    }

    // ตรวจสอบและสร้างโฟลเดอร์
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    // เขียนไฟล์
    await fs.writeFile(filePath, buffer)

    return `/${folder}/${fileName}`

  } catch (error) {
    console.error('Upload error:', error)
    throw error instanceof Error ? error : new Error('เกิดข้อผิดพลาดในการอัพโหลดไฟล์')
  }
}

export async function deleteFile(filePath: string) {
  try {
    if (!filePath) return

    // ลบ / ออกจากต้น path ถ้ามี
    const normalizedPath = filePath.startsWith('/') ? filePath.slice(1) : filePath

    // ป้องกัน path traversal
    if (normalizedPath.includes('..')) {
      throw new Error('เส้นทางไฟล์ไม่ถูกต้อง')
    }

    // สร้าง full path
    const fullPath = path.join(process.cwd(), 'public', normalizedPath)

    // ตรวจสอบว่า path อยู่ภายใน public directory
    const resolvedPath = path.resolve(fullPath)
    const publicDir = path.resolve(path.join(process.cwd(), 'public'))
    if (!resolvedPath.startsWith(publicDir)) {
      throw new Error('เส้นทางไฟล์ไม่ถูกต้อง')
    }

    // ตรวจสอบว่าไฟล์มีอยู่จริง
    try {
      await fs.access(fullPath)
    } catch {
      return // ถ้าไม่มีไฟล์ก็ไม่ต้องทำอะไร
    }

    // ลบไฟล์
    await fs.unlink(fullPath)

  } catch (error) {
    console.error('Delete file error:', error)
    throw error instanceof Error ? error : new Error('เกิดข้อผิดพลาดในการลบไฟล์')
  }
}
