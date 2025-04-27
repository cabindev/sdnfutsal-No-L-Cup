// components/AchievementSection.tsx
"use client"

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Star } from "lucide-react";
import Image from "next/image";

const achievements = [
  {
    year: "2023",
    title: "แชมป์ฟุตซอลเยาวชนแห่งชาติ",
    description: "ทีม SDN U-15 คว้าแชมป์การแข่งขันฟุตซอลเยาวชนแห่งชาติประจำปี 2023",
    image: "/img/achievement-1.jpg",
  },
  {
    year: "2022",
    title: "รางวัลอคาเดมีฟุตซอลยอดเยี่ยม",
    description: "ได้รับการยกย่องให้เป็นโรงเรียนสอนฟุตซอลยอดเยี่ยมประจำปี 2022",
    image: "/img/achievement-2.jpg",
  },
  {
    year: "2021",
    title: "ผลิตนักกีฬาทีมชาติ",
    description: "ส่งนักกีฬาเข้าร่วมทีมชาติไทยรุ่นเยาวชนมากที่สุดในประเทศ จำนวน 7 คน",
    image: "/img/achievement-3.jpg",
  },
];

const testimonials = [
  {
    name: "น้องภูมิ",
    age: "14 ปี",
    quote: "ที่นี่ช่วยพัฒนาทักษะฟุตซอลของผมได้มากครับ โค้ชใส่ใจนักเรียนทุกคน สอนเทคนิคที่นำไปใช้ได้จริง",
    image: "/img/testimonial-1.jpg",
  },
  {
    name: "คุณแม่น้องมิว",
    relation: "ผู้ปกครอง",
    quote: "ลูกชายมีพัฒนาการที่ดีขึ้นมากทั้งทักษะฟุตซอลและระเบียบวินัย ขอบคุณทีมโค้ชที่ดูแลอย่างดี",
    image: "/img/testimonial-2.jpg",
  },
];

export default function AchievementSection() {
  return (
    <section id="achievements" className="py-20 bg-[#06a44b]">
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
              ความ<span className="text-futsal-gold ml-2">สำเร็จ</span>
            </h2>
            <div className="h-1 w-10 bg-futsal-gold rounded-full ml-3"></div>
          </div>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            ผลงานอันภาคภูมิใจและรางวัลที่ได้รับจากการพัฒนานักกีฬาฟุตซอล
          </p>
        </motion.div>

        {/* Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {achievements.map((achievement, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-48">
                <Image 
                  src={achievement.image} 
                  alt={achievement.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100619] to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-futsal-gold text-futsal-dark rounded-full text-sm font-bold">
                    {achievement.year}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                  <Trophy size={20} className="text-futsal-gold mr-2 flex-shrink-0" />
                  {achievement.title}
                </h3>
                <p className="text-white/70 text-sm flex-grow">{achievement.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistics */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <StatCard
            icon={<Trophy size={40} className="text-futsal-gold" />}
            value="80+"
            label="รางวัลการแข่งขัน"
          />
          <StatCard
            icon={<Medal size={40} className="text-futsal-gold" />}
            value="500+"
            label="นักกีฬาที่ผ่านการฝึกอบรม"
          />
          <StatCard
            icon={<Award size={40} className="text-futsal-gold" />}
            value="20+"
            label="นักกีฬาทีมชาติ"
          />
          <StatCard
            icon={<Star size={40} className="text-futsal-gold" />}
            value="10+"
            label="ปีแห่งความสำเร็จ"
          />
        </motion.div>

        {/* Testimonials */}
        <motion.div 
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white text-center mb-10">
            เสียงจาก<span className="text-futsal-gold ml-2">นักเรียนของเรา</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 p-6 rounded-lg flex items-start gap-4 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-futsal-gold text-2xl font-serif">"</div>
                  <p className="text-white/80 italic mb-3">{testimonial.quote}</p>
                  <div className="font-medium text-white">{testimonial.name}</div>
                  {testimonial.relation && (
                    <div className="text-sm text-white/60">{testimonial.relation}</div>
                  )}
                  {testimonial.age && (
                    <div className="text-sm text-white/60">อายุ {testimonial.age}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatCard = ({ icon, value, label }: StatCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-colors duration-300"
    >
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/70">{label}</div>
    </motion.div>
  );
};