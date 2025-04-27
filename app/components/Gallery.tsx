// components/Gallery.tsx
'use client'
import React from "react";
import { useState } from "react";
import { Button } from "./ui/button";

const galleryImages = [
  {
    id: 1,
    src: "/gallery-1.jpg",
    category: "training",
    title: "ฝึกซ้อมทักษะพื้นฐาน",
  },
  {
    id: 2,
    src: "/gallery-2.jpg",
    category: "competition",
    title: "การแข่งขันรายการ SDN Cup",
  },
  {
    id: 3,
    src: "/gallery-3.jpg",
    category: "training",
    title: "ฝึกความแข็งแรงและความคล่องตัว",
  },
  {
    id: 4,
    src: "/gallery-4.jpg",
    category: "events",
    title: "กิจกรรมค่ายฝึกซ้อมประจำปี",
  },
  {
    id: 5,
    src: "/gallery-5.jpg",
    category: "competition",
    title: "นักเรียนคว้าแชมป์รายการระดับประเทศ",
  },
  {
    id: 6,
    src: "/gallery-6.jpg",
    category: "events",
    title: "งานเปิดตัวอคาเดมี่ใหม่",
  },
];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  
  const filteredImages = activeFilter === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter);

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-[#1a0c2b] to-[#100619]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            แกล<span className="text-futsal-gold">เลอรี่</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            ภาพกิจกรรมการฝึกซ้อม การแข่งขัน และความสำเร็จของนักเรียนในโครงการ
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {["all", "training", "competition", "events"].map((category) => (
            <Button 
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`${
                activeFilter === category 
                  ? "bg-futsal-gold text-futsal-dark" 
                  : "bg-white/10 text-white hover:bg-white/20"
              } rounded-full px-6`}
            >
              {category === "all" ? "ทั้งหมด" : 
               category === "training" ? "การฝึกซ้อม" :
               category === "competition" ? "การแข่งขัน" : "กิจกรรม"}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div 
              key={image.id} 
              className="relative h-72 rounded-lg overflow-hidden group cursor-pointer"
            >
              <img 
                src={image.src} 
                alt={image.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold text-white">{image.title}</h3>
                <p className="text-futsal-gold text-sm capitalize">
                  {image.category === "training" ? "การฝึกซ้อม" :
                   image.category === "competition" ? "การแข่งขัน" : "กิจกรรม"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-futsal-gold hover:bg-futsal-gold/90 text-futsal-dark text-lg px-8 py-6 h-auto rounded-md font-medium">
            ดูภาพกิจกรรมทั้งหมด
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;