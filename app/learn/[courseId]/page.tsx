"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Download, MessageSquare, ChevronDown, ChevronUp, Play } from "lucide-react"

// Mock lesson data
const courseData = {
  title: "Advanced Strength Training for Athletes",
  currentLesson: {
    id: 1,
    week: 1,
    lessonNumber: 1,
    title: "Training Principles & Getting Started",
    duration: "15:23",
    completed: false,
  },
  lessons: [
    {
      id: 1,
      week: 1,
      number: 1,
      title: "Training Principles & Getting Started",
      duration: "15:23",
      type: "video",
      completed: false,
    },
    {
      id: 2,
      week: 1,
      number: 2,
      title: "Anatomy Basics for Strength Training",
      duration: "12:45",
      type: "video",
      completed: false,
    },
    {
      id: 3,
      week: 1,
      number: 3,
      title: "Assessment: Understanding Your Starting Point",
      duration: "8:30",
      type: "quiz",
      completed: false,
    },
    {
      id: 4,
      week: 1,
      number: 4,
      title: "Nutrition Fundamentals",
      duration: "18:15",
      type: "video",
      completed: false,
    },
    {
      id: 5,
      week: 1,
      number: 5,
      title: "Recovery & Sleep Optimization",
      duration: "11:20",
      type: "video",
      completed: false,
    },
    {
      id: 6,
      week: 2,
      number: 1,
      title: "Lower Body Squat Mechanics",
      duration: "22:10",
      type: "video",
      completed: false,
    },
  ],
  materials: [
    { name: "Week 1 Workout Template", type: "PDF", size: "2.4 MB" },
    { name: "Nutrition Guide", type: "PDF", size: "1.8 MB" },
    { name: "Assessment Sheet", type: "PDF", size: "0.9 MB" },
  ],
  videoUrl: "/placeholder.svg",
}

export default function CoursePlayerPage() {
  const [currentLesson, setCurrentLesson] = useState(courseData.currentLesson)
  const [lessons, setLessons] = useState(courseData.lessons)
  const [expandedWeeks, setExpandedWeeks] = useState({ 1: true, 2: false })
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

  const toggleLessonComplete = (lessonId: number) => {
    setLessons(lessons.map((l) => (l.id === lessonId ? { ...l, completed: !l.completed } : l)))
  }

  const groupedLessons = lessons.reduce(
    (acc, lesson) => {
      if (!acc[lesson.week]) acc[lesson.week] = []
      acc[lesson.week].push(lesson)
      return acc
    },
    {} as Record<number, typeof lessons>,
  )

  const weeks = Object.keys(groupedLessons)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Player Area */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            <Card className="mb-6 overflow-hidden">
              <div className="aspect-video bg-black flex items-center justify-center relative">
                <img
                  src={courseData.videoUrl || "/placeholder.svg"}
                  alt="Video player"
                  className="w-full h-full object-cover"
                />
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
                    Week {currentLesson.week} • Lesson {currentLesson.lessonNumber}
                  </Badge>
                  <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => toggleLessonComplete(currentLesson.id)}
                    variant={lessons.find((l) => l.id === currentLesson.id)?.completed ? "default" : "outline"}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Complete
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
                    <p className="text-muted-foreground mb-6">
                      In this lesson, we cover the fundamental principles of strength training that will guide your
                      entire program. We'll discuss progressive overload, proper form, rest periods, and how to
                      structure your training week. By the end of this video, you'll understand the science behind why
                      we do what we do in the gym.
                    </p>
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
                    {courseData.materials.map((material, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <div>
                          <p className="font-semibold">{material.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {material.type} • {material.size}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
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
                    <Button>Save Notes</Button>
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
                            onClick={() =>
                              setCurrentLesson({
                                id: lesson.id,
                                week: lesson.week,
                                lessonNumber: lesson.number,
                                title: lesson.title,
                                duration: lesson.duration,
                                completed: lesson.completed,
                              })
                            }
                            className={`block w-full text-left p-2 rounded transition-colors text-sm ${
                              currentLesson.id === lesson.id
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-secondary"
                            }`}
                          >
                            <div className="flex gap-2 items-start">
                              <div className="flex-1">
                                <p className="font-medium leading-tight">{lesson.title}</p>
                                <p className="text-xs opacity-70">{lesson.duration}</p>
                              </div>
                              {lesson.completed && <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-1" />}
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
  )
}
