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


         <form className="space-y-5" onSubmit={handleSubmit}>
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
                   required
                   className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500]/50 transition-all"
                   placeholder="ชื่อ"
                   value={formData.firstName}
                   onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                 required
                 className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500]/50 transition-all"
                 placeholder="นามสกุล"
                 value={formData.lastName}
                 onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                 required
                 className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500]/50 transition-all"
                 placeholder="your@email.com"
                 value={formData.email}
                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                 required
                 className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500]/50 transition-all"
                 placeholder="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
                 value={formData.password}
                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
               />
             </div>
             <p className="mt-1 text-xs text-gray-400">รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ และตัวเลข</p>
           </div>

           <div className="space-y-1">
             <label htmlFor="image" className="block text-gray-200 text-sm font-medium">
               รูปโปรไฟล์ <span className="text-gray-400 text-xs">(ไม่บังคับ)</span>
             </label>
             <div className="flex items-center space-x-4">
               <div className={`flex-shrink-0 w-16 h-16 rounded-full overflow-hidden ${
                 imagePreview ? 'border-2 border-[#FFA500]/50' : 'bg-white/10'
               } flex items-center justify-center`}>
                 {imagePreview ? (
                   <Image
                     src={imagePreview}
                     alt="Profile Preview"
                     width={64}
                     height={64}
                     className="object-cover w-full h-full"
                   />
                 ) : (
                   <User size={24} className="text-gray-400" />
                 )}
               </div>

               <div className="flex-1">
                 <label
                   htmlFor="image-upload"
                   className={`flex items-center justify-center px-4 py-2 rounded-lg border border-dashed border-white/30 bg-white/5 text-white cursor-pointer hover:bg-white/10 transition-all ${
                     compressing ? 'opacity-50 cursor-not-allowed' : ''
                   }`}
                 >
                   <Upload size={16} className="mr-2" />
                   <span className="text-sm">{imagePreview ? 'เปลี่ยนรูปภาพ' : 'อัพโหลดรูปภาพ'}</span>
                   <input
                     id="image-upload"
                     type="file"
                     name="image"
                     accept="image/jpeg,image/png,image/webp"
                     onChange={handleImageChange}
                     disabled={compressing}
                     className="hidden"
                   />
                 </label>

                 {compressing && (
                   <p className="mt-2 text-xs text-[#FFA500] flex items-center">
                     <svg className="animate-spin mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     กำลังประมวลผลรูปภาพ...
                   </p>
                 )}
                 <p className="mt-1 text-xs text-gray-400">รองรับไฟล์ JPG, PNG, WEBP (ไม่เกิน 5MB)</p>
               </div>
             </div>
           </div>

           {error && (
             <motion.div
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex items-start p-4 rounded-lg bg-red-500/20 border border-red-500/50"
             >
               <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
               <p className="ml-3 text-sm text-white">{error}</p>
             </motion.div>
           )}

           <button
             type="submit"
             disabled={isLoading || compressing}
             className={`w-full py-3 rounded-lg font-medium text-white transition-all ${
               isLoading || compressing
                 ? "bg-[#FFA500]/50 cursor-not-allowed"
                 : "bg-gradient-to-r from-[#FFA500] to-[#FF6B00] hover:from-[#FF6B00] hover:to-[#FFA500] shadow-lg hover:shadow-[#FFA500]/20"
             }`}
           >
             {isLoading ? (
               <div className="flex items-center justify-center">
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                 กำลังดำเนินการ...
               </div>
             ) : compressing ? (
               <div className="flex items-center justify-center">
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                 กำลังประมวลผลรูปภาพ...
               </div>
             ) : (
               "สมัครสมาชิก"
             )}
           </button>
         </form>
         
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