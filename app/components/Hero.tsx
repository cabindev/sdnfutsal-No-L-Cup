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
    <div className="relative w-full h-screen overflow-hidden bg-[#2c2f72]">
      {/* เอฟเฟกต์ gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2c2f72]/30 to-[#2c2f72]/70 z-[1]" />

      {/* ข้อความขนาดใหญ่ด้านหลังพร้อมเอฟเฟกต์เรืองแสงนีออน - เปลี่ยนเป็นรูปแบบเดียวกันกับบนมือถือ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute inset-0 flex items-center justify-center z-[2]"
      >
        <motion.h1
          className="text-[15vw] font-extrabold text-white/5 select-none tracking-tighter"
          initial={{ opacity: 0.05 }}
          animate={{
            opacity: [0.05, 0.1, 0.05],
            textShadow: [
              "0 0 5px rgba(255, 255, 255, 0.2), 0 0 20px rgba(50, 150, 255, 0.2)",
              "0 0 10px rgba(255, 255, 255, 0.3), 0 0 30px rgba(50, 150, 255, 0.3)",
              "0 0 5px rgba(255, 255, 255, 0.2), 0 0 20px rgba(50, 150, 255, 0.2)",
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.1)",
          }}
        >
          THE COACH
        </motion.h1>
      </motion.div>

      {/* Container สำหรับรูปภาพ */}
      <div className="container mx-auto h-full flex items-center justify-center z-[3] relative">
        {isMobile ? (
          // สำหรับมือถือ
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {/* รูปคนโค้ช */}
            <Image
              src="/img/C4.png"
              alt="THE COACH"
              className="object-contain w-full h-full"
              priority
              sizes="100vw"
              fill
              style={{
                filter: "drop-shadow(0 0 15px rgba(0, 0, 0, 0.5))",
              }}
            />
            
            {/* โลโก้ THE COACH สำหรับมือถือ - ตำแหน่งด้านล่างของรูปคน */}
            <motion.div
              className="absolute bottom-[20%] left-0 right-0 flex justify-center items-center z-20"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <motion.div
                className="max-w-[200px] w-full"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/img/the coach.png"
                  alt="THE COACH"
                  width={300}
                  height={150}
                  className="w-full h-auto object-contain"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(238, 105, 37, 0.7))",
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          // สำหรับเดสก์ท็อป ใช้ COACH2025.png
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: isLoaded ? 0 : 100, opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            className="relative z-10 w-full max-w-[80%] md:max-w-[90%] lg:max-w-[1400px]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="relative w-full h-full"
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src="/img/COACH2025.png"
                alt="THE COACH"
                width={1920}
                height={1080}
                className="object-contain w-full h-full relative z-10"
                priority
                sizes="(max-width: 1200px) 85vw, 1400px"
                style={{
                  filter: "drop-shadow(0 0 15px rgba(0, 0, 0, 0.5))",
                }}
              />

              {/* โลโก้ SDN FUTSAL แทนข้อความ */}
              <motion.div
                className="absolute bottom-[10%] left-0 right-0 flex justify-center items-center z-20"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                <motion.div
                  className="max-w-[300px] w-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/img/the coach.png"
                    alt="SDN FUTSAL NO-L CUP"
                    width={300}
                    height={150}
                    className="w-full h-auto object-contain"
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(238, 105, 37, 0.7))",
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          className="absolute bottom-[5%] left-0 right-0 flex justify-center items-center z-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <motion.a
            href="#registration"
            className="bg-futsal-orange hover:bg-futsal-orange-dark text-white font-bold py-3 px-8 rounded-full 
               text-lg shadow-lg hover:shadow-xl transform transition-transform hover:scale-105 
               flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>สมัครอบรมโค้ชฟุตซอล</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                clipRule="evenodd"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>

      {/* เอฟเฟกต์พาร์ติเคิลด้านหลัง */}
      {isLoaded && <Particles />}

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none z-[4] bg-radial-vignette opacity-60" />
    </div>
  );
};

// คอมโพเนนต์ย่อยสำหรับเอฟเฟกต์พาร์ติเคิล
const Particles = () => {
  // โค้ดส่วนนี้ไม่มีการเปลี่ยนแปลง
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    initialX: `${(i * 5) % 100}%`,
    initialY: `${(i * 7) % 100}%`,
    scale: 0.5 + (i % 10) / 10,
    duration: 15 + (i % 20)
  }));

  return (
    <div className="absolute inset-0 z-[2]">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full bg-blue-200 opacity-60"
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            scale: particle.scale,
          }}
          animate={{
            y: [`${(particle.id * 3) % 100}%`, `${(particle.id * 7) % 100}%`],
            x: [`${(particle.id * 9) % 100}%`, `${(particle.id * 5) % 100}%`],
            opacity: [0.2, 0.6, 0.2],
            boxShadow: [
              '0 0 3px rgba(100, 200, 255, 0.3)',
              '0 0 5px rgba(100, 200, 255, 0.7)',
              '0 0 3px rgba(100, 200, 255, 0.3)'
            ]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.id * 0.2 % 2
          }}
        />
      ))}
    </div>
  );
};

export default Hero;