import { PrismaService } from '../../prisma/prisma.service';
export declare class EnrollmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    private normalizeEnrollment;
    enroll(userId: string, courseId: string): Promise<any>;
    getMyEnrollments(userId: string): Promise<any>;
    getEnrollment(userId: string, courseId: string): Promise<any>;
    updateProgress(userId: string, courseId: string): Promise<any>;
    dropCourse(userId: string, courseId: string): Promise<any>;
    getCourseEnrollments(courseId: string, instructorId: string): Promise<any>;
    markLessonComplete(userId: string, enrollmentId: string, lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        completed: boolean;
        lessonId: string;
        enrollmentId: string;
        timeSpent: number | null;
        watchTime: number | null;
        videoProgress: number | null;
        lastWatchedAt: Date | null;
    }>;
    unmarkLessonComplete(userId: string, enrollmentId: string, lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        completed: boolean;
        lessonId: string;
        enrollmentId: string;
        timeSpent: number | null;
        watchTime: number | null;
        videoProgress: number | null;
        lastWatchedAt: Date | null;
    }>;
    updateVideoProgress(userId: string, enrollmentId: string, lessonId: string, videoProgress: number, watchTime: number, timeSpent: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        completed: boolean;
        lessonId: string;
        enrollmentId: string;
        timeSpent: number | null;
        watchTime: number | null;
        videoProgress: number | null;
        lastWatchedAt: Date | null;
    }>;
    private updateEnrollmentProgress;
}
