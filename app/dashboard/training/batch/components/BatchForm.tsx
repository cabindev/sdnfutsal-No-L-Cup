// app/dashboard/training/batch/components/BatchForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';
import { createBatch } from '@/app/coach/actions/training-batch/create';
import { updateBatch } from '@/app/coach/actions/training-batch/update';
import { toast } from 'sonner';
import { CalendarDays, MapPin, Users, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';

interface BatchFormData {
  id?: string;
  batchNumber: string;
  year: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  registrationEndDate: string;
  description: string;
  isActive: boolean;
}

interface BatchFormProps {
  initialData?: BatchFormData;
  batch?: any; // รองรับกรณีได้รับ batch โดยตรง
  isEditing?: boolean;
}

export function BatchForm({ initialData, batch, isEditing = false }: BatchFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // สร้าง form data เริ่มต้น
  const defaultFormData: BatchFormData = {
    batchNumber: '',
    year: '',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: 30,
    registrationEndDate: '',
    description: '',
    isActive: true
  };
  
  // กำหนดค่าเริ่มต้นจาก initialData หรือ defaultFormData
  const [formData, setFormData] = useState<BatchFormData>(
    initialData || defaultFormData
  );
  
  // แปลงข้อมูล batch เป็น formData ถ้าได้รับ batch โดยตรง
  useEffect(() => {
    if (batch && !initialData) {
      try {
        const formattedData = {
          id: batch.id.toString(),
          batchNumber: batch.batchNumber.toString(),
          year: batch.year.toString(),
          startDate: new Date(batch.startDate).toISOString().split('T')[0],
          endDate: new Date(batch.endDate).toISOString().split('T')[0],
          location: batch.location,
          maxParticipants: batch.maxParticipants,
          registrationEndDate: new Date(batch.registrationEndDate).toISOString().split('T')[0],
          description: batch.description || '',
          isActive: batch.isActive
        };
        setFormData(formattedData);
      } catch (error) {
        console.error('Error formatting batch data:', error);
        toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูลรุ่นอบรม');
      }
    }
  }, [batch, initialData]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.batchNumber) {
      newErrors.batchNumber = 'กรุณาระบุรุ่นที่';
    }
    
    if (!formData.year) {
      newErrors.year = 'กรุณาระบุปี';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'กรุณาระบุวันที่เริ่มอบรม';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'กรุณาระบุวันที่สิ้นสุดการอบรม';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'วันที่สิ้นสุดต้องมาหลังวันที่เริ่มต้น';
    }
    
    if (!formData.location) {
      newErrors.location = 'กรุณาระบุสถานที่จัดอบรม';
    }
    
    if (!formData.maxParticipants || formData.maxParticipants < 1) {
      newErrors.maxParticipants = 'กรุณาระบุจำนวนผู้เข้าร่วมสูงสุดที่มากกว่า 0';
    }
    
    if (!formData.registrationEndDate) {
      newErrors.registrationEndDate = 'กรุณาระบุวันสิ้นสุดการรับสมัคร';
    } else if (formData.startDate && new Date(formData.registrationEndDate) > new Date(formData.startDate)) {
      newErrors.registrationEndDate = 'วันสิ้นสุดการรับสมัครต้องมาก่อนวันที่เริ่มอบรม';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // สร้าง FormData
      const submitData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'boolean') {
            submitData.append(key, value.toString());
          } else {
            submitData.append(key, value.toString());
          }
        }
      });
      
      let result;
      
      if (isEditing) {
        result = await updateBatch(submitData);
      } else {
        result = await createBatch(submitData);
      }
      
      if (result.success) {
        toast.success(isEditing ? 'อัปเดตรุ่นอบรมเรียบร้อยแล้ว' : 'สร้างรุ่นอบรมใหม่เรียบร้อยแล้ว');
        
        // นำทางกลับไปยังหน้ารายการหรือหน้ารายละเอียด
        if (isEditing && formData.id) {
          router.push(`/dashboard/training/batch/${formData.id}`);
        } else {
          router.push('/dashboard/training/batch');
        }
        
        router.refresh();
      } else {
        toast.error(result.error || 'เกิดข้อผิดพลาด โปรดลองอีกครั้ง');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Debugging - แสดงข้อมูลใน console เมื่อ formData เปลี่ยนแปลง
  useEffect(() => {
    console.log('Current form data:', formData);
  }, [formData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isEditing && formData.id && (
        <input type="hidden" name="id" value={formData.id} />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="batchNumber">
            รุ่นที่ <span className="text-red-500">*</span>
          </Label>
          <Input
            id="batchNumber"
            type="number"
            min="1"
            value={formData.batchNumber}
            onChange={(e) => handleInputChange('batchNumber', e.target.value)}
            placeholder="เช่น 1, 2, 3"
          />
          {errors.batchNumber && (
            <p className="text-sm text-red-500">{errors.batchNumber}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">
            ปี (พ.ศ.) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="year"
            type="number"
            min="2500"
            value={formData.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
            placeholder="เช่น 2567"
          />
          {errors.year && (
            <p className="text-sm text-red-500">{errors.year}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">
            วันที่เริ่มอบรม <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 text-gray-400 mr-2" />
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">
            วันที่สิ้นสุดการอบรม <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 text-gray-400 mr-2" />
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />
          </div>
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="registrationEndDate">
            วันสิ้นสุดการรับสมัคร <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 text-gray-400 mr-2" />
            <Input
              id="registrationEndDate"
              type="date"
              value={formData.registrationEndDate}
              onChange={(e) => handleInputChange('registrationEndDate', e.target.value)}
            />
          </div>
          {errors.registrationEndDate && (
            <p className="text-sm text-red-500">{errors.registrationEndDate}</p>
          )}
          <p className="text-xs text-gray-500">ควรกำหนดวันสิ้นสุดการรับสมัครก่อนวันเริ่มการอบรม</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxParticipants">
            จำนวนผู้เข้าร่วมสูงสุด <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-400 mr-2" />
            <Input
              id="maxParticipants"
              type="number"
              min="1"
              value={formData.maxParticipants}
              onChange={(e) => handleInputChange('maxParticipants', Number(e.target.value))}
            />
          </div>
          {errors.maxParticipants && (
            <p className="text-sm text-red-500">{errors.maxParticipants}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">
          สถานที่จัดอบรม <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="เช่น สนามกีฬาแห่งชาติ, กรุงเทพฯ"
          />
        </div>
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">รายละเอียดเพิ่มเติม</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับการอบรม เช่น กำหนดการ ข้อมูลที่พัก ฯลฯ"
          rows={4}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => handleInputChange('isActive', Boolean(checked))}
        />
        <Label htmlFor="isActive">เปิดรับสมัคร</Label>
      </div>
      
      <Alert className="bg-orange-50 border-orange-200 text-orange-800">
        <AlertTitle>ข้อมูลสำคัญ</AlertTitle>
        <AlertDescription className="text-orange-700">
          {isEditing ? (
            <>
              คุณสามารถเก็บรุ่นการอบรมในอดีตไว้ในระบบได้โดยยกเลิกการเลือก "เปิดรับสมัคร" 
              ซึ่งจะทำให้รุ่นนี้ไม่ปรากฏในหน้าลงทะเบียนโค้ช แต่ยังคงเก็บข้อมูลไว้ในระบบ
            </>
          ) : (
            <>
              รุ่นที่เปิดรับสมัครจะปรากฏในหน้าลงทะเบียนโค้ชทันที หากยังไม่ต้องการเปิดรับสมัคร 
              ให้ยกเลิกการเลือก "เปิดรับสมัคร"
            </>
          )}
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-end pt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => {
            if (isEditing && formData.id) {
              router.push(`/dashboard/training/batch/${formData.id}`);
            } else {
              router.push('/dashboard/training/batch');
            }
          }}
          className="mr-2"
        >
          ยกเลิก
        </Button>
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-futsal-orange hover:bg-futsal-orange/90"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังบันทึก...
            </div>
          ) : (
            <div className="flex items-center">
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "บันทึกการแก้ไข" : "สร้างรุ่นอบรม"}
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}