#!/bin/bash

# Security Check Script for SDN FUTSAL
# ตรวจสอบความปลอดภัยของระบบ

echo "🔐 SDN FUTSAL Security Check"
echo "=============================="
echo ""

# สี
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. ตรวจสอบ Process ที่น่าสงสัย
echo "1️⃣  Checking for suspicious processes..."
SUSPICIOUS=$(ps aux | grep -E "xmrig|miner|crypto|coinhive" | grep -v grep)
if [ -z "$SUSPICIOUS" ]; then
    echo -e "${GREEN}✅ No suspicious processes found${NC}"
else
    echo -e "${RED}⚠️  WARNING: Suspicious process detected!${NC}"
    echo "$SUSPICIOUS"
fi
echo ""

# 2. ตรวจสอบ Cron Jobs
echo "2️⃣  Checking cron jobs..."
CRON_CHECK=$(crontab -l 2>/dev/null)
if [ -z "$CRON_CHECK" ]; then
    echo -e "${GREEN}✅ No crontab entries${NC}"
else
    echo -e "${YELLOW}ℹ️  Found crontab entries:${NC}"
    echo "$CRON_CHECK"
fi
echo ""

# 3. ตรวจสอบ CPU Usage
echo "3️⃣  Checking CPU usage..."
CPU_USAGE=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')
if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
    echo -e "${RED}⚠️  High CPU usage: ${CPU_USAGE}%${NC}"
else
    echo -e "${GREEN}✅ CPU usage normal: ${CPU_USAGE}%${NC}"
fi
echo ""

# 4. ตรวจสอบ Memory Usage
echo "4️⃣  Checking memory usage..."
MEMORY=$(top -l 1 | grep PhysMem | awk '{print $2}')
echo -e "${GREEN}ℹ️  Memory used: ${MEMORY}${NC}"
echo ""

# 5. ตรวจสอบไฟล์ที่แก้ไขล่าสุด (24 ชม.)
echo "5️⃣  Checking recently modified files (last 24 hours)..."
MODIFIED_FILES=$(find /Applications/MAMP/htdocs/sdnfutsal/my-app -type f -mtime -1 -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/logs/*" 2>/dev/null | head -10)
if [ -z "$MODIFIED_FILES" ]; then
    echo -e "${GREEN}✅ No recently modified files${NC}"
else
    echo -e "${YELLOW}ℹ️  Recently modified files:${NC}"
    echo "$MODIFIED_FILES"
fi
echo ""

# 6. ตรวจสอบ Network Connections
echo "6️⃣  Checking active network connections..."
CONNECTIONS=$(netstat -an | grep ESTABLISHED | grep -E ":3000|:3306|:587" | wc -l | xargs)
echo -e "${GREEN}ℹ️  Active connections: ${CONNECTIONS}${NC}"
echo ""

# 7. ตรวจสอบ PM2 Status
echo "7️⃣  Checking PM2 status..."
if command -v pm2 &> /dev/null; then
    pm2 status 2>/dev/null || echo -e "${YELLOW}⚠️  PM2 is installed but no processes running${NC}"
else
    echo -e "${YELLOW}ℹ️  PM2 not installed. Install with: npm install -g pm2${NC}"
fi
echo ""

# 8. ตรวจสอบ Disk Usage
echo "8️⃣  Checking disk usage..."
DISK_USAGE=$(df -h /Applications/MAMP/htdocs/sdnfutsal | tail -1 | awk '{print $5}' | sed 's/%//')
if (( DISK_USAGE > 90 )); then
    echo -e "${RED}⚠️  High disk usage: ${DISK_USAGE}%${NC}"
else
    echo -e "${GREEN}✅ Disk usage normal: ${DISK_USAGE}%${NC}"
fi
echo ""

# 9. ตรวจสอบ .env file
echo "9️⃣  Checking .env file security..."
if [ -f "/Applications/MAMP/htdocs/sdnfutsal/my-app/.env" ]; then
    PERMS=$(ls -l /Applications/MAMP/htdocs/sdnfutsal/my-app/.env | awk '{print $1}')
    echo -e "${GREEN}ℹ️  .env permissions: ${PERMS}${NC}"

    # ตรวจสอบว่า .env อยู่ใน .gitignore หรือไม่
    if grep -q "\.env" /Applications/MAMP/htdocs/sdnfutsal/my-app/.gitignore 2>/dev/null; then
        echo -e "${GREEN}✅ .env is in .gitignore${NC}"
    else
        echo -e "${RED}⚠️  .env is NOT in .gitignore!${NC}"
    fi
else
    echo -e "${YELLOW}ℹ️  .env file not found${NC}"
fi
echo ""

# 10. สรุป
echo "=============================="
echo "✅ Security check completed!"
echo "=============================="
echo ""
echo "💡 Recommendations:"
echo "  - Run this check daily"
echo "  - Monitor PM2 logs regularly: pm2 logs"
echo "  - Keep dependencies updated: npm audit fix"
echo ""
