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
  courseName: string
  courseId: string
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
        const { data: invite, error: inviteError } = await supabase
          .from("invites")
          .select(
            `
            email,
            company_id,
            companies (name)
          `,
          )
          .eq("token", token)
          .gt("expires_at", new Date().toISOString())
          .single()

        if (inviteError || !invite) {
          setError("Invitation not found or has expired")
          return
        }

        // For now, set sample data - in production this would come from the invite
        setInviteData({
          email: invite.email,
          courseName: "Data Protection Compliance",
          courseId: "",
          companyName: invite.companies?.name || "Company",
        })
      } catch (err) {
        console.error("Error loading invite:", err)
        setError("Failed to load invitation")
      } finally {
        setLoading(false)
      }
    }

    loadInvite()
  }, [token])

  const handleAcceptInvite = async () => {
    setIsProcessing(true)
    try {
      const { data: user } = await supabase.auth.getUser()

      if (!user.user) {
        // Redirect to signup with email
        router.push(`/auth/signup?email=${encodeURIComponent(inviteData?.email || "")}`)
        return
      }

      // User is already logged in, accept invite and redirect to course
      const { error: updateError } = await supabase.from("invites").update({ accepted: true }).eq("token", token)

      if (updateError) throw updateError

      // Redirect to course
      router.push(`/learn/${inviteData?.courseId}`)
    } catch (err) {
      console.error("Error accepting invite:", err)
      setError("Failed to accept invitation")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your invitation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertCircle className="w-12 h-12 text-destructive flex-shrink-0" />
              <div>
                <h2 className="font-semibold mb-2">Unable to Accept Invitation</h2>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => router.push("/")} variant="outline">
                  Go to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-transparent to-transparent flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">You're Invited!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 text-center">
            <p className="text-muted-foreground">{inviteData?.companyName} has invited you to complete:</p>
            <h2 className="text-xl font-semibold">{inviteData?.courseName}</h2>
            <p className="text-sm text-muted-foreground">{inviteData?.email}</p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
            <p className="font-medium">What's Next?</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>✓ Learn at your own pace with our reading-first content</li>
              <li>✓ Take quizzes at checkpoint milestones</li>
              <li>✓ Track your progress anytime</li>
            </ul>
          </div>

          <Button onClick={handleAcceptInvite} disabled={isProcessing} className="w-full gap-2">
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Accepting...
              </>
            ) : (
              "Accept & Start Learning"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">Don't have an account? We'll create one for you.</p>
        </CardContent>
      </Card>
    </div>
  )
}
