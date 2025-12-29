"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle } from "lucide-react"

const checkpointQuizzes = [
  {
    id: "checkpoint-1",
    title: "Checkpoint: Data Protection Essentials",
    questions: [
      {
        id: "1",
        question: "What is the primary goal of GDPR?",
        options: [
          "To increase profits",
          "To protect individuals' data privacy",
          "To regulate internet speeds",
          "To standardize currencies",
        ],
        correct: 1,
      },
      {
        id: "2",
        question: "How long can personal data be stored under GDPR?",
        options: ["Indefinitely", "Only as long as necessary", "10 years maximum", "5 years maximum"],
        correct: 1,
      },
    ],
  },
  {
    id: "checkpoint-2",
    title: "Checkpoint: Compliance in Practice",
    questions: [
      {
        id: "3",
        question: "What must you do before processing personal data?",
        options: ["Notify the government", "Obtain explicit consent", "Delete it immediately", "Store it forever"],
        correct: 1,
      },
    ],
  },
]

interface CheckpointQuizProps {
  topicIndex: number
}

export function CheckpointQuiz({ topicIndex }: CheckpointQuizProps) {
  const quizData = checkpointQuizzes[Math.floor(topicIndex / 2)]
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const question = quizData.questions[currentQuestion]
  const isAnswered = question.id in selectedAnswers
  const isCorrect = selectedAnswers[question.id] === question.correct

  const allAnswered = quizData.questions.every((q) => q.id in selectedAnswers)
  const score = Object.entries(selectedAnswers).filter(([qId, answer]) => {
    const q = quizData.questions.find((q) => q.id === qId)
    return q?.correct === answer
  }).length

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: optionIndex,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else if (!showResults) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setSelectedAnswers({})
    setCurrentQuestion(0)
    setShowResults(false)
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/0">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Quiz</Badge>
          <CardTitle className="text-lg">{quizData.title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!showResults ? (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {quizData.questions.length}
                </h4>
                <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-base font-medium">{question.question}</p>

              <div className="space-y-2">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                      selectedAnswers[question.id] === idx
                        ? "border-primary bg-primary/10"
                        : "border-muted hover:border-muted-foreground/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedAnswers[question.id] === idx
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {selectedAnswers[question.id] === idx && <span className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-sm">{option}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleNext}
                disabled={!isAnswered || (currentQuestion === quizData.questions.length - 1 && !allAnswered)}
                className="flex-1"
              >
                {currentQuestion === quizData.questions.length - 1 ? "See Results" : "Next Question"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  {score / quizData.questions.length >= 0.7 ? (
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  ) : (
                    <AlertCircle className="w-16 h-16 text-amber-500" />
                  )}
                </div>
                <h4 className="text-2xl font-bold">
                  {score}/{quizData.questions.length}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {score / quizData.questions.length >= 0.7
                    ? "Excellent! You passed this checkpoint."
                    : "Review the material and try again."}
                </p>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {quizData.questions.map((q, idx) => {
                  const userAnswer = selectedAnswers[q.id]
                  const isUserCorrect = userAnswer === q.correct
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
                        {isUserCorrect ? "✓" : "✗"} {q.options[userAnswer]}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <Button onClick={handleReset} className="w-full">
              Try Again
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
