"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { createClient } from "@/superbase/client"

const supabase = createClient()

interface InviteData {
  email: string
  courseId: string
  courseName: string
  companyId: string
  companyName: string
}

export default function AcceptInvitePage() {
  const { token } = useParams() as { token: string }
  const router = useRouter()

  const [inviteData, setInviteData] = useState<InviteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const loadInvite = async () => {
      try {
        const { data: invite , error } = await supabase
          .from("invites")
          .select(`
            id,
            email,
            company_id,
            course_id,
            status,
            companies ( name ),
            courses ( title )
          `)
          .eq("token", token)
          .gt("expires_at", new Date().toISOString())
          .single()

        if (error || !invite) {
          setError("Invitation not found or has expired")
          return
        }

        // 🔹 Mark as viewed (first open only)
        if (invite.status === "sent") {
          await supabase
            .from("invites")
            .update({
              status: "viewed",
              viewed_at: new Date().toISOString(),
            })
            .eq("id", invite.id)
        }

        setInviteData({
          email: invite.email,
          courseId: invite.course_id,
          courseName: invite.courses.title,
          companyId: invite.company_id,
          companyName: invite.companies.name,
        })
      } catch (err) {
        console.error(err)
        setError("Failed to load invitation")
      } finally {
        setLoading(false)
      }
    }

    loadInvite()
  }, [token])

  const handleAcceptInvite = async () => {
    if (!inviteData) return

    setIsProcessing(true)
    try {
      const { data } = await supabase.auth.getUser()

      // 🔹 Not logged in → signup
      if (!data.user) {
        router.push(`/auth/signup?email=${encodeURIComponent(inviteData.email)}`)
        return
      }

      // 🔹 Mark invite accepted
      await supabase
        .from("invites")
        .update({
          status: "accepted",
          accepted: true,
          accepted_at: new Date().toISOString(),
        })
        .eq("token", token)

      // 🔹 Create enrollment
      await supabase.from("enrollments").insert({
        user_id: data.user.id,
        course_id: inviteData.courseId,
        company_id: inviteData.companyId,
        status: "active",
      })

      // 🔹 Mark invite enrolled
      await supabase
        .from("invites")
        .update({
          status: "enrolled",
          enrolled_at: new Date().toISOString(),
        })
        .eq("token", token)

      router.push(`/learn/${inviteData.courseId}`)
    } catch (err) {
      console.error(err)
      setError("Failed to accept invitation")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <AlertCircle className="w-10 h-10 text-destructive mb-4" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
          <CardTitle>You’re Invited 🎉</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div>
            <p className="text-muted-foreground">
              {inviteData?.companyName} invited you to:
            </p>
            <h2 className="text-lg font-semibold">
              {inviteData?.courseName}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {inviteData?.email}
            </p>
          </div>

          <Button
            onClick={handleAcceptInvite}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Accept & Start Learning"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
