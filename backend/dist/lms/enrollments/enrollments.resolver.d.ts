import { EnrollmentsService } from './enrollments.service';
import { EnrollCourseInput } from './dto/enroll-course.input';
export declare class EnrollmentsResolver {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    enrollCourse(user: any, enrollCourseInput: EnrollCourseInput): Promise<any>;
    getMyEnrollments(user: any): Promise<any>;
    getEnrollment(user: any, courseId: string): Promise<any>;
    dropCourse(user: any, courseId: string): Promise<any>;
    getCourseEnrollments(user: any, courseId: string): Promise<any>;
    markLessonComplete(user: any, enrollmentId: string, lessonId: string): Promise<{
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
    unmarkLessonComplete(user: any, enrollmentId: string, lessonId: string): Promise<{
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
    updateVideoProgress(user: any, enrollmentId: string, lessonId: string, videoProgress: number, watchTime: number, timeSpent: number): Promise<{
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
}
