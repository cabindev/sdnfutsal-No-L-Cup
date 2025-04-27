// app/coach/types/coach.ts
import { BatchParticipant } from './training-batch';

export interface LocationData {
  district: string;
  amphoe: string;
  province: string;
  zone?: string;
  geocode?: string;
  lat?: number;
  lng?: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  role: string;
}

export interface Coach {
  id?: number;
  userId: number;
  user?: User;
  teamName?: string;
  nickname?: string;
  gender: string;
  age: number;
  idCardNumber: string;
  address: string;
  phoneNumber: string;
  lineId?: string;
  religion: string;
  hasMedicalCondition: boolean;
  medicalCondition?: string;
  foodPreference: string;
  coachStatus: string;
  coachExperience: number;
  participationCount: number;
  accommodation: boolean;
  shirtSize: string;
  expectations?: string;
  location?: LocationData;
  locationId?: number;
  isApproved: boolean;
  registrationCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  
  // ข้อมูลพิเศษสำหรับฟอร์ม
  selectedBatchIds?: number[];
  batchParticipations?: BatchParticipant[];
}