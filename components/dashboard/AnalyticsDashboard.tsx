"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Clock,
  Target,
  Download,
  Calendar,
} from "lucide-react";

// Dummy analytics data
const analyticsData = {
  overview: {
    totalMCQs: 156,
    totalStudents: 89,
    avgAccuracy: 94.2,
    totalContent: 24,
    monthlyGrowth: {
      mcqs: 23,
      students: 12,
      accuracy: 2.1,
      content: 15,
    },
  },
  mcqsBySubject: [
    { subject: "Computer Science", count: 45, percentage: 28.8 },
    { subject: "AI/ML", count: 38, percentage: 24.4 },
    { subject: "Database", count: 32, percentage: 20.5 },
    { subject: "Software Engineering", count: 25, percentage: 16.0 },
    { subject: "Others", count: 16, percentage: 10.3 },
  ],
  mcqsByDifficulty: [
    { difficulty: "Easy", count: 52, percentage: 33.3 },
    { difficulty: "Medium", count: 78, percentage: 50.0 },
    { difficulty: "Hard", count: 26, percentage: 16.7 },
  ],
  weeklyActivity: [
    { day: "Mon", mcqs: 12, students: 15 },
    { day: "Tue", mcqs: 8, students: 22 },
    { day: "Wed", mcqs: 15, students: 18 },
    { day: "Thu", mcqs: 10, students: 25 },
    { day: "Fri", mcqs: 18, students: 20 },
    { day: "Sat", mcqs: 5, students: 8 },
    { day: "Sun", mcqs: 3, students: 5 },
  ],
  topPerformingContent: [
    { title: "Data Structures", mcqs: 25, accuracy: 96.5, students: 45 },
    { title: "Machine Learning", mcqs: 18, accuracy: 94.2, students: 38 },
    { title: "Database Systems", mcqs: 32, accuracy: 92.8, students: 42 },
    { title: "Algorithms", mcqs: 22, accuracy: 91.5, students: 35 },
  ],
  recentActivity: [
    {
      action: "MCQ Generated",
      content: "Neural Networks",
      time: "2 hours ago",
      count: 15,
    },
    {
      action: "Student Activity",
      content: "Data Structures Quiz",
      time: "4 hours ago",
      count: 12,
    },
    {
      action: "Content Uploaded",
      content: "Software Testing PDF",
      time: "1 day ago",
      count: 1,
    },
    {
      action: "MCQ Generated",
      content: "Database Concepts",
      time: "2 days ago",
      count: 20,
    },
  ],
};

export default function AnalyticsDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  const timeRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 3 months" },
    { value: "1y", label: "Last year" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Track your MCQ generation and student performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total MCQs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.overview.totalMCQs}
                </p>
                <p className="text-sm text-green-600">
                  +{analyticsData.overview.monthlyGrowth.mcqs}% this month
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
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
                  {analyticsData.overview.totalStudents}
                </p>
                <p className="text-sm text-green-600">
                  +{analyticsData.overview.monthlyGrowth.students}% this month
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Accuracy
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.overview.avgAccuracy}%
                </p>
                <p className="text-sm text-green-600">
                  +{analyticsData.overview.monthlyGrowth.accuracy}% this month
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Content Items
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.overview.totalContent}
                </p>
                <p className="text-sm text-green-600">
                  +{analyticsData.overview.monthlyGrowth.content}% this month
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MCQs by Subject */}
        <Card>
          <CardHeader>
            <CardTitle>MCQs by Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.mcqsBySubject.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {item.subject}
                      </span>
                      <span className="text-sm text-gray-600">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MCQs by Difficulty */}
        <Card>
          <CardHeader>
            <CardTitle>MCQs by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.mcqsByDifficulty.map((item, index) => {
                const colors = ["bg-green-600", "bg-yellow-600", "bg-red-600"];
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {item.difficulty}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${colors[index]} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.weeklyActivity.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full space-y-1">
                  <div
                    className="bg-blue-600 rounded-t"
                    style={{ height: `${(day.mcqs / 20) * 100}px` }}
                    title={`${day.mcqs} MCQs`}
                  />
                  <div
                    className="bg-green-600 rounded-t"
                    style={{ height: `${(day.students / 30) * 100}px` }}
                    title={`${day.students} Students`}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded mr-2" />
              <span className="text-sm text-gray-600">MCQs Generated</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded mr-2" />
              <span className="text-sm text-gray-600">Student Activity</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPerformingContent.map((content, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {content.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>{content.mcqs} MCQs</span>
                      <span>{content.accuracy}% Accuracy</span>
                      <span>{content.students} Students</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {content.accuracy}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                      {activity.count > 1 && (
                        <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {activity.count}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{activity.content}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-sm text-gray-600">
                Content Utilization Rate
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Most content is actively used
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">4.2s</div>
              <div className="text-sm text-gray-600">Avg Generation Time</div>
              <div className="text-xs text-gray-500 mt-1">
                Per MCQ generated
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
              <div className="text-sm text-gray-600">Student Satisfaction</div>
              <div className="text-xs text-gray-500 mt-1">
                Based on feedback
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
