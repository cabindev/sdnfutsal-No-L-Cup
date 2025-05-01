// app/coach/types/training-batch.ts

export interface TrainingBatch {
  id: number;
  batchNumber: number;
  year: number;
  startDate: string | Date;  // เพิ่ม Date เพื่อรองรับทั้งรูปแบบ
  endDate: string | Date;
  location: string;
  maxParticipants: number;
  registrationEndDate: string | Date;
  description?: string;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface BatchParticipant {
  id: number;
  batchId: number;
  batch?: TrainingBatch;
  coachId: number;
  registeredAt: string | Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
  notes?: string;
  isAttended: boolean;
}

// เพิ่ม TrainingBatchWithCount ที่ใช้ใน TrainingInfoForm
export interface TrainingBatchWithCount extends TrainingBatch {
  _count?: {
    participants: number;
  };
}

// ปรับ Response type ให้ใช้ TrainingBatchWithCount
export interface GetActiveTrainingBatchesResponse {
  success: boolean;
  data?: TrainingBatchWithCount[];
  error?: string;
}