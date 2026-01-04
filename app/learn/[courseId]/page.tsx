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

import { LessonsService } from "@/services/lessonsService"

export default function LearnPage() {
  const params = useParams()
  const courseId = params.courseId as string

  const [lessons, setLessons] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [showQuiz, setShowQuiz] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!courseId) return

    const loadLessons = async () => {
      const data = await LessonsService.getLessonsByCourse(courseId)
      setLessons(data || [])
      setLoading(false)
    }

    loadLessons()
  }, [courseId])

  if (!courseId) return <div className="p-8">Invalid course</div>
  if (loading) return <div className="p-8">Loading lessons…</div>
  if (!lessons.length) return <div className="p-8">No lessons found</div>

  const currentLesson = lessons[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === lessons.length - 1
  const allCompleted = completedLessons.size === lessons.length

  return (
    <LearningLayout
      sidebar={
        <LearningNav
          lesson={{
            topics: lessons.map((l) => ({
              id: l.id,
              title: l.title,
            })),
          }}
          completedTopics={completedLessons}
          completedSubtopics={new Set()}
          currentChapterId={currentLesson.id}
          onNavigateToChapter={(lessonId) => {
            const index = lessons.findIndex((l) => l.id === lessonId)
            setCurrentIndex(index)
            setShowQuiz(false)
          }}
        />
      }
    >
      <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
        <div className="rounded-lg bg-primary/5 border p-8">
          <Badge>
            Lesson {currentIndex + 1} of {lessons.length}
          </Badge>
          <h1 className="text-4xl font-bold mt-2">{currentLesson.title}</h1>
        </div>

        {!showQuiz ? (
          <>
            <div className="space-y-6">
              {currentLesson.sections?.map((section: any, idx: number) => (
                <ContentSection key={idx} section={section} />
              ))}
            </div>

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
              ) : (
                <Button onClick={() => setShowQuiz(true)}>
                  Take Final Quiz
                </Button>
              )}
            </div>
          </>
        ) : (
          <CheckpointQuiz
            lessonId={currentLesson.id}
            quiz={currentLesson.quiz}
            onComplete={() => {
              setCompletedLessons((prev) => new Set(prev).add(currentLesson.id))
              setShowQuiz(false)
            }}
          />
        )}

        {allCompleted && (
          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="pt-6 flex items-center gap-4">
              <Award className="w-12 h-12 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Course Completed</h3>
              </div>
              <Button>Download Certificate</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </LearningLayout>
  )
}
