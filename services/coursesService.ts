import { createClient } from "@/superbase/client";

// 🧩 Types
export type Course = {
  id: string;
  trainer_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  price: number | null;
  category: string | null;
  level: string | null;
  language: string | null;
  status: string | null;
  created_at: string;
  updated_at: string | null;
  trailer_url: string | null;
};

export type Trainer = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio?: string | null;
  role?: "trainer" | "learner";
};

export type CourseWithTrainer = Course & {
  trainer?: Trainer | null;
};

const supabase = createClient();


// 🔹 Utility: Fetch multiple trainers by ID
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


// 🔹 Fetch all courses (with trainer details)
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

  // Merge trainer info
  return courses.map(course => ({
    ...course,
    trainer: trainers.find(t => t.id === course.trainer_id) || null,
  }));
};

export const getEnrolledCourses = async (learnerId: string) => {
  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      id,
      progress,
      completed,
      enrolled_at,

      course:courses (
        id,
        title,
        slug,
        thumbnail_url,
        category,
        level,
        price,
        status,

        trainer:users (
          id,
          full_name,
          avatar_url
        )
      )
    `)
    .eq("learner_id", learnerId)
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("Error fetching enrolled courses:", error);
    return [];
  }

  return data;
};

// 🔹 Fetch courses by specific trainer
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


// 🔹 Fetch courses by category (with trainer info)
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


// 🔹 Fetch a single course by ID (with trainer info)
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


export const markLessonCompleted = async (
  enrollmentId: string,
  lessonId: string
) => {
  const supabase = createClient()

  // 1️⃣ Mark lesson as completed (idempotent)
  const { error } = await supabase
    .from("lesson_progress")
    .upsert(
      {
        enrollment_id: enrollmentId,
        lesson_id: lessonId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      },
      {
        onConflict: "enrollment_id,lesson_id",
      }
    )

  if (error) {
    console.error("Error updating lesson progress:", error)
    throw error
  }
}


export const recalculateEnrollmentProgress = async (
  enrollmentId: string
) => {
  const supabase = createClient()

  // 1️⃣ Get completed lessons count
  const { data: completedLessons } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("enrollment_id", enrollmentId)
    .eq("is_completed", true)

  // 2️⃣ Get total lessons in course
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select(`
      id,
      course:courses (
        id,
        lessons:lessons ( id )
      )
    `)
    .eq("id", enrollmentId)
    .single()

  const totalLessons = enrollment.course.lessons.length
  const completedCount = completedLessons?.length ?? 0

  const progress =
    totalLessons === 0
      ? 0
      : Math.round((completedCount / totalLessons) * 100)

  const completed = progress === 100

  // 3️⃣ Update enrollment
  const { error } = await supabase
    .from("enrollments")
    .update({
      progress,
      completed,
    })
    .eq("id", enrollmentId)

  if (error) {
    console.error("Error updating enrollment progress:", error)
    throw error
  }

  return { progress, completed }
}
