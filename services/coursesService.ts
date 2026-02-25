import { createClient } from "@/superbase/client";
import { uploadFileToStorage } from "./storage.service";

export type Course = {
  id: string;
  trainer_id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  trailer_url: string | null;
  price: number | null;
  category: string | null | undefined;  
  level: string | null;
  language: string | null;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string | null;
};

export type Trainer = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio?: string | null;
  role?: "trainer" | "learner";
};

export type CourseWithTrainer = Course & {
  trainer?: Trainer | null | undefined;
};

const supabase = createClient();


export const uploadCourseThumbnail = async (
  trainerId: string,
  file: File
) => {
  const path = `course-thumbnails/${trainerId}/${Date.now()}-${file.name}`

  return uploadFileToStorage({
    bucket: "course-assets",
    path,
    file,
  })
}


export const createCourse = async (payload: {
  trainer_id: string;
  title: string;
  slug: string;
  description?: string;
  price?: number;
  category?: string;
  level?: string;
  language?: string;
  thumbnail_url?: string;
  trailer_url?: string;
}) => {
  const { data, error } = await supabase
    .from("courses")
    .insert({
      ...payload,
      status: "draft",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCourse = async (
  courseId: string,
  trainerId: string,
  updates: Partial<Omit<Course, "id" | "trainer_id" | "created_at">>
) => {
  const { data, error } = await supabase
    .from("courses")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId)
    .eq("trainer_id", trainerId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const publishCourse = async (courseId: string, trainerId: string) => {
  const { data, error } = await supabase
    .from("courses")
    .update({
      status: "published",
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId)
    .eq("trainer_id", trainerId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const archiveCourse = async (courseId: string, trainerId: string) => {
  const { data, error } = await supabase
    .from("courses")
    .update({
      status: "archived",
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId)
    .eq("trainer_id", trainerId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTrainerCourses = async (trainerId: string) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("trainer_id", trainerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

const getTrainersByIds = async (trainerIds: string[]): Promise<Trainer[]> => {
  if (trainerIds.length === 0) return [];

  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, avatar_url, bio, role")
    .in("id", trainerIds);

  if (error) {
    console.error("Error fetching trainers:", error);
    return [];
  }

  return data || [];
};



export const getAllCourses = async (): Promise<CourseWithTrainer[]> => {
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error);
    throw new Error(error.message);
  }

  if (!courses?.length) return [];

  // Extract and fetch trainers
  const trainerIds = [...new Set(courses.map(c => c.trainer_id).filter(Boolean))] as string[];
  const trainers = await getTrainersByIds(trainerIds);


  return courses.map(course => ({
    ...course,
    trainer: trainers.find(t => t.id === course.trainer_id) || null,
  }));
};

export const getEnrolledCourses = async (userId: string) => {
  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select(`
      id,
      status,
      enrolled_at,
      course:courses (
        id,
        title,
        slug,
        thumbnail_url,
        category,
        level,
        price,
        status
      )
    `)
    .eq("user_id", userId)

  if (error) {
    console.error(error)
    return []
  }

  if (!enrollments?.length) return []

  const courseIds = enrollments.map((e: any) => e.course.id)

  // Step 2 — Fetch progress separately
  const { data: progressData } = await supabase
    .from("course_progress")
    .select("course_id, progress_percent, is_completed")
    .eq("user_id", userId)
    .in("course_id", courseIds)

  // Convert to lookup map
  const progressMap = new Map(
    progressData?.map(p => [p.course_id, p]) ?? []
  )

  // Step 3 — Merge
  return enrollments.map((e: any) => ({
    ...e,
    progress: progressMap.get(e.course.id) ?? {
      progress_percent: 0,
      is_completed: false
    }
  }))
}

export const getCoursesByTrainer = async (trainerId: string): Promise<CourseWithTrainer[]> => {
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("trainer_id", trainerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching trainer courses:", error);
    throw new Error(error.message);
  }

  if (!courses?.length) return [];

  const trainers = await getTrainersByIds([trainerId]);

  return courses.map(course => ({
    ...course,
    trainer: trainers[0] || null,
  }));
};


export const getCoursesByCategory = async (category: string): Promise<CourseWithTrainer[]> => {
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("category", category)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses by category:", error);
    throw new Error(error.message);
  }

  if (!courses?.length) return [];

  const trainerIds = [...new Set(courses.map(c => c.trainer_id).filter(Boolean))] as string[];
  const trainers = await getTrainersByIds(trainerIds);

  return courses.map(course => ({
    ...course,
    trainer: trainers.find(t => t.id === course.trainer_id) || null,
  }));
};



export const getCourseById = async (id: string): Promise<CourseWithTrainer | null> => {
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !course) {
    console.error("Error fetching course by ID:", error);
    return null;
  }

  let trainer: Trainer | null = null;
  if (course.trainer_id) {
    const { data: trainerData, error: trainerError } = await supabase
      .from("users")
      .select("id, full_name, avatar_url, bio, role")
      .eq("id", course.trainer_id)
      .single();

    if (trainerError) {
      console.error("Error fetching trainer:", trainerError);
    } else {
      trainer = trainerData || null;
    }
  }

  return { ...course, trainer };
};

export const markSectionCompleted = async (
  userId: string,
  sectionId: string,
  moduleId: string
) => {
  const { error } = await supabase
    .from("section_progress")
    .upsert(
      {
        user_id: userId,
        section_id: sectionId,
        module_id: moduleId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,section_id" }
    )

  if (error) throw error
}


export const recalculateCourseProgress = async (
  userId: string,
  courseId: string
) => {
  // 1️⃣ Get modules for this course
  const { data: modules, error: moduleError } = await supabase
    .from("course_modules")
    .select("id")
    .eq("course_id", courseId)

  if (moduleError) throw moduleError

  if (!modules || modules.length === 0) {
    await supabase
      .from("course_progress")
      .upsert(
        {
          user_id: userId,
          course_id: courseId,
          progress_percent: 0,
          is_completed: false,
          completed_at: null,
        },
        { onConflict: "user_id,course_id" }
      )

    return false
  }

  const moduleIds = modules.map((m) => m.id)

  // 2️⃣ Get completed modules for this course
  const { data: completed, error: completedError } = await supabase
    .from("module_progress")
    .select("module_id")
    .eq("user_id", userId)
    .eq("is_completed", true)
    .in("module_id", moduleIds)

  if (completedError) throw completedError

  const progress = Math.round(
    ((completed?.length ?? 0) / moduleIds.length) * 100
  )

  const isCompleted = progress === 100

  // 3️⃣ Upsert into course_progress
  await supabase
    .from("course_progress")
    .upsert(
      {
        user_id: userId,
        course_id: courseId,
        progress_percent: progress,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,course_id" }
    )

  return isCompleted
}


export const recalculateEnrollmentProgress = async (
  enrollmentId: string,
  userId: string,
  courseId: string
) => {
  // Get modules for this course only
  const { data: modules, error: moduleError } = await supabase
    .from("course_modules")
    .select("id")
    .eq("course_id", courseId)

  if (moduleError) throw moduleError

  if (!modules || modules.length === 0) {
    await supabase
      .from("enrollments")
      .update({ progress: 0 })
      .eq("id", enrollmentId)

    return false
  }

  const moduleIds = modules.map((m) => m.id)

  // Get completed modules for this user for THIS course
  const { data: completed, error: completedError } = await supabase
    .from("module_progress")
    .select("module_id")
    .eq("user_id", userId)
    .eq("is_completed", true)
    .in("module_id", moduleIds)

  if (completedError) throw completedError

  const progress = Math.round(
    ((completed?.length ?? 0) / moduleIds.length) * 100
  )

  // Update enrollment progress
  await supabase
    .from("enrollments")
    .update({
      progress,
      status: progress === 100 ? "completed" : "active",
    })
    .eq("id", enrollmentId)

  return progress === 100
}

export const fetchEnrollmentId = async (
  userId: string,
  courseId: string
) => {
  const { data, error } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
   .maybeSingle()


  if (error) {
    console.error("Error fetching enrollment ID:", error)
    return null
  }

  return data?.id || null
}

export const fetchEnrollment = async (
  userId: string,
  courseId: string
) => {
  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      id,
      progress,
      lesson_progress (
        lesson_id,
        is_completed
      )
    `)
    .eq("user_id", userId)
    .eq("course_id", courseId)
 .maybeSingle()


  if (error) {
    console.error("Error fetching enrollment:", error)
    return null
  }

  return data
}
