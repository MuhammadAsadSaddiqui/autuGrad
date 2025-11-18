"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Brain,
  Users,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalContent: number;
  totalMCQs: number;
  totalStudents: number;
  contentByType: {
    pdf: number;
    pptx: number;
  };
}

interface RecentActivity {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  type: "content" | "mcq" | "student";
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContent: 0,
    totalMCQs: 0,
    totalStudents: 0,
    contentByType: { pdf: 0, pptx: 0 },
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activityResponse] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/recent-activity"),
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Upload New Content",
      description: "Add PDF, PPT, or text files to generate MCQs",
      action: "upload",
      icon: Upload,
      color: "text-blue-600",
    },
    {
      title: "Generate MCQs",
      description: "Create questions from existing content",
      action: "generate",
      icon: Brain,
      color: "text-green-600",
    },
    {
      title: "Add Students",
      description: "Manage your student database",
      action: "students",
      icon: Users,
      color: "text-purple-600",
    },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "upload":
        router.push("/dashboard?page=content");
        break;
      case "generate":
        router.push("/dashboard?page=mcq-generator");
        break;
      case "students":
        router.push("/dashboard?page=students");
        break;
      default:
        console.log(`Quick action: ${action}`);
    }
  };

  const getActivityIcon = (type: string, status: string) => {
    if (status === "generating")
      return <Clock className="h-4 w-4 text-yellow-600" />;
    if (status === "failed")
      return <XCircle className="h-4 w-4 text-red-600" />;
    if (status === "completed")
      return <CheckCircle className="h-4 w-4 text-green-600" />;

    switch (type) {
      case "content":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "mcq":
        return <Brain className="h-4 w-4 text-green-600" />;
      case "student":
        return <Users className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "generating":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your MCQ generation system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Content</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalContent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Generated MCQs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalMCQs}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalStudents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activity</p>
                  <p className="text-sm text-gray-500">
                    Start by uploading content or generating MCQs
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {getActivityIcon(activity.type, activity.status)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTimeAgo(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50 border-2 hover:border-gray-300 transition-all"
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <IconComponent className={`h-6 w-6 ${action.color}`} />
                      <div className="text-center space-y-1">
                        <div className="font-semibold text-gray-900 text-sm">
                          {action.title}
                        </div>
                        <div className="text-xs text-gray-600 leading-tight">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Library Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Content Library Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.contentByType.pdf}
              </div>
              <div className="text-sm text-blue-700 font-medium">
                PDF Documents
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {stats.contentByType.pptx}
              </div>
              <div className="text-sm text-orange-700 font-medium">
                PowerPoint Files
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalMCQs}
              </div>
              <div className="text-sm text-green-700 font-medium">
                Total MCQs Generated
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
