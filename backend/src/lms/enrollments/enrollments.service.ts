import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EnrollmentStatus, CourseStatus } from '@prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Normalize enrollment progress to ensure it's always an integer
   */
  private normalizeEnrollment(enrollment: any): any {
    if (!enrollment) return enrollment;
    
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

  async enroll(userId: string, courseId: string) {
    // Check if course exists and is published
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status !== CourseStatus.PUBLISHED) {
      throw new BadRequestException('Cannot enroll in unpublished course');
    }

    // Check if already enrolled
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
      if (existingEnrollment.status === EnrollmentStatus.ACTIVE) {
        // Return existing enrollment instead of throwing error
        return this.normalizeEnrollment(existingEnrollment);
      }
      // Reactivate if previously dropped
      const reactivated = await this.prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: {
          status: EnrollmentStatus.ACTIVE,
          enrolledAt: new Date(),
        },
        include: {
          course: true,
        },
      });
      return this.normalizeEnrollment(reactivated);
    }

    // Create new enrollment
    const enrollment = await this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: EnrollmentStatus.ACTIVE,
        progress: 0,
      },
      include: {
        course: true,
      },
    });

    // Increment enrollment count
    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        enrollmentCount: { increment: 1 },
      },
    });

    return this.normalizeEnrollment(enrollment);
  }

  async getMyEnrollments(userId: string) {
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

  async getEnrollment(userId: string, courseId: string) {
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

    // Return null instead of throwing error - let frontend handle unenrolled state
    return this.normalizeEnrollment(enrollment);
  }

  async updateProgress(userId: string, courseId: string) {
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
      throw new NotFoundException('Enrollment not found');
    }

    // Calculate total lessons
    const totalLessons = enrollment.course.modules.reduce(
      (total, module) => total + module.lessons.length,
      0,
    );

    if (totalLessons === 0) {
      return this.normalizeEnrollment(enrollment);
    }

    // Calculate completed lessons
    const completedLessons = enrollment.lessonProgress.filter(
      (progress) => progress.completed,
    ).length;

    // Calculate progress percentage
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

    // Update enrollment
    const updateData: any = {
      progress: progressPercentage,
      lastAccessedAt: new Date(),
    };

    // Mark as completed if 100%
    if (progressPercentage === 100 && !enrollment.completedAt) {
      updateData.status = EnrollmentStatus.COMPLETED;
      updateData.completedAt = new Date();
    }

    const updated = await this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: updateData,
    });
    return this.normalizeEnrollment(updated);
  }

  async dropCourse(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.status === EnrollmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot drop a completed course');
    }

    const dropped = await this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        status: EnrollmentStatus.DROPPED,
      },
    });
    return this.normalizeEnrollment(dropped);
  }

  async getCourseEnrollments(courseId: string, instructorId: string) {
    // Verify course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check instructor permission if provided
    if (instructorId && course.instructorId !== instructorId) {
      throw new ForbiddenException('You do not have permission to view these enrollments');
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

  async markLessonComplete(userId: string, enrollmentId: string, lessonId: string) {
    // Verify enrollment belongs to user
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
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this enrollment');
    }

    // Verify lesson exists in course
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check if already completed
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

      // Update to completed
      const updated = await this.prisma.lessonProgress.update({
        where: { id: existingProgress.id },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });

      // Recalculate enrollment progress
      await this.updateEnrollmentProgress(enrollmentId);

      return updated;
    }

    // Create new progress record
    const lessonProgress = await this.prisma.lessonProgress.create({
      data: {
        enrollmentId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    // Recalculate enrollment progress
    await this.updateEnrollmentProgress(enrollmentId);

    return lessonProgress;
  }

  async unmarkLessonComplete(userId: string, enrollmentId: string, lessonId: string) {
    // Verify enrollment belongs to user
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this enrollment');
    }

    // Find existing progress
    const existingProgress = await this.prisma.lessonProgress.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId,
        },
      },
    });

    if (!existingProgress) {
      throw new NotFoundException('Lesson progress not found');
    }

    // Update to not completed
    const updated = await this.prisma.lessonProgress.update({
      where: { id: existingProgress.id },
      data: {
        completed: false,
        completedAt: null,
      },
    });

    // Recalculate enrollment progress
    await this.updateEnrollmentProgress(enrollmentId);

    return updated;
  }

  async updateVideoProgress(
    userId: string,
    enrollmentId: string,
    lessonId: string,
    videoProgress: number,
    watchTime: number,
    timeSpent: number
  ) {
    // Verify enrollment belongs to user
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this enrollment');
    }

    // Validate progress
    if (videoProgress < 0 || videoProgress > 100) {
      throw new BadRequestException('Video progress must be between 0 and 100');
    }

    // Find or create progress record
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
      // Update existing progress
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

    // Create new progress record
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

  private async updateEnrollmentProgress(enrollmentId: string) {
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

    if (!enrollment) return;

    // Calculate total lessons
    const totalLessons = enrollment.course.modules.reduce(
      (acc, module) => acc + module.lessons.length,
      0
    );

    if (totalLessons === 0) return;

    // Calculate completed lessons
    const completedLessons = enrollment.lessonProgress.filter(p => p.completed).length;

    const progress = Math.round((completedLessons / totalLessons) * 100);

    // Update enrollment
    await this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress,
        status: progress === 100 ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ACTIVE,
        completedAt: progress === 100 ? new Date() : null,
      },
    });
  }
}
