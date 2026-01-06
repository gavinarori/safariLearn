"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle } from "lucide-react"
import type { ModuleQuiz } from "@/services/lessonsService"

interface CheckpointQuizProps {
  quiz: ModuleQuiz
  onComplete: () => void
}

export function CheckpointQuiz({ quiz, onComplete }: CheckpointQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)

  const question = quiz.questions[currentQuestion]
  const isAnswered = question.id in selectedAnswers
  const userAnswerId = selectedAnswers[question.id]
  const userAnswer = question.options.find((opt) => opt.id === userAnswerId)
  const isCorrect = userAnswer?.is_correct || false

  const allAnswered = quiz.questions.every((q) => q.id in selectedAnswers)
  const score = quiz.questions.filter((q) => {
    const answerId = selectedAnswers[q.id]
    return q.options.find((opt) => opt.id === answerId)?.is_correct
  }).length

  const handleAnswer = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (!showResults) {
      setShowResults(true)
    }
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/0">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Quiz</Badge>
          <CardTitle className="text-lg">Module Quiz</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!showResults ? (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </h4>
                <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-base font-medium">{question.question}</p>

              <div className="space-y-2">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                      selectedAnswers[question.id] === option.id
                        ? "border-primary bg-primary/10"
                        : "border-muted hover:border-muted-foreground/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedAnswers[question.id] === option.id
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {selectedAnswers[question.id] === option.id && <span className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-sm">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleNext} disabled={!isAnswered} className="w-full">
              {currentQuestion === quiz.questions.length - 1 ? "See Results" : "Next Question"}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  {(score / quiz.questions.length) * 100 >= quiz.passing_score ? (
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  ) : (
                    <AlertCircle className="w-16 h-16 text-amber-500" />
                  )}
                </div>
                <h4 className="text-2xl font-bold">
                  {score}/{quiz.questions.length}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {(score / quiz.questions.length) * 100 >= quiz.passing_score
                    ? "Excellent! You passed this quiz."
                    : "Review the material and try again."}
                </p>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {quiz.questions.map((q) => {
                  const answerId = selectedAnswers[q.id]
                  const userAns = q.options.find((opt) => opt.id === answerId)
                  const isUserCorrect = userAns?.is_correct
                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-lg border ${
                        isUserCorrect
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      }`}
                    >
                      <p className="text-xs font-medium mb-1">{q.question}</p>
                      <p
                        className={`text-xs ${isUserCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                      >
                        {isUserCorrect ? "✓" : "✗"} {userAns?.text}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <Button onClick={onComplete} className="w-full">
              Continue Learning
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
