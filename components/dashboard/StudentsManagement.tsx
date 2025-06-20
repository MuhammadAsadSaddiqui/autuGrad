"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Award,
  BarChart3,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

// Dummy student data
const studentsData = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    phone: "+1 234-567-8901",
    enrollmentDate: "2024-01-15",
    totalQuizzes: 12,
    averageScore: 92.5,
    lastActivity: "2 hours ago",
    status: "active",
    department: "Computer Science",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@email.com",
    phone: "+1 234-567-8902",
    enrollmentDate: "2024-01-10",
    totalQuizzes: 15,
    averageScore: 88.3,
    lastActivity: "1 day ago",
    status: "active",
    department: "AI/ML",
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol.davis@email.com",
    phone: "+1 234-567-8903",
    enrollmentDate: "2024-01-08",
    totalQuizzes: 18,
    averageScore: 95.7,
    lastActivity: "3 hours ago",
    status: "active",
    department: "Database",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1 234-567-8904",
    enrollmentDate: "2024-01-05",
    totalQuizzes: 8,
    averageScore: 76.2,
    lastActivity: "1 week ago",
    status: "inactive",
    department: "Software Engineering",
  },
  {
    id: 5,
    name: "Emma Thompson",
    email: "emma.thompson@email.com",
    phone: "+1 234-567-8905",
    enrollmentDate: "2024-01-12",
    totalQuizzes: 10,
    averageScore: 91.8,
    lastActivity: "5 hours ago",
    status: "active",
    department: "Computer Science",
  },
];

const departments = [
  "All",
  "Computer Science",
  "AI/ML",
  "Database",
  "Software Engineering",
];
const statusOptions = ["All", "Active", "Inactive"];

export default function StudentsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || student.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "All" ||
      student.status === selectedStatus.toLowerCase();
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Students Management
          </h2>
          <p className="text-gray-600">
            Manage student accounts and track their performance
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentsData.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentsData.filter((s) => s.status === "active").length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Score
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(
                    studentsData.reduce((sum, s) => sum + s.averageScore, 0) /
                    studentsData.length
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Quizzes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentsData.reduce((sum, s) => sum + s.totalQuizzes, 0)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-900">
                    Student
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Department
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Quizzes
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Avg Score
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Last Activity
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {student.email}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {student.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-gray-900">
                        {student.department}
                      </span>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Enrolled: {student.enrollmentDate}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-lg font-bold text-gray-900">
                        {student.totalQuizzes}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-lg font-bold ${getPerformanceColor(student.averageScore)}`}
                      >
                        {student.averageScore}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">
                        {student.lastActivity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add New Student</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input placeholder="Enter student name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input type="email" placeholder="Enter email address" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <Input placeholder="Enter phone number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">Select Department</option>
                  {departments.slice(1).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1">Add Student</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
