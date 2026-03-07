"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/superbase/client"

export default function Home() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard")
      } else {
        router.replace("/Landing-page")
      }
    })

    // Listen for auth changes (useful if user logs in/out on this page)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/dashboard")
      } else {
        router.replace("/Landing-page")
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}