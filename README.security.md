# 🛡️ คู่มือการรัน SDN FUTSAL อย่างปลอดภัย

## 🚀 Quick Start (Production)

### 1. ติดตั้ง PM2 (ถ้ายังไม่มี)
```bash
npm install -g pm2
```

### 2. รัน Application ด้วย PM2
```bash
# ใช้ npm script (แนะนำ)
npm run pm2:start

# หรือรันโดยตรง
pm2 start ecosystem.config.js
```

### 3. ตรวจสอบ Status
```bash
npm run pm2:logs    # ดู logs
npm run pm2:monit   # ดู resource usage แบบ real-time
pm2 status          # ดู status
```

---

## 🔐 Security Features ที่มีอยู่

### ✅ ป้องกัน Crypto Miner (xmrig)
- **Memory Limit**: 500MB (จะ restart อัตโนมัติเมื่อเกิน)
- **Auto Restart**: จำกัดการ restart ไม่เกิน 10 ครั้ง
- **Process Monitoring**: ตรวจสอบ process แปลกๆ ผ่าน security check script

### ✅ ป้องกัน OOM (Out of Memory) Attacks
- **Max Memory**: 500MB
- **Auto Restart**: เมื่อใช้ memory เกิน limit
- **Uptime Monitor**: ต้องอยู่ได้อย่างน้อย 10 วินาที ถึงจะนับเป็น restart

### ✅ ป้องกัน Unauthorized Scripts
- **Environment Variables**: .env ถูก ignore ใน git
- **Security Check**: รันตรวจสอบระบบได้ทุกเมื่อ

---

## 📊 การตรวจสอบความปลอดภัย

### รัน Security Check
```bash
# ตรวจสอบความปลอดภัยของระบบ
npm run security:check
```

Script นี้จะตรวจสอบ:
- ✓ Suspicious processes (xmrig, miner, crypto)
- ✓ Cron jobs ที่ไม่ได้รับอนุญาต
- ✓ CPU และ Memory usage
- ✓ ไฟล์ที่แก้ไขล่าสุด
- ✓ Network connections
- ✓ PM2 status
- ✓ Disk usage
- ✓ .env file security

---

## 📝 คำสั่งที่ใช้บ่อย

### PM2 Commands
```bash
# เริ่มต้น
npm run pm2:start

# หยุด
npm run pm2:stop

# รีสตาร์ท
npm run pm2:restart

# ดู logs
npm run pm2:logs

# ดู resource usage
npm run pm2:monit

# ดู detailed info
pm2 describe sdnfutsal

# ลบ process
pm2 delete sdnfutsal
```

### Security Commands
```bash
# ตรวจสอบความปลอดภัย
npm run security:check

# ตรวจสอบ dependencies vulnerabilities
npm audit

# แก้ไข vulnerabilities อัตโนมัติ
npm audit fix

# ตรวจสอบ outdated packages
npm outdated
```

---

## ⚠️ Warning Signs (สัญญาณเตือน)

### 1. CPU สูงผิดปกติ
```bash
# ดู process ทั้งหมด
top

# ถ้าพบ process แปลกๆ
kill -9 <PID>

# รีสตาร์ท
npm run pm2:restart
```

### 2. Memory เต็ม
```bash
# PM2 จะ restart อัตโนมัติ
# ตรวจสอบ logs
npm run pm2:logs

# ดู memory usage
npm run pm2:monit
```

### 3. Process Restart บ่อย
```bash
# ดู restart count
pm2 status

# ดู error logs
pm2 logs sdnfutsal --err
```

---

## 🔧 Configuration Files

### ecosystem.config.js
```javascript
{
  max_memory_restart: '500M',  // Restart เมื่อใช้ RAM เกิน 500MB
  max_restarts: 10,             // จำกัดการ restart
  min_uptime: '10s',            // ต้องอยู่ได้อย่างน้อย 10 วินาที
}
```

### การปรับแต่ง
หากต้องการเพิ่ม memory limit:
```javascript
// แก้ไขใน ecosystem.config.js
max_memory_restart: '1G',  // เพิ่มเป็น 1GB
```

---

## 📈 Monitoring

### Real-time Monitoring
```bash
npm run pm2:monit
```

### Logs
```bash
# All logs
npm run pm2:logs

# Error logs only
pm2 logs sdnfutsal --err

# Output logs only
pm2 logs sdnfutsal --out

# Clear logs
pm2 flush
```

---

## 🆘 Emergency Procedures

### หาก CPU สูงผิดปกติ
```bash
# 1. หยุด application
npm run pm2:stop

# 2. ตรวจสอบ suspicious processes
ps aux | grep -E "xmrig|miner|crypto"

# 3. Kill suspicious process
kill -9 <PID>

# 4. รีสตาร์ท
npm run pm2:start
```

### หากพบ Malware
```bash
# 1. หยุด application ทันที
pm2 stop all

# 2. รัน security check
npm run security:check

# 3. ตรวจสอบ crontab
crontab -l

# 4. ลบ cron jobs ที่แปลกๆ
crontab -r

# 5. ตรวจสอบไฟล์ที่แก้ไขล่าสุด
find . -mtime -1 -type f -not -path "*/node_modules/*"
```

---

## 📅 Maintenance Schedule

### ทุกวัน
```bash
npm run security:check
npm run pm2:logs
```

### ทุกสัปดาห์
```bash
npm audit
crontab -l
```

### ทุกเดือน
```bash
npm outdated
npm audit fix
```

---

## 🔗 Resources

- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**สร้างเมื่อ:** 2025-12-28
**สำหรับ:** SDN FUTSAL Application
