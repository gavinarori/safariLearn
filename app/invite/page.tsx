"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, Send, Loader2, Check } from "lucide-react"
import Link from "next/link"
import { InviteManager } from "@/services/invite.service"
import { getAllCourses } from "@/services/coursesService"
import { ModeSwitcher } from "@/components/toggle-theme"

interface InviteRow {
  id: string
  email: string
  status: "pending" | "error"
}

interface Course {
  id: string
  title: string
  slug: string
  category?: string
  level?: string
}

interface InviteResult {
  email: string
  status: "invited" | "enrolled"
  inviteId?: string
  enrollmentId?: string
}

export default function InvitePage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [inviteRows, setInviteRows] = useState<InviteRow[]>([{ id: "1", email: "", status: "pending" }])
  const [customMessage, setCustomMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [results, setResults] = useState<InviteResult[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getAllCourses()
        setCourses(data)
      } catch (error) {
        console.error("Failed to load courses:", error)
      } finally {
        setLoadingCourses(false)
      }
    }

    loadCourses()
  }, [])

  const addInviteRow = () => {
    const newId = Math.random().toString(36).substring(7)
    setInviteRows([...inviteRows, { id: newId, email: "", status: "pending" }])
  }

  const removeInviteRow = (id: string) => {
    if (inviteRows.length > 1) {
      setInviteRows(inviteRows.filter((row) => row.id !== id))
    }
  }

  const updateEmail = (id: string, email: string) => {
    setInviteRows(inviteRows.map((row) => (row.id === id ? { ...row, email } : row)))
  }

  const validateEmails = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return (
      inviteRows.length > 0 &&
      inviteRows.every((row) => {
        if (!row.email) return false
        return emailRegex.test(row.email)
      })
    )
  }

  const handleSendInvites = async () => {
    if (!selectedCourse || !validateEmails()) {
      alert("Please select a course and fill in valid email addresses")
      return
    }

    setIsLoading(true)
    try {
      const course = courses.find((c) => c.id === selectedCourse)
      const inviteResults = await InviteManager.inviteEmployeesToCourse({
        emails: inviteRows.map((r) => r.email),
        courseId: selectedCourse,
        courseName: course?.title || "Course",
        message: customMessage,
      })

      setResults(inviteResults)
      setShowResults(true)
      setInviteRows([{ id: "1", email: "", status: "pending" }])
      setCustomMessage("")
    } catch (error) {
      console.error("Error sending invites:", error)
      alert("Failed to send some invites. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCourseObj = courses.find((c) => c.id === selectedCourse)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Invite Employees to Course</h1>
          <p className="text-muted-foreground mt-1">Send invitations to team members for course enrollment</p>
          <div className="ml-auto flex items-center gap-2">
                    <ModeSwitcher />
                  </div>
        </div>
        
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Course Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Course</CardTitle>
              <CardDescription>Choose the course to invite employees to</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCourses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourse(course.id)}
                      className={`text-left p-4 rounded-lg border-2 transition-all ${
                        selectedCourse === course.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/30"
                      }`}
                    >
                      <h3 className="font-semibold">{course.title}</h3>
                      <div className="flex gap-2 mt-2">
                        {course.category && (
                          <Badge variant="secondary" className="text-xs">
                            {course.category}
                          </Badge>
                        )}
                        {course.level && (
                          <Badge variant="outline" className="text-xs">
                            {course.level}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email List */}
          {selectedCourse && (
            <Card>
              <CardHeader>
                <CardTitle>Add Email Addresses</CardTitle>
                <CardDescription>Add one or more employee email addresses to invite them</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {inviteRows.map((row) => (
                    <div key={row.id} className="flex gap-2">
                      <input
                        type="email"
                        placeholder="john.doe@company.com"
                        value={row.email}
                        onChange={(e) => updateEmail(row.id, e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        onClick={() => removeInviteRow(row.id)}
                        disabled={inviteRows.length === 1}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <Button variant="outline" onClick={addInviteRow} className="w-full gap-2 bg-transparent">
                  <Plus className="w-4 h-4" />
                  Add Another Email
                </Button>

                <div className="text-xs text-muted-foreground">
                  {inviteRows.filter((r) => r.email).length} email(s) ready to invite
                </div>
              </CardContent>
            </Card>
          )}

          {/* Custom Message */}
          {selectedCourse && (
            <Card>
              <CardHeader>
                <CardTitle>Custom Message (Optional)</CardTitle>
                <CardDescription>Add a personalized message to the invitation email</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="Dear team member, we've enrolled you in this important compliance course..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={4}
                />
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {showResults && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle>Invitation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.map((result, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border">
                      <div>
                        <p className="font-medium">{result.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {result.status === "invited" ? "Invitation sent" : "Automatically enrolled"}
                        </p>
                      </div>
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  ))}
                </div>

                <Button onClick={() => setShowResults(false)} className="w-full mt-4">
                  Send More Invites
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Send Button */}
          {selectedCourse && !showResults && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCourse("")
                  setInviteRows([{ id: "1", email: "", status: "pending" }])
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendInvites}
                disabled={!selectedCourse || !validateEmails() || isLoading}
                className="flex-1 gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Invites...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Invites to {inviteRows.filter((r) => r.email).length} People
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
