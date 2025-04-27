// components/CoachSection.tsx
"use client"

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Calendar } from "lucide-react";
import Image from "next/image";

const coaches = [
  {
    id: 1,
    name: "โค้ชสมชาย",
    position: "หัวหน้าผู้ฝึกสอน",
    experience: "ประสบการณ์ 15 ปี",
    image: "/img/coach-1.jpg",
    achievements: ["อดีตนักกีฬาทีมชาติไทย", "แชมป์ฟุตซอลไทยลีก 3 สมัย"],
    specialty: "เทคนิคการเล่นและแท็คติก",
  },
  {
    id: 2,
    name: "โค้ชวิชัย",
    position: "ผู้ช่วยผู้ฝึกสอน",
    experience: "ประสบการณ์ 10 ปี",
    image: "/img/coach-2.jpg",
    achievements: ["ผู้ฝึกสอนตำแหน่งผู้รักษาประตู", "อดีตผู้รักษาประตูทีมสโมสรชั้นนำ"],
    specialty: "การพัฒนาผู้รักษาประตู",
  },
  {
    id: 3,
    name: "โค้ชอดิศักดิ์",
    position: "ผู้ฝึกสอนเยาวชน",
    experience: "ประสบการณ์ 8 ปี",
    image: "/img/coach-3.jpg",
    achievements: ["พัฒนานักกีฬาเยาวชนสู่ทีมชาติ", "ผู้เชี่ยวชาญการฝึกเด็ก"],
    specialty: "พัฒนาการและทักษะพื้นฐาน",
  },
  {
    id: 4,
    name: "โค้ชประเสริฐ",
    position: "ผู้ฝึกสอนความฟิต",
    experience: "ประสบการณ์ 12 ปี",
    image: "/img/coach-4.jpg",
    achievements: ["ผู้เชี่ยวชาญด้านวิทยาศาสตร์การกีฬา", "อดีตนักกายภาพทีมชาติ"],
    specialty: "ความแข็งแรงและความเร็ว",
  },
];

const CoachCard = ({ coach, index }: { coach: typeof coaches[0], index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105"
    >
      <div className="relative h-64">
        <Image 
          src={coach.image} 
          alt={coach.name} 
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100619] to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white">{coach.name}</h3>
          <p className="text-futsal-gold">{coach.position}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-white/80 mb-3">
          <Calendar size={16} className="text-futsal-gold" />
          <span>{coach.experience}</span>
        </div>
        <div className="mb-4">
          <p className="font-medium text-white mb-2">ความเชี่ยวชาญ:</p>
          <p className="text-white/70 text-sm">{coach.specialty}</p>
        </div>
        <div>
          <p className="font-medium text-white mb-2">ผลงาน:</p>
          <ul className="space-y-1">
            {coach.achievements.map((achievement, idx) => (
              <li key={idx} className="text-white/70 text-sm flex items-start">
                <Trophy size={14} className="text-futsal-gold mr-2 mt-1 flex-shrink-0" />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default function CoachSection() {
  return (
    <section id="coaches" className="py-20 bg-gradient-to-b from-[#ee6925] to-[#24103b]">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center items-center mb-4">
            <div className="h-1 w-10 bg-futsal-gold rounded-full mr-3"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-white inline-flex items-center">
              โค้ช<span className="text-futsal-gold ml-2">ผู้ฝึกสอน</span>
            </h2>
            <div className="h-1 w-10 bg-futsal-gold rounded-full ml-3"></div>
          </div>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            ทีมโค้ชมืออาชีพที่มีประสบการณ์และความเชี่ยวชาญสูง พร้อมพัฒนาทักษะของผู้เรียนสู่ความเป็นเลิศ
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coaches.map((coach, index) => (
            <CoachCard key={coach.id} coach={coach} index={index} />
          ))}
        </div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <button className="bg-futsal-gold hover:bg-futsal-gold/90 text-futsal-dark text-lg px-8 py-4 rounded-md font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            ดูโค้ชทั้งหมด
          </button>
        </motion.div>
      </div>
    </section>
  );
}