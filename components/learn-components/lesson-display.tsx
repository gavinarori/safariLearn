'use client';

import { Lesson, CourseModule } from '@/lib/types/course';
import ContentSection from './content-section';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface LessonDisplayProps {
  lesson: Lesson;
  module?: CourseModule;
}

export default function LessonDisplay({ lesson, module }: LessonDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Module Banner */}
      {module?.banner_image_url && (
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden bg-muted">
          <img
            src={module.banner_image_url}
            alt={module.title}
            className="w-full h-full object-cover"
          />
          {module.title && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-4 w-full">
                <p className="text-sm text-white/80 font-medium">{module.title}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lesson Header */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">{lesson.title}</h1>
            
            <div className="flex flex-wrap gap-2">
              {lesson.is_preview && (
                <Badge variant="outline">Preview</Badge>
              )}
              {lesson.reading_time && (
                <Badge variant="secondary">{lesson.reading_time} min read</Badge>
              )}
            </div>

            {lesson.key_topics && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Key Topics:</p>
                <p className="text-sm text-foreground">{lesson.key_topics}</p>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Lesson Content */}
      <ContentSection lesson={lesson} />
    </div>
  );
}
