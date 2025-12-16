import { createClient } from "@/superbase/client";
import { uploadFileToStorage } from "./storage.service"

const supabase = createClient();


export const uploadLessonVideo = async (
  trainerId: string,
  courseId: string,
  file: File
) => {
  const path = `lesson-videos/${trainerId}/${courseId}/${Date.now()}-${file.name}`

  return uploadFileToStorage({
    bucket: "course-assets",
    path,
    file,
  })
}

export const publishLessonsByCourse = async (courseId: string) => {
  const { error } = await supabase
    .from("lessons")
    .update({ status: "published" })
    .eq("course_id", courseId)

  if (error) throw error
}


export const LessonsService = {

  async getLessonsByCourse(courseId: string) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data;
  },


  async getLessonById(id: string) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },


  async createLesson(payload: {
    course_id: string;
    title: string;
    video_url?: string;
    content?: string;
    order_index?: number;
    duration?: number;
    is_preview?: boolean;
  }) {
    const { data, error } = await supabase
      .from("lessons")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  


  async updateLesson(id: string, updates: Partial<{
    title: string;
    video_url: string;
    content: string;
    order_index: number;
    duration: number;
    is_preview: boolean;
  }>) {
    const { data, error } = await supabase
      .from("lessons")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },


  async deleteLesson(id: string) {
    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { message: "Lesson deleted successfully" };
  },
};
