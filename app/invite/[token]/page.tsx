"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { createClient } from "@/superbase/client"

const supabase = createClient()

export default function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()

  const [invite, setInvite] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const loadInvite = async () => {
      const { data, error } = await supabase
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

      if (error || !data) {
        setError("Invite not found or expired")
        setLoading(false)
        return
      }

      if (data.status === "sent") {
        await supabase
          .from("invites")
          .update({
            status: "viewed",
            viewed_at: new Date().toISOString(),
          })
          .eq("id", data.id)
      }

      setInvite(data)
      setLoading(false)
    }

    loadInvite()
  }, [token])

  const handleAccept = async () => {
    if (!invite) return
    setProcessing(true)

    const { data: auth } = await supabase.auth.getUser()

    //  Not logged in → redirect to signup/login WITH redirectTo
    if (!auth.user) {
      const redirectTo = `${window.location.origin}/invite/${token}`
      router.push(
        `/signup?email=${encodeURIComponent(invite.email)}&redirectTo=${encodeURIComponent(redirectTo)}`
      )
      return
    }

    //  Accept invite
    await supabase
      .from("invites")
      .update({
        status: "accepted",
        accepted: true,
        accepted_at: new Date().toISOString(),
      })
      .eq("id", invite.id)

    //  Prevent duplicate enrollment
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", auth.user.id)
      .eq("course_id", invite.course_id)
      .maybeSingle()

    if (!existingEnrollment) {
      await supabase.from("enrollments").insert({
        user_id: auth.user.id,
        course_id: invite.course_id,
        company_id: invite.company_id,
        status: "active",
      })
    }

    await supabase
      .from("invites")
      .update({
        status: "enrolled",
        enrolled_at: new Date().toISOString(),
      })
      .eq("id", invite.id)

    router.push(`/learn/${invite.course_id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="mx-auto text-destructive mb-2" />
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto text-primary w-10 h-10 mb-2" />
          <CardTitle>You’re invited 🎉</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {invite.companies.name} invited you to:
          </p>
          <p className="font-semibold">{invite.courses.title}</p>
          <p className="text-xs text-muted-foreground">{invite.email}</p>

          <Button onClick={handleAccept} disabled={processing} className="w-full">
            {processing ? "Processing..." : "Accept & Start Learning"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
