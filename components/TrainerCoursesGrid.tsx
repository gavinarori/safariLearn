"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/superbase/client"
import { getTrainerCourses, archiveCourse } from "@/services/coursesService"

const supabase = createClient()

export function TrainerCoursesGrid({
  onEdit,
}: {
  onEdit: (courseId: string) => void
}) {
  const [courses, setCourses] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return
      const result = await getTrainerCourses(data.user.id)
      setCourses(result)
    }
    load()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {courses.map((course) => (
        <Card key={course.id} className="p-4 space-y-3">
          <img
            src={course.thumbnail_url || "/placeholder.svg"}
            className="rounded-md h-40 w-full object-cover"
          />

          <h3 className="font-semibold">{course.title}</h3>
          <p className="text-sm text-muted-foreground">
            {course.status}
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(course.id)}
            >
              Edit
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                await archiveCourse(course.id, course.trainer_id)
                setCourses((prev) =>
                  prev.filter((c) => c.id !== course.id)
                )
              }}
            >
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
