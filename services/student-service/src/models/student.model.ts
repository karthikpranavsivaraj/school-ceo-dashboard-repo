import { Student, UserRole } from '@shared/types';

export class MockStudentDB {
  private static students: Student[] = [
    {
      id: 's1',
      username: 'john_doe',
      email: 'john@student.com',
      role: UserRole.STUDENT,
      grade: '10th',
      attendance: 95,
      marks: { 'Math': 90, 'Science': 85 }
    },
    {
      id: 's2',
      username: 'jane_smith',
      email: 'jane@student.com',
      role: UserRole.STUDENT,
      grade: '12th',
      attendance: 88,
      marks: { 'Math': 95, 'History': 92 }
    }
  ];

  static async getAll(): Promise<Student[]> {
    return this.students;
  }

  static async findById(id: string): Promise<Student | undefined> {
    return this.students.find(s => s.id === id);
  }

  static async update(id: string, updates: Partial<Student>): Promise<void> {
    const index = this.students.findIndex(s => s.id === id);
    if (index !== -1) {
      this.students[index] = { ...this.students[index], ...updates };
    }
  }

  static async create(student: Student): Promise<void> {
    this.students.push(student);
  }
}
