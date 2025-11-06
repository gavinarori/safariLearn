"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Trophy, Play, Star, Award, MoreVertical, Search, Filter, Bookmark } from "lucide-react"

// Mock enrolled courses data
const enrolledCourses = [
  {
    id: 1,
    title: "Advanced Strength Training for Athletes",
    instructor: "Coach Marcus Johnson",
    thumbnail: "/placeholder.svg?key=ogngv",
    progress: 35,
    status: "in-progress",
    lessonsCompleted: 5,
    totalLessons: 14,
    rating: 4.8,
    lastAccessed: "2 hours ago",
    dueDate: null,
    favorite: false,
  },
  {
    id: 2,
    title: "Nutrition Mastery: Fueling Your Performance",
    instructor: "Dr. Sarah Chen",
    thumbnail: "/placeholder.svg?key=hhhvs",
    progress: 78,
    status: "in-progress",
    lessonsCompleted: 11,
    totalLessons: 14,
    rating: 4.9,
    lastAccessed: "1 day ago",
    dueDate: null,
    favorite: true,
  },
  {
    id: 3,
    title: "Mobility & Flexibility for Peak Performance",
    instructor: "Coach Lisa Rodriguez",
    thumbnail: "/placeholder.svg?key=iiivs",
    progress: 100,
    status: "completed",
    lessonsCompleted: 10,
    totalLessons: 10,
    rating: 4.7,
    lastAccessed: "1 week ago",
    certificateEarned: true,
    favorite: false,
  },
  {
    id: 4,
    title: "Mental Training & Sports Psychology",
    instructor: "Dr. James Mitchell",
    thumbnail: "/placeholder.svg?key=jjjvs",
    progress: 15,
    status: "in-progress",
    lessonsCompleted: 2,
    totalLessons: 12,
    rating: 4.6,
    lastAccessed: "3 days ago",
    dueDate: "March 31, 2025",
    favorite: false,
  },
  {
    id: 5,
    title: "Recovery & Injury Prevention",
    instructor: "Coach Marcus Johnson",
    thumbnail: "/placeholder.svg?key=kkkv",
    progress: 0,
    status: "not-started",
    lessonsCompleted: 0,
    totalLessons: 8,
    rating: 4.8,
    lastAccessed: null,
    favorite: true,
  },
]

export default function MyLearningPage() {
  const [courses, setCourses] = useState(enrolledCourses)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || course.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    totalEnrolled: courses.length,
    inProgress: courses.filter((c) => c.status === "in-progress").length,
    completed: courses.filter((c) => c.status === "completed").length,
    hoursLearned: 24,
  }

  const toggleFavorite = (courseId: number) => {
    setCourses(courses.map((c) => (c.id === courseId ? { ...c, favorite: !c.favorite } : c)))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Learning</h1>
          <p className="text-muted-foreground">Track your progress and continue your courses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-950/30 p-3 rounded-lg">
                <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-950/30 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-950/30 p-3 rounded-lg">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Certificates</p>
                <p className="text-2xl font-bold">{courses.filter((c) => c.certificateEarned).length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-amber-100 dark:bg-amber-950/30 p-3 rounded-lg">
                <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hours Learned</p>
                <p className="text-2xl font-bold">{stats.hoursLearned}h</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  size="sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  All Courses
                </Button>
                <Button
                  variant={filterStatus === "in-progress" ? "default" : "outline"}
                  onClick={() => setFilterStatus("in-progress")}
                  size="sm"
                >
                  In Progress
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("completed")}
                  size="sm"
                >
                  Completed
                </Button>
                <Button
                  variant={filterStatus === "not-started" ? "default" : "outline"}
                  onClick={() => setFilterStatus("not-started")}
                  size="sm"
                >
                  Not Started
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative overflow-hidden group">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {course.status === "completed" && course.certificateEarned && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-600 hover:bg-green-700">
                        <Award className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  )}
                  <button className="absolute inset-0 m-auto w-fit h-fit bg-primary/90 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-1 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-semibold">{course.progress}%</p>
                      <p className="text-xs text-muted-foreground">
                        {course.lessonsCompleted}/{course.totalLessons} lessons
                      </p>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                    {course.lastAccessed && <p className="text-xs text-muted-foreground">{course.lastAccessed}</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {course.status === "not-started" ? (
                      <Button size="sm" className="flex-1">
                        Start Course
                      </Button>
                    ) : course.status === "completed" ? (
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Review Course
                      </Button>
                    ) : (
                      <Button size="sm" className="flex-1">
                        Continue Learning
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => toggleFavorite(course.id)}>
                      <Bookmark className={`w-4 h-4 ${course.favorite ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4 items-start">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Progress</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={course.progress} className="h-1.5 w-12" />
                            <span className="text-xs font-semibold">{course.progress}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Lessons</p>
                          <p className="text-sm font-semibold mt-1">
                            {course.lessonsCompleted}/{course.totalLessons}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Rating</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">{course.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {course.status === "not-started" ? (
                          <Button size="sm">Start Course</Button>
                        ) : course.status === "completed" ? (
                          <Button size="sm" variant="outline">
                            Review Course
                          </Button>
                        ) : (
                          <Button size="sm">Continue Learning</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No courses found matching your filters</p>
              <Button>Browse Courses</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
