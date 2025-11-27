export declare class LessonProgress {
    id: string;
    enrollmentId: string;
    lessonId: string;
    completed: boolean;
    watchTime?: number;
    videoProgress?: number;
    timeSpent?: number;
    lastWatchedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
