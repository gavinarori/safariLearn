"use client";

import { useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeSwitcher } from "./toggle-theme";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { searchCourses } from "@/services/coursesService";

interface CourseResult {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  price: number | null;
}

export function SiteHeader() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<CourseResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // debounce search
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!searchQuery) {
        setResults([]);
        return;
      }

      setLoading(true);

      const data = await searchCourses(searchQuery);

      setResults(data);
      setLoading(false);
      setShowDropdown(true);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const goToCourse = (id: string) => {
    setShowDropdown(false);
    setSearchQuery("");
    router.push(`/courses/${id}`);
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">

        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* SEARCH */}
        <div className="flex-1 relative max-w-md ml-4">

          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setShowDropdown(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowDropdown(false), 150);
            }}
            className="pl-10"
          />

          {/* DROPDOWN */}
          {showDropdown && (
            <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">

              {loading && (
  <div className="p-2 space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="flex items-center gap-3 p-2"
      >
        <Skeleton className="w-12 h-8 rounded" />

        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    ))}
  </div>
)}

              {!loading && results.length === 0 && searchQuery && (
                <div className="p-4 text-sm text-muted-foreground">
                  No courses found
                </div>
              )}

              {results.map((course) => (
                <div
                  key={course.id}
                  onClick={() => goToCourse(course.id)}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted"
                >
                  <img
                    src={course.thumbnail_url || "/placeholder.svg"}
                    className="w-12 h-8 object-cover rounded"
                  />

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {course.title}
                    </span>

                    {course.price && (
                      <span className="text-xs text-muted-foreground">
                        KES {course.price}
                      </span>
                    )}
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

        <div className="ml-auto flex items-center gap-2">
          <ModeSwitcher />
        </div>

      </div>
    </header>
  );
}