"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  { title: "Total Content", value: "24" },
  { title: "Generated MCQs", value: "156" },
  { title: "Students", value: "89" },
];

const recentActivity = [
  { id: 1, title: "Psychology PDF uploaded", status: "completed" },
  { id: 2, title: "Generated 15 MCQs from Communication chapter", status: "completed" },
  { id: 3, title: "Information Security slides uploaded", status: "completed" },
  { id: 4, title: "Generated 20 MCQs from English concepts", status: "completed" },
];

const quickActions = [
  { title: "Upload New Content", description: "Add PDF, PPT, or text files to generate MCQs", action: "upload" },
  { title: "Generate MCQs", description: "Create questions from existing content", action: "generate" },
  { title: "View Analytics", description: "Check performance and usage statistics", action: "analytics" },
];

export default function DashboardOverview() {
  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div>
                <p className="text-sm">{stat.title}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded bg-gray-100">{activity.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">View All Activity</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-start space-y-2"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <span className="font-medium">{action.title}</span>
                    <span className="text-sm text-left">{action.description}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Library Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">2</div>
              <div className="text-sm">PDF Documents</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">3</div>
              <div className="text-sm">PowerPoint Files</div>
            </div>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}