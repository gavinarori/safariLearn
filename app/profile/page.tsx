"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Mail,
  Phone,
  MapPin,
  Award,
  Eye,
  EyeOff,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ProfileService, UserProfile } from "@/services/profile.service"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const authUser = await ProfileService.getAuthUser()
        if (!authUser) return

        const profileData = await ProfileService.getProfile(authUser.id)

        setUser(authUser)
        setProfile(profileData)

        setFormData({
          name: profileData.full_name || "",
          email: authUser.email || "",
          phone: "",
          location: "",
          bio: profileData.bio || "",
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    if (!user) return
    try {
      setSaving(true)

      await ProfileService.updateProfile(user.id, {
        full_name: formData.name,
        bio: formData.bio,
      })

      if (formData.email !== user.email) {
        await ProfileService.updateEmail(formData.email)
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error(err)
      alert("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

const handleChangePassword = async () => {
  if (!user?.email) return

  try {
    await ProfileService.requestPasswordReset(user.email)
    alert("Password reset link sent to your email 📩")
  } catch (err) {
    console.error(err)
    alert("Failed to send password reset email")
  }
}


  const handleAvatarUpload = async (file: File) => {
    if (!user) return
    try {
      const url = await ProfileService.uploadAvatar(user.id, file)
      setProfile((prev) => (prev ? { ...prev, avatar_url: url } : prev))
    } catch (err) {
      console.error(err)
      alert("Avatar upload failed")
    }
  }

  if (loading) {
    return <div className="p-6">Loading profile...</div>
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="min-h-screen bg-background">
          <div className="max-w-6xl mx-auto p-4 lg:p-6">
            <h1 className="text-3xl font-bold mb-1">Account Settings</h1>
            <p className="text-muted-foreground mb-8">
              Manage your profile, preferences, and account security
            </p>

            <Tabs defaultValue="profile">
              <TabsList className="grid grid-cols-3 lg:w-auto">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              {/* PROFILE */}
              <TabsContent value="profile" className="mt-6 space-y-6">
                <Card>
                  <CardContent className="p-6 flex gap-6 items-end">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage
                          src={profile?.avatar_url || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {profile?.full_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer">
                        <Upload className="w-4 h-4 text-primary-foreground" />
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files &&
                            handleAvatarUpload(e.target.files[0])
                          }
                        />
                      </label>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {profile?.full_name}
                      </h2>
                      <p className="text-muted-foreground">
                        {profile?.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your basic profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    
                    </div>

                    <div>
                      <Label>Bio</Label>
                      <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                      />
                    </div>

                    <Button onClick={handleSaveProfile} disabled={saving}>
                      {saveSuccess ? "Saved!" : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SECURITY */}
              <TabsContent value="security" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={handleChangePassword}>
  Send Password Reset Link
</Button>

                  </CardContent>
                </Card>
              </TabsContent>

              {/* PREFERENCES */}
              <TabsContent value="preferences" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data & Privacy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" /> Download My Data
                    </Button>
                    <Button
  variant="outline"
  className="w-full text-destructive"
  onClick={async () => {
    if (!confirm("This action is irreversible. Continue?")) return
    await ProfileService.deleteAccount()
    await ProfileService.logout()
    window.location.href = "/"
  }}
>
  Delete My Account
</Button>

                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
