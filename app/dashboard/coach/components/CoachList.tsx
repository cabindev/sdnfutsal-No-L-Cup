// app/dashboard/coach/components/CoachList.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/app/components/ui/table';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  MoreHorizontal, Edit, Trash2, CheckCircle, Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { approveCoach } from '@/app/coach/actions/coach/approvals';
import { deleteCoach } from '@/app/coach/actions/coach/delete';

interface Participation {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  batch: { batchNumber: number; year: number };
}

interface Coach {
  id: number;
  nickname?: string;
  teamName?: string;
  phoneNumber: string;
  isApproved: boolean;
  user: { firstName: string; lastName: string; email: string };
  location?: { district: string; amphoe: string; province: string };
  batchParticipations: Participation[];
}

interface CoachListProps {
  coaches: Coach[];
  currentPage: number;
  totalPages: number;
  isAdmin: boolean;
}

export default function CoachList({
  coaches, currentPage, totalPages, isAdmin,
}: CoachListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  /* ---------- helpers ---------- */
  const toggleLoading = (key: string, state: boolean) =>
    setLoading((prev) => ({ ...prev, [key]: state }));

  const goToPage = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    router.push(url.toString());
  };

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

  /* ---------- empty state ---------- */
  if (!coaches.length) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">ไม่พบข้อมูลโค้ช</h3>
        <p className="mb-6 text-gray-500">ยังไม่มีข้อมูลโค้ชตามเงื่อนไขที่คุณค้นหา</p>
        <Button
          variant="outline"
          onClick={() => {
            const url = new URL(window.location.href);
            url.search = '';
            router.push(url.toString());
          }}
        >
          ล้างการค้นหา
        </Button>
      </div>
    );
  }

  /* ---------- main table ---------- */
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อ-นามสกุล</TableHead>
              <TableHead>ข้อมูลติดต่อ</TableHead>
              <TableHead>ที่อยู่</TableHead>
              <TableHead>รุ่นการอบรม</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {coaches.map((c) => (
              <TableRow key={c.id} className="hover:bg-gray-50">
                {/* ชื่อ */}
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{`${c.user.firstName} ${c.user.lastName}`}</span>
                    {c.nickname && <span className="text-sm text-gray-500">“{c.nickname}”</span>}
                    {c.teamName && <span className="text-xs text-gray-500">ทีม: {c.teamName}</span>}
                  </div>
                </TableCell>

                {/* ติดต่อ */}
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{c.phoneNumber}</span>
                    <span className="text-gray-500">{c.user.email}</span>
                  </div>
                </TableCell>

                {/* ที่อยู่ */}
                <TableCell>
                  {c.location ? (
                    <span className="text-sm">
                      {c.location.district}, {c.location.amphoe}, {c.location.province}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">ไม่ระบุ</span>
                  )}
                </TableCell>

                {/* รุ่นการอบรม */}
                <TableCell>
                  {c.batchParticipations.length ? (
                    c.batchParticipations.map((p) => (
                      <div key={p.id} className="mb-1 text-sm">
                        <Badge
                          className={
                            p.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : p.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          รุ่น {p.batch.batchNumber}/{p.batch.year}
                        </Badge>
                        <span className="ml-2 text-xs text-gray-500">
                          {{
                            APPROVED: 'อนุมัติแล้ว',
                            REJECTED: 'ไม่อนุมัติ',
                            PENDING: 'รอการอนุมัติ',
                          }[p.status]}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">ยังไม่ได้ลงทะเบียน</span>
                  )}
                </TableCell>

                {/* สถานะ */}
                <TableCell>
                  <Badge
                    className={
                      c.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {c.isApproved ? 'อนุมัติแล้ว' : 'รอการอนุมัติ'}
                  </Badge>
                </TableCell>

                {/* เมนูจัดการ */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <span className="sr-only">เปิดเมนู</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/coach/${c.id}`}>ดูรายละเอียด</Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/coach/edit/${c.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          แก้ไขข้อมูล
                        </Link>
                      </DropdownMenuItem>

                      {isAdmin && !c.isApproved && (
                        <DropdownMenuItem
                          onClick={() => handleApprove(c.id)}
                          disabled={loading[`approve-${c.id}`]}
                        >
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          อนุมัติ
                        </DropdownMenuItem>
                      )}

                      {isAdmin && (
                        <DropdownMenuItem
                          onClick={() => handleDelete(c.id)}
                          disabled={loading[`delete-${c.id}`]}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          ลบข้อมูล
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          {/* mobile */}
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ก่อนหน้า
            </Button>
            <Button
              variant="outline"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ถัดไป
            </Button>
          </div>

          {/* desktop */}
          <div className="hidden flex-1 items-center justify-between sm:flex">
            <p className="text-sm text-gray-700">
              แสดง <span className="font-medium">{coaches.length}</span> รายการ /
              ทั้งหมด <span className="font-medium">{totalPages}</span> หน้า
            </p>
            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const active = currentPage === page;
                return (
                  <Button
                    key={page}
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(page)}
                    className={`relative inline-flex items-center border px-4 py-2 text-sm ${
                      active
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
