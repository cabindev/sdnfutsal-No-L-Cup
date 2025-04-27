// app/coach/components/CoachForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Coach } from '../types/coach';
import { BatchParticipant } from '../types/training-batch';
import PersonalInfoForm from './PersonalInfoForm';
import ContactInfoForm from './ContactInfoForm';
import AddressForm from './AddressForm';
import TrainingInfoForm from './TrainingInfoForm';
import CoachStatusForm from './CoachStatusForm';
import RegistrationSuccess from '../common/RegistrationSuccess';
import { createCoach } from '../actions/coach/create';
import { updateCoach } from '../actions/coach/update';
import { Check } from 'lucide-react';

interface CoachFormProps {
  initialData?: Coach & { batchParticipations?: BatchParticipant[] };
  isEditing?: boolean;
  isPublicRegistration?: boolean;
}

export default function CoachForm({ 
  initialData, 
  isEditing = false,
  isPublicRegistration = false
}: CoachFormProps) {
  const router = useRouter();
  
  // แปลงข้อมูลเริ่มต้น
  const prepareInitialData = (): Partial<Coach> => {
    if (!initialData) return {};
    
    const data: Partial<Coach> = { ...initialData };
    
    // แปลงข้อมูล batchParticipations เป็น selectedBatchIds
    if (initialData.batchParticipations && 
        Array.isArray(initialData.batchParticipations) && 
        initialData.batchParticipations.length > 0) {
      
      data.selectedBatchIds = initialData.batchParticipations
        .filter(p => p && typeof p === 'object' && 'batchId' in p)
        .map(p => p.batchId);
    } else {
      data.selectedBatchIds = [];
    }
    
    return data;
  };
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Coach>>(prepareInitialData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // กำหนดขั้นตอนของฟอร์ม
  const steps = [
    { title: 'ข้อมูลส่วนตัว' },
    { title: 'ข้อมูลการติดต่อ' },
    { title: 'ที่อยู่' },
    { title: 'สถานภาพโค้ช' },
    { title: 'ข้อมูลการอบรม' },
    ...(isPublicRegistration ? [{ title: 'เสร็จสิ้น' }] : []),
  ];

  // อัพเดทข้อมูลฟอร์ม
  const handleUpdateFormData = (fieldData: Partial<Coach>) => {
    setFormData(prev => ({ ...prev, ...fieldData }));
  };

  // เปลี่ยนไปขั้นตอนถัดไป
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // ย้อนกลับขั้นตอนก่อนหน้า
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Server Action - ใช้รูปแบบ Server Action ตามที่แนะนำใน Next.js
  async function handleSubmit() {
    setIsSubmitting(true);
    
    try {
      // ตรวจสอบข้อมูลที่จำเป็น
      const requiredFields = [
        'gender', 'age', 'idCardNumber', 'address', 'phoneNumber', 
        'religion', 'foodPreference', 'coachStatus', 'shirtSize', 'location'
      ];
      
      const missingFields = requiredFields.filter(field => {
        if (field === 'coachExperience' || field === 'participationCount') {
          return formData[field as keyof typeof formData] === undefined;
        }
        return !formData[field as keyof typeof formData];
      });
      
      if (missingFields.length > 0) {
        throw new Error(`กรุณากรอกข้อมูลให้ครบถ้วน: ${missingFields.join(', ')}`);
      }
      
      // สร้าง FormData เพื่อส่งไปยัง Server Action
      const submitFormData = new FormData();
      
      // เพิ่มข้อมูลทั่วไป
      for (const [key, value] of Object.entries(formData)) {
        // ข้ามการเพิ่ม selectedBatchIds และ location และ batchParticipations เข้าไปในฟอร์มตรงนี้
        if (key !== 'selectedBatchIds' && key !== 'location' && key !== 'batchParticipations' && value !== undefined && value !== null) {
          if (typeof value === 'boolean') {
            submitFormData.append(key, value.toString());
          } else if (typeof value === 'object') {
            // ข้ามข้อมูล object ที่ซับซ้อน (จะจัดการแยก)
          } else {
            submitFormData.append(key, String(value));
          }
        }
      }
      
      // เพิ่มข้อมูล selectedBatchIds ในรูปแบบที่ server action จะอ่านได้ถูกต้อง
      const batchIds = formData.selectedBatchIds || [];
      if (Array.isArray(batchIds) && batchIds.length > 0) {
        // ส่งเป็น array ในชื่อ selectedBatchIds[]
        for (const batchId of batchIds) {
          if (typeof batchId === 'number' && !isNaN(batchId)) {
            submitFormData.append('selectedBatchIds[]', batchId.toString());
          }
        }
      }
      
      // เพิ่มข้อมูลตำแหน่ง
      if (formData.location && typeof formData.location === 'object') {
        if ('district' in formData.location) submitFormData.append('district', String(formData.location.district));
        if ('amphoe' in formData.location) submitFormData.append('amphoe', String(formData.location.amphoe));
        if ('province' in formData.location) submitFormData.append('province', String(formData.location.province));
        if ('zone' in formData.location && formData.location.zone) {
          submitFormData.append('zone', String(formData.location.zone));
        }
      }
      
      // ส่งข้อมูลไปยัง Server Action
      let result;
      if (isEditing && initialData?.id) {
        submitFormData.append('id', String(initialData.id));
        result = await updateCoach(submitFormData);
      } else {
        result = await createCoach(submitFormData);
      }
      
      if (!result || !result.success) {
        throw new Error(result?.error || 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      }
      
      // ดำเนินการหลังบันทึกสำเร็จ
      if (isEditing) {
        toast.success('อัปเดตข้อมูลโค้ชเรียบร้อยแล้ว');
        router.push('/dashboard/coach');
        router.refresh();
      } else if (isPublicRegistration) {
        setIsSuccess(true);
        if (result.data) {
          setFormData(prev => ({ ...prev, ...result.data }));
        }
        // ไปยังหน้าสุดท้าย (หน้าสำเร็จ)
        setCurrentStep(steps.length - 1);
      } else {
        toast.success('เพิ่มข้อมูลโค้ชเรียบร้อยแล้ว');
        router.push('/dashboard/coach');
        router.refresh();
      }
      
      return true;
    } catch (error) {
      console.error('Error saving coach data:', error);
      toast.error(error instanceof Error ? error.message : 'เกิดข้อผิดพลาด โปรดลองอีกครั้ง');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  // ตรวจสอบว่าเป็นขั้นตอนสุดท้ายและเป็นการลงทะเบียนสาธารณะหรือไม่
  const isSuccessStep = currentStep === steps.length - 1 && isPublicRegistration;
  const isLastFormStep = currentStep === (isPublicRegistration ? steps.length - 2 : steps.length - 1);

  return (
    <div className="space-y-8">
      {/* แสดง Stepper แบบ responsive */}
      {/* แสดงแนวตั้งบนมือถือ */}
      <div className="block md:hidden">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          <ul className="relative space-y-8">
            {steps.map((step, index) => (
              <li key={index} className="flex items-center pl-10 relative">
                <div
                  className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    index < currentStep
                      ? 'border-orange-600 bg-orange-600 text-white'
                      : index === currentStep
                      ? 'border-orange-600 bg-white text-orange-600'
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    index <= currentStep ? 'text-orange-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* แสดงแนวนอนบนหน้าจอใหญ่ */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute left-0 top-2/4 h-0.5 w-full bg-gray-200" />
          <ul className="relative flex justify-between">
            {steps.map((step, index) => (
              <li key={index} className="flex flex-col items-center">
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 z-10 ${
                    index < currentStep
                      ? 'border-orange-600 bg-orange-600 text-white'
                      : index === currentStep
                      ? 'border-orange-600 bg-white text-orange-600'
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                <span
                  className={`mt-2 text-center text-xs ${
                    index <= currentStep ? 'text-orange-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* แสดงฟอร์มปัจจุบัน - ใช้เงื่อนไข switch case แบบไม่ใช้ component เป็นตัวแปร */}
      <div className="mt-8 pt-4">
        {isSuccessStep ? (
          <RegistrationSuccess formData={formData} />
        ) : (
          <>
            {currentStep === 0 && (
              <PersonalInfoForm
                formData={formData}
                onUpdateFormData={handleUpdateFormData}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isLastStep={isLastFormStep}
                onFinalSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
            {currentStep === 1 && (
              <ContactInfoForm
                formData={formData}
                onUpdateFormData={handleUpdateFormData}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isLastStep={isLastFormStep}
                onFinalSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
            {currentStep === 2 && (
              <AddressForm
                formData={formData}
                onUpdateFormData={handleUpdateFormData}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isLastStep={isLastFormStep}
                onFinalSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
            {currentStep === 3 && (
              <CoachStatusForm
                formData={formData}
                onUpdateFormData={handleUpdateFormData}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isLastStep={isLastFormStep}
                onFinalSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
            {currentStep === 4 && (
              <TrainingInfoForm
                formData={formData}
                onUpdateFormData={handleUpdateFormData}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isLastStep={isLastFormStep}
                onFinalSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}