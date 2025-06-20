"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  Calendar,
  User,
} from "lucide-react";

// Dummy data for content library
const contentData = [
  {
    id: 1,
    title: "Introduction to Data Structures",
    type: "PDF",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    uploadedBy: "John Doe",
    mcqsGenerated: 25,
    status: "processed",
    subject: "Computer Science",
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    type: "PPT",
    size: "5.2 MB",
    uploadDate: "2024-01-14",
    uploadedBy: "Jane Smith",
    mcqsGenerated: 18,
    status: "processed",
    subject: "AI/ML",
  },
  {
    id: 3,
    title: "Database Management Systems",
    type: "PDF",
    size: "3.8 MB",
    uploadDate: "2024-01-13",
    uploadedBy: "Mike Johnson",
    mcqsGenerated: 32,
    status: "processed",
    subject: "Database",
  },
  {
    id: 4,
    title: "Algorithms and Complexity",
    type: "PDF",
    size: "4.1 MB",
    uploadDate: "2024-01-12",
    uploadedBy: "Sarah Wilson",
    mcqsGenerated: 0,
    status: "processing",
    subject: "Computer Science",
  },
  {
    id: 5,
    title: "Neural Networks Overview",
    type: "PPT",
    size: "6.7 MB",
    uploadDate: "2024-01-11",
    uploadedBy: "Alex Brown",
    mcqsGenerated: 22,
    status: "processed",
    subject: "AI/ML",
  },
  {
    id: 6,
    title: "Software Engineering Principles",
    type: "TXT",
    size: "1.2 MB",
    uploadDate: "2024-01-10",
    uploadedBy: "Emily Davis",
    mcqsGenerated: 15,
    status: "processed",
    subject: "Software Engineering",
  },
];

const subjects = [
  "All",
  "Computer Science",
  "AI/ML",
  "Database",
  "Software Engineering",
];
const fileTypes = ["All", "PDF", "PPT", "TXT"];

export default function ContentLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedFileType, setSelectedFileType] = useState("All");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredContent = contentData.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === "All" || item.subject === selectedSubject;
    const matchesFileType =
      selectedFileType === "All" || item.type === selectedFileType;
    return matchesSearch && matchesSubject && matchesFileType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return "📄";
      case "PPT":
        return "📊";
      case "TXT":
        return "📝";
      default:
        return "📄";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Library</h2>
          <p className="text-gray-600">
            Manage your uploaded content and generate MCQs
          </p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="w-fit">
          <Upload className="h-4 w-4 mr-2" />
          Upload Content
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search content..."
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
                value={selectedFileType}
                onChange={(e) => setSelectedFileType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {fileTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((content) => (
          <Card key={content.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getFileIcon(content.type)}</span>
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {content.title}
                    </CardTitle>
                    <p className="text-xs text-gray-500">{content.subject}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{content.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Size:</span>
                <span className="font-medium">{content.size}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">MCQs Generated:</span>
                <span className="font-medium">{content.mcqsGenerated}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}
                >
                  {content.status}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{content.uploadDate}</span>
                <span>•</span>
                <User className="h-3 w-3" />
                <span>{content.uploadedBy}</span>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={content.status !== "processed"}
                >
                  Generate MCQs
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Download
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

      {/* Upload Modal (simplified for demonstration) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Upload New Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600">
                  Drag and drop your files here, or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Supports PDF, PPT, and TXT files
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1">Upload</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {contentData.length}
            </div>
            <div className="text-sm text-gray-600">Total Files</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {contentData.reduce((sum, item) => sum + item.mcqsGenerated, 0)}
            </div>
            <div className="text-sm text-gray-600">MCQs Generated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {contentData.filter((item) => item.status === "processed").length}
            </div>
            <div className="text-sm text-gray-600">Processed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {contentData
                .reduce((sum, item) => sum + parseFloat(item.size), 0)
                .toFixed(1)}{" "}
              MB
            </div>
            <div className="text-sm text-gray-600">Total Size</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
