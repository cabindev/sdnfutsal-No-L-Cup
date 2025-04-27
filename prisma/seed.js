// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('เริ่มนำเข้าข้อมูล...');
  
  // อ่านข้อมูลจากไฟล์ JSON
  const coachesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, './data/coaches.json'), 'utf8')
  ).coaches;
  
  // กรองเฉพาะโค้ชที่ลงทะเบียนรุ่นที่ 1/2566
  const batch2566Coaches = coachesData.filter(coach => 
    coach.batchParticipations && 
    coach.batchParticipations.some(bp => bp.batchNumber === 1 && bp.year === 2566)
  );
  
  console.log(`พบข้อมูลโค้ชรุ่นที่ 1/2566 ทั้งหมด ${batch2566Coaches.length} คน`);
  
  // 1. ตรวจสอบโครงสร้างของ schema
  console.log('กำลังตรวจสอบโครงสร้างฐานข้อมูล...');
  
  // สร้างผู้ใช้ตัวอย่างสำหรับเชื่อมโยงกับโค้ช (ถ้าจำเป็น)
  let defaultUser = await prisma.user.findFirst();
  
  if (!defaultUser) {
    console.log('ไม่พบผู้ใช้ในระบบ กำลังสร้างผู้ใช้ตัวอย่าง...');
    defaultUser = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'hashed_password_placeholder', // ควรใช้รหัสผ่านที่เข้ารหัสจริง
        role: 'ADMIN'
      }
    });
    console.log(`สร้างผู้ใช้ตัวอย่าง ID: ${defaultUser.id}`);
  } else {
    console.log(`ใช้ผู้ใช้ที่มีอยู่แล้ว ID: ${defaultUser.id}`);
  }
  
  // 2. นำเข้าข้อมูลรุ่นการอบรม (TrainingBatch)
  let batch;
  const existingBatch = await prisma.trainingBatch.findFirst({
    where: { 
      batchNumber: 1,
      year: 2566
    }
  });
  
  if (existingBatch) {
    batch = existingBatch;
    console.log(`ใช้ข้อมูลรุ่นการอบรมที่มีอยู่แล้ว: รุ่นที่ ${batch.batchNumber}/${batch.year}`);
  } else {
    batch = await prisma.trainingBatch.create({
      data: {
        batchNumber: 1,
        year: 2566,
        startDate: new Date('2023-05-28'),
        endDate: new Date('2023-06-01'),
        location: 'ณ ศูนย์ฝึกอบรมกรมพลศึกษา สนามกีฬาเฉลิมพระเกียรติฯ 60 พรรษา (คลองหก) อ.ธัญบุรี จ.ปทุมธานี',
        maxParticipants: 50,
        registrationEndDate: new Date('2023-05-27'),
        isActive: false // รุ่นเก่าจึงปิดสถานะการรับสมัครไว้
      }
    });
    console.log(`สร้างข้อมูลรุ่นการอบรมใหม่: รุ่นที่ ${batch.batchNumber}/${batch.year}`);
  }
  
  // 3. นำเข้าข้อมูลหลักสูตร (TrainingCourse)
  const courses = [
    'หลักสูตรการฝึกอบรมผู้ฝึกสอนกีฬาฟุตซอล (ระดับต้น)',
    'หลักสูตรการฝึกผู้ฝึกสอนฟุตซอล T-Licence',
    'หลักสูตรการฝึกอบรมผู้ฝึกสอนกีฬา \'โค้ชผู้สร้างแรงบันดาลใจ\' ฟุตซอล',
    'หลักสูตรการฝึกอบรมผู้ฝึกสอนกีฬาฟุตซอล (ระดับพื้นฐาน)',
    'หลักสูตร AFC Futsal Coaching',
    'หลักสูตรการฝึกอบรมผู้ฝึกสอนกีฬาฟุตซอล C-Licence', 
    'หลักสูตรการฝึกอาสาสมัครกีฬาด้านผู้ฝึกสอนกีฬาฟุตซอล (ระดับพื้นฐาน)'
  ];
  
  const courseMap = {};
  
  for (const courseName of courses) {
    let course;
    const existingCourse = await prisma.trainingCourse.findFirst({
      where: { name: courseName }
    });
    
    if (existingCourse) {
      course = existingCourse;
    } else {
      course = await prisma.trainingCourse.create({
        data: {
          name: courseName,
          description: null
        }
      });
    }
    
    courseMap[courseName] = course.id;
  }
  
  console.log(`จัดการข้อมูลหลักสูตรการอบรมทั้งหมด ${courses.length} หลักสูตร เรียบร้อยแล้ว`);
  
  // 4. นำเข้าข้อมูลโค้ชทีละคน
  let successCount = 0;
  let errorCount = 0;
  
  // แบ่งข้อมูลเป็นชุด
  const BATCH_SIZE = 25; // จำนวนโค้ชต่อกลุ่ม
  const coachBatches = [];
  
  for (let i = 0; i < batch2566Coaches.length; i += BATCH_SIZE) {
    coachBatches.push(batch2566Coaches.slice(i, i + BATCH_SIZE));
  }
  
  // ฟังก์ชันสำหรับตรวจสอบและแปลงค่า shirtSize
  function getValidShirtSize(size) {
    switch(size) {
      case 'M': return 'M';
      case 'L': return 'L';
      case 'XL': return 'XL';
      case '2XL': return 'XXL';
      case '3XL': return 'XXXL';
      case '4XL': return 'XXXXL';
      case '5XL': return 'XXXXXL';
      default: return 'L'; // ค่าเริ่มต้น
    }
  }
  
  // ฟังก์ชันสำหรับตรวจสอบและแปลงค่า gender
  function getValidGender(gender) {
    if (gender === 'FEMALE') return 'FEMALE';
    return 'MALE';
  }
  
  // ฟังก์ชันสำหรับตรวจสอบและแปลงค่า religion
  function getValidReligion(religion) {
    if (religion === 'ISLAM') return 'ISLAM';
    if (religion === 'CHRISTIAN') return 'CHRISTIAN';
    return 'BUDDHIST';
  }
  
  // ฟังก์ชันสำหรับตรวจสอบและแปลงค่า coachStatus
  function getValidCoachStatus(status) {
    // ปรับตามค่าที่มีในโครงสร้าง schema
    if (status === 'PRIVATE') return 'ACADEMY_OWNER'; // แก้ไขจาก PRIVATE เป็น ACADEMY_OWNER
    return 'CIVIL_SERVANT';
  }
  
  // ฟังก์ชันสำหรับตรวจสอบและแปลงค่า foodPreference
  function getValidFoodPreference(pref) {
    if (pref === 'HALAL') return 'HALAL';
    return 'GENERAL';
  }

  // นำเข้าข้อมูลเป็นชุด
  for (let batchIndex = 0; batchIndex < coachBatches.length; batchIndex++) {
    const coachBatch = coachBatches[batchIndex];
    console.log(`\nนำเข้าข้อมูลกลุ่มที่ ${batchIndex + 1}/${coachBatches.length} (จำนวน ${coachBatch.length} คน)`);
    
    let batchSuccessCount = 0;
    let batchErrorCount = 0;
    
    for (const coach of coachBatch) {
      try {
        // กำหนดค่าเริ่มต้นสำหรับข้อมูลที่อาจเป็น null
        const nickname = coach.nickname || `Coach-${Date.now()}`;
        const idCardNumber = coach.idCardNumber || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const district = coach.location?.district || 'Unknown';
        const amphoe = coach.location?.amphoe || 'Unknown';
        const province = coach.location?.province || 'Unknown';
        const zone = coach.location?.zone || null;
        const age = coach.age || 30;
        const address = coach.address || 'ไม่มีข้อมูล';
        const coachExperience = coach.coachExperience || 0;
        const expectations = coach.expectations || 'พัฒนาทักษะการฝึกสอนฟุตซอล';
        
        // 4.1 ค้นหาและสร้างข้อมูลตำแหน่ง (Location)
        let location;
        const existingLocation = await prisma.location.findFirst({
          where: {
            district: district,
            amphoe: amphoe,
            province: province
          }
        });
        
        if (existingLocation) {
          location = existingLocation;
        } else {
          location = await prisma.location.create({
            data: {
              district: district,
              amphoe: amphoe,
              province: province,
              zone: zone
            }
          });
        }
        
        // 4.2 ตรวจสอบว่ามีโค้ชในระบบแล้วหรือไม่ (ตรวจสอบจากเลขบัตร)
        const existingCoach = await prisma.coach.findFirst({
          where: {
            idCardNumber: idCardNumber
          }
        });
        
        if (existingCoach) {
          console.log(`- ข้ามการนำเข้า: ${nickname} (${coach.teamName || 'ไม่ระบุทีม'}) - มีข้อมูลในระบบแล้ว`);
          successCount++;
          batchSuccessCount++;
          continue;
        }
        
        // 4.3 สร้างข้อมูลโค้ช (Coach) โดยเชื่อมโยงกับผู้ใช้ตัวอย่าง
        const createdCoach = await prisma.coach.create({
          data: {
            user: {
              connect: { id: defaultUser.id }
            },
            teamName: coach.teamName || '',
            nickname: nickname,
            gender: getValidGender(coach.gender),
            age: age,
            idCardNumber: idCardNumber,
            address: address,
            phoneNumber: coach.phoneNumber || '',
            lineId: coach.lineId || '',
            religion: getValidReligion(coach.religion),
            hasMedicalCondition: coach.hasMedicalCondition || false,
            medicalCondition: coach.medicalCondition,
            foodPreference: getValidFoodPreference(coach.foodPreference),
            coachStatus: getValidCoachStatus(coach.coachStatus),
            coachExperience: coachExperience,
            participationCount: coach.participationCount || 0,
            accommodation: coach.accommodation || true,
            shirtSize: getValidShirtSize(coach.shirtSize),
            expectations: expectations,
            location: {  // เชื่อมโยงตำแหน่ง
              connect: { id: location.id }
            },
            isApproved: true,
            registrationCompleted: true
          }
        });
        
        // 4.4 สร้างข้อมูลการลงทะเบียนรุ่น (BatchParticipant)
        await prisma.batchParticipant.create({
          data: {
            batchId: batch.id,
            coachId: createdCoach.id,
            status: 'APPROVED',
            isAttended: true  // ผู้เข้าอบรมเข้าร่วมแล้ว
          }
        });
        
        // 4.5 สร้างข้อมูลการอบรม (CoachTraining) - กรณีมีข้อมูลหลักสูตรที่เคยเข้าร่วม
        if (coach.trainings && coach.trainings.length > 0) {
          for (const training of coach.trainings) {
            // ตรวจสอบว่ามี courseName หรือไม่
            const courseName = training.courseName;
            
            if (courseName && courseMap[courseName]) {
              await prisma.coachTraining.create({
                data: {
                  coachId: createdCoach.id,
                  courseId: courseMap[courseName],
                  certificateImg: null,
                  trainingYear: 2566, // ปี พ.ศ. ของการอบรม
                  notes: null
                }
              });
            } else if (courseName) {
              console.log(`- ไม่พบหลักสูตร: ${courseName} ในระบบ`);
            }
          }
        }
        
        // เพิ่มหลักสูตรปัจจุบัน T-Licence
        await prisma.coachTraining.create({
          data: {
            coachId: createdCoach.id,
            courseId: courseMap['หลักสูตรการฝึกผู้ฝึกสอนฟุตซอล T-Licence'],
            certificateImg: null,
            trainingYear: 2566,
            notes: 'โครงการโค้ชผู้สร้างแรงบันดาลใจ รุ่นที่ 1/2566'
          }
        });
        
        successCount++;
        batchSuccessCount++;
        console.log(`✓ นำเข้าข้อมูลโค้ช: ${nickname} (${coach.teamName || 'ไม่ระบุทีม'}) สำเร็จ`);
      } catch (error) {
        errorCount++;
        batchErrorCount++;
        console.error(`✗ ไม่สามารถนำเข้าข้อมูลโค้ช: ${coach.nickname || ''} (${coach.idCardNumber || 'ไม่ทราบ'})`, error.message);
      }
    }
    
    console.log(`สรุปกลุ่มที่ ${batchIndex + 1}: สำเร็จ ${batchSuccessCount} คน, ไม่สำเร็จ ${batchErrorCount} คน`);
    
    // รอสักครู่ระหว่างแต่ละชุด เพื่อลดภาระของฐานข้อมูล
    if (batchIndex < coachBatches.length - 1) {
      console.log('รอ 2 วินาทีก่อนนำเข้ากลุ่มถัดไป...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\nสรุปผลการนำเข้าข้อมูลทั้งหมด:`);
  console.log(`- นำเข้าสำเร็จ: ${successCount} คน`);
  console.log(`- นำเข้าไม่สำเร็จ: ${errorCount} คน`);
  console.log(`- คงเหลือ: ${batch2566Coaches.length - successCount - errorCount} คน`);
}

main()
  .catch(e => {
    console.error('เกิดข้อผิดพลาดในการนำเข้าข้อมูล:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });