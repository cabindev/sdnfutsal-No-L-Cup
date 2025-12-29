# 🔐 คู่มือความปลอดภัย SDN FUTSAL Application

## สรุปมาตรการป้องกัน

### ✅ การป้องกันที่ได้ดำเนินการแล้ว:

#### 1. **ป้องกัน Crypto Miner (xmrig)**
- ✅ จำกัด CPU และ Memory usage ผ่าน PM2 (`max_memory_restart: 500M`)
- ✅ Server-level blocking (คุณจัดการที่ระดับ server แล้ว)
- ✅ ไฟล์ .env ถูก ignore ใน git

#### 2. **ป้องกัน OOM (Out of Memory) Attacks**
- ✅ PM2 จะ restart process อัตโนมัติเมื่อใช้ memory เกิน 500MB
- ✅ ตั้งค่า `max_restarts: 10` เพื่อป้องกัน restart loop

#### 3. **ป้องกัน Unauthorized Cron Jobs**
- ✅ ไม่พบ cron jobs ที่ไม่ได้รับอนุญาต (ตรวจสอบแล้ว)
- ⚠️ ควรตรวจสอบ crontab เป็นประจำ: `crontab -l`

#### 4. **ป้องกัน External Script Attacks (Pastebin)**
- ✅ Server-level protection (คุณจัดการแล้ว)
- ✅ ไม่พบการเรียกใช้ external scripts ใน codebase

---

## 📋 มาตรการที่แนะนำเพิ่มเติม

### 🔧 ในระดับ Server (คุณจัดการแล้ว)
- [x] Firewall configuration
- [x] IP blocking
- [x] Rate limiting

### 🔧 ในระดับ Application

#### 1. การรัน Production
```bash
# แทนการรันด้วย npm start ให้ใช้ PM2
pm2 start ecosystem.config.js

# ดู status
pm2 status

# ดู logs
pm2 logs sdnfutsal

# Monitoring resource usage
pm2 monit

# ตั้งค่า startup script
pm2 startup
pm2 save
```

#### 2. การ Monitor Resource Usage
```bash
# ตรวจสอบ memory usage
pm2 monit

# ดู resource limits
pm2 describe sdnfutsal
```

#### 3. ตรวจสอบ Logs เป็นประจำ
```bash
# Error logs
tail -f logs/err.log

# Output logs
tail -f logs/out.log
```

---

## ⚠️ สัญญาณเตือนที่ต้องระวัง

### อาการที่บ่งบอกว่าอาจถูกโจมตี:

1. **CPU Usage สูงผิดปกติ** (> 80% ติดต่อกันนานกว่า 5 นาที)
   ```bash
   top
   # หรือ
   pm2 monit
   ```

2. **Memory Usage เพิ่มขึ้นเรื่อยๆ** (Memory leak หรือ OOM attack)
   ```bash
   pm2 describe sdnfutsal
   ```

3. **Process restart บ่อยผิดปกติ**
   ```bash
   pm2 status
   # ดูคอลัมน์ "restarts"
   ```

4. **พบ cron jobs แปลกๆ**
   ```bash
   crontab -l
   ```

5. **Network connections ที่น่าสงสัย**
   ```bash
   netstat -an | grep ESTABLISHED
   ```

---

## 🛡️ Checklist รายวัน/รายสัปดาห์

### ทุกวัน:
- [ ] ตรวจสอบ PM2 status: `pm2 status`
- [ ] ตรวจสอบ logs: `pm2 logs --lines 100`
- [ ] ตรวจสอบ resource usage: `pm2 monit`

### ทุกสัปดาห์:
- [ ] ตรวจสอบ crontab: `crontab -l`
- [ ] ตรวจสอบ process list: `ps aux | grep -E "xmrig|miner|crypto"`
- [ ] ตรวจสอบ network connections: `netstat -an | grep ESTABLISHED`
- [ ] Update dependencies: `npm audit fix`

### ทุกเดือน:
- [ ] รีวิว error logs ทั้งหมด
- [ ] ตรวจสอบ disk usage: `df -h`
- [ ] ตรวจสอบ user accounts: `cat /etc/passwd` (บน Linux)

---

## 🚨 กรณีฉุกเฉิน

### หาก CPU สูงผิดปกติ:
```bash
# 1. ดู process ที่กิน CPU
top

# 2. ถ้าพบ process แปลกๆ (เช่น xmrig)
kill -9 <PID>

# 3. รีสตาร์ทแอพ
pm2 restart sdnfutsal
```

### หาก Memory เต็ม:
```bash
# 1. PM2 จะ restart อัตโนมัติ
# 2. ตรวจสอบ logs
pm2 logs --err

# 3. ถ้าจำเป็นต้อง restart ด้วยตัวเอง
pm2 restart sdnfutsal
```

### หากพบ Malware:
```bash
# 1. หยุด application ทันที
pm2 stop sdnfutsal

# 2. ตรวจสอบ cron jobs
crontab -l
crontab -r  # ลบทั้งหมดถ้าพบสิ่งแปลกๆ

# 3. ค้นหาไฟล์แปลกๆ
find /Applications/MAMP/htdocs/sdnfutsal -name "*.sh" -type f
find /Applications/MAMP/htdocs/sdnfutsal -mtime -1  # ไฟล์ที่แก้ไขภายใน 24 ชม.

# 4. ตรวจสอบ git changes
cd /Applications/MAMP/htdocs/sdnfutsal/my-app
git status
git diff
```

---

## 📞 ติดต่อ

หากพบปัญหาด้านความปลอดภัย:
1. หยุด application ทันที: `pm2 stop all`
2. แจ้งทีม DevOps/Admin
3. บันทึก logs: `pm2 logs > incident-$(date +%Y%m%d).log`
4. อย่าลบหลักฐาน - เก็บไว้เพื่อการวิเคราะห์

---

## 📚 Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**สร้างเมื่อ:** 2025-12-28
**อัพเดทล่าสุด:** 2025-12-28
