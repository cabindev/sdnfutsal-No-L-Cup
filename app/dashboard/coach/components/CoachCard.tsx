// app/dashboard/coach/components/CoachCard.tsx
'use client';

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";

interface CoachCardProps {
  coach: any;
}

export default function CoachCard({ coach }: CoachCardProps) {
  return (
    <Link 
      href={`/dashboard/coach/${coach.id}`}
      className="block transition-all hover:-translate-y-1"
    >
      <Card className="overflow-hidden border border-gray-200 hover:border-futsal-orange/50 hover:shadow-md transition-all duration-200">
        <div className={`h-1.5 w-full ${coach.isApproved ? 'bg-futsal-green' : 'bg-futsal-orange'}`}></div>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="w-12 h-12 rounded-full bg-futsal-navy/10 flex items-center justify-center text-futsal-navy font-semibold border-2 border-futsal-navy/20">
                {coach.user.firstName?.charAt(0)}{coach.user.lastName?.charAt(0)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {coach.user.firstName} {coach.user.lastName}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {coach.nickname && <span>"{coach.nickname}" </span>}
                {coach.teamName && <span>• {coach.teamName}</span>}
              </p>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500 mb-1.5">
              <span className="flex-shrink-0 w-24">เบอร์โทรศัพท์:</span>
              <span className="font-medium text-gray-700">{coach.phoneNumber}</span>
            </div>
            {coach.location && (
              <div className="flex items-start text-sm text-gray-500 mb-1.5">
                <span className="flex-shrink-0 w-24">พื้นที่:</span>
                <span className="font-medium text-gray-700">
                  {coach.location.amphoe}, {coach.location.province}
                </span>
              </div>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <span className="flex-shrink-0 w-24">สถานะ:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                coach.isApproved 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {coach.isApproved ? 'อนุมัติแล้ว' : 'รอการอนุมัติ'}
              </span>
            </div>
          </div>
          
          {/* แสดงข้อมูลรุ่นอบรม */}
          {coach.batchParticipations && coach.batchParticipations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-500 mb-1.5">รุ่นการอบรม:</div>
              <div className="flex flex-wrap gap-1">
                {coach.batchParticipations.map((participation: any) => (
                  <span 
                    key={participation.id}
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      participation.status === 'APPROVED' 
                        ? 'bg-green-100 text-green-800' 
                        : participation.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    รุ่น {participation.batch.batchNumber}/{participation.batch.year}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-3 flex justify-end">
            <div className="flex items-center text-futsal-orange text-sm">
              <span>ดูข้อมูลเพิ่มเติม</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}