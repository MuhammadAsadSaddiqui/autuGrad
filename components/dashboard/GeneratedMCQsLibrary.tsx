"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Search,
  Filter,
  Download,
  Share2,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Brain,
  MoreVertical,
  Plus,
  Star,
} from "lucide-react";

// Dummy MCQ data
const mcqsData = [
  {
    id: 1,
    title: "Data Structures Fundamentals",
    subject: "Computer Science",
    difficulty: "Medium",
    questionsCount: 15,
    createdDate: "2024-01-15",
    lastModified: "2024-01-16",
    status: "published",
    views: 45,
    rating: 4.5,
    source: "Introduction to Data Structures.pdf",
    tags: ["Arrays", "Linked Lists", "Stacks"],
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    subject: "AI/ML",
    difficulty: "Easy",
    questionsCount: 12,
    createdDate: "2024-01-14",
    lastModified: "2024-01-14",
    status: "draft",
    views: 23,
    rating: 4.2,
    source: "ML Fundamentals.ppt",
    tags: ["Supervised Learning", "Classification", "Regression"],
  },
  {
    id: 3,
    title: "Database Management Systems",
    subject: "Database",
    difficulty: "Hard",
    questionsCount: 20,
    createdDate: "2024-01-13",
    lastModified: "2024-01-15",
    status: "published",
    views: 67,
    rating: 4.8,
    source: "DBMS Concepts.pdf",
    tags: ["SQL", "Normalization", "Transactions"],
  },
  {
    id: 4,
    title: "Neural Networks Overview",
    subject: "AI/ML",
    difficulty: "Hard",
    questionsCount: 18,
    createdDate: "2024-01-12",
    lastModified: "2024-01-13",
    status: "published",
    views: 34,
    rating: 4.6,
    source: "Neural Networks.ppt",
    tags: ["Deep Learning", "Backpropagation", "CNN"],
  },
  {
    id: 5,
    title: "Software Engineering Principles",
    subject: "Software Engineering",
    difficulty: "Medium",
    questionsCount: 10,
    createdDate: "2024-01-11",
    lastModified: "2024-01-12",
    status: "archived",
    views: 12,
    rating: 4.0,
    source: "SE Principles.txt",
    tags: ["SDLC", "Testing", "Design Patterns"],
  },
];

const subjects = [
  "All",
  "Computer Science",
  "AI/ML",
  "Database",
  "Software Engineering",
];
const difficulties = ["All", "Easy", "Medium", "Hard"];
const statuses = ["All", "Published", "Draft", "Archived"];

export default function GeneratedMCQsLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMCQ, setSelectedMCQ] = useState<any>(null);

  const filteredMCQs = mcqsData.filter((mcq) => {
    const matchesSearch =
      mcq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mcq.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesSubject =
      selectedSubject === "All" || mcq.subject === selectedSubject;
    const matchesDifficulty =
      selectedDifficulty === "All" || mcq.difficulty === selectedDifficulty;
    const matchesStatus =
      selectedStatus === "All" || mcq.status === selectedStatus.toLowerCase();
    return (
      matchesSearch && matchesSubject && matchesDifficulty && matchesStatus
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Generated MCQs Library
          </h2>
          <p className="text-gray-600">
            Manage and organize your generated MCQ sets
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Set
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total MCQ Sets
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mcqsData.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Questions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mcqsData.reduce((sum, mcq) => sum + mcq.questionsCount, 0)}
                </p>
              </div>
              <Brain className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Published Sets
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mcqsData.filter((mcq) => mcq.status === "published").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(
                    mcqsData.reduce((sum, mcq) => sum + mcq.rating, 0) /
                    mcqsData.length
                  ).toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search MCQ sets by title or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MCQ Sets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMCQs.map((mcq) => (
          <Card key={mcq.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  {mcq.title}
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mcq.difficulty)}`}
                >
                  {mcq.difficulty}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mcq.status)}`}
                >
                  {mcq.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subject:</span>
                <span className="font-medium">{mcq.subject}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Questions:</span>
                <span className="font-medium">{mcq.questionsCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Views:</span>
                <span className="font-medium">{mcq.views}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Rating:</span>
                <div className="flex items-center space-x-1">
                  {renderStars(mcq.rating)}
                  <span className="text-xs text-gray-600">({mcq.rating})</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <p>Source: {mcq.source}</p>
                <p>Created: {mcq.createdDate}</p>
                <p>Modified: {mcq.lastModified}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {mcq.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {mcq.tags.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{mcq.tags.length - 2}
                  </span>
                )}
              </div>
              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedMCQ(mcq)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <Share2 className="h-3 w-3 mr-1" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MCQ Preview Modal */}
      {selectedMCQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedMCQ.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMCQ(null)}
                >
                  ×
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedMCQ.difficulty)}`}
                >
                  {selectedMCQ.difficulty}
                </span>
                <span className="text-sm text-gray-600">
                  {selectedMCQ.subject}
                </span>
                <span className="text-sm text-gray-600">
                  • {selectedMCQ.questionsCount} questions
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMCQ.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Sample Questions:</h4>
                  <div className="text-sm text-gray-600">
                    <p>
                      This MCQ set contains {selectedMCQ.questionsCount}{" "}
                      carefully crafted questions covering various aspects of{" "}
                      {selectedMCQ.subject}.
                    </p>
                    <p className="mt-2">Generated from: {selectedMCQ.source}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Set
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
