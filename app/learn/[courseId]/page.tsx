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
        <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Player Area */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            <Card className="mb-6 overflow-hidden">
              <div className="aspect-video bg-black flex items-center justify-center relative">
                {currentLesson?.video_url ? (
                  // use native video player when a real mp4 url exists
                  <video src={currentLesson.video_url || ""} controls className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={"/placeholder.svg"}
                    alt="Video player"
                    className="w-full h-full object-cover"
                  />
                )}
                <Button
                  size="lg"
                  className="absolute inset-0 m-auto w-fit h-fit opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Play className="w-6 h-6" />
                </Button>
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <Badge className="mb-2">
                    Week {currentLesson?.week} • Lesson {currentLesson?.number}
                  </Badge>
                  <h1 className="text-2xl font-bold">{currentLesson?.title}</h1>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => currentLesson && toggleLessonComplete(currentLesson.id)}
                    variant={currentLesson && currentLesson.completed ? "default" : "outline"}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {currentLesson && currentLesson.completed ? "Completed" : "Mark as Complete"}
                  </Button>

                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Materials
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="notes">My Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Lesson Overview</h3>
                    <p className="text-muted-foreground mb-6">{currentLesson?.content ?? "No description available."}</p>
                    <div>
                      <h4 className="font-semibold mb-3">Key Topics:</h4>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Progressive overload principle</li>
                        <li>Mechanical tension and muscle damage</li>
                        <li>Rest periods and recovery</li>
                        <li>Volume and intensity concepts</li>
                        <li>Program structure guidelines</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Downloadable Materials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* This example uses placeholders; replace with real materials when available */}
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors mb-2">
                      <div>
                        <p className="font-semibold">Week {currentLesson?.week} - Worksheet</p>
                        <p className="text-sm text-muted-foreground">PDF • 1.2 MB</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add your notes here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-32 mb-4"
                    />
                    <Button onClick={() => alert("Notes saved locally (demo).")}>Save Notes</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Q&A Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Questions & Answers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Textarea placeholder="Ask a question about this lesson..." className="min-h-20 mb-3" />
                  <Button>Post Question</Button>
                </div>

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="pb-4 border-b last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{comment.author}</p>
                          <p className="text-xs text-muted-foreground">{comment.time}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{comment.text}</p>
                      <Button variant="ghost" size="sm">
                        Reply ({comment.replies})
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Lessons List */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
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
                              {completedLessons[lesson.id] && <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-1" />}
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
        </div>
      </div>
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
