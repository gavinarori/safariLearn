"use client";

import { useEffect, useState } from "react";
import { IconSearch, IconStar, IconUsers, IconClock, IconFilter } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllCourses, getCoursesByCategory, Course } from "@/services/coursesService";

const categories = ["All", "Fitness", "Cardio", "Yoga", "Nutrition", "Business", "Recovery"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export  function CourseDiscovery() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest">("popular");

  // ✅ Fetch courses dynamically
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        let data: Course[] = [];
        if (selectedCategory === "All") {
          data = await getAllCourses();
        } else {
          data = await getCoursesByCategory(selectedCategory);
        }
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [selectedCategory]);

  // 🔍 Search + Filter
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      selectedLevel === "All Levels" ||
      course.level?.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesLevel;
  });

  // 🔽 Sorting
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "popular") return (b.price ?? 0) - (a.price ?? 0);
    if (sortBy === "rating") return 0; // replace with actual rating later if you add ratings
    return 0;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Explore Courses</h1>
        <p className="text-muted-foreground">Discover courses from top trainers and coaches</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
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
      {loading ? (
        <p className="text-muted-foreground text-center">Loading courses...</p>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {sortedCourses.length} courses found
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedCourses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="relative overflow-hidden h-48 bg-muted">
                  <img
                    src={course.thumbnail_url || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {course.level && (
                    <Badge className="absolute top-3 right-3" variant="secondary">
                      {course.level}
                    </Badge>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold line-clamp-2 text-balance">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.category || "Uncategorized"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <IconUsers className="w-4 h-4" />
                      <span>Trainer ID: {course.trainer_id?.slice(0, 6)}...</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconClock className="w-4 h-4" />
                      <span>{new Date(course.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-bold">
                      {course.price ? `$${course.price}` : "Free"}
                    </span>
                    <Button size="sm" className="gap-2">
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


export default CourseDiscovery;
