// app/dashboard/components/DashboardClient.tsx
'use client'

import { useState, useEffect } from 'react'
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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 min-w-0 overflow-hidden",
        isHydrated && sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        <TopNav user={user} />
        
        <main className="flex-1 overflow-auto pb-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="w-full max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}