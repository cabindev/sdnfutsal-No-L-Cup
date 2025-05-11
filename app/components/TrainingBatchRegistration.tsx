// app/components/TrainingBatchRegistration.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { getActiveTrainingBatches, TrainingBatchWithCount, TrainingBatchesResponse } from '@/app/coach/actions/training-batch/get-active';
import { CalendarDays, MapPin, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';

export default function TrainingBatchRegistration() {
  const [batches, setBatches] = useState<TrainingBatchWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await getActiveTrainingBatches();
        
        if (response && response.success) {
          setBatches(response.data || []);
        }
      } catch (error) {
        console.error('Error loading training batches:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBatches();
  }, []);
  
  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDateRange = (start: string | Date, end: string | Date) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const thaiLocale = 'th-TH';
    
    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
      return `วันที่ ${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleDateString(thaiLocale, { month: 'long', year: 'numeric' })}`;
    } else {
      return `${startDate.toLocaleDateString(thaiLocale, options)} - ${endDate.toLocaleDateString(thaiLocale, options)}`;
    }
  };
  
  // คำนวณสถานะการลงทะเบียน
  const getRegistrationStatus = (batch: TrainingBatchWithCount) => {
    const registrationEnd = new Date(batch.registrationEndDate);
    const now = new Date();
    
    if (now > registrationEnd) {
      return {
        text: 'ปิดรับสมัคร',
        color: 'bg-gray-100 text-gray-600'
      };
    }
    
    const participantsCount = batch._count?.participants || 0;
    
    if (participantsCount >= batch.maxParticipants) {
      return {
        text: 'เต็มแล้ว',
        color: 'bg-red-100 text-red-600'
      };
    }
    
    return {
      text: 'เปิดรับสมัคร',
      color: 'bg-green-100 text-green-600'
    };
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" id="registration">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-futsal-navy">รุ่นการอบรมล่าสุด</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            เปิดรับสมัครโค้ชฟุตซอลรุ่นใหม่ประจำปี 2568 เพื่อพัฒนาศักยภาพของโค้ชและยกระดับมาตรฐานกีฬาฟุตซอลไทย
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-futsal-orange"></div>
          </div>
        ) : batches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {batches.map((batch) => {
              const status = getRegistrationStatus(batch);
              const participantsCount = batch._count?.participants || 0;
              const seatsRemaining = Math.max(0, batch.maxParticipants - participantsCount);
              const registrationPercentage = (participantsCount / batch.maxParticipants) * 100;
              
              return (
                <div 
                  key={batch.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl"
                >
                  <div className="bg-futsal-navy text-white p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">รุ่นที่ {batch.batchNumber}/{batch.year}</h3>
                      <Badge className={status.color + " mt-1"}>
                        {status.text}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-xs opacity-80">
                        {batch.batchNumber === 1 ? '13-17 มิถุนายน 2568' : '19-23 มิถุนายน 2568'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <CalendarDays className="h-5 w-5 text-futsal-orange mr-3" />
                        <span className="text-gray-700">{formatDateRange(batch.startDate, batch.endDate)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-futsal-orange mr-3" />
                        <span className="text-gray-700">{batch.location}</span>
                      </div>
                      
                      {/* สถานะการลงทะเบียน */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                          <Users className="h-4 w-4 text-futsal-orange mr-2" />
                          สถานะการลงทะเบียน
                        </h4>
                        
                        <div className="space-y-3">
                          {/* Progress bar แสดงจำนวนที่นั่ง */}
                          <div className="w-full">
                            <Progress 
                              value={registrationPercentage} 
                              className="h-2"
                              indicatorClassName={
                                registrationPercentage >= 90 ? "bg-red-500" : 
                                registrationPercentage >= 70 ? "bg-amber-500" : 
                                "bg-green-500"
                              }
                            />
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <div>
                              <span className="text-gray-700">ผู้สมัคร:</span> 
                              <span className="font-medium ml-1 text-futsal-navy">{participantsCount} คน</span>
                            </div>
                            <div>
                              <span className="text-gray-700">คงเหลือ:</span> 
                              <span className={`font-medium ml-1 ${seatsRemaining <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                                {seatsRemaining} ที่นั่ง
                              </span>
                            </div>
                          </div>
                          
                          {seatsRemaining <= 5 && seatsRemaining > 0 && (
                            <div className="text-xs text-amber-600 bg-amber-50 p-1.5 rounded border border-amber-100 flex items-center">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              <span>เหลือที่นั่งจำนวนจำกัด รีบสมัครด่วน!</span>
                            </div>
                          )}
                          
                          {seatsRemaining === 0 && (
                            <div className="text-xs text-red-600 bg-red-50 p-1.5 rounded border border-red-100 flex items-center">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              <span>ที่นั่งเต็มแล้ว กรุณาเลือกรุ่นอื่น</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <p className="text-gray-500 text-sm mb-4">
                        ปิดรับสมัคร: {new Date(batch.registrationEndDate).toLocaleDateString('th-TH', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      
                      <Button 
                        className="w-full group"
                        asChild
                        disabled={seatsRemaining === 0}
                      >
                        <Link href="/coach/register">
                          <span>
                            {seatsRemaining === 0 ? 'ที่นั่งเต็มแล้ว' : 'ลงทะเบียนเข้าร่วมอบรม'}
                          </span>
                          {seatsRemaining > 0 && (
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          )}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-xl font-medium text-gray-800 mb-2">ยังไม่มีรุ่นที่เปิดรับสมัคร</h3>
            <p className="text-gray-600">
              ขณะนี้ยังไม่มีรุ่นอบรมที่เปิดรับสมัคร โปรดติดตามข่าวสารเพิ่มเติมเร็วๆ นี้
            </p>
          </div>
        )}
        

      </div>
    </section>
  );
}