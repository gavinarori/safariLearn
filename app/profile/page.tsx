"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Mail, Phone, MapPin, Award, Eye, EyeOff } from "lucide-react"

// Mock user data
const userData = {
  name: "Alex Thompson",
  email: "alex.thompson@example.com",
  phone: "+1 (555) 123-4567",
  location: "Los Angeles, CA",
  bio: "Passionate about fitness and helping others achieve their goals. 5+ years of coaching experience.",
  avatar: "/placeholder.svg?key=evqvs",
  joinDate: "January 15, 2023",
  certificates: [
    {
      id: 1,
      name: "Advanced Strength Training Certification",
      issuer: "CoachHub Academy",
      date: "March 2024",
      certificate: "https://example.com/cert1.pdf",
    },
    {
      id: 2,
      name: "Sports Nutrition Specialist",
      issuer: "International Sports Nutrition Board",
      date: "December 2023",
      certificate: "https://example.com/cert2.pdf",
    },
  ],
  preferences: {
    emailNotifications: true,
    courseUpdates: true,
    weeklyDigest: false,
    communityFeatures: true,
  },
}

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    location: userData.location,
    bio: userData.bio,
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [preferences, setPreferences] = useState(userData.preferences)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handlePreferenceChange = (key: string) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile, preferences, and account security</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            {/* Profile Header Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                      <AvatarFallback>AT</AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors">
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{userData.name}</h2>
                    <p className="text-muted-foreground">Member since {userData.joinDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your basic profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="min-h-24"
                  />
                  <p className="text-xs text-muted-foreground">{formData.bio.length}/500 characters</p>
                </div>

                <Button onClick={handleSaveProfile} size="lg">
                  {saveSuccess ? "Saved Successfully!" : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certificates & Credentials
                </CardTitle>
                <CardDescription>Your professional certifications and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.certificates.map((cert) => (
                  <div key={cert.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        <p className="text-xs text-muted-foreground">{cert.date}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Add Certificate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6 space-y-6">
            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                    />
                    <button
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your new password"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <p className="text-sm">Password requirements:</p>
                  <ul className="text-xs mt-2 space-y-1 text-muted-foreground">
                    <li>At least 8 characters long</li>
                    <li>Mix of uppercase and lowercase letters</li>
                    <li>At least one number and one special character</li>
                  </ul>
                </div>

                <Button size="lg">Update Password</Button>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Two-factor authentication adds an extra layer of security by requiring a verification code in addition
                  to your password.
                </p>
                <Button variant="outline" size="lg">
                  Enable Two-Factor Authentication
                </Button>
              </CardContent>
            </Card>

            {/* Login Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Login Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { device: "Chrome on macOS", time: "Today at 2:30 PM", location: "Los Angeles, CA" },
                  { device: "Safari on iPhone", time: "Yesterday at 9:15 AM", location: "Los Angeles, CA" },
                  { device: "Firefox on Windows", time: "2 days ago at 11:45 PM", location: "New York, NY" },
                ].map((login, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm">{login.device}</p>
                        <p className="text-xs text-muted-foreground">{login.location}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{login.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="mt-6 space-y-6">
            {/* Email Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what email notifications you'd like to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "emailNotifications",
                    title: "General Notifications",
                    description: "Important updates about your account and courses",
                  },
                  {
                    key: "courseUpdates",
                    title: "Course Updates",
                    description: "Notifications when instructors update your enrolled courses",
                  },
                  {
                    key: "weeklyDigest",
                    title: "Weekly Digest",
                    description: "A summary of new courses and content relevant to you",
                  },
                  {
                    key: "communityFeatures",
                    title: "Community Features",
                    description: "Replies to your questions and discussions",
                  },
                ].map((pref) => (
                  <div key={pref.key} className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{pref.title}</p>
                      <p className="text-sm text-muted-foreground">{pref.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences[pref.key as keyof typeof preferences]}
                      onChange={() => handlePreferenceChange(pref.key)}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Data & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Mail className="w-4 h-4 mr-2" />
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Delete My Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
