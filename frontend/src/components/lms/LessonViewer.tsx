// ✅ MIGRATED TO DYNAMIC GRAPHQL - 2025-10-29
// Original backup: LessonViewer.tsx.backup

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { useFindMany } from '@/hooks/useDynamicGraphQL';
import { MARK_LESSON_COMPLETE, UNMARK_LESSON_COMPLETE, UPDATE_VIDEO_PROGRESS } from '@/graphql/lms/courses.graphql';
import VideoPlayer from './VideoPlayer';
import QuizTaker from './QuizTaker';
import QuizResults from './QuizResults';
import { PlayCircle, FileText, CheckCircle, Clock, RotateCcw } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT';
  content?: string;
  duration?: number;
  order: number;
}

interface LessonViewerProps {
  lesson: Lesson;
  enrollmentId?: string;
  isCompleted?: boolean;
  onComplete?: () => void;
  nextLesson?: Lesson;
  onNextLesson?: () => void;
}

export default function LessonViewer({
  lesson,
  enrollmentId,
  isCompleted = false,
  onComplete,
  nextLesson,
  onNextLesson,
}: LessonViewerProps) {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(isCompleted);
  const [quizAttemptId, setQuizAttemptId] = useState<string | null>(null);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [watchStartTime, setWatchStartTime] = useState<number | null>(null);
  const progressUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // GraphQL mutations
  const [markLessonComplete] = useMutation(MARK_LESSON_COMPLETE);
  const [unmarkLessonComplete] = useMutation(UNMARK_LESSON_COMPLETE);
  const [updateVideoProgress] = useMutation(UPDATE_VIDEO_PROGRESS);

  // ✅ Migrated: Fetch quizzes by lesson - Always fetch quizzes for any lesson
  const { data: quizzes, loading: loadingQuizzes } = useFindMany('quiz', 
    lesson.type === 'QUIZ' ? {
      where: { 
        lessonId: lesson.id,
      },
    } : undefined
  );

  // Check if lesson progress already exists using findMany with composite filter
  const { data: progressRecords, refetch: refetchProgress } = useFindMany('lessonProgress', {
    where: { 
      enrollmentId: enrollmentId || 'skip',
      lessonId: lesson.id,
    },
    take: 1,
  });

  const existingProgress = progressRecords?.[0];

  // Initialize progress from existing record
  useEffect(() => {
    if (existingProgress) {
      setCompleted(existingProgress.completed);
      if (existingProgress.videoProgress) {
        setProgress(existingProgress.videoProgress);
      }
    }
  }, [existingProgress]);

  // Track time spent
  useEffect(() => {
    if (lesson.type === 'VIDEO' || lesson.type === 'TEXT') {
      setWatchStartTime(Date.now());
      
      return () => {
        setWatchStartTime(null);
        if (progressUpdateTimerRef.current) {
          clearTimeout(progressUpdateTimerRef.current);
        }
      };
    }
  }, [lesson.id, lesson.type]);

  const calculateTimeSpent = () => {
    if (!watchStartTime) return 0;
    return Math.floor((Date.now() - watchStartTime) / 1000);
  };

  const handleVideoProgress = async (progressPercent: number, watchTimeSeconds: number) => {
    setProgress(progressPercent);
    
    // Debounce video progress updates
    if (progressUpdateTimerRef.current) {
      clearTimeout(progressUpdateTimerRef.current);
    }

    progressUpdateTimerRef.current = setTimeout(async () => {
      if (enrollmentId) {
        const timeSpent = calculateTimeSpent();
        
        try {
          await updateVideoProgress({
            variables: {
              enrollmentId,
              lessonId: lesson.id,
              videoProgress: progressPercent,
              watchTime: Math.floor(watchTimeSeconds),
              timeSpent: Math.floor(timeSpent),
            },
          });
        } catch (error) {
          console.error('Failed to update video progress:', error);
        }
      }
    }, 2000); // Update every 2 seconds
    
    // Auto-mark as complete when 90% watched
    if (progressPercent >= 90 && !completed && enrollmentId) {
      handleMarkComplete();
    }
  };

  const handleVideoComplete = () => {
    if (!completed && enrollmentId) {
      handleMarkComplete();
    }
  };

  const handleMarkComplete = async () => {
    if (!enrollmentId || markingComplete) return;

    setMarkingComplete(true);
    try {
      await markLessonComplete({
        variables: {
          enrollmentId,
          lessonId: lesson.id,
        },
      });
      
      setCompleted(true);
      
      // Refetch enrollment progress
      await refetchProgress();
      
      // Call parent onComplete callback
      onComplete?.();
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleUnmarkComplete = async () => {
    if (!enrollmentId || markingComplete) return;

    setMarkingComplete(true);
    try {
      await unmarkLessonComplete({
        variables: {
          enrollmentId,
          lessonId: lesson.id,
        },
      });
      
      setCompleted(false);
      
      // Refetch enrollment progress
      await refetchProgress();
      
      // Call parent onComplete callback to refresh enrollment
      onComplete?.();
    } catch (error) {
      console.error('Failed to unmark lesson complete:', error);
    } finally {
      setMarkingComplete(false);
    }
  };

  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'VIDEO':
        return (
          <div className="space-y-4">
            <VideoPlayer
              src={lesson.content || ''}
              onProgress={handleVideoProgress}
              onComplete={handleVideoComplete}
            />
            
            {/* Progress indicator */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Tiến độ video
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        );

      case 'TEXT':
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: lesson.content || '' }}
            />
            
            {!completed && enrollmentId && (
              <button
                onClick={handleMarkComplete}
                disabled={markingComplete}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                {markingComplete ? 'Đang đánh dấu hoàn thành...' : 'Đánh dấu hoàn thành'}
              </button>
            )}
          </div>
        );

      case 'QUIZ':
        const quiz = quizzes?.[0];
        
        if (!quiz) {
          return (
            <div className="bg-white rounded-lg p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có bài kiểm tra</h3>
              <p className="text-gray-600 mb-6">
                Bài học này chưa có bài kiểm tra
              </p>
            </div>
          );
        }

        // Show results if quiz was completed
        if (quizAttemptId) {
          return (
            <QuizResults
              attemptId={quizAttemptId}
              onRetake={() => setQuizAttemptId(null)}
              onContinue={onNextLesson}
            />
          );
        }

        // Show quiz taker
        if (!enrollmentId) {
          return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800">Bạn phải đăng ký khóa học để làm bài kiểm tra này</p>
            </div>
          );
        }

        return (
          <QuizTaker
            quizId={quiz.id}
            enrollmentId={enrollmentId}
            onComplete={(attemptId) => {
              setQuizAttemptId(attemptId);
              handleMarkComplete();
              // Also call parent onComplete to refetch enrollment
              onComplete?.();
            }}
          />
        );

      case 'ASSIGNMENT':
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Bài tập sắp ra mắt</h3>
            <p className="text-gray-600">
              Tính năng nộp bài tập sẽ có trong bản cập nhật tiếp theo
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {lesson.type === 'VIDEO' && <PlayCircle className="w-5 h-5 text-blue-600" />}
              {lesson.type === 'TEXT' && <FileText className="w-5 h-5 text-green-600" />}
              {lesson.type === 'QUIZ' && <FileText className="w-5 h-5 text-purple-600" />}
              
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            </div>
            
            {lesson.description && (
              <p className="text-gray-600 mb-4">{lesson.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {lesson.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.duration} phút</span>
                  </div>
                )}
                
                {existingProgress?.timeSpent && existingProgress.timeSpent > 0 && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Thời gian học: {Math.floor(existingProgress.timeSpent / 60)}p {existingProgress.timeSpent % 60}s</span>
                  </div>
                )}
                
                {completed && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Đã hoàn thành</span>
                    {existingProgress?.completedAt && (
                      <span className="text-xs text-gray-500 ml-2">
                        vào {new Date(existingProgress.completedAt).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Unmark Complete Button */}
              {completed && enrollmentId && (
                <button
                  onClick={handleUnmarkComplete}
                  disabled={markingComplete}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  title="Bỏ đánh dấu hoàn thành"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Bỏ đánh dấu</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      {renderLessonContent()}

      {/* Next Lesson CTA */}
      {completed && nextLesson && onNextLesson && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Sẵn sàng cho bài học tiếp theo?</h3>
              <p className="text-sm text-gray-600">{nextLesson.title}</p>
            </div>
            <button
              onClick={onNextLesson}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Bài học tiếp theo
              <PlayCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
