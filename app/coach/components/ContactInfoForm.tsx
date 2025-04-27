// app/coach/components/ContactInfoForm.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Coach } from '../types/coach';

interface ContactInfoFormProps {
  formData: Partial<Coach>;
  onUpdateFormData: (data: Partial<Coach>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep?: boolean;
  onFinalSubmit?: () => Promise<boolean>;
  isSubmitting?: boolean;
}

export default function ContactInfoForm({ 
  formData,
  onUpdateFormData,
  onNext,
  onPrevious,
  isLastStep = false,
  onFinalSubmit,
  isSubmitting = false
}: ContactInfoFormProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  
  // ฟังก์ชันตรวจสอบความถูกต้อง
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // ตรวจสอบเบอร์โทรศัพท์
    if (!formData.phoneNumber || formData.phoneNumber.length < 10 || !/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'เบอร์โทรศัพท์ต้องมีอย่างน้อย 10 หลักและเป็นตัวเลขเท่านั้น';
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
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">เบอร์โทรศัพท์ <span className="text-red-500">*</span></Label>
        <Input 
          id="phoneNumber" 
          type="tel" 
          placeholder="เบอร์โทรศัพท์" 
          value={formData.phoneNumber || ''} 
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
        />
        {localErrors.phoneNumber && <p className="text-sm text-red-500">{localErrors.phoneNumber}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="lineId">LINE ID</Label>
        <Input 
          id="lineId" 
          placeholder="LINE ID (ถ้ามี)" 
          value={formData.lineId || ''} 
          onChange={(e) => handleInputChange('lineId', e.target.value)}
        />
        <p className="text-sm text-gray-500 mt-1">
          ระบุ LINE ID เพื่อความสะดวกในการติดต่อ
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