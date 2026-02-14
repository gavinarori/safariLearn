"use client"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { useAuth } from "@/contexts/auth"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { signUp } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // using search params client component to read current search url parameter
  const inviteEmail = searchParams.get("email")
  const inviteToken = searchParams.get("invite")
  const isInviteSignup = !!inviteToken

  const redirectTo = useMemo(
    () => searchParams.get("redirectTo") ?? "/dashboard",
    [searchParams]
  )

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState(inviteEmail ?? "")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const avatars = [
    "/averagebulk@192.webp",
    "/batperson@192.webp",
    "/gordon@192.webp",
    "/idiotsandwich@192.webp",
    "/spiderperson@192.webp",
    "/superperson@192.webp",
    "/wonderperson@192.webp",
    "/yellingcat@192.webp",
    "/yellingwoman@192.webp",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)

      await signUp(
        email,
        password,
        {
          full_name: fullName,
          role: isInviteSignup ? "employee" : "company_admin",
          avatar_url: avatarUrl || null,
          bio: bio || null,
        },
        redirectTo
      )

      // ✅ Non-invite fallback
      if (!isInviteSignup) {
        router.push("/login")
      }
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Failed to create account.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            {isInviteSignup
              ? "You were invited to join a company"
              : "Create an admin account to get started"}
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="fullName">Full name</FieldLabel>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            value={email}
            disabled={!!inviteEmail}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {inviteEmail && (
            <FieldDescription>
              This email was provided in your invite
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Confirm Password</FieldLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Choose an Avatar</FieldLabel>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" type="button">
                {avatarUrl ? (
                  <Avatar>
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ) : (
                  "Select Avatar"
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Your Avatar</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-4">
                {avatars.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setAvatarUrl(src)}
                    className={cn(
                      "rounded-full border-2 transition",
                      avatarUrl === src
                        ? "border-primary scale-105"
                        : "border-transparent hover:border-muted"
                    )}
                  >
                    <Image src={src} alt="avatar" width={64} height={64} />
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <FieldDescription>
            You can change this later
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel>Short bio (optional)</FieldLabel>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
        </Field>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </FieldGroup>
    </form>
  )
}
