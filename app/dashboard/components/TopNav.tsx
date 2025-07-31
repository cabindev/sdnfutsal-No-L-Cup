// app/dashboard/components/TopNav.tsx
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
  Settings,
  Home,
  Award,
  GraduationCap,
  ChevronDown,
  Search,
  Menu,
  X
} from "lucide-react"

interface TopNavProps {
  user: any
}

export default function TopNav({ user }: TopNavProps) {
  const pathname = usePathname()
  const { sidebarCollapsed, isMobileSidebarOpen, toggleMobileSidebar } = useDashboard()
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
    { href: 'https://sdnfutsal.com', text: 'หน้าแรก', icon: Home, external: true },
    { href: '/dashboard', text: 'ภาพรวม', icon: Home },
    { href: '/dashboard/coach', text: 'โค้ช', icon: Award },
    { href: '/dashboard/training', text: 'การอบรม', icon: GraduationCap }
  ]

  // หัวข้อหน้าปัจจุบัน
  const currentPageTitle = 
    pathname === '/dashboard' ? 'ภาพรวม' :
    pathname === '/dashboard/coach' ? 'จัดการโค้ชฟุตซอล' :
    pathname.startsWith('/dashboard/coach/training') ? 'การอบรม' :
    pathname.startsWith('/dashboard/training') ? 'การอบรม' :
    pathname.startsWith('/dashboard/settings') ? 'ตั้งค่าระบบ' :
    pathname.startsWith('/dashboard/profile') ? 'โปรไฟล์ของฉัน' : '';

  return (
    <header
      className={cn(
        "sticky top-0 z-20 w-full bg-white transition-shadow duration-300",
        scrolled ? "shadow-md" : "shadow-sm",
        "pl-0" // ไม่ต้องใส่ padding-left แล้ว เพราะจะซ้อนกับปุ่ม hamburger
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6 border-b border-gray-100">
        {/* ส่วนซ้าย */}
        <div className="flex items-center">
          {/* เพิ่มปุ่ม hamburger ใน TopNav แทน - แก้ไขใหม่ */}
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 lg:hidden mr-2"
            onClick={() => {
              console.log("TopNav hamburger clicked!");
              toggleMobileSidebar(!isMobileSidebarOpen);
            }}
            aria-label="เปิด/ปิดเมนู"
          >
            {isMobileSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          
          {/* หัวข้อหน้าปัจจุบัน */}
          <h1 className="text-lg font-medium text-gray-900 md:hidden ml-3">
            {currentPageTitle}
          </h1>
          
          {/* Navigation tabs (ซ่อนบนมือถือ) */}
          <div className="hidden md:flex items-center space-x-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.external 
                ? false 
                : tab.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname?.startsWith(tab.href);

              if (tab.external) {
                return (
                  <a
                    key={tab.href}
                    href={tab.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  >
                    <Icon className="mr-1.5 h-4 w-4 text-gray-500" />
                    {tab.text}
                  </a>
                );
              }

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all",
                    isActive
                      ? "bg-futsal-orange/10 text-futsal-orange"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-1.5 h-4 w-4",
                      isActive ? "text-futsal-orange" : "text-gray-500"
                    )}
                  />
                  {tab.text}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ส่วนขวา */}
        <div className="flex items-center space-x-3">
          {/* ช่องค้นหา (ซ่อนบนมือถือ) */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ค้นหา..."
              className="py-2 pl-10 pr-4 block w-60 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-futsal-orange focus:border-futsal-orange"
            />
          </div>
          
          {/* ปุ่มการแจ้งเตือน */}
          <button
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative focus:outline-none focus:ring-2 focus:ring-futsal-orange"
            aria-label="การแจ้งเตือน"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-futsal-orange rounded-full border-2 border-white"></span>
          </button>

          {/* เมนูผู้ใช้ */}
          <div className="relative profile-menu">
            <button
              className="flex items-center focus:outline-none gap-2 p-1.5 hover:bg-gray-100 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileDropdown(!showProfileDropdown);
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
                  {user?.role === "ADMIN" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
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
                    {user?.role === "ADMIN" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
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
                  onClick={() => signOut({ callbackUrl: "/" })}
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
    </header>
  );
}