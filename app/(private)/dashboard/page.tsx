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
  let pageComponent;

  const renderCurrentPage = () => {
    if (currentPage === "overview") {pageComponent = <DashboardOverview />;
    } else if (currentPage === "content") {
            pageComponent = <ContentLibrary />;
    } else if (currentPage === "mcq-generator") {
       pageComponent = <MCQGenerator />;
    }   else if (currentPage === "generated-mcqs") {
            pageComponent = <GeneratedMCQsLibrary />;
    }
    else if (currentPage === "analytics") {
        pageComponent = <AnalyticsDashboard />;
    }   else if (currentPage === "students") {


      pageComponent = <StudentsManagement />;
    } else if (currentPage === "settings") {

      pageComponent = <SettingsPage />;
    }   else {

      pageComponent = <DashboardOverview />;
    }

      return pageComponent;
  };

  return (
      <DashboardLayout currentPage={currentPage}>
            {renderCurrentPage()}
      </DashboardLayout>
  );
}