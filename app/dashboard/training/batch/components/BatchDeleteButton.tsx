// app/dashboard/training/batch/components/BatchDeleteButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Trash2 } from 'lucide-react';
import { 
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
 AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog';
import { deleteBatch } from '@/app/coach/actions/training-batch/delete';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface BatchDeleteButtonProps {
 batchId: number;
 batchName: string;
}

export function BatchDeleteButton({ batchId, batchName }: BatchDeleteButtonProps) {
 const router = useRouter();
 const [isDeleting, setIsDeleting] = useState(false);
 const [isOpen, setIsOpen] = useState(false);
 
 const handleDelete = async () => {
   setIsDeleting(true);
   
   try {
     const result = await deleteBatch(batchId);
     
     if (result.success) {
       toast.success('ลบรุ่นอบรมเรียบร้อยแล้ว');
       router.push('/dashboard/training/batch');
       router.refresh();
     } else {
       toast.error(result.error || 'เกิดข้อผิดพลาดในการลบรุ่นอบรม');
     }
   } catch (error) {
     console.error('Error deleting batch:', error);
     toast.error('เกิดข้อผิดพลาดในการลบรุ่นอบรม');
   } finally {
     setIsDeleting(false);
     setIsOpen(false);
   }
 };

 return (
   <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
     <AlertDialogTrigger asChild>
       <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
         <Trash2 className="h-4 w-4 mr-2" />
         ลบรุ่นอบรม
       </Button>
     </AlertDialogTrigger>
     <AlertDialogContent>
       <AlertDialogHeader>
         <AlertDialogTitle>ยืนยันการลบรุ่นอบรม</AlertDialogTitle>
         <AlertDialogDescription>
           คุณกำลังจะลบรุ่นอบรมที่ {batchName} การดำเนินการนี้ไม่สามารถยกเลิกได้
           {'\n\n'}
           หากมีโค้ชลงทะเบียนในรุ่นนี้แล้ว การลงทะเบียนจะถูกลบไปด้วย
         </AlertDialogDescription>
       </AlertDialogHeader>
       <AlertDialogFooter>
         <AlertDialogCancel disabled={isDeleting}>ยกเลิก</AlertDialogCancel>
         <AlertDialogAction
           onClick={(e) => {
             e.preventDefault();
             handleDelete();
           }}
           disabled={isDeleting}
           className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
         >
           {isDeleting ? 'กำลังลบ...' : 'ยืนยันการลบ'}
         </AlertDialogAction>
       </AlertDialogFooter>
     </AlertDialogContent>
   </AlertDialog>
 );
}