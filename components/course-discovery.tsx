"use client"

import { useState } from "react"
import { IconSearch, IconStar, IconUsers, IconClock, IconFilter } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Course {
  id: string
  title: string
  instructor: string
  thumbnail: string
  rating: number
  students: number
  duration: string
  price: number
  category: string
  level: "beginner" | "intermediate" | "advanced"
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Advanced Strength Training for Athletes",
    instructor: "Alex Thompson",
    thumbnail: "/strength-training-diverse-group.png",
    rating: 4.8,
    students: 2340,
    duration: "8 weeks",
    price: 49.99,
    category: "Fitness",
    level: "advanced",
  },
  {
    id: "2",
    title: "HIIT Cardio Bootcamp",
    instructor: "Sarah Martinez",
    thumbnail: "/cardio-bootcamp.jpg",
    rating: 4.9,
    students: 5120,
    duration: "6 weeks",
    price: 39.99,
    category: "Cardio",
    level: "intermediate",
  },
  {
    id: "3",
    title: "Yoga Fundamentals for Beginners",
    instructor: "Emily Chen",
    thumbnail: "/woman-in-nature-yoga.png",
    rating: 4.7,
    students: 8900,
    duration: "4 weeks",
    price: 29.99,
    category: "Yoga",
    level: "beginner",
  },
  {
    id: "4",
    title: "Nutrition Coaching Masterclass",
    instructor: "Dr. James Wilson",
    thumbnail: "/balanced-nutrition-plate.png",
    rating: 4.6,
    students: 3210,
    duration: "10 weeks",
    price: 59.99,
    category: "Nutrition",
    level: "intermediate",
  },
  {
    id: "5",
    title: "Personal Training Business Bootcamp",
    instructor: "Marcus Johnson",
    thumbnail: "/business-training.jpg",
    rating: 4.9,
    students: 1890,
    duration: "12 weeks",
    price: 99.99,
    category: "Business",
    level: "advanced",
  },
  {
    id: "6",
    title: "Flexibility & Mobility Training",
    instructor: "Lisa Rodriguez",
    thumbnail: "/flexibility.jpg",
    rating: 4.5,
    students: 4560,
    duration: "5 weeks",
    price: 34.99,
    category: "Recovery",
    level: "beginner",
  },
]

const categories = ["All", "Fitness", "Cardio", "Yoga", "Nutrition", "Business", "Recovery"]
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"]

export function CourseDiscovery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest">("popular")

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel.toLowerCase()

    return matchesSearch && matchesCategory && matchesLevel
  })

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "popular") return b.students - a.students
    if (sortBy === "rating") return b.rating - a.rating
    return 0
  })

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Explore Courses</h1>
        <p className="text-muted-foreground">Discover courses from top trainers and coaches</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Search Area */}
        <div className="flex-1 space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses or instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <IconFilter className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Sort Dropdown */}
        <Card className="p-4 flex items-center gap-2">
          <span className="text-sm font-semibold">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "popular" | "rating" | "newest")}
            className="px-2 py-1 text-sm border rounded-md bg-background"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </Card>
      </div>

      {/* Filter Tags */}
      <Card className="p-6 space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">Level</p>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <Badge
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Courses Grid */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">{sortedCourses.length} courses found</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative overflow-hidden h-48 bg-muted">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <Badge className="absolute top-3 right-3" variant="secondary">
                  {course.level}
                </Badge>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold line-clamp-2 text-balance">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{course.instructor}</p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <IconStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <IconUsers className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <IconClock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-bold">${course.price.toFixed(2)}</span>
                  <Button size="sm" className="gap-2">
                    Enroll Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
