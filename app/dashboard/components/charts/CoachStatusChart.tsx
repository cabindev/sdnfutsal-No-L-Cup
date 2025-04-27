// app/dashboard/components/charts/CoachStatusChart.tsx
'use client'

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function CoachStatusChart() {
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
    const statusData = [
      { status: 'ผู้ฝึกสอนประจำ', count: 45, color: '#22c55e' },
      { status: 'ผู้ฝึกสอนอิสระ', count: 35, color: '#3b82f6' },
      { status: 'ผู้ช่วยผู้ฝึกสอน', count: 20, color: '#f59e0b' }
    ];
    
    // สร้าง chart instance ถ้ายังไม่มี
    if (!chartInstance.current && chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }
    
    const labelOption = {
      show: true,
      position: 'right',
      formatter: '{c}%',
      fontSize: 12,
      fontWeight: 'bold'
    };
    
    // ตั้งค่ากราฟ
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          return `${params[0].name}: ${params[0].value}%`;
        }
      },
      grid: {
        left: '3%',
        right: '15%',
        bottom: '3%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        },
        max: 100
      },
      yAxis: {
        type: 'category',
        data: statusData.map(item => item.status),
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      series: [
        {
          name: 'สถานะโค้ช',
          type: 'bar',
          data: statusData.map(item => ({
            value: item.count,
            itemStyle: {
              color: item.color
            }
          })),
          label: labelOption,
          barWidth: '60%',
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
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