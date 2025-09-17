"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/lib/context/NotificationContext";

interface ContentItem {
  id: number;
  title: string;
  fileName: string;
  fileType: string;
  filePath: string;
  fileSize: number;
  uploadDate: string;
  mcqsGenerated: number;
  status: string;
  userId: number;
}

export default function MCQGenerator() {
  const [contentData, setContentData] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<number | null>(null);
  const [mcqSetName, setMcqSetName] = useState("");
  const [mcqSetDescription, setMcqSetDescription] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchContentData();
  }, []);

  const fetchContentData = async () => {
    try {
      const response = await fetch("/api/content");
      if (response.ok) {
        const data = await response.json();
        // Only show completed content that can be used for MCQ generation
        const completedContent = data.filter(
          (item: ContentItem) =>
            item.status === "processed" || item.status === "completed",
        );
        setContentData(completedContent);
      } else {
        showError("Failed to fetch content data");
      }
    } catch {
      showError("Error fetching content data");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMCQs = async () => {
    if (!selectedContent) {
      showError("Please select content to generate MCQs from");
      return;
    }

    if (!mcqSetName.trim()) {
      showError("Please enter a name for the MCQ set");
      return;
    }

    if (numQuestions < 1 || numQuestions > 20) {
      showError("Number of questions must be between 1 and 20");
      return;
    }

    setIsGenerating(true);

    try {
      // First create the MCQ set
      const createSetResponse = await fetch("/api/mcq/sets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: mcqSetName.trim(),
          description: mcqSetDescription.trim() || null,
          contentId: selectedContent,
        }),
      });

      if (!createSetResponse.ok) {
        const error = await createSetResponse.json();
        throw new Error(error.error || "Failed to create MCQ set");
      }

      const mcqSet = await createSetResponse.json();

      // Then start the MCQ generation process
      const generateResponse = await fetch("/api/mcq/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mcqSetId: mcqSet.id,
          numQuestions,
        }),
      });

      if (!generateResponse.ok) {
        const error = await generateResponse.json();
        throw new Error(error.error || "Failed to start MCQ generation");
      }

      const result = await generateResponse.json();

      showSuccess(
        `MCQ generation started successfully! Set "${mcqSetName}" is being processed. Check the Generated MCQs page for updates.`,
      );

      // Reset form
      setMcqSetName("");
      setMcqSetDescription("");
      setSelectedContent(null);
      setNumQuestions(5);
    } catch (error: any) {
      showError(error.message || "Failed to generate MCQs");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedContentItem = contentData.find(
    (item) => item.id === selectedContent,
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
      <div>
        <h2 className="text-2xl font-bold">MCQ Generator</h2>
        <p>Generate multiple choice questions from your uploaded content</p>
      </div>

      {contentData.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No Content Available</h3>
            <p className="mb-4">
              You need to upload and process content before generating MCQs.
            </p>
            <Button
              onClick={() => (window.location.href = "/dashboard?page=content")}
            >
              Go to Content Library
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {contentData.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedContent === item.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedContent(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-500">
                          {item.fileType} • {Math.round(item.fileSize / 1024)}{" "}
                          KB
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">
                          {item.mcqsGenerated} MCQs generated
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* MCQ Generation Settings */}
          <Card>
            <CardHeader>
              <CardTitle>MCQ Set Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  MCQ Set Name *
                </label>
                <Input
                  placeholder="e.g., Information Security Quiz"
                  value={mcqSetName}
                  onChange={(e) => setMcqSetName(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (Optional)
                </label>
                <Input
                  placeholder="Brief description of the MCQ set"
                  value={mcqSetDescription}
                  onChange={(e) => setMcqSetDescription(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Questions
                </label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={numQuestions}
                  onChange={(e) =>
                    setNumQuestions(parseInt(e.target.value) || 5)
                  }
                  disabled={isGenerating}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 5-10 questions per set
                </p>
              </div>

              {selectedContentItem && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">
                    Selected Content:
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedContentItem.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedContentItem.fileType} •
                    {new Date(
                      selectedContentItem.uploadDate,
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}

              <Button
                onClick={handleGenerateMCQs}
                disabled={
                  !selectedContent || !mcqSetName.trim() || isGenerating
                }
                className="w-full"
              >
                {isGenerating ? "Generating MCQs..." : "Generate MCQs"}
              </Button>

              {isGenerating && (
                <div className="text-center text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  This may take a few minutes. You can check progress in the
                  Generated MCQs section.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Better MCQs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Content Quality</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Use well-structured documents</li>
                <li>• Ensure content has clear concepts</li>
                <li>• Avoid heavily formatted text</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Question Settings</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Start with 5-10 questions</li>
                <li>• Use descriptive set names</li>
                <li>• Add descriptions for organization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
