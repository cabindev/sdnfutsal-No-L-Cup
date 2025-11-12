// components/Hero.tsx
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // เพิ่มการตรวจสอบขนาดหน้าจอ
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // ตรวจสอบครั้งแรกเมื่อโหลดหน้า
    checkScreenSize();
    
    // เพิ่ม event listener เพื่อตรวจสอบเมื่อมีการปรับขนาดหน้าจอ
    window.addEventListener('resize', checkScreenSize);
    
    // ทำความสะอาด event listener เมื่อ component unmount
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-300">
      {/* เอฟเฟกต์ gradient overlay แบบไดนามิก */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-blue-900/30 z-[1]" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-cyan-400/30 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-blue-400/30 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 z-[2] opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* โลโก้พื้นหลังขนาดใหญ่ */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center opacity-10">
        <div className="relative w-[800px] h-[800px] md:w-[1200px] md:h-[1200px]">
          <Image
            src="/img/sdnfutsal.png"
            alt="SDN Futsal Background"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 800px, 1200px"
          />
        </div>
      </div>

      {/* โลโก้ SDN Futsal ที่มุมขวาบน */}
      <div className="absolute top-8 right-8 z-[5]">
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <Image
            src="/img/sdnfutsal.png"
            alt="SDN Futsal Logo"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 96px, 128px"
          />
        </div>
      </div>

      {/* Container สำหรับรูปภาพ */}
      <div className="container mx-auto h-full flex items-center justify-center z-[3] relative">
        {isMobile ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* รูปคนโค้ช พร้อม glow effect */}
            <motion.div
              className="relative w-full h-full"
              animate={{
                filter: [
                  "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))",
                  "drop-shadow(0 0 40px rgba(59, 130, 246, 0.7))",
                  "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/img/sdnmobile.png"
                alt="THE COACH"
                className="object-contain"
                priority
                sizes="100vw"
                fill
              />
            </motion.div>
          </motion.div>
        ) : (
          // สำหรับเดสก์ท็อป
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: isLoaded ? 0 : 100, opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
            transition={{ duration: 1, type: "spring", stiffness: 80, damping: 15 }}
            className="relative z-10 w-full max-w-[85%] lg:max-w-[1400px]"
          >
            <motion.div
              className="relative w-full h-full"
              whileHover={{ scale: 1.03, rotateZ: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Glow effect background */}
              <motion.div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-50"
                animate={{
                  background: [
                    "radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(34,211,238,0.6) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)",
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                animate={{
                  filter: [
                    "drop-shadow(0 10px 30px rgba(59, 130, 246, 0.4))",
                    "drop-shadow(0 20px 60px rgba(34, 211, 238, 0.6))",
                    "drop-shadow(0 10px 30px rgba(59, 130, 246, 0.4))",
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/img/ArtPlayer.png"
                  alt="THE COACH"
                  width={1920}
                  height={1080}
                  className="object-contain w-full h-full relative z-10"
                  priority
                  sizes="(max-width: 1200px) 85vw, 1400px"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* เอฟเฟกต์พาร์ติเคิลด้านหลัง */}
      {isLoaded && <Particles />}

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none z-[4] bg-radial-vignette opacity-60" />
    </div>
  );
};

// คอมโพเนนต์ย่อยสำหรับเอฟเฟกต์พาร์ติเคิลแบบมืออาชีพ
const Particles = () => {
  const particles = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    initialX: `${(i * 7) % 100}%`,
    initialY: `${(i * 11) % 100}%`,
    scale: 0.3 + (i % 15) / 15,
    duration: 20 + (i % 30),
    delay: (i * 0.3) % 3
  }));

  return (
    <div className="absolute inset-0 z-[2] pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            background: particle.id % 3 === 0
              ? 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(59,130,246,0.4) 100%)'
              : particle.id % 3 === 1
              ? 'radial-gradient(circle, rgba(34,211,238,0.6) 0%, rgba(59,130,246,0.2) 100%)'
              : 'radial-gradient(circle, rgba(147,197,253,0.5) 0%, transparent 100%)',
            width: `${4 + (particle.id % 8)}px`,
            height: `${4 + (particle.id % 8)}px`,
          }}
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            scale: 0,
            opacity: 0
          }}
          animate={{
            y: [`${(particle.id * 3) % 100}%`, `${(particle.id * 13) % 100}%`, `${(particle.id * 3) % 100}%`],
            x: [`${(particle.id * 11) % 100}%`, `${(particle.id * 7) % 100}%`, `${(particle.id * 11) % 100}%`],
            scale: [particle.scale, particle.scale * 1.5, particle.scale],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay
          }}
        />
      ))}
    </div>
  );
};

export default Hero;