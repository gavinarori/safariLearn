import { createClient } from "@/superbase/client";

const supabase = createClient();

// 🧱 Types
export type Enrollment = {
  id: string;
  course_id: string;
  learner_id: string;
  payment_status: "pending" | "paid" | "free";
  progress: number;
  completed: boolean;
  enrolled_at: string;
};

export type EnrollmentWithCourse = Enrollment & {
  course?: {
    id: string;
    title: string;
    thumbnail_url: string | null;
    category: string | null;
    price: number | null;
    trainer_id: string | null;
  };
};


export const createEnrollment = async (courseId: string, learnerId: string): Promise<Enrollment | null> => {

  const { data: existing, error: existingError } = await supabase
    .from("enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("learner_id", learnerId)
    .maybeSingle();

  if (existingError) {
    console.error("Error checking existing enrollment:", existingError);
    return null;
  }

  if (existing) {
    console.warn("Already enrolled — skipping new record.");
    return existing;
  }

  const { data, error } = await supabase
    .from("enrollments")
    .insert([
      {
        course_id: courseId,
        learner_id: learnerId,
        payment_status: "free", //  change later to handle Stripe or M-Pesa
        progress: 0,
        completed: false,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating enrollment:", error);
    return null;
  }

  return data;
};


export const getEnrollmentsByLearner = async (learnerId: string): Promise<EnrollmentWithCourse[]> => {
  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      *,
      course:courses (
        id,
        title,
        thumbnail_url,
        category,
        price,
        trainer_id
      )
    `)
    .eq("learner_id", learnerId)
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("Error fetching learner enrollments:", error);
    return [];
  }

  return data || [];
};


export const getEnrollment = async (courseId: string, learnerId: string): Promise<Enrollment | null> => {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("learner_id", learnerId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching enrollment:", error);
    return null;
  }

  return data;
};


export const updateEnrollmentProgress = async (
  enrollmentId: string,
  progress: number,
  completed: boolean = false
): Promise<Enrollment | null> => {
  const { data, error } = await supabase
    .from("enrollments")
    .update({ progress, completed })
    .eq("id", enrollmentId)
    .select()
    .single();

  if (error) {
    console.error("Error updating enrollment progress:", error);
    return null;
  }

  return data;
};
