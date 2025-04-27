// app/dashboard/components/StatisticsOverview.tsx
import { Card, CardContent } from "@/app/components/ui/card";
import { Users, Award, TrendingUp, Clipboard, ArrowUp, ArrowDown } from "lucide-react";

interface StatsProps {
  stats: {
    totalCoaches?: number;
    activeTrainings?: number;
    monthlyRegistrations?: number;
    totalParticipants?: number;
  };
}

export default function StatisticsOverview({ stats }: StatsProps) {
  // Safely access stats with fallback to 0
  const totalCoaches = stats?.totalCoaches || 0;
  const activeTrainings = stats?.activeTrainings || 0;
  const monthlyRegistrations = stats?.monthlyRegistrations || 0;
  const totalParticipants = stats?.totalParticipants || 0;

  // These would come from actual data in a real implementation
  const coachesChange = { value: 8, isPositive: true };
  const trainingChange = { value: 2, isPositive: true };
  const registrationsChange = { value: 15, isPositive: true };
  const participantsChange = { value: 3, isPositive: false };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="overflow-hidden">
        <div className="h-1 bg-futsal-blue w-full"></div>
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">โค้ชทั้งหมด</p>
              <h3 className="text-2xl font-bold text-futsal-navy mt-1">
                {totalCoaches.toLocaleString()}
              </h3>
              
              <div className="flex items-center mt-2">
                {coachesChange.isPositive ? (
                  <div className="flex items-center text-green-600 text-xs font-medium">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>{coachesChange.value}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 text-xs font-medium">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    <span>{coachesChange.value}%</span>
                  </div>
                )}
                <span className="text-xs text-gray-500 ml-1.5">เทียบกับเดือนที่แล้ว</span>
              </div>
            </div>
            
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-6 w-6 text-futsal-blue" />
            </div>
          </div>
          
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4">
            <div className="h-1.5 rounded-full bg-futsal-blue" style={{ width: '70%' }}></div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <div className="h-1 bg-futsal-green w-full"></div>
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">การอบรมที่กำลังดำเนินการ</p>
              <h3 className="text-2xl font-bold text-futsal-navy mt-1">
                {activeTrainings.toLocaleString()}
              </h3>
              
              <div className="flex items-center mt-2">
                {trainingChange.isPositive ? (
                  <div className="flex items-center text-green-600 text-xs font-medium">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>{trainingChange.value}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 text-xs font-medium">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    <span>{trainingChange.value}%</span>
                  </div>
                )}
                <span className="text-xs text-gray-500 ml-1.5">เทียบกับเดือนที่แล้ว</span>
              </div>
            </div>
            
            <div className="bg-green-100 p-2 rounded-lg">
              <Award className="h-6 w-6 text-futsal-green" />
            </div>
          </div>
          
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4">
            <div className="h-1.5 rounded-full bg-futsal-green" style={{ width: '45%' }}></div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <div className="h-1 bg-futsal-orange w-full"></div>
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">การลงทะเบียนในเดือนนี้</p>
              <h3 className="text-2xl font-bold text-futsal-navy mt-1">
                {monthlyRegistrations.toLocaleString()}
              </h3>
              
              <div className="flex items-center mt-2">
                {registrationsChange.isPositive ? (
                  <div className="flex items-center text-green-600 text-xs font-medium">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>{registrationsChange.value}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 text-xs font-medium">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    <span>{registrationsChange.value}%</span>
                  </div>
                )}
                <span className="text-xs text-gray-500 ml-1.5">เทียบกับเดือนที่แล้ว</span>
              </div>
            </div>
            
            <div className="bg-orange-100 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-futsal-orange" />
            </div>
          </div>
          
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4">
            <div className="h-1.5 rounded-full bg-futsal-orange" style={{ width: '85%' }}></div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <div className="h-1 bg-purple-500 w-full"></div>
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">ผู้เข้าร่วมอบรมทั้งหมด</p>
              <h3 className="text-2xl font-bold text-futsal-navy mt-1">
                {totalParticipants.toLocaleString()}
              </h3>
              
              <div className="flex items-center mt-2">
                {participantsChange.isPositive ? (
                  <div className="flex items-center text-green-600 text-xs font-medium">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>{participantsChange.value}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 text-xs font-medium">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    <span>{participantsChange.value}%</span>
                  </div>
                )}
                <span className="text-xs text-gray-500 ml-1.5">เทียบกับเดือนที่แล้ว</span>
              </div>
            </div>
            
            <div className="bg-purple-100 p-2 rounded-lg">
              <Clipboard className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4">
            <div className="h-1.5 rounded-full bg-purple-500" style={{ width: '62%' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}