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
};

const supabase = createClient();

export const getAllCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error);
    throw new Error(error.message);
  }

  return data || [];
};


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


export const getCoursesByCategory = async (category: string): Promise<Course[]> => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("category", category)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses by category:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const getCourseBySlug = async (slug: string): Promise<Course | null> => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching course by slug:", error);
    return null;
  }

  return data;
};
