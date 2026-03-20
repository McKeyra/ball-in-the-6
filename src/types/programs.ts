export type ProgramType = 'league' | 'camp' | 'training' | 'clinic';

export type ProgramStatus = 'draft' | 'open' | 'active' | 'full' | 'completed';

export type AgeGroup = 'U8' | 'U10' | 'U12' | 'U14' | 'U16' | 'U18' | 'adult';

export type SkillLevel = 'recreational' | 'competitive' | 'elite';

export interface PaymentPlan {
  type: 'full' | '2-part' | 'monthly';
  amounts: number[];
  dueDates: string[];
}

export interface ProgramSchedule {
  days: string[];
  startTime: string;
  endTime: string;
  venue: string;
  court: string;
}

export interface Program {
  id: string;
  name: string;
  orgId: string;
  orgName: string;
  type: ProgramType;
  sport: string;
  ageGroups: AgeGroup[];
  gender: 'male' | 'female' | 'co-ed';
  skillLevel: SkillLevel;
  season: string;
  startDate: string;
  endDate: string;
  schedule: ProgramSchedule;
  price: number;
  earlyBirdPrice: number;
  earlyBirdDeadline: string;
  siblingDiscount: number;
  paymentPlans: PaymentPlan[];
  spotsTotal: number;
  spotsFilled: number;
  status: ProgramStatus;
  requirements: string[];
  description: string;
  coaches: string[];
}

export type RegistrationStatus = 'confirmed' | 'pending' | 'waitlisted' | 'cancelled';

export interface Registration {
  id: string;
  programId: string;
  playerId: string;
  playerName: string;
  parentId: string;
  parentName: string;
  status: RegistrationStatus;
  paymentPlan: PaymentPlan;
  amountPaid: number;
  amountDue: number;
  registeredAt: string;
}

export type InvoiceStatus = 'pending' | 'paid' | 'overdue';

export interface Invoice {
  id: string;
  registrationId: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  paidAt?: string;
}
