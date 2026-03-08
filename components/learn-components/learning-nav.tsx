"use client"

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
} from "@/components/ui/sidebar"
import { CheckCircle2, ChevronDown, BookMarked } from "lucide-react"
import { useRouter } from "next/navigation";
import { Home, BookOpen,  ChevronRight } from "lucide-react";
import { NavUser } from "./nav-user";

import { useState } from "react"
import type { Lesson } from "@/services/lessonsService"

interface LearningNavProps {
  lessons: Lesson[]
  completedSections: Set<string>
  completedModules: Set<string>
  currentLessonIndex: number
  currentModuleIndex: number
  onNavigateToModule: (lessonIdx: number, moduleIdx: number) => void
  onScrollToSection: (sectionId: string) => void
}

export function LearningNav({
  lessons,
  completedSections,
  completedModules,
  currentLessonIndex,
  currentModuleIndex,
  onNavigateToModule,
  onScrollToSection,
}: LearningNavProps) {
    const router = useRouter();
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set([currentLessonIndex]))
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([lessons[currentLessonIndex]?.modules[currentModuleIndex]?.id]),
  )

  const toggleLesson = (idx: number) => {
    const newExpanded = new Set(expandedLessons)
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx)
    } else {
      newExpanded.add(idx)
    }
    setExpandedLessons(newExpanded)
  }

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const totalModules = lessons.reduce((acc, l) => acc + l.modules.length, 0)
  const progressPercent = Math.round((completedModules.size / totalModules) * 100)

  return (
      <div className="p-[3px] h-full">
    <div className="h-full rounded-md overflow-hidden border bg-background">
    <Sidebar className="border-r bg-gradient-to-b from-background to-muted/30">
      <SidebarHeader className="border-b p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <BookMarked className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm truncate text-foreground">Learning Path</h3>
        </div>
        
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-semibold text-foreground">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {completedModules.size} of {totalModules} modules completed
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-0">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider">Course Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {lessons.map((lesson, lessonIdx) => (
                <div key={lesson.id} className="space-y-2">
                  <SidebarMenuItem>
                    <button
                      onClick={() => toggleLesson(lessonIdx)}
                      className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-all duration-200 ${
                        expandedLessons.has(lessonIdx) 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-sidebar-accent/50 text-foreground"
                      }`}
                      aria-expanded={expandedLessons.has(lessonIdx)}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform flex-shrink-0 ${
                          expandedLessons.has(lessonIdx) ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                      <span className="flex-1 truncate">{lesson.title}</span>
                    </button>
                  </SidebarMenuItem>

                  {/* Modules */}
                  {expandedLessons.has(lessonIdx) && (
                    <div className="ml-4 space-y-2 relative pl-4">
                      <div className="absolute left-0 top-2 bottom-0 w-px bg-gradient-to-b from-primary/50 to-primary/0" />

                      {lesson.modules.map((module, moduleIdx) => {
                        const isCurrentModule = currentLessonIndex === lessonIdx && currentModuleIndex === moduleIdx
                        const isCompleted = completedModules.has(module.id)

                        return (
                          <div key={module.id} className="space-y-2">
                            <SidebarMenuItem>
                              <button
                                onClick={() => {
                                  onNavigateToModule(lessonIdx, moduleIdx)
                                  toggleModule(module.id)
                                }}
                                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left relative ${
                                  isCurrentModule
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : isCompleted
                                    ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/30"
                                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                }`}
                                aria-current={isCurrentModule ? "page" : undefined}
                              >
                                <div className="flex-shrink-0 flex items-center justify-center">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    <div className={`w-2.5 h-2.5 rounded-full border-2 ${
                                      isCurrentModule ? "border-primary-foreground bg-primary-foreground/30" : "border-muted-foreground/50"
                                    }`} />
                                  )}
                                </div>
                                <span className="flex-1 truncate">{module.title}</span>
                                <ChevronDown
                                  className={`w-3 h-3 transition-transform flex-shrink-0 ${
                                    expandedModules.has(module.id) ? "rotate-180" : ""
                                  }`}
                                  aria-hidden="true"
                                />
                              </button>
                            </SidebarMenuItem>

                            {/* Sections */}
                            {expandedModules.has(module.id) && (
                              <div className="ml-4 space-y-1.5 relative pl-4">
                                <div className="absolute left-0 top-1 bottom-0 w-px bg-muted-foreground/20" />

                                {module.sections.map((section) => {
                                  const isSectionCompleted = completedSections.has(section.id)

                                  return (
                                    <SidebarMenuItem key={section.id}>
                                      <button
                                        onClick={() => onScrollToSection(section.id)}
                                        className={`flex items-center gap-2 w-full px-3 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                                          isSectionCompleted
                                            ? "text-green-600 dark:text-green-400 bg-green-50/30 dark:bg-green-950/20 hover:bg-green-100/30 dark:hover:bg-green-900/30"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        }`}
                                      >
                                        {isSectionCompleted ? (
                                          <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                                        ) : (
                                          <div className="w-2 h-2 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                                        )}
                                        <span className="truncate">{section.title}</span>
                                      </button>
                                    </SidebarMenuItem>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
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
  )
}
