// app/dashboard/components/charts/GenderDistributionChart.tsx
'use client'

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function GenderDistributionChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  
  useEffect(() => {
    // ทำความสะอาดเมื่อ component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);
  
  useEffect(() => {
    // สร้าง chart instance ถ้ายังไม่มี
    if (!chartInstance.current && chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }
    
    // ตั้งค่ากราฟ
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}% ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: ['ชาย', 'หญิง']
      },
      series: [
        {
          name: 'สัดส่วนเพศ',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            fontSize: 14,
            fontWeight: 'bold'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: [
            { value: 62, name: 'ชาย', itemStyle: { color: '#3b82f6' } },
            { value: 38, name: 'หญิง', itemStyle: { color: '#ec4899' } }
          ]
        }
      ]
    };
    
    // อัปเดต chart
    if (chartInstance.current) {
      chartInstance.current.setOption(option);
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
  }, []);
  
  return (
    <div ref={chartRef} className="w-full h-full" />
  );
}