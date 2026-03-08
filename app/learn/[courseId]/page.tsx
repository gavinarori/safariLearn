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
        <div className="relative h-96 md:h-[480px] rounded-xl overflow-hidden shadow-lg">
          {currentModule.banner_image_url && (
            <img
              src={currentModule.banner_image_url}
              className="absolute inset-0 w-full h-full object-cover"
              alt={currentModule.title}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="relative h-full flex flex-col justify-end p-6 md:p-10 text-white">
            <div className="space-y-4">
              <Badge className="w-fit bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30">
                <span className="text-white">Lesson {currentLessonIndex + 1}</span>
                <span className="mx-1.5 text-white/60">·</span>
                <span className="text-white">Module {currentModuleIndex + 1}</span>
              </Badge>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">{currentModule.title}</h1>
                {currentModule.description && (
                  <p className="text-lg text-white/90 max-w-2xl leading-relaxed">{currentModule.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {!showQuiz ? (
          <>
            {currentModule.sections.map((section: ModuleSection) => (
              <div key={section.id} id={section.id} data-section>
                <ContentSection section={section} />
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-3 justify-between pt-8 border-t mt-12">
              <Button
                variant="outline"
                onClick={handlePreviousModule}
                disabled={isFirstModule}
                className="gap-2"
                size="lg"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous Module</span>
              </Button>

              {currentModule.quiz ? (
                <Button 
                  onClick={() => setShowQuiz(true)}
                  className="gap-2"
                  size="lg"
                >
                  <span>{completedModules.has(currentModule.id) ? "Review Quiz" : "Take Module Quiz"}</span>
                </Button>
              ) : (
                <Button 
                  onClick={handleNextModule}
                  className="gap-2"
                  size="lg"
                >
                  <span>Next Module</span>
                  <ChevronRight className="w-5 h-5" />
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
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-primary/30 shadow-lg">
            <CardContent className="flex flex-col sm:flex-row items-center gap-6 py-8">
              <div className="p-4 rounded-full bg-primary/20">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-foreground">🎉 Course Completed!</h3>
                <p className="text-muted-foreground mt-1">
                  Congratulations! You&apos;ve successfully completed all modules. Well done on your learning journey!
                </p>
              </div>
              <Button 
                variant="default"
                onClick={() => {
                  /* Navigate to course list or certificate */
                }}
                className="gap-2"
              >
                View Certificate
                <Award className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </LearningLayout>
  )
}
