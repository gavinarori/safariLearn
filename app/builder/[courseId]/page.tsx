'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/superbase/client';
import { Course, CourseModule, Lesson } from '@/lib/types/course';
import { getCourseWithContent } from '@/services/lessonsService';
import { createModule, createLesson, deleteModule } from '@/services/courseBuilderService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

export default function CourseBuilderPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadCourse() {
      try {
        setIsLoading(true);
        const data = await getCourseWithContent(courseId);
        if (data) {
          setCourse(data);
          setModules(data.modules || data.course_modules || []);
        }
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCourse();
  }, [courseId]);

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;

    try {
      const newModule: Partial<CourseModule> = {
        id: uuidv4(),
        course_id: courseId,
        title: newModuleTitle,
        description: '',
        position: modules.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const created = await createModule(newModule);
      if (created) {
        setModules([...modules, created]);
        setNewModuleTitle('');
      }
    } catch (error) {
      console.error('Error creating module:', error);
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!newLessonTitle.trim()) return;

    try {
      const newLesson: Partial<Lesson> = {
        id: uuidv4(),
        module_id: moduleId,
        title: newLessonTitle,
        position: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const created = await createLesson(newLesson);
      if (created) {
        // Update modules with new lesson
        setModules(
          modules.map(m =>
            m.id === moduleId
              ? { ...m, lessons: [...(m.lessons || []), created] }
              : m
          )
        );
        setNewLessonTitle('');
        setSelectedModuleId(null);
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure? This will delete all lessons in this module.')) return;

    try {
      await deleteModule(moduleId);
      setModules(modules.filter(m => m.id !== moduleId));
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{course?.title}</h1>
              <p className="text-sm text-muted-foreground">{modules.length} modules</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Add Module Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Module</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Module title..."
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
              />
              <Button onClick={handleAddModule}>
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modules List */}
        <div className="space-y-6">
          {modules.map((module, moduleIndex) => (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {moduleIndex + 1}. {module.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {module.lessons?.length || 0} lessons
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteModule(module.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Lessons List */}
                {module.lessons && module.lessons.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Lessons</h4>
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/70 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {lessonIndex + 1}. {lesson.title}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/builder/${courseId}/lesson/${lesson.id}`
                            )
                          }
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Lesson Section */}
                {selectedModuleId === module.id ? (
                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Lesson title..."
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddLesson(module.id);
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      onClick={() => handleAddLesson(module.id)}
                      size="sm"
                    >
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedModuleId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedModuleId(module.id)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lesson
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {modules.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No modules yet. Create one to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
