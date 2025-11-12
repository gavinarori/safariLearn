"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getCourseById, CourseWithTrainer } from "@/services/coursesService"
import { createEnrollment, getEnrollment } from "@/services/enrollmentServices"
import { createClient } from "@/superbase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Share2, Star, Users, Clock, Loader2 } from "lucide-react"

export default function CourseDetailsPage() {
  const { id } = useParams() as { id: string }
  const supabase = createClient()
  const [course, setCourse] = useState<CourseWithTrainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

useEffect(() => {
  const fetchCourse = async () => {
    try {
      setLoading(true)
      const data = await getCourseById(id)
      setCourse(data)

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const enrollment = await getEnrollment(id, user.id)
        if (enrollment) setIsEnrolled(true)
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch course")
    } finally {
      setLoading(false)
    }
  }

  if (id) fetchCourse()
}, [id])


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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-accent/10 pb-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex gap-3 mb-4">
                {course.category && <Badge variant="secondary">{course.category}</Badge>}
                {course.level && <Badge variant="outline">{course.level}</Badge>}
              </div>
              <h1 className="text-4xl font-bold mb-4 text-balance">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                {course.language && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span>{course.language}</span>
                  </div>
                )}
                {course.price !== null && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">${course.price.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 border-2">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg mb-6 overflow-hidden">
                    <img
                      src={course.thumbnail_url || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {course.price !== null && (
                    <div className="text-3xl font-bold mb-6">${course.price}</div>
                  )}

                  <Button
  size="lg"
  className="w-full mb-3"
  disabled={loading}
  onClick={async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert("Please log in to enroll.")
        return
      }

      // Check if already enrolled
      const existing = await getEnrollment(id, user.id)
      if (existing) {
        setIsEnrolled(true)
        alert("You're already enrolled in this course.")
        return
      }

      // Create new enrollment
      const newEnrollment = await createEnrollment(id, user.id)
      if (newEnrollment) {
        setIsEnrolled(true)
        alert("Enrollment successful! 🎉")
      } else {
        alert("Failed to enroll. Please try again.")
      }
    } catch (error) {
      console.error("Enrollment error:", error)
      alert("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }}
>
  {isEnrolled ? "Go to Course" : loading ? "Enrolling..." : "Enroll Now"}
</Button>


                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full bg-transparent"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Instructor Section */}
            {course.trainer && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Meet Your Trainer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6">
                    <Avatar className="w-20 h-20 flex-shrink-0">
                      <AvatarImage src={course.trainer.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        {course.trainer.full_name?.charAt(0).toUpperCase() || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{course.trainer.full_name}</h3>
                      <p className="text-muted-foreground mb-4">{course.trainer.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Placeholder for What You'll Learn or Curriculum (if added later) */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn everything about {course.title}. This course helps learners of all levels to
                  improve their skills through structured lessons, practical examples, and guided
                  mentorship.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Placeholder for Reviews Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Student Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No reviews yet — be the first to rate this course after enrolling!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
