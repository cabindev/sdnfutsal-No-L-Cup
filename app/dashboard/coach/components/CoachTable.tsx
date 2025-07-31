// app/dashboard/coach/components/CoachTable.tsx
'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, CheckCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { approveCoach } from '@/app/coach/actions/coach/approvals';
import { deleteCoach } from '@/app/coach/actions/coach/delete';

interface CoachTableProps {
  coaches: any[];
  isAdmin: boolean;
  currentPage?: number;
  pageSize?: number;
}

export default function CoachTable({ 
  coaches, 
  isAdmin, 
  currentPage = 1, 
  pageSize = 10 
}: CoachTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  
  // คำนวณหมายเลขลำดับเริ่มต้นของรายการในหน้านี้
  const startIndex = (currentPage - 1) * pageSize + 1;
  
  /* ---------- helpers ---------- */
  const toggleLoading = (key: string, state: boolean) =>
    setLoading((prev) => ({ ...prev, [key]: state }));
    
  const handleApprove = async (id: number) => {
    const key = `approve-${id}`;
    toggleLoading(key, true);
    try {
      const { success, error } = await approveCoach(id);
      success ? toast.success('อนุมัติโค้ชเรียบร้อยแล้ว') : toast.error(error);
      router.refresh();
    } catch {
      toast.error('เกิดข้อผิดพลาดในการอนุมัติโค้ช');
    } finally {
      toggleLoading(key, false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลโค้ชนี้?')) return;
    const key = `delete-${id}`;
    toggleLoading(key, true);
    try {
      const { success, error } = await deleteCoach(id);
      success ? toast.success('ลบข้อมูลโค้ชเรียบร้อยแล้ว') : toast.error(error);
      router.refresh();
    } catch {
      toast.error('เกิดข้อผิดพลาดในการลบข้อมูลโค้ช');
    } finally {
      toggleLoading(key, false);
    }
  };

  return (
    <div className="table-responsive rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ทีม/สังกัด</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ติดต่อ</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">พื้นที่</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ภูมิภาค</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รุ่นอบรม</th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th scope="col" className="relative px-4 py-2">
              <span className="sr-only">จัดการ</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {coaches.map((coach, index) => (
            <tr key={coach.id} className="hover:bg-gray-50">
              {/* ลำดับ */}
              <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-500">
                {startIndex + index}
              </td>
              
              {/* ชื่อ-นามสกุล */}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8">
                    <div className="h-8 w-8 rounded-full bg-futsal-navy/10 flex items-center justify-center text-futsal-navy font-semibold text-xs">
                      {coach.user.firstName?.charAt(0)}{coach.user.lastName?.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-xs font-medium text-gray-900">{coach.user.firstName} {coach.user.lastName}</div>
                    {coach.nickname && <div className="text-xs text-gray-500">"{coach.nickname}"</div>}
                  </div>
                </div>
              </td>
              
              {/* ทีม/สังกัด */}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-xs text-gray-900">{coach.teamName || "-"}</div>
              </td>
              
              {/* ติดต่อ */}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-xs text-gray-900">{coach.phoneNumber}</div>
                {coach.lineId && <div className="text-xs text-gray-500">Line: {coach.lineId}</div>}
                {coach.user?.email && <div className="text-xs text-gray-500">{coach.user.email}</div>}
              </td>
              
              {/* พื้นที่ */}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-xs text-gray-900">
                  {coach.location?.amphoe || "-"}, {coach.location?.province || "-"}
                </div>
              </td>
              
              {/* ภูมิภาค */}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-xs text-gray-900">
                  {coach.location?.zone || "-"}
                </div>
              </td>
              
              {/* รุ่นอบรม */}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {coach.batchParticipations && coach.batchParticipations.length > 0 ? (
                    coach.batchParticipations.map((participation: any) => (
                      <span 
                        key={participation.id}
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
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
              
              {/* สถานะ */}
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  coach.isApproved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {coach.isApproved ? 'อนุมัติแล้ว' : 'รอการอนุมัติ'}
                </span>
              </td>
              
              {/* จัดการ */}
              <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">เปิดเมนู</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/coach/${coach.id}`}>ดูรายละเอียด</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/coach/edit/${coach.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        แก้ไขข้อมูล
                      </Link>
                    </DropdownMenuItem>

                    {isAdmin && !coach.isApproved && (
                      <DropdownMenuItem
                        onClick={() => handleApprove(coach.id)}
                        disabled={loading[`approve-${coach.id}`]}
                      >
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        อนุมัติ
                      </DropdownMenuItem>
                    )}

                    {isAdmin && (
                      <DropdownMenuItem
                        onClick={() => handleDelete(coach.id)}
                        disabled={loading[`delete-${coach.id}`]}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        ลบข้อมูล
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}