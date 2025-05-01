// app/dashboard/coach/components/CoachDeleteButton.tsx
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
import { deleteCoach } from '@/app/coach/actions/coach/delete';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CoachDeleteButtonProps {
  coachId: number;
  coachName: string;
}

export function CoachDeleteButton({ coachId, coachName }: CoachDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const result = await deleteCoach(coachId);
      
      if (result.success) {
        toast.success('ลบข้อมูลโค้ชเรียบร้อยแล้ว');
        router.push('/dashboard/coach');
        router.refresh();
      } else {
        toast.error(result.error || 'เกิดข้อผิดพลาดในการลบข้อมูลโค้ช');
      }
    } catch (error) {
      console.error('Error deleting coach:', error);
      toast.error('เกิดข้อผิดพลาดในการลบข้อมูลโค้ช');
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
          ลบข้อมูลโค้ช
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบข้อมูลโค้ช</AlertDialogTitle>
          <AlertDialogDescription>
            คุณกำลังจะลบข้อมูลโค้ช {coachName} การดำเนินการนี้ไม่สามารถยกเลิกได้
            {'\n\n'}
            ข้อมูลการลงทะเบียนและประวัติการอบรมทั้งหมดของโค้ชคนนี้จะถูกลบไปด้วย
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