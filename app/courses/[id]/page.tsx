"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/superbase/client"

import { getCourseById, CourseWithTrainer } from "@/services/coursesService"
import { getEnrollment } from "@/services/enrollmentServices"
import { getCurrentUserProfile } from "@/services/userService"

import {
  CalendarEvent,
  getFullCalendarForUser,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/services/calendarService"

import { EventCalendar } from "@/components/event-calendar/event-calendar"
import { SidebarProvider } from "@/components/ui/sidebar"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Heart, Share2, Star, Clock, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function CourseDetailsPage() {
  const { id: courseId } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [course, setCourse] = useState<CourseWithTrainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])

  /**
   * Fetch course + enrollment
   */
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)

        const data = await getCourseById(courseId)
        setCourse(data)

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const enrollment = await getEnrollment(courseId, user.id)
        if (!enrollment) return

        setIsEnrolled(true)

        const userEvents = await getFullCalendarForUser(courseId, user.id)

        setEvents(
          userEvents.map((e: any) => ({
            ...e,
            start: new Date(e.start_time),
            end: new Date(e.end_time),
            color: e.color ?? "blue",
          }))
        )
      } catch (err: any) {
        setError(err.message || "Failed to load course")
      } finally {
        setLoading(false)
      }
    }

    if (courseId) fetchCourse()
  }, [courseId])

  /**
   * Realtime calendar updates
   */
  useEffect(() => {
    if (!isEnrolled) return

    const channel = supabase
      .channel("course-events")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "course_events",
          filter: `course_id=eq.${courseId}`,
        },
        async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (!user) return

          const userEvents = await getFullCalendarForUser(courseId, user.id)

          setEvents(
            userEvents.map((e: any) => ({
              ...e,
              start: new Date(e.start_time),
              end: new Date(e.end_time),
              color: e.color ?? "blue",
            }))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [courseId, isEnrolled])

  /**
   * Enroll handler
   */
  const handleEnroll = async () => {
    try {
      setButtonLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      if (isEnrolled) {
        router.push(`/learn/${courseId}`)
        return
      }

      const profile = await getCurrentUserProfile()
      if (!profile) throw new Error("Profile missing")

      // Paid → Pricing
      if (course?.price && course.price > 0) {
        router.push(`/pricing?courseId=${courseId}`)
        return
      }

      // Free → Direct enroll
      await supabase.from("enrollments").insert({
        user_id: user.id,
        course_id: courseId,
        status: "active",
      })

      toast.success("Enrolled successfully")
      router.push(`/learn/${courseId}`)
    } catch (err) {
      console.error(err)
      toast.error("Enrollment failed")
    } finally {
      setButtonLoading(false)
    }
  }

  /**
   * Calendar handlers
   */
  const handleEventAdd = async (event: any) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not found")

      const newEvent = await createCalendarEvent({
        title: event.title,
        description: event.description,
        start_time: event.start.toISOString(),
        end_time: event.end.toISOString(),
        color: event.color,
        course_id: courseId,
        user_id: user.id,
      })

      setEvents((prev) => [...prev, newEvent])
      toast.success("Event created")
    } catch {
      toast.error("Failed to add event")
    }
  }

  const handleEventUpdate = async (event: any) => {
    if (!event.id) return

    const updated = await updateCalendarEvent(event.id, {
      title: event.title,
      description: event.description,
      start_time: event.start.toISOString(),
      end_time: event.end.toISOString(),
      color: event.color,
    })

    setEvents((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    )

    toast.success("Event updated")
  }

  const handleEventDelete = async (eventId: string) => {
    await deleteCalendarEvent(eventId)
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
    toast.success("Event deleted")
  }

  /**
   * UI states
   */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => location.reload()}>Retry</Button>
      </div>
    )
  }

  if (!course) {
    return <p className="text-center py-20">Course not found</p>
  }

  const isFree = !course.price || course.price === 0
  const buttonLabel = isEnrolled
    ? "Go to Course"
    : isFree
    ? "Start Learning"
    : "Enroll Now"

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        {/* MAIN */}
        <div className="lg:col-span-2">
          <div className="flex gap-3 mb-4">
            {course.category && <Badge>{course.category}</Badge>}
            {course.level && <Badge variant="outline">{course.level}</Badge>}
          </div>

          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-muted-foreground mb-6">{course.description}</p>

          <div className="flex gap-6 mb-6">
            {course.language && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {course.language}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {isFree ? "Free" : `$${course.price}`}
            </div>
          </div>

          {isEnrolled && (
            <SidebarProvider>
              <EventCalendar
                courseId={courseId}
                events={events}
                onEventAdd={handleEventAdd}
                onEventUpdate={handleEventUpdate}
                onEventDelete={handleEventDelete}
              />
            </SidebarProvider>
          )}
        </div>

        {/* SIDEBAR */}
        <Card className="sticky top-6">
          <CardContent className="p-6">
            <img
              src={course.thumbnail_url || "/placeholder.svg"}
              className="rounded mb-4"
            />

            <div className="text-3xl font-bold mb-6">
              {isFree ? "Free" : `$${course.price}`}
            </div>

            <Button
              size="lg"
              className="w-full mb-3"
              onClick={handleEnroll}
              disabled={buttonLoading}
            >
              {buttonLoading ? "Processing..." : buttonLabel}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart className="w-4 h-4 mr-2" />
              {isFavorited ? "Favorited" : "Add to Favorites"}
            </Button>

            <Button variant="ghost" className="w-full mt-3">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
