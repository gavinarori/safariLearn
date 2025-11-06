"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Share2, Star, Users, Clock } from "lucide-react"

// Mock course data
const courseData = {
  id: "1",
  title: "Advanced Strength Training for Athletes",
  description:
    "Master the fundamentals of strength training and build a personalized program for athletic performance.",
  thumbnail: "/strength-training-athletic-performance.jpg",
  price: 49.99,
  category: "Strength Training",
  level: "Advanced",
  duration: "8 weeks",
  students: 2543,
  rating: 4.8,
  reviews: 312,
  instructor: {
    name: "Coach Marcus Johnson",
    bio: "Professional strength coach with 15+ years of experience. NASM certified and works with elite athletes.",
    avatar: "/professional-coach-portrait.png",
    rating: 4.9,
    students: 12500,
    social: {
      instagram: "@coachmarcos",
      twitter: "@coachmarcos",
    },
  },
  curriculum: [
    {
      week: 1,
      title: "Foundations of Strength Training",
      lessons: 5,
      duration: "2h 30m",
      topics: ["Training Principles", "Anatomy Basics", "Program Design", "Recovery", "Nutrition"],
    },
    {
      week: 2,
      title: "Lower Body Strength",
      lessons: 6,
      duration: "3h 15m",
      topics: ["Squat Variations", "Deadlift Variations", "Accessory Exercises", "Programming", "Common Mistakes"],
    },
    {
      week: 3,
      title: "Upper Body Strength",
      lessons: 5,
      duration: "2h 45m",
      topics: ["Bench Press", "Row Variations", "Shoulder Pressing", "Pulling Movements", "Accessory Work"],
    },
  ],
  reviews_data: [
    {
      id: 1,
      author: "Sarah Mitchell",
      rating: 5,
      date: "2 weeks ago",
      comment: "This course transformed my training approach. Marcus breaks down complex concepts perfectly!",
      helpful: 24,
    },
    {
      id: 2,
      author: "James Peterson",
      rating: 4,
      date: "1 month ago",
      comment: "Great content and well structured. Would love more advanced programming techniques.",
      helpful: 18,
    },
    {
      id: 3,
      author: "Emma Davis",
      rating: 5,
      date: "1 month ago",
      comment: "The best strength training course I've taken. Highly recommended for serious athletes!",
      helpful: 31,
    },
  ],
  whatYouLearn: [
    "Principles of strength training and periodization",
    "How to design personalized training programs",
    "Proper form and technique for all major lifts",
    "Nutrition strategies for muscle growth",
    "Recovery and injury prevention",
    "Programming for different goals and experience levels",
  ],
}

export default function CourseDetailsPage() {
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-accent/10 pb-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex gap-3 mb-4">
                <Badge variant="secondary">{courseData.category}</Badge>
                <Badge variant="outline">{courseData.level}</Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-balance">{courseData.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{courseData.description}</p>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{courseData.rating}</span>
                  <span className="text-muted-foreground">({courseData.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span>{courseData.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span>{courseData.duration}</span>
                </div>
              </div>
            </div>

            {/* Sidebar Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 border-2">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg mb-6 overflow-hidden">
                    <img
                      src={courseData.thumbnail || "/placeholder.svg"}
                      alt={courseData.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-3xl font-bold mb-6">${courseData.price}</div>
                  <Button size="lg" className="w-full mb-3" onClick={() => setIsEnrolled(!isEnrolled)}>
                    {isEnrolled ? "Go to Course" : "Enroll Now"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full bg-transparent"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
                    {isFavorited ? "Favorited" : "Add to Favorites"}
                  </Button>
                  <Button variant="ghost" size="lg" className="w-full mt-3">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Instructor Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Meet Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  <Avatar className="w-20 h-20 flex-shrink-0">
                    <AvatarImage src={courseData.instructor.avatar || "/placeholder.svg"} />
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{courseData.instructor.name}</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{courseData.instructor.rating}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {courseData.instructor.students.toLocaleString()} students
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{courseData.instructor.bio}</p>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">
                        {courseData.instructor.social.instagram}
                      </Button>
                      <Button variant="outline" size="sm">
                        {courseData.instructor.social.twitter}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courseData.whatYouLearn.map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <div className="text-accent mt-1 flex-shrink-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseData.curriculum.map((week, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-lg">
                            Week {week.week}: {week.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {week.lessons} lessons • {week.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {week.topics.map((topic, topicIdx) => (
                          <Badge key={topicIdx} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {courseData.reviews_data.map((review) => (
                  <div key={review.id} className="pb-6 border-b last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{review.author}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">Helpful: {review.helpful}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
