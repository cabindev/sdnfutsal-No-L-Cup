// app/dashboard/components/EnhancedBatchYearSummary.tsx
import Link from "next/link";
import { Calendar, Users } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";

interface EnhancedBatchYearSummaryProps {
  yearlyBatches: Record<string, any[]> | null | undefined;
}

export default function EnhancedBatchYearSummary({ yearlyBatches }: EnhancedBatchYearSummaryProps) {
  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString: string | Date) => {
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

  if (!yearlyBatches || typeof yearlyBatches !== 'object' || Object.keys(yearlyBatches).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
        <p>ยังไม่มีข้อมูลการอบรม</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(yearlyBatches)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
        .map(([year, batches]) => {
          // ตรวจสอบความถูกต้องของข้อมูล batches
          if (!Array.isArray(batches) || batches.length === 0) {
            return null;
          }
          
          // คำนวณสถิติสรุปสำหรับแต่ละปี
          const totalBatches = batches.length;
          let totalParticipants = 0;
          
          batches.forEach(batch => {
            // ตรวจสอบค่า participants จาก _count
            const participants = batch?._count?.participants || 0;
            totalParticipants += participants;
          });
          
          return (
            <div key={year} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <div className="flex items-center">
                  <h3 className="text-md font-medium text-futsal-navy bg-gray-100 px-3 py-1 rounded-lg">
                    ปี {year}
                  </h3>
                  <Badge className="ml-2 bg-futsal-blue/10 text-futsal-blue">
                    {totalBatches} รุ่น
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-2 sm:mt-0">
                  <div className="bg-gray-100 px-3 py-1 rounded-lg flex items-center">
                    <Users className="h-4 w-4 text-futsal-orange mr-1.5" />
                    <span className="text-sm">ผู้เข้าอบรมรวม: <strong>{totalParticipants}</strong> คน</span>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        รุ่นที่
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        วันที่
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        สถานที่
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        สถานะ
                      </th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ผู้เข้าอบรม
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {batches.map((batch) => {
                      // ตรวจสอบโครงสร้างข้อมูล batch
                      if (!batch || typeof batch !== 'object' || batch.id === undefined) {
                        return null;
                      }
                      
                      const participants = batch._count?.participants || 0;
                      
                      return (
                        <tr key={batch.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            <Link 
                              href={`/dashboard/coach/training/${batch.id}`}
                              className="text-futsal-blue hover:text-futsal-orange"
                            >
                              รุ่นที่ {batch.batchNumber || '?'}/{batch.year || year}
                            </Link>
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-600">
                            {batch.startDate && batch.endDate ? 
                              `${formatDate(batch.startDate)} - ${formatDate(batch.endDate)}` : 
                              'ไม่ระบุ'}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-600">
                            {batch.location || 'ไม่ระบุ'}
                          </td>
                          <td className="px-3 py-2">
                            <Badge className={
                              batch.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : batch.endDate && new Date(batch.endDate) < new Date() 
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-amber-100 text-amber-800'
                            }>
                              {batch.isActive 
                                ? 'เปิดรับสมัคร' 
                                : batch.endDate && new Date(batch.endDate) < new Date() 
                                  ? 'เสร็จสิ้นแล้ว'
                                  : 'ปิดรับสมัคร'
                              }
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 font-medium">
                            {participants} คน
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-sm font-medium text-gray-700 text-right">
                        รวมทั้งหมด:
                      </td>
                      <td className="px-3 py-2 text-sm font-medium text-futsal-navy">
                        {totalParticipants} คน
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          );
        })}
    </div>
  );
}