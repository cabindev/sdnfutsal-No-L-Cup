"use client"

import { motion } from 'framer-motion';
import Image from 'next/image';

// Interface สำหรับโลโก้
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
    image: "/allLogo/Support Futsal-01.webp",
    alt: "Support Futsal 1"
  },
  {
    id: 2,
    image: "/allLogo/Support Futsal-02.webp",
    alt: "Support Futsal 2"
  },
  {
    id: 3,
    image: "/allLogo/Support Futsal-03.webp",
    alt: "Support Futsal 3"
  },
  {
    id: 4,
    image: "/allLogo/Support Futsal-04.webp",
    alt: "Support Futsal 4"
  },
  {
    id: 5,
    image: "/allLogo/Support Futsal-05.webp",
    alt: "Support Futsal 5"
  },
  {
    id: 6,
    image: "/allLogo/Support Futsal-06.webp",
    alt: "Support Futsal 6"
  },
  {
    id: 7,
    image: "/allLogo/Support Futsal-07.webp",
    alt: "Support Futsal 7"
  },
  {
    id: 8,
    image: "/allLogo/Support Futsal-08.webp",
    alt: "Support Futsal 8"
  },
  {
    id: 9,
    image: "/allLogo/Support Futsal-09.webp",
    alt: "Support Futsal 9"
  },
  {
    id: 10,
    image: "/allLogo/Support Futsal-10.webp",
    alt: "Support Futsal 10"
  },
  {
    id: 11,
    image: "/allLogo/Support Futsal-11.webp",
    alt: "Support Futsal 11"
  },
  {
    id: 12,
    image: "/allLogo/Support Futsal-12.webp",
    alt: "Support Futsal 12"
  }
];

// ทำซ้ำโลโก้เพื่อการเลื่อนต่อเนื่อง
const extendedLogos = [...logos, ...logos, ...logos];

export default function LogoShowcase() {
  return (
    <section className="relative py-12 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-2xl font-bold mb-10 text-futsal-blue">Our Partners</h2>

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
                    className="flex items-center justify-center h-24 w-40"
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
