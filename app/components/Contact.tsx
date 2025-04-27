// components/Contact.tsx
'use client'
import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-[#100619]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ติดต่อ<span className="text-futsal-gold">เรา</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            สอบถามข้อมูลเพิ่มเติมหรือลงทะเบียนเข้าร่วมโครงการ SDN Futsal ได้ตามช่องทางด้านล่าง
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">ส่งข้อความถึงเรา</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 h-12"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="อีเมล"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 h-12"
                  />
                </div>
              </div>
              <div>
                <Input
                  type="tel"
                  placeholder="เบอร์โทรศัพท์"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50 h-12"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="หัวข้อ"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50 h-12"
                />
              </div>
              <div>
                <Textarea
                  placeholder="ข้อความ"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50 min-h-[150px]"
                />
              </div>
              <Button className="bg-futsal-gold hover:bg-futsal-gold/90 text-futsal-dark w-full py-6 h-auto text-lg font-medium">
                ส่งข้อความ
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white">ข้อมูลติดต่อ</h3>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <MapPin size={24} className="text-futsal-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-medium mb-1">ที่อยู่</h4>
                  <p className="text-white/70">SDN Futsal Arena, 123 ถ.พหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone size={24} className="text-futsal-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-medium mb-1">โทรศัพท์</h4>
                  <p className="text-white/70">062-123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Mail size={24} className="text-futsal-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-medium mb-1">อีเมล</h4>
                  <p className="text-white/70">info@sdnfutsal.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock size={24} className="text-futsal-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-medium mb-1">เวลาทำการ</h4>
                  <p className="text-white/70">วันจันทร์ - วันศุกร์: 10:00 - 20:00 น.</p>
                  <p className="text-white/70">วันเสาร์ - วันอาทิตย์: 09:00 - 18:00 น.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-4">ติดตามเรา</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/sdnfutsalNoL" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-futsal-blue transition-colors"
                >
                  <Facebook size={24} className="text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-futsal-blue transition-colors"
                >
                  <Instagram size={24} className="text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-futsal-blue transition-colors"
                >
                  <Youtube size={24} className="text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-futsal-blue transition-colors"
                >
                  <Twitter size={24} className="text-white" />
                </a>
              </div>
            </div>
            
            <div className="h-72 rounded-xl overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.2089025281414!2d100.56130311499086!3d13.79988180015837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQ3JzU5LjYiTiAxMDDCsDMzJzQ2LjciRQ!5e0!3m2!1sen!2sth!4v1618456340321!5m2!1sen!2sth" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="SDN Futsal Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;