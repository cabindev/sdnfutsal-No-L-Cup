// app/dashboard/coach/components/CoachEditForm.tsx
'use client';

import { useState } from 'react';
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
import { Save, User, Phone, MapPin, Award, Heart } from 'lucide-react';
import { updateCoach } from '@/app/coach/actions/coach/update';

interface Coach {
  id: number;
  userId: number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
  };
  teamName?: string;
  nickname?: string;
  gender: string;
  age: number;
  idCardNumber: string;
  address: string;
  phoneNumber: string;
  lineId?: string;
  religion: string;
  hasMedicalCondition: boolean;
  medicalCondition?: string;
  foodPreference: string;
  coachStatus: string;
  coachExperience: number;
  participationCount: number;
  accommodation: boolean;
  shirtSize: string;
  expectations?: string;
  location?: {
    district: string;
    amphoe: string;
    province: string;
    zone?: string;
  };
  locationId?: number;
  isApproved: boolean;
  registrationCompleted: boolean;
}

interface CoachEditFormProps {
  coach: Coach;
  isAdmin: boolean;
}

export default function CoachEditForm({ coach, isAdmin }: CoachEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    id: coach.id.toString(),
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
  });
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
        submitData.append(key, value);
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