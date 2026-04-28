import { User, UserRole } from '@shared/types';

export interface UserDocument extends User {
  passwordHash: string;
}

// In-memory mock database for production-grade demonstration
// This would typically be replaced by a database client (Prisma/TypeORM)
export class MockUserDB {
  private static users: UserDocument[] = [
    {
      id: '1',
      username: 'ceo_admin',
      email: 'ceo@school.com',
      role: UserRole.CEO,
      passwordHash: '$2a$10$86qE/V9p3zS2/S5U6S6S6.K.Z5XQ7G1V.O5S5hI9zJq5C6WqH2p2x' // 'password'
    },
    {
      id: '2',
      username: 'tech_devops',
      email: 'devops@school.com',
      role: UserRole.TECH_OWNER,
      passwordHash: '$2a$10$Xm7O3W.5p.X/Z5XQ7G1V.O5S5hI9zJq5C6WqH2p2x8X8u9zG1V.O'
    }
  ];

  static async findByUsername(username: string): Promise<UserDocument | undefined> {
    return this.users.find(u => u.username === username);
  }

  static async findById(id: string): Promise<UserDocument | undefined> {
    return this.users.find(u => u.id === id);
  }

  static async create(user: UserDocument): Promise<void> {
    this.users.push(user);
  }
}
