"use client"

import type React from "react"
import { useState } from "react"
import {
  IconTrash,
  IconPlus,
  IconGripVertical,
  IconUpload,
  IconVideo,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DragDropZone } from "@/components/ drag-drop-zone"

import {
  createCourse,
  publishCourse,
  uploadCourseThumbnail,
} from "@/services/coursesService"

import {
  LessonsService,
  uploadLessonVideo,
} from "@/services/lessonsService"

import { createClient } from "@/superbase/client"
import { TrainerCoursesGrid } from "./TrainerCoursesGrid"

const supabase = createClient()

// =======================
// TYPES
// =======================

interface Lesson {
  id: string
  title: string
  type: "video" | "pdf" | "quiz"
  video_url?: string
  order_index: number
}

// =======================
// COMPONENT
// =======================

export function CourseBuilderForm() {
  const [courseId, setCourseId] = useState<string | null>(null)
  const [trainerId, setTrainerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [course, setCourse] = useState({
    title: "",
    description: "",
    pricing: "",
    thumbnail: "",
    lessons: [] as Lesson[],
  })

  // =======================
  // AUTH
  // =======================

  const initTrainer = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) throw new Error("Not authenticated")
    setTrainerId(data.user.id)
    return data.user.id
  }

  // =======================
  // COURSE
  // =======================

  const handleCreateCourse = async () => {
    if (!course.title) return alert("Course title required")

    setLoading(true)
    const uid = trainerId ?? (await initTrainer())

    const created = await createCourse({
      trainer_id: uid,
      title: course.title,
      slug: course.title.toLowerCase().replace(/\s+/g, "-"),
      description: course.description,
      price: Number(course.pricing) || 0,
    })

    setCourseId(created.id)
    setLoading(false)
  }



  // =======================
  // THUMBNAIL
  // =======================

  const handleThumbnailUpload = async (file: File) => {
    if (!trainerId || !courseId) return

    const url = await uploadCourseThumbnail(trainerId, file)

    await supabase
      .from("courses")
      .update({ thumbnail_url: url })
      .eq("id", courseId)

    setCourse((prev) => ({ ...prev, thumbnail: url }))
  }

  // =======================
  // LESSONS
  // =======================

  const handleAddLesson = async () => {
    if (!courseId) return alert("Create course first")

    const order_index = course.lessons.length + 1

    const lesson = await LessonsService.createLesson({
      course_id: courseId,
      title: "New Lesson",
      order_index,
      is_preview: false,
    })

    setCourse((prev) => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          id: lesson.id,
          title: lesson.title,
          type: "video",
          order_index,
        },
      ],
    }))
  }

  const handleDeleteLesson = async (lessonId: string) => {
    await LessonsService.deleteLesson(lessonId)

    setCourse((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((l) => l.id !== lessonId),
    }))
  }

  const handleUpdateLesson = async (
    lessonId: string,
    updates: Partial<Lesson>
  ) => {
    await LessonsService.updateLesson(lessonId, updates)

    setCourse((prev) => ({
      ...prev,
      lessons: prev.lessons.map((l) =>
        l.id === lessonId ? { ...l, ...updates } : l
      ),
    }))
  }

  const handleLessonVideoUpload = async (lessonId: string, file: File) => {
    if (!trainerId || !courseId) return

    const url = await uploadLessonVideo(trainerId, courseId, file)
    await handleUpdateLesson(lessonId, { video_url: url })
  }

  const handlePublishCourse = async () => {
  if (!courseId) return
  const uid = trainerId ?? (await initTrainer())

  // 1️⃣ Validate lessons
  if (course.lessons.length === 0) {
    return alert("Add at least one lesson before publishing")
  }

  const missingVideo = course.lessons.find(
    (l) => l.type === "video" && !l.video_url
  )

  if (missingVideo) {
    return alert("All video lessons must have a video uploaded")
  }

  // 2️⃣ Validate thumbnail
  if (!course.thumbnail) {
    return alert("Upload a course thumbnail before publishing")
  }

  setLoading(true)

  try {
    // 3️⃣ Publish lessons
    await LessonsService.publishLessonsByCourse(courseId)

    // 4️⃣ Publish course
    await publishCourse(courseId, uid)

    alert("Course & lessons published successfully 🎉")
  } catch (err) {
    console.error(err)
    alert("Failed to publish course")
  } finally {
    setLoading(false)
  }
}


  // =======================
  // UI
  // =======================

  return (
    <div className="space-y-6 p-6">
      {/* EXISTING COURSES */}
      <TrainerCoursesGrid
        onEdit={(id) => setCourseId(id)}
      />

      <h1 className="text-3xl font-bold">Create / Edit Course</h1>

      {/* COURSE DETAILS */}
      <Card className="p-6 space-y-4">
        <Label>Course Title</Label>
        <Input
          value={course.title}
          onChange={(e) =>
            setCourse({ ...course, title: e.target.value })
          }
        />

        <Label>Description</Label>
        <Textarea
          value={course.description}
          onChange={(e) =>
            setCourse({ ...course, description: e.target.value })
          }
        />

        <Label>Price</Label>
        <Input
          type="number"
          value={course.pricing}
          onChange={(e) =>
            setCourse({ ...course, pricing: e.target.value })
          }
        />

        {!courseId && (
          <Button onClick={handleCreateCourse} disabled={loading}>
            Create Course
          </Button>
        )}
      </Card>

      {/* LESSONS */}
      {courseId && (
        <Card className="p-6 space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Lessons</h2>
            <Button variant="outline" onClick={handleAddLesson}>
              <IconPlus className="w-4 h-4 mr-2" />
              Add Lesson
            </Button>
          </div>

          {course.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="space-y-3 p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <IconGripVertical className="text-muted-foreground" />

                <Input
                  value={lesson.title}
                  onChange={(e) =>
                    handleUpdateLesson(lesson.id, {
                      title: e.target.value,
                    })
                  }
                />

                <Button
                  variant="ghost"
                  onClick={() => handleDeleteLesson(lesson.id)}
                >
                  <IconTrash />
                </Button>
              </div>

              {/* VIDEO UPLOAD */}
              <DragDropZone
                accept="video/mp4"
                onDrop={(file) =>
                  handleLessonVideoUpload(lesson.id, file)
                }
              />

              {/* VIDEO PREVIEW */}
              {lesson.video_url && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <IconVideo className="w-4 h-4" />
                    <span>Video uploaded</span>
                  </div>
                  <video
                    src={lesson.video_url}
                    controls
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          ))}
        </Card>
      )}

      {/* SIDEBAR */}
      {courseId && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Thumbnail</h3>

          <DragDropZone
            accept="image/*"
            onDrop={handleThumbnailUpload}
          />

          {course.thumbnail && (
            <img
              src={course.thumbnail}
              className="rounded-lg w-full"
              alt="Thumbnail"
            />
          )}

          <Button onClick={handlePublishCourse} className="w-full">
            <IconUpload className="mr-2" />
            Publish Course
          </Button>
        </Card>
      )}
    </div>
  )
}
