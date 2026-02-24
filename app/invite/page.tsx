"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Send, Loader2, Check, History } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {InviteHistoryTable} from "@/components/invites-table"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import InvitePageSkeleton from "@/components/InvitePageSkeleton"
import { InviteManager } from "@/services/invite.service"
import { getAllCourses } from "@/services/coursesService"

interface InviteRow {
  id: string
  email: string
}

interface Course {
  id: string
  title: string
  category?: string
  level?: string
}

interface InviteResult {
  email: string
  status: "invited" | "enrolled"
}

interface InviteHistory {
  id: string
  email: string
  status: "sent" | "viewed" | "accepted" | "enrolled"
  createdAt: string
  viewedAt?: string | null
  acceptedAt?: string | null
  enrolledAt?: string | null
  expiresAt: string
  course: {
    id: string
    title: string | null
  } | null
  role?: string
  token?: string
  accepted?: boolean
  company?: string
}

const STEPS = [
  { number: 1, label: "Select Course", key: "course" },
  { number: 2, label: "Add Emails", key: "emails" },
  { number: 3, label: "Review & Send", key: "send" },
]

export default function InvitePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [inviteRows, setInviteRows] = useState<InviteRow[]>([{ id: "1", email: "" }])
  const [customMessage, setCustomMessage] = useState("")

  const [history, setHistory] = useState<InviteHistory[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  const [loadingCourses, setLoadingCourses] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [results, setResults] = useState<InviteResult[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    loadCourses()
    loadInviteHistory()
  }, [])

  const loadCourses = async () => {
    try {
      setCourses(await getAllCourses())
    } finally {
      setLoadingCourses(false)
    }
  }

  const loadInviteHistory = async () => {
    try {
      setHistory(await InviteManager.getCompanyInviteHistory())
    } finally {
      setLoadingHistory(false)
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const validEmails = inviteRows.filter(r => emailRegex.test(r.email))
  const canSend = selectedCourse && validEmails.length === inviteRows.length

  const addInviteRow = () =>
    setInviteRows([...inviteRows, { id: crypto.randomUUID(), email: "" }])

  const removeInviteRow = (id: string) =>
    inviteRows.length > 1 && setInviteRows(inviteRows.filter(r => r.id !== id))

  const updateEmail = (id: string, email: string) =>
    setInviteRows(inviteRows.map(r => (r.id === id ? { ...r, email } : r)))

  const handleSendInvites = async () => {
    if (!canSend) return

    setIsSending(true)
    try {
      const course = courses.find(c => c.id === selectedCourse)

      const res = await InviteManager.inviteEmployeesToCourse({
        emails: inviteRows.map(r => r.email),
        courseId: selectedCourse,
        courseName: course?.title ?? "Course",
        message: customMessage,
      })

      setResults(res)
      setShowResults(true)
      await loadInviteHistory()

      setInviteRows([{ id: "1", email: "" }])
      setCustomMessage("")
    } finally {
      setIsSending(false)
    }
  }

  const getCurrentStep = () => {
    if (showResults) return 3
    if (selectedCourse) return 2
    return 1
  }

  const currentStep = getCurrentStep()

  if (loadingCourses || loadingHistory) {
  return <InvitePageSkeleton />
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
          {/* HEADER */}
          <header className="sticky top-0 bg-background/95 backdrop-blur z-50 border-b border-border/40">
            <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Invite Employees</h1>
                <p className="text-sm text-muted-foreground mt-1">Invite users to courses and track their status</p>
              </div>
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* STEP INDICATOR */}
            <div className="mb-12">
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-border/40 z-0" />
                <div
                  className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300 z-0"
                  style={{
                    width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                  }}
                />

                {/* Step indicators */}
                <div className="flex justify-between w-full relative z-10">
                  {STEPS.map((step) => (
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

            {/* STEP 1: COURSE SELECTION */}
            <div className={`mb-8 ${showResults ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  1
                </div>
                <h2 className="text-lg font-semibold">Select a Course</h2>
              </div>

              {loadingCourses ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin w-5 h-5 text-muted-foreground" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {courses.map(course => (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourse(course.id)}
                      className={`p-4 rounded-lg text-left transition-all border ${
                        selectedCourse === course.id
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                          : "border-border/40 hover:border-border/60 hover:bg-muted/30"
                      }`}
                    >
                      <p className="font-semibold text-sm leading-tight">{course.title}</p>
                      <div className="flex gap-2 mt-3">
                        {course.category && <Badge variant="secondary" className="text-xs">{course.category}</Badge>}
                        {course.level && <Badge variant="outline" className="text-xs">{course.level}</Badge>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            {selectedCourse && !showResults && <div className="h-px bg-border/40 my-8" />}

            {/* STEP 2: EMAIL ADDRESSES */}
            {selectedCourse && !showResults && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    2
                  </div>
                  <h2 className="text-lg font-semibold">Add Email Addresses</h2>
                </div>

                <div className="space-y-3 mb-4">
                  {inviteRows.map(row => (
                    <div key={row.id} className="flex gap-2">
                      <input
                        type="email"
                        value={row.email}
                        onChange={e => updateEmail(row.id, e.target.value)}
                        placeholder="employee@company.com"
                        className="flex-1 px-3 py-2 rounded-lg border border-border/40 bg-background text-sm transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInviteRow(row.id)}
                        disabled={inviteRows.length === 1}
                        className="h-10 w-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  onClick={addInviteRow} 
                  className="w-full gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Add another email
                </Button>

                <p className="text-xs text-muted-foreground mt-3">
                  {validEmails.length}/{inviteRows.length} valid emails
                </p>
              </div>
            )}

            {/* Divider */}
            {selectedCourse && !showResults && <div className="h-px bg-border/40 my-8" />}

            {/* STEP 3: MESSAGE & SEND */}
            {selectedCourse && !showResults && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    3
                  </div>
                  <h2 className="text-lg font-semibold">Add Message (Optional)</h2>
                </div>

                <textarea
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border/40 bg-background text-sm transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  placeholder="Add a personal note to include in the invite email..."
                />

                <Button
                  onClick={handleSendInvites}
                  disabled={!canSend || isSending}
                  className="w-full mt-6 gap-2"
                  size="lg"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Invites
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* RESULTS */}
            {showResults && (
              <div className="mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
                      <Check className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-semibold">Invites Sent Successfully</h2>
                    <p className="text-sm text-muted-foreground mt-1">{results.length} emails delivered</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {results.map(r => (
                    <div key={r.email} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
                      <span className="text-sm font-medium">{r.email}</span>
                      <Check className="text-green-600 w-4 h-4" />
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => {
                    setShowResults(false)
                    setSelectedCourse("")
                  }} 
                  className="w-full"
                >
                  Send More Invites
                </Button>
              </div>
            )}

            {/* Divider */}
            {(selectedCourse || showResults) && <div className="h-px bg-border/40 my-12" />}

            {/* HISTORY SECTION */}
            <Card>
  <CardHeader className="flex flex-row items-center gap-2">
    <History className="w-5 h-5" />
    <CardTitle>Invite History</CardTitle>
  </CardHeader>

  <CardContent>
    {loadingHistory ? (
      <Loader2 className="animate-spin" />
    ) : history.length === 0 ? (
      <p className="text-sm text-muted-foreground">
        No invites sent yet
      </p>
    ) : (
      <InviteHistoryTable data={history} />
    )}
  </CardContent>
</Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
