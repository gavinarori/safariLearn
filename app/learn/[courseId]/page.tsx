"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Download,
  ChevronDown,
  ChevronUp,

} from "lucide-react"
import { AppSidebar } from "@/components/learn-components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from '@/components/ui/shadcn-io/video-player';
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
    <AppSidebar courseId={courseId} />

    <SidebarInset className="flex flex-col min-h-screen bg-background">

      {/* Top Bar */}
      <header className="bg-background sticky top-0 flex items-center gap-2 border-b p-4 z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-6">

        {/* VIDEO PLAYER */}
        <div
          className="
            w-full 
            h-56 
            sm:h-64 
            md:h-[45vh] 
            lg:h-[50vh] 
            xl:h-[60vh] 
            2xl:h-[65vh]
            rounded-xl 
            overflow-hidden 
            bg-black
          "
        >
          {currentLesson?.video_url ? (
            <VideoPlayer className="w-full h-full">
              <VideoPlayerContent
                crossOrigin=""
                muted
                preload="auto"
                slot="media"
                src={currentLesson.video_url || ""}
              />
              <VideoPlayerControlBar>
                <VideoPlayerPlayButton />
                <VideoPlayerSeekBackwardButton />
                <VideoPlayerSeekForwardButton />
                <VideoPlayerTimeRange />
                <VideoPlayerTimeDisplay showDuration />
                <VideoPlayerMuteButton />
                <VideoPlayerVolumeRange />
              </VideoPlayerControlBar>
            </VideoPlayer>
          ) : (
            <img
              src="/placeholder.svg"
              alt="Video player"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* LEFT: CURRICULUM */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <CardHeader>
                <CardTitle>Curriculum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {weeks.map((week) => (
                  <div key={week}>
                    <button
                      onClick={() =>
                        setExpandedWeeks((prev) => ({
                          ...prev,
                          [week]: !prev[week],
                        }))
                      }
                      className="flex justify-between items-center w-full p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors mb-2 font-semibold text-sm"
                    >
                      <span>Week {week}</span>
                      {expandedWeeks[week] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {expandedWeeks[week] && (
                      <div className="space-y-1 ml-2 mb-4">
                        {groupedLessons[week].map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson)}
                            className={`block w-full text-left p-2 rounded transition-colors text-sm ${
                              currentLesson?.id === lesson.id
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-secondary"
                            }`}
                          >
                            <div className="flex gap-2 items-start">
                              <div className="flex-1">
                                <p className="font-medium leading-tight">{lesson.title}</p>
                                <p className="text-xs opacity-70">{lesson.duration}</p>
                              </div>
                              {completedLessons[lesson.id] && (
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-1" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: LESSON DETAILS */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-6">
              <Badge className="mb-2">
                Week {currentLesson?.week} • Lesson {currentLesson?.number}
              </Badge>

              <h1 className="text-2xl font-bold mb-4">
                {currentLesson?.title}
              </h1>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => currentLesson && toggleLessonComplete(currentLesson.id)}
                  variant={currentLesson?.completed ? "default" : "outline"}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {currentLesson?.completed ? "Completed" : "Mark as Complete"}
                </Button>

                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Materials
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
)
};

function formatDurationMinutes(mins?: number | null) {
  if (!mins || isNaN(Number(mins))) return "0:00"
  const total = Math.floor(Number(mins))
  const mm = total % 60
  const hh = Math.floor(total / 60)
  if (hh > 0) return `${hh}:${String(mm).padStart(2, "0")}`
  return `${mm}:00`
}