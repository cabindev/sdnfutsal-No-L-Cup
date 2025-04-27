// app/page.tsx
"use client"

import React, { useEffect } from "react";
import FutsalNavbar from "./components/Futsal-Navbar";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import TrainingInfo from "./components/TrainingInfo";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import PageTransition from "./components/PageTransition";


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
            <TrainingInfo />
            <Gallery />         
          </div>
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </PageTransition>
  );
}