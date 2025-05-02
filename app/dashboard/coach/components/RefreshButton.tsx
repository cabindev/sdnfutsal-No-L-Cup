// app/dashboard/coach/components/RefreshButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function RefreshButton() {
  const router = useRouter();
  
  return (
    <Button 
      onClick={() => router.refresh()}
      variant="outline"
      size="sm"
      className="ml-2"
    >
      <RefreshCw className="h-4 w-4 mr-1" />
      รีเฟรชข้อมูล
    </Button>
  );
}