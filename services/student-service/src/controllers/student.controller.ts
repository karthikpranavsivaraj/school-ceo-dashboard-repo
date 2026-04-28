import { Request, Response } from 'express';
import { MockStudentDB } from '../models/student.model';
import { z } from 'zod';

const StudentSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  grade: z.string(),
  attendance: z.number().min(0).max(100),
  marks: z.record(z.number())
});

export class StudentController {
  static async getAllStudents(req: Request, res: Response) {
    const students = await MockStudentDB.getAll();
    res.json(students);
  }

  static async getStudentById(req: Request, res: Response) {
    const student = await MockStudentDB.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  }

  static async createStudent(req: Request, res: Response) {
    try {
      const validated = StudentSchema.parse(req.body);
      const newStudent = {
        id: 's' + Math.random().toString(36).substr(2, 5),
        role: 'STUDENT' as any,
        ...validated
      };
      await MockStudentDB.create(newStudent);
      res.status(201).json(newStudent);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateMarks(req: Request, res: Response) {
    const { id } = req.params;
    const { marks } = req.body;
    await MockStudentDB.update(id, { marks });
    res.json({ message: 'Marks updated' });
  }
}
