// app/coach/types/training-batch.ts

export interface TrainingBatch {
  id: number;
  batchNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  registrationEndDate: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    participants: number;
  };
}

export interface BatchParticipant {
  id: number;
  batchId: number;
  batch?: TrainingBatch;
  coachId: number;
  registeredAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
  notes?: string;
  isAttended: boolean;
}