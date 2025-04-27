// app/dashboard/training/batch/participants/[id]/page.tsx
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/lib/configs/auth/authOptions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { 
  Users, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Search, 
  FileText, 
  Calendar, 
  MapPin, 
  Download,
  UserCheck,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import prisma from "@/app/lib/db";
import { 
  approveParticipant, 
  rejectParticipant 
} from "@/app/coach/actions/training-batch/approve-participant";

export default async function BatchParticipantsPage({ 
  params,
  searchParams 
}: { 
  params: { batchId: string };
  searchParams: { filter?: string; search?: string; } 
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect("/auth/signin");
  }
  
  const batchId = parseInt(params.batchId);
  const filter = searchParams.filter || 'all';
  const search = searchParams.search || '';
  
  // ดึงข้อมูลรุ่นอบรม
  const batch = await prisma.trainingBatch.findUnique({
    where: { id: batchId },
    include: {
      _count: {
        select: { participants: true }
      }
    }
  });
  
  if (!batch) {
    notFound();
  }
  
  // สร้างเงื่อนไขการค้นหา
  let where: any = {
    batchId
  };
  
  // กรองตามสถานะ
  if (filter === 'pending') {
    where.status = 'PENDING';
  } else if (filter === 'approved') {
    where.status = 'APPROVED';
  } else if (filter === 'rejected') {
    where.status = 'REJECTED';
  } else if (filter === 'canceled') {
    where.status = 'CANCELED';
  }
  
  // ค้นหาตามชื่อหรืออีเมล
  if (search) {
    where.coach = {
      user: {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } }
        ]
      }
    };
  }
  
  // ดึงข้อมูลผู้ลงทะเบียนในรุ่นนี้
  const participants = await prisma.batchParticipant.findMany({
    where,
    include: {
      coach: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              image: true
            }
          },
          location: true
        }
      }
    },
    orderBy: [
      { status: 'asc' },
      { registeredAt: 'desc' }
    ]
  });
  
  // สถิติของรุ่นอบรมนี้
  const stats = {
    total: await prisma.batchParticipant.count({ where: { batchId } }),
    pending: await prisma.batchParticipant.count({ where: { batchId, status: 'PENDING' } }),
    approved: await prisma.batchParticipant.count({ where: { batchId, status: 'APPROVED' } }),
    rejected: await prisma.batchParticipant.count({ where: { batchId, status: 'REJECTED' } })
  };
  
  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // ฟังก์ชันจัดรูปแบบเวลา
  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // คำนวณอัตราส่วนการเข้าร่วม
  const participationRate = Math.round((stats.total / batch.maxParticipants) * 100);
  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/training/batch">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            กลับไปยังรายการรุ่นอบรม
          </Button>
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-futsal-navy">ผู้เข้าร่วมรุ่นที่ {batch.batchNumber}/{batch.year}</h1>
            <p className="text-gray-600">จัดการและอนุมัติการลงทะเบียนสำหรับรุ่นอบรมนี้</p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex gap-2">
            <Button asChild variant="outline" className="border-futsal-green text-futsal-green">
              <Link href={`/dashboard/training/batch/${batchId}`}>
                <Calendar className="h-4 w-4 mr-2" />
                ข้อมูลรุ่นอบรม
              </Link>
            </Button>
            
            <Button asChild className="bg-futsal-blue hover:bg-futsal-blue/90">
              <Link href="#">
                <Download className="h-4 w-4 mr-2" />
                ส่งออกรายชื่อ
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* ข้อมูลรุ่นอบรม */}
      <Card className="mb-6 bg-gradient-to-r from-futsal-blue/5 to-white border-futsal-blue/20">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-3 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-futsal-navy mb-1">
                  รุ่นที่ {batch.batchNumber}/{batch.year}
                </h2>
                <p className="text-gray-600">{batch.description || 'การอบรมโค้ชฟุตซอล'}</p>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-4 w-4 text-futsal-blue mt-1 mr-2" />
                <div>
                  <div className="text-sm font-medium">วันที่จัดอบรม</div>
                  <div className="text-gray-600">{formatDate(batch.startDate)} - {formatDate(batch.endDate)}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-futsal-blue mt-1 mr-2" />
                <div>
                  <div className="text-sm font-medium">สถานที่</div>
                  <div className="text-gray-600">{batch.location}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Badge className={batch.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {batch.isActive ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                </Badge>
                {batch.isActive && (
                  <span className="text-sm text-gray-500 ml-2">
                    (ปิดรับสมัคร {formatDate(batch.registrationEndDate)})
                  </span>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg border p-4 h-full">
                <h3 className="text-sm font-medium text-gray-700 mb-3">สถิติการลงทะเบียน</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>ผู้เข้าร่วม</span>
                      <span className="font-medium">{stats.total} / {batch.maxParticipants} คน</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          participationRate >= 90 ? 'bg-red-500' :
                          participationRate >= 70 ? 'bg-amber-500' :
                          'bg-futsal-green'
                        }`}
                        style={{ width: `${Math.min(participationRate, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="bg-yellow-50 p-2 rounded-md">
                      <div className="font-medium text-yellow-800">{stats.pending}</div>
                      <div className="text-yellow-600">รอการอนุมัติ</div>
                      <div className="bg-yellow-50 p-2 rounded-md">
                     <div className="font-medium text-yellow-800">{stats.pending}</div>
                     <div className="text-yellow-600">รอการอนุมัติ</div>
                   </div>
                   
                   <div className="bg-green-50 p-2 rounded-md">
                     <div className="font-medium text-green-800">{stats.approved}</div>
                     <div className="text-green-600">อนุมัติแล้ว</div>
                   </div>
                   
                   <div className="bg-red-50 p-2 rounded-md">
                     <div className="font-medium text-red-800">{stats.rejected}</div>
                     <div className="text-red-600">ไม่อนุมัติ</div>
                   </div>
                 </div>
                 
                 <div>
                   <div className="flex justify-between mb-1 text-sm">
                     <span>อัตราการอนุมัติ</span>
                     <span className="font-medium">{approvalRate}%</span>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-2">
                     <div 
                       className="h-2 rounded-full bg-futsal-blue"
                       style={{ width: `${approvalRate}%` }}
                     ></div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           </div>
           </div>
       </CardContent>
     </Card>
     
     {/* ตัวกรองและการค้นหา */}
     <div className="flex flex-col md:flex-row gap-4 mb-6">
       <div className="flex flex-wrap gap-2 md:flex-1">
         <Link href={`/dashboard/training/batch/${batchId}/participants`}>
           <Button 
             variant={filter === 'all' ? 'default' : 'outline'}
             size="sm"
             className={filter === 'all' ? 'bg-futsal-navy' : ''}
           >
             ทั้งหมด
           </Button>
         </Link>
         <Link href={`/dashboard/training/batch/${batchId}/participants?filter=pending`}>
           <Button 
             variant={filter === 'pending' ? 'default' : 'outline'}
             size="sm"
             className={filter === 'pending' ? 'bg-amber-500' : ''}
           >
             รอการอนุมัติ
           </Button>
         </Link>
         <Link href={`/dashboard/training/batch/${batchId}/participants?filter=approved`}>
           <Button 
             variant={filter === 'approved' ? 'default' : 'outline'}
             size="sm"
             className={filter === 'approved' ? 'bg-futsal-green' : ''}
           >
             อนุมัติแล้ว
           </Button>
         </Link>
         <Link href={`/dashboard/training/batch/${batchId}/participants?filter=rejected`}>
           <Button 
             variant={filter === 'rejected' ? 'default' : 'outline'}
             size="sm"
             className={filter === 'rejected' ? 'bg-red-600' : ''}
           >
             ไม่อนุมัติ
           </Button>
         </Link>
       </div>
       
       <div className="relative">
         <form action={`/dashboard/training/batch/${batchId}/participants`} method="get">
           {filter !== 'all' && (
             <input type="hidden" name="filter" value={filter} />
           )}
           <Input
             type="text"
             name="search"
             placeholder="ค้นหาชื่อหรืออีเมล"
             defaultValue={search}
             className="pl-9 w-full md:w-64"
           />
           <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
           <Button type="submit" className="sr-only">ค้นหา</Button>
         </form>
       </div>
     </div>
     
     {/* แสดงรายชื่อผู้ลงทะเบียน */}
     <Card>
       <CardHeader className="pb-3">
         <CardTitle className="text-lg flex items-center">
           <UserCheck className="h-5 w-5 mr-2 text-futsal-blue" />
           รายชื่อผู้ลงทะเบียน {filter === 'pending' ? '(รอการอนุมัติ)' : ''} - {stats.total} คน
         </CardTitle>
       </CardHeader>
       <CardContent>
         {participants.length === 0 ? (
           <div className="p-12 text-center">
             <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
             <h3 className="text-lg font-medium text-gray-700 mb-1">ไม่พบข้อมูลการลงทะเบียน</h3>
             <p className="text-gray-500">
               {search ? 'ไม่พบผลลัพธ์ที่ตรงกับการค้นหา' : 
                filter !== 'all' ? 'ไม่พบข้อมูลสำหรับตัวกรองที่เลือก' : 
                'ยังไม่มีการลงทะเบียนในรุ่นนี้'}
             </p>
           </div>
         ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-sm">
               <thead className="bg-gray-50 text-gray-600">
                 <tr>
                   <th className="px-4 py-3 text-left font-medium">ชื่อ-นามสกุล</th>
                   <th className="px-4 py-3 text-left font-medium">อีเมล</th>
                   <th className="px-4 py-3 text-left font-medium">วันที่ลงทะเบียน</th>
                   <th className="px-4 py-3 text-left font-medium">สถานะ</th>
                   <th className="px-4 py-3 text-right font-medium">การจัดการ</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                 {participants.map((participant) => (
                   <tr key={participant.id} className="hover:bg-gray-50">
                     <td className="px-4 py-3 whitespace-nowrap">
                       <div className="flex items-center">
                         <Avatar className="h-8 w-8 mr-3">
                           <AvatarFallback className="text-xs bg-futsal-blue/10 text-futsal-blue">
                             {participant.coach.user.firstName?.charAt(0) || ''}
                             {participant.coach.user.lastName?.charAt(0) || ''}
                           </AvatarFallback>
                         </Avatar>
                         <div className="font-medium text-gray-900">
                           {participant.coach.user.firstName} {participant.coach.user.lastName}
                         </div>
                       </div>
                     </td>
                     <td className="px-4 py-3 whitespace-nowrap">
                       <div className="text-gray-700">{participant.coach.user.email}</div>
                       <div className="text-xs text-gray-500">
                         {participant.coach.location?.province || ''}
                       </div>
                     </td>
                     <td className="px-4 py-3 whitespace-nowrap">
                       <div>
                         {formatDate(participant.registeredAt)}
                       </div>
                       <div className="text-xs text-gray-500">
                         {formatTime(participant.registeredAt)}
                       </div>
                     </td>
                     <td className="px-4 py-3 whitespace-nowrap">
                       <Badge className={
                         participant.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                         participant.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                         participant.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                         'bg-yellow-100 text-yellow-800'
                       }>
                         {participant.status === 'APPROVED' ? 'อนุมัติแล้ว' :
                          participant.status === 'REJECTED' ? 'ไม่อนุมัติ' :
                          participant.status === 'CANCELED' ? 'ยกเลิก' :
                          'รอการอนุมัติ'}
                       </Badge>
                     </td>
                     <td className="px-4 py-3 whitespace-nowrap text-right">
                       <div className="flex justify-end space-x-2">
                         <Link href={`/dashboard/training/participants/${participant.id}`}>
                           <Button variant="outline" size="sm" className="text-gray-700">
                             <FileText className="h-4 w-4 mr-1" />
                             รายละเอียด
                           </Button>
                         </Link>
                         
                         {participant.status === 'PENDING' && (
                           <>
                             <form action={async () => {
                               'use server';
                               await approveParticipant(participant.id);
                             }}>
                               <Button type="submit" size="sm" className="bg-futsal-green hover:bg-futsal-green/90">
                                 <CheckCircle className="h-4 w-4 mr-1" />
                                 อนุมัติ
                               </Button>
                             </form>
                             
                             <form action={async () => {
                               'use server';
                               await rejectParticipant(participant.id);
                             }}>
                               <Button type="submit" size="sm" variant="destructive">
                                 <XCircle className="h-4 w-4 mr-1" />
                                 ไม่อนุมัติ
                               </Button>
                             </form>
                           </>
                         )}
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         )}
       </CardContent>
       <CardFooter className="bg-gray-50 flex justify-between border-t px-6 py-3">
         <div className="text-sm text-gray-600">
           แสดง {participants.length} รายการ จาก {stats.total} รายการ
         </div>
         
         {stats.pending > 0 && (
           <div className="flex gap-2">
             <form action={async () => {
               'use server';
               // Approve all pending participants
               const pendingParticipants = await prisma.batchParticipant.findMany({
                 where: { batchId, status: 'PENDING' },
                 select: { id: true }
               });
               
               for (const participant of pendingParticipants) {
                 await approveParticipant(participant.id);
               }
             }}>
               <Button type="submit" size="sm" className="bg-futsal-green hover:bg-futsal-green/90">
                 <CheckCircle className="h-4 w-4 mr-1" />
                 อนุมัติทั้งหมด ({stats.pending})
               </Button>
             </form>
           </div>
         )}
       </CardFooter>
     </Card>
   </div>
 );
}
                      