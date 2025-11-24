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

interface WaitlistFormProps {
  onSubmit: () => void
}

 function WaitlistForm({ onSubmit }: WaitlistFormProps) {
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

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10"
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
                disabled={isLoading}
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select value={role} onValueChange={setRole} disabled={isLoading}>
                <SelectTrigger id="role" className="h-10">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trainer">Trainer</SelectItem>
                  <SelectItem value="learner">Learner</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional Other Role Input */}
            {role === "other" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <Label htmlFor="otherRole" className="text-sm font-medium">
                  Specify Your Role <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="otherRole"
                  placeholder="Describe your role"
                  value={otherRole}
                  onChange={(e) => setOtherRole(e.target.value)}
                  className="h-10"
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Suggestions */}
            <div className="space-y-2">
              <Label htmlFor="suggestions" className="text-sm font-medium">
                Suggestions & Ideas <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
              </Label>
              <Textarea
                id="suggestions"
                placeholder="Share your ideas or suggestions for our launch..."
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                className="min-h-32 resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Join Waitlist
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer Note */}
          <p className="text-xs text-muted-foreground text-center">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </Card>
    </div>
  )
}


export default WaitlistForm;