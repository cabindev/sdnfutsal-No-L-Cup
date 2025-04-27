// app/coach/types/responses.ts
import { TrainingBatch, BatchParticipant } from './training-batch';
import { Coach } from './coach';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Training Batch Responses
export type TrainingBatchesResponse = ApiResponse<TrainingBatch[]>;
export type TrainingBatchResponse = ApiResponse<TrainingBatch>;
export type BatchParticipantResponse = ApiResponse<BatchParticipant>;

// Coach Responses
export type CoachResponse = ApiResponse<Coach>;
export type CoachesResponse = ApiResponse<Coach[]>;