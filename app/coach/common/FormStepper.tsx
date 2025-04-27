// common/FormStepper.tsx
'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Check } from 'lucide-react';

interface StepItem {
  title: string;
  component: React.ComponentType<any>;
}

interface FormStepperProps {
  steps: StepItem[];
  formData: any;
  onUpdateFormData: (data: any) => void;
  finalAction: (formData: any) => Promise<any>;
  submitButtonText?: string;
  isSuccess?: boolean;
  successData?: any;
}

export function FormStepper({
  steps,
  formData,
  onUpdateFormData,
  finalAction,
  submitButtonText = 'บันทึกข้อมูล',
  isSuccess = false,
  successData = null,
}: FormStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // เมื่อ isSuccess เปลี่ยนและเป็น true ให้ไปขั้นตอนสุดท้าย
  useEffect(() => {
    if (isSuccess && currentStep !== steps.length - 1) {
      setCurrentStep(steps.length - 1);
    }
  }, [isSuccess, steps.length, currentStep]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };
  
  const handleFinalSubmit = async () => {
    if (currentStep === steps.length - 1) {
      setIsSubmitting(true);
      try {
        await finalAction(formData);
      } catch (error) {
        console.error('Error in final submission:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const CurrentStepComponent = steps[currentStep].component;

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
      
      <div className="mt-8 pt-4">
      <CurrentStepComponent
  formData={successData || formData}
  onUpdateFormData={onUpdateFormData}
  onNext={handleNext}
  onPrevious={handlePrevious}
  isLastStep={currentStep === steps.length - 1}
  onFinalSubmit={async () => {
    console.log("Final submit triggered from FormStepper");
    setIsSubmitting(true);
    try {
      await finalAction(formData);
    } catch (error) {
      console.error('Error in final submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  }}
  submitButtonText={submitButtonText}
  isSuccess={isSuccess}
  isSubmitting={isSubmitting}
/>
      </div>
    </div>
  );
}