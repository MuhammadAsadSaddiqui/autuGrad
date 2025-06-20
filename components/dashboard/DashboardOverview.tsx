"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Brain,
} from "lucide-react";

// Dummy data
const stats = [
  {
    title: "Total Content",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Generated MCQs",
    value: "156",
    change: "+23%",
    trend: "up",
    icon: FileText,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Students",
    value: "89",
    change: "+5%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Accuracy Rate",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "upload",
    title: "Data Structures PDF uploaded",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "generation",
    title: "Generated 15 MCQs from Algorithms chapter",
    time: "4 hours ago",
    status: "completed",
  },
  {
    id: 3,
    type: "upload",
    title: "Machine Learning slides uploaded",
    time: "1 day ago",
    status: "processing",
  },
  {
    id: 4,
    type: "generation",
    title: "Generated 20 MCQs from Database concepts",
    time: "2 days ago",
    status: "completed",
  },
];

const quickActions = [
  {
    title: "Upload New Content",
    description: "Add PDF, PPT, or text files to generate MCQs",
    icon: Upload,
    action: "upload",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    title: "Generate MCQs",
    description: "Create questions from existing content",
    icon: Brain,
    action: "generate",
    color: "bg-green-600 hover:bg-green-700",
  },
  {
    title: "View Analytics",
    description: "Check performance and usage statistics",
    icon: TrendingUp,
    action: "analytics",
    color: "bg-purple-600 hover:bg-purple-700",
  },
];

export default function DashboardOverview() {
  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // Add navigation logic here
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {activity.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          activity.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full h-auto p-4 flex flex-col items-start space-y-2"
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{action.title}</span>
                      </div>
                      <span className="text-sm text-gray-600 text-left">
                        {action.description}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Content Library Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">PDF Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">PowerPoint Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4</div>
              <div className="text-sm text-gray-600">Text Documents</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
