import { Request, Response } from 'express';
import axios from 'axios';

const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3004';
const STUDENT_SERVICE_URL = process.env.STUDENT_SERVICE_URL || 'http://localhost:3002';

export class DashboardController {
  static async getSummary(req: Request, res: Response) {
    try {
      // Aggregate data from multiple services for the CEO
      const [kpis, students] = await Promise.all([
        axios.get(`${ANALYTICS_SERVICE_URL}/kpis`),
        axios.get(`${STUDENT_SERVICE_URL}/`)
      ]);

      res.json({
        institutionalKPIs: kpis.data,
        activeStudentCount: students.data.length,
        systemStatus: 'Operational',
        lastUpdated: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch dashboard data', details: error.message });
    }
  }

  static async getPerformanceInsights(req: Request, res: Response) {
    try {
      const trends = await axios.get(`${ANALYTICS_SERVICE_URL}/trends`);
      res.json({
        title: 'Academic Performance Trends',
        data: trends.data,
        insight: 'Attendance is correlating positively with Math scores.'
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch insights' });
    }
  }
}
