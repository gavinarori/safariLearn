"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import type { ModuleQuiz } from "@/services/lessonsService"

interface CheckpointQuizProps {
  quiz: ModuleQuiz
  onComplete: () => void
}

export function CheckpointQuiz({ quiz, onComplete }: CheckpointQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null)
  const [attempted, setAttempted] = useState(false)

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
  const percentage = Math.round((score / quiz.questions.length) * 100)
  const isPassed = percentage >= quiz.passing_score

  const handleAnswer = (optionId: string) => {
    if (isLocked) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }))

    const selectedOption = question.options.find((o) => o.id === optionId)
    const correct = selectedOption?.is_correct ?? false

    setIsAnswerCorrect(correct)
    setIsLocked(!correct)
    setAttempted(true)
  }

  const handleTryAgain = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev }
      delete copy[question.id]
      return copy
    })

    setIsLocked(false)
    setIsAnswerCorrect(null)
    setAttempted(false)
  }

  const handleNext = () => {
    if (!isAnswerCorrect) return

    setIsLocked(false)
    setIsAnswerCorrect(null)
    setAttempted(false)

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }


  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 via-background to-primary/0">
      <CardHeader className="border-b pb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Module Quiz</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Test your knowledge before moving forward</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {currentQuestion + 1}/{quiz.questions.length}
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-8">
        {!showResults ? (
          <>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">{question.question}</h3>
              </div>

              <div className="space-y-3">
                {question.options.map((option, idx) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={isLocked && selectedAnswers[question.id] !== option.id}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-start gap-4 group ${
                      selectedAnswers[question.id] === option.id
                        ? isAnswerCorrect
                          ? "border-green-500/50 bg-green-50 dark:bg-green-950/30"
                          : "border-red-500/50 bg-red-50 dark:bg-red-950/30"
                        : "border-muted hover:border-primary/30 hover:bg-muted/50"
                    } ${isLocked && selectedAnswers[question.id] !== option.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selectedAnswers[question.id] === option.id
                          ? isAnswerCorrect
                            ? "border-green-500 bg-green-500"
                            : "border-red-500 bg-red-500"
                          : "border-muted-foreground/40 group-hover:border-primary/50"
                      }`}
                    >
                      {selectedAnswers[question.id] === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">{option.text}</span>
                    </div>
                    {selectedAnswers[question.id] === option.id && isAnswerCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 animate-in fade-in" />
                    )}
                    {selectedAnswers[question.id] === option.id && !isAnswerCorrect && (
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 animate-in fade-in" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback message */}
            {attempted && (
              <div
                className={`p-4 rounded-lg border transition-all ${
                  isAnswerCorrect
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                    : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                }`}
              >
                <p className={`text-sm font-medium ${isAnswerCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                  {isAnswerCorrect ? "✓ Correct! Well done." : "✗ Incorrect. Please try again."}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              {isAnswerCorrect === false ? (
                <Button onClick={handleTryAgain} variant="outline" className="w-full">
                  Try Again
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isAnswerCorrect}
                  className="w-full gap-2"
                >
                  {currentQuestion === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center ${
                    isPassed
                      ? "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950"
                      : "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-950 dark:to-yellow-950"
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h3
                  className={`text-3xl font-bold ${
                    isPassed ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {percentage}%
                </h3>
                <h4 className="text-2xl font-semibold text-foreground">
                  {isPassed ? "Excellent work!" : "Keep learning!"}
                </h4>
                <p className="text-muted-foreground">
                  {isPassed
                    ? "You've mastered this module and can move forward."
                    : `You need ${quiz.passing_score}% to pass. Review and try again.`}
                </p>
                <p className="text-sm font-medium text-muted-foreground pt-2">
                  Correct: {score} out of {quiz.questions.length}
                </p>
              </div>
            </div>

            {/* Answer Review */}
            <div className="space-y-3 border-t pt-8">
              <h4 className="font-semibold text-sm text-foreground">Review Your Answers</h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {quiz.questions.map((q, idx) => {
                  const answerId = selectedAnswers[q.id]
                  const userAns = q.options.find((opt) => opt.id === answerId)
                  const isUserCorrect = userAns?.is_correct
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border-l-4 transition-all ${
                        isUserCorrect
                          ? "bg-green-50 dark:bg-green-950/30 border-green-500"
                          : "bg-red-50 dark:bg-red-950/30 border-red-500"
                      }`}
                    >
                      <p className="text-sm font-semibold mb-2 text-foreground">Q{idx + 1}. {q.question}</p>
                      <p
                        className={`text-sm flex items-center gap-2 ${
                          isUserCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        <span className="font-semibold">{isUserCorrect ? "✓" : "✗"}</span>
                        {userAns?.text}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <Button onClick={onComplete} size="lg" className="w-full gap-2">
              {isPassed ? "Continue to Next Module" : "Review and Retry"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
