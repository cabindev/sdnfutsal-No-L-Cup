// app/dashboard/profile/page.tsx
'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import DashboardLoading from "../loading";
import { 
  UserIcon, 
  CalendarIcon, 
  TrophyIcon, 
  AcademicCapIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [coachStats, setCoachStats] = useState({
    trainingsCompleted: 0,
    certificateCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (session?.user?.id) {
        try {
          const userRes = await fetch(`/api/auth/signup/${session.user.id}`);
          const userData = await userRes.json();
          setUser(userData);

          setCoachStats({
            trainingsCompleted: 2,
            certificateCount: 1
          });

          setLoading(false);
        } catch (err) {
          console.error("Error fetching data:", err);
          setLoading(false);
        }
      }
    }

    fetchData();
  }, [session]);

  if (loading) {
    return <DashboardLoading />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Coach Membership Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-transform hover:scale-[1.02] duration-300">
        <div className="bg-gradient-to-r from-futsal-navy to-futsal-blue p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-lg font-semibold tracking-tight">บัตรสมาชิกโค้ชฟุตซอล</h2>
            <div className="bg-white/30 rounded-full px-3 py-1 text-xs font-medium text-white">
              {user?.role === "ADMIN" ? "แอดมิน" : "โค้ช"}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center">
            {/* Profile Picture */}
            <div className="mr-5">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 border-4 border-futsal-blue/10 relative">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="โปรไฟล์"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <UserIcon className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{user?.firstName || ""} {user?.lastName || ""}</h3>
              <p className="text-sm text-gray-600 mt-1">{user?.email || ""}</p>
              
              <div className="flex items-center mt-3">
                <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">เข้าร่วมเมื่อ {user?.createdAt ? formatDate(user.createdAt) : ""}</span>
              </div>
            </div>
          </div>
          
          {/* Training Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div className="flex items-center bg-gray-50/50 rounded-xl p-4 transition-colors hover:bg-gray-100">
              <AcademicCapIcon className="h-6 w-6 text-futsal-blue mr-3" />
              <div>
                <div className="text-sm text-gray-600">อบรมแล้ว</div>
                <div className="text-lg font-semibold text-gray-900">{coachStats.trainingsCompleted} รุ่น</div>
              </div>
            </div>
            
            <div className="flex items-center bg-gray-50/50 rounded-xl p-4 transition-colors hover:bg-gray-100">
              <TrophyIcon className="h-6 w-6 text-futsal-orange mr-3" />
              <div>
                <div className="text-sm text-gray-600">ประกาศนียบัตร</div>
                <div className="text-lg font-semibold text-gray-900">{coachStats.certificateCount} ใบ</div>
              </div>
            </div>
          </div>
          
          {/* Quick Menu */}
          <div className="mt-6 flex space-x-3">
            <Link 
              href="/dashboard/coach/training" 
              className="flex-1 text-center py-3 px-4 bg-futsal-blue/10 text-futsal-blue text-sm font-medium rounded-xl hover:bg-futsal-blue/20 transition-all duration-300"
            >
              อบรมโค้ช
            </Link>
            <Link 
              href="/dashboard/coach/history" 
              className="flex-1 text-center py-3 px-4 bg-futsal-green/10 text-futsal-green text-sm font-medium rounded-xl hover:bg-futsal-green/20 transition-all duration-300"
            >
              ประวัติอบรม
            </Link>
            <Link 
              href="/dashboard/settings/profile" 
              className="flex-1 text-center py-3 px-4 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
              แก้ไขโปรไฟล์
            </Link>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50/80 px-6 py-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">รหัสสมาชิก: C-{user?.id || "0000"}</div>
            <div className="text-sm text-gray-500">Futsal NO L</div>
          </div>
        </div>
      </div>
      
      {/* Additional Shortcuts */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Link href="/dashboard/coach/certificates" className="flex items-center p-4 bg-white/90 backdrop-blur-md rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all duration-300">
          <div className="bg-amber-100 p-2 rounded-full mr-4">
            <TrophyIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">ประกาศนียบัตร</div>
            <div className="text-sm text-gray-600">{coachStats.certificateCount} ใบ</div>
          </div>
        </Link>
        
        <Link href="/dashboard/dashboard" className="flex items-center p-4 bg-white/90 backdrop-blur-md rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all duration-300">
          <div className="bg-blue-100 p-2 rounded-full mr-4">
            <ChevronRightIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">แดชบอร์ด</div>
            <div className="text-sm text-gray-600">ภาพรวมทั้งหมด</div>
          </div>
        </Link>
      </div>
    </div>
  );
}