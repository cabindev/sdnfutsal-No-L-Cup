// app/dashboard/coach/add/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CoachForm from '@/app/coach/components/CoachForm';
import { toast } from 'sonner';

export default function AddCoachPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
      router.push('/auth/signin?callbackUrl=/dashboard');
      return;
    }
    
    if (session?.user?.role !== 'ADMIN') {
      toast.error('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
      router.push('/dashboard');
    }
  }, [status, session, router]);
  
  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">กำลังโหลด...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">เพิ่มข้อมูลโค้ช</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <CoachForm isPublicRegistration={false} />
      </div>
    </div>
  );
 }