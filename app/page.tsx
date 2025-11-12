"use client"

import { useEffect, useState } from 'react';
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import PageTransition from "./components/PageTransition";
import FloatingRegisterButton from "./components/FloatingRegisterButton";
import LogoShowcase from "./components/LogoShowcase";
import DownloadSection from "./components/DownloadSection";
import { motion } from 'framer-motion';

export default function Home() {
  const [isGrayscale, setIsGrayscale] = useState(true);

  // Grayscale effect for memorial - 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGrayscale(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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
      <motion.div
        className="min-h-screen overflow-hidden"
        animate={{
          filter: isGrayscale ? 'grayscale(100%)' : 'grayscale(0%)'
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <main>
          <Hero />
          <DownloadSection />
          <LogoShowcase />
        </main>
        <Footer />
        <ScrollToTopButton />
      </motion.div>
    </PageTransition>
  );
}