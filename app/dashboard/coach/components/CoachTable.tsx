// app/dashboard/coach/components/CoachTable.tsx
'use client';

import Link from "next/link";
import { Coach } from "@prisma/client";
import { Badge } from "@/app/components/ui/badge";

interface CoachTableProps {
  coaches: any[];
  isAdmin: boolean;
}

export default function CoachTable({ coaches, isAdmin }: CoachTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ทีม/สังกัด</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ติดต่อ</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">พื้นที่</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รุ่นอบรม</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">จัดการ</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {coaches.map((coach) => (
            <tr key={coach.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-futsal-navy/10 flex items-center justify-center text-futsal-navy font-semibold">
                      {coach.user.firstName?.charAt(0)}{coach.user.lastName?.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{coach.user.firstName} {coach.user.lastName}</div>
                    {coach.nickname && <div className="text-sm text-gray-500">"{coach.nickname}"</div>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{coach.teamName || "-"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{coach.phoneNumber}</div>
                {coach.lineId && <div className="text-xs text-gray-500">Line: {coach.lineId}</div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {coach.location ? (
                  <div className="text-sm text-gray-900">
                    {coach.location.amphoe}, {coach.location.province}
                  </div>
                ) : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {coach.batchParticipations && coach.batchParticipations.length > 0 ? (
                    coach.batchParticipations.map((participation: any) => (
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
                    ))
                  ) : "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  coach.isApproved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {coach.isApproved ? 'อนุมัติแล้ว' : 'รอการอนุมัติ'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link 
                  href={`/dashboard/coach/${coach.id}`}
                  className="text-futsal-orange hover:text-futsal-orange/80"
                >
                  ดูข้อมูล
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}