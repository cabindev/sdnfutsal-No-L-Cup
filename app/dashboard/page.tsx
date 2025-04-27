// app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import authOptions from "../lib/configs/auth/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "../lib/db";
import { 
  CalendarDays, 
  Users, 
  Award, 
  Clipboard, 
  Calendar,
  User,
  Star,
  BarChart4
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { getCoachStats, getUpcomingBatches, getTrainingBatchesByYear } from "@/app/coach/actions/coach/get";
import StatisticsOverview from "./components/StatisticsOverview";
import UpcomingTrainingCard from "./components/UpcomingTrainingCard";
import EnhancedCoachExperienceChart from "./components/charts/EnhancedCoachExperienceChart";
import GenderDistributionChart from "./components/charts/GenderDistributionChart";
import CoachStatusChart from "./components/charts/CoachStatusChart";
import BatchYearBarChart from "./components/charts/BatchYearBarChart";

export default async function DashboardPage() {
  // ตรวจสอบ session ของผู้ใช้
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  // ดึงข้อมูลสถิติของโค้ชและข้อมูลอบรม - กำหนดค่าเริ่มต้นเป็นโครงสร้างข้อมูลว่าง
  let coachStats = {
    totalCoaches: 0,
    activeTrainings: 0,
    monthlyRegistrations: 0,
    totalParticipants: 0
  };
  
  let upcomingBatches: any[] = [];
  let yearlyBatches: Record<string, any[]> = {};

  try {
    // ดึงข้อมูลจริงจากฐานข้อมูล
    const coachStatsResult = await getCoachStats();
    const upcomingBatchesResult = await getUpcomingBatches(3);
    const yearlyBatchesResult = await getTrainingBatchesByYear();
    
    // แปลงข้อมูลให้ใช้งานได้ด้วยการตรวจสอบและกำหนดค่าเริ่มต้น
    if (coachStatsResult?.success && coachStatsResult.data) {
      // ตรวจสอบความถูกต้องของข้อมูลแต่ละ property
      const data = coachStatsResult.data;
      coachStats = {
        totalCoaches: typeof data.totalCoaches === 'number' ? data.totalCoaches : 0,
        activeTrainings: typeof data.activeTrainings === 'number' ? data.activeTrainings : 0,
        monthlyRegistrations: typeof data.monthlyRegistrations === 'number' ? data.monthlyRegistrations : 0,
        totalParticipants: typeof data.totalParticipants === 'number' ? data.totalParticipants : 0
      };
    }
    
    if (upcomingBatchesResult?.success && Array.isArray(upcomingBatchesResult.data)) {
      // ใช้เฉพาะข้อมูลที่มีโครงสร้างถูกต้องเท่านั้น
      upcomingBatches = upcomingBatchesResult.data.filter(batch => 
        batch && typeof batch === 'object' && batch.id !== undefined
      );
    }
    
    if (yearlyBatchesResult?.success && yearlyBatchesResult.data && typeof yearlyBatchesResult.data === 'object') {
      yearlyBatches = yearlyBatchesResult.data;
      
      // ตรวจสอบโครงสร้างของข้อมูลเพื่อให้แน่ใจว่าใช้งานได้
      Object.keys(yearlyBatches).forEach(year => {
        if (!Array.isArray(yearlyBatches[year])) {
          yearlyBatches[year] = [];
        }
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // ไม่ต้องกำหนดข้อมูลตัวอย่าง แต่ใช้ค่าเริ่มต้นว่างที่กำหนดไว้แล้ว
  }

  // ฟังก์ชันคำนวณเปอร์เซ็นต์ผู้เข้าร่วมอย่างปลอดภัย
  function calculatePercentage(current: number, total: number) {
    if (!total || !current || current < 0 || total < 0) return 0;
    return Math.min(Math.round((current / total) * 100), 100);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ส่วนส่วนหัว */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-futsal-navy">แดชบอร์ด</h1>
          <p className="text-gray-600">ยินดีต้อนรับ, {session.user.firstName || session.user.firstName || 'คุณ'}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild className="bg-futsal-orange hover:bg-futsal-orange/90">
            <Link href="/dashboard/coach/training">
              <Calendar className="mr-2 h-4 w-4" />
              ดูการอบรมทั้งหมด
            </Link>
          </Button>
        </div>
      </div>

      {/* สถิติภาพรวม Component */}
      <StatisticsOverview stats={coachStats} />
      
      {/* แบนเนอร์แสดงข้อมูลด่วน */}
      <div className="my-8 bg-gradient-to-r from-futsal-navy to-futsal-blue rounded-lg shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <div className="w-full h-full bg-white/20"></div>
        </div>

      </div>

      {/* ข้อมูลโค้ช: เพศ, สถานะ, ประสบการณ์ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* สัดส่วนเพศ */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <User className="h-5 w-5 mr-2 text-purple-500" />
              สัดส่วนเพศของโค้ช
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pt-0 pb-4" style={{ height: '240px' }}>
            <GenderDistributionChart />
          </CardContent>
        </Card>

        {/* สถานะโค้ช */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Award className="h-5 w-5 mr-2 text-futsal-green" />
              สถานะโค้ช
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pt-0 pb-4" style={{ height: '240px' }}>
            <CoachStatusChart />
          </CardContent>
        </Card>

        {/* ประสบการณ์โค้ช */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Star className="h-5 w-5 mr-2 text-amber-500" />
              ประสบการณ์โค้ช
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pt-0 pb-4" style={{ height: '240px' }}>
            <EnhancedCoachExperienceChart />
          </CardContent>
        </Card>
      </div>

      {/* รุ่นการอบรมตามปี (กราฟ) */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center">
            <BarChart4 className="h-5 w-5 mr-2 text-futsal-blue" />
            รุ่นการอบรมตามปี
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pt-0 pb-4" style={{ height: '400px' }}>
          <BatchYearBarChart yearlyBatches={yearlyBatches} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* การอบรมที่กำลังจะมาถึง */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-futsal-orange" />
              การอบรมที่กำลังจะมาถึง
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pt-0 pb-4">
            <UpcomingTrainingCard 
              batches={upcomingBatches} 
              calculatePercentage={calculatePercentage} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}