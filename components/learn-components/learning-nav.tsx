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
} from "@/components/ui/sidebar"
import { CheckCircle2, ChevronDown } from "lucide-react"
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

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <h3 className="font-semibold text-sm truncate">Course Learning Path</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {completedModules.size} of {lessons.reduce((acc, l) => acc + l.modules.length, 0)} modules
        </p>
      </SidebarHeader>

      <SidebarContent className="px-0">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4">Lessons</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {lessons.map((lesson, lessonIdx) => (
                <div key={lesson.id} className="space-y-1">
                  <SidebarMenuItem>
                    <button
                      onClick={() => toggleLesson(lessonIdx)}
                      className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-left transition-colors ${
                        expandedLessons.has(lessonIdx) ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform flex-shrink-0 ${
                          expandedLessons.has(lessonIdx) ? "rotate-180" : ""
                        }`}
                      />
                      <span className="flex-1 truncate">{lesson.title}</span>
                    </button>
                  </SidebarMenuItem>

                  {/* Modules */}
                  {expandedLessons.has(lessonIdx) && (
                    <div className="ml-4 space-y-1 relative">
                      <div className="absolute left-0 top-2 bottom-0 w-px border-l border-dashed border-muted-foreground/30 -ml-2" />

                      {lesson.modules.map((module, moduleIdx) => {
                        const isCurrentModule = currentLessonIndex === lessonIdx && currentModuleIndex === moduleIdx
                        const isCompleted = completedModules.has(module.id)

                        return (
                          <div key={module.id} className="space-y-1">
                            <SidebarMenuItem>
                              <button
                                onClick={() => {
                                  onNavigateToModule(lessonIdx, moduleIdx)
                                  toggleModule(module.id)
                                }}
                                className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors text-left relative ${
                                  isCurrentModule
                                    ? "bg-primary/10 text-primary border border-primary/30"
                                    : "hover:bg-sidebar-accent/50"
                                }`}
                              >
                                <div className="flex-shrink-0 flex items-center justify-center">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <div className="w-3 h-3 rounded-full border border-muted-foreground/40" />
                                  )}
                                </div>
                                <span className="flex-1 truncate text-xs">{module.title}</span>
                                <ChevronDown
                                  className={`w-3 h-3 transition-transform flex-shrink-0 ${
                                    expandedModules.has(module.id) ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            </SidebarMenuItem>

                            {/* Sections */}
                            {expandedModules.has(module.id) && (
                              <div className="ml-4 space-y-1 relative">
                                <div className="absolute left-0 top-1 bottom-0 w-px border-l border-dashed border-muted-foreground/20 -ml-2" />

                                {module.sections.map((section) => {
                                  const isSectionCompleted = completedSections.has(section.id)

                                  return (
                                    <SidebarMenuItem key={section.id}>
                                      <button
                                        onClick={() => onScrollToSection(section.id)}
                                        className={`flex items-center gap-2 w-full px-3 py-1.5 rounded text-xs transition-colors text-left hover:bg-sidebar-accent/50 ${
                                          isSectionCompleted
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-muted-foreground"
                                        }`}
                                      >
                                        {isSectionCompleted ? (
                                          <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                                        ) : (
                                          <div className="w-2.5 h-2.5 rounded-full border border-muted-foreground/40 flex-shrink-0" />
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
    </Sidebar>
  )
}
