"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, ChevronRight, ChevronLeft } from "lucide-react"
import { LearningLayout } from "@/components/learn-components/learning-layout"
import { LearningNav } from "@/components/learn-components/learning-nav"
import { ContentSection } from "@/components/learn-components/content-section"
import { CheckpointQuiz } from "@/components/learn-components/checkpoint-quiz"
import { mockLessonData } from "@/data/mock-lessons"

export default function LearnPage() {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set())
  const [completedSubtopics, setCompletedSubtopics] = useState<Set<string>>(new Set())
  const [showQuiz, setShowQuiz] = useState(false)

  const currentTopic = mockLessonData.topics[currentChapterIndex]
  const isLastChapter = currentChapterIndex === mockLessonData.topics.length - 1
  const isFirstChapter = currentChapterIndex === 0
  const allTopicsCompleted = completedTopics.size === mockLessonData.topics.length

  const handleNextChapter = () => {
    if (!isLastChapter) {
      setCurrentChapterIndex(currentChapterIndex + 1)
      setShowQuiz(false)
    }
  }

  const handlePreviousChapter = () => {
    if (!isFirstChapter) {
      setCurrentChapterIndex(currentChapterIndex - 1)
      setShowQuiz(false)
    }
  }

  const completeCurrentTopic = () => {
    const newCompleted = new Set(completedTopics)
    newCompleted.add(currentTopic.id)
    setCompletedTopics(newCompleted)
  }

  return (
    <LearningLayout
      sidebar={
        <LearningNav
          lesson={mockLessonData}
          completedTopics={completedTopics}
          completedSubtopics={completedSubtopics}
          currentChapterId={currentTopic.id}
          onNavigateToChapter={(chapterId) => {
            const index = mockLessonData.topics.findIndex((t) => t.id === chapterId)
            setCurrentChapterIndex(index)
            setShowQuiz(false)
          }}
        />
      }
    >
      <div className="max-w-4xl mx-auto py-6 px-4 lg:px-0 space-y-8">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-8">
          <div className="space-y-2">
            <Badge className="w-fit">
              Chapter {currentChapterIndex + 1} of {mockLessonData.topics.length}
            </Badge>
            <h1 className="text-4xl font-bold">{currentTopic.title}</h1>
            <p className="text-muted-foreground text-lg">{currentTopic.description}</p>
          </div>
        </div>

        {/* Progress bar for current chapter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Chapter Progress</span>
            <span className="text-muted-foreground">
              {completedSubtopics.size} of {currentTopic.subtopics?.length || 0} subtopics
            </span>
          </div>
          <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${currentTopic.subtopics?.length ? (completedSubtopics.size / currentTopic.subtopics.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {!showQuiz ? (
          <>
            {currentTopic.subtopics && currentTopic.subtopics.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Topics to Cover:</h3>
                  <div className="space-y-2">
                    {currentTopic.subtopics.map((subtopic) => (
                      <label
                        key={subtopic.id}
                        className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={completedSubtopics.has(subtopic.id)}
                          onChange={(e) => {
                            const newCompleted = new Set(completedSubtopics)
                            if (e.target.checked) {
                              newCompleted.add(subtopic.id)
                            } else {
                              newCompleted.delete(subtopic.id)
                            }
                            setCompletedSubtopics(newCompleted)
                          }}
                          className="w-5 h-5 rounded cursor-pointer"
                        />
                        <span className="text-sm font-medium">{subtopic.title}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chapter content with mix of sections and dropdowns */}
            <div className="space-y-6">
              {currentTopic.sections.map((section) => (
                <ContentSection key={section.id} section={section} />
              ))}
            </div>

            <div className="flex items-center justify-between pt-8 border-t">
              <Button
                variant="outline"
                onClick={handlePreviousChapter}
                disabled={isFirstChapter}
                className="gap-2 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Chapter
              </Button>

              {!isLastChapter ? (
                <Button onClick={handleNextChapter} className="gap-2">
                  Next Chapter
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={() => setShowQuiz(true)} className="gap-2">
                  Take Final Quiz
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <CheckpointQuiz
              topicIndex={currentChapterIndex}
              isFinalQuiz={true}
              onComplete={() => {
                completeCurrentTopic()
                setShowQuiz(false)
              }}
            />
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={() => setShowQuiz(false)}>
                Back to Content
              </Button>
            </div>
          </>
        )}

        {/* Completion screen */}
        {allTopicsCompleted && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Award className="w-12 h-12 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Course Completed!</h3>
                  <p className="text-sm text-muted-foreground">You have successfully completed all chapters</p>
                </div>
                <Button>Download Certificate</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </LearningLayout>
  )
}
