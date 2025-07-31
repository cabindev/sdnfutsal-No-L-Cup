// app/dashboard/coach/components/CoachCard.tsx
import Link from "next/link";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import { Phone, MapPin, Calendar, Building, Check, Clock, Hash } from "lucide-react";

interface CoachCardProps {
  coach: any;
  index?: number; // เพิ่ม prop สำหรับรับลำดับ
}

export default function CoachCard({ coach, index }: CoachCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {/* เพิ่มการแสดงลำดับ */}
          {index !== undefined && (
            <div className="flex items-center justify-center h-6 w-6 bg-gray-100 rounded-full text-xs text-gray-600 font-medium">
              {index}
            </div>
          )}
          
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-futsal-navy/10 flex items-center justify-center text-futsal-navy font-semibold">
              {coach.user.firstName?.charAt(0)}{coach.user.lastName?.charAt(0)}
            </div>
          </div>
          <div>
            <div className="font-medium">{coach.user.firstName} {coach.user.lastName}</div>
            {coach.nickname && <div className="text-sm text-gray-500">"{coach.nickname}"</div>}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {coach.teamName && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-500" />
              <span>{coach.teamName}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{coach.phoneNumber}</span>
          </div>
          
          {coach.location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <div>{coach.location.amphoe}, {coach.location.province}</div>
                {coach.location.zone && <div className="text-xs text-gray-500">{coach.location.zone}</div>}
              </div>
            </div>
          )}
          
          {coach.batchParticipations && coach.batchParticipations.length > 0 && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
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
                    {participation.batch.batchNumber}/{participation.batch.year}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {coach.isApproved ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Clock className="h-4 w-4 text-orange-600" />
            )}
            <span>{coach.isApproved ? 'อนุมัติแล้ว' : 'รอการอนุมัติ'}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-3 flex justify-end">
        <Link 
          href={`/dashboard/coach/${coach.id}`}
          className="text-sm text-futsal-orange hover:text-futsal-orange/80"
        >
          ดูข้อมูล
        </Link>
      </CardFooter>
    </Card>
  );
}