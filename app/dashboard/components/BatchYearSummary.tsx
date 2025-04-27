// app/dashboard/components/BatchYearSummary.tsx
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";

interface BatchYearSummaryProps {
  yearlyBatches: Record<string, any[]>;
}

export default function BatchYearSummary({ yearlyBatches }: BatchYearSummaryProps) {
  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
        .map(([year, batches]) => (
          <div key={year} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <div className="flex items-center mb-3">
              <h3 className="text-md font-medium text-futsal-navy bg-gray-100 px-3 py-1 rounded-lg">
                ปี {year}
              </h3>
              <Badge className="ml-2 bg-futsal-blue/10 text-futsal-blue">
                {Array.isArray(batches) ? batches.length : 0} รุ่น
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.isArray(batches) && batches.map((batch) => (
                <Link 
                  key={batch.id} 
                  href={`/dashboard/coach/training/${batch.id}`}
                  className="p-3 border border-gray-100 rounded-lg hover:border-futsal-orange/50 hover:bg-orange-50/30 transition-all flex items-center gap-3 group"
                >
                  <div className="bg-futsal-orange/10 h-10 w-10 rounded-full flex items-center justify-center text-futsal-orange font-medium">
                    {batch.batchNumber}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 group-hover:text-futsal-orange transition-colors">
                      รุ่นที่ {batch.batchNumber}/{batch.year}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                    </div>
                  </div>
                  <div>
                    <Badge className={
                      batch.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : new Date(batch.endDate) < new Date() 
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-amber-100 text-amber-800'
                    }>
                      {batch.isActive 
                        ? 'เปิดรับสมัคร' 
                        : new Date(batch.endDate) < new Date() 
                          ? 'เสร็จสิ้นแล้ว'
                          : 'ปิดรับสมัคร'
                      }
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}