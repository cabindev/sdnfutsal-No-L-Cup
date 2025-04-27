// app/dashboard/setting/profile/page.tsx
'use client'

import { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { UserIcon, ShieldCheckIcon, CalendarIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import DashboardLoading from "../../loading";

export default function ProfileSettingPage() {
  const { data: session, update } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/auth/signup/${session.user.id}`)
        .then(async res => {
          if (!res.ok) {
            const errorText = await res.text();
            console.error('API Error:', res.status, errorText);
            throw new Error(`API error: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (data) {
            setUser(data);
            setFormData({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              image: null
            });
            if (data.image) {
              setImagePreview(data.image);
            }
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching user data:", err);
          setError("ไม่สามารถดึงข้อมูลผู้ใช้ได้ โปรดลองใหม่อีกครั้ง");
          setLoading(false);
        });
    }
  }, [session]);

  const compressImage = async (file: File): Promise<File> => {
    setCompressing(true);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // ปรับขนาดภาพถ้าจำเป็น
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setCompressing(false);
            reject(new Error('ไม่สามารถสร้าง canvas context ได้'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // ลดคุณภาพทีละนิดจนกว่าจะได้ขนาดที่ต้องการ
          let quality = 0.9;
          let dataUrl;
          let blob;
          let compressedFile;
          const fileType = file.type || 'image/jpeg';
          
          // ฟังก์ชันเพื่อทดสอบขนาดไฟล์
          const tryQuality = () => {
            dataUrl = canvas.toDataURL(fileType, quality);
            
            // แปลง Data URL เป็น Blob
            const byteString = atob(dataUrl.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            
            blob = new Blob([ab], { type: fileType });
            
            // แปลง Blob เป็น File
            compressedFile = new File([blob], file.name, {
              type: fileType,
              lastModified: Date.now()
            });
            
            if (compressedFile.size > 500000 && quality > 0.1) {
              // ลดคุณภาพและลองอีกครั้ง
              quality -= 0.1;
              setTimeout(tryQuality, 0);
            } else {
              setCompressing(false);
              resolve(compressedFile);
            }
          };
          
          tryQuality();
        };
        
        img.onerror = (imgError) => {
          setCompressing(false);
          reject(imgError);
        };
      };
      
      reader.onerror = (readerError) => {
        setCompressing(false);
        reject(readerError);
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ตรวจสอบประเภทไฟล์
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('กรุณาอัพโหลดไฟล์รูปภาพ (JPG, PNG, WEBP)');
        return;
      }

      // แสดงตัวอย่างรูปภาพทันทีก่อนการบีบอัด
      const tempReader = new FileReader();
      tempReader.onloadend = () => {
        setImagePreview(tempReader.result as string);
      };
      tempReader.readAsDataURL(file);

      try {
        // บีบอัดรูปภาพ
        const compressedFile = await compressImage(file);
        
        // อัปเดตฟอร์มด้วยไฟล์ที่ถูกบีบอัดแล้ว
        setFormData({ ...formData, image: compressedFile });
        
        // แสดงตัวอย่างรูปภาพที่บีบอัดแล้ว
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
        
        // ล้างข้อความแจ้งเตือนถ้ามี
        setError(null);
      } catch (err) {
        console.error('ไม่สามารถบีบอัดรูปภาพได้:', err);
        setError('เกิดข้อผิดพลาดในการประมวลผลรูปภาพ');
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    if (!session?.user?.id) {
      setError("ไม่พบข้อมูลผู้ใช้");
      setSaving(false);
      return;
    }
    
    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await fetch(`/api/auth/signup/${session.user.id}`, {
        method: 'PUT',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Update error:', response.status, errorData);
        throw new Error('ไม่สามารถอัปเดตข้อมูลได้');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      
      // อัปเดต session
      await update({
        ...session,
        user: {
          ...session.user,
          name: `${updatedUser.firstName} ${updatedUser.lastName}`,
          image: updatedUser.image,
        },
      });

      setSuccess(true);
      // ให้ข้อความความสำเร็จหายไปหลังจาก 3 วินาที
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('ไม่สามารถอัปเดตข้อมูลได้ โปรดลองอีกครั้ง');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <DashboardLoading />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/dashboard/profile" className="inline-flex items-center text-futsal-blue hover:text-futsal-navy transition-colors">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          <span className="text-sm">กลับสู่โปรไฟล์</span>
        </Link>
      </div>
      
      <div className="bg-gradient-to-r from-futsal-navy to-futsal-blue text-white p-5 rounded-t-lg shadow-md">
        <h1 className="text-xl font-bold">ตั้งค่าโปรไฟล์โค้ช</h1>
        <p className="mt-1 text-blue-100 text-sm">จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ</p>
      </div>

      <div className="bg-white rounded-b-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ข้อมูลส่วนตัวและการตั้งค่า */}
          <div className="md:col-span-1 p-5 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="h-28 w-28 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md ring-2 ring-futsal-blue/20">
                  {imagePreview ? (
                    <img 
                      src={imagePreview.startsWith('data:') ? imagePreview : imagePreview} 
                      alt={`${user?.firstName || ''} ${user?.lastName || ''}`} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-12 w-12 text-gray-400">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                          </div>`;
                        }
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200">
                      <UserIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                {user && user.role === 'ADMIN' && (
                  <div className="absolute bottom-0 right-0 bg-futsal-orange text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm border border-white">
                    แอดมิน
                  </div>
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-800">{user?.firstName || ''} {user?.lastName || ''}</h2>
              <p className="text-sm text-gray-500 mt-1">{user?.email || ''}</p>
              
              <div className="w-full mt-5 space-y-2 text-left">
                <div className="flex items-center text-gray-600 text-sm">
                  <ShieldCheckIcon className="h-4 w-4 mr-2 text-futsal-blue" />
                  <span>สิทธิ์: {user?.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'โค้ชฟุตซอล'}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <CalendarIcon className="h-4 w-4 mr-2 text-futsal-blue" />
                  <span>สมัครเมื่อ: {user?.createdAt ? formatDate(user.createdAt) : ''}</span>
                </div>
              </div>

              <div className="w-full mt-4 space-y-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700">การยืนยันตัวตน</h3>
                  <div className="mt-1 flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-futsal-green mr-1.5" />
                    <span className="text-xs text-gray-600">อีเมล: {user?.emailVerified ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน'}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700">การรักษาความปลอดภัย</h3>
                  <div className="mt-1">
                    <Link href="/auth/reset-password" className="text-xs text-futsal-blue hover:text-futsal-navy transition-colors">
                      เปลี่ยนรหัสผ่าน
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* แก้ไขข้อมูลส่วนตัว */}
          <div className="md:col-span-2 p-5">
            <h2 className="text-lg font-bold mb-3 text-futsal-navy">แก้ไขข้อมูลส่วนตัว</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded text-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-green-700">บันทึกข้อมูลสำเร็จ</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">ชื่อ</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-futsal-blue focus:border-futsal-blue"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">นามสกุล</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-futsal-blue focus:border-futsal-blue"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">อีเมล</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm bg-gray-50 text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">ไม่สามารถเปลี่ยนแปลงอีเมลได้</p>
              </div>

              <div>
                <label htmlFor="profile-image" className="block text-sm font-medium text-gray-700">รูปโปรไฟล์</label>
                <div className="mt-2 flex items-start">
                  <div className={`flex-shrink-0 h-14 w-14 rounded-full ${!imagePreview ? 'bg-gray-100 flex items-center justify-center' : ''} overflow-hidden mr-3`}>
                    {imagePreview ? (
                      <img 
                        src={imagePreview.startsWith('data:') ? imagePreview : imagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <UserIcon className="h-6 w-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="profile-image"
                      name="image"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      disabled={compressing}
                      className={`block w-full text-xs text-gray-500
                        file:mr-3 file:py-1.5 file:px-3
                        file:rounded-md file:border-0
                        file:text-xs file:font-medium
                        file:bg-futsal-blue/10 file:text-futsal-blue
                        hover:file:bg-futsal-blue/20
                        ${compressing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {compressing ? (
                      <p className="mt-1 text-xs text-futsal-blue flex items-center">
                        <svg className="animate-spin mr-1.5 h-3 w-3 text-futsal-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        กำลังประมวลผลรูปภาพ...
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">อัพโหลดรูปภาพขนาดไม่เกิน 5MB (JPG, PNG หรือ WEBP)</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3">
                <button
                  type="submit"
                  disabled={saving || compressing}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    saving || compressing
                      ? "bg-futsal-blue/60 cursor-not-allowed"
                      : "bg-futsal-blue hover:bg-futsal-navy focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-futsal-blue"
                  }`}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      กำลังบันทึก...
                    </>
                  ) : (
                    "บันทึกข้อมูล"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}