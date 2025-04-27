// app/dashboard/components/charts/BatchYearBarChart.tsx
'use client'

import { useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';
import * as echarts from 'echarts';

interface BatchYearBarChartProps {
  yearlyBatches: Record<string, any[]> | null | undefined;
}

export default function BatchYearBarChart({ yearlyBatches }: BatchYearBarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  
  // ทำความสะอาดเมื่อ component unmount
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);
  
  useEffect(() => {
    if (!yearlyBatches || typeof yearlyBatches !== 'object') {
      return;
    }
    
    const years = Object.keys(yearlyBatches).sort((a, b) => Number(a) - Number(b));
    if (years.length === 0) return;
    
    // สร้าง chart instance ถ้ายังไม่มี
    if (!chartInstance.current && chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }
    
    // ประมวลผลข้อมูลสำหรับกราฟ
    let totalBatches = 0;
    let totalParticipants = 0;
    
    // สร้างข้อมูลสำหรับแต่ละรุ่นย่อย (stack series)
    const batchSeriesData: Record<string, number[]> = {};
    const participantsData: number[] = [];
    
    // เตรียมข้อมูลสำหรับแต่ละปี
    years.forEach(year => {
      const batches = yearlyBatches[year];
      if (!Array.isArray(batches)) return;
      
      // นับจำนวนรุ่นทั้งหมด
      totalBatches += batches.length;
      
      // คำนวณผู้เข้าร่วมในปีนี้
      const yearParticipants = batches.reduce((sum, batch) => {
        const count = batch._count?.participants || 0;
        totalParticipants += count;
        return sum + count;
      }, 0);
      
      participantsData.push(yearParticipants);
      
      // สร้างข้อมูลแยกสำหรับแต่ละรุ่นในปี
      batches.forEach(batch => {
        const batchKey = `รุ่นที่ ${batch.batchNumber || '?'}/${year}`;
        
        if (!batchSeriesData[batchKey]) {
          batchSeriesData[batchKey] = Array(years.length).fill(0);
        }
        
        const yearIndex = years.indexOf(year);
        if (yearIndex !== -1) {
          // ให้ความสูงของแต่ละรุ่นเท่ากัน (เราจะแสดงเป็น stacked bar)
          batchSeriesData[batchKey][yearIndex] = 1;
        }
      });
    });
    
    // สร้าง series สำหรับแต่ละรุ่น
    const batchSeries = Object.keys(batchSeriesData).map(name => {
      // เช็คว่ารุ่นนี้เป็นรุ่นที่เปิดรับสมัครหรือไม่
      const yearFromName = name.split('/')[1];
      const batchNumberFromName = name.split(' ')[1].split('/')[0];
      
      const batch = (yearlyBatches[yearFromName] || []).find(
        b => String(b.batchNumber) === batchNumberFromName
      );
      
      const isActive = batch?.isActive;
      
      return {
        name: name,
        type: 'bar',
        stack: 'batch',
        barWidth: '60%',
        label: {
          show: false
        },
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: isActive ? '#4338ca' : '#60a5fa',
          borderColor: isActive ? '#16a34a' : undefined,
          borderWidth: isActive ? 2 : 0
        },
        data: batchSeriesData[name]
      };
    });
    
    // คำนวณค่ามากสุดของแกน Y สำหรับรุ่น (จำนวนรุ่นในปีที่มีมากที่สุด)
    const maxBatchesInYear = years.reduce((max, year) => {
      const count = Array.isArray(yearlyBatches[year]) ? yearlyBatches[year].length : 0;
      return Math.max(max, count);
    }, 0);
    
    // คำนวณค่ามากสุดของแกน Y สำหรับผู้เข้าร่วม
    const maxParticipants = Math.max(...participantsData);
    
    // ตั้งค่ากราฟ
    const option = {
      title: {
        text: `รุ่นทั้งหมด: ${totalBatches} รุ่น | ผู้เข้าอบรมทั้งหมด: ${totalParticipants} คน`,
        left: 'center',
        top: 0,
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#6b7280'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const year = params[0].axisValue;
          const batches = yearlyBatches[year];
          if (!Array.isArray(batches)) return `ปี ${year}: ไม่มีข้อมูล`;
          
          let tooltipText = `<div style="font-weight:bold;margin-bottom:5px;">ปี ${year}</div>`;
          tooltipText += `<div>จำนวนรุ่น: ${batches.length} รุ่น</div>`;
          
          const totalParticipants = batches.reduce((sum, batch) => 
            sum + (batch._count?.participants || 0), 0);
          tooltipText += `<div>ผู้เข้าอบรม: ${totalParticipants} คน</div>`;
          
          tooltipText += `<div style="margin-top:5px;border-top:1px solid rgba(255,255,255,0.3);padding-top:5px;">รายละเอียดรุ่น:</div>`;
          
          batches.forEach(batch => {
            const participants = batch._count?.participants || 0;
            const status = batch.isActive ? '🟢 เปิดรับสมัคร' : '⚪ ปิดรับสมัคร';
            tooltipText += `<div>รุ่นที่ ${batch.batchNumber}: ${participants} คน ${status}</div>`;
          });
          
          return tooltipText;
        }
      },
      legend: {
        show: false
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '60px',
        containLabel: true
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: { show: true, title: 'บันทึกรูปภาพ' }
        }
      },
      xAxis: [
        {
          type: 'category',
          data: years,
          axisTick: { show: false },
          axisLabel: {
            rotate: 30,
            fontSize: 12
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'จำนวนรุ่น',
          min: 0,
          max: Math.max(5, maxBatchesInYear + 1),
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#3b82f6'
            }
          },
          axisLabel: {
            formatter: '{value} รุ่น'
          }
        },
        {
            type: 'value',
            name: 'ผู้เข้าอบรม',
            min: 0,
            max: Math.max(20, Math.ceil(maxParticipants * 1.2)),
            position: 'right',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#f97316'
              }
            },
            axisLabel: {
              formatter: '{value} คน'
            }
          }
        ],
        series: [
          ...batchSeries,
          {
            name: 'ผู้เข้าอบรม',
            type: 'line',
            yAxisIndex: 1,
            data: participantsData,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#f97316'
            },
            lineStyle: {
              width: 3,
              type: 'solid'
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c} คน',
              fontSize: 12
            },
            z: 10
          }
        ]
      };
      
      // อัปเดต chart
      if (chartInstance.current) {
        chartInstance.current.setOption(option, true);
      }
      
      // จัดการการปรับขนาดหน้าจอ
      const handleResize = () => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [yearlyBatches]);
    
    if (!yearlyBatches || Object.keys(yearlyBatches).length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>ยังไม่มีข้อมูลการอบรม</p>
          </div>
        </div>
      );
    }
    
    return (
      <div ref={chartRef} className="w-full h-full" />
    );
  }