// app/coach/components/AddressForm.tsx
'use client';

import { useState } from 'react';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Coach, LocationData } from '../types/coach';
import TambonSearch from '../common/TambonSearch';

interface AddressFormProps {
  formData: Partial<Coach>;
  onUpdateFormData: (data: Partial<Coach>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep?: boolean;
  onFinalSubmit?: () => Promise<boolean>;
  isSubmitting?: boolean;
}

export default function AddressForm({ 
  formData,
  onUpdateFormData,
  onNext,
  onPrevious,
  isLastStep = false,
  onFinalSubmit,
  isSubmitting = false
}: AddressFormProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    formData.location || null
  );
  
  // ฟังก์ชันตรวจสอบความถูกต้อง
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // ตรวจสอบที่อยู่
    if (!formData.address || formData.address.length < 5) {
      newErrors.address = 'กรุณากรอกที่อยู่ให้ครบถ้วน';
    }
    
    // ตรวจสอบตำบล อำเภอ จังหวัด
    if (!selectedLocation) {
      newErrors.location = 'กรุณาเลือกตำบล อำเภอ จังหวัด';
    }
    
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // บันทึกข้อมูล location ก่อนการตรวจสอบ
    if (selectedLocation) {
      onUpdateFormData({ ...formData, location: selectedLocation });
    }
    
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

  const handleSelectLocation = (location: LocationData) => {
    setSelectedLocation(location);
    onUpdateFormData({ ...formData, location });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="address">ที่อยู่ตามบัตรประชาชน <span className="text-red-500">*</span></Label>
        <Textarea 
          id="address" 
          placeholder="กรอกที่อยู่ตามบัตรประชาชน" 
          value={formData.address || ''} 
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
        {localErrors.address && <p className="text-sm text-red-500">{localErrors.address}</p>}
      </div>
      
      <div className="space-y-2">
        <Label>ตำบล อำเภอ จังหวัด <span className="text-red-500">*</span></Label>
        <TambonSearch
          onSelectLocation={handleSelectLocation}
          initialLocation={formData.location}
        />
        {localErrors.location && <p className="text-sm text-red-500">{localErrors.location}</p>}
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