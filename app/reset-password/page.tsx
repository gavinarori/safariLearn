"use client"

import { useState } from "react"
import { createClient } from "@/superbase/client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {

const supabase = createClient();
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    if (password !== confirm) {
      alert("Passwords do not match")
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      alert("Password updated successfully ✅")
      window.location.href = "/login"
    } catch (err) {
      console.error(err)
      alert("Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Reset Password</h1>

        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <Button onClick={handleReset} disabled={loading}>
          Update Password
        </Button>
      </div>
    </div>
  )
}
