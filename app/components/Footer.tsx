// components/Footer.tsx
'use client'
import React from "react";
import { Facebook, Instagram, Youtube, Twitter, MapPin, Phone, Mail, ChevronRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-futsal-dark text-white">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <span className="text-futsal-blue font-prompt font-bold text-3xl">SDN</span>
              <span className="text-futsal-orange font-prompt font-bold text-3xl">FUTSAL</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              โรงเรียนสอนฟุตซอลระดับมืออาชีพสำหรับเยาวชน มุ่งมั่นพัฒนาทักษะกีฬาและสร้างนักกีฬาที่มีคุณภาพพร้อมก้าวสู่การแข่งขันระดับสูง
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/sdnfutsalNoL" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-futsal-blue transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-futsal-blue transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-futsal-blue transition-colors"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-futsal-blue transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-futsal-orange relative pl-4 border-l-4 border-futsal-orange">เมนูหลัก</h3>
            <ul className="space-y-3">
              {["หน้าแรก", "โค้ช", "ตารางฝึกซ้อม", "แกลเลอรี่", "ติดต่อ"].map((item, index) => (
                <li key={index}>
                  <a href={`#${["home", "coaches", "training", "gallery", "contact"][index]}`} className="text-gray-300 hover:text-white transition-colors flex items-center">
                    <ChevronRight size={16} className="text-futsal-orange mr-2" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-futsal-orange relative pl-4 border-l-4 border-futsal-orange">หลักสูตร</h3>
            <ul className="space-y-3">
              {["หลักสูตรเริ่มต้น (อายุ 7-9 ปี)", "หลักสูตรพัฒนา (อายุ 10-12 ปี)", "หลักสูตรแข่งขัน (อายุ 13-15 ปี)", "ค่ายฝึกซ้อมประจำปี", "คลินิกฝึกทักษะ"].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                    <ChevronRight size={16} className="text-futsal-orange mr-2" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-futsal-orange relative pl-4 border-l-4 border-futsal-orange">ติดต่อ</h3>
            <address className="not-italic text-gray-300 space-y-4">
              <div className="flex items-start">
                <MapPin size={20} className="text-futsal-orange mr-3 mt-1 flex-shrink-0" />
                <p>SDN Futsal Arena<br />123 ถ.พหลโยธิน แขวงจตุจักร<br />เขตจตุจักร กรุงเทพฯ 10900</p>
              </div>
              <div className="flex items-center">
                <Phone size={20} className="text-futsal-orange mr-3 flex-shrink-0" />
                <p>062-123-4567</p>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="text-futsal-orange mr-3 flex-shrink-0" />
                <p>info@sdnfutsal.com</p>
              </div>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} SDN Futsal Academy. สงวนลิขสิทธิ์</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-white transition-colors">เงื่อนไขการใช้บริการ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;