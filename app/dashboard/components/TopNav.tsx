'use client'

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { signOut } from 'next-auth/react'
import { useDashboard } from '../context/DashboardContext'
import { cn } from "../../lib/utils"
import { 
  Bell, 
  User,
  LogOut,
  Menu,
  Settings,
  Home,
  Award,
  Search,
  ChevronDown
} from "lucide-react"

interface TopNavProps {
  user: any
}

export default function TopNav({ user }: TopNavProps) {
  const pathname = usePathname()
  const { toggleMobileSidebar, sidebarCollapsed } = useDashboard()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // ตรวจสอบการ scroll เพื่อเพิ่มเงาให้กับ header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // ปิด dropdown เมื่อคลิกนอก dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showProfileDropdown && !target.closest('.profile-menu')) {
        setShowProfileDropdown(false)
      }
    }
    
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [showProfileDropdown])
  
  // Define navigation tabs
  const navTabs = [
    { href: '/dashboard', text: 'ภาพรวม', icon: Home },
    { href: '/dashboard/coach', text: 'โค้ชฟุตซอล', icon: Award },
    { href: '/dashboard/training', text: 'การอบรม', icon: Award }
  ]

  return (
    <header className={cn(
      "sticky top-0 z-20 w-full bg-white transition-shadow duration-300",
      scrolled ? "shadow-md" : "shadow-sm",
      sidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
    )}>
      {/* Main header with search and profile */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        {/* ปุ่ม hamburger สำหรับมือถือ */}
        <button
          onClick={() => toggleMobileSidebar(true)}
          className="lg:hidden mr-3 p-2 rounded-md text-gray-500 hover:bg-gray-100"
          aria-label="เปิดเมนู"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* หัวข้อหน้าปัจจุบัน */}
        <div className="flex-shrink-0 flex items-center">
          <h1 className="text-xl font-bold text-futsal-navy">
            {pathname === '/dashboard' && 'แดชบอร์ด'}
            {pathname === '/dashboard/coach' && 'จัดการโค้ชฟุตซอล'}
            {pathname.startsWith('/dashboard/coach/training') && 'การอบรม'}
            {pathname.startsWith('/dashboard/settings') && 'ตั้งค่าระบบ'}
            {pathname.startsWith('/dashboard/profile') && 'โปรไฟล์ของฉัน'}
          </h1>
        </div>
        
        {/* ช่องค้นหา */}
        <div className="hidden md:flex mx-6 flex-1 relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="ค้นหาภายในระบบ..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-futsal-orange focus:border-transparent text-sm"
          />
        </div>
        
        <div className="flex items-center ml-auto">
          {/* ปุ่มการแจ้งเตือน */}
          <button 
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative focus:outline-none"
            aria-label="การแจ้งเตือน"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-futsal-orange rounded-full border-2 border-white"></span>
          </button>
          
          {/* เมนูผู้ใช้ */}
          <div className="ml-3 relative profile-menu">
            <button 
              className="flex items-center focus:outline-none gap-2 p-1.5 hover:bg-gray-100 rounded-lg"
              onClick={(e) => {
                e.stopPropagation()
                setShowProfileDropdown(!showProfileDropdown)
              }}
              aria-label="เมนูผู้ใช้"
            >
              <div className="w-8 h-8 rounded-full bg-futsal-orange flex items-center justify-center text-white shadow-futsal">
                {user?.firstName?.charAt(0) || user?.name?.charAt(0) || "U"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">
                  {user?.firstName || user?.name || ""} {user?.lastName || ""}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                  {user?.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 animate-fadeDown">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName || user?.name || ""} {user?.lastName || ""}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || ""}
                  </p>
                  <span className="text-xs mt-1 bg-futsal-green/20 text-futsal-green px-2 py-0.5 rounded-full inline-block">
                    {user?.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
                  </span>
                </div>
                
                <Link 
                  href="/dashboard/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-futsal-navy" />
                    โปรไฟล์ของฉัน
                  </div>
                </Link>
                <Link 
                  href="/dashboard/settings/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 mr-2 text-futsal-navy" />
                    ตั้งค่าบัญชี
                  </div>
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2 text-red-500" />
                    ออกจากระบบ
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <div className="h-10 flex items-center px-4 overflow-x-auto bg-gray-50">
        {navTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = 
            tab.href === '/dashboard' 
              ? pathname === '/dashboard'
              : pathname?.startsWith(tab.href);
              
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium h-full mr-2 whitespace-nowrap transition-all",
                isActive
                  ? "border-futsal-orange text-futsal-orange"
                  : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800"
              )}
            >
              <Icon className={cn("mr-1.5 h-4 w-4", isActive ? "text-futsal-orange" : "text-gray-500")} />
              {tab.text}
            </Link>
          )
        })}
      </div>
    </header>
  )
}