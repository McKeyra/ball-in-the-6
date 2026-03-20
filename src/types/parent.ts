/* Parent Dashboard Types */

export interface ChildProgram {
  programId: string;
  programName: string;
  teamName: string;
  sport: string;
  nextEvent: ParentEvent;
  paymentStatus: 'current' | 'upcoming' | 'overdue';
  amountPaid: number;
  amountDue: number;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  avatar?: string;
  programs: ChildProgram[];
}

export interface ParentEvent {
  id: string;
  date: string;
  time: string;
  type: 'practice' | 'game' | 'clinic' | 'meeting';
  title: string;
  venue: string;
  childId: string;
  childName: string;
}

export interface CoachNote {
  id: string;
  date: string;
  coachName: string;
  childName: string;
  content: string;
  type: 'feedback' | 'progress' | 'concern' | 'praise';
}

export interface GroupChat {
  id: string;
  name: string;
  memberCount: number;
  programId: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}
