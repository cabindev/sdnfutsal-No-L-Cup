// app/components/auth/SignUpForm.tsx
'use client'

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mail, Lock, User, Upload, ArrowLeft, AlertCircle } from "lucide-react"

interface FormData {
 firstName: string
 lastName: string
 email: string
 password: string
 image: File | null
}

export default function SignUpForm() {
 const [formData, setFormData] = useState<FormData>({
   firstName: "",
   lastName: "",
   email: "",
   password: "",
   image: null
 })
 const [imagePreview, setImagePreview] = useState<string | null>(null)
 const [error, setError] = useState<string | null>(null)
 const [isLoading, setIsLoading] = useState(false)
 const [compressing, setCompressing] = useState(false)
 const router = useRouter()

 const compressImage = async (file: File): Promise<File> => {
   setCompressing(true);
   
   return new Promise<File>((resolve, reject) => {
     const reader = new FileReader();
     
     // กำหนดฟังก์ชัน onload ให้กับ FileReader
     reader.onload = function(event) {
       if (!event || !event.target || !event.target.result) {
         setCompressing(false);
         reject(new Error("ไฟล์ไม่ถูกต้อง"));
         return;
       }
       
       // แก้ไขการสร้าง Image element
       const img = document.createElement('img');
       img.src = event.target.result as string;
       
       // กำหนดฟังก์ชัน onload ให้กับ Image
       img.onload = function() {
         const canvas = document.createElement('canvas');
         let width = img.width;
         let height = img.height;
         
         // ปรับขนาดภาพถ้าจำเป็น
         const MAX_WIDTH = 1200;
         const MAX_HEIGHT = 1200;
         
         if (width > height) {
           if (width > MAX_WIDTH) {
             height = Math.round(height * MAX_WIDTH / width);
             width = MAX_WIDTH;
           }
         } else {
           if (height > MAX_HEIGHT) {
             width = Math.round(width * MAX_HEIGHT / height);
             height = MAX_HEIGHT;
           }
         }
         
         canvas.width = width;
         canvas.height = height;
         
         const ctx = canvas.getContext('2d');
         if (!ctx) {
           setCompressing(false);
           reject(new Error("ไม่สามารถสร้าง context ได้"));
           return;
         }
         
         ctx.drawImage(img, 0, 0, width, height);
         
         // ลดคุณภาพทีละนิดจนกว่าจะได้ขนาดที่ต้องการ
         let quality = 0.9;
         const fileType = file.type || 'image/jpeg';
         
         // ฟังก์ชันเพื่อทดสอบขนาดไฟล์
         const tryQuality = function() {
           const dataUrl = canvas.toDataURL(fileType, quality);
           
           // แปลง Data URL เป็น Blob
           const byteString = atob(dataUrl.split(',')[1]);
           const ab = new ArrayBuffer(byteString.length);
           const ia = new Uint8Array(ab);
           
           for (let i = 0; i < byteString.length; i++) {
             ia[i] = byteString.charCodeAt(i);
           }
           
           const blob = new Blob([ab], { type: fileType });
           
           // แปลง Blob เป็น File
           const compressedFile = new File([blob], file.name, {
             type: fileType,
             lastModified: Date.now()
           });
           
           if (compressedFile.size > 500000 && quality > 0.1) {
             // ลดคุณภาพและลองอีกครั้ง
             quality -= 0.1;
             setTimeout(tryQuality, 0); // ใช้ setTimeout เพื่อหลีกเลี่ยง stack overflow
           } else {
             setCompressing(false);
             resolve(compressedFile);
           }
         };
         
         tryQuality();
       };
       
       // กำหนดฟังก์ชัน onerror ให้กับ Image
       img.onerror = function() {
         setCompressing(false);
         reject(new Error("ไม่สามารถโหลดรูปภาพได้"));
       };
     };
     
     // กำหนดฟังก์ชัน onerror ให้กับ FileReader
     reader.onerror = function() {
       setCompressing(false);
       reject(new Error("ไม่สามารถอ่านไฟล์ได้"));
     };
     
     // เริ่มอ่านไฟล์
     reader.readAsDataURL(file);
   });
 };

 const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0]
   if (file) {
     // ตรวจสอบประเภทไฟล์
     const validTypes = ['image/jpeg', 'image/png', 'image/webp']
     if (!validTypes.includes(file.type)) {
       setError('กรุณาอัพโหลดไฟล์รูปภาพ (JPG, PNG, WEBP)')
       return
     }

     try {
       // บีบอัดรูปภาพ
       const compressedFile = await compressImage(file)
       
       // อัปเดตฟอร์มด้วยไฟล์ที่ถูกบีบอัดแล้ว
       setFormData({ ...formData, image: compressedFile })
       
       // แสดงตัวอย่างรูปภาพ
       const reader = new FileReader()
       reader.onloadend = () => {
         setImagePreview(reader.result as string)
       }
       reader.readAsDataURL(compressedFile)
       
       // ล้างข้อความแจ้งเตือนถ้ามี
       setError(null)
     } catch (err) {
       console.error('ไม่สามารถบีบอัดรูปภาพได้:', err)
       setError('เกิดข้อผิดพลาดในการประมวลผลรูปภาพ')
     }
   }
 }

 const handleSubmit = async (e: FormEvent) => {
   e.preventDefault()
   setIsLoading(true)
   setError(null)

   try {
     const data = new FormData()
     Object.entries(formData).forEach(([key, value]) => {
       if (value !== null) data.append(key, value)
     })

     const response = await fetch('/api/auth/signup', {
       method: 'POST',
       body: data
     })

     if (response.ok) {
       router.push('/auth/signin')
     } else {
       const error = await response.json()
       setError(error.error || 'เกิดข้อผิดพลาด')
     }
   } catch (err) {
     setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
   } finally {
     setIsLoading(false)
   }
 }

 return (
   <div className="min-h-screen bg-[#2c2f72] flex flex-col items-center justify-center p-4 relative overflow-hidden">
     {/* พื้นหลังแบบ gradient และเอฟเฟกต์ */}
     <div className="absolute inset-0 overflow-hidden z-0">
       <div className="absolute inset-0 bg-gradient-to-b from-[#2c2f72]/80 to-[#100619] z-[1]" />
       {/* พาร์ติเคิลเบา ๆ */}
       <div className="absolute inset-0 opacity-25">
         {Array.from({ length: 10 }).map((_, i) => (
           <motion.div
             key={i}
             className="absolute w-2 h-2 rounded-full bg-[#FFA500]/50"
             initial={{
               x: `${Math.floor(i * 10)}%`,
               y: `${Math.floor(i * 10)}%`,
               scale: 0.5 + (i % 5) / 10,
             }}
             animate={{
               y: [`${(i * 3) % 100}%`, `${(i * 7) % 100}%`],
               x: [`${(i * 9) % 100}%`, `${(i * 5) % 100}%`],
               opacity: [0.2, 0.6, 0.2],
             }}
             transition={{
               duration: 15 + (i % 20),
               repeat: Infinity,
               ease: "linear",
             }}
           />
         ))}
       </div>
     </div>

     <motion.div
       initial={{ y: 20, opacity: 0 }}
       animate={{ y: 0, opacity: 1 }}
       transition={{ duration: 0.5 }}
       className="w-full max-w-md relative z-10"
     >
       <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
         <div className="flex justify-center mb-6">
           <Image 
             src="/img/sdnfutsal.png" 
             alt="SDN Futsal Logo" 
             width={180} 
             height={60} 
             className="object-contain"
           />
         </div>
         
         <h1 className="text-2xl font-bold text-white text-center mb-2">สมัครสมาชิก</h1>
         <p className="text-gray-300 text-center mb-6 text-sm">เข้าถึงบริการและข้อมูลเอกสารต่างๆ ได้ง่ายขึ้น</p>

         {/* แจ้งเตือนปิดระบบสมัครสมาชิก */}
         <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.4 }}
           className="mb-6 p-5 rounded-xl bg-[#FFA500]/10 border border-[#FFA500]/30 text-center"
         >
           <div className="flex justify-center mb-3">
             <div className="w-12 h-12 rounded-full bg-[#FFA500]/20 flex items-center justify-center">
               <AlertCircle size={24} className="text-[#FFA500]" />
             </div>
           </div>
           <h2 className="text-lg font-semibold text-[#FFA500] mb-2">ระบบสมัครสมาชิกปิดให้บริการชั่วคราว</h2>
           <p className="text-gray-300 text-sm">ขณะนี้ระบบสมัครสมาชิกปิดให้บริการชั่วคราว หากต้องการสมัครสมาชิก กรุณาติดต่อผู้ดูแลระบบ</p>
         </motion.div>

         <div className="space-y-5">
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <label htmlFor="firstName" className="block text-gray-200 text-sm font-medium">
                 ชื่อ
               </label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <User size={18} className="text-gray-400" />
                 </div>
                 <input
                   id="firstName"
                   type="text"
                   name="firstName"
                   disabled
                   className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/50 cursor-not-allowed"
                   placeholder="ชื่อ"
                 />
               </div>
             </div>

             <div className="space-y-1">
               <label htmlFor="lastName" className="block text-gray-200 text-sm font-medium">
                 นามสกุล
               </label>
               <input
                 id="lastName"
                 type="text"
                 name="lastName"
                 disabled
                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/50 cursor-not-allowed"
                 placeholder="นามสกุล"
               />
             </div>
           </div>

           <div className="space-y-1">
             <label htmlFor="email" className="block text-gray-200 text-sm font-medium">
               อีเมล
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Mail size={18} className="text-gray-400" />
               </div>
               <input
                 id="email"
                 type="email"
                 name="email"
                 disabled
                 className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/50 cursor-not-allowed"
                 placeholder="your@email.com"
               />
             </div>
           </div>

           <div className="space-y-1">
             <label htmlFor="password" className="block text-gray-200 text-sm font-medium">
               รหัสผ่าน
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Lock size={18} className="text-gray-400" />
               </div>
               <input
                 id="password"
                 type="password"
                 name="password"
                 disabled
                 className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/50 cursor-not-allowed"
                 placeholder="รหัสผ่าน"
               />
             </div>
           </div>

           <button
             type="button"
             disabled
             className="w-full py-3 rounded-lg font-medium text-white/50 bg-white/10 cursor-not-allowed"
           >
             ปิดรับสมัครสมาชิก
           </button>
         </div>
         
         <div className="mt-6 text-center">
           <p className="text-gray-300 text-sm">
             มีบัญชีอยู่แล้ว?{" "}
             <Link 
               href="/auth/signin" 
               className="text-[#FFA500] hover:text-[#FF6B00] transition-colors font-medium"
             >
               เข้าสู่ระบบ
             </Link>
           </p>
         </div>
       </div>
       
       <div className="mt-6 text-center">
         <Link 
           href="/" 
           className="inline-flex items-center text-white/70 hover:text-white transition-colors text-sm"
         >
           <ArrowLeft size={16} className="mr-1" />
           กลับหน้าหลัก
         </Link>
       </div>
     </motion.div>
     
     {/* Vignette effect */}
     <div className="absolute inset-0 pointer-events-none z-[0] bg-radial-vignette opacity-60" />
   </div>
 )
}