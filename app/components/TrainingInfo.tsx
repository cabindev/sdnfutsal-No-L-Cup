// components/TrainingInfo.tsx
"use client"

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, Trophy, CheckCircle } from "lucide-react";
import Image from "next/image";

const trainingSchedule = [
  {
    id: 1,
    course: "หลักสูตรเริ่มต้น",
    age: "7-9 ปี",
    days: "จันทร์, พุธ, ศุกร์",
    time: "16:00 - 17:30 น.",
    maxStudents: 15,
    currentStudents: 10,
    image: "/img/training-1.jpg",
    status: "เปิดรับสมัคร",
  },
  {
    id: 2,
    course: "หลักสูตรพัฒนา",
    age: "10-12 ปี",
    days: "อังคาร, พฤหัส, เสาร์",
    time: "16:00 - 17:30 น.",
    maxStudents: 15,
    currentStudents: 15,
    image: "/img/training-2.jpg",
    status: "เต็ม",
  },
  {
    id: 3,
    course: "หลักสูตรแข่งขัน",
    age: "13-15 ปี",
    days: "จันทร์, พุธ, ศุกร์",
    time: "17:30 - 19:00 น.",
    maxStudents: 12,
    currentStudents: 8,
    image: "/img/training-3.jpg",
    status: "เปิดรับสมัคร",
  },
  {
    id: 4,
    course: "คลินิกทักษะพิเศษ",
    age: "10-15 ปี",
    days: "อาทิตย์",
    time: "09:00 - 12:00 น.",
    maxStudents: 10,
    currentStudents: 6,
    image: "/img/training-4.jpg",
    status: "ใหม่",
  },
];

const benefits = [
  {
    title: "โค้ชมืออาชีพ",
    description: "ทีมโค้ชที่มีประสบการณ์การสอนระดับสูง",
    icon: <Trophy size={40} className="text-futsal-gold" />,
  },
  {
    title: "พัฒนาเทคนิคเฉพาะตัว",
    description: "เน้นแก้ไขจุดอ่อนและเสริมจุดแข็งของผู้เรียนแต่ละคน",
    icon: <CheckCircle size={40} className="text-futsal-gold" />,
  },
  {
    title: "สนามมาตรฐาน",
    description: "สนามที่ได้มาตรฐานสากล พร้อมอุปกรณ์ครบครัน",
    icon: <CheckCircle size={40} className="text-futsal-gold" />,
  },
  {
    title: "กลุ่มเล็ก",
    description: "จำกัดจำนวนผู้เรียนต่อกลุ่ม เพื่อดูแลได้อย่างทั่วถึง",
    icon: <Users size={40} className="text-futsal-gold" />,
  },
];

const TrainingCard = ({ training, index }: { training: typeof trainingSchedule[0], index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
    >
      <div className="relative h-48">
        <Image 
          src={training.image} 
          alt={training.course} 
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100619] to-transparent"></div>
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            training.status === "เต็ม" ? "bg-gray-500" : 
            training.status === "ใหม่" ? "bg-futsal-orange" : 
            "bg-green-500"
          } text-white`}>
            {training.status}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white">{training.course}</h3>
          <p className="text-futsal-gold">อายุ {training.age}</p>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-white/80">
          <Calendar size={16} className="text-futsal-gold" />
          <span>{training.days}</span>
        </div>
        <div className="flex items-center gap-2 text-white/80">
          <Clock size={16} className="text-futsal-gold" />
          <span>{training.time}</span>
        </div>
        <div className="flex items-center gap-2 text-white/80">
          <Users size={16} className="text-futsal-gold" />
          <span>{training.currentStudents}/{training.maxStudents} คน</span>
          <div className="ml-2 flex-grow h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${training.status === "เต็ม" ? "bg-red-500" : "bg-futsal-gold"}`} 
              style={{ width: `${(training.currentStudents / training.maxStudents) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="pt-3">
          <button 
            className={`w-full py-2.5 px-4 rounded-md font-medium transition-all ${
              training.status === "เต็ม" 
                ? "bg-gray-600 text-white/70 cursor-not-allowed" 
                : "bg-futsal-gold hover:bg-futsal-gold/90 text-futsal-dark"
            }`}
            disabled={training.status === "เต็ม"}
          >
            {training.status === "เต็ม" ? "คอร์สเต็มแล้ว" : "สมัครเรียน"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function TrainingInfo() {
  return (
    <section id="training" className="py-20 bg-gradient-to-b from-[#24103b] to-[#1a0c2b]">
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
              ตาราง<span className="text-futsal-gold ml-2">ฝึกซ้อม</span>
            </h2>
            <div className="h-1 w-10 bg-futsal-gold rounded-full ml-3"></div>
          </div>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            หลักสูตรฝึกสอนที่ออกแบบเฉพาะตามช่วงอายุและระดับทักษะ เพื่อพัฒนาผู้เรียนอย่างมีประสิทธิภาพสูงสุด
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trainingSchedule.map((training, index) => (
            <TrainingCard key={training.id} training={training} index={index} />
          ))}
        </div>

        <motion.div 
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white text-center mb-10">
            จุดเด่นของโปรแกรมฝึกซ้อม <span className="text-futsal-gold">SDN FUTSAL</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                <div className="mb-4 inline-flex justify-center">{benefit.icon}</div>
                <h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
                <p className="text-white/70 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-lg px-8 py-3 rounded-md font-medium">
            ดูหลักสูตรทั้งหมด
          </button>
        </motion.div>
      </div>
    </section>
  );
}