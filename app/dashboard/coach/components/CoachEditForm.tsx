// app/dashboard/coach/components/CoachEditForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/app/components/ui/alert';
import { Tabs,TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/taps';
import { Card, CardContent } from '@/app/components/ui/card';
import { Save, User, Phone, MapPin, Award, Heart, Calendar } from 'lucide-react';
import { updateCoach } from '@/app/coach/actions/coach/update';
import { getActiveTrainingBatches } from '@/app/coach/actions/training-batch/get-active';
import { TrainingBatchWithCount } from '@/app/coach/types/training-batch';
import { Coach } from '@/app/coach/types/coach';

interface CoachEditFormProps {
 coach: Coach;
 isAdmin: boolean;
}

interface FormDataState {
 id: string;
 nickname: string;
 teamName: string;
 gender: string;
 age: string;
 idCardNumber: string;
 address: string;
 phoneNumber: string;
 lineId: string;
 religion: string;
 hasMedicalCondition: string;
 medicalCondition: string;
 foodPreference: string;
 coachStatus: string;
 coachExperience: string;
 participationCount: string;
 accommodation: string;
 shirtSize: string;
 expectations: string;
 district: string;
 amphoe: string;
 province: string;
 zone: string;
 selectedBatchIds: number[];
}

export default function CoachEditForm({ coach, isAdmin }: CoachEditFormProps) {
 const router = useRouter();
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');
 const [availableBatches, setAvailableBatches] = useState<TrainingBatchWithCount[]>([]);
 const [loadingBatches, setLoadingBatches] = useState(true);
 
 // รายการรุ่นที่โค้ชลงทะเบียนแล้ว (ถ้ามี)
 const registeredBatchIds = (coach.batchParticipations || []).map(p => p.batchId);
 
 const [formData, setFormData] = useState<FormDataState>({
   id: coach.id?.toString() || '',
   nickname: coach.nickname || '',
   teamName: coach.teamName || '',
   gender: coach.gender,
   age: coach.age.toString(),
   idCardNumber: coach.idCardNumber,
   address: coach.address,
   phoneNumber: coach.phoneNumber,
   lineId: coach.lineId || '',
   religion: coach.religion,
   hasMedicalCondition: coach.hasMedicalCondition ? 'true' : 'false',
   medicalCondition: coach.medicalCondition || '',
   foodPreference: coach.foodPreference,
   coachStatus: coach.coachStatus,
   coachExperience: coach.coachExperience.toString(),
   participationCount: coach.participationCount.toString(),
   accommodation: coach.accommodation ? 'true' : 'false',
   shirtSize: coach.shirtSize,
   expectations: coach.expectations || '',
   district: coach.location?.district || '',
   amphoe: coach.location?.amphoe || '',
   province: coach.location?.province || '',
   zone: coach.location?.zone || '',
   selectedBatchIds: registeredBatchIds
 });
 
// ดึงข้อมูลรุ่นอบรมที่เปิดรับสมัคร
useEffect(() => {
  const fetchBatches = async () => {
    try {
      setLoadingBatches(true);
      const response = await getActiveTrainingBatches();
      
      if (response && response.success) {
        // แก้ไขขีดเส้นแดงโดยทำ type casting ให้ชัดเจน
        setAvailableBatches(response.data as TrainingBatchWithCount[] || []);
      }
    } catch (error) {
      console.error('Error loading training batches:', error);
    } finally {
      setLoadingBatches(false);
    }
  };
  
  fetchBatches();
}, []);
 
 const handleInputChange = (field: keyof FormDataState, value: any) => {
   setFormData(prev => ({
     ...prev,
     [field]: value
   }));
 };
 
 // จัดการการเลือก/ยกเลิกการเลือกรุ่นอบรม
 const handleBatchSelection = (batchId: number) => {
   const currentSelection = [...formData.selectedBatchIds];
   
   if (currentSelection.includes(batchId)) {
     // ถ้ามีอยู่แล้ว ให้ลบออก
     const newSelection = currentSelection.filter(id => id !== batchId);
     handleInputChange('selectedBatchIds', newSelection);
   } else {
     // ถ้ายังไม่มี ให้เพิ่มเข้าไป
     const newSelection = [...currentSelection, batchId];
     handleInputChange('selectedBatchIds', newSelection);
   }
 };

 // ฟังก์ชันจัดรูปแบบวันที่
 const formatDateRange = (start: string | Date, end: string | Date) => {
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

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setIsSubmitting(true);
   setError('');
   setSuccess('');
   
   try {
     // สร้าง FormData จากข้อมูลใน state
     const submitData = new FormData();
     
     // เพิ่มข้อมูลทั้งหมดเข้าไปใน FormData
     Object.entries(formData).forEach(([key, value]) => {
       if (key === 'selectedBatchIds' && Array.isArray(value)) {
         // กรณีเป็น array ของ batchIds
         value.forEach(batchId => {
           submitData.append('selectedBatchIds[]', batchId.toString());
         });
       } else {
         submitData.append(key, value.toString());
       }
     });
     
     // เรียกใช้ server action
     const result = await updateCoach(submitData);
     
     if (result.success) {
       setSuccess('บันทึกข้อมูลสำเร็จ');
       // รีเฟรชข้อมูล
       router.refresh();
       
       // กลับไปยังหน้ารายละเอียดหลังจาก 1.5 วินาที
       setTimeout(() => {
         router.push(`/dashboard/coach/${coach.id}`);
       }, 1500);
     } else {
       setError(result.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
     }
   } catch (err) {
     setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
     console.error(err);
   } finally {
     setIsSubmitting(false);
   }
 };

 return (
   <form onSubmit={handleSubmit}>
     {error && (
       <Alert variant="destructive" className="mb-6">
         <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
         <AlertDescription>{error}</AlertDescription>
       </Alert>
     )}
     
     {success && (
       <Alert variant="success" className="mb-6">
         <AlertTitle>สำเร็จ</AlertTitle>
         <AlertDescription>{success}</AlertDescription>
       </Alert>
     )}
     
     <Tabs defaultValue="personal">
       <TabsList className="mb-6">
         <TabsTrigger value="personal" className="flex items-center gap-2">
           <User className="h-4 w-4" />
           ข้อมูลส่วนตัว
         </TabsTrigger>
         <TabsTrigger value="contact" className="flex items-center gap-2">
           <Phone className="h-4 w-4" />
           ข้อมูลติดต่อ
         </TabsTrigger>
         <TabsTrigger value="location" className="flex items-center gap-2">
           <MapPin className="h-4 w-4" />
           ที่อยู่
         </TabsTrigger>
         <TabsTrigger value="coaching" className="flex items-center gap-2">
           <Award className="h-4 w-4" />
           ข้อมูลการเป็นโค้ช
         </TabsTrigger>
         <TabsTrigger value="batches" className="flex items-center gap-2">
           <Calendar className="h-4 w-4" />
           รุ่นอบรม
         </TabsTrigger>
         <TabsTrigger value="preferences" className="flex items-center gap-2">
           <Heart className="h-4 w-4" />
           ข้อมูลอื่นๆ
         </TabsTrigger>
       </TabsList>
       
       <TabsContent value="personal">
         <Card>
           <CardContent className="pt-6 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <Label htmlFor="nickname">ชื่อเล่น</Label>
                 <Input
                   id="nickname"
                   value={formData.nickname}
                   onChange={(e) => handleInputChange('nickname', e.target.value)}
                 />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="teamName">ชื่อทีม</Label>
                 <Input
                   id="teamName"
                   value={formData.teamName}
                   onChange={(e) => handleInputChange('teamName', e.target.value)}
                 />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="gender">เพศ</Label>
                 <Select
                   value={formData.gender}
                   onValueChange={(value) => handleInputChange('gender', value)}
                 >
                   <SelectTrigger id="gender">
                     <SelectValue placeholder="เลือกเพศ" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="MALE">ชาย</SelectItem>
                     <SelectItem value="FEMALE">หญิง</SelectItem>
                     <SelectItem value="LGBTQ">LGBTQ+</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="age">อายุ</Label>
                 <Input
                   id="age"
                   type="number"
                   min="1"
                   value={formData.age}
                   onChange={(e) => handleInputChange('age', e.target.value)}
                 />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="idCardNumber">เลขบัตรประชาชน</Label>
                 <Input
                   id="idCardNumber"
                   value={formData.idCardNumber}
                   onChange={(e) => handleInputChange('idCardNumber', e.target.value)}
                   disabled={!isAdmin} // เฉพาะแอดมินเท่านั้นที่สามารถแก้ไขได้
                 />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="religion">ศาสนา</Label>
                 <Select
                   value={formData.religion}
                   onValueChange={(value) => handleInputChange('religion', value)}
                 >
                   <SelectTrigger id="religion">
                     <SelectValue placeholder="เลือกศาสนา" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="BUDDHIST">พุทธ</SelectItem>
                     <SelectItem value="CHRISTIAN">คริสต์</SelectItem>
                     <SelectItem value="ISLAM">อิสลาม</SelectItem>
                     <SelectItem value="HINDU">ฮินดู</SelectItem>
                     <SelectItem value="OTHER">อื่นๆ</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>
           </CardContent>
         </Card>
       </TabsContent>
       
       <TabsContent value="contact">
         <Card>
           <CardContent className="pt-6 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <Label htmlFor="phoneNumber">เบอร์โทรศัพท์</Label>
                 <Input
                   id="phoneNumber"
                   value={formData.phoneNumber}
                   onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                 />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="lineId">LINE ID</Label>
                 <Input
                   id="lineId"
                   value={formData.lineId}
                   onChange={(e) => handleInputChange('lineId', e.target.value)}
                 />
               </div>
               
               <div className="md:col-span-2 space-y-2">
                 <Label htmlFor="address">ที่อยู่ตามบัตรประชาชน</Label>
                 <Textarea
                   id="address"
                   value={formData.address}
                   onChange={(e) => handleInputChange('address', e.target.value)}
                   rows={3}
                 />
               </div>
             </div>
           </CardContent>
         </Card>
       </TabsContent>
       
       <TabsContent value="location">
         <Card>
           <CardContent className="pt-6 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                 <Label htmlFor="province">จังหวัด</Label>
                 <Input
                   id="province"
                   value={formData.province}
                   onChange={(e) => handleInputChange('province', e.target.value)}
                 />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="amphoe">อำเภอ/เขต</Label>
                 <Input
                   id="amphoe"
                   value={formData.amphoe}
                   onChange={(e) => handleInputChange('amphoe', e.target.value)}
                 />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="district">ตำบล/แขวง</Label>
                 <Input
                   id="district"
                   value={formData.district}
                   onChange={(e) => handleInputChange('district', e.target.value)}
                 />
               </div>
             </div>
           </CardContent>
         </Card>
       </TabsContent>
       
       <TabsContent value="coaching">
         <Card>
           <CardContent className="pt-6 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <Label htmlFor="coachStatus">สถานะโค้ช</Label>
                 <Select
                   value={formData.coachStatus}
                   onValueChange={(value) => handleInputChange('coachStatus', value)}
                 >
                   <SelectTrigger id="coachStatus">
                     <SelectValue placeholder="เลือกสถานะการเป็นโค้ช" />
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
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="coachExperience">ประสบการณ์การเป็นโค้ช (ปี)</Label>
                 <Input
                   id="coachExperience"
                   type="number"
                   min="0"
                   value={formData.coachExperience}
                   onChange={(e) => handleInputChange('coachExperience', e.target.value)}
                 />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="participationCount">จำนวนครั้งที่เข้าร่วมการแข่งขัน</Label>
                 <Input
                   id="participationCount"
                   type="number"
                   min="0"
                   value={formData.participationCount}
                   onChange={(e) => handleInputChange('participationCount', e.target.value)}
                 />
               </div>
             </div>
           </CardContent>
         </Card>
       </TabsContent>
       
       <TabsContent value="batches">
         <Card>
           <CardContent className="pt-6 space-y-4">
             <h3 className="text-lg font-medium mb-4">เลือกรุ่นอบรม</h3>
             
             {loadingBatches ? (
               <div className="flex justify-center items-center py-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
               </div>
             ) : availableBatches.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {availableBatches.map(batch => {
                   const isSelected = formData.selectedBatchIds.includes(batch.id);
                   const participantsCount = batch._count?.participants || 0;
                   const isFull = participantsCount >= batch.maxParticipants;
                   const seatsRemaining = Math.max(0, batch.maxParticipants - participantsCount);
                   
                   return (
                     <div 
                       key={batch.id}
                       className={`p-4 border rounded-lg transition-all ${
                         isSelected 
                           ? 'border-orange-500 bg-orange-50' 
                           : isFull
                             ? 'border-gray-200 bg-gray-50 opacity-75'
                             : 'border-gray-200 hover:border-orange-300'
                       }`}
                     >
                       <div className="flex items-start">
                         <Checkbox
                           id={`batch-${batch.id}`}
                           checked={isSelected}
                           onCheckedChange={() => handleBatchSelection(batch.id)}
                           disabled={!isSelected && isFull}
                           className="mt-1"
                         />
                         <div className="ml-3 flex-1">
                           <Label 
                             htmlFor={`batch-${batch.id}`}
                             className={`font-medium ${!isSelected && isFull ? 'text-gray-500' : 'text-gray-900'}`}
                           >
                             รุ่นที่ {batch.batchNumber}/{batch.year}
                           </Label>
                           
                           <div className="mt-1 space-y-1 text-sm">
                             <div className="flex items-center text-gray-600">
                               <Calendar className="h-3.5 w-3.5 mr-1.5" />
                               {formatDateRange(batch.startDate, batch.endDate)}
                             </div>
                             
                             <div className="flex items-center text-gray-600">
                               <MapPin className="h-3.5 w-3.5 mr-1.5" />
                               {batch.location}
                             </div>
                             
                             <div className={`mt-2 text-xs ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                               {isFull ? (
                                 'เต็มแล้ว'
                               ) : (
                                 `เหลือ ${seatsRemaining} ที่นั่ง`
                               )}
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   );
                 })}
               </div>
             ) : (
               <div className="text-center py-6 bg-gray-50 rounded border border-gray-200">
                 <p className="text-gray-600">ไม่พบรุ่นอบรมที่เปิดรับสมัคร</p>
               </div>
             )}
           </CardContent>
         </Card>
       </TabsContent>
       
       <TabsContent value="preferences">
         <Card>
           <CardContent className="pt-6 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <Label htmlFor="foodPreference">ประเภทอาหาร</Label>
                 <Select
                   value={formData.foodPreference}
                   onValueChange={(value) => handleInputChange('foodPreference', value)}
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
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="shirtSize">ขนาดเสื้อ</Label>
                 <Select
                   value={formData.shirtSize}
                   onValueChange={(value) => handleInputChange('shirtSize', value)}
                 >
                   <SelectTrigger id="shirtSize">
                     <SelectValue placeholder="เลือกขนาดเสื้อ" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="M">M (รอบอก 38 นิ้ว)</SelectItem>
                     <SelectItem value="L">L (รอบอก 40 นิ้ว)</SelectItem>
                     <SelectItem value="XL">XL (รอบอก 42 นิ้ว)</SelectItem>
                     <SelectItem value="XXL">2XL (รอบอก 44 นิ้ว)</SelectItem>
                     <SelectItem value="XXXL">3XL (รอบอก 46 นิ้ว)</SelectItem>
                     <SelectItem value="XXXXL">4XL (รอบอก 48 นิ้ว)</SelectItem>
                     <SelectItem value="XXXXXL">5XL (รอบอก 50 นิ้ว)</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               
               <div className="flex items-center space-x-2">
                 <Checkbox
                   id="accommodation"
                   checked={formData.accommodation === 'true'}
                   onCheckedChange={(checked) => handleInputChange('accommodation', checked ? 'true' : 'false')}
                 />
                 <Label htmlFor="accommodation" className="font-medium">
                   ต้องการเข้าพัก
                 </Label>
               </div>
               
               <div className="flex items-center space-x-2">
                 <Checkbox
                   id="hasMedicalCondition"
                   checked={formData.hasMedicalCondition === 'true'}
                   onCheckedChange={(checked) => handleInputChange('hasMedicalCondition', checked ? 'true' : 'false')}
                 />
                 <Label htmlFor="hasMedicalCondition" className="font-medium">
                   มีโรคประจำตัว
                 </Label>
               </div>
               
               {formData.hasMedicalCondition === 'true' && (
                 <div className="md:col-span-2 space-y-2">
                   <Label htmlFor="medicalCondition">รายละเอียดโรคประจำตัว</Label>
                   <Textarea
                     id="medicalCondition"
                     value={formData.medicalCondition}
                     onChange={(e) => handleInputChange('medicalCondition', e.target.value)}
                     rows={3}
                   />
                 </div>
               )}
               
               <div className="md:col-span-2 space-y-2">
                 <Label htmlFor="expectations">ความคาดหวังจากการอบรม</Label>
                 <Textarea
                   id="expectations"
                   value={formData.expectations}
                   onChange={(e) => handleInputChange('expectations', e.target.value)}
                   rows={3}
                 />
               </div>
             </div>
           </CardContent>
         </Card>
       </TabsContent>
     </Tabs>
     
     <div className="flex justify-end mt-6 space-x-2">
       <Button type="button" variant="outline" onClick={() => router.back()}>
         ยกเลิก
       </Button>
       <Button 
         type="submit" 
         className="bg-orange-600 hover:bg-orange-700"
         disabled={isSubmitting}
       >
         {isSubmitting ? (
           <span className="flex items-center gap-2">
             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             กำลังบันทึก...
           </span>
         ) : (
           <span className="flex items-center gap-2">
             <Save className="h-4 w-4" />
             บันทึกข้อมูล
           </span>
         )}
       </Button>
     </div>
   </form>
 );
}