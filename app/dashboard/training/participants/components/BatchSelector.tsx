// app/dashboard/training/participants/components/BatchSelector.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Filter } from 'lucide-react';

interface Batch {
  id: number;
  batchNumber: number;
  year: number;
  _count: {
    participants: number;
  };
}

interface BatchSelectorProps {
  batches: Batch[];
  currentBatchId?: number;
  filter?: string;
  search?: string;
}

export function BatchSelector({ batches, currentBatchId, filter, search }: BatchSelectorProps) {
  const router = useRouter();
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    // สร้าง URL ใหม่
    const url = new URL(window.location.href);
    
    // ลบพารามิเตอร์ batch ถ้าไม่ได้เลือกรุ่น
    if (!value) {
      url.searchParams.delete('batch');
    } else {
      url.searchParams.set('batch', value);
    }
    
    // คงค่า filter และ search เดิมไว้
    if (filter && filter !== 'all') {
      url.searchParams.set('filter', filter);
    }
    
    if (search) {
      url.searchParams.set('search', search);
    }
    
    // นำทางไปยัง URL ใหม่
    router.push(url.pathname + url.search);
  };

  return (
    <div className="relative">
      <select
        className="w-full md:w-48 h-10 pl-4 pr-8 rounded-md border border-input bg-background text-sm"
        onChange={handleChange}
        defaultValue={currentBatchId?.toString() || ''}
      >
        <option value="">ทุกรุ่นอบรม</option>
        {batches.map(batch => (
          <option key={batch.id} value={batch.id}>
            รุ่นที่ {batch.batchNumber}/{batch.year} ({batch._count.participants} คน)
          </option>
        ))}
      </select>
      <Filter className="h-4 w-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}