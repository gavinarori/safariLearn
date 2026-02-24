"use client"

import { useEffect, useState, useMemo } from "react"
import { IconFilter, IconChevronDown, IconTag, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllCourses, getCoursesByCategory, type Course } from "@/services/coursesService"
import Image from "next/image"
import Link from "next/link"

const COURSES_PER_PAGE = 7
const MAX_CATEGORIES_DISPLAYED = 8

interface CourseExplorerProps {
  searchQuery?: string
}

export function CourseExplorer({ searchQuery = "" }: CourseExplorerProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        let data: Course[] = []
        if (selectedCategory === "All") {
          data = await getAllCourses()
        } else {
          data = await getCoursesByCategory(selectedCategory)
        }
        setCourses(data)
        setCurrentPage(1) 
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [selectedCategory])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])


  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(courses.map((course) => course.category).filter(Boolean))
    ) as string[]
    
    // Limit categories displayed
    const limitedCategories = uniqueCategories.slice(0, MAX_CATEGORIES_DISPLAYED)
    return ["All", ...limitedCategories]
  }, [courses])

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [courses, searchQuery])


  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE)
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE
  const endIndex = startIndex + COURSES_PER_PAGE
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    setExpandedId(null) 
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border p-4">
        <h2 className="font-semibold text-foreground mb-3">Explore Courses</h2>
      </div>

      <div className="border-b border-border px-4 py-3 max-h-24 overflow-y-auto">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
  <div className="space-y-2 p-4">
    {[...Array(7)].map((_, i) => (
      <div
        key={i}
        className="rounded-lg border border-border bg-card p-3 flex gap-3 animate-pulse"
      >
        <div className="w-12 h-12 rounded-md bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
        <div className="w-4 h-4 rounded bg-muted mt-1" />
      </div>
    ))}
  </div>
) : filteredCourses.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">No courses found</div>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {paginatedCourses.map((course) => (
              <CourseItem
                key={course.id}
                course={course}
                isExpanded={expandedId === course.id}
                onToggle={() => setExpandedId(expandedId === course.id ? null : course.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredCourses.length > 0 && (
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredCourses.length)} of{" "}
              {filteredCourses.length} courses
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <IconChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)

                  if (!showPage) {
                    // Show ellipsis
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="h-8 w-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <IconChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CourseItem({
  course,
  isExpanded,
  onToggle,
}: {
  course: Course
  isExpanded: boolean
  onToggle: () => void
}) {
  const price = course.price === 0 ? "Free" : `$${course.price}`

  return (
    <div
      className={`rounded-lg border transition-all overflow-hidden ${
        isExpanded ? "border-primary bg-muted/50" : "border-border bg-card hover:border-primary/50 hover:bg-muted/30"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-3 flex items-start gap-3 hover:bg-muted/50 transition-colors"
      >
        {/* Thumbnail */}
        {course.thumbnail_url ? (
          <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-muted">
            <Image
              src={course.thumbnail_url || "/placeholder.svg"}
              alt={course.title}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 w-12 h-12 rounded-md bg-muted flex items-center justify-center">
            <IconTag className="w-6 h-6 text-muted-foreground" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground line-clamp-2">{course.title}</h3>
            <IconChevronDown
              className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Quick info */}
          <div className="flex items-center gap-2 flex-wrap">
            {course.level && (
              <Badge variant="outline" className="text-xs py-0 px-1.5 h-5">
                {course.level}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">{price}</span>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border px-3 py-3 bg-muted/20 space-y-3 animate-in fade-in duration-200">
          {/* Description */}
          <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">{course.description}</p>

          {/* Metadata */}
          <div className="space-y-2">
            {course.category && (
              <div className="flex items-center gap-2">
                <IconFilter className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-foreground/70">{course.category}</span>
              </div>
            )}
            {course.language && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground/70">Language: {course.language}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <Link href={`/courses/${course.id}`} className="block pt-2">
            <Button size="sm" className="w-full text-xs">
              View Course
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}