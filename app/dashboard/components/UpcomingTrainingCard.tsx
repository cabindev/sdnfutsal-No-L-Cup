// app/dashboard/components/UpcomingTrainingCard.tsx
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { CalendarDays, MapPin, Clock } from "lucide-react";

interface UpcomingTrainingCardProps {
  batches: any[] | null | undefined;
  calculatePercentage: (current: number, total: number) => number;
}

export default function UpcomingTrainingCard({ batches, calculatePercentage }: UpcomingTrainingCardProps) {
  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString: string | Date | undefined | null) => {
    if (!dateString) return 'ไม่ระบุ';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'ไม่ระบุ';
    }
  };

  if (!Array.isArray(batches) || batches.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-12 w-12 mx-auto text-gray-300 mb-2" />
        <p>ไม่มีการอบรมที่กำลังจะมาถึง</p>
      </div>
    );
  }

  // ตรวจสอบและกรองเฉพาะข้อมูลที่ถูกต้อง
  const validBatches = batches.filter(batch => 
    batch && typeof batch === 'object' && batch.id !== undefined
  );

  if (validBatches.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-12 w-12 mx-auto text-gray-300 mb-2" />
        <p>ไม่พบข้อมูลการอบรมที่ถูกต้อง</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {validBatches.map((batch) => {
        // ตั้งค่าค่าเริ่มต้นเพื่อป้องกันข้อมูลที่ขาดหายไป
        const participants = batch._count?.participants || 0;
        const maxParticipants = batch.maxParticipants || 30; // ค่าเริ่มต้นหากไม่มีข้อมูล
        const percentage = calculatePercentage(participants, maxParticipants);
        const batchNumber = batch.batchNumber || '?';
        const year = batch.year || (new Date()).getFullYear();
        const location = batch.location || 'ไม่ระบุสถานที่';
        const isActive = !!batch.isActive;
        
        return (
          <div key={batch.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-futsal-orange/50 transition-colors group">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-3 md:mb-0">
                <Badge className={isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {isActive ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                </Badge>
                <h3 className="font-medium text-futsal-navy mt-2 group-hover:text-futsal-orange transition-colors">
                  รุ่นที่ {batchNumber}/{year}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <CalendarDays className="h-4 w-4 mr-1.5 text-futsal-orange/70" />
                  {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1.5 text-futsal-orange/70" />
                  {location}
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>ผู้สมัคร</span>
                    <span className="font-medium">{participants}/{maxParticipants}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        percentage >= 90 ? 'bg-red-500' :
                        percentage >= 70 ? 'bg-amber-500' :
                        'bg-futsal-orange'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <Link href={`/dashboard/coach/training/${batch.id}`}>
                  <Button 
                    variant="outline" 
                    className="w-full mt-3 border-futsal-orange/50 text-futsal-orange hover:bg-futsal-orange/5"
                  >
                    ดูรายละเอียด
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}