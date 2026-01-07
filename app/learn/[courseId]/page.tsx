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

import {
  CourseContentService,
  type Lesson,
  type ModuleSection,
} from "@/services/lessonsService"

import { ProgressService } from "@/services/Progress-service"
import { createClient } from "@/superbase/client"

const supabase = createClient()

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

  const [userId, setUserId] = useState<string | null>(null)



  const currentLesson = lessons[currentLessonIndex]
  const currentModule = currentLesson?.modules[currentModuleIndex]
  const currentModuleId = currentModule?.id



  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])



  useEffect(() => {
    if (!courseId || !userId) return

    const loadCourse = async () => {
      try {
        setLoading(true)
        const data = await CourseContentService.getCourseContent(courseId, userId)
        setLessons(data.lessons)
      } catch (err) {
        console.error(err)
        setError("Failed to load course")
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId, userId])



  useEffect(() => {
    const sections = new Set<string>()
    const modules = new Set<string>()

    lessons.forEach((lesson) =>
      lesson.modules.forEach((module) => {
        if (module.progress?.is_completed) modules.add(module.id)
        module.sections.forEach((s) => {
          if (s.progress?.is_completed) sections.add(s.id)
        })
      })
    )

    setCompletedSections(sections)
    setCompletedModules(modules)
  }, [lessons])



  useEffect(() => {
    if (!userId || !currentModuleId) return

    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          const sectionId = entry.target.id
          if (completedSections.has(sectionId)) continue


          await ProgressService.completeSection(userId, sectionId)

          setCompletedSections((prev) => {
            const next = new Set(prev)
            next.add(sectionId)
            return next
          })

          const moduleDone = await ProgressService.recalcModule(
            userId,
            currentModuleId
          )

          if (moduleDone) {
            setCompletedModules((prev) => {
              const next = new Set(prev)
              next.add(currentModuleId)
              return next
            })


            await ProgressService.recalcLesson(userId, currentLesson.id)
            await ProgressService.recalcCourse(userId, courseId)
          }
        }
      },
      { threshold: 0.6 }
    )

    const timeout = setTimeout(() => {
      document
        .querySelectorAll("[data-section]")
        .forEach((el) => observer.observe(el))
    }, 200)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [userId, currentModuleId, completedSections])



  const isFirstModule =
    currentLessonIndex === 0 && currentModuleIndex === 0

  const isLastModule =
    currentLessonIndex === lessons.length - 1 &&
    currentModuleIndex ===
      (currentLesson?.modules.length ?? 0) - 1

  const allModulesCompleted =
    completedModules.size ===
    lessons.reduce((acc, l) => acc + l.modules.length, 0)

  const handleNextModule = () => {
    if (isLastModule) return

    if (currentModuleIndex < (currentLesson?.modules.length ?? 0) - 1) {
      setCurrentModuleIndex((i) => i + 1)
    } else {
      setCurrentLessonIndex((i) => i + 1)
      setCurrentModuleIndex(0)
    }

    setShowQuiz(false)
  }

  const handlePreviousModule = () => {
    if (isFirstModule) return

    if (currentModuleIndex > 0) {
      setCurrentModuleIndex((i) => i - 1)
    } else {
      setCurrentLessonIndex((i) => i - 1)
      setCurrentModuleIndex(
        (lessons[currentLessonIndex - 1]?.modules.length ?? 1) - 1
      )
    }

    setShowQuiz(false)
  }



  if (!courseId) return <div className="p-8 text-center">Invalid course</div>

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )

  if (error)
    return <div className="p-8 text-center text-destructive">{error}</div>

  if (!currentModule)
    return <div className="p-8 text-center">Module not found</div>



  return (
    <LearningLayout
      sidebar={
        <LearningNav
          lessons={lessons}
          completedSections={completedSections}
          completedModules={completedModules}
          currentLessonIndex={currentLessonIndex}
          currentModuleIndex={currentModuleIndex}
          onNavigateToModule={(l, m) => {
            setCurrentLessonIndex(l)
            setCurrentModuleIndex(m)
            setShowQuiz(false)
          }}
          onScrollToSection={(id) =>
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
          }
        />
      }
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Banner */}
        <div className="relative h-[420px] rounded-2xl overflow-hidden">
          {currentModule.banner_image_url && (
            <img
              src={currentModule.banner_image_url}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative h-full flex flex-col justify-end p-8 text-white">
            <Badge className="w-fit mb-3">
              Lesson {currentLessonIndex + 1} · Module {currentModuleIndex + 1}
            </Badge>
            <h1 className="text-4xl font-bold">{currentModule.title}</h1>
            {currentModule.description && (
              <p className="mt-2 max-w-2xl">{currentModule.description}</p>
            )}
          </div>
        </div>

        {!showQuiz ? (
          <>
            {currentModule.sections.map((section: ModuleSection) => (
              <div key={section.id} id={section.id} data-section>
                <ContentSection section={section} />
              </div>
            ))}

            <div className="flex justify-between pt-8 border-t">
              <Button
                variant="outline"
                onClick={handlePreviousModule}
                disabled={isFirstModule}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentModule.quiz ? (
  <Button onClick={() => setShowQuiz(true)}>
    {completedModules.has(currentModule.id) ? "Review Quiz" : "Take Module Quiz"}
  </Button>
) : (
  <Button onClick={handleNextModule}>
    Next
    <ChevronRight className="w-4 h-4 ml-2" />
  </Button>
)}

            </div>
          </>
        ) : (
          <CheckpointQuiz
            quiz={currentModule.quiz!}
            onComplete={async () => {
              if (!userId) return

              setCompletedModules((prev) => {
                const next = new Set(prev)
                next.add(currentModule.id)
                return next
              })

              await ProgressService.recalcModule(userId, currentModule.id)
              await ProgressService.recalcLesson(userId, currentLesson.id)
              await ProgressService.recalcCourse(userId, courseId)

              setShowQuiz(false)
              handleNextModule()
            }}
          />
        )}

        {allModulesCompleted && (
          <Card className="bg-primary/5">
            <CardContent className="flex items-center gap-4 pt-6">
              <Award className="w-10 h-10" />
              <div>
                <h3 className="font-semibold">Course Completed</h3>
                <p className="text-sm text-muted-foreground">
                  You finished all modules 🎉
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </LearningLayout>
  )
}
