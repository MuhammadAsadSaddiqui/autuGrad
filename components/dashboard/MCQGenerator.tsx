"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Brain,
  FileText,
  Settings,
  Play,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

// Dummy data for available content
const availableContent = [
  {
    id: 1,
    title: "Introduction to Data Structures",
    type: "PDF",
    processed: true,
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    type: "PPT",
    processed: true,
  },
  { id: 3, title: "Database Management Systems", type: "PDF", processed: true },
  { id: 4, title: "Neural Networks Overview", type: "PPT", processed: true },
  {
    id: 5,
    title: "Software Engineering Principles",
    type: "TXT",
    processed: true,
  },
];

// Dummy generated MCQs
const sampleMCQs = [
  {
    id: 1,
    question: "What is the time complexity of binary search in a sorted array?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    difficulty: "Medium",
    topic: "Data Structures",
  },
  {
    id: 2,
    question:
      "Which data structure follows the Last In First Out (LIFO) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    difficulty: "Easy",
    topic: "Data Structures",
  },
  {
    id: 3,
    question: "In machine learning, what does overfitting refer to?",
    options: [
      "Model performs well on training data but poorly on test data",
      "Model performs poorly on both training and test data",
      "Model performs well on both training and test data",
      "Model has too few parameters",
    ],
    correctAnswer: 0,
    difficulty: "Medium",
    topic: "Machine Learning",
  },
];

export default function MCQGenerator() {
  const [selectedContent, setSelectedContent] = useState<number[]>([]);
  const [generationSettings, setGenerationSettings] = useState({
    numQuestions: 10,
    difficulty: "Mixed",
    questionTypes: ["Multiple Choice"],
    includeExplanations: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMCQs, setGeneratedMCQs] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleContentSelection = (contentId: number) => {
    setSelectedContent((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId],
    );
  };

  const handleGenerate = async () => {
    if (selectedContent.length === 0) {
      alert("Please select at least one content item");
      return;
    }

    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      setGeneratedMCQs(sampleMCQs);
      setIsGenerating(false);
      setShowResults(true);
    }, 3000);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">MCQ Generator</h2>
          <p className="text-gray-600">
            Generate MCQs from your uploaded content using AI
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Brain className="h-4 w-4" />
          <span>Powered by Llama 3.2 3B</span>
        </div>
      </div>

      {!showResults ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Select Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableContent.map((content) => (
                    <div
                      key={content.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedContent.includes(content.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleContentSelection(content.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {content.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {content.type} • Processed
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {content.processed && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          <input
                            type="checkbox"
                            checked={selectedContent.includes(content.id)}
                            onChange={() => handleContentSelection(content.id)}
                            className="h-4 w-4 text-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedContent.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {selectedContent.length} content item(s) selected for MCQ
                      generation
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generation Settings */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Generation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <Input
                    type="number"
                    value={generationSettings.numQuestions}
                    onChange={(e) =>
                      setGenerationSettings((prev) => ({
                        ...prev,
                        numQuestions: parseInt(e.target.value) || 10,
                      }))
                    }
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={generationSettings.difficulty}
                    onChange={(e) =>
                      setGenerationSettings((prev) => ({
                        ...prev,
                        difficulty: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Mixed">Mixed</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Types
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="mr-2"
                      />
                      <span className="text-sm">Multiple Choice</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" disabled />
                      <span className="text-sm text-gray-400">
                        True/False (Coming Soon)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" disabled />
                      <span className="text-sm text-gray-400">
                        Fill in the Blank (Coming Soon)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={generationSettings.includeExplanations}
                    onChange={(e) =>
                      setGenerationSettings((prev) => ({
                        ...prev,
                        includeExplanations: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Include Explanations
                  </label>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || selectedContent.length === 0}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Generate MCQs
                    </>
                  )}
                </Button>

                {isGenerating && (
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">
                      Analyzing content and generating questions...
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full animate-pulse"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Tips for Better MCQs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Select content with clear concepts</li>
                  <li>• Mix different difficulty levels</li>
                  <li>• Review and edit generated questions</li>
                  <li>• Include explanations for learning</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Generated MCQs Results */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Generated MCQs
              </h3>
              <p className="text-sm text-gray-600">
                {generatedMCQs.length} questions generated successfully
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowResults(false)}>
                Generate More
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {generatedMCQs.map((mcq, index) => (
              <Card key={mcq.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Question {index + 1}: {mcq.question}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mcq.difficulty)}`}
                      >
                        {mcq.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{mcq.topic}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {mcq.options.map((option: string, optionIndex: number) => (
                      <div
                        key={optionIndex}
                        className={`p-3 border rounded-lg ${
                          optionIndex === mcq.correctAnswer
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          <span className="text-sm">{option}</span>
                          {optionIndex === mcq.correctAnswer && (
                            <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {generationSettings.includeExplanations && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-1">
                        Explanation:
                      </h5>
                      <p className="text-sm text-blue-800">
                        The correct answer is{" "}
                        {String.fromCharCode(65 + mcq.correctAnswer)}. This
                        concept is fundamental to understanding the topic.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
