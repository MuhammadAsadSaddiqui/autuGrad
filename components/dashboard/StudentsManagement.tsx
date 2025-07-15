"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/lib/context/NotificationContext";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  totalQuizzes: number;
  department: string;
  createdAt: string;
  updatedAt: string;
}

interface NewStudent {
  name: string;
  email: string;
  phone: string;
  department: string;
}

const departments = [
  "Computer Science",
  "AI/ML",
  "Database",
  "Software Engineering",
  "Data Science",
  "Cybersecurity",
  "Other"
];

export default function StudentsManagement() {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStudent, setNewStudent] = useState<NewStudent>({
    name: "",
    email: "",
    phone: "",
    department: "",
  });
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchStudentsData();
  }, []);

  const fetchStudentsData = async () => {
    try {
      const response = await fetch("/api/students");
      if (response.ok) {
        const data = await response.json();
        setStudentsData(data);
      } else {
        showError("Failed to fetch students data");
      }
    } catch  {
      showError("Error fetching students data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.phone || !newStudent.department) {
      showError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStudent.email)) {
      showError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess("Student added successfully");
        setShowAddModal(false);
        setNewStudent({ name: "", email: "", phone: "", department: "" });
        fetchStudentsData();
      } else {
        showError(result.message || "Failed to add student");
      }
    } catch {
      showError("Error adding student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showSuccess("Student deleted successfully");
        fetchStudentsData();
      } else {
        showError("Failed to delete student");
      }
    } catch {
      showError("Error deleting student");
    }
  };

  const openViewModal = (student: Student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
        selectedDepartment === "All" || student.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold">Students Management</h2>
            <p>Manage student accounts and track their performance</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>Add Student</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm">Total Students</p>
                <p className="text-xl font-bold">{studentsData.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm">Total Quizzes</p>
                <p className="text-xl font-bold">
                  {studentsData.reduce((sum, s) => sum + s.totalQuizzes, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <Input
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-3 py-2 border rounded text-sm"
                >
                  <option value="All">All Departments</option>
                  {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students List</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">No students found</h3>
                  <p>
                    {studentsData.length === 0
                        ? "Add your first student to get started"
                        : "No students match your search criteria"}
                  </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Student</th>
                      <th className="text-left p-4">Department</th>
                      <th className="text-left p-4">Quizzes</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-gray-600">{student.email}</div>
                              <div className="text-sm text-gray-600">{student.phone}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{student.department}</span>
                            <div className="text-sm text-gray-600">
                              Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-lg font-bold">{student.totalQuizzes}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => openViewModal(student)}>
                                View
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteStudent(student.id)}>
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </CardContent>
        </Card>

        {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Add New Student</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Full Name</label>
                    <Input
                        placeholder="Enter student name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Email</label>
                    <Input
                        type="email"
                        placeholder="Enter email address"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Phone</label>
                    <Input
                        placeholder="Enter phone number"
                        value={newStudent.phone}
                        onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Department</label>
                    <select
                        className="w-full px-3 py-2 border rounded"
                        value={newStudent.department}
                        onChange={(e) => setNewStudent({...newStudent, department: e.target.value})}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleAddStudent} disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Student"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
        )}

        {showViewModal && selectedStudent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Student Details</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setShowViewModal(false)}>
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm">Name</label>
                      <p className="text-sm">{selectedStudent.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm">Email</label>
                      <p className="text-sm">{selectedStudent.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm">Phone</label>
                      <p className="text-sm">{selectedStudent.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm">Department</label>
                      <p className="text-sm">{selectedStudent.department}</p>
                    </div>
                    <div>
                      <label className="block text-sm">Enrollment Date</label>
                      <p className="text-sm">{new Date(selectedStudent.enrollmentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm">Total Quizzes</label>
                      <p className="text-lg font-bold">{selectedStudent.totalQuizzes}</p>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => setShowViewModal(false)}>
                    Close
                  </Button>
                </CardContent>
              </Card>
            </div>
        )}
      </div>
  );
}