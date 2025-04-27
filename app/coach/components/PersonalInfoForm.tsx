// app/coach/components/PersonalInfoForm.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Coach } from '../types/coach';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';

interface PersonalInfoFormProps {
  formData: Partial<Coach>;
  onUpdateFormData: (data: Partial<Coach>) => void;
  onNext: () => void;
  onPrevious?: () => void;
  isLastStep?: boolean;
  onFinalSubmit?: () => Promise<boolean>;
  isSubmitting?: boolean;
}

export default function PersonalInfoForm({ 
  formData,
  onUpdateFormData,
  onNext,
  onPrevious,
  isLastStep = false,
  onFinalSubmit,
  isSubmitting = false
}: PersonalInfoFormProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [hasMedicalCondition, setHasMedicalCondition] = useState(formData.hasMedicalCondition || false);
  
  // ฟังก์ชั่นสำหรับ validate ข้อมูล
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // ตรวจสอบเพศ
    if (!formData.gender) {
      newErrors.gender = 'กรุณาเลือกเพศ';
    }
    
    // ตรวจสอบอายุ
    if (!formData.age || formData.age < 18) {
      newErrors.age = 'อายุต้องไม่น้อยกว่า 18 ปี';
    }
    
    // ตรวจสอบเลขบัตรประชาชน
    if (!formData.idCardNumber || formData.idCardNumber.length !== 13 || !/^\d+$/.test(formData.idCardNumber)) {
      newErrors.idCardNumber = 'เลขบัตรประชาชนต้องมี 13 หลักและเป็นตัวเลขเท่านั้น';
    }
    
    // ตรวจสอบศาสนา
    if (!formData.religion) {
      newErrors.religion = 'กรุณาเลือกศาสนา';
    }
    
    // ตรวจสอบประเภทอาหาร
    if (!formData.foodPreference) {
      newErrors.foodPreference = 'กรุณาเลือกประเภทอาหาร';
    }
    
    // ถ้ามีโรคประจำตัวแล้วไม่ได้ระบุ
    if (hasMedicalCondition && !formData.medicalCondition) {
      newErrors.medicalCondition = 'กรุณาระบุโรคประจำตัว';
    }
    
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // อัพเดทข้อมูลโรคประจำตัวก่อน validate
    const updatedData: Partial<Coach> = {
      ...formData,
      hasMedicalCondition
    };
    onUpdateFormData(updatedData);
    
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">
            เพศ <span className="text-red-500">*</span>
          </Label>
          <Select
            value={(formData.gender as string) || ""}
            onValueChange={(value) => handleInputChange("gender", value)}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="เลือกเพศ" />
            </SelectTrigger>
            <SelectContent title="เพศ">
              <SelectItem value="MALE">ชาย</SelectItem>
              <SelectItem value="FEMALE">หญิง</SelectItem>
              <SelectItem value="LGBTQ">LGBTQ+</SelectItem>
            </SelectContent>
          </Select>
          {localErrors.gender && (
            <p className="text-sm text-red-500">{localErrors.gender}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">
            อายุ <span className="text-red-500">*</span>
          </Label>
          <Input
            id="age"
            type="number"
            min="18"
            value={formData.age || ""}
            onChange={(e) => handleInputChange("age", Number(e.target.value))}
          />
          {localErrors.age && (
            <p className="text-sm text-red-500">{localErrors.age}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nickname">ชื่อเล่น</Label>
          <Input
            id="nickname"
            placeholder="ชื่อเล่น (ถ้ามี)"
            value={formData.nickname || ""}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamName">ชื่อทีม</Label>
          <Input
            id="teamName"
            placeholder="ชื่อทีม (ถ้ามี)"
            value={formData.teamName || ""}
            onChange={(e) => handleInputChange("teamName", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="idCardNumber">
          เลขบัตรประชาชน <span className="text-red-500">*</span>
        </Label>
        <Input
          id="idCardNumber"
          placeholder="เลขบัตรประชาชน 13 หลัก"
          maxLength={13}
          value={formData.idCardNumber || ""}
          onChange={(e) => handleInputChange("idCardNumber", e.target.value)}
        />
        {localErrors.idCardNumber && (
          <p className="text-sm text-red-500">{localErrors.idCardNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="religion">
            ศาสนา <span className="text-red-500">*</span>
          </Label>
          <Select
            value={(formData.religion as string) || ""}
            onValueChange={(value) => handleInputChange("religion", value)}
          >
            <SelectTrigger id="religion">
              <SelectValue placeholder="เลือกศาสนา" />
            </SelectTrigger>
            <SelectContent title="ศาสนา">
              <SelectItem value="BUDDHIST">พุทธ</SelectItem>
              <SelectItem value="CHRISTIAN">คริสต์</SelectItem>
              <SelectItem value="ISLAM">อิสลาม</SelectItem>
              <SelectItem value="HINDU">ฮินดู</SelectItem>
              <SelectItem value="OTHER">อื่นๆ</SelectItem>
            </SelectContent>
          </Select>
          {localErrors.religion && (
            <p className="text-sm text-red-500">{localErrors.religion}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="foodPreference">
            ประเภทอาหาร <span className="text-red-500">*</span>
          </Label>
          <Select
            value={(formData.foodPreference as string) || ""}
            onValueChange={(value) =>
              handleInputChange("foodPreference", value)
            }
          >
            <SelectTrigger id="foodPreference">
              <SelectValue placeholder="เลือกประเภทอาหาร" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GENERAL">ทั่วไป</SelectItem>
              <SelectItem value="VEGETARIAN">มังสวิรัติ</SelectItem>
              <SelectItem value="HALAL">ฮาลาล (อิสลาม)</SelectItem>
              <SelectItem value="JAY">เจ</SelectItem>
            </SelectContent>
          </Select>
          {localErrors.foodPreference && (
            <p className="text-sm text-red-500">{localErrors.foodPreference}</p>
          )}
        </div>
      </div>

      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <Checkbox
          id="hasMedicalCondition"
          checked={hasMedicalCondition}
          onCheckedChange={(checked) =>
            setHasMedicalCondition(checked as boolean)
          }
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor="hasMedicalCondition">มีโรคประจำตัว</Label>
          <p className="text-sm text-gray-500">
            โปรดระบุหากคุณมีโรคประจำตัวที่ควรแจ้งให้ทราบ
          </p>
        </div>
      </div>

      {hasMedicalCondition && (
        <div className="space-y-2">
          <Label htmlFor="medicalCondition">
            ระบุโรคประจำตัว <span className="text-red-500">*</span>
          </Label>
          <Input
            id="medicalCondition"
            placeholder="ระบุโรคประจำตัว"
            value={formData.medicalCondition || ""}
            onChange={(e) =>
              handleInputChange("medicalCondition", e.target.value)
            }
          />
          {localErrors.medicalCondition && (
            <p className="text-sm text-red-500">
              {localErrors.medicalCondition}
            </p>
          )}
        </div>
      )}

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