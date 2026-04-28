export interface SchoolKPIs {
  averageGrade: number;
  totalAttendance: number;
  topPerformingSubjects: Array<{ subject: string; average: number }>;
  studentCount: number;
}

export interface AttendanceTrend {
  date: string;
  percentage: number;
}
