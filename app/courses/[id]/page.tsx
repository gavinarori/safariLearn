"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/superbase/client"
import { getCourseById, CourseWithTrainer } from "@/services/coursesService"
import { getEnrollment } from "@/services/enrollmentServices"
import { getCurrentUserProfile } from "@/services/userService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { EventCalendar } from "@/components/event-calendar/event-calendar"
import {
  CalendarEvent,
  getFullCalendarForUser,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/services/calendarService"

const ENROLLMENT_STEPS = [
  { number: 1, label: "Course Details", key: "course" },
  { number: 2, label: "Choose Plan", key: "pricing" },
  { number: 3, label: "Payment", key: "payment" },
  { number: 4, label: "Verification", key: "verify" },
]

interface EnrollmentState {
  courseId: string | null
  userId: string | null
  userEmail: string | null
  companyId: string | null
  selectedPlan: any | null
  paymentReference: string | null
}

export default function EnrollmentFlow() {
  const { id: courseId } = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [course, setCourse] = useState<CourseWithTrainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [enrollmentState, setEnrollmentState] = useState<EnrollmentState>({
    courseId: courseId as string,
    userId: null,
    userEmail: null,
    companyId: null,
    selectedPlan: null,
    paymentReference: null,
  })
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [buttonLoading, setButtonLoading] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  // Pricing plans with features
  const seatPlans = [
    { 
      id: "individual", 
      name: "Individual", 
      seats: 1, 
      description: "Single learner access",
      features: [
        "1 learner seat",
        "Full course access",
        "Certificate of completion",
        "Lifetime access",
      ]
    },
    { 
      id: "team_10", 
      name: "Team 10", 
      seats: 10, 
      description: "Invite up to 10 employees",
      recommended: true,
      features: [
        "10 employee seats",
        "Invite employees via email",
        "Progress tracking",
        "10% team discount",
      ]
    },
    { 
      id: "team_25", 
      name: "Team 25", 
      seats: 25, 
      description: "Invite up to 25 employees",
      features: [
        "25 employee seats",
        "Invite employees via email",
        "Progress tracking",
        "10% team discount",
      ]
    },
    { 
      id: "team_50", 
      name: "Team 50", 
      seats: 50, 
      description: "Invite up to 50 employees",
      features: [
        "50 employee seats",
        "Invite employees via email",
        "Progress tracking",
        "10% team discount",
      ]
    },
  ]

  // Initial load and auth check
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)

        // Get course data
        const courseData = await getCourseById(courseId as string)
        setCourse(courseData)

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push(`/login?redirect=${encodeURIComponent(`/courses/${courseId}`)}`);
          return
        }

        setEnrollmentState(prev => ({
          ...prev,
          userId: user.id,
          userEmail: user.email ?? null,
        }))

        // Check if already enrolled
        const enrollment = await getEnrollment(courseId as string)
        if (enrollment) {
          setIsEnrolled(true)
          setCurrentStep(1)
        } else {
          // Check if this is a return from payment
          const paymentRef = searchParams.get("reference")
          if (paymentRef) {
            setCurrentStep(4) // Go to verification
            setEnrollmentState(prev => ({
              ...prev,
              paymentReference: paymentRef,
            }))
          } else {
            setCurrentStep(1)
          }
        }

        // Get company info
        const { data: profile } = await supabase
          .from("users")
          .select("company_id")
          .eq("id", user.id)
          .single()

        if (profile?.company_id) {
          setEnrollmentState(prev => ({
            ...prev,
            companyId: profile.company_id,
          }))
        }
      } catch (err: any) {
        setError(err.message || "Failed to load course")
      } finally {
        setLoading(false)
      }
    }

    if (courseId) fetchInitialData()
  }, [courseId, router, searchParams])

  // Calculate price with discount
  const calculatePrice = (seats: number) => {
    if (!course?.price) return 0
    const total = course.price * seats
    const discount = total * 0.1
    return total - discount
  }

  // Handle enrollment for free courses or direct enrollment
  const handleDirectEnroll = async () => {
    if (!enrollmentState.userId) return

    try {
      setButtonLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not found")

      await supabase.from("enrollments").insert({
        user_id: user.id,
        course_id: courseId,
        status: "active",
      })

      toast.success("Enrolled successfully")
      setIsEnrolled(true)
    } catch (err) {
      console.error(err)
      toast.error("Enrollment failed")
    } finally {
      setButtonLoading(false)
    }
  }

  // Move to next step
  const handleNextStep = async () => {
    if (isEnrolled) {
      router.push(`/learn/${courseId}`)
      return
    }

    if (currentStep === 1) {
      // Go to pricing for paid courses, or enroll for free
      if (course?.price && course.price > 0) {
        setCurrentStep(2)
      } else {
        await handleDirectEnroll()
      }
    } else if (currentStep === 2) {
      // Payment handled in handleCheckout
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
  // Handle checkout
  const handleCheckout = async (plan: any) => {
    if (!enrollmentState.userId || !enrollmentState.userEmail) {
      toast.error("Missing user information")
      return
    }

    try {
      setLoadingPlan(plan.id)
      setEnrollmentState(prev => ({
        ...prev,
        selectedPlan: plan,
      }))

      const amountKES = calculatePrice(plan.seats)
      const amount = Math.round(amountKES * 100)

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: enrollmentState.userEmail,
          amount,
          courseId,
          userId: enrollmentState.userId,
          companyId: enrollmentState.companyId,
          planId: plan.id,
          seats: plan.seats,
          currency: "KES",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Payment initialization failed")
      }

      // Redirect to Paystack
      window.location.href = data.authorization_url
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Payment error")
    } finally {
      setLoadingPlan(null)
    }
  }

  // Handle payment verification
  const handleVerifyPayment = async () => {
    if (!enrollmentState.paymentReference) {
      toast.error("No payment reference found")
      return
    }

    try {
      setButtonLoading(true)
      const res = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference: enrollmentState.paymentReference }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Payment verification failed")
      }

      toast.success("Payment verified!")
      setIsEnrolled(true)
      setCurrentStep(1)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Verification failed")
    } finally {
      setButtonLoading(false)
    }
  }

if (loading) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />

        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

          {/* Step skeleton */}
          <div className="flex gap-6 justify-between">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Banner skeleton */}
          <Skeleton className="w-full h-72 rounded-xl" />

          {/* Title */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/6" />
          </div>

          {/* Button */}
          <Skeleton className="h-12 w-48" />

          {/* Pricing cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mt-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-4 border rounded-xl p-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-40" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>

                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ))}
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

  if (error) {
    return (
      <div className="flex flex-col items-center min-h-screen justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => location.reload()}>Retry</Button>
      </div>
    )
  }

  if (!course) {
    return <p className="text-center py-20">Course not found</p>
  }

  const isFree = !course.price || course.price === 0
  const displaySteps = isEnrolled ? 
    [{ number: 1, label: "Course Details", key: "course" }] :
    isFree ?
    [
      { number: 1, label: "Course Details", key: "course" },
      { number: 2, label: "Confirm", key: "confirm" },
    ] :
    ENROLLMENT_STEPS

  return (
   <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* STEP INDICATOR */}
            <div className="mb-12">
              <div className="flex items-center justify-between relative mb-8">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border/40 z-0" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300 z-0"
              style={{ width: `${((currentStep - 1) / (displaySteps.length - 1)) * 100}%` }}
            />
            <div className="flex justify-between w-full relative z-10">
              {displaySteps.map(step => (
                <div key={step.key} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      step.number < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.number === currentStep
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.number < currentStep ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <span className="text-xs font-medium mt-2 text-foreground/70">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 1: COURSE DETAILS */}
        {(currentStep === 1 || isEnrolled) && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                1
              </div>
              <h2 className="text-lg font-semibold">Course Details</h2>
            </div>

            <div className="space-y-6">
              {/* Banner Image */}
              <div className="w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden bg-muted">
                <img
                  src={course.thumbnail_url || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <div className="flex gap-3 mb-4">
                    {course.category && <Badge>{course.category}</Badge>}
                    {course.level && <Badge variant="outline">{course.level}</Badge>}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{course.title}</h1>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{course.description}</p>

                  <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b">
                    {course.language && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-lg">📚</span>
                        <span>{course.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      
                      <span className="font-semibold">{isFree ? "Free" : `KES ${Number(course.price).toLocaleString()}`}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="max-w-xs">
                  {!isEnrolled ? (
                    <Button
                      size="lg"
                      className="w-full text-base"
                      onClick={handleNextStep}
                      disabled={buttonLoading}
                    >
                      {buttonLoading ? "Processing..." : isFree ? "Enroll Now" : "Choose Plan"}
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full text-base"
                      onClick={() => router.push(`/learn/${courseId}`)}
                    >
                      Go to Course
                    </Button>
                  )}
  
                </div>
                                 {isEnrolled && (
    <div className=" mt-8 w-full max-w-full">
      <h2 className="text-xl font-semibold mb-4">Track & Plan Your Learning</h2>
      <EventCalendar
        courseId={courseId}
        events={events}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />
    </div>
  )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PRICING / CONFIRMATION */}
        {currentStep === 2 && !isEnrolled && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                2
              </div>
              <h2 className="text-lg font-semibold">
                {isFree ? "Confirm Enrollment" : "Choose Your Plan"}
              </h2>
            </div>

            {isFree ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-6 text-muted-foreground">This is a free course. Click below to complete your enrollment.</p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleDirectEnroll}
                      disabled={buttonLoading}
                    >
                      {buttonLoading ? "Enrolling..." : "Confirm Enrollment"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div>
                <div className="mb-8 text-center">
                  <p className="text-lg text-muted-foreground">Save 10% when enrolling teams</p>
                </div>
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mb-8 max-w-7xl mx-auto">
                  {seatPlans.map(plan => {
                    const finalPrice = calculatePrice(plan.seats)
                    const originalPrice = course.price! * plan.seats

                    return (
                      <Card
                        key={plan.id}
                        className={`relative cursor-pointer transition-all flex flex-col h-full ${
                          enrollmentState.selectedPlan?.id === plan.id
                            ? "border-primary ring-2 ring-primary shadow-lg"
                            : "hover:border-primary/50 hover:shadow-md"
                        } ${plan.recommended ? "border-primary shadow-xl bg-primary/5 scale-105" : ""}`}
                        onClick={() => setEnrollmentState(prev => ({
                          ...prev,
                          selectedPlan: plan,
                        }))}
                      >
                        {plan.recommended && (
                          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                            Most Popular
                          </Badge>
                        )}

                        <CardHeader className="pb-4">
                          <CardTitle className="text-2xl">{plan.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                        </CardHeader>

                        <CardContent className="space-y-6 flex-1 flex flex-col">
                          <div>
                            <div className="text-3xl md:text-4xl font-bold">
                              KES {finalPrice.toLocaleString()}
                            </div>
                            {plan.seats > 1 && (
                              <div className="text-sm line-through text-muted-foreground mt-1">
                                KES {originalPrice.toLocaleString()}
                              </div>
                            )}
                          </div>

                          {/* Features */}
                          <div className="space-y-3 flex-1">
                            {plan.features.map((feature, idx) => (
                              <div key={idx} className="flex gap-3 items-start">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>

                          <Button
                            className="w-full text-sm mt-4"
                            disabled={loadingPlan === plan.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCheckout(plan)
                            }}
                          >
                            {loadingPlan === plan.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              `Select Plan`
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: VERIFICATION */}
        {currentStep === 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-3" />
                <h2 className="text-lg font-semibold">Verifying Payment</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Please wait while we verify your payment...
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                disabled={buttonLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleVerifyPayment}
                disabled={buttonLoading}
              >
                {buttonLoading ? "Verifying..." : "Verify Payment"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </SidebarInset>
    </SidebarProvider>
  )
}
