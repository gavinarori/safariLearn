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
import type { LessonData } from "@/data/mock-lessons"

interface LearningNavProps {
  lesson: LessonData
  completedTopics: Set<string>
  completedSubtopics: Set<string>
  currentChapterId: string
  onNavigateToChapter: (chapterId: string) => void
}

export function LearningNav({
  lesson,
  completedTopics,
  completedSubtopics,
  currentChapterId,
  onNavigateToChapter,
}: LearningNavProps) {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set([currentChapterId]))

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics)
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId)
    } else {
      newExpanded.add(topicId)
    }
    setExpandedTopics(newExpanded)
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <h3 className="font-semibold text-sm truncate">{lesson.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {completedTopics.size} of {lesson.topics.length} chapters
        </p>
      </SidebarHeader>

      <SidebarContent className="px-0">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4">Chapters</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {lesson.topics.map((topic) => (
                <div key={topic.id} className="space-y-1">
                  <SidebarMenuItem>
                    <button
                      onClick={() => {
                        onNavigateToChapter(topic.id)
                        toggleTopic(topic.id)
                      }}
                      className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-left transition-colors relative ${
                        currentChapterId === topic.id
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "hover:bg-sidebar-accent"
                      }`}
                    >
                      <div className="flex-shrink-0 flex items-center justify-center">
                        {completedTopics.has(topic.id) ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-muted-foreground/40" />
                        )}
                      </div>
                      <span className="flex-1 truncate">{topic.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform flex-shrink-0 ${
                          expandedTopics.has(topic.id) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </SidebarMenuItem>

                  {expandedTopics.has(topic.id) && topic.subtopics && (
                    <div className="ml-6 space-y-1 relative">
                      <div className="absolute left-0 top-0 bottom-0 w-px border-l border-dashed border-muted-foreground/30 -ml-3" />

                      {topic.subtopics.map((subtopic) => (
                        <SidebarMenuItem key={subtopic.id}>
                          <div className="flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-sidebar-accent/50 rounded transition-colors">
                            <input
                              type="checkbox"
                              checked={completedSubtopics.has(subtopic.id)}
                              onChange={(e) => e.stopPropagation()}
                              className="w-3.5 h-3.5 rounded cursor-pointer"
                            />
                            <span className="truncate text-xs">{subtopic.title}</span>
                          </div>
                        </SidebarMenuItem>
                      ))}
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
