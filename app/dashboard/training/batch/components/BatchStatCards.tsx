// app/dashboard/training/batch/components/BatchStatCards.tsx
import { Card, CardContent } from "@/app/components/ui/card";
import { Calendar, Users, CheckCircle, Calendar as CalendarIcon } from "lucide-react";

interface BatchStatsProps {
  stats: {
    total: number;
    active: number;
    upcoming: number;
    participants: number;
  };
}

export default function BatchStatCards({ stats }: BatchStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-futsal-blue/10 to-futsal-navy/5 border-futsal-blue/20">
        <CardContent className="p-4 flex items-center">
          <div className="bg-futsal-blue/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
            <Calendar className="h-6 w-6 text-futsal-blue" />
          </div>
          <div>
            <p className="text-sm text-gray-500">รุ่นอบรมทั้งหมด</p>
            <h3 className="text-2xl font-bold text-futsal-navy">{stats.total}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-futsal-green/10 to-futsal-green/5 border-futsal-green/20">
        <CardContent className="p-4 flex items-center">
          <div className="bg-futsal-green/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
            <CheckCircle className="h-6 w-6 text-futsal-green" />
          </div>
          <div>
            <p className="text-sm text-gray-500">รุ่นที่เปิดรับสมัคร</p>
            <h3 className="text-2xl font-bold text-futsal-green">{stats.active}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-futsal-orange/10 to-futsal-orange/5 border-futsal-orange/20">
        <CardContent className="p-4 flex items-center">
          <div className="bg-futsal-orange/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
            <CalendarIcon className="h-6 w-6 text-futsal-orange" />
          </div>
          <div>
            <p className="text-sm text-gray-500">รุ่นที่กำลังจะมาถึง</p>
            <h3 className="text-2xl font-bold text-futsal-orange">{stats.upcoming}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
        <CardContent className="p-4 flex items-center">
          <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
            <Users className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">ผู้เข้าร่วมทั้งหมด</p>
            <h3 className="text-2xl font-bold text-purple-600">{stats.participants}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}