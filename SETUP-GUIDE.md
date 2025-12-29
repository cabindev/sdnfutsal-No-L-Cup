# 🚀 SDN FUTSAL - Setup Guide สำหรับการป้องกันความปลอดภัย

## 📦 สิ่งที่ได้ติดตั้งแล้ว

### 1. ไฟล์ที่สร้างขึ้น:
- ✅ `ecosystem.config.js` - PM2 configuration พร้อม memory limits
- ✅ `SECURITY.md` - คู่มือความปลอดภัยฉบับเต็ม
- ✅ `README.security.md` - คู่มือการใช้งานอย่างปลอดภัย
- ✅ `scripts/security-check.sh` - Script ตรวจสอบความปลอดภัย
- ✅ `logs/` - โฟลเดอร์สำหรับเก็บ logs

### 2. npm Scripts ที่เพิ่มเข้ามา:
```json
{
  "security:check": "ตรวจสอบความปลอดภัยของระบบ",
  "pm2:start": "เริ่มต้น application ด้วย PM2",
  "pm2:stop": "หยุด application",
  "pm2:restart": "รีสตาร์ท application",
  "pm2:logs": "ดู logs",
  "pm2:monit": "ดู resource usage"
}
```

---

## 🔧 ขั้นตอนการติดตั้ง

### Step 1: ติดตั้ง PM2
```bash
npm install -g pm2
```

### Step 2: ทดสอบ Security Check
```bash
npm run security:check
```

### Step 3: รัน Application ด้วย PM2
```bash
# Development
npm run dev

# Production (แนะนำ)
npm run build
npm run pm2:start
```

---

## 🛡️ มาตรการป้องกันที่มีอยู่

### ✅ 1. ป้องกัน Crypto Miner (xmrig)
**ปัญหา:** การใช้ xmrig เพื่อ mine cryptocurrency ทำให้ CPU สูง

**การป้องกัน:**
- ✅ Server-level blocking (คุณจัดการแล้ว)
- ✅ PM2 memory limit (500MB)
- ✅ Security check script ตรวจสอบ suspicious processes
- ✅ Auto restart เมื่อใช้ resource เกิน limit

**วิธีตรวจสอบ:**
```bash
npm run security:check
# ดูที่ "Checking for suspicious processes"
```

---

### ✅ 2. ป้องกัน OOM (Out of Memory)
**ปัญหา:** การใช้ memory เกินทำให้ kill Apache หรือ processes อื่น

**การป้องกัน:**
- ✅ PM2 `max_memory_restart: 500M`
- ✅ Auto restart เมื่อใช้ memory เกิน
- ✅ Memory monitoring ผ่าน `pm2 monit`

**วิธีตรวจสอบ:**
```bash
npm run pm2:monit
# ดู memory usage real-time
```

**ปรับแต่ง memory limit:**
แก้ไขในไฟล์ `ecosystem.config.js`:
```javascript
max_memory_restart: '1G',  // เพิ่มเป็น 1GB
```

---

### ✅ 3. ป้องกัน Unauthorized Cron Jobs
**ปัญหา:** มี cron jobs ที่ไม่ได้รับอนุญาตถูกสร้างขึ้น

**การป้องกัน:**
- ✅ Security check script ตรวจสอบ crontab
- ✅ Server-level protection (คุณจัดการแล้ว)

**วิธีตรวจสอบ:**
```bash
# ผ่าน security check
npm run security:check

# หรือตรวจสอบโดยตรง
crontab -l
```

**ถ้าพบ cron job แปลกๆ:**
```bash
# ลบทั้งหมด
crontab -r

# หรือแก้ไข
crontab -e
```

---

### ✅ 4. ป้องกัน External Scripts (Pastebin)
**ปัญหา:** มีการโหลด script จาก Pastebin หรือ external sources

**การป้องกัน:**
- ✅ Server-level blocking (คุณจัดการแล้ว)
- ✅ ตรวจสอบโค้ดไม่พบการเรียก external scripts
- ✅ Security check ตรวจสอบ network connections

**วิธีตรวจสอบ:**
```bash
# ดู active connections
netstat -an | grep ESTABLISHED

# หรือผ่าน security check
npm run security:check
```

---

## 📊 Dashboard และ Monitoring

### Real-time Monitoring
```bash
# แบบ real-time (แนะนำ)
npm run pm2:monit

# แบบ snapshot
pm2 status
pm2 list
```

### Logs
```bash
# All logs
npm run pm2:logs

# Error logs only
pm2 logs sdnfutsal --err

# Last 100 lines
pm2 logs sdnfutsal --lines 100
```

---

## ⏰ Schedule การตรวจสอบ

### ทุกวัน (แนะนำเป็นอย่างยิ่ง)
```bash
npm run security:check
```

### ทุกสัปดาห์
```bash
# ตรวจสอบ vulnerabilities
npm audit

# ตรวจสอบ outdated packages
npm outdated
```

### ทุกเดือน
```bash
# Update dependencies
npm audit fix

# อ่าน SECURITY.md และทบทวนมาตรการ
```

---

## 🚨 เมื่อเกิดปัญหา

### CPU สูงผิดปกติ (> 80%)
```bash
# 1. ตรวจสอบ
top
ps aux | grep -E "xmrig|miner|crypto"

# 2. หยุด application
npm run pm2:stop

# 3. Kill suspicious process
kill -9 <PID>

# 4. รีสตาร์ท
npm run pm2:start
```

### Memory เต็ม
```bash
# PM2 จะ restart อัตโนมัติ
# แต่ถ้าต้องการ restart ด้วยตัวเอง
npm run pm2:restart
```

### Application ไม่ตอบสนอง
```bash
# 1. ดู logs
npm run pm2:logs

# 2. ดู error logs
pm2 logs sdnfutsal --err

# 3. Restart
npm run pm2:restart

# 4. ถ้ายังไม่ได้ - stop และ start ใหม่
npm run pm2:stop
npm run pm2:start
```

---

## 📖 เอกสารเพิ่มเติม

- 📄 [SECURITY.md](./SECURITY.md) - คู่มือความปลอดภัยฉบับเต็ม
- 📄 [README.security.md](./README.security.md) - วิธีการรันอย่างปลอดภัย

---

## ✅ Checklist สำหรับ Production

ก่อนนำขึ้น production ให้ตรวจสอบ:

- [ ] ติดตั้ง PM2 แล้ว (`npm install -g pm2`)
- [ ] ทดสอบ security check (`npm run security:check`)
- [ ] ไฟล์ `.env` ไม่ถูก commit ลง git
- [ ] Build application (`npm run build`)
- [ ] รันด้วย PM2 (`npm run pm2:start`)
- [ ] ตรวจสอบ logs ไม่มี error (`npm run pm2:logs`)
- [ ] ตั้งค่า PM2 startup script (`pm2 startup` และ `pm2 save`)

---

## 🔄 Auto Start บน Server Restart

```bash
# 1. Generate startup script
pm2 startup

# 2. Start your app
npm run pm2:start

# 3. Save the process list
pm2 save

# ตอนนี้ PM2 จะเริ่มต้น application อัตโนมัติเมื่อ server restart
```

---

## 📞 Support

หากพบปัญหาด้านความปลอดภัย:
1. หยุด application: `npm run pm2:stop`
2. รัน security check: `npm run security:check`
3. บันทึก logs: `pm2 logs > security-incident-$(date +%Y%m%d).log`
4. ติดต่อทีม DevOps

---

**สร้างเมื่อ:** 2025-12-28
**เวอร์ชัน:** 1.0.0
