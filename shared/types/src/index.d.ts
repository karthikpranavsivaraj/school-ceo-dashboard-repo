export declare enum UserRole {
    CEO = "CEO",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
    PARENT = "PARENT",
    TECH_OWNER = "TECH_OWNER"
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
    attendance: number;
    marks: Record<string, number>;
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
