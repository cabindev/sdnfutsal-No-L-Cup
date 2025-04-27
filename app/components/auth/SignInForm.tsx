//app/components/auth/SignInForm.tsx
'use client'

import { useState, FormEvent } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react"

export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
      } else {
        router.replace("/")
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาด โปรดลองอีกครั้ง")
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
          
          <h1 className="text-2xl font-bold text-white text-center mb-2">เข้าสู่ระบบ</h1>
          <p className="text-gray-300 text-center mb-6 text-sm">ยินดีต้อนรับกลับ! เข้าสู่ระบบเพื่อจัดการบัญชีของคุณ</p>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500]/50 transition-all"
                  placeholder="รหัสผ่านของคุณ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#FFA500] focus:ring-[#FFA500] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  จดจำฉัน
                </label>
              </div>
              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-[#FFA500] hover:text-[#FF6B00]">
                  ลืมรหัสผ่าน?
                </Link>
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
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-medium text-white transition-all ${
                isLoading 
                  ? "bg-[#FFA500]/50 cursor-not-allowed" 
                  : "bg-gradient-to-r from-[#FFA500] to-[#FF6B00] hover:from-[#FF6B00] hover:to-[#FFA500] shadow-lg hover:shadow-[#FFA500]/20"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  กำลังเข้าสู่ระบบ...
                </div>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>
          
          <div className="mt-6 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative px-4 bg-[#2c2f72]/30 backdrop-blur-sm rounded-full">
              <span className="text-sm text-gray-300">ยังไม่มีบัญชี?</span>
            </div>
          </div>
          
          <div className="mt-6">
            <Link 
              href="/auth/signup" 
              className="w-full py-3 flex justify-center items-center rounded-lg font-medium text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all"
            >
              สมัครสมาชิกใหม่
            </Link>
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