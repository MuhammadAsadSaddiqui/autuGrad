"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import ContentLibrary from "@/components/dashboard/ContentLibrary";
import MCQGenerator from "@/components/dashboard/MCQGenerator";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import StudentsManagement from "@/components/dashboard/StudentsManagement";
import GeneratedMCQsLibrary from "@/components/dashboard/GeneratedMCQsLibrary";
import SettingsPage from "@/components/dashboard/SettingsPage";

export default function MainDashboard() {
  const searchParams = useSearchParams();

  const currentPage = searchParams.get("page") || "overview";

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "overview":
        return <DashboardOverview />;
      case "content":
        return <ContentLibrary />;
      case "mcq-generator":
        return <MCQGenerator />;
      case "generated-mcqs":
        return <GeneratedMCQsLibrary />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "students":
        return <StudentsManagement />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage}>
      {renderCurrentPage()}
    </DashboardLayout>
  );
}
