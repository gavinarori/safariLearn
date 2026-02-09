"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Send, Loader2, Check, History } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ModeSwitcher } from "@/components/toggle-theme"

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
  courseTitle: string
  status: "pending" | "accepted" | "expired" | "failed"
  createdAt: string
}

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
      setHistory(await InviteManager.getMyInvites())
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

  /* ---------------------------------- UI ---------------------------------- */

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold mt-2">Invite Employees</h1>
            <p className="text-muted-foreground">Invite users & track invite status</p>
          </div>
          <ModeSwitcher />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* STEP 1: COURSE */}
        <Card>
          <CardHeader>
            <CardTitle>1. Select a Course</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCourses ? (
              <Loader2 className="animate-spin" />
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {courses.map(course => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`p-4 border rounded-lg text-left transition ${
                      selectedCourse === course.id
                        ? "border-primary bg-primary/5"
                        : "hover:border-muted-foreground/40"
                    }`}
                  >
                    <p className="font-semibold">{course.title}</p>
                    <div className="flex gap-2 mt-2">
                      {course.category && <Badge>{course.category}</Badge>}
                      {course.level && <Badge variant="outline">{course.level}</Badge>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* STEP 2: EMAILS */}
        {selectedCourse && (
          <Card>
            <CardHeader>
              <CardTitle>2. Add Email Addresses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inviteRows.map(row => (
                <div key={row.id} className="flex gap-2">
                  <input
                    type="email"
                    value={row.email}
                    onChange={e => updateEmail(row.id, e.target.value)}
                    placeholder="employee@company.com"
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInviteRow(row.id)}
                    disabled={inviteRows.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button variant="outline" onClick={addInviteRow} className="w-full gap-2">
                <Plus className="w-4 h-4" /> Add another email
              </Button>

              <p className="text-xs text-muted-foreground">
                {validEmails.length}/{inviteRows.length} valid emails
              </p>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: MESSAGE */}
        {selectedCourse && (
          <Card>
            <CardHeader>
              <CardTitle>3. Optional Message</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                rows={4}
                className="w-full border rounded-lg p-3"
                placeholder="Add a short note for the invite email..."
              />
            </CardContent>
          </Card>
        )}

        {/* SEND */}
        {selectedCourse && !showResults && (
          <Button
            onClick={handleSendInvites}
            disabled={!canSend || isSending}
            className="w-full gap-2"
          >
            {isSending ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
            Send Invites
          </Button>
        )}

        {/* RESULTS */}
        {showResults && (
          <Card className="bg-primary/5 border-primary/40">
            <CardHeader>
              <CardTitle>Invites Sent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.map(r => (
                <div key={r.email} className="flex justify-between items-center p-3 border rounded-lg">
                  <span>{r.email}</span>
                  <Check className="text-green-500 w-5 h-5" />
                </div>
              ))}
              <Button onClick={() => setShowResults(false)} className="w-full mt-3">
                Invite More
              </Button>
            </CardContent>
          </Card>
        )}

        {/* HISTORY */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <History className="w-5 h-5" />
            <CardTitle>Invite History</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingHistory ? (
              <Loader2 className="animate-spin" />
            ) : history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invites sent yet</p>
            ) : (
              <div className="space-y-2">
                {history.map(invite => (
                  <div key={invite.id} className="flex justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {invite.courseTitle} • {new Date(invite.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        invite.status === "accepted"
                          ? "default"
                          : invite.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {invite.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  )
}
