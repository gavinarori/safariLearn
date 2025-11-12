import { createClient } from "@/superbase/client";

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

// ✅ Utility to fetch trainer profiles by IDs
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

// ✅ Fetch all courses and include trainer details
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

  // Extract unique trainer IDs
  const trainerIds = [...new Set(courses.map((c) => c.trainer_id).filter(Boolean))] as string[];

  // Fetch trainers
  const trainers = await getTrainersByIds(trainerIds);

  // Merge trainer info into each course
  const mergedCourses = courses.map((course) => ({
    ...course,
    trainer: trainers.find((t) => t.id === course.trainer_id) || null,
  }));

  return mergedCourses;
};

// ✅ Fetch courses by trainer
export const getCoursesByTrainer = async (trainerId: string): Promise<Course[]> => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("trainer_id", trainerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching trainer courses:", error);
    throw new Error(error.message);
  }

  return data || [];
};

// ✅ Fetch by category and include trainer info
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

  const trainerIds = [...new Set(courses.map((c) => c.trainer_id).filter(Boolean))] as string[];
  const trainers = await getTrainersByIds(trainerIds);

  const mergedCourses = courses.map((course) => ({
    ...course,
    trainer: trainers.find((t) => t.id === course.trainer_id) || null,
  }));

  return mergedCourses;
};

// ✅ Fetch a single course (you can include trainer too)
export const getCourseBySlug = async (slug: string): Promise<CourseWithTrainer | null> => {
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !course) {
    console.error("Error fetching course by slug:", error);
    return null;
  }

  let trainer: Trainer | null = null;
  if (course.trainer_id) {
    const { data } = await supabase
      .from("users")
      .select("id, full_name, avatar_url, bio, role")
      .eq("id", course.trainer_id)
      .single();
    trainer = data || null;
  }

  return { ...course, trainer };
};
