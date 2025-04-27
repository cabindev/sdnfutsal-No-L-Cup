// app/dashboard/coach/components/ClientSearchFilter.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { getAllTrainingBatches } from '@/app/coach/actions/coach/get';

interface ClientSearchFilterProps {
  defaultStatus?: string;
  defaultSearch?: string;
  defaultBatch?: string; // เพิ่ม prop defaultBatch
}

export default function ClientSearchFilter({ 
  defaultStatus = 'all', 
  defaultSearch = '',
  defaultBatch = 'all' // เพิ่มค่าเริ่มต้น
}: ClientSearchFilterProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(defaultSearch);
  const [status, setStatus] = useState(defaultStatus);
  const [batch, setBatch] = useState(defaultBatch); // เพิ่ม state สำหรับเก็บค่า batch
  const [batches, setBatches] = useState<any[]>([]); // เพิ่ม state สำหรับเก็บรายการรุ่น
  const [isLoading, setIsLoading] = useState(false);
  
  // โหลดข้อมูลรุ่นอบรมเมื่อ component ถูกโหลด
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setIsLoading(true);
        // ถ้ามี function getAllTrainingBatches แล้ว ให้ใช้อันนี้
        const result = await getAllTrainingBatches();
        
        if (result.success && result.data) {
          setBatches(result.data);
        }
      } catch (error) {
        console.error('Error fetching batches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBatches();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // สร้าง query params
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    
    if (status !== 'all') {
      params.set('status', status);
    }
    
    if (batch !== 'all') {
      params.set('batch', batch);
    }
    
    // นำทางไปยัง URL ใหม่
    router.push(`/dashboard/coach${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาตามชื่อ, ชื่อเล่น, ทีม หรือเบอร์โทร"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 md:grid-cols-1 lg:grid-cols-2">
            <div className="flex items-center h-full">
              <Filter className="text-gray-400 h-4 w-4 mr-2" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">ทุกรุ่น</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    รุ่นที่ {b.batchNumber}/{b.year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <Button type="submit" className="w-full bg-futsal-orange hover:bg-futsal-orange/90">
              ค้นหา
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}