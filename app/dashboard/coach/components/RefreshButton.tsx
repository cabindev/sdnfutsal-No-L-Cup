// app/dashboard/coach/components/RefreshButton.tsx
'use client';

import { Button } from "@/app/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // รีเฟรชข้อมูล
    router.refresh();
    
    // หยุดการหมุนหลังจาก 1 วินาที
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleRefresh}
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      <span>รีเฟรช</span>
    </Button>
  );
}