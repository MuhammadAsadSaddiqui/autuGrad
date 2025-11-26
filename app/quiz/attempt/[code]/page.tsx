"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  User,
  BookOpen,
  AlertCircle,
} from "lucide-react";

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
  wrongAnswers: number;
  unattempted: number;
  totalQuestions: number;
  rawScore: string;
  finalScore: string;
  scorePercentage: number;
  grade: string;
  passed: boolean;
  timeSpent: number;
  negativeMarking: number;
  breakdown: {
    correct: string;
    wrong: string;
    unattempted: string;
    total: string;
  };
}

export default function SecureQuizPage() {
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
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/attempt/${code}`);
        const data = await response.json();
        if (response.ok) {
          setQuizData(data);
          setTimeLeft(data.mcqSet.totalQuestions * 60);
        } else {
          setError(data.error || "Quiz not found");
        }
      } catch {
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [code]);

  useEffect(() => {
    if (!quizData || quizCompleted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitQuiz(false); // auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quizData, quizCompleted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && ["c", "x", "s", "u"].includes(e.key.toLowerCase())) ||
        e.key === "F12"
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
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

  const submitQuiz = async (manual: boolean = true) => {
    if (!quizData || submitting || quizCompleted) return;

    if (manual) {
      const confirmSubmit = window.confirm(
        "Are you sure you want to submit the quiz? Wrong answers will have negative marking (-0.25 marks per wrong answer).",
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, answers, timeSpent }),
      });
      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setQuizCompleted(true);
      } else {
        setError(data.error || "Failed to submit quiz");
      }
    } catch {
      setError("Error submitting quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  if (!quizData) return null;

  const currentQuestion = quizData.mcqSet.questions[currentQuestionIndex];
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div
      className="min-h-screen bg-gray-50 select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5 text-blue-600" />
            <span className="font-medium">{quizData.student.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <BookOpen className="h-5 w-5 text-green-600" />
            <span className="font-medium">{quizData.mcqSet.name}</span>
          </div>
          <div className="text-sm font-semibold text-gray-700">
            Time: {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </div>
        </div>
      </div>

      {!quizCompleted && (
        <div className="max-w-4xl mx-auto mt-4 px-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-800">
                  Negative Marking Applied
                </p>
                <p className="text-yellow-700">
                  Correct: +1 mark | Wrong: -0.25 marks | Unattempted: 0 marks
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Question {currentQuestionIndex + 1} of{" "}
                {quizData.mcqSet.totalQuestions}
              </CardTitle>
              <div className="text-sm text-gray-600">
                Answered: {answeredQuestions}/{quizData.mcqSet.totalQuestions}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg font-medium">
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
                  disabled={quizCompleted}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    answers[currentQuestion.id] === option.key
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
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

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-2">
                <Button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0 || quizCompleted}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={goToNextQuestion}
                  disabled={
                    currentQuestionIndex ===
                      quizData.mcqSet.questions.length - 1 || quizCompleted
                  }
                  variant="outline"
                >
                  Next
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => submitQuiz(true)}
                  disabled={submitting || quizCompleted}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 grid grid-cols-10 gap-2">
          {quizData.mcqSet.questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              disabled={quizCompleted}
              className={`h-10 rounded text-sm font-medium transition-all ${
                idx === currentQuestionIndex
                  ? "bg-blue-600 text-white ring-2 ring-blue-300"
                  : answers[q.id]
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-gray-100 text-gray-600 border border-gray-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {quizCompleted && result && (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-3xl my-8">
            <CardHeader className="text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${result.passed ? "bg-green-100" : "bg-red-100"}`}
              >
                {result.passed ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <CardTitle className="text-2xl">
                Quiz {result.passed ? "Passed!" : "Completed"}
              </CardTitle>
              <p className="text-gray-600 mt-2">Your performance summary</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600">
                    {result.score}
                  </div>
                  <div className="text-sm text-green-700 font-medium">
                    Correct
                  </div>
                </div>
                <div className="text-center bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-3xl font-bold text-red-600">
                    {result.wrongAnswers}
                  </div>
                  <div className="text-sm text-red-700 font-medium">Wrong</div>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-gray-600">
                    {result.unattempted}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    Unattempted
                  </div>
                </div>
                <div className="text-center bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">
                    {result.grade}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">Grade</div>
                </div>
              </div>

              {/* Score Calculation */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">
                  Score Calculation
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">
                      {result.breakdown.correct}
                    </span>
                    <span className="font-medium text-green-600">
                      +{result.score}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">
                      {result.breakdown.wrong}
                    </span>
                    <span className="font-medium text-red-600">
                      -
                      {(result.wrongAnswers * result.negativeMarking).toFixed(
                        2,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">
                      {result.breakdown.unattempted}
                    </span>
                    <span className="font-medium text-gray-600">0</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-blue-50 px-3 rounded mt-2">
                    <span className="font-semibold text-blue-900">
                      {result.breakdown.total}
                    </span>
                    <span className="font-bold text-xl text-blue-600">
                      {result.scorePercentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">Time Taken</p>
                  <p className="font-semibold text-lg">
                    {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}
                    s
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">Negative Marking</p>
                  <p className="font-semibold text-lg">
                    -{result.negativeMarking} per wrong
                  </p>
                </div>
              </div>

              <div className="text-center pt-4">
                <Button
                  onClick={() => window.close()}
                  variant="outline"
                  className="px-8"
                >
                  Close Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
