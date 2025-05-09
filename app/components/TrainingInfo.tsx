// components/TrainingInfo.tsx
"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, Trophy, CheckCircle, BookOpen, Award } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Tabs,TabsContent, TabsList, TabsTrigger } from "./ui/taps";

// ข้อมูลจาก PDF
const trainingBatches = [
  {
    id: 1,
    batchNumber: 1,
    year: 2025,
    startDate: "2025-05-20",
    endDate: "2025-05-24",
    location: "สนามกีฬาเทศบาลนคร",
    maxParticipants: 30,
    currentParticipants: 18,
    status: "เปิดรับสมัคร",
    image: "/img/training-batch1.jpg",
    description: "รุ่นแรกของปี 2025 สำหรับผู้สนใจเป็นโค้ชฟุตซอลระดับ T-License"
  },
  {
    id: 2,
    batchNumber: 2,
    year: 2025,
    startDate: "2025-07-15",
    endDate: "2025-07-19",
    location: "ศูนย์ฝึกกีฬาแห่งชาติ",
    maxParticipants: 30,
    currentParticipants: 30,
    status: "เต็ม",
    image: "/img/training-batch2.jpg",
    description: "รุ่นกลางปี เปิดรับทั้งโค้ชใหม่และโค้ชที่ต้องการต่ออายุใบอนุญาต"
  },
  {
    id: 3,
    batchNumber: 3,
    year: 2025,
    startDate: "2025-09-10",
    endDate: "2025-09-14",
    location: "ศูนย์กีฬาประจำภาคเหนือ",
    maxParticipants: 25,
    currentParticipants: 10,
    status: "เปิดรับสมัคร",
    image: "/img/training-batch3.jpg",
    description: "รุ่นพิเศษสำหรับภาคเหนือ เน้นเทคนิคการสอนสำหรับโปรแกรมฟุตซอลเยาวชน"
  },
  {
    id: 4,
    batchNumber: 4,
    year: 2025,
    startDate: "2025-11-05",
    endDate: "2025-11-09",
    location: "ศูนย์การเรียนรู้กีฬาฟุตซอล",
    maxParticipants: 30,
    currentParticipants: 5,
    status: "เร็วๆ นี้",
    image: "/img/training-batch4.jpg",
    description: "รุ่นสุดท้ายของปี เน้นเตรียมความพร้อมสำหรับการแข่งขันในปี 2026"
  },
];

// ข้อมูลวิทยากร (จาก PDF)
const instructors = [
  { name: "นายบุญเลิศ เจริญวงศ์", role: "หัวหน้าผู้ฝึกสอน", image: "/img/instructor1.jpg" },
  { name: "นายมานะ ชื่นเอี่ยม", role: "ผู้ฝึกสอนเทคนิค", image: "/img/instructor2.jpg" },
  { name: "นางธัชชนก เจริญวงศ์", role: "ผู้ฝึกสอนวิเคราะห์เกม", image: "/img/instructor3.jpg" },
  { name: "นายโชติวุฒิ บุญยะพุกกะนะ", role: "ผู้ฝึกสอนการเคลื่อนไหว", image: "/img/instructor4.jpg" },
  { name: "ดร.ฉัตรกมล สิงห์น้อย", role: "ผู้เชี่ยวชาญจิตวิทยาการกีฬา", image: "/img/instructor5.jpg" },
  { name: "ดร.อัชรัฐ ยงทวี", role: "ผู้เชี่ยวชาญวิทยาศาสตร์การกีฬา", image: "/img/instructor6.jpg" },
];

// ข้อมูลหลักสูตร (จาก PDF)
const courseSchedule = [
  {
    day: "วันที่ 1",
    sessions: [
      { time: "8.00 - 10.00", title: "พิธีเปิด, FA, AFC Education M&P, ประวัติฟุตซอล", type: "ทฤษฎี" },
      { time: "10.00 - 12.00", title: "Warm Up & Cool Down, Ball Feeling, Control & Turning", type: "ทฤษฎี" },
      { time: "14.00 - 15.30", title: "Warm Up & Cool Down, Ball Feeling", type: "ปฏิบัติ" },
      { time: "16.00 - 18.00", title: "Basic-Control & Turning, Basic-Passing & Support", type: "ปฏิบัติ" },
      { time: "18.30 - 21.00", title: "ทบทวนและอภิปรายวันที่ 1", type: "กลุ่ม" },
    ]
  },
  {
    day: "วันที่ 2",
    sessions: [
      { time: "8.00 - 10.00", title: "เกณฑ์การฝึกสอนตามช่วงอายุ 6-18 ปี, การวางแผนการฝึกที่มีประสิทธิภาพ", type: "ทฤษฎี" },
      { time: "10.00 - 12.00", title: "Basic-Dribbling, Basic-Shooting, Basic System & Style", type: "ทฤษฎี" },
      { time: "14.00 - 15.30", title: "Basic-Dribbling pass Opponent, Basic-Shooting", type: "ปฏิบัติ" },
      { time: "16.00 - 18.00", title: "Basic-System & Style, Basic-Individual Attacking Tactical", type: "ปฏิบัติ" },
      { time: "18.30 - 21.00", title: "วิทยาศาสตร์การกีฬาและเวชศาสตร์การกีฬา", type: "กลุ่ม" },
    ]
  },
  {
    day: "วันที่ 3",
    sessions: [
      { time: "8.00 - 10.00", title: "คุณสมบัติผู้เล่นฟุตซอล, กระบวนการโค้ชชิ่ง", type: "ทฤษฎี" },
      { time: "10.00 - 12.00", title: "Basic-Defensive Technique, Basic-Type of Defense", type: "ทฤษฎี" },
      { time: "14.00 - 15.30", title: "Basic-Defensive Technique (1st,2nd,3rd,4th Defender)", type: "ปฏิบัติ" },
      { time: "16.00 - 18.00", title: "Basic-Type of Defense (Man to Man, Zone, Mix)", type: "ปฏิบัติ" },
      { time: "18.30 - 21.00", title: "ทบทวนและนำเสนอกลุ่ม (20-40)", type: "กลุ่ม" },
    ]
  },
  {
    day: "วันที่ 4",
    sessions: [
      { time: "8.00 - 10.00", title: "คุณสมบัติการเป็นโค้ชที่ประสบความสำเร็จ, วิธีการโค้ชชิ่ง", type: "ทฤษฎี" },
      { time: "10.00 - 12.00", title: "Basic-Goalkeeping Technique", type: "ทฤษฎี" },
      { time: "14.00 - 15.30", title: "สอบทฤษฎี", type: "ทดสอบ" },
      { time: "16.00 - 18.00", title: "Basic-Goalkeeping Technique", type: "ปฏิบัติ" },
      { time: "18.30 - 21.00", title: "จิตวิทยาการกีฬาสำหรับเด็ก", type: "กลุ่ม" },
    ]
  },
  {
    day: "วันที่ 5",
    sessions: [
      { time: "8.00 - 12.00", title: "การประเมินภาคปฏิบัติ 1", type: "ทดสอบ" },
      { time: "14.00 - 16.00", title: "พิธีปิดและมอบประกาศนียบัตร", type: "พิธีการ" },
    ]
  },
];

// ข้อมูลคุณประโยชน์
const benefits = [
  {
    title: "วิทยากรผู้เชี่ยวชาญ",
    description: "เรียนรู้จากผู้เชี่ยวชาญและทีมงานที่มีประสบการณ์ในวงการฟุตซอลระดับประเทศ",
    icon: <Trophy className="w-10 h-10 text-futsal-gold" />,
  },
  {
    title: "หลักสูตรได้มาตรฐาน",
    description: "ออกแบบตามมาตรฐาน FA และ AFC เพื่อสร้างโค้ชที่มีความสามารถระดับสากล",
    icon: <Award className="w-10 h-10 text-futsal-gold" />,
  },
  {
    title: "ครบทั้งทฤษฎีและปฏิบัติ",
    description: "เรียนรู้ทั้งภาคทฤษฎีและฝึกปฏิบัติจริง เพื่อเสริมสร้างทักษะอย่างครบถ้วน",
    icon: <BookOpen className="w-10 h-10 text-futsal-gold" />,
  },
  {
    title: "ใบประกาศนียบัตรรับรอง",
    description: "ได้รับใบประกาศนียบัตร T-License ที่ได้รับการยอมรับในวงการกีฬาฟุตซอล",
    icon: <CheckCircle className="w-10 h-10 text-futsal-gold" />,
  },
];

// ส่วนประกอบการ์ดแสดงข้อมูลรุ่น
const BatchCard = ({ batch, index }: { batch: typeof trainingBatches[0], index: number }) => {
  const startDate = new Date(batch.startDate);
  const endDate = new Date(batch.endDate);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('th-TH', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  const formatDateRange = () => {
    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
      return `${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}`;
    } else {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-b-4 border-futsal-orange"
    >
      <div className="relative h-48">
        <div className="absolute inset-0 bg-futsal-navy/30 z-10"></div>
        <Image 
          src={batch.image || "/img/batch-default.jpg"} 
          alt={`รุ่นที่ ${batch.batchNumber}/${batch.year}`} 
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3 z-20">
          <Badge className={`px-3 py-1 ${
            batch.status === "เต็ม" ? "bg-red-500" : 
            batch.status === "เร็วๆ นี้" ? "bg-futsal-blue" : 
            "bg-futsal-green"
          }`}>
            {batch.status}
          </Badge>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-futsal-navy mb-2">
          รุ่นที่ {batch.batchNumber}/{batch.year}
        </h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-5 w-5 text-futsal-orange flex-shrink-0" />
            <span>{formatDateRange()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="h-5 w-5 text-futsal-orange flex-shrink-0" />
            <span>{batch.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="h-5 w-5 text-futsal-orange flex-shrink-0" />
            <div className="flex-grow">
              <div className="flex justify-between mb-1">
                <span>{batch.currentParticipants}/{batch.maxParticipants} คน</span>
                <span className="text-sm text-gray-500">
                  {Math.round((batch.currentParticipants / batch.maxParticipants) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-full rounded-full ${
                    batch.status === "เต็ม" ? "bg-red-500" : "bg-futsal-green"
                  }`}
                  style={{ width: `${(batch.currentParticipants / batch.maxParticipants) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {batch.description && (
          <p className="text-sm text-gray-600 border-t border-gray-100 pt-3 mb-4">
            {batch.description}
          </p>
        )}
        
        <Button 
          className={`w-full ${
            batch.status === "เต็ม" 
              ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed" 
              : batch.status === "เร็วๆ นี้"
                ? "bg-futsal-blue hover:bg-futsal-blue/90"
                : "bg-futsal-orange hover:bg-futsal-orange/90"
          }`}
          disabled={batch.status === "เต็ม" || batch.status === "เร็วๆ นี้"}
        >
          {batch.status === "เต็ม" ? "รุ่นเต็มแล้ว" : 
           batch.status === "เร็วๆ นี้" ? "เปิดรับเร็วๆ นี้" : 
           "สมัครเข้าร่วมอบรม"}
        </Button>
      </div>
    </motion.div>
  );
};

// ส่วนประกอบตารางแสดงตารางเรียน
const ScheduleTable = ({ schedule }: { schedule: typeof courseSchedule }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-futsal-navy text-white p-3 text-left">วัน</th>
            <th className="bg-futsal-navy text-white p-3 text-left">เวลา</th>
            <th className="bg-futsal-navy text-white p-3 text-left">รายละเอียด</th>
            <th className="bg-futsal-navy text-white p-3 text-left">ประเภท</th>
          </tr>
        </thead>
        <tbody>
          {schedule.flatMap((day, dayIndex) => 
            day.sessions.map((session, sessionIndex) => (
              <tr key={`${dayIndex}-${sessionIndex}`} className={sessionIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {sessionIndex === 0 ? (
                  <td className="border p-3 font-medium text-futsal-navy" rowSpan={day.sessions.length}>
                    {day.day}
                  </td>
                ) : null}
                <td className="border p-3 whitespace-nowrap text-gray-700">{session.time}</td>
                <td className="border p-3 text-gray-800">{session.title}</td>
                <td className="border p-3">
                  <Badge className={
                    session.type === "ทฤษฎี" ? "bg-futsal-blue" : 
                    session.type === "ปฏิบัติ" ? "bg-futsal-green" : 
                    session.type === "ทดสอบ" ? "bg-futsal-orange" : 
                    session.type === "กลุ่ม" ? "bg-futsal-navy" : 
                    "bg-gray-500"
                  }>
                    {session.type}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ส่วนประกอบการ์ดแสดงข้อมูลวิทยากร
const InstructorCard = ({ instructor, index }: { instructor: typeof instructors[0], index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
    >
      <div className="relative h-48">
        <Image 
          src={instructor.image || "/img/instructor-default.jpg"} 
          alt={instructor.name} 
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 text-center">
        <h4 className="font-semibold text-futsal-navy">{instructor.name}</h4>
        <p className="text-sm text-gray-600">{instructor.role}</p>
      </div>
    </motion.div>
  );
};

// คอมโพเนนต์หลัก
export default function TrainingInfo() {
  const [activeTab, setActiveTab] = useState("batches");

  return (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-futsal-navy mb-4">
            SDN Futsal <span className="text-futsal-orange">NO-L</span> T-License 2025
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            หลักสูตรอบรมผู้ฝึกสอนฟุตซอลระดับ T-License คุณภาพสูง รับรองโดยสมาคมกีฬาฟุตซอลแห่งประเทศไทย
          </p>
        </motion.div>

        <Tabs defaultValue="batches" className="mb-16" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="batches" className="text-lg py-3">รุ่นการอบรม</TabsTrigger>
            <TabsTrigger value="schedule" className="text-lg py-3">ตารางเรียน</TabsTrigger>
            <TabsTrigger value="instructors" className="text-lg py-3">วิทยากร</TabsTrigger>
            <TabsTrigger value="benefits" className="text-lg py-3">จุดเด่น</TabsTrigger>
          </TabsList>
          
          <TabsContent value="batches" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trainingBatches.map((batch, index) => (
                <BatchCard key={batch.id} batch={batch} index={index} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="mt-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: activeTab === "schedule" ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-2xl font-bold text-futsal-navy mb-6 pb-3 border-b">
                ตารางการอบรม 5 วัน
              </h3>
              <ScheduleTable schedule={courseSchedule} />
              
              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-futsal-navy">หมายเหตุ:</h4>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• ผู้เข้าอบรมต้องเข้าร่วมครบทุกช่วงเวลา (ไม่น้อยกว่า 80%)</li>
                    <li>• ต้องผ่านการทดสอบทั้งภาคทฤษฎีและภาคปฏิบัติ</li>
                    <li>• เตรียมชุดกีฬาสำหรับการฝึกภาคปฏิบัติทุกวัน</li>
                  </ul>
                </div>
                <div>
                  <Badge className="bg-futsal-blue mr-2">ทฤษฎี</Badge>
                  <Badge className="bg-futsal-green mr-2">ปฏิบัติ</Badge>
                  <Badge className="bg-futsal-navy mr-2">กลุ่ม</Badge>
                  <Badge className="bg-futsal-orange">ทดสอบ</Badge>
                </div>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="instructors" className="mt-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: activeTab === "instructors" ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-futsal-navy mb-6">
                ทีมวิทยากรผู้เชี่ยวชาญ
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {instructors.map((instructor, index) => (
                  <InstructorCard key={index} instructor={instructor} index={index} />
                ))}
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="benefits" className="mt-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: activeTab === "benefits" ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-2xl font-bold text-futsal-navy mb-8 text-center">
                จุดเด่นของหลักสูตร SDN Futsal NO-L T-License
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
                  >
                    <div className="mb-4 flex justify-center">
                      {benefit.icon}
                    </div>
                    <h4 className="text-xl font-bold text-futsal-navy mb-3">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Button size="lg" className="bg-futsal-orange hover:bg-futsal-orange/90">
                  สมัครเข้ารับการอบรม
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
        
        <motion.div 
          className="bg-futsal-navy/95 rounded-xl p-8 mt-12 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-4">
                พัฒนาทักษะการโค้ชฟุตซอลของคุณกับหลักสูตรระดับมืออาชีพ
              </h3>
              <p className="text-white/80 mb-4">
                เข้าร่วมการอบรมโค้ชฟุตซอล T-License ที่จะช่วยยกระดับความรู้และทักษะการสอนของคุณ 
                เรียนรู้ทั้งทฤษฎีและปฏิบัติจากผู้เชี่ยวชาญที่มีประสบการณ์ตรง
              </p>
              <div className="flex gap-3 mt-6">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-futsal-navy">
                  ดูรายละเอียดเพิ่มเติม
                </Button>
                <Button size="lg" className="bg-futsal-orange hover:bg-futsal-orange/90">
                  สมัครเลย
                </Button>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-40 h-40">
                <Image 
                  src="/img/sdn-futsal-logo.png" 
                  alt="SDN Futsal Logo" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}