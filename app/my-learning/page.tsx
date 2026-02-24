"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/superbase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

import {
  Trophy,
  Play,
  Award,
  Search,
  Bookmark,
} from "lucide-react"
import { useRouter } from "next/navigation"


import { getEnrolledCourses } from "@/services/coursesService"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"

const supabase = createClient()

type EnrolledCourseUI = {
  id: string
  title: string
  instructor: string
  thumbnail: string | null
  progress: number
  status: "not-started" | "in-progress" | "completed"
  favorite: boolean
}

export default function MyLearningPage() {
  const [courses, setCourses] = useState<EnrolledCourseUI[]>([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const router = useRouter()


  useEffect(() => {
    const fetchMyCourses = async () => {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const data = await getEnrolledCourses(user.id)

const mapped: EnrolledCourseUI[] =
  data?.map((e: any) => {
    const progress = Number(e.progress?.progress_percent ?? 0)
    const isCompleted = e.progress?.is_completed ?? false

    let status: EnrolledCourseUI["status"] = "not-started"

    if (isCompleted || progress === 100) {
      status = "completed"
    } else if (progress > 0) {
      status = "in-progress"
    }

    return {
      id: e.course.id,
      title: e.course.title,
      thumbnail: e.course.thumbnail_url,
      progress,
      status,
      favorite: false,
    }
  }) ?? []

      setCourses(mapped)
      setLoading(false)
    }

    fetchMyCourses()
  }, [])

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

      const matchesFilter =
        filterStatus === "all" || course.status === filterStatus

      return matchesSearch && matchesFilter
    })
  }, [courses, searchQuery, filterStatus])

  const stats = {
    totalEnrolled: courses.length,
    inProgress: courses.filter((c) => c.status === "in-progress").length,
    completed: courses.filter((c) => c.status === "completed").length,
  }

  const toggleFavorite = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, favorite: !c.favorite } : c
      )
    )
  }
  

  if (loading) {
  return (

        <div className="max-w-7xl mx-auto p-6 space-y-8 animate-pulse">

          {/* Header */}
          <div className="space-y-2">
            <div className="h-10 w-72 bg-muted rounded" />
            <div className="h-4 w-96 bg-muted rounded" />
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 flex gap-4 items-center">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-6 w-12 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search */}
          <div className="space-y-4">
            <div className="h-10 w-full bg-muted rounded" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-24 bg-muted rounded" />
              ))}
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                  <div className="h-2 w-full bg-muted rounded" />
                  <div className="flex gap-2">
                    <div className="h-8 w-full bg-muted rounded" />
                    <div className="h-8 w-10 bg-muted rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

  )
}

  return (
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Learning</h1>
          <p className="text-muted-foreground">
            Track your progress and continue your courses
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <Play className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <Trophy className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <Award className="w-6 h-6 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Certificates</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="mb-6">
          <div className="p-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {["all", "in-progress", "completed", "not-started"].map(
                (status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={filterStatus === status ? "default" : "outline"}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status.replace("-", " ")}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />

                {course.status === "completed" && (
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    <Award className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold mb-1">{course.title}</h3>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button
  size="sm"
  className="flex-1"
  onClick={() => router.push(`/courses/${course.id}`)}
>
  {course.status === "not-started"
    ? "Start Course"
    : course.status === "completed"
    ? "Review Course"
    : "Continue Learning"}
</Button>


                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFavorite(course.id)}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        course.favorite ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card className="mt-6">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven’t enrolled in any courses yet
              </p>
              <Button>Browse Courses</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
          </SidebarInset>
        </SidebarProvider>
  )
}
