import { Request, Response } from 'express';
import axios from 'axios';

const STUDENT_SERVICE_URL = process.env.STUDENT_SERVICE_URL || 'http://localhost:3002';

export class TeacherController {
  static async uploadMarks(req: Request, res: Response) {
    const { studentId, marks } = req.body;

    try {
      // Internal service communication
      const response = await axios.patch(`${STUDENT_SERVICE_URL}/${studentId}/marks`, { marks });
      
      // PHASE 2: Emit Event
      try {
        await axios.post(process.env.WEBHOOK_SERVICE_URL || 'http://localhost:3005/emit', {
          type: 'MARKS_UPLOADED',
          payload: { studentId, marks, teacherId: 't1' } // Mock teacherId
        });
        console.log(`[Teacher Service] Event emitted for student ${studentId}`);
      } catch (err: any) {
        console.error(`[Teacher Service] Failed to emit event: ${err.message}`);
      }
      
      res.json({ message: 'Marks uploaded successfully and event triggered', data: response.data });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to upload marks', details: error.message });
    }
  }

  static async getClasses(req: Request, res: Response) {
    // Mock response for teacher's classes
    res.json([
      { id: 'c1', name: 'Mathematics - 10A' },
      { id: 'c2', name: 'Physics - 12B' }
    ]);
  }
}
