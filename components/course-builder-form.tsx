"use client"

import type React from "react"

import { useState } from "react"
import { IconTrash, IconPlus, IconGripVertical, IconUpload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DragDropZone } from "@/components/ drag-drop-zone"

interface Lesson {
  id: string
  title: string
  type: "video" | "pdf" | "quiz"
  file?: string
}

interface Course {
  title: string
  description: string
  thumbnail: string
  pricing: string
  lessons: Lesson[]
}

export function CourseBuilderForm() {
  const [course, setCourse] = useState<Course>({
    title: "",
    description: "",
    thumbnail: "/course-thumbnail.png",
    pricing: "",
    lessons: [],
  })

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "New Lesson",
      type: "video",
    }
    setCourse({
      ...course,
      lessons: [...course.lessons, newLesson],
    })
  }

  const handleDeleteLesson = (id: string) => {
    setCourse({
      ...course,
      lessons: course.lessons.filter((lesson) => lesson.id !== id),
    })
  }

  const handleUpdateLesson = (id: string, updates: Partial<Lesson>) => {
    setCourse({
      ...course,
      lessons: course.lessons.map((lesson) => (lesson.id === id ? { ...lesson, ...updates } : lesson)),
    })
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return

    const newLessons = [...course.lessons]
    const [draggedLesson] = newLessons.splice(draggedIndex, 1)
    newLessons.splice(index, 0, draggedLesson)

    setCourse({
      ...course,
      lessons: newLessons,
    })
    setDraggedIndex(null)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="text-muted-foreground">Build and publish your course with our intuitive builder</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <div>
              <Label htmlFor="title" className="text-base font-semibold">
                Course Title
              </Label>
              <Input
                id="title"
                placeholder="Enter course title"
                value={course.title}
                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-semibold">
                Course Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what students will learn"
                value={course.description}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                className="mt-2 min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="pricing" className="text-base font-semibold">
                Pricing ($)
              </Label>
              <Input
                id="pricing"
                type="number"
                placeholder="0.00"
                value={course.pricing}
                onChange={(e) => setCourse({ ...course, pricing: e.target.value })}
                className="mt-2"
              />
            </div>
          </Card>

          {/* Lessons Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Lessons</h2>
              <Button onClick={handleAddLesson} size="sm" variant="outline" className="gap-2 bg-transparent">
                <IconPlus className="w-4 h-4" />
                Add Lesson
              </Button>
            </div>

            <div className="space-y-2">
              {course.lessons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No lessons added yet. Click "Add Lesson" to get started.
                </div>
              ) : (
                course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    className={`flex items-center gap-3 p-4 border rounded-lg transition-colors ${
                      draggedIndex === index ? "opacity-50 bg-muted" : "hover:bg-muted"
                    }`}
                  >
                    <IconGripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Input
                        value={lesson.title}
                        onChange={(e) =>
                          handleUpdateLesson(lesson.id, {
                            title: e.target.value,
                          })
                        }
                        placeholder="Lesson title"
                        className="text-sm mb-2"
                      />
                      <select
                        value={lesson.type}
                        onChange={(e) =>
                          handleUpdateLesson(lesson.id, {
                            type: e.target.value as "video" | "pdf" | "quiz",
                          })
                        }
                        className="w-full px-2 py-1 text-sm border rounded-md bg-background"
                      >
                        <option value="video">Video</option>
                        <option value="pdf">PDF</option>
                        <option value="quiz">Quiz</option>
                      </select>
                    </div>
                    <Button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                    >
                      <IconTrash className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Course Thumbnail</h3>
            <DragDropZone
              onDrop={(file) => {
                console.log("File dropped:", file)
              }}
            />
            <img
              src={course.thumbnail || "/placeholder.svg"}
              alt="Course thumbnail"
              className="w-full h-auto rounded-lg object-cover"
            />
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lessons</span>
                <span className="font-semibold">{course.lessons.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-semibold">${course.pricing || "0.00"}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <Button className="w-full gap-2">
                  <IconUpload className="w-4 h-4" />
                  Publish Course
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
