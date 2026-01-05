"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, ChevronRight, ChevronLeft } from "lucide-react"

import { LearningLayout } from "@/components/learn-components/learning-layout"
import { LearningNav } from "@/components/learn-components/learning-nav"
import { ContentSection } from "@/components/learn-components/content-section"
import { CheckpointQuiz } from "@/components/learn-components/checkpoint-quiz"

import { CourseContentService } from "@/services/lessonsService"

export default function LearnPage() {
  const { courseId } = useParams() as { courseId: string }

  const [modules, setModules] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [showQuiz, setShowQuiz] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!courseId) return

    const loadCourse = async () => {
      try {
        const data = await CourseContentService.getCourseContent(courseId)
        setModules(data.modules || [])
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  /* ---------- Guards ---------- */
  if (!courseId) return <div className="p-8">Invalid course</div>
  if (loading) return <div className="p-8">Loading course…</div>
  if (!modules.length)
    return <div className="p-8">No modules found for this course</div>

  const currentModule = modules[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === modules.length - 1
  const allCompleted = completedModules.size === modules.length

  return (
    <LearningLayout
      sidebar={
        <LearningNav
          lesson={{
            topics: modules.map((m) => ({
              id: m.id,
              title: m.title,
            })),
          }}
          completedTopics={completedModules}
          completedSubtopics={new Set()}
          currentChapterId={currentModule.id}
          onNavigateToChapter={(id) => {
            const index = modules.findIndex((m) => m.id === id)
            if (index !== -1) {
              setCurrentIndex(index)
              setShowQuiz(false)
            }
          }}
        />
      }
    >
      <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
        {/* Header */}
        <div className="rounded-lg bg-primary/5 border p-8">
          <Badge>
            Module {currentIndex + 1} of {modules.length}
          </Badge>
          <h1 className="text-4xl font-bold mt-2">
            {currentModule.title}
          </h1>
          {currentModule.description && (
            <p className="text-muted-foreground mt-2">
              {currentModule.description}
            </p>
          )}
        </div>

        {!showQuiz ? (
          <>
            {/* Sections */}
            <div className="space-y-6">
              {currentModule.module_sections?.map((section: any) => (
                <ContentSection key={section.id} section={section} />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex((i) => i - 1)}
                disabled={isFirst}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {!isLast ? (
                <Button onClick={() => setCurrentIndex((i) => i + 1)}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : currentModule.quizzes?.length ? (
                <Button onClick={() => setShowQuiz(true)}>
                  Take Module Quiz
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    setCompletedModules(
                      (prev) => new Set(prev).add(currentModule.id)
                    )
                  }
                >
                  Complete Module
                </Button>
              )}
            </div>
          </>
        ) : (
          <CheckpointQuiz
            quiz={currentModule.quizzes?.[0]}
            onComplete={() => {
              setCompletedModules(
                (prev) => new Set(prev).add(currentModule.id)
              )
              setShowQuiz(false)
            }}
          />
        )}

        {allCompleted && (
          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="pt-6 flex items-center gap-4">
              <Award className="w-12 h-12 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  Course Completed
                </h3>
              </div>
              <Button>Download Certificate</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </LearningLayout>
  )
}
