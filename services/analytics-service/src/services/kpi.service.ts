import { SchoolKPIs, WebhookEvent } from '@shared/types';

export class KPIService {
  private static kpis: SchoolKPIs = {
    averageGrade: 85,
    totalAttendance: 92,
    topPerformingSubjects: [
      { subject: 'Math', average: 88 },
      { subject: 'Science', average: 82 }
    ],
    studentCount: 500
  };

  static getKPIs(): SchoolKPIs {
    return this.kpis;
  }

  static processEvent(event: WebhookEvent) {
    if (event.type === 'MARKS_UPLOADED') {
      console.log(`[Analytics Service] Aggregating marks for student ${event.payload.studentId}`);
      
      // Real aggregation logic would update DB here
      // For demo, we just simulate an update
      this.kpis.averageGrade = parseFloat((this.kpis.averageGrade + 0.01).toFixed(2));
      
      const mathSub = this.kpis.topPerformingSubjects.find(s => s.subject === 'Math');
      if (mathSub) mathSub.average += 0.05;
    }
  }

  static getAttendanceTrend() {
    return [
      { date: '2024-03-01', percentage: 91 },
      { date: '2024-03-02', percentage: 93 },
      { date: '2024-03-03', percentage: 92 },
      { date: '2024-03-04', percentage: 94 }
    ];
  }
}
