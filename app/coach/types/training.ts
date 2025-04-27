// app/coach/types/training.ts

export type TrainingEvent = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  registrationEndDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TrainingRegistration = {
  id: number;
  eventId: number;
  coachId: number;
  registrationDate: string;
  isAttended: boolean;
  paymentAmount: number;
  paymentStatus: 'PENDING' | 'PROCESSING' | 'PAID' | 'REFUNDED' | 'FAILED';
  paymentProofImg?: string;
  paymentDate?: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
}

export type TrainingBatch = {
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
}

export type BatchParticipant = {
  id: number;
  batchId: number;
  batch?: TrainingBatch;
  coachId: number;
  registeredAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';
  notes?: string;
  isAttended: boolean;
}

export type GetActiveTrainingBatchesResponse = {
  success: boolean;
  data?: TrainingBatch[];
  error?: string;
}