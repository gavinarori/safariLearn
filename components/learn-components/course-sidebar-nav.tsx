"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  CheckCircle2,
  ChevronDown,
  BookMarked,
  Book,
} from "lucide-react";

import { NavUser } from "./nav-user";

import { useState, useEffect } from "react";
import Link from "next/link";

import { CourseModule, Lesson } from "@/lib/types/course";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/superbase/client";

interface CourseSidebarNavProps {
  modules: CourseModule[];
  currentLesson: Lesson | null;
  courseId: string;
}

interface LessonProgress {
  [lessonId: string]: boolean;
}

export default function CourseSidebarNav({
  modules,
  currentLesson,
  courseId,
}: CourseSidebarNavProps) {
  const supabase = createClient();

  const [openModules, setOpenModules] = useState<Set<any>>(
    new Set(
      currentLesson
        ? [
            modules.find((m) =>
              m.lessons.some((l) => l.id === currentLesson.id)
            )?.id,
          ].filter(Boolean)
        : []
    )
  );

  const [progress, setProgress] = useState<LessonProgress>({});
  const [isLoading, setIsLoading] = useState(true);

  // -----------------------------
  // Load progress
  // -----------------------------

  useEffect(() => {
    const loadProgress = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("lesson_progress")
        .select("lesson_id, is_completed")
        .eq("user_id", user.id);

      if (data) {
        const map: LessonProgress = {};

        data.forEach((p) => {
          if (p.is_completed) {
            map[p.lesson_id] = true;
          }
        });

        setProgress(map);
      }

      setIsLoading(false);
    };

    loadProgress();
  }, [courseId]);


  const toggleModule = (id: string) => {
    const s = new Set(openModules);

    if (s.has(id)) {
      s.delete(id);
    } else {
      s.add(id);
    }

    setOpenModules(s);
  };


  const handleLessonComplete = async (
    lessonId: string,
    completed: boolean
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          is_completed: completed,
          completed_at: completed
            ? new Date().toISOString()
            : null,
        },
        {
          onConflict: "user_id,lesson_id",
        }
      );

    if (!error) {
      setProgress((prev) => ({
        ...prev,
        [lessonId]: completed,
      }));
    }
  };

  const totalLessons = modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );

  const completedLessons = Object.keys(progress).length;

  const progressPercent =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;



  return (
    <div className="p-[3px] h-full">
      <div className="h-full rounded-md  overflow-hidden border bg-background">
        <Sidebar className="border-r bg-gradient-to-b from-background to-muted/30 ">
          {/* HEADER */}

          <SidebarHeader className="border-b p-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <BookMarked className="w-4 h-4 text-primary" />
              </div>

              <h3 className="font-semibold text-sm">
                Course Content
              </h3>
            </div>

            {/* Progress */}

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progress</span>

                <span className="font-semibold">
                  {progressPercent}%
                </span>
              </div>

              <div className="w-full h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {completedLessons} / {totalLessons} lessons
              </p>
            </div>
          </SidebarHeader>


          <SidebarContent>

            <SidebarGroup>

              <SidebarGroupLabel>
                Modules
              </SidebarGroupLabel>

              <SidebarGroupContent>

                <SidebarMenu>

                  {modules.map((module) => {
                    const isOpen =
                      openModules.has(module.id);

                    return (
                      <div key={module.id}>


                        <SidebarMenuItem>

                          <button
                            onClick={() =>
                              toggleModule(module.id)
                            }
                            className="flex w-full items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition ${
                                isOpen
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />

                            <span className="flex-1 text-left">
                              {module.title}
                            </span>
                          </button>
                        </SidebarMenuItem>

                        {/* LESSONS */}

                        {isOpen && (

                          <div className="ml-6 space-y-1">

                            {module.lessons.map(
                              (lesson) => {
                                const isActive =
                                  currentLesson?.id ===
                                  lesson.id;

                                const isDone =
                                  progress[lesson.id];

                                return (
                                  <div
                                    key={lesson.id}
                                    className="flex items-center gap-2"
                                  >

                                    <Link
                                      href={`/learn/${courseId}?lesson=${lesson.id}`}
                                      className="flex-1"
                                    >
                                      <button
                                        className={`flex w-full items-center gap-2 px-2 py-1 rounded text-sm ${
                                          isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                        }`}
                                      >
                                        <Book className="w-4 h-4" />

                                        <span className="truncate">
                                          {lesson.title}
                                        </span>

                                        {isDone && (
                                          <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                                        )}
                                      </button>
                                    </Link>

                                    <Checkbox
                                      checked={isDone}
                                      onCheckedChange={(v) =>
                                        handleLessonComplete(
                                          lesson.id,
                                          v as boolean
                                        )
                                      }
                                    />

                                  </div>
                                );
                              }
                            )}

                          </div>

                        )}
                      </div>
                    );
                  })}

                </SidebarMenu>

              </SidebarGroupContent>

            </SidebarGroup>

          </SidebarContent>


          <SidebarFooter>
            <NavUser />
          </SidebarFooter>

        </Sidebar>
      </div>
    </div>
  );
}