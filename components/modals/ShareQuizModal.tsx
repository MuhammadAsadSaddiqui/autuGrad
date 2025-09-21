// components/modals/ShareQuizModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/lib/context/NotificationContext";
import { Search, Send, Check, Clock, User, Mail } from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
  phone: string;
}

interface MCQSet {
  id: number;
  name: string;
  description: string;
  totalQuestions: number;
}

interface ShareQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  mcqSet: MCQSet;
}

export default function ShareQuizModal({
  isOpen,
  onClose,
  mcqSet,
}: ShareQuizModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } else {
        showError("Failed to fetch students");
      }
    } catch (error) {
      showError("Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = (studentId: number) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const selectAll = () => {
    setSelectedStudents(new Set(filteredStudents.map((s) => s.id)));
  };

  const clearSelection = () => {
    setSelectedStudents(new Set());
  };

  const handleShare = async () => {
    if (selectedStudents.size === 0) {
      showError("Please select at least one student");
      return;
    }

    setSharing(true);
    try {
      const response = await fetch("/api/quiz/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mcqSetId: mcqSet.id,
          studentIds: Array.from(selectedStudents),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(
          `Quiz shared successfully with ${selectedStudents.size} students`,
        );
        onClose();
        setSelectedStudents(new Set());
        setSearchTerm("");
      } else {
        showError(result.error || "Failed to share quiz");
      }
    } catch (error) {
      showError("Error sharing quiz");
    } finally {
      setSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Share Quiz</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Quiz: {mcqSet.name} ({mcqSet.totalQuestions} questions)
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading students...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search and Actions */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    Select All ({filteredStudents.length})
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    Clear Selection
                  </Button>
                </div>
              </div>

              {/* Selection Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    <strong>{selectedStudents.size}</strong> students selected
                  </span>
                  <div className="flex items-center text-sm text-blue-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Estimated time: {mcqSet.totalQuestions} minutes
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div className="border rounded-lg">
                <div className="max-h-80 overflow-y-auto">
                  {filteredStudents.length === 0 ? (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {students.length === 0
                          ? "No students found"
                          : "No students match your search"}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredStudents.map((student) => (
                        <div
                          key={student.id}
                          className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                            selectedStudents.has(student.id)
                              ? "bg-blue-50 border-blue-200"
                              : ""
                          }`}
                          onClick={() => toggleStudent(student.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                                  selectedStudents.has(student.id)
                                    ? "bg-blue-600 border-blue-600"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedStudents.has(student.id) && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {student.name}
                                </h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {student.email}
                                  </div>
                                  <span>•</span>
                                  <span>{student.department}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quiz Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">
                  Quiz Instructions for Students:
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>
                    • Each student will receive a unique quiz code via email
                  </li>
                  <li>
                    • Quiz codes are valid for 7 days and can only be used once
                  </li>
                  <li>• Each question has a 1-minute time limit</li>
                  <li>
                    • Quiz will be in secure mode - no other tabs can be opened
                  </li>
                  <li>• Students must complete the quiz in one session</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={onClose} disabled={sharing}>
                  Cancel
                </Button>
                <Button
                  onClick={handleShare}
                  disabled={selectedStudents.size === 0 || sharing}
                  className="min-w-32"
                >
                  {sharing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Share Quiz ({selectedStudents.size})
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
