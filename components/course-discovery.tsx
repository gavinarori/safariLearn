"use client";

import { useEffect, useState } from "react";
import {
  IconSearch,
  IconStar,
  IconUsers,
  IconClock,
  IconFilter,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  getAllCourses,
  getCoursesByCategory,
  CourseWithTrainer,
} from "@/services/coursesService";
import { HeroVideoDialog } from "./ui/hero-video-dialog";
import Image from "next/image";

// 🕒 Helper to show "x time ago"
const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
};

const categories = ["All", "Fitness", "Cardio", "Yoga", "Nutrition", "Business", "Recovery"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export function CourseDiscovery() {
  const [courses, setCourses] = useState<CourseWithTrainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest">("popular");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        let data: CourseWithTrainer[] = [];
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
    if (sortBy === "rating") return 0;
    if (sortBy === "newest")
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    return 0;
  });

  return (
    <div className="space-y-6 p-6">
      {/* 🔹 Category Filters */}
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

      {/* 🔹 Courses Grid */}
      {loading ? (
        <p className="text-muted-foreground text-center">Loading courses...</p>
      ) : (
        <div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedCourses.map((course) => (
              <div
                key={course.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group rounded-xl"
              >
                {/* Thumbnail / Trailer */}
                <div className="relative overflow-hidden h-48 bg-muted">
                  <HeroVideoDialog
                    className="block dark:hidden"
                    animationStyle="from-center"
                    videoSrc={course.trailer_url || ""}
                    thumbnailSrc={course.thumbnail_url || "/placeholder.svg"}
                    thumbnailAlt="Course Thumbnail"
                  />
                  <HeroVideoDialog
                    className="hidden dark:block"
                    animationStyle="from-center"
                    videoSrc={course.trailer_url || ""}
                    thumbnailSrc={course.thumbnail_url || "/placeholder.svg"}
                    thumbnailAlt="Course Thumbnail"
                  />
                  {course.level && (
                    <Badge className="absolute top-3 right-3" variant="secondary">
                      {course.level}
                    </Badge>
                  )}
                </div>

                {/* Course Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.category || "Uncategorized"}
                    </p>
                  </div>

                  {/* Trainer Info */}
                  {course.trainer && (
                    <div className="flex items-center gap-2">
                      <Image
                        src={course.trainer.avatar_url || "/avatar-placeholder.png"}
                        alt={course.trainer.full_name || "Trainer"}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <span className="text-sm font-medium">
                        {course.trainer.full_name || "Unknown Trainer"}
                      </span>
                      <div className="flex items-center justify-end gap-1">
                      <IconClock className="w-4 h-4" />
                      <span>{timeAgo(course.created_at)}</span>
                    </div>

                    </div>
                  )}

                  {/* Stats */}
                 

                  {/* Price + CTA */}
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
