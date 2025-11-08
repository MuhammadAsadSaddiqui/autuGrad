// components/dashboard/GeneratedMCQsLibrary.tsx (Complete with Fixed Delete Button)
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  Download,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Award,
  BarChart3,
  Send,
} from "lucide-react";
import { useNotification } from "@/lib/context/NotificationContext";
import ShareQuizModal from "@/components/modals/ShareQuizModal";
import QuizResultsModal from "@/components/modals/QuizResultsModal";

interface ContentItem {
  title: string;
  fileName: string;
  fileType: string;
}

interface MCQSet {
  id: number;
  name: string;
  description: string;
  status: string;
  totalQuestions: number;
  createdAt: string;
  content: ContentItem;
  _count: {
    questions: number;
  };
}

interface MCQQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  mcqSetId: number;
  createdAt: string;
}

export default function GeneratedMCQsLibrary() {
  const [mcqSets, setMcqSets] = useState<MCQSet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const [selectedMCQSet, setSelectedMCQSet] = useState<MCQSet | null>(null);
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set(),
  );
  const [showAnswers, setShowAnswers] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "quiz">("list");
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchMCQSets();
  }, []);

  const fetchMCQSets = async () => {
    try {
      const response = await fetch("/api/mcq/sets");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MCQSet[] = await response.json();
      setMcqSets(data);
    } catch (error) {
      console.error("Error fetching MCQ sets:", error);
      showError("Failed to fetch MCQ sets");
    } finally {
      setLoading(false);
    }
  };

  const fetchMCQQuestions = async (mcqSetId: number) => {
    setLoadingQuestions(true);
    try {
      const response = await fetch(`/api/mcq/sets/${mcqSetId}/questions`);
      if (response.ok) {
        const data = await response.json();
        setMcqQuestions(data);
        setCurrentQuestionIndex(0);
        setShowAnswers(false);
        setExpandedQuestions(new Set());
      } else {
        showError("Failed to fetch questions");
      }
    } catch {
      showError("Error fetching questions");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleViewMCQSet = async (mcqSet: MCQSet) => {
    setSelectedMCQSet(mcqSet);
    setShowViewModal(true);
    setViewMode("list");
    await fetchMCQQuestions(mcqSet.id);
  };

  const handleShareQuiz = (mcqSet: MCQSet) => {
    setSelectedMCQSet(mcqSet);
    setShowShareModal(true);
  };

  const handleViewResults = (mcqSet: MCQSet) => {
    setSelectedMCQSet(mcqSet);
    setShowResultsModal(true);
  };

  const handleDeleteMCQSet = async (id: number) => {
    if (!confirm("Are you sure you want to delete this MCQ set?")) return;

    try {
      const response = await fetch(`/api/mcq/sets/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showSuccess("MCQ set deleted successfully");
        fetchMCQSets();
      } else {
        showError("Failed to delete MCQ set");
      }
    } catch {
      showError("Error deleting MCQ set");
    }
  };

  const handleExportMCQSet = async (mcqSet: MCQSet) => {
    try {
      const response = await fetch(`/api/mcq/sets/${mcqSet.id}/export`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${mcqSet.name.replace(/[^a-z0-9]/gi, "_")}_mcqs.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showSuccess("MCQ set exported successfully");
      } else {
        showError("Failed to export MCQ set");
      }
    } catch {
      showError("Error exporting MCQ set");
    }
  };

  const toggleQuestionExpansion = (questionId: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const getOptionClass = (
    option: string,
    correctAnswer: string,
    showAnswers: boolean,
  ) => {
    if (!showAnswers) {
      return "p-3 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors bg-gray-50 hover:bg-gray-100";
    }

    if (option === correctAnswer) {
      return "p-3 rounded-lg border-2 border-green-500 bg-green-50 text-green-800";
    }

    return "p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600";
  };

  const filteredMCQSets = mcqSets.filter(
    (mcqSet) =>
      (mcqSet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mcqSet.content.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (selectedStatus === "All" || mcqSet.status === selectedStatus),
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "generating":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "generating":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Generated MCQs Library</h2>
          <p>Manage and organize your generated MCQ sets</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total MCQ Sets</p>
                <p className="text-xl font-bold">{mcqSets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed Sets</p>
                <p className="text-xl font-bold">
                  {mcqSets.filter((set) => set.status === "completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-xl font-bold">
                  {mcqSets.reduce((sum, set) => sum + set.totalQuestions, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-xl font-bold">
                  {mcqSets.filter((set) => set.status === "generating").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search MCQ sets by name or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded text-sm"
              >
                <option value="All">All Status</option>
                <option value="completed">Completed</option>
                <option value="generating">Generating</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MCQ Sets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMCQSets.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No MCQ sets found</h3>
                <p className="mb-4 text-gray-600">
                  {mcqSets.length === 0
                    ? "Generate your first MCQ set to get started"
                    : "No MCQ sets match your search criteria"}
                </p>
                {mcqSets.length === 0 && (
                  <Button
                    onClick={() =>
                      (window.location.href = "/dashboard?page=mcq-generator")
                    }
                  >
                    Generate MCQs
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredMCQSets.map((mcqSet) => (
            <Card key={mcqSet.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base truncate">
                    {mcqSet.name}
                  </CardTitle>
                  {getStatusIcon(mcqSet.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Source:</span>
                    <span className="font-medium truncate ml-2">
                      {mcqSet.content.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{mcqSet.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(mcqSet.status)}`}
                    >
                      {mcqSet.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 pt-2 border-t">
                  <p>File: {mcqSet.content.fileName}</p>
                  <p>
                    Created: {new Date(mcqSet.createdAt).toLocaleDateString()}
                  </p>
                  {mcqSet.description && (
                    <p className="mt-1 line-clamp-2">{mcqSet.description}</p>
                  )}
                </div>

                {/* Action Buttons - Always show delete */}
                <div className="flex flex-col space-y-2 pt-3 border-t">
                  {mcqSet.status === "completed" && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={() => handleViewMCQSet(mcqSet)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Questions
                      </Button>

                      {/* Quiz Actions */}
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleShareQuiz(mcqSet)}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Share Quiz
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleViewResults(mcqSet)}
                        >
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Results
                        </Button>
                      </div>

                      {/* Export Action */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleExportMCQSet(mcqSet)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </>
                  )}

                  {/* Delete button - always visible regardless of status */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDeleteMCQSet(mcqSet.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View MCQ Modal */}
      {showViewModal && selectedMCQSet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-5xl max-h-[95vh] overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {selectedMCQSet.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedMCQSet.totalQuestions} questions from{" "}
                    {selectedMCQSet.content.title}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-r-none"
                    >
                      List View
                    </Button>
                    <Button
                      variant={viewMode === "quiz" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("quiz")}
                      className="rounded-l-none"
                    >
                      Quiz Mode
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="overflow-y-auto max-h-[80vh] p-6">
              {loadingQuestions ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading questions...</span>
                </div>
              ) : mcqQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No questions found in this MCQ set.
                  </p>
                </div>
              ) : viewMode === "list" ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">All Questions</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAnswers(!showAnswers)}
                    >
                      {showAnswers ? "Hide Answers" : "Show Answers"}
                    </Button>
                  </div>

                  {mcqQuestions.map((question, index) => (
                    <Card key={question.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-semibold text-lg flex-1 pr-4">
                            <span className="text-blue-600 mr-2">
                              Q{index + 1}.
                            </span>
                            {question.question}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleQuestionExpansion(question.id)}
                          >
                            {expandedQuestions.has(question.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {(expandedQuestions.has(question.id) ||
                          showAnswers) && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {[
                                { label: "A", text: question.optionA },
                                { label: "B", text: question.optionB },
                                { label: "C", text: question.optionC },
                                { label: "D", text: question.optionD },
                              ].map((option) => (
                                <div
                                  key={option.label}
                                  className={getOptionClass(
                                    option.label,
                                    question.answer,
                                    showAnswers,
                                  )}
                                >
                                  <span className="font-semibold mr-2">
                                    {option.label})
                                  </span>
                                  {option.text}
                                </div>
                              ))}
                            </div>

                            {showAnswers && (
                              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800">
                                  <span className="font-semibold">
                                    Correct Answer:{" "}
                                  </span>
                                  <span className="font-bold">
                                    {question.answer}
                                  </span>
                                  <span className="ml-2">
                                    (
                                    {question.answer === "A"
                                      ? question.optionA
                                      : question.answer === "B"
                                        ? question.optionB
                                        : question.answer === "C"
                                          ? question.optionC
                                          : question.optionD}
                                    )
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // Quiz Mode
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold">Quiz Mode</h3>
                      <span className="text-sm text-gray-600">
                        Question {currentQuestionIndex + 1} of{" "}
                        {mcqQuestions.length}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentQuestionIndex === 0}
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.max(0, prev - 1),
                          )
                        }
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          currentQuestionIndex === mcqQuestions.length - 1
                        }
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.min(mcqQuestions.length - 1, prev + 1),
                          )
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>

                  {mcqQuestions[currentQuestionIndex] && (
                    <Card className="border-2 border-blue-200">
                      <CardContent className="p-8">
                        <h4 className="font-semibold text-xl mb-6">
                          <span className="text-blue-600 mr-2">
                            Q{currentQuestionIndex + 1}.
                          </span>
                          {mcqQuestions[currentQuestionIndex].question}
                        </h4>

                        <div className="grid grid-cols-1 gap-4 mb-6">
                          {[
                            {
                              label: "A",
                              text: mcqQuestions[currentQuestionIndex].optionA,
                            },
                            {
                              label: "B",
                              text: mcqQuestions[currentQuestionIndex].optionB,
                            },
                            {
                              label: "C",
                              text: mcqQuestions[currentQuestionIndex].optionC,
                            },
                            {
                              label: "D",
                              text: mcqQuestions[currentQuestionIndex].optionD,
                            },
                          ].map((option) => (
                            <div
                              key={option.label}
                              className={getOptionClass(
                                option.label,
                                mcqQuestions[currentQuestionIndex].answer,
                                showAnswers,
                              )}
                            >
                              <span className="font-semibold mr-3 text-lg">
                                {option.label})
                              </span>
                              <span className="text-lg">{option.text}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <Button
                            variant={showAnswers ? "default" : "outline"}
                            onClick={() => setShowAnswers(!showAnswers)}
                          >
                            {showAnswers ? "Hide Answer" : "Show Answer"}
                          </Button>

                          {showAnswers && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-green-800">
                                <span className="font-semibold">
                                  Correct Answer:{" "}
                                </span>
                                <span className="font-bold text-lg">
                                  {mcqQuestions[currentQuestionIndex].answer}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentQuestionIndex + 1) / mcqQuestions.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Share Quiz Modal */}
      {showShareModal && selectedMCQSet && (
        <ShareQuizModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          mcqSet={{
            id: selectedMCQSet.id,
            name: selectedMCQSet.name,
            description: selectedMCQSet.description || "",
            totalQuestions: selectedMCQSet.totalQuestions,
          }}
        />
      )}

      {/* Quiz Results Modal */}
      {showResultsModal && selectedMCQSet && (
        <QuizResultsModal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          mcqSetId={selectedMCQSet.id}
        />
      )}
    </div>
  );
}
