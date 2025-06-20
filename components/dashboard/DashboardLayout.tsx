"use client";

import React, { useState } from "react";
import {
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  Menu,
  X,
  Home,
  Users,
  Brain,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const sidebarItems = [
  { id: "overview", label: "Overview", icon: Home, href: "/dashboard" },
  {
    id: "content",
    label: "Content Library",
    icon: BookOpen,
    href: "/dashboard/content",
  },
  {
    id: "mcq-generator",
    label: "MCQ Generator",
    icon: Brain,
    href: "/dashboard/generate",
  },
  {
    id: "generated-mcqs",
    label: "Generated MCQs",
    icon: FileText,
    href: "/dashboard/mcqs",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
  },
  {
    id: "students",
    label: "Students",
    icon: Users,
    href: "/dashboard/students",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export default function DashboardLayout({
  children,
  currentPage,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const setCurrentPage = (page: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Autograd</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  console.log(`Switching to: ${item.id}`); // Debug log
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 mt-1 text-sm font-medium rounded-lg transition-colors text-left ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile at bottom of sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">T</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                Teacher
              </p>
              <p className="text-xs text-gray-500 truncate">john.doe@edu.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {sidebarItems.find((item) => item.id === currentPage)?.label ||
                "Dashboard"}
            </h1>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">T</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
