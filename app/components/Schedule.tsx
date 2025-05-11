// components/Schedule.tsx
"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Download, Info, Trophy, BookOpen, Award } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/taps";
import { Badge } from "@/app/components/ui/badge";

// ข้อมูลจาก PDF
const scheduleData = [
  {
    day: "Day 1",
    sessions: [
      { 
        time: "8.00AM - 10.00AM", 
        title: "Opening Ceremony, FA/AFC Education M&P, History of Futsal, Game Structure Segmentation, Log Book", 
        type: "ทฤษฎี" 
      },
      { 
        time: "10.00AM - 12.00PM", 
        title: "Warm Up & Cool Down, Basic-Ball Feeling, Basic-Control & Turning, Basic-Passing & Support (VDO, Animation)", 
        type: "ทฤษฎี" 
      },
      { 
        time: "2.00PM - 3.30PM", 
        title: "Warm Up & Cool Down, Basic-Ball Feeling, Basic-Control & Turning, Basic-Passing & Support", 
        type: "ปฏิบัติ" 
      },
      { 
        time: "4.00PM - 6.00PM", 
        title: "Basic-Control & Turning, Basic-Passing & Support", 
        type: "ปฏิบัติ" 
      },
      { 
        time: "6.30PM - 9.00PM", 
        title: "Day 1 Review & Discussion, Homework", 
        type: "กลุ่ม" 
      }
    ]
  },
  {
    day: "Day 2",
    sessions: [
      { 
        time: "8.00AM - 10.00AM", 
        title: "Criteria for Age Group Training 6-18, Planning an Effective Training, Futsal Law of The Game", 
        type: "ทฤษฎี" 
      },
      { 
        time: "10.00AM - 12.00PM", 
        title: "Basic-Dribbling pass Opponent, Basic-Shooting, System & Style, Basic-Individual Attacking Tactical (VDO, Animation)", 
        type: "ทฤษฎี" 
      },
      { 
        time: "2.00PM - 3.30PM", 
        title: "Basic-Dribbling pass Opponent, Basic-Shooting", 
        type: "ปฏิบัติ" 
      },
      { 
        time: "4.00PM - 6.00PM", 
        title: "Basic-System & Style, Basic-Individual Attacking Tactical", 
        type: "ปฏิบัติ" 
      },
      { 
        time: "6.30PM - 9.00PM", 
        title: "วิทยาศาสตร์การกีฬาและเวชศาสตร์การกีฬา โดย ดร.อัชรัฐ ยงทวี, อาจารย์ณัฐวี แสงอรุณ", 
        type: "กลุ่ม" 
      }
    ]
  },
  {
    day: "Day 3",
    sessions: [
      { 
        time: "8.00AM - 10.00AM", 
        title: "Futsal Player Qualifications, Coaching Process, Futsal Fitness for Youth, Goal Setting Principles & Motivation", 
        type: "ทฤษฎี" 
      },
      { 
        time: "10.00AM - 12.00PM", 
        title: "Basic-Defensive Technique (1st,2nd,3rd,4th Defender), Basic-Type of Defense (Man to Man, Alternative,Zone,Mix) (VDO, Animation)", 
        type: "ทฤษฎี" 
      },
      { 
        time: "2.00PM - 3.30PM", 
        title: "Basic-Defensive Technique (1st,2nd,3rd,4th Defender)", 
        type: "ปฏิบัติ" 
      },
      { 
        time: "4.00PM - 6.00PM", 
        title: "Basic-Type of Defense (Man to Man, Alternative,Zone,Mix)", 
        type: "ปฏิบัติ" 
      },
      { 
        time: "6.30PM - 9.00PM", 
        title: "Day 1 Review & Discussion, Group Presentation (20-40), Homework", 
        type: "กลุ่ม" 
      }
    ]
  },
  {
    day: "Day 4",
    sessions: [
      { 
        time: "8.00AM - 10.00AM", 
        title: "Requirements to Be a Successful Coach, Coaching Method, Twelve Main Order For Futsal Players", 
        type: "ทฤษฎี" 
      },
      { 
        time: "10.00AM - 12.00PM", 
        title: "Basic-Goalkeeping Technique (VDO, Animation)", 
        type: "ทฤษฎี" 
      },
      { 
        time: "2.00PM - 3.30PM", 
        title: "Theory Exam", 
        type: "ทดสอบ" 
      },
      { 
        time: "4.00PM - 6.00PM", 
        title: "Basic-Goalkeeping Technique", 
        type: "ปฏิบัติ" 
      },
      { 
        time: "6.30PM - 9.00PM", 
        title: "จิตวิทยาการกีฬาสำหรับเด็ก โดย ดร.ฉัตรกมล สิงห์น้อย", 
        type: "กลุ่ม" 
      }
    ]
  },
  {
    day: "Day 5",
    sessions: [
      { 
        time: "8.00AM - 10.00AM", 
        title: "Practical Assessment 1", 
        type: "ทดสอบ" 
      },
      { 
        time: "10.00AM - 12.00PM", 
        title: "Practical Assessment 1", 
        type: "ทดสอบ" 
      },
      { 
        time: "2.00PM - 3.30PM", 
        title: "Practical Assessment 1", 
        type: "ทดสอบ" 
      },
      { 
        time: "4.00PM - 6.00PM", 
        title: "Closing Ceremony", 
        type: "พิธีการ" 
      }
    ]
  }
];

const instructors = [
  "นายบุญเลิศ เจริญวงศ์",
  "นายมานะ ชื่นเอี่ยม",
  "นางธัชชนก เจริญวงศ์", 
  "นายโชติวุฒิ บุญยะพุกกะนะ", 
  "นายสัมพันธ์ คำคม", 
  "ดร.ฉัตรกมล สิงห์น้อย", 
  "ดร.อัชรัฐ ยงทวี", 
  "นางณัฐวี แสงอรุณ"
];

// คุณสมบัติผู้เข้าร่วม
const qualifications = [
  "อายุตั้งแต่ 18 ปีขึ้นไป",
  "มีพื้นฐานความเข้าใจกีฬาฟุตซอล",
  "มีความสนใจในการเป็นผู้ฝึกสอน",
  "สามารถเข้าร่วมการอบรมได้ตลอดทั้ง 5 วัน",
  "สุขภาพร่างกายแข็งแรง สามารถเข้าร่วมกิจกรรมภาคปฏิบัติได้"
];

// ประโยชน์ที่จะได้รับ
const benefits = [
  "ได้รับใบประกาศนียบัตร T-License ที่ได้รับการยอมรับในวงการกีฬาฟุตซอล",
  "ได้รับความรู้ทั้งภาคทฤษฎีและปฏิบัติจากผู้เชี่ยวชาญโดยตรง",
  "เครือข่ายผู้ฝึกสอนฟุตซอลทั่วประเทศ",
  "โอกาสในการพัฒนาตนเองสู่ระดับโค้ชอาชีพ",
  "ความรู้ด้านวิทยาศาสตร์การกีฬาและจิตวิทยาการกีฬา"
];

// ส่วนแสดงตารางเรียน
const ScheduleTable = ({ day }: { day: string }) => {
  const selectedDay = scheduleData.find(d => d.day === day);
  
  if (!selectedDay) return null;
  
  return (
    <div className="overflow-x-auto rounded-xl shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-futsal-navy">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              เวลา
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              กิจกรรม
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-24">
              ประเภท
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {selectedDay.sessions.map((session, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-futsal-orange mr-2" />
                  {session.time}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-800">
                {session.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Badge variant={
                  session.type === "ทฤษฎี" ? "futsal-blue" : 
                  session.type === "ปฏิบัติ" ? "futsal-green" : 
                  session.type === "ทดสอบ" ? "futsal-orange" : 
                  session.type === "กลุ่ม" ? "futsal-navy" : 
                  "default"
                }>
                  {session.type}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState("Day 1");
  const [activeTab, setActiveTab] = useState("schedule");
  
  // ฟังก์ชันดาวน์โหลด PDF
  const handleDownloadPDF = () => {
    // ดาวน์โหลดไฟล์ PDF จาก /images/Schedule.pdf
    const link = document.createElement('a');
    link.href = '/images/Schedule.pdf';
    link.setAttribute('download', 'SDN_Futsal_NO-L_T-License_2025_Schedule.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

// ฟังก์ชันเปลี่ยนแท็บและอัพเดทสถานะ
const handleTabChange = (value: string) => {
  setActiveTab(value);
};

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* หัวข้อหลัก */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <div className="absolute inset-x-0 -top-40 h-40 bg-futsal-navy/10 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-futsal-navy inline-block pb-2 border-b-4 border-futsal-orange">
                SDN Futsal NO-L <span className="text-futsal-orange">T-License 2025</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
                หลักสูตรอบรมผู้ฝึกสอนฟุตซอลระดับ T-License คุณภาพสูง ครบถ้วนทั้งภาคทฤษฎีและปฏิบัติ
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleDownloadPDF}
            className="mt-6 bg-futsal-navy hover:bg-futsal-navy/90 text-white"
          >
            <Download className="w-5 h-5 mr-2" />
            ดาวน์โหลดตารางการอบรม PDF
          </Button>
        </motion.div>

        {/* แท็บคอนเทนต์แบบใหม่ */}
        <div className="mb-12">
          {/* แถบแท็บแบบใหม่ */}
          <div className="flex bg-[#f8fafc] rounded-t-2xl border border-gray-200 overflow-hidden">
            <button 
              onClick={() => handleTabChange("schedule")}
              className={`flex-1 py-5 px-8 text-base font-semibold flex items-center justify-center transition-all ${
                activeTab === "schedule" 
                  ? "text-[#2c2f72] border-b-3 border-futsal-orange bg-white" 
                  : "text-gray-500 hover:text-gray-800 hover:bg-white/80"
              }`}
            >
              <Calendar className={`w-5 h-5 mr-3 ${activeTab === "schedule" ? "text-futsal-orange" : "text-gray-400"}`} />
              <span className="tracking-wide uppercase">TRAINING SCHEDULE</span>
            </button>
            
            <button 
              onClick={() => handleTabChange("requirements")}
              className={`flex-1 py-5 px-8 text-base font-semibold flex items-center justify-center transition-all ${
                activeTab === "requirements" 
                  ? "text-[#2c2f72] border-b-3 border-futsal-orange bg-white" 
                  : "text-gray-500 hover:text-gray-800 hover:bg-white/80"
              }`}
            >
              <Award className={`w-5 h-5 mr-3 ${activeTab === "requirements" ? "text-futsal-orange" : "text-gray-400"}`} />
              <span className="tracking-wide uppercase">QUALIFICATIONS</span>
            </button>
            
            <button 
              onClick={() => handleTabChange("instructors")}
              className={`flex-1 py-5 px-8 text-base font-semibold flex items-center justify-center transition-all ${
                activeTab === "instructors" 
                  ? "text-[#2c2f72] border-b-3 border-futsal-orange bg-white" 
                  : "text-gray-500 hover:text-gray-800 hover:bg-white/80"
              }`}
            >
              <Trophy className={`w-5 h-5 mr-3 ${activeTab === "instructors" ? "text-futsal-orange" : "text-gray-400"}`} />
              <span className="tracking-wide uppercase">INSTRUCTORS</span>
            </button>
          </div>
          
          {/* เนื้อหาแท็บ */}
          <div className="bg-white rounded-b-2xl shadow-lg border-x border-b border-gray-200">
            {/* ตารางการอบรม */}
            {activeTab === "schedule" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-futsal-navy hidden md:block">
  ตารางการอบรม 5 วัน
</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="futsal-blue">ทฤษฎี</Badge>
                    <Badge variant="futsal-green">ปฏิบัติ</Badge>
                    <Badge variant="futsal-orange">ทดสอบ</Badge>
                    <Badge variant="futsal-navy">กลุ่ม</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {scheduleData.map((day, index) => (
                    <Button
                      key={index}
                      variant={selectedDay === day.day ? "default" : "outline"}
                      className={selectedDay === day.day ? "bg-futsal-orange hover:bg-futsal-orange/90" : "border-futsal-navy/20"}
                      onClick={() => setSelectedDay(day.day)}
                    >
                      {day.day}
                    </Button>
                  ))}
                </div>
                
                <ScheduleTable day={selectedDay} />
                
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-start gap-2 text-gray-600">
                    <Info className="w-5 h-5 text-futsal-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">หมายเหตุ:</p>
                      <ul className="mt-1 space-y-1 list-disc ml-4">
                        <li>ตารางอาจมีการเปลี่ยนแปลงตามความเหมาะสม</li>
                        <li>ผู้เข้าอบรมต้องมีเวลาเข้าร่วมไม่น้อยกว่า 80%</li>
                        <li>การสอบภาคปฏิบัติจะพิจารณาจากทักษะและความเข้าใจโดยรวม</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* คุณสมบัติผู้เข้าอบรม */}
            {activeTab === "requirements" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6"
              >
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-futsal-navy mb-4 flex items-center border-b pb-2">
                    <Award className="w-6 h-6 text-futsal-orange mr-2" />
                    คุณสมบัติผู้เข้าร่วมการอบรม
                  </h3>
                  
                  <ul className="space-y-3">
                    {qualifications.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-gradient-to-br from-futsal-orange to-futsal-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5 mr-3">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-gray-600 italic text-sm">
                      * ไม่จำเป็นต้องมีประสบการณ์การเป็นผู้ฝึกสอนมาก่อน เหมาะสำหรับผู้ที่ต้องการเริ่มต้นเป็นโค้ช
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-futsal-navy mb-4 flex items-center border-b pb-2">
                    <BookOpen className="w-6 h-6 text-futsal-orange mr-2" />
                    ประโยชน์ที่จะได้รับ
                  </h3>
                  
                  <ul className="space-y-3">
                    {benefits.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="text-futsal-orange mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
            
            {/* วิทยากร */}
            {activeTab === "instructors" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <h3 className="text-2xl font-bold text-futsal-navy mb-6 pb-2 border-b border-gray-200">
                  ทีมวิทยากรผู้เชี่ยวชาญ
                </h3>
                
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-futsal-navy to-futsal-blue text-white">
                    <h4 className="text-xl font-bold">วิทยากรหลักสูตร SDN Futsal NO-L T-License 2025</h4>
                    <p className="mt-2 text-white/90">
                      ทีมวิทยากรผู้มีประสบการณ์ในวงการฟุตซอลระดับประเทศ พร้อมถ่ายทอดความรู้ทั้งทฤษฎีและปฏิบัติ
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6">
                    {instructors.map((instructor, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-futsal-orange/20 to-futsal-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-futsal-orange" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h5 className="text-center font-medium text-futsal-navy">{instructor}</h5>
                        <p className="text-center text-sm text-gray-500 mt-1">วิทยากร</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-gray-50 border-t">
                    <p className="text-center text-gray-600">
                      วิทยากรอาจมีการเปลี่ยนแปลงตามความเหมาะสม โดยไม่กระทบต่อคุณภาพการอบรม
                    </p>
                  </div>
                </div>
                
                {/* ข้อมูลเพิ่มเติม */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-futsal-orange/10 to-futsal-gold/10 rounded-full flex items-center justify-center mb-3">
                      <Trophy className="w-8 h-8 text-futsal-orange" />
                    </div>
                    <h4 className="text-lg font-semibold text-futsal-navy text-center">ประสบการณ์ระดับสูง</h4>
                    <p className="text-center text-gray-600 mt-2">
                      วิทยากรมีประสบการณ์การสอนและการแข่งขันระดับชาติและนานาชาติ
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-futsal-orange/10 to-futsal-gold/10 rounded-full flex items-center justify-center mb-3">
                      <BookOpen className="w-8 h-8 text-futsal-orange" />
                    </div>
                    <h4 className="text-lg font-semibold text-futsal-navy text-center">ความรู้ทั้งทฤษฎีและปฏิบัติ</h4>
                    <p className="text-center text-gray-600 mt-2">
                      หลักสูตรออกแบบให้ครอบคลุมทั้งภาคทฤษฎีและปฏิบัติอย่างสมดุล
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-futsal-orange/10 to-futsal-gold/10 rounded-full flex items-center justify-center mb-3">
                      <Users className="w-8 h-8 text-futsal-orange" />
                    </div>
                    <h4 className="text-lg font-semibold text-futsal-navy text-center">การดูแลผู้เรียนอย่างใกล้ชิด</h4>
                    <p className="text-center text-gray-600 mt-2">
                      จำกัดจำนวนผู้เข้าอบรมต่อรุ่น เพื่อการดูแลอย่างทั่วถึงและมีคุณภาพ
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* ส่วน Tabs ซ่อนไว้เพื่อจัดการ state ถ้าจำเป็น */}
        <div className="hidden">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
             <TabsTrigger value="requirements">Requirements</TabsTrigger>
             <TabsTrigger value="instructors">Instructors</TabsTrigger>
           </TabsList>
         </Tabs>
       </div>
       
       {/* CTA Section */}
       <motion.div 
         className="mt-12 bg-gradient-to-r from-futsal-navy to-futsal-blue rounded-xl overflow-hidden shadow-xl"
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         viewport={{ once: true }}
       >
         <div className="relative">
           <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20 pattern-dots pattern-blue-500 pattern-bg-white pattern-size-4 pattern-opacity-10"></div>
           
           <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center">
             <div className="w-full">
               <h2 className="text-3xl font-bold text-white mb-3 text-center">
                 ELEVATE YOUR COACHING CAREER
               </h2>
               <p className="text-white/90 text-lg text-center">
                 เริ่มต้นเส้นทางการเป็นโค้ชฟุตซอลมืออาชีพกับหลักสูตร T-License ที่ได้รับการยอมรับในวงการกีฬาฟุตซอล
               </p>
             </div>
           </div>
         </div>
       </motion.div>
     </div>
   </section>
 );
}