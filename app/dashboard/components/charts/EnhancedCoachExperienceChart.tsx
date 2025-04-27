// app/dashboard/components/charts/EnhancedCoachExperienceChart.tsx
'use client'

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function EnhancedCoachExperienceChart() {
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
    // Mock data for demonstration
    const experienceData = [
      { range: '< 1 ปี', count: 15, description: 'เริ่มต้น', color: '#d1d5db', icon: '🔰' },
      { range: '1-3 ปี', count: 28, description: 'ระดับต้น', color: '#93c5fd', icon: '⭐' },
      { range: '3-5 ปี', count: 22, description: 'ระดับกลาง', color: '#60a5fa', icon: '⭐⭐' },
      { range: '5-10 ปี', count: 20, description: 'ระดับสูง', color: '#3b82f6', icon: '⭐⭐⭐' },
      { range: '> 10 ปี', count: 15, description: 'ผู้เชี่ยวชาญ', color: '#1d4ed8', icon: '🏆' }
    ];
    
    // สร้าง chart instance ถ้ายังไม่มี
    if (!chartInstance.current && chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }
    
    // ตั้งค่ากราฟ
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          const { name, value, dataIndex } = params;
          const item = experienceData[dataIndex];
          return `${item.icon} ${name}<br>จำนวน: ${value}%<br>ทักษะ: ${item.description}`;
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'center',
        formatter: function(name: string) {
          const item = experienceData.find(d => d.range === name);
          if (!item) return name;
          return `${item.icon} ${name} (${item.count}%)`;
        },
        textStyle: {
          fontSize: 12
        }
      },
      series: [
        {
          name: 'ประสบการณ์โค้ช',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['65%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              formatter: '{b}\n{c}%'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: experienceData.map(item => ({
            value: item.count,
            name: item.range,
            itemStyle: {
              color: item.color
            }
          }))
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