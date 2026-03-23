'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/superbase/client';
import { getCourseWithContent } from '@/services/lessonsService';
import { Course, Lesson, CourseModule } from '@/lib/types/course';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import LessonDisplay from '@/components/learn-components/lesson-display';
import  CourseSidebarNav  from '@/components/learn-components/course-sidebar-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {LearningLayout} from '@/components/learn-components/learning-layout';
import React from 'react';

export default function CourseLearningPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get('lesson');
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Load course and lesson data
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('You must be logged in to access this course');
          return;
        }

        // Check enrollment
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .single();

        if (!enrollment) {
          setError('You are not enrolled in this course');
          return;
        }

        // Load course content
        const courseData = await getCourseWithContent(courseId as string);
        setCourse(courseData);

        // Set current lesson: first from query param, or first lesson in course
        const modules = courseData?.modules || courseData?.course_modules || [];
        if (lessonId) {
          // Find lesson and its module
          for (const mod of modules) {
            const foundLesson = mod.lessons?.find(l => l.id === lessonId);
            if (foundLesson) {
              setCurrentLesson(foundLesson);
              setCurrentModule(mod);
              break;
            }
          }
          // Fallback to first lesson if not found
          if (!currentLesson && modules.length > 0) {
            setCurrentLesson(modules[0]?.lessons?.[0] || null);
            setCurrentModule(modules[0] || null);
          }
        } else {
          // Set to first lesson
          if (modules.length > 0) {
            setCurrentLesson(modules[0]?.lessons?.[0] || null);
            setCurrentModule(modules[0] || null);
          }
        }
      } catch (err) {
        console.error('Error loading course:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      loadCourseData();
    }
  }, [courseId, lessonId, supabase]);

  if (isLoading) {
    return (

          <div className="flex-1 flex gap-4 p-4">
            {/* Sidebar skeleton */}
            <div className="w-64 space-y-4">
              <Skeleton className="h-8 w-40" />
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-8 w-5/6" />
                  <Skeleton className="h-8 w-5/6" />
                </div>
              ))}
            </div>
            {/* Content skeleton */}
            <div className="flex-1 space-y-4">
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>

    );
  }

  if (error) {
    return (

          <div className="flex-1 p-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>

    );
  }

  if (!course) {
    return (

          <div className="flex-1 p-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Course not found</AlertDescription>
            </Alert>
          </div>

    );
  }

  return (
    <LearningLayout
      sidebar={
        <CourseSidebarNav 
              modules={course.modules || course.course_modules || []} 
              currentLesson={currentLesson}
              courseId={courseId as string}
            />
      }
    >
        <div className="flex ">
          {/* Left Sidebar with Course Navigation */}
       

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto">
            {currentLesson ? (
              <div className="max-w-4xl mx-auto p-8">
                <LessonDisplay lesson={currentLesson} module={currentModule || undefined} />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-screen">
                <Card className="max-w-md">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground mb-4">No lessons available in this course</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
</LearningLayout>
  );
}
