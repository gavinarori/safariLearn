"use client";

import { useEffect, useState } from "react";
import { IconSearch, IconStar, IconUsers, IconClock, IconFilter } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getAllCourses, getCoursesByCategory, Course } from "@/services/coursesService";
import { HeroVideoDialog } from "./ui/hero-video-dialog";

const categories = ["All", "Fitness", "Cardio", "Yoga", "Nutrition", "Business", "Recovery"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export  function CourseDiscovery() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest">("popular");

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
     <div className="p-2">
      <div className="space-y-3">
        <ScrollArea className="w-full">
          <div className="flex gap-2 px-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/20 transition-colors whitespace-nowrap"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>

      {/* Courses Grid */}
      {loading ? (
        <p className="text-muted-foreground text-center">Loading courses...</p>
      ) : (
        <div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedCourses.map((course) => (
              <div
                key={course.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="relative overflow-hidden h-48 bg-muted">
                  
                  <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="from-center"
        videoSrc={course.trailer_url || ""}
        thumbnailSrc={course.thumbnail_url || "/placeholder.svg"}
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="from-center"
        videoSrc={course.trailer_url || ""}
        thumbnailSrc={course.thumbnail_url || "/placeholder.svg"}
        thumbnailAlt="Hero Video"
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


export default CourseDiscovery;
