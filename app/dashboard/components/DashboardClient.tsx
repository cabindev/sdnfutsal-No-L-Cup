// app/dashboard/components/DashboardClient.tsx
'use client'

import { useDashboard } from '../context/DashboardContext'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import { cn } from "../../lib/utils"

interface DashboardClientProps {
  user: any;
  children: React.ReactNode;
}

export default function DashboardClient({ user, children }: DashboardClientProps) {
  const { sidebarCollapsed } = useDashboard();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ลบปุ่ม hamburger ออกจากตรงนี้ เพราะได้ย้ายไปที่ TopNav แล้ว */}
      
      <Sidebar user={user} />
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 w-full",
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        <TopNav user={user} />
        
        <main className="flex-1 overflow-y-auto pb-4 px-2">
          {children}
        </main>
      </div>
    </div>
  );
}