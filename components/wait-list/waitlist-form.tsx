"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

// ➜ IMPORT SUPABASE SERVICE
import { addToWaitlist } from "@/services/waitlistService"

interface WaitlistFormProps {
  onSubmit: () => void
}

export function WaitlistForm({ onSubmit }: WaitlistFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [otherRole, setOtherRole] = useState("")
  const [suggestions, setSuggestions] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!name.trim() || !email.trim() || !role) {
      setError("Please fill in all required fields")
      return
    }

    if (role === "other" && !otherRole.trim()) {
      setError("Please specify your role")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email")
      return
    }

    setIsLoading(true)

    try {
      // ➜ REAL API CALL TO SUPABASE
      await addToWaitlist({
        full_name: name,
        email,
        role: role === "other" ? otherRole : role,
        Suggestions: suggestions,
      })

      onSubmit()
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-foreground">Join the Launch</h1>
            <p className="text-muted-foreground">Be part of something amazing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={role} onValueChange={setRole} disabled={isLoading}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trainer">Trainer</SelectItem>
                  <SelectItem value="learner">Learner</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "other" && (
              <div className="space-y-2">
                <Label>Specify Your Role *</Label>
                <Input
                  placeholder="Describe your role"
                  value={otherRole}
                  onChange={(e) => setOtherRole(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Suggestions */}
            <div className="space-y-2">
              <Label>Suggestions (Optional)</Label>
              <Textarea
                placeholder="Share your suggestions..."
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Error */}
            {error && <div className="text-red-600 text-sm">{error}</div>}

            {/* Submit */}
            <Button type="submit" disabled={isLoading} className="w-full h-11">
              {isLoading ? "Processing..." : "Join Waitlist"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. You can unsubscribe anytime.
          </p>
        </div>
      </Card>
    </div>
  )
}
