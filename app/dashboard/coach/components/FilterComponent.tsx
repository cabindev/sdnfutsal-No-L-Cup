// app/dashboard/coach/components/FilterComponent.tsx
'use client'

import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllTrainingBatches } from "@/app/coach/actions/coach/get";

interface FilterComponentProps {
  defaultValue: string;
  defaultBatch?: string;
}

interface BatchOption {
  id: number;
  batchNumber: number;
  year: number;
  isActive: boolean;
}

export default function FilterComponent({ defaultValue, defaultBatch }: FilterComponentProps) {
  const router = useRouter();
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // โหลดข้อมูลรุ่นอบรมเมื่อ component ถูกโหลด
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setIsLoading(true);
        const result = await getAllTrainingBatches();
        
        if (result.success && result.data) {
          setBatches(result.data);
        } else {
          console.error('Failed to fetch batches:', result.error);
        }
      } catch (error) {
        console.error('Error in fetchBatches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBatches();
  }, []);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href);
    url.searchParams.set('status', e.target.value);
    url.searchParams.delete('page');
    router.push(url.toString());
  };
  
  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href);
    
    if (e.target.value === 'all') {
      url.searchParams.delete('batch');
    } else {
      url.searchParams.set('batch', e.target.value);
    }
    
    url.searchParams.delete('page');
    router.push(url.toString());
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center h-full">
        <Filter className="text-gray-400 h-4 w-4 mr-2" />
        <select
          name="status"
          defaultValue={defaultValue}
          onChange={handleStatusChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">สถานะทั้งหมด</option>
          <option value="pending">รอการอนุมัติ</option>
          <option value="approved">อนุมัติแล้ว</option>
        </select>
      </div>
      
      <div className="flex items-center h-full">
        <Filter className="text-gray-400 h-4 w-4 mr-2" />
        <select
          name="batch"
          defaultValue={defaultBatch || 'all'}
          onChange={handleBatchChange}
          disabled={isLoading}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">ทุกรุ่น</option>
          {batches.map(batch => (
            <option key={batch.id} value={batch.id.toString()}>
              รุ่นที่ {batch.batchNumber}/{batch.year} {!batch.isActive && '(ปิดแล้ว)'}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}