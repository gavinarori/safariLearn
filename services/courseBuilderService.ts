import { createClient } from '@/superbase/client';
import { Course, CourseModule, Lesson, LessonBlock } from '@/lib/types/course';

const supabase = createClient();

// COURSE FUNCTIONS
export async function createCourse(courseData: Partial<Course>) {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
}

export async function updateCourse(courseId: string, courseData: Partial<Course>) {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', courseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
}

export async function getCourse(courseId: string) {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
}

// MODULE FUNCTIONS
export async function createModule(moduleData: Partial<CourseModule>) {
  try {
    const { data, error } = await supabase
      .from('course_modules')
      .insert([moduleData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating module:', error);
    throw error;
  }
}

export async function updateModule(moduleId: string, moduleData: Partial<CourseModule>) {
  try {
    const { data, error } = await supabase
      .from('course_modules')
      .update(moduleData)
      .eq('id', moduleId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating module:', error);
    throw error;
  }
}

export async function deleteModule(moduleId: string) {
  try {
    const { error } = await supabase
      .from('course_modules')
      .delete()
      .eq('id', moduleId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting module:', error);
    throw error;
  }
}

// LESSON FUNCTIONS
export async function createLesson(lessonData: Partial<Lesson>) {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .insert([lessonData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
}

export async function updateLesson(lessonId: string, lessonData: Partial<Lesson>) {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .update(lessonData)
      .eq('id', lessonId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
}

export async function deleteLesson(lessonId: string) {
  try {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
}

// BLOCK FUNCTIONS
export async function createBlock(blockData: Partial<LessonBlock>) {
  try {
    const { data, error } = await supabase
      .from('lesson_blocks')
      .insert([blockData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating block:', error);
    throw error;
  }
}

export async function updateBlock(blockId: string, blockData: Partial<LessonBlock>) {
  try {
    const { data, error } = await supabase
      .from('lesson_blocks')
      .update(blockData)
      .eq('id', blockId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating block:', error);
    throw error;
  }
}

export async function deleteBlock(blockId: string) {
  try {
    const { error } = await supabase
      .from('lesson_blocks')
      .delete()
      .eq('id', blockId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting block:', error);
    throw error;
  }
}

export async function getBlocksByLesson(lessonId: string) {
  try {
    const { data, error } = await supabase
      .from('lesson_blocks')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('position', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching blocks:', error);
    throw error;
  }
}

export async function reorderBlocks(lessonId: string, blockIds: string[]) {
  try {
    const updatePromises = blockIds.map((id, index) =>
      supabase
        .from('lesson_blocks')
        .update({ position: index })
        .eq('id', id)
    );

    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error('Error reordering blocks:', error);
    throw error;
  }
}

// BULK OPERATIONS
export async function bulkDeleteBlocks(blockIds: string[]) {
  try {
    const { error } = await supabase
      .from('lesson_blocks')
      .delete()
      .in('id', blockIds);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error bulk deleting blocks:', error);
    throw error;
  }
}
