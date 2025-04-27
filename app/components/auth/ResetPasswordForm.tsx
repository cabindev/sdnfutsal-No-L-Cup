//app/components/auth/ResetPasswordForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token');
    setToken(urlToken);
  }, []);

  const validatePassword = (password: string) => {
    return password.length >= 5;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!validatePassword(password)) {
      setMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 5 ตัวอักษร');
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('รหัสผ่านไม่ตรงกัน');
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/auth/reset-password', { token, password });
      setMessage(res.data.message);
      setIsSuccess(true);
      if (res.data.message === 'รีเซ็ตรหัสผ่านสำเร็จ') {
        setTimeout(() => router.push('/auth/signin'), 2000);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setMessage('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน โปรดลองอีกครั้งในภายหลัง');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

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
          
          <h1 className="text-2xl font-bold text-white text-center mb-2">รีเซ็ตรหัสผ่าน</h1>
          <p className="text-gray-300 text-center mb-6 text-sm">กรุณากำหนดรหัสผ่านใหม่ของคุณ</p>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="password" className="block text-gray-200 text-sm font-medium">
                รหัสผ่านใหม่
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500]/50 transition-all"
                  placeholder="รหัสผ่านใหม่ (อย่างน้อย 5 ตัวอักษร)"
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

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-gray-200 text-sm font-medium">
                ยืนยันรหัสผ่านใหม่
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="pl-10 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500]/50 transition-all"
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start p-4 rounded-lg ${
                  isSuccess 
                    ? "bg-green-500/20 border border-green-500/50" 
                    : "bg-red-500/20 border border-red-500/50"
                }`}
              >
                {isSuccess ? (
                  <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                )}
                <p className="ml-3 text-sm text-white">{message}</p>
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
                  กำลังดำเนินการ...
                </div>
              ) : (
                "รีเซ็ตรหัสผ่าน"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              href="/auth/signin" 
              className="text-[#FFA500] hover:text-[#FF6B00] transition-colors font-medium"
            >
              กลับไปหน้าเข้าสู่ระบบ
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
  );
}