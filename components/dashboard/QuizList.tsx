// components/dashboard/QuizList.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useNotification } from "@/lib/context/NotificationContext";
import { PlayCircle, FileText, Clock } from "lucide-react";

interface MCQSet {
  id: number;
  name: string;
  description: string;
  status: string;
  totalQuestions: number;
  createdAt: string;
  content: {
    title: string;
    fileName: string;
    fileType: string;
  };
  _count: {
    questions: number;
  };
}

export default function QuizList() {
  const [mcqSets, setMcqSets] = useState<MCQSet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showError } = useNotification();

  useEffect(() => {
    fetchMCQSets();
  }, []);

  const fetchMCQSets = async () => {
    try {
      const response = await fetch("/api/quiz");
      if (response.ok) {
        const data = await response.json();
        setMcqSets(data);
      } else {
        showError("Failed to fetch quizzes");
      }
    } catch (error) {
      showError("Error fetching quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (mcqSetId: number) => {
    router.push(`/quiz/${mcqSetId}`);
  };

  const filteredMCQSets = mcqSets.filter(mcqSet =>
    mcqSet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mcqSet.content.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h2 className="text-2xl font-bold">Available Quizzes</h2>
          <p>Select a quiz to start practicing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm">Total Quizzes</p>
              <p className="text-xl font-bold">{mcqSets.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm">Total Questions</p>
              <p className="text-xl font-bold">
                {mcqSets.reduce((sum, set) => sum + set.totalQuestions, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm">PDF Quizzes</p>
              <p className="text-xl font-bold">
                {mcqSets.filter(set => set.content.fileType.toUpperCase() === "PDF").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex-1">
            <Input
              placeholder="Search quizzes by name or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredMCQSets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No quizzes available</h3>
              <p className="mb-4">
                {mcqSets.length === 0
                  ? "No quizzes have been created yet"
                  : "No quizzes match your search criteria"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMCQSets.map(mcqSet => (
              <Card key={mcqSet.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base line-clamp-2">{mcqSet.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        From: {mcqSet.content.title}
                      </p>
                    </div>
                    <div className="ml-2">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {mcqSet.content.fileType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>{mcqSet.totalQuestions} Questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>~{Math.ceil(mcqSet.totalQuestions * 1.5)} min</span>
                    </div>
                  </div>

                  {mcqSet.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {mcqSet.description}
                    </p>
                  )}

                  <div className="text-xs text-gray-500">
                    Created: {new Date(mcqSet.createdAt).toLocaleDateString()}
                  </div>

                  <Button 
                    onClick={() => handleStartQuiz(mcqSet.id)}
                    className="w-full"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}