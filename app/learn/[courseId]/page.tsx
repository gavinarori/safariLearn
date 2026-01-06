"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"

import { LearningLayout } from "@/components/learn-components/learning-layout"
import { LearningNav } from "@/components/learn-components/learning-nav"
import { ContentSection } from "@/components/learn-components/content-section"
import { CheckpointQuiz } from "@/components/learn-components/checkpoint-quiz"

import { CourseContentService, type Lesson, type ModuleSection } from "@/services/lessonsService"

export default function LearnPage() {
  const { courseId } = useParams() as { courseId: string }

  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [showQuiz, setShowQuiz] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id
            setCompletedSections((prev) => new Set([...prev, sectionId]))
          }
        })
      },
      { threshold: 0.5 }
    )

    const sectionElements = document.querySelectorAll('[data-section]')
    sectionElements.forEach((el) => observer.observe(el))

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  useEffect(() => {
    if (!courseId) return

    const loadCourse = async () => {
      try {
        setLoading(true)
        const data = await CourseContentService.getCourseContent(courseId)
        setLessons(data.lessons)
      } catch (err) {
        console.error("Failed to load course:", err)
        setError("Failed to load course content. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  if (!courseId) return <div className="p-8 text-center">Invalid course</div>
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p>Loading course…</p>
        </div>
      </div>
    )
  if (error) return <div className="p-8 text-center text-destructive">{error}</div>
  if (!lessons.length) return <div className="p-8 text-center">No lessons found for this course</div>

  const currentLesson = lessons[currentLessonIndex]
  const currentModule = currentLesson?.modules[currentModuleIndex]

  if (!currentModule) {
    return <div className="p-8 text-center">Module not found</div>
  }

  const isFirstModule = currentLessonIndex === 0 && currentModuleIndex === 0
  const isLastModule =
    currentLessonIndex === lessons.length - 1 && currentModuleIndex === (currentLesson?.modules.length ?? 0) - 1
  const allModulesCompleted = completedModules.size === lessons.reduce((acc, l) => acc + l.modules.length, 0)

  const handleNextModule = () => {
    if (!isLastModule) {
      if (currentModuleIndex < (currentLesson?.modules.length ?? 0) - 1) {
        setCurrentModuleIndex(currentModuleIndex + 1)
      } else if (currentLessonIndex < lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1)
        setCurrentModuleIndex(0)
      }
      setShowQuiz(false)
    }
  }

  const handlePreviousModule = () => {
    if (!isFirstModule) {
      if (currentModuleIndex > 0) {
        setCurrentModuleIndex(currentModuleIndex - 1)
      } else if (currentLessonIndex > 0) {
        setCurrentLessonIndex(currentLessonIndex - 1)
        setCurrentModuleIndex((lessons[currentLessonIndex - 1]?.modules.length ?? 1) - 1)
      }
      setShowQuiz(false)
    }
  }

  const completeCurrentModule = () => {
    const newCompleted = new Set(completedModules)
    newCompleted.add(currentModule.id)
    setCompletedModules(newCompleted)
  }

  return (
    <LearningLayout
      sidebar={
        <LearningNav
          lessons={lessons}
          completedSections={completedSections}
          completedModules={completedModules}
          currentLessonIndex={currentLessonIndex}
          currentModuleIndex={currentModuleIndex}
          onNavigateToModule={(lessonIdx, moduleIdx) => {
            setCurrentLessonIndex(lessonIdx)
            setCurrentModuleIndex(moduleIdx)
            setShowQuiz(false)
          }}
          onScrollToSection={(sectionId) => {
            const element = document.getElementById(sectionId)
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          }}
        />
      }
    >
      <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
        {/* Module Banner */}
        <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-8">
          <div className="space-y-2">
            <Badge>
              Lesson {currentLessonIndex + 1} · Module {currentModuleIndex + 1}
            </Badge>
            <h1 className="text-4xl font-bold">{currentModule.title}</h1>
            {currentModule.description && <p className="text-muted-foreground text-lg">{currentModule.description}</p>}
          </div>
        </div>

        {!showQuiz ? (
          <>
            {/* Sections */}
            <div className="space-y-6">
              {currentModule.sections?.map((section: ModuleSection) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-20"
                  data-section
                >
                  <ContentSection section={section} />
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t">
              <Button variant="outline" onClick={handlePreviousModule} disabled={isFirstModule}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {!isLastModule ? (
                <Button onClick={handleNextModule}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : currentModule.quiz ? (
                <Button onClick={() => setShowQuiz(true)}>Take Module Quiz</Button>
              ) : (
                <Button onClick={completeCurrentModule}>Complete Module</Button>
              )}
            </div>
          </>
        ) : currentModule.quiz ? (
          <>
            <CheckpointQuiz
              quiz={currentModule.quiz}
              onComplete={() => {
                completeCurrentModule()
                setShowQuiz(false)
              }}
            />
          </>
        ) : null}

        {/* Completion */}
        {allModulesCompleted && (
          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="pt-6 flex items-center gap-4">
              <Award className="w-12 h-12 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Course Completed</h3>
                <p className="text-sm text-muted-foreground">You have successfully completed all modules</p>
              </div>
              <Button>Download Certificate</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </LearningLayout>
  )
}
