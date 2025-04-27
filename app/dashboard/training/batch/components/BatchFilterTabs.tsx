// app/dashboard/training/batch/components/BatchFilterTabs.tsx
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

interface BatchFilterTabsProps {
  currentFilter: string;
}

export default function BatchFilterTabs({ currentFilter }: BatchFilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Link href="/dashboard/training/batch">
        <Button 
          variant={currentFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          className={currentFilter === 'all' ? 'bg-futsal-navy' : ''}
        >
          ทั้งหมด
        </Button>
      </Link>
      <Link href="/dashboard/training/batch?filter=active">
        <Button 
          variant={currentFilter === 'active' ? 'default' : 'outline'}
          size="sm"
          className={currentFilter === 'active' ? 'bg-futsal-green' : ''}
        >
          เปิดรับสมัคร
        </Button>
      </Link>
      <Link href="/dashboard/training/batch?filter=upcoming">
        <Button 
          variant={currentFilter === 'upcoming' ? 'default' : 'outline'}
          size="sm"
          className={currentFilter === 'upcoming' ? 'bg-futsal-orange' : ''}
        >
          กำลังจะมาถึง
        </Button>
      </Link>
      <Link href="/dashboard/training/batch?filter=past">
        <Button 
          variant={currentFilter === 'past' ? 'default' : 'outline'}
          size="sm"
          className={currentFilter === 'past' ? 'bg-gray-600' : ''}
        >
          ผ่านไปแล้ว
        </Button>
      </Link>
      <Link href="/dashboard/training/batch?filter=inactive">
        <Button 
          variant={currentFilter === 'inactive' ? 'default' : 'outline'}
          size="sm"
          className={currentFilter === 'inactive' ? 'bg-red-600' : ''}
        >
          ปิดรับสมัคร
        </Button>
      </Link>
    </div>
  );
}