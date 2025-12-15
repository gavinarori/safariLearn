"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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
} from "@/components/ui/shadcn-io/video-player"
import { LessonsService } from "@/services/lessonsService"
import { useAuth } from "@/contexts/auth"
import {
  markLessonCompleted,
  recalculateEnrollmentProgress,
} from "@/services/coursesService"
import { createClient } from "@/superbase/client"

const supabase = createClient()

type LessonRow = {
  id: string
  course_id: string
  title: string
  video_url?: string | null
  order_index?: number | null
  duration?: number | null
}

type UIPlayLesson = {
  id: string
  week: number
  number: number
  title: string
  duration: string
  completed: boolean
  video_url?: string | null
  resumeAt?: number
}

export default function CoursePlayerPage() {
  const { courseId } = useParams() as { courseId?: string }
  const { user } = useAuth()

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [lessons, setLessons] = useState<LessonRow[]>([])
  const [currentLesson, setCurrentLesson] = useState<UIPlayLesson | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({})
  const [lessonProgress, setLessonProgress] = useState<Record<string, any>>({})
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Login required</div>
  }

  const mapToUILesson = (l: LessonRow): UIPlayLesson => {
    const order = l.order_index ?? 1
    const week = Math.max(1, Math.ceil(order / 5))
    return {
      id: l.id,
      week,
      number: order,
      title: l.title,
      duration: formatDurationMinutes(l.duration),
      completed: !!completedLessons[l.id],
      video_url: l.video_url,
      resumeAt: lessonProgress[l.id]?.last_position ?? 0,
    }
  }

  const groupedLessons = useMemo(() => {
    const grouped: Record<number, UIPlayLesson[]> = {}
    lessons.map(mapToUILesson).forEach((l) => {
      grouped[l.week] ??= []
      grouped[l.week].push(l)
    })
    return grouped
  }, [lessons, completedLessons, lessonProgress])

  const weeks = Object.keys(groupedLessons).map(Number).sort((a, b) => a - b)

  useEffect(() => {
    if (!courseId || !user) return

    const load = async () => {
      try {
        setLoading(true)

        const lessonData = await LessonsService.getLessonsByCourse(courseId)
        const enrollment = await fetchEnrollment(user.id, courseId)

        const completed: Record<string, boolean> = {}
        const progress: Record<string, any> = {}

        enrollment?.lesson_progress?.forEach((lp: any) => {
          if (lp.is_completed) completed[lp.lesson_id] = true
          progress[lp.lesson_id] = lp
        })

        setLessons(lessonData)
        setCompletedLessons(completed)
        setLessonProgress(progress)

        const first =
          lessonData.find((l) => !completed[l.id]) || lessonData[0]

        setCurrentLesson(mapToUILesson(first))
        setExpandedWeeks({ [Math.ceil((first.order_index ?? 1) / 5)]: true })
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [courseId, user])

  useEffect(() => {
    if (videoRef.current && currentLesson?.resumeAt) {
      videoRef.current.currentTime = currentLesson.resumeAt
    }
  }, [currentLesson])

  useEffect(() => {
    if (!videoRef.current || !currentLesson) return

    const video = videoRef.current

    const interval = setInterval(async () => {
      const enrollmentId = await fetchEnrollmentId(user.id, courseId!)
      if (!enrollmentId) return

      await supabase.from("lesson_progress").upsert(
        {
          enrollment_id: enrollmentId,
          lesson_id: currentLesson.id,
          last_position: Math.floor(video.currentTime),
          duration: Math.floor(video.duration),
        },
        { onConflict: "enrollment_id,lesson_id" }
      )
    }, 5000)

    const onEnded = async () => {
      const enrollmentId = await fetchEnrollmentId(user.id, courseId!)
      if (!enrollmentId) return

      await markLessonCompleted(enrollmentId, currentLesson.id)
      await recalculateEnrollmentProgress(enrollmentId)

      setCompletedLessons((p) => ({ ...p, [currentLesson.id]: true }))
      setCurrentLesson((p) => p && { ...p, completed: true })
    }

    video.addEventListener("ended", onEnded)

    return () => {
      clearInterval(interval)
      video.removeEventListener("ended", onEnded)
    }
  }, [currentLesson])

    const handleSelectLesson = (lesson: UIPlayLesson) => setCurrentLesson(lesson)

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
    <SidebarProvider style={{ "--sidebar-width": "350px" } as React.CSSProperties}>
      <AppSidebar courseId={courseId} />
      <SidebarInset className="flex flex-col min-h-screen bg-background">
        <header className="bg-background sticky top-0 flex items-center gap-2 border-b p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
          {/* VIDEO PLAYER */}
          <div className="w-full h-56 sm:h-64 md:h-[45vh] lg:h-[50vh] xl:h-[60vh] 2xl:h-[65vh] rounded-xl overflow-hidden bg-black">
            {currentLesson?.video_url ? (
              <VideoPlayer className="w-full h-full">
                <VideoPlayerContent
                  crossOrigin=""
                  muted
                  preload="auto"
                  slot="media"
                  ref={videoRef}
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
              <img src="/placeholder.svg" alt="Video player" className="w-full h-full object-cover" />
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
                        onClick={() => setExpandedWeeks(prev => ({ ...prev, [week]: !prev[week] }))}
                        className="flex justify-between items-center w-full p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors mb-2 font-semibold text-sm"
                      >
                        <span>Week {week}</span>
                        {expandedWeeks[week] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {expandedWeeks[week] && (
                        <div className="space-y-1 ml-2 mb-4">
                          {groupedLessons[week].map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => handleSelectLesson(lesson)}
                              className={`block w-full text-left p-2 rounded transition-colors text-sm ${
                                currentLesson?.id === lesson.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
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

                <h1 className="text-2xl font-bold mb-4">{currentLesson?.title}</h1>

                <div className="flex flex-wrap gap-4">
                  <Button
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
}

function formatDurationMinutes(mins?: number | null) {
  if (!mins) return "0:00"
  const m = Math.floor(mins % 60)
  const h = Math.floor(mins / 60)
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}` : `${m}:00`
}

async function fetchEnrollment(userId: string, courseId: string) {
  const { data } = await supabase
    .from("enrollments")
    .select("id, lesson_progress(*)")
    .eq("learner_id", userId)
    .eq("course_id", courseId)
    .single()
  return data
}

async function fetchEnrollmentId(userId: string, courseId: string) {
  const { data } = await supabase
    .from("enrollments")
    .select("id")
    .eq("learner_id", userId)
    .eq("course_id", courseId)
    .single()
  return data?.id ?? null
}
