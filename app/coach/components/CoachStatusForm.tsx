// app/coach/components/CoachStatusForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Coach } from '../types/coach';

interface CoachStatusFormProps {
  formData: Partial<Coach>;
  onUpdateFormData: (data: Partial<Coach>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep?: boolean;
  onFinalSubmit?: () => Promise<boolean>;
  isSubmitting?: boolean;
}

export default function CoachStatusForm({ 
  formData,
  onUpdateFormData,
  onNext,
  onPrevious,
  isLastStep = false,
  onFinalSubmit,
  isSubmitting = false
}: CoachStatusFormProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  
  // ฟังก์ชันตรวจสอบความถูกต้อง
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // ตรวจสอบสถานะโค้ช
    if (!formData.coachStatus) {
      newErrors.coachStatus = 'กรุณาเลือกสถานะโค้ช';
    }
    
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isLastStep && onFinalSubmit) {
      console.log("This is the last step, calling onFinalSubmit");
      await onFinalSubmit();
    } else {
      console.log("Not the last step, calling onNext");
      onNext();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    onUpdateFormData({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
        <h3 className="text-lg font-medium text-orange-800 mb-2">สถานภาพโค้ช</h3>
        <p className="text-gray-600">
          กรุณาเลือกสถานภาพของคุณในการเป็นโค้ชฟุตซอล
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="coachStatus">สถานภาพโค้ช <span className="text-red-500">*</span></Label>
        <Select 
          value={formData.coachStatus as string || ''} 
          onValueChange={(value) => handleInputChange('coachStatus', value)}
        >
          <SelectTrigger id="coachStatus">
            <SelectValue placeholder="เลือกสถานภาพโค้ช" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CIVIL_SERVANT">ข้าราชการ</SelectItem>
            <SelectItem value="GOVERNMENT_EMPLOYEE">ลูกจ้างราชการ</SelectItem>
            <SelectItem value="ACADEMY_EMPLOYEE">ลูกจ้าง Academy</SelectItem>
            <SelectItem value="ACADEMY_OWNER">เจ้าของ Academy</SelectItem>
            <SelectItem value="VOLUNTEER">อาสาสมัครจิตอาสา</SelectItem>
            <SelectItem value="OTHER">อื่นๆ</SelectItem>
          </SelectContent>
        </Select>
        {localErrors.coachStatus && <p className="text-sm text-red-500">{localErrors.coachStatus}</p>}
        <p className="text-sm text-gray-500 mt-1">
          สถานภาพนี้จะถูกใช้ในการจัดกลุ่มโค้ชและการฝึกอบรม
        </p>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          ย้อนกลับ
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={`group ${
            !isLastStep ? "hover:shadow-md hover:bg-orange-500" : ""
          }`}
        >
          {isSubmitting ? (
            "กำลังบันทึก..."
          ) : isLastStep ? (
            "บันทึกข้อมูล"
          ) : (
            <div className="flex items-center">
              <span>ถัดไป</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}