// app/components/Futsal-Navbar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Menu, X, User, LogOut, Star, Home, Calendar, Trophy, 
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
      href: "/#coaches", 
      icon: <Trophy size={20} />
    },
    { 
      name: "ตารางฝึกซ้อม", 
      href: "/#training", 
      icon: <Calendar size={20} />
    },
    { 
      name: "แกลเลอรี่", 
      href: "/#gallery", 
      icon: <ImageIcon size={20} />
    },
    { 
      name: "ติดต่อ", 
      href: "/#contact", 
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
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-[#2c2f72] bg-opacity-95 backdrop-blur-sm shadow-lg py-2" 
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <nav className="flex items-center justify-between w-full">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center gap-2 z-10">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg transition-transform duration-300 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-futsal-gold/20 to-futsal-orange/20 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                {isScrolled ? (
                  <img 
                    src="/img/sdnfutsal.png" 
                    alt="SDN Futsal Logo" 
                    className="w-full h-full object-cover p-1"
                  />
                ) : (
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src="/img/sdnfutsal.png" 
                    alt="SDN Futsal Logo" 
                    className="w-full h-full object-cover p-1"
                  />
                )}
              </div>
              <div className="relative">
                <div className="flex items-center">
                  <span className={cn(
                    "font-prompt font-extrabold text-2xl transition-colors duration-300",
                    "text-white drop-shadow-md"
                  )}>SDN </span>
                  <span className="font-prompt font-extrabold text-2xl text-amber-500 text-futsal-gold drop-shadow-md ml-1">FUTSAL No L CUP</span>
                </div>
                <div className="absolute -bottom-1 left-0 h-0.5 bg-futsal-orange w-0 group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {allNavItems.filter(shouldShowNavItem).map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="group relative px-4 py-2 font-prompt font-medium text-base text-white hover:text-futsal-gold transition-colors duration-300 flex items-center gap-2 overflow-hidden rounded-lg"
              >
                <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                <span className="text-futsal-gold group-hover:scale-125 transition-transform duration-300">
                  {link.icon}
                </span>
                <span className="relative z-10">
                  {link.name}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-futsal-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </motion.a>
            ))}
          </div>

          {/* User & Authentication Section */}
          <div className="hidden md:flex items-center gap-5">
            {/* Phone Number */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="flex items-center gap-2 text-white bg-white/5 px-3 py-1.5 rounded-full"
            >
              <Phone size={16} className="text-futsal-gold" />
              <span className="font-medium text-sm">062-123-4567</span>
            </motion.div>

            {/* Authenticated User Profile */}
            {isClient && status === "authenticated" && session ? (
              <div className="relative" ref={profileRef}>
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-white transition-all"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-futsal-gold to-futsal-orange flex items-center justify-center text-white overflow-hidden">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <span className="font-medium text-sm">
                    {session.user?.firstName || session.user?.firstName?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown size={16} className="text-futsal-gold" />
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100"
                    >
                      <div className="p-4 bg-gradient-to-br from-[#2c2f72] to-[#1e214d] text-white">
                        <p className="font-medium">
                          {session.user?.firstName} {session.user?.lastName}
                        </p>
                        <p className="text-xs text-white/80 mt-1 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-futsal-gold/10 hover:text-futsal-gold"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="mr-3 h-4 w-4" />
                          โปรไฟล์
                        </Link>
                        
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-futsal-gold/10 hover:text-futsal-gold"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          ตั้งค่า
                        </Link>
                      </div>
                      
                      <div className="py-2 border-t border-gray-100">
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
              /* Sign In Button */
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="relative"
              >

                <Link 
                  href="/auth/signin"
                  className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-gradient-to-r from-futsal-gold to-futsal-orange hover:from-futsal-orange hover:to-futsal-gold text-white font-medium transition-all duration-500 shadow-lg hover:shadow-futsal-gold/20 rounded-md"
                >
                  <Star size={14} />
                  เข้าสู่ระบบ
                </Link>
              </motion.div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden" ref={menuRef}>
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white shadow-md backdrop-blur-sm border border-white/20" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-[1000] mt-16 bg-[#2c2f72]/95 backdrop-blur-md overflow-auto"
                >
                  <div className="container mx-auto p-4">
                    <div className="flex flex-col">
                      <div className="py-2 mb-3 border-b border-white/10">
                        <p className="text-xs font-medium text-white/50 uppercase tracking-wider">เมนูหลัก</p>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        {allNavItems.filter(shouldShowNavItem).map((link, index) => (
                          <motion.a
                            key={link.name}
                            href={link.href}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.1 }}
                            className="flex flex-col items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="text-futsal-gold mb-2 p-2 bg-white/5 rounded-full">
                              {link.icon}
                            </span>
                            <span className="text-white text-sm">{link.name}</span>
                          </motion.a>
                        ))}
                      </div>
                      
                      {/* Profile or Authentication */}
                      {isClient && status === "authenticated" && session ? (
                        <div className="flex flex-col">
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-4 bg-white/5 rounded-lg mb-4 border border-white/10"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-futsal-gold to-futsal-orange flex items-center justify-center text-white overflow-hidden">
                                {session.user?.image ? (
                                  <img
                                    src={session.user.image}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User size={24} />
                                )}
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  {session.user?.firstName} {session.user?.lastName}
                                </p>
                                <p className="text-white/70 text-sm truncate">
                                  {session.user?.email}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <Link
                                href="/dashboard/profile"
                                className="flex items-center justify-center gap-2 py-2 text-sm text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <User size={16} />
                                โปรไฟล์
                              </Link>
                              
                              <button
                                onClick={() => {
                                  handleSignOut();
                                  setIsMenuOpen(false);
                                }}
                                className="flex items-center justify-center gap-2 py-2 text-sm text-white bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                              >
                                <LogOut size={16} />
                                ออกจากระบบ
                              </button>
                            </div>
                          </motion.div>
                        </div>
                      ) : isClient && status === "unauthenticated" ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="flex flex-col gap-3"
                        >
                          <Link
                            href="/auth/signin"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/10 flex items-center justify-center"
                          >
                            เข้าสู่ระบบ
                          </Link>
                          
                          <Link
                            href="/auth/signup"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full py-3 bg-gradient-to-r from-futsal-gold to-futsal-orange hover:from-futsal-orange hover:to-futsal-gold text-white font-medium rounded-lg flex items-center justify-center"
                          >
                            สมัครสมาชิก
                          </Link>
                        </motion.div>
                      ) : null}
                      
                      {/* Contact */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-white"
                      >
                        <Phone size={18} className="text-futsal-gold" />
                        <span className="font-medium">062-123-4567</span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;