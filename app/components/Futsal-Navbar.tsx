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

  // ตรวจสอบการเลื่อนหน้าจอ
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
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
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200/80 py-3" 
          : "bg-white/90 backdrop-blur-sm shadow-sm py-4"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <nav className="flex items-center justify-between w-full">
          {/* Logo Section - ปรับให้แสดงแค่สิ่งจำเป็นบนมือถือ */}
          <Link href="/" className="flex items-center gap-3 group z-10">
            <div className="relative flex items-center gap-3">
              <img 
                src="/img/sdnfutsal.png" 
                alt="SDN Futsal Logo" 
                className="w-8 h-8 md:w-10 md:h-10 object-cover"
              />
              <div className="relative">
                <div className="flex items-center">
                  <span className="font-semibold text-lg md:text-xl text-gray-900">SDN </span>
                  <span className="font-semibold text-lg md:text-xl text-blue-600 ml-1">FUTSAL</span>
                </div>
                <div className="text-xs text-gray-600 -mt-1">Management System</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {allNavItems.filter(shouldShowNavItem).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "group relative px-3 py-2 font-medium text-sm rounded-md transition-all duration-200 flex items-center gap-2",
                  pathname === link.href
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <span className={cn(
                  "transition-colors duration-200",
                  pathname === link.href ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                )}>
                  {link.icon}
                </span>
                <span className="relative">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          {/* User & Authentication Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Phone Number */}
            <div className="flex items-center gap-2 text-gray-700 bg-gray-100/80 px-3 py-2 rounded-md">
              <Phone size={16} className="text-blue-600" />
              <span className="font-medium text-sm">095-914-1297</span>
            </div>

            {/* Authenticated User Profile */}
            {isClient && status === "authenticated" && session ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white overflow-hidden">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={14} />
                    )}
                  </div>
                  <span className="font-medium text-sm">
                    {session.user?.firstName || session.user?.firstName?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown size={14} className="text-gray-500" />
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
              <div>
                <Link 
                  href="/auth/signin"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 shadow-sm rounded-md"
                >
                  <User size={16} />
                  <span>เข้าสู่ระบบ</span>
                </Link>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden" ref={menuRef}>
            <button 
              type="button"
              className="text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
                className="fixed inset-0 z-[1000] mt-16 bg-white/95 backdrop-blur-md overflow-auto shadow-lg"
              >
                <div className="container mx-auto p-4">
                  <div className="flex flex-col">
                    <div className="py-2 mb-3 border-b border-gray-200">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">เมนูหลัก</p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      {allNavItems.filter(shouldShowNavItem).map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="text-blue-600 mb-2 p-2 bg-blue-50 rounded-full">
                            {link.icon}
                          </span>
                          <span className="text-gray-700 text-sm font-medium">{link.name}</span>
                        </Link>
                      ))}
                    </div>
                    
                    {/* Authentication Options - แสดงในเมนู drop-down */}
                    {isClient && (
                      <>
                        <div className="py-2 mt-2 mb-3 border-b border-gray-200">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">บัญชีผู้ใช้</p>
                        </div>
                        
                        {status === "authenticated" && session ? (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden">
                                {session.user?.image ? (
                                  <img
                                    src={session.user.image}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User size={24} className="text-white" />
                                )}
                              </div>
                              <div>
                                <p className="text-gray-900 font-medium">{session.user?.firstName} {session.user?.lastName}</p>
                                <p className="text-xs text-gray-600 truncate">{session.user?.email}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-2">
                              <Link
                                href="/dashboard/profile"
                                className="flex items-center justify-center gap-2 p-2 rounded-md bg-white hover:bg-gray-100 text-gray-700 text-sm border border-gray-200"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <User size={16} className="text-blue-600" />
                                <span>โปรไฟล์</span>
                              </Link>
                            </div>
                            
                            <button
                              type="button"
                              onClick={handleSignOut}
                              className="w-full mt-3 flex items-center justify-center gap-2 p-2 rounded-md bg-red-50 hover:bg-red-100 text-red-600 text-sm border border-red-200"
                            >
                              <LogOut size={16} />
                              <span>ออกจากระบบ</span>
                            </button>
                          </div>
                        ) : status === "unauthenticated" ? (
                          <div>
                            <Link
                              href="/auth/signin"
                              className="flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <User size={18} />
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
    </header>
  );
};

export default Navbar;