// app/coach/components/TrainingInfoForm.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Textarea } from '@/app/components/ui/textarea';
import { Coach } from '@prisma/client';
import { getActiveTrainingBatches, TrainingBatchWithCount } from '../actions/training-batch/get-active';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { CalendarDays, MapPin, Users, X } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

// เพิ่ม type ที่จำเป็นสำหรับ component นี้
interface ExtendedCoach extends Partial<Coach> {
  selectedBatchIds?: number[];
}

interface TrainingInfoFormProps {
  formData: ExtendedCoach;
  onUpdateFormData: (data: ExtendedCoach) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep?: boolean;
  onFinalSubmit?: () => Promise<boolean>;
  isSubmitting?: boolean;
}

export default function TrainingInfoForm({
  formData,
  onUpdateFormData,
  onNext,
  onPrevious,
  isLastStep = false,
  onFinalSubmit,
  isSubmitting = false
}: TrainingInfoFormProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [accommodation, setAccommodation] = useState(() => formData.accommodation ?? true);
  const [trainingBatches, setTrainingBatches] = useState<TrainingBatchWithCount[]>([]);
  const [selectedBatchIds, setSelectedBatchIds] = useState<number[]>(() => 
    Array.isArray(formData.selectedBatchIds) ? [...formData.selectedBatchIds] : []
  );
  const [isLoadingBatches, setIsLoadingBatches] = useState(true);
  const [lastUpdatedFormData, setLastUpdatedFormData] = useState({
    selectedBatchIds: JSON.stringify(selectedBatchIds),
    accommodation: accommodation
  });
  
  // ฟังก์ชันเลือก/ยกเลิกการเลือกรุ่น
  const handleToggleBatch = useCallback((batchId: number) => {
    setSelectedBatchIds(prevIds => {
      if (prevIds.includes(batchId)) {
        return prevIds.filter(id => id !== batchId);
      } else {
        return [...prevIds, batchId];
      }
    });
  }, []);
  
  // โหลดข้อมูลรุ่นการอบรม - ทำงานเพียงครั้งเดียวเมื่อ component mount
  useEffect(() => {
    const loadTrainingBatches = async () => {
      try {
        setIsLoadingBatches(true);
        const response = await getActiveTrainingBatches();
        
        if (response.success && response.data) {
          setTrainingBatches(response.data);
        }
      } catch (error) {
        console.error('Error loading training batches:', error);
      } finally {
        setIsLoadingBatches(false);
      }
    };
    
    loadTrainingBatches();
  }, []);
  
  // อัพเดท formData เมื่อค่าสำคัญเปลี่ยนแปลง โดยป้องกันการเกิดลูปไม่รู้จบ
  useEffect(() => {
    const currentSelectedBatchIdsStr = JSON.stringify(selectedBatchIds);
    
    // ตรวจสอบว่ามีการเปลี่ยนแปลงจริงๆ หรือไม่
    if (currentSelectedBatchIdsStr !== lastUpdatedFormData.selectedBatchIds || 
        accommodation !== lastUpdatedFormData.accommodation) {
      
      // อัพเดทค่าที่ส่งล่าสุด
      setLastUpdatedFormData({
        selectedBatchIds: currentSelectedBatchIdsStr,
        accommodation
      });
      
      // ส่งค่าไปยัง parent component
      onUpdateFormData({
        selectedBatchIds,
        accommodation
      });
    }
  }, [selectedBatchIds, accommodation, onUpdateFormData, lastUpdatedFormData]);
  
  // ฟังก์ชันตรวจสอบความถูกต้อง
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    // ตรวจสอบประสบการณ์การเป็นโค้ช
    const coachExperience = formData.coachExperience ?? 0;
    if (coachExperience < 0) {
      newErrors.coachExperience = 'กรุณาระบุประสบการณ์ที่มากกว่าหรือเท่ากับ 0';
    }
    
    // ตรวจสอบจำนวนครั้งที่เข้าร่วมการแข่งขัน
    const participationCount = formData.participationCount ?? 0;
    if (participationCount < 0) {
      newErrors.participationCount = 'กรุณาระบุจำนวนครั้งที่มากกว่าหรือเท่ากับ 0';
    }
    
    // ตรวจสอบขนาดเสื้อ
    if (!formData.shirtSize) {
      newErrors.shirtSize = 'กรุณาเลือกขนาดเสื้อ';
    }
    
    // ตรวจสอบการเลือกรุ่นอบรม
    if (selectedBatchIds.length === 0 && trainingBatches.length > 0) {
      newErrors.selectedBatchIds = 'กรุณาเลือกอย่างน้อยหนึ่งรุ่นที่ต้องการเข้าอบรม';
    }
    
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.coachExperience, formData.participationCount, formData.shirtSize, selectedBatchIds, trainingBatches.length]);

  // ฟังก์ชัน Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isLastStep && onFinalSubmit) {
      await onFinalSubmit();
    } else {
      onNext();
    }
  };

  // ฟังก์ชันจัดการ Input Change
  const handleInputChange = useCallback((field: string, value: any) => {
    onUpdateFormData({ [field]: value });
  }, [onUpdateFormData]);
  
  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDateRange = (start: Date, end: Date) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const thaiLocale = 'th-TH';
    
    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
      return `วันที่ ${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleDateString(thaiLocale, { month: 'long', year: 'numeric' })}`;
    } else {
      return `${startDate.toLocaleDateString(thaiLocale, options)} - ${endDate.toLocaleDateString(thaiLocale, options)}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="coachExperience">
            ประสบการณ์การเป็นโค้ช (ปี) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="coachExperience"
            type="number"
            min="0"
            value={formData.coachExperience ?? 0}
            onChange={(e) =>
              handleInputChange("coachExperience", Number(e.target.value))
            }
          />
          {localErrors.coachExperience && (
            <p className="text-sm text-red-500">
             {localErrors.coachExperience}
           </p>
         )}
       </div>

       <div className="space-y-2">
         <Label htmlFor="participationCount">
           จำนวนครั้งที่เข้าร่วมการแข่งขัน{" "}
           <span className="text-red-500">*</span>
         </Label>
         <Input
           id="participationCount"
           type="number"
           min="0"
           value={formData.participationCount ?? 0}
           onChange={(e) =>
             handleInputChange("participationCount", Number(e.target.value))
           }
         />
         {localErrors.participationCount && (
           <p className="text-sm text-red-500">
             {localErrors.participationCount}
           </p>
         )}
       </div>
     </div>
     
     <div className="space-y-2">
       <Label htmlFor="shirtSize">
         ขนาดเสื้อ <span className="text-red-500">*</span>
       </Label>
       <Select
         value={formData.shirtSize || ''}
         onValueChange={(value) => handleInputChange("shirtSize", value)}
       >
         <SelectTrigger id="shirtSize" className="w-full">
           <SelectValue placeholder="กรุณาเลือกขนาดเสื้อ" />
         </SelectTrigger>
         <SelectContent title="ขนาดเสื้อ">
           <SelectItem value="M">M (รอบอก 38 นิ้ว)</SelectItem>
           <SelectItem value="L">L (รอบอก 40 นิ้ว)</SelectItem>
           <SelectItem value="XL">XL (รอบอก 42 นิ้ว)</SelectItem>
           <SelectItem value="XXL">2XL (รอบอก 44 นิ้ว)</SelectItem>
           <SelectItem value="XXXL">3XL (รอบอก 46 นิ้ว)</SelectItem>
           <SelectItem value="XXXXL">4XL (รอบอก 48 นิ้ว)</SelectItem>
           <SelectItem value="XXXXXL">5XL (รอบอก 50 นิ้ว)</SelectItem>
         </SelectContent>
       </Select>
       {localErrors.shirtSize && (
         <p className="text-sm text-red-500">{localErrors.shirtSize}</p>
       )}
     </div>
     
     {/* แสดงรุ่นที่เลือกแล้ว */}
     {selectedBatchIds.length > 0 && (
       <div className="bg-orange-50 rounded-lg border border-orange-100 p-4">
         <h3 className="font-medium text-orange-800 mb-2">รุ่นที่คุณเลือก ({selectedBatchIds.length})</h3>
         <div className="flex flex-wrap gap-2">
           {selectedBatchIds.map(id => {
             const batch = trainingBatches.find(b => b.id === id);
             return batch ? (
               <Badge 
                 key={id} 
                 className="bg-orange-100 text-orange-800 hover:bg-orange-200 pl-2 pr-1 py-1"
               >
                 <span>รุ่นที่ {batch.batchNumber}/{batch.year}</span>
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={(e) => {
                     e.preventDefault();
                     handleToggleBatch(id);
                   }}
                   className="h-5 w-5 p-0 ml-1 text-orange-800 hover:text-orange-900 rounded-full"
                 >
                   <X className="h-3 w-3" />
                 </Button>
               </Badge>
             ) : null;
           })}
         </div>
       </div>
     )}
     
     {/* รุ่นการอบรม */}
     <div className="space-y-2">
       <Label>
         รุ่นที่ต้องการเข้าอบรม <span className="text-red-500">*</span> <span className="text-gray-500 text-sm">(เลือกได้มากกว่า 1 รุ่น)</span>
       </Label>
       {localErrors.selectedBatchIds && (
         <p className="text-sm text-red-500">{localErrors.selectedBatchIds}</p>
       )}
       
       {trainingBatches.length > 0 ? (
         <div className="space-y-3 mt-2">
           {trainingBatches.map((batch) => (
             <div 
               key={batch.id} 
               className={`border rounded-lg p-4 transition-colors ${
                 selectedBatchIds.includes(batch.id) 
                   ? 'border-orange-300 bg-orange-50' 
                   : 'border-gray-200 hover:border-orange-200'
               }`}
             >
               <div className="flex items-start">
                 <Checkbox 
                   id={`batch-${batch.id}`}
                   checked={selectedBatchIds.includes(batch.id)}
                   onCheckedChange={() => handleToggleBatch(batch.id)}
                   className="mt-1"
                 />
                 <div className="ml-3 flex-1">
                   <Label 
                     htmlFor={`batch-${batch.id}`} 
                     className={`font-medium text-lg cursor-pointer ${
                       selectedBatchIds.includes(batch.id) ? 'text-orange-800' : 'text-gray-800'
                     }`}
                   >
                     รุ่นที่ {batch.batchNumber}/{batch.year}
                   </Label>
                   <div className="mt-2 text-gray-700 space-y-1">
                     <div className="flex items-center">
                       <CalendarDays className="h-4 w-4 mr-2 text-orange-600" />
                       {formatDateRange(batch.startDate, batch.endDate)}
                     </div>
                     <div className="flex items-center">
                       <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                       {batch.location}
                     </div>
                     <div className="flex items-center">
                       <Users className="h-4 w-4 mr-2 text-orange-600" />
                       รับสมัคร {batch.maxParticipants} คน
                     </div>
                   </div>
                   {batch.description && (
                     <div className="mt-2 text-sm text-gray-600 pt-2 border-t border-gray-100">
                       {batch.description}
                     </div>
                   )}
                   
                   {/* สถานะการลงทะเบียน */}
                   <div className="flex justify-end mt-2">
                     <Badge className={
                       selectedBatchIds.includes(batch.id)
                         ? "bg-green-100 text-green-800 hover:bg-green-200"
                         : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                     }>
                       {selectedBatchIds.includes(batch.id) ? 'เลือกแล้ว' : 'ยังไม่ได้เลือก'}
                     </Badge>
                   </div>
                 </div>
               </div>
             </div>
           ))}
         </div>
       ) : isLoadingBatches ? (
         <div className="py-4 text-center">
           <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
           <p className="text-gray-500">กำลังโหลดข้อมูลรุ่นการอบรม...</p>
         </div>
       ) : (
         <Alert variant="warning" className="bg-amber-50 border-amber-200">
           <AlertTitle className="text-amber-800">ไม่พบรุ่นการอบรมที่เปิดรับสมัคร</AlertTitle>
           <AlertDescription className="text-amber-700">
             ขณะนี้ไม่มีรุ่นการอบรมที่เปิดรับสมัคร คุณสามารถลงทะเบียนข้อมูลไว้ก่อนและกลับมาสมัครเข้าร่วมการอบรมได้ในภายหลัง
           </AlertDescription>
         </Alert>
       )}
     </div>
     
     <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
       <Checkbox
         id="accommodation"
         checked={accommodation}
         onCheckedChange={(checked) => {
           setAccommodation(checked === true);
         }}
       />
       <div className="space-y-1 leading-none">
         <Label htmlFor="accommodation">ต้องการเข้าพัก</Label>
         <p className="text-sm text-gray-500">
           เลือกหากคุณต้องการให้ทางโครงการจัดที่พักให้
         </p>
       </div>
     </div>
     
     <div className="space-y-2">
       <Label htmlFor="expectations">ความคาดหวังจากการอบรม</Label>
       <Textarea
         id="expectations"
         placeholder="กรอกความคาดหวังของคุณจากการอบรมครั้งนี้"
         value={formData.expectations || ""}
         onChange={(e) => handleInputChange("expectations", e.target.value)}
       />
     </div>
     
     <div className="flex justify-between pt-4">
       <Button
         type="button"
         variant="outline"
         onClick={onPrevious}
         className="transition-all hover:border-gray-400"
       >
         <div className="flex items-center">
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
             className="mr-1"
           >
             <path d="M19 12H5"></path>
             <path d="m12 19-7-7 7-7"></path>
           </svg>
           <span>ย้อนกลับ</span>
         </div>
       </Button>

       <Button
         type="submit"
         disabled={isSubmitting}
         className={`group transition-all duration-200 ${
           !isLastStep ? "hover:shadow-md hover:bg-orange-500" : ""
         }`}
       >
         {isSubmitting ? (
           <div className="flex items-center">
             <svg
               className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
             >
               <circle
                 className="opacity-25"
                 cx="12"
                 cy="12"
                 r="10"
                 stroke="currentColor"
                 strokeWidth="4"
               ></circle>
               <path
                 className="opacity-75"
                 fill="currentColor"
                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
               ></path>
             </svg>
             กำลังบันทึก...
           </div>
         ) : isLastStep ? (
           <div className="flex items-center">
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
               className="mr-1"
             >
               <path d="M20 6 9 17l-5-5"></path>
             </svg>
             บันทึกข้อมูล
           </div>
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