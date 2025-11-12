// app/components/Futsal-Navbar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Menu, X, User, LogOut, Home, Calendar, Trophy, 
  Image as ImageIcon, Phone, LayoutDashboard, ChevronDown, Settings 
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

// Type definitions
interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Set client-side rendering flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ตรวจสอบการเลื่อนหน้าจอ - ซ่อน navbar ตอนอยู่ด้านบนสุด
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
      setIsProfileOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // รายการเมนูหลัก
  const navItems: NavItem[] = [
    { 
      name: "หน้าแรก", 
      href: "/", 
      icon: <Home size={20} /> 
    },
    { 
      name: "โค้ช", 
      href: "/coaches", 
      icon: <Trophy size={20} />
    },
    { 
      name: "ตารางอบรม", 
      href: "/schedule", 
      icon: <Calendar size={20} />
    },
    { 
      name: "แกลเลอรี่", 
      href: "/#gallery", 
      icon: <ImageIcon size={20} />
    },
    { 
      name: "ติดต่อ", 
      href: "/about/contact", 
      icon: <Phone size={20} />
    },
  ];

  // รายการเมนูที่ต้องใช้สิทธิ์
  const authItems: NavItem[] = isClient && status === 'authenticated' && session?.user?.role === 'ADMIN' 
    ? [{ 
        name: "แดชบอร์ด", 
        href: "/dashboard", 
        icon: <LayoutDashboard size={20} />,
        requireAuth: true,
        requireAdmin: true
      }] 
    : [];

  const allNavItems = [...navItems, ...authItems];

  // ฟังก์ชันกรองว่าควรแสดงรายการเมนูนี้หรือไม่
  const shouldShowNavItem = (item: NavItem): boolean => {
    if (!isClient) return true;
    if (item.requireAuth && status !== 'authenticated') return false;
    if (item.requireAdmin && session?.user?.role !== 'ADMIN') return false;
    return true;
  };
  
  // ไม่แสดง navbar ในหน้า dashboard
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }
  if (pathname?.startsWith('/auth')) {
    return null;
  }

  // สำหรับแก้ปัญหา hydration mismatch ในเรื่องสีข้อความ
  // ตอน SSR render ไม่ต้องกำหนดสีเลย แล้วค่อยมากำหนดตอนทำงานบน client (useEffect)
  const textColor = isClient 
    ? (isScrolled ? "text-white" : "text-white") 
    : "";

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: isScrolled ? 0 : -100,
        opacity: isScrolled ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled
          ? "bg-white/98 backdrop-blur-sm shadow-sm border-b border-gray-100 py-2"
          : "bg-white/95 backdrop-blur-sm py-3"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        <nav className="flex items-center justify-between w-full">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group z-10">
            <img 
              src="/img/sdnfutsal.png" 
              alt="SDN Futsal Logo" 
              className="w-7 h-7 md:w-8 md:h-8 object-cover"
            />
            <div className="flex items-center">
              <span className="font-medium text-base md:text-lg text-gray-900">SDN</span>
              <span className="font-medium text-base md:text-lg text-blue-600 ml-1">FUTSAL</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {allNavItems.filter(shouldShowNavItem).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "group relative px-3 py-2 text-sm font-normal transition-colors duration-150 flex items-center gap-2 hover:text-blue-600",
                  pathname === link.href
                    ? "text-blue-600"
                    : "text-gray-700"
                )}
              >
                <span className={cn(
                  "transition-colors duration-150",
                  pathname === link.href ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
                )}>
                  {link.icon}
                </span>
                <span className="relative">
                  {link.name}
                </span>
                {pathname === link.href && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* User & Authentication Section */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Authenticated User Profile */}
            {isClient && status === "authenticated" && session ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  className="flex items-center gap-2 px-2 py-1 text-gray-700 hover:text-blue-600 transition-colors duration-150"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white overflow-hidden">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={12} />
                    )}
                  </div>
                  <span className="text-sm">
                    {session.user?.firstName || session.user?.firstName?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown size={12} className="text-gray-500" />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200"
                    >
                      <div className="p-3 bg-gray-50 border-b border-gray-200">
                        <p className="font-medium text-gray-900 text-sm">
                          {session.user?.firstName} {session.user?.lastName}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="mr-3 h-4 w-4 text-gray-500" />
                          โปรไฟล์
                        </Link>
                      </div>
                      
                      <div className="py-1 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          ออกจากระบบ
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : isClient && status === "unauthenticated" ? (
              <Link 
                href="/auth/signin"
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-150"
              >
                <User size={14} />
                <span>เข้าสู่ระบบ</span>
              </Link>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden" ref={menuRef}>
            <button 
              type="button"
              className="text-gray-700 p-1 hover:text-blue-600 transition-colors" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[1000] mt-12 bg-white/98 backdrop-blur-sm overflow-auto shadow-sm border-t border-gray-100"
              >
                <div className="container mx-auto p-4">
                  <div className="flex flex-col">
                    <div className="py-3 mb-4 border-b border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">เมนูหลัก</p>
                    </div>
                    
                    <div className="space-y-1 mb-6">
                      {allNavItems.filter(shouldShowNavItem).map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150",
                            pathname === link.href
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className={cn(
                            "transition-colors duration-150",
                            pathname === link.href ? "text-blue-600" : "text-gray-500"
                          )}>
                            {link.icon}
                          </span>
                          <span>{link.name}</span>
                        </Link>
                      ))}
                    </div>
                    
                    {/* Authentication Options - แสดงในเมนู drop-down */}
                    {isClient && (
                      <>
                        <div className="py-2 mt-2 mb-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 uppercase tracking-wider px-4">บัญชีผู้ใช้</p>
                        </div>
                        
                        {status === "authenticated" && session ? (
                          <div className="px-4 py-3 bg-gray-50">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden">
                                {session.user?.image ? (
                                  <img
                                    src={session.user.image}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User size={16} className="text-white" />
                                )}
                              </div>
                              <div>
                                <p className="text-gray-900 text-sm font-medium">{session.user?.firstName} {session.user?.lastName}</p>
                                <p className="text-xs text-gray-600 truncate">{session.user?.email}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <Link
                                href="/dashboard/profile"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-white transition-colors duration-150"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <User size={16} className="text-gray-500" />
                                <span>โปรไฟล์</span>
                              </Link>
                              <button
                                type="button"
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-white transition-colors duration-150"
                              >
                                <LogOut size={16} />
                                <span>ออกจากระบบ</span>
                              </button>
                            </div>
                          </div>
                        ) : status === "unauthenticated" ? (
                          <div className="px-4 py-3">
                            <Link
                              href="/auth/signin"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-150"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <User size={16} className="text-gray-500" />
                              <span>เข้าสู่ระบบ</span>
                            </Link>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;