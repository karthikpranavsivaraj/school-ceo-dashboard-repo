export enum UserRole {
  CEO = 'CEO',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  TECH_OWNER = 'TECH_OWNER'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  email: string;
}

export interface Student extends User {
  role: UserRole.STUDENT;
  grade: string;
  attendance: number; // percentage
  marks: Record<string, number>; // subject -> mark
}

export interface Teacher extends User {
  role: UserRole.TEACHER;
  subjects: string[];
  classes: string[];
}

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

export enum SystemEvent {
  MARKS_UPLOADED = 'MARKS_UPLOADED',
  STUDENT_CREATED = 'STUDENT_CREATED',
  USER_LOGGED_IN = 'USER_LOGGED_IN'
}

export interface WebhookEvent {
  id: string;
  type: SystemEvent;
  payload: any;
  timestamp: string;
}

export interface WebhookSubscription {
  id: string;
  eventType: SystemEvent;
  targetUrl: string;
}

export * from './kpis';