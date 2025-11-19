"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getCourseById, CourseWithTrainer } from "@/services/coursesService"
import { createEnrollment, getEnrollment } from "@/services/enrollmentServices"
import { createClient } from "@/superbase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Share2, Star, Clock, Loader2 } from "lucide-react"


import { EventCalendar } from "@/components/event-calendar/event-calendar"
import {
  CalendarEvent,
  getFullCalendarForUser,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/services/calendarService"

import { SidebarProvider } from "@/components/ui/sidebar"
import { toast } from "sonner"

export default function CourseDetailsPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const supabase = createClient()

  const [course, setCourse] = useState<CourseWithTrainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])


  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const data = await getCourseById(id)
        setCourse(data)

        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const enrollment = await getEnrollment(id, user.id)
          if (enrollment) setIsEnrolled(true)

          if (enrollment) {
            const userEvents = await getFullCalendarForUser(id, user.id)

            const mappedEvents: CalendarEvent[] = userEvents.map((e: any) => ({
              id: e.id,
              title: e.title,
              description: e.description,
              start_time: e.start_time,
              end_time: e.end_time,
              start: new Date(e.start_time),
              end: new Date(e.end_time),
              color: e.color ?? "blue",
              course_id: e.course_id,
              user_id: e.user_id,
            }))

            setEvents(mappedEvents)
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch course")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCourse()
  }, [id])


  useEffect(() => {
    const channel = supabase
      .channel("course-events-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "course_events",
          filter: `course_id=eq.${id}`,
        },
        async (payload) => {
          console.log("Realtime change:", payload)
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (!user) return

          const userEvents = await getFullCalendarForUser(id, user.id)

          const mapped: CalendarEvent[] = userEvents.map((e: any) => ({
            id: e.id,
            title: e.title,
            description: e.description,
            start_time: e.start_time,
            end_time: e.end_time,
            start: new Date(e.start_time),
            end: new Date(e.end_time),
            color: e.color ?? "blue",
            course_id: e.course_id,
            user_id: e.user_id,
          }))

          setEvents(mapped)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])


  const handleEnroll = async () => {
    try {
      setButtonLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        alert("Please log in to continue.")
        return
      }

      if (isEnrolled) {
        router.push(`/learn/${id}`)
        return
      }

      const created = await createEnrollment(id, user.id)
      if (!created) {
        alert("Failed to enroll. Try again.")
        return
      }

      setIsEnrolled(true)
      router.push(`/learn/${id}`)
    } catch (err) {
      console.error(err)
      alert("Something went wrong.")
    } finally {
      setButtonLoading(false)
    }
  }


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
  course_id: id,
  user_id: user.id,
});


      toast.success("Event created")

      setEvents((prev) => [...prev, newEvent])
    } catch (err) {
      console.error(err)
      toast.error("Failed to add event")
    }
  }


const handleEventUpdate = async (event: any) => {
  try {
    if (!event.id) return;

    // Strip allDay and location
    const { allDay, location, ...cleanEvent } = event;

const updated = await updateCalendarEvent(event.id, {
  title: cleanEvent.title,
  description: cleanEvent.description,
  start_time: cleanEvent.start.toISOString(),
  end_time: cleanEvent.end.toISOString(),
  color: cleanEvent.color
});


    toast.success("Event updated");

    setEvents((prev) =>
      prev.map((e) =>
        e.id === updated.id
          ? {
              ...updated,
            
            }
          : e
      )
    );
  } catch (err) {
    console.error(err);
    toast.error("Failed to update event");
  }
};



  const handleEventDelete = async (eventId: string) => {
    try {
      await deleteCalendarEvent(eventId)
      toast.success("Event deleted")
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete event")
    }
  }


  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 font-semibold mb-3">Error: {error}</p>
        <Button onClick={() => location.reload()}>Retry</Button>
      </div>
    )

  if (!course) return <p className="text-center py-20">Course not found</p>

  const isFree = course.price === 0 || course.price === null
  const buttonLabel = isEnrolled ? "Go to Course" : isFree ? "Start Learning" : "Enroll Now"


  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <div className={`relative pb-12 ${!isEnrolled ? "bg-gradient-to-r from-primary/10 to-accent/10" : ""}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* MAIN CONTENT */}
            <div className="lg:col-span-2">
              <div className="flex gap-3 mb-4">
                {course.category && <Badge variant="secondary">{course.category}</Badge>}
                {course.level && <Badge variant="outline">{course.level}</Badge>}
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

              {/* COURSE STATS */}
              <div className="flex flex-wrap gap-6 mb-8">
                {course.language && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span>{course.language}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{isFree ? "Free" : `$${course.price?.toFixed(2)}`}</span>
                </div>
              </div>

              {/* CALENDAR (ONLY WHEN ENROLLED) */}
              {isEnrolled && (
                <div className="mb-10">
                  <SidebarProvider>
                    <EventCalendar
                      courseId={id}
                      events={events}
                      onEventAdd={handleEventAdd}
                      onEventUpdate={handleEventUpdate}
                      onEventDelete={handleEventDelete}
                      initialView="day"
                    />
                  </SidebarProvider>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 border-2">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg mb-6 overflow-hidden">
                    <img src={course.thumbnail_url || "/placeholder.svg"} className="w-full h-full object-cover" />
                  </div>

                  <div className="text-3xl font-bold mb-6">{isFree ? "Free" : `$${course.price}`}</div>

                  <Button size="lg" className="w-full mb-3" disabled={buttonLoading} onClick={handleEnroll}>
                    {buttonLoading ? "Please wait..." : buttonLabel}
                  </Button>

                  <Button variant="outline" size="lg" className="w-full bg-transparent" onClick={() => setIsFavorited(!isFavorited)}>
                    <Heart className={`w-4 h-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
                    {isFavorited ? "Favorited" : "Add to Favorites"}
                  </Button>

                  <Button variant="ghost" size="lg" className="w-full mt-3">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT + TRAINER */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {course.trainer && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Meet Your Trainer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={course.trainer.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{course.trainer.full_name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{course.trainer.full_name}</h3>
                      <p className="text-muted-foreground">{course.trainer.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn everything about {course.title} with structured lessons and expert guidance.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Student Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No reviews yet — be the first after enrolling!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
