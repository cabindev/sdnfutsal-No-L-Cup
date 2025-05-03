// components/PartnersShowcase.tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const PartnersShowcase = () => {
  // โลโก้พันธมิตร (ใช้ PNG ที่มีความโปร่งใส)
  const partners = [
    { id: 1, src: '/allLogo/logo1.png', alt: 'สถาบัน', width: 100, height: 70 },
    { id: 2, src: '/allLogo/logo2.png', alt: 'สสส', width: 110, height: 65 },
    { id: 3, src: '/allLogo/logo3.png', alt: 'สถาบันวิจัย', width: 120, height: 75 },
    { id: 4, src: '/allLogo/logo4.png', alt: 'พระสังฆม', width: 100, height: 60 }
  ];
  
  // สถานะสำหรับการแสดงผลแบบ fade-in
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // ใส่เอฟเฟกต์ fade-in เมื่อโหลดคอมโพเนนต์
    setIsVisible(true);
  }, []);
  
  return (
    <section 
      id="partners-section" 
      className={`py-20 bg-white overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-600 relative">
          <span className="inline-block">พันธมิตรของเรา</span>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-orange-500 rounded-full"></div>
        </h2>
        
        <div className="relative">
          {/* เกราะป้องกันด้านซ้าย - gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-36 z-10 bg-gradient-to-r from-white to-transparent"></div>
          
          {/* เกราะป้องกันด้านขวา - gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-36 z-10 bg-gradient-to-l from-white to-transparent"></div>
          
          {/* แถวแรก - เลื่อนจากขวาไปซ้าย */}
          <div className="flex items-center logo-marquee-right mb-12">
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <div 
                key={`right-${partner.id}-${index}`} 
                className="flex justify-center mx-16 group"
              >
                <div className="relative overflow-hidden p-2 transition-all duration-500">
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={partner.width}
                    height={partner.height}
                    className="transform transition-all duration-700 filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* แถวที่สอง - เลื่อนจากซ้ายไปขวา */}
          <div className="flex items-center logo-marquee-left">
            {[...partners.reverse(), ...partners, ...partners].map((partner, index) => (
              <div 
                key={`left-${partner.id}-${index}`} 
                className="flex justify-center mx-16 group"
              >
                <div className="relative overflow-hidden p-2 transition-all duration-500">
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={partner.width}
                    height={partner.height}
                    className="transform transition-all duration-700 filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .logo-marquee-right {
          animation: scroll-right 40s linear infinite;
          will-change: transform;
        }
        
        .logo-marquee-left {
          animation: scroll-left 35s linear infinite;
          will-change: transform;
        }
        
        @keyframes scroll-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-16rem * ${partners.length})); }
        }
        
        @keyframes scroll-left {
          0% { transform: translateX(calc(-16rem * ${partners.length})); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default PartnersShowcase;