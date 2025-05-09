// app/schedule/page.tsx
import Schedule from '@/app/components/Schedule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDN Futsal NO-L T-License 2025 | ตารางการอบรม',
  description: 'ตารางการอบรมหลักสูตรผู้ฝึกสอนฟุตซอลระดับ T-License คุณภาพสูง ครบถ้วนทั้งภาคทฤษฎีและปฏิบัติ',
};

export default function SchedulePage() {
  return (
    <div className="pt-24">
      <Schedule />
    </div>
  );
}