"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle2,
  Download,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Play,
} from "lucide-react"
import { AppSidebar } from "@/components/learn-components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LessonsService } from "@/services/lessonsService"

type LessonRow = {
  id: string
  course_id: string
  title: string
  video_url?: string | null
  content?: string | null
  order_index?: number | null
  duration?: number | null
  is_preview?: boolean | null
  created_at?: string | null
}

type UIPlayLesson = {
  id: string
  week: number
  number: number
  title: string
  duration: string
  completed: boolean
  video_url?: string | null
  content?: string | null
}

export default function CoursePlayerPage() {
  const { courseId } = useParams() as { courseId?: string }
  const [lessons, setLessons] = useState<LessonRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // UI state
  const [currentLesson, setCurrentLesson] = useState<UIPlayLesson | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({})
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({})
  const [notes, setNotes] = useState("")
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "John Smith",
      time: "2 hours ago",
      text: "Great explanation of form! This really helped clarify the squat mechanics.",
      replies: 2,
    },
    {
      id: 2,
      author: "Maria Garcia",
      time: "4 hours ago",
      text: "Can we discuss modifications for people with knee issues?",
      replies: 0,
    },
  ])

  // Convert DB lesson row -> UI lesson (week & number computed)
  const mapToUILesson = (l: LessonRow): UIPlayLesson => {
    const order = l.order_index ?? 1
    const week = Math.max(1, Math.ceil((order as number) / 5))
    const number = order
    const dur =
      typeof l.duration === "number" ? formatDurationMinutes(l.duration) : (l.duration ? String(l.duration) : "0:00")

    return {
      id: l.id,
      week,
      number,
      title: l.title,
      duration: dur,
      completed: Boolean(completedLessons[l.id]),
      video_url: l.video_url ?? null,
      content: l.content ?? null,
    }
  }

  // grouped lessons by week
  const groupedLessons = useMemo(() => {
    const uiLessons = lessons.map(mapToUILesson)
    const grouped: Record<number, UIPlayLesson[]> = {}
    uiLessons.forEach((ls) => {
      if (!grouped[ls.week]) grouped[ls.week] = []
      grouped[ls.week].push(ls)
    })
    // sort by week and order_index (number)
    Object.keys(grouped).forEach((k) => {
      grouped[Number(k)].sort((a, b) => a.number - b.number)
    })
    return grouped
  }, [lessons, completedLessons])

  const weeks = useMemo(() => Object.keys(groupedLessons).map(Number).sort((a, b) => a - b), [groupedLessons])

  // fetch lessons for the course
  useEffect(() => {
    if (!courseId) return
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await LessonsService.getLessonsByCourse(courseId)
        if (!data || data.length === 0) {
          setLessons([])
          setCurrentLesson(null)
          return
        }
        // ensure order by order_index ascending (server query already does this but double-check)
        const sorted = [...data].sort((a, b) => (Number(a.order_index ?? 0) - Number(b.order_index ?? 0)))
        setLessons(sorted)

        // default current lesson -> first in order
        const first = sorted[0]
        const uiFirst = mapToUILesson(first)
        setCurrentLesson(uiFirst)

        // expand first week by default
        setExpandedWeeks((prev) => ({ ...prev, [uiFirst.week]: true }))
      } catch (err: any) {
        console.error("Failed to load lessons:", err)
        setError(err?.message ?? "Failed to load lessons")
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  // Toggle completion (UI only). TODO: call lesson_progress service here to persist per-user completion.
  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = { ...prev, [lessonId]: !prev[lessonId] }
      // also update currentLesson.completed if it matches
      if (currentLesson && currentLesson.id === lessonId) {
        setCurrentLesson({ ...currentLesson, completed: !!next[lessonId] })
      }
      return next
    })
  }

  // When a lesson is selected from sidebar, set it as current
  const handleSelectLesson = (lesson: UIPlayLesson) => {
    setCurrentLesson(lesson)
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading lessons…</div>
      </div>
    )

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 font-semibold mb-3">Error: {error}</p>
        <Button onClick={() => location.reload()}>Retry</Button>
      </div>
    )

  if (!lessons.length)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center py-20">No lessons found for this course.</p>
      </div>
    )

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className="bg-muted/50 aspect-video h-12 w-full rounded-lg"
            />
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

/* ---------- Helpers ---------- */

function formatDurationMinutes(mins?: number | null) {
  if (!mins || isNaN(Number(mins))) return "0:00"
  const total = Math.floor(Number(mins))
  const mm = total % 60
  const hh = Math.floor(total / 60)
  if (hh > 0) return `${hh}:${String(mm).padStart(2, "0")}`
  return `${mm}:00`
}
