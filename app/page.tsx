"use client"

import { useState, useEffect, Suspense } from 'react';
import FutsalNavbar from "./components/Futsal-Navbar";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import TrainingInfo from "./components/TrainingInfo";
import TrainingBatchRegistration from "./components/TrainingBatchRegistration";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import PageTransition from "./components/PageTransition";
import FloatingRegisterButton from "./components/FloatingRegisterButton";
import { motion } from 'framer-motion';
import Image from 'next/image';

// เพิ่ม interface สำหรับโลโก้
interface Logo {
  id: number;
  image: string;
  alt: string;
  url?: string;
}

// ข้อมูลโลโก้
const logos: Logo[] = [
  {
    id: 1,
    image: "/allLogo/futsal.png", 
    alt: "Futsal",
    url: "https://futsal.com"
  },
  {
    id: 2,
    image: "/allLogo/power_synergy.png",
    alt: "Power Synergy", 
    url: "https://powersynergy.com"
  },
  {
    id: 3,
    image: "/allLogo/sdnnetwork.png",
    alt: "SDN Network",
    url: "https://sdnnetwork.com"
  },
  {
    id: 4,
    image: "/allLogo/thaihealt.png", 
    alt: "Thai Health",
    url: "https://thaihealth.or.th"
  }
];

// ทำซ้ำโลโก้เพื่อการเลื่อนต่อเนื่อง
const extendedLogos = [...logos, ...logos, ...logos];

// สร้าง Component LogoShowcase
function LogoShowcase() {
  return (
    <section className="relative py-12 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-2xl font-bold mb-10 text-futsal-blue">พันธมิตรของเรา</h2>
        
        <div className="relative w-full">
          <div className="logo-slider">
            <div className="logo-slide-track">
              {extendedLogos.map((logo, index) => (
                <div 
                  key={`${logo.id}-${index}`}
                  className="logo-slide"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md flex items-center justify-center h-24 w-40"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={logo.image}
                        alt={logo.alt}
                        fill
                        className="object-contain"
                        sizes="160px"
                        quality={90}
                      />
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .logo-slider {
          width: 100%;
          height: auto;
          margin: auto;
          overflow: hidden;
          position: relative;
        }

        .logo-slide-track {
          display: flex;
          animation: scroll 30s linear infinite;
          width: calc(200px * ${extendedLogos.length});
        }

        .logo-slide {
          width: 160px;
          padding: 0 20px;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-200px * ${logos.length}));
          }
        }

        /* หยุดชั่วคราวเมื่อ hover */
        .logo-slider:hover .logo-slide-track {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

export default function Home() {
  // Smooth scroll effect for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash && target.hash.startsWith("#")) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 80,
            behavior: "smooth",
          });
        }
      }
    };
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick as EventListener);
    });
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick as EventListener);
      });
    };
  }, []);
  
  return (
    <PageTransition>
      <div className="min-h-screen overflow-hidden">

        <main>
          <Hero />
          
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-60 h-60 bg-futsal-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-40 right-0 w-80 h-80 bg-futsal-blue/5 rounded-full translate-x-1/2 blur-3xl"></div>
            
            <Suspense fallback={<div />}>
              <TrainingBatchRegistration />
            </Suspense>
            
            {/* <TrainingInfo />
            <Gallery /> */}
          </div>
          <LogoShowcase />
        </main>
        <FloatingRegisterButton />
        <Footer />
        <ScrollToTopButton />
      </div>
    </PageTransition>
  );
}