"use client"

import { useEffect } from 'react';
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import PageTransition from "./components/PageTransition";
import FloatingRegisterButton from "./components/FloatingRegisterButton";
import LogoShowcase from "./components/LogoShowcase";
import DownloadSection from "./components/DownloadSection";

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
          <DownloadSection />
          <LogoShowcase />
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </PageTransition>
  );
}
