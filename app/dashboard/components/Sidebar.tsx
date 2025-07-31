// app/dashboard/components/Sidebar.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useDashboard } from '../context/DashboardContext';
import { cn } from "../../lib/utils";
import { 
  LayoutDashboard, 
  Map, 
  FileText,
  Tag,
  Calendar,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Users,
  Menu,
  PanelLeft,
  X,
  Award,
  GraduationCap,
  Home,
  CheckSquare,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  user: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, isMobileSidebarOpen, toggleMobileSidebar } = useDashboard();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCoachMenuOpen, setIsCoachMenuOpen] = useState(false);

  // เปิดเมนูอัตโนมัติตามหน้าที่กำลังเปิดอยู่
  useEffect(() => {
    if (pathname?.startsWith('/dashboard/settings')) {
      setIsSettingsOpen(true);
    }
    if (pathname?.startsWith('/dashboard/coach') || pathname?.startsWith('/dashboard/training')) {
      setIsCoachMenuOpen(true);
    }
  }, [pathname]);

  // ปิด sidebar บนมือถือเมื่อเปลี่ยนหน้า
  useEffect(() => {
    if (isMobileSidebarOpen) {
      toggleMobileSidebar(false);
    }
  }, [pathname]);  // แก้ไขโดยลบ toggleMobileSidebar จาก dependencies

  const mainMenuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'ภาพรวมระบบ'
    },

    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: User,
      description: 'ข้อมูลส่วนตัว'
    }
  ];

  // เมนูสำหรับโค้ชฟุตซอล
  const coachMenu = {
    name: 'Coach Management',
    href: '/dashboard/coach',
    icon: Award,
    description: 'จัดการข้อมูลโค้ช',
    subMenus: [
      {
        name: 'Coach List',
        href: '/dashboard/coach',
        icon: Users,
        requireAdmin: false,
        description: 'รายชื่อโค้ชทั้งหมด'
      },
      {
        name: 'Training',
        href: '/dashboard/training',
        icon: GraduationCap,
        requireAdmin: false,
        description: 'รายการอบรม'
      },
      {
        name: 'Training Batches',
        href: '/dashboard/training/batch',
        icon: Calendar,
        requireAdmin: true,
        description: 'จัดการรุ่นการอบรม'
      },
      {
        name: 'Participants',
        href: '/dashboard/training/participants',
        icon: UserCheck,
        requireAdmin: true,
        description: 'อนุมัติผู้เข้าร่วมอบรม'
      }
    ]
  };
  
  const settingsMenu = {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'ตั้งค่าระบบ',
    subMenus: [
      {
        name: 'Edit Profile',
        href: '/dashboard/settings/profile',
        icon: User,
        requireAdmin: false,
        description: 'แก้ไขข้อมูลส่วนตัว'
      },
      {
        name: 'Manage Users',
        href: '/dashboard/settings/users',
        icon: Users,
        requireAdmin: true,
        description: 'จัดการผู้ใช้งาน'
      }
    ]
  };
  
  const isAdmin = user?.role === 'ADMIN';

  return (
    <>
      {/* Overlay สำหรับกดปิด sidebar บนมือถือ - แก้ไข z-index */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden backdrop-blur-sm" // ลด z-index จาก 30 เป็น 10
          onClick={() => toggleMobileSidebar(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-futsal-navy text-white transition-all duration-300 shadow-xl",
          sidebarCollapsed ? "w-16" : "w-64",
          "lg:translate-x-0",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          {!sidebarCollapsed ? (
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <img
                  src="/img/sdnfutsal.png"
                  alt="SDN Futsal Logo"
                  className="h-8 w-auto hidden sm:block"
                />
                <span className="text-white font-semibold text-lg sm:ml-3">
                  Futsal System
                </span>
              </Link>
            </div>
          ) : (
            <Link href="/dashboard" className="mx-auto hidden sm:block">
              <img
                src="/img/sdnfutsal.png"
                alt="SDN Futsal Logo"
                className="h-8 w-auto"
              />
            </Link>
          )}

          {/* ปุ่มปิดบนมือถือ */}
          <button
            type="button"
            onClick={() => toggleMobileSidebar(false)}
            className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
            aria-label="ปิดเมนู"
          >
            <X className="h-5 w-5" />
          </button>

          {/* ปุ่มย่อ/ขยายบนจอใหญ่ */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 hidden lg:block transition-colors"
            aria-label={sidebarCollapsed ? "ขยายเมนู" : "ย่อเมนู"}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar menu */}
        <div className="flex-1 overflow-y-auto py-5">
          <nav className="space-y-1 px-3">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center p-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-futsal-orange text-white shadow-futsal"
                      : "hover:bg-white/10 text-white/80 hover:text-white",
                    sidebarCollapsed ? "justify-center" : "space-x-3"
                  )}
                  title={sidebarCollapsed ? item.name : ""}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center",
                      sidebarCollapsed ? "h-10 w-10" : "h-5 w-5"
                    )}
                  >
                    <Icon
                      className={sidebarCollapsed ? "w-6 h-6" : "w-5 h-5"}
                    />
                  </div>
                  {!sidebarCollapsed && (
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <p className="text-xs text-white/70 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8">
            {!sidebarCollapsed && (
              <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                Features
              </h3>
            )}

            {/* Coach menu */}
            <div className="px-3 mb-3">
              <button
                onClick={() => setIsCoachMenuOpen(!isCoachMenuOpen)}
                className={cn(
                  "group flex items-center w-full p-3 rounded-lg transition-all duration-200",
                  pathname?.startsWith("/dashboard/coach") ||
                    pathname?.startsWith("/dashboard/training")
                    ? "bg-futsal-orange text-white shadow-futsal"
                    : "hover:bg-white/10 text-white/80 hover:text-white",
                  sidebarCollapsed && "justify-center"
                )}
                aria-label="เมนูโค้ชฟุตซอล"
                aria-expanded={isCoachMenuOpen}
                title={sidebarCollapsed ? "Coach Management" : ""}
              >
                <div
                  className={cn(
                    "flex items-center justify-center",
                    sidebarCollapsed ? "h-10 w-10" : "h-5 w-5"
                  )}
                >
                  <Award className={sidebarCollapsed ? "w-6 h-6" : "w-5 h-5"} />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full ml-3">
                    <div>
                      <span className="font-medium">{coachMenu.name}</span>
                      <p className="text-xs text-white/70 mt-0.5">
                        {coachMenu.description}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isCoachMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                )}
              </button>

              {/* Coach submenu */}
              {(isCoachMenuOpen ||
                pathname?.startsWith("/dashboard/coach") ||
                pathname?.startsWith("/dashboard/training")) &&
                !sidebarCollapsed && (
                  <div className="animate-fadeDown mt-1">
                    <ul className="bg-white/5 rounded-lg ml-2 mr-2 overflow-hidden backdrop-blur-sm">
                      {coachMenu.subMenus.map((subMenu) => {
                        // Check permissions before showing menu
                        if (subMenu.requireAdmin && !isAdmin) {
                          return null;
                        }

                        const Icon = subMenu.icon;
                        const isSubActive =
                          pathname === subMenu.href ||
                          pathname?.startsWith(subMenu.href);

                        return (
                          <li key={subMenu.href}>
                            <Link
                              href={subMenu.href}
                              className={`flex items-center p-3 transition-all duration-200 ${
                                isSubActive
                                  ? "bg-futsal-gold/20 text-futsal-gold"
                                  : "text-white/80 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              <Icon className="w-4 h-4 mr-3" />
                              <div>
                                <span className="text-sm">{subMenu.name}</span>
                                <p className="text-xs text-white/60 mt-0.5">
                                  {subMenu.description}
                                </p>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

              {/* Collapsed Coach submenu */}
              {sidebarCollapsed && (
                <div className="mt-1">
                  {coachMenu.subMenus.map((subMenu) => {
                    // Check permissions before showing menu
                    if (subMenu.requireAdmin && !isAdmin) {
                      return null;
                    }

                    const Icon = subMenu.icon;
                    const isSubActive =
                      pathname === subMenu.href ||
                      pathname?.startsWith(subMenu.href);

                    return (
                      <Link
                        key={subMenu.href}
                        href={subMenu.href}
                        className={`flex justify-center p-2 my-1 transition-all duration-200 rounded-lg ${
                          isSubActive
                            ? "bg-futsal-gold/20 text-futsal-gold"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                        title={subMenu.name}
                      >
                        <Icon className="w-5 h-5" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                System
              </h3>
            )}

            {/* Settings menu */}
            <div className="px-3">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={cn(
                  "group flex items-center w-full p-3 rounded-lg transition-all duration-200",
                  pathname?.startsWith("/dashboard/settings")
                    ? "bg-futsal-orange text-white shadow-futsal"
                    : "hover:bg-white/10 text-white/80 hover:text-white",
                  sidebarCollapsed && "justify-center"
                )}
                aria-label="เมนูตั้งค่า"
                aria-expanded={isSettingsOpen}
                title={sidebarCollapsed ? "Settings" : ""}
              >
                <div
                  className={cn(
                    "flex items-center justify-center",
                    sidebarCollapsed ? "h-10 w-10" : "h-5 w-5"
                  )}
                >
                  <Settings
                    className={sidebarCollapsed ? "w-6 h-6" : "w-5 h-5"}
                  />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full ml-3">
                    <div>
                      <span className="font-medium">{settingsMenu.name}</span>
                      <p className="text-xs text-white/70 mt-0.5">
                        {settingsMenu.description}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isSettingsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                )}
              </button>

              {/* Settings submenu */}
              {(isSettingsOpen ||
                pathname?.startsWith("/dashboard/settings")) &&
                !sidebarCollapsed && (
                  <div className="animate-fadeDown mt-1">
                    <ul className="bg-white/5 rounded-lg ml-2 mr-2 overflow-hidden backdrop-blur-sm">
                      {settingsMenu.subMenus.map((subMenu) => {
                        // Check permissions before showing menu
                        if (subMenu.requireAdmin && !isAdmin) {
                          return null;
                        }

                        const Icon = subMenu.icon;
                        const isSubActive =
                          pathname === subMenu.href ||
                          pathname?.startsWith(subMenu.href);

                        return (
                          <li key={subMenu.href}>
                            <Link
                              href={subMenu.href}
                              className={`flex items-center p-3 transition-all duration-200 ${
                                isSubActive
                                  ? "bg-futsal-gold/20 text-futsal-gold"
                                  : "text-white/80 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              <Icon className="w-4 h-4 mr-3" />
                              <div>
                                <span className="text-sm">{subMenu.name}</span>
                                <p className="text-xs text-white/60 mt-0.5">
                                  {subMenu.description}
                                </p>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

              {/* Collapsed Settings submenu */}
              {sidebarCollapsed && (
                <div className="mt-1 px-3 space-y-1">
                  {settingsMenu.subMenus.map((subMenu) => {
                    // Check permissions before showing menu
                    if (subMenu.requireAdmin && !isAdmin) {
                      return null;
                    }

                    const Icon = subMenu.icon;
                    const isSubActive =
                      pathname === subMenu.href ||
                      pathname?.startsWith(subMenu.href);

                    return (
                      <Link
                        key={subMenu.href}
                        href={subMenu.href}
                        className={cn(
                          "flex justify-center p-2 rounded-md transition-all duration-200",
                          isSubActive
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                        title={subMenu.name}
                      >
                        <Icon className="w-5 h-5" />
                      </Link>
                    );
                  })}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* User info & logout */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div
          className={cn(
            "flex items-center p-3 rounded-lg bg-white border border-gray-200 shadow-sm",
            sidebarCollapsed && "justify-center"
          )}
        >
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-sm font-medium text-white">
                {user?.firstName?.charAt(0) || user?.name?.charAt(0) || "U"}
              </span>
            </div>
          </div>
          {!sidebarCollapsed && (
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName || user?.name || ""} {user?.lastName || ""}
              </p>
              <p className="text-xs text-gray-500">{user?.email || ""}</p>
              <div className="mt-1">
                <span className={cn(
                  "text-xs inline-block px-2 py-0.5 rounded-full font-medium",
                  user?.role === "ADMIN" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-blue-100 text-blue-800"
                )}>
                  {user?.role === "ADMIN" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
                </span>
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn(
            "mt-3 flex items-center px-3 py-2 rounded-md w-full text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium text-sm",
            sidebarCollapsed && "justify-center"
          )}
          aria-label="ออกจากระบบ"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="ml-3">ออกจากระบบ</span>
          )}
        </button>
      </div>
    </aside>
  </>
);
}