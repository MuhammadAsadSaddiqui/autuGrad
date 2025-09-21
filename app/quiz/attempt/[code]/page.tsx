// app/quiz/attempt/[code]/page.tsx (Simple Version)
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { CheckCircle, XCircle, Clock, User, BookOpen } from "lucide-react";

interface Question {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface QuizData {
  student: {
    name: string;
    email: string;
    department: string;
  };
  mcqSet: {
    id: number;
    name: string;
    description: string;
    totalQuestions: number;
    questions: Question[];
  };
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  grade: string;
  passed: boolean;
  timeSpent: number;
}

export default function SimpleQuizPage() {
  const params = useParams();
  const code = params.code as string;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());

  // Load quiz on component mount
  useEffect(() => {
    loadQuiz();
  }, [code]);

  const loadQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz/attempt/${code}`);
      const data = await response.json();

      if (response.ok) {
        setQuizData(data);
      } else {
        setError(data.error || "Quiz not found");
      }
    } catch (error) {
      setError("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizData!.mcqSet.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitQuiz = async () => {
    if (!quizData) return;

    setSubmitting(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          answers,
          timeSpent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setQuizCompleted(true);
      } else {
        setError(data.error || "Failed to submit quiz");
      }
    } catch (error) {
      setError("Error submitting quiz");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quiz...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz completed screen
  if (quizCompleted && result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                result.passed ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {result.passed ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              Quiz {result.passed ? "Completed Successfully!" : "Completed"}
            </CardTitle>
            <p className="text-gray-600">{quizData?.mcqSet.name}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {result.score}
                </div>
                <div className="text-sm text-blue-700">Correct</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {result.totalQuestions}
                </div>
                <div className="text-sm text-gray-700">Total</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {result.scorePercentage}%
                </div>
                <div className="text-sm text-purple-700">Score</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {result.grade}
                </div>
                <div className="text-sm text-orange-700">Grade</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2">Quiz Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  Time Spent: {Math.floor(result.timeSpent / 60)} minutes{" "}
                  {result.timeSpent % 60} seconds
                </div>
                <div>
                  Status:{" "}
                  <span
                    className={
                      result.passed ? "text-green-600" : "text-red-600"
                    }
                  >
                    {result.passed ? "Passed" : "Failed"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={() => window.close()} variant="outline">
                Close Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main quiz interface
  if (!quizData) return null;

  const currentQuestion = quizData.mcqSet.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / quizData.mcqSet.totalQuestions) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span className="font-medium">{quizData.student.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <span>{quizData.mcqSet.name}</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of{" "}
            {quizData.mcqSet.totalQuestions}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 h-2">
        <div
          className="bg-blue-600 h-2 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Area */}
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Question {currentQuestionIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg leading-relaxed">
              {currentQuestion.question}
            </div>

            <div className="grid gap-3">
              {[
                { key: "A", text: currentQuestion.optionA },
                { key: "B", text: currentQuestion.optionB },
                { key: "C", text: currentQuestion.optionC },
                { key: "D", text: currentQuestion.optionD },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() =>
                    handleAnswerSelect(currentQuestion.id, option.key)
                  }
                  className={`p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion.id] === option.key
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                        answers[currentQuestion.id] === option.key
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-gray-400 text-gray-600"
                      }`}
                    >
                      {option.key}
                    </div>
                    <span>{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="flex space-x-2">
                <Button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={goToNextQuestion}
                  disabled={
                    currentQuestionIndex === quizData.mcqSet.totalQuestions - 1
                  }
                  variant="outline"
                >
                  Next
                </Button>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">
                  {answeredQuestions} of {quizData.mcqSet.totalQuestions}{" "}
                  answered
                </div>
                <Button
                  onClick={submitQuiz}
                  disabled={submitting || answeredQuestions === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
