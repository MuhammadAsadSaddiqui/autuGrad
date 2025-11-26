"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  Users,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Mail,
} from "lucide-react";

interface QuizResult {
  id: number;
  student: {
    name: string;
    email: string;
    department: string;
  };
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  grade: string;
  passed: boolean;
  timeSpent: number;
  submittedAt: string;
}

interface QuizInvitation {
  student: {
    name: string;
    email: string;
    department: string;
  };
  code: string;
  isUsed: boolean;
  usedAt: string | null;
  expiresAt: string;
  sentAt: string;
}

interface QuizStats {
  totalInvitations: number;
  totalAttempts: number;
  averageScore: number;
  passedCount: number;
}

interface MCQSetInfo {
  id: number;
  name: string;
  description: string;
  totalQuestions: number;
  content: {
    title: string;
    fileName: string;
  };
}

interface QuizResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mcqSetId: number;
}

export default function QuizResultsModal({
  isOpen,
  onClose,
  mcqSetId,
}: QuizResultsModalProps) {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [invitations, setInvitations] = useState<QuizInvitation[]>([]);
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [mcqSet, setMcqSet] = useState<MCQSetInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"results" | "invitations">(
    "results",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    if (isOpen) {
      fetchQuizResults();
    }
  }, [isOpen, mcqSetId]);

  const fetchQuizResults = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/quiz/results/${mcqSetId}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setInvitations(data.invitations);
        setStats(data.stats);
        setMcqSet(data.mcqSet);
      }
    } catch (error) {
      console.error("Error fetching quiz results:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportResults = async (format: "csv" | "pdf") => {
    try {
      const response = await fetch(
        `/api/quiz/results/${mcqSetId}/export?format=${format}`,
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${mcqSet?.name}_results.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      z;
      console.error("Error exporting results:", error);
    }
  };

  const filteredResults = results.filter((result) => {
    const matchesSearch =
      result.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.student.department
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesGrade = filterGrade === "All" || result.grade === filterGrade;

    return matchesSearch && matchesGrade;
  });

  const filteredInvitations = invitations.filter((invitation) => {
    const matchesSearch =
      invitation.student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      invitation.student.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      invitation.student.department
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Used" && invitation.isUsed) ||
      (filterStatus === "Pending" && !invitation.isUsed);

    return matchesSearch && matchesStatus;
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "text-green-600 bg-green-100";
      case "B":
        return "text-blue-600 bg-blue-100";
      case "C":
        return "text-yellow-600 bg-yellow-100";
      case "D":
        return "text-orange-600 bg-orange-100";
      case "F":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-7xl max-h-[95vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {mcqSet?.name} - Results
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {mcqSet?.description ||
                  `${mcqSet?.totalQuestions} questions from ${mcqSet?.content.title}`}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportResults("csv")}
              >
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading results...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Statistics Cards */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Invitations Sent
                          </p>
                          <p className="text-xl font-bold">
                            {stats.totalInvitations}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Attempts</p>
                          <p className="text-xl font-bold">
                            {stats.totalAttempts}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-600">Average Score</p>
                          <p className="text-xl font-bold">
                            {stats.averageScore}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Passed</p>
                          <p className="text-xl font-bold">
                            {stats.passedCount}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Tabs */}
              <div className="border-b">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("results")}
                    className={`pb-2 px-1 border-b-2 transition-colors ${
                      activeTab === "results"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Quiz Results ({results.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("invitations")}
                    className={`pb-2 px-1 border-b-2 transition-colors ${
                      activeTab === "invitations"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Invitations ({invitations.length})
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex space-x-2">
                  {activeTab === "results" ? (
                    <select
                      value={filterGrade}
                      onChange={(e) => setFilterGrade(e.target.value)}
                      className="px-3 py-2 border rounded text-sm"
                    >
                      <option value="All">All Grades</option>
                      <option value="A">Grade A</option>
                      <option value="B">Grade B</option>
                      <option value="C">Grade C</option>
                      <option value="D">Grade D</option>
                      <option value="F">Grade F</option>
                    </select>
                  ) : (
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border rounded text-sm"
                    >
                      <option value="All">All Status</option>
                      <option value="Used">Used</option>
                      <option value="Pending">Pending</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="border rounded-lg overflow-hidden">
                {activeTab === "results" ? (
                  <div className="overflow-x-auto max-h-96">
                    {filteredResults.length === 0 ? (
                      <div className="text-center py-8">
                        <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {results.length === 0
                            ? "No quiz attempts yet"
                            : "No results match your search"}
                        </p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b sticky top-0">
                          <tr>
                            <th className="text-left p-4 font-medium">
                              Student
                            </th>
                            <th className="text-left p-4 font-medium">Score</th>
                            <th className="text-left p-4 font-medium">Grade</th>
                            <th className="text-left p-4 font-medium">Time</th>
                            <th className="text-left p-4 font-medium">
                              Status
                            </th>
                            <th className="text-left p-4 font-medium">
                              Submitted
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredResults.map((result) => (
                            <tr key={result.id} className="hover:bg-gray-50">
                              <td className="p-4">
                                <div>
                                  <div className="font-medium">
                                    {result.student.name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {result.student.email}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {result.student.department}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-lg font-bold">
                                  {result.score}/{result.totalQuestions}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {result.scorePercentage}%
                                </div>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2 py-1 rounded text-sm font-medium ${getGradeColor(result.grade)}`}
                                >
                                  {result.grade}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="text-sm">
                                  {formatTime(result.timeSpent)}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-1">
                                  {result.passed ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  )}
                                  <span
                                    className={`text-sm ${result.passed ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {result.passed ? "Passed" : "Failed"}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-sm text-gray-600">
                                  {new Date(
                                    result.submittedAt,
                                  ).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(
                                    result.submittedAt,
                                  ).toLocaleTimeString()}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ) : (
                  // Invitations Tab
                  <div className="overflow-x-auto max-h-96">
                    {filteredInvitations.length === 0 ? (
                      <div className="text-center py-8">
                        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {invitations.length === 0
                            ? "No invitations sent yet"
                            : "No invitations match your search"}
                        </p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b sticky top-0">
                          <tr>
                            <th className="text-left p-4 font-medium">
                              Student
                            </th>
                            <th className="text-left p-4 font-medium">
                              Quiz Code
                            </th>
                            <th className="text-left p-4 font-medium">
                              Status
                            </th>
                            <th className="text-left p-4 font-medium">
                              Sent Date
                            </th>
                            <th className="text-left p-4 font-medium">
                              Expires
                            </th>
                            <th className="text-left p-4 font-medium">
                              Used Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredInvitations.map((invitation, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="p-4">
                                <div>
                                  <div className="font-medium">
                                    {invitation.student.name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {invitation.student.email}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {invitation.student.department}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                  {invitation.code}
                                </span>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2 py-1 rounded text-sm font-medium ${
                                    invitation.isUsed
                                      ? "bg-green-100 text-green-800"
                                      : new Date(invitation.expiresAt) <
                                          new Date()
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {invitation.isUsed
                                    ? "Used"
                                    : new Date(invitation.expiresAt) <
                                        new Date()
                                      ? "Expired"
                                      : "Pending"}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="text-sm text-gray-600">
                                  {new Date(
                                    invitation.sentAt,
                                  ).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(
                                    invitation.sentAt,
                                  ).toLocaleTimeString()}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-sm text-gray-600">
                                  {new Date(
                                    invitation.expiresAt,
                                  ).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(
                                    invitation.expiresAt,
                                  ).toLocaleTimeString()}
                                </div>
                              </td>
                              <td className="p-4">
                                {invitation.usedAt ? (
                                  <div>
                                    <div className="text-sm text-gray-600">
                                      {new Date(
                                        invitation.usedAt,
                                      ).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {new Date(
                                        invitation.usedAt,
                                      ).toLocaleTimeString()}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-400">
                                    -
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>

              {/* Summary Footer */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {activeTab === "results"
                      ? `Showing ${filteredResults.length} of ${results.length} results`
                      : `Showing ${filteredInvitations.length} of ${invitations.length} invitations`}
                  </span>
                  {activeTab === "results" && results.length > 0 && (
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span>
                        Pass Rate:{" "}
                        {Math.round(
                          ((stats?.passedCount || 0) /
                            (stats?.totalAttempts || 1)) *
                            100,
                        )}
                        %
                      </span>
                      <span>•</span>
                      <span>
                        Completion Rate:{" "}
                        {Math.round(
                          ((stats?.totalAttempts || 0) /
                            (stats?.totalInvitations || 1)) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
