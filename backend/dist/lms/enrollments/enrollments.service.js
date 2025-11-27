"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let EnrollmentsService = class EnrollmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizeEnrollment(enrollment) {
        if (!enrollment)
            return enrollment;
        if (Array.isArray(enrollment)) {
            return enrollment.map(e => ({
                ...e,
                progress: Math.round(e.progress || 0)
            }));
        }
        return {
            ...enrollment,
            progress: Math.round(enrollment.progress || 0)
        };
    }
    async enroll(userId, courseId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        if (course.status !== client_1.CourseStatus.PUBLISHED) {
            throw new common_1.BadRequestException('Cannot enroll in unpublished course');
        }
        const existingEnrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            include: {
                course: true,
            },
        });
        if (existingEnrollment) {
            if (existingEnrollment.status === client_1.EnrollmentStatus.ACTIVE) {
                return this.normalizeEnrollment(existingEnrollment);
            }
            const reactivated = await this.prisma.enrollment.update({
                where: { id: existingEnrollment.id },
                data: {
                    status: client_1.EnrollmentStatus.ACTIVE,
                    enrolledAt: new Date(),
                },
                include: {
                    course: true,
                },
            });
            return this.normalizeEnrollment(reactivated);
        }
        const enrollment = await this.prisma.enrollment.create({
            data: {
                userId,
                courseId,
                status: client_1.EnrollmentStatus.ACTIVE,
                progress: 0,
            },
            include: {
                course: true,
            },
        });
        await this.prisma.course.update({
            where: { id: courseId },
            data: {
                enrollmentCount: { increment: 1 },
            },
        });
        return this.normalizeEnrollment(enrollment);
    }
    async getMyEnrollments(userId) {
        const enrollments = await this.prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        instructor: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            },
                        },
                        category: true,
                    },
                },
            },
            orderBy: { enrolledAt: 'desc' },
        });
        return this.normalizeEnrollment(enrollments);
    }
    async getEnrollment(userId, courseId) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            include: {
                course: {
                    include: {
                        modules: {
                            orderBy: { order: 'asc' },
                            include: {
                                lessons: {
                                    orderBy: { order: 'asc' },
                                },
                            },
                        },
                    },
                },
                lessonProgress: {
                    include: {
                        lesson: true,
                    },
                },
            },
        });
        return this.normalizeEnrollment(enrollment);
    }
    async updateProgress(userId, courseId) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            include: {
                course: {
                    include: {
                        modules: {
                            include: {
                                lessons: true,
                            },
                        },
                    },
                },
                lessonProgress: true,
            },
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        const totalLessons = enrollment.course.modules.reduce((total, module) => total + module.lessons.length, 0);
        if (totalLessons === 0) {
            return this.normalizeEnrollment(enrollment);
        }
        const completedLessons = enrollment.lessonProgress.filter((progress) => progress.completed).length;
        const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
        const updateData = {
            progress: progressPercentage,
            lastAccessedAt: new Date(),
        };
        if (progressPercentage === 100 && !enrollment.completedAt) {
            updateData.status = client_1.EnrollmentStatus.COMPLETED;
            updateData.completedAt = new Date();
        }
        const updated = await this.prisma.enrollment.update({
            where: { id: enrollment.id },
            data: updateData,
        });
        return this.normalizeEnrollment(updated);
    }
    async dropCourse(userId, courseId) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        if (enrollment.status === client_1.EnrollmentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot drop a completed course');
        }
        const dropped = await this.prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {
                status: client_1.EnrollmentStatus.DROPPED,
            },
        });
        return this.normalizeEnrollment(dropped);
    }
    async getCourseEnrollments(courseId, instructorId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        if (instructorId && course.instructorId !== instructorId) {
            throw new common_1.ForbiddenException('You do not have permission to view these enrollments');
        }
        const enrollments = await this.prisma.enrollment.findMany({
            where: { courseId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
            orderBy: { enrolledAt: 'desc' },
        });
        return this.normalizeEnrollment(enrollments);
    }
    async markLessonComplete(userId, enrollmentId, lessonId) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { id: enrollmentId },
            include: {
                course: {
                    include: {
                        modules: {
                            include: {
                                lessons: true,
                            },
                        },
                    },
                },
            },
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        if (enrollment.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to update this enrollment');
        }
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        const existingProgress = await this.prisma.lessonProgress.findUnique({
            where: {
                enrollmentId_lessonId: {
                    enrollmentId,
                    lessonId,
                },
            },
        });
        if (existingProgress) {
            if (existingProgress.completed) {
                return existingProgress;
            }
            const updated = await this.prisma.lessonProgress.update({
                where: { id: existingProgress.id },
                data: {
                    completed: true,
                    completedAt: new Date(),
                },
            });
            await this.updateEnrollmentProgress(enrollmentId);
            return updated;
        }
        const lessonProgress = await this.prisma.lessonProgress.create({
            data: {
                enrollmentId,
                lessonId,
                completed: true,
                completedAt: new Date(),
            },
        });
        await this.updateEnrollmentProgress(enrollmentId);
        return lessonProgress;
    }
    async unmarkLessonComplete(userId, enrollmentId, lessonId) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { id: enrollmentId },
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        if (enrollment.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to update this enrollment');
        }
        const existingProgress = await this.prisma.lessonProgress.findUnique({
            where: {
                enrollmentId_lessonId: {
                    enrollmentId,
                    lessonId,
                },
            },
        });
        if (!existingProgress) {
            throw new common_1.NotFoundException('Lesson progress not found');
        }
        const updated = await this.prisma.lessonProgress.update({
            where: { id: existingProgress.id },
            data: {
                completed: false,
                completedAt: null,
            },
        });
        await this.updateEnrollmentProgress(enrollmentId);
        return updated;
    }
    async updateVideoProgress(userId, enrollmentId, lessonId, videoProgress, watchTime, timeSpent) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { id: enrollmentId },
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        if (enrollment.userId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to update this enrollment');
        }
        if (videoProgress < 0 || videoProgress > 100) {
            throw new common_1.BadRequestException('Video progress must be between 0 and 100');
        }
        const existingProgress = await this.prisma.lessonProgress.findUnique({
            where: {
                enrollmentId_lessonId: {
                    enrollmentId,
                    lessonId,
                },
            },
        });
        const now = new Date();
        if (existingProgress) {
            return this.prisma.lessonProgress.update({
                where: { id: existingProgress.id },
                data: {
                    videoProgress,
                    watchTime,
                    timeSpent,
                    lastWatchedAt: now,
                },
            });
        }
        return this.prisma.lessonProgress.create({
            data: {
                enrollmentId,
                lessonId,
                videoProgress,
                watchTime,
                timeSpent,
                lastWatchedAt: now,
                completed: false,
            },
        });
    }
    async updateEnrollmentProgress(enrollmentId) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { id: enrollmentId },
            include: {
                course: {
                    include: {
                        modules: {
                            include: {
                                lessons: true,
                            },
                        },
                    },
                },
                lessonProgress: true,
            },
        });
        if (!enrollment)
            return;
        const totalLessons = enrollment.course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
        if (totalLessons === 0)
            return;
        const completedLessons = enrollment.lessonProgress.filter(p => p.completed).length;
        const progress = Math.round((completedLessons / totalLessons) * 100);
        await this.prisma.enrollment.update({
            where: { id: enrollmentId },
            data: {
                progress,
                status: progress === 100 ? client_1.EnrollmentStatus.COMPLETED : client_1.EnrollmentStatus.ACTIVE,
                completedAt: progress === 100 ? new Date() : null,
            },
        });
    }
};
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnrollmentsService);
//# sourceMappingURL=enrollments.service.js.map