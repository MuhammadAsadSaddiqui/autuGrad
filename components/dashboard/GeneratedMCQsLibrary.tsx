"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mcqsData = [
  { id: 1, title: "Information Security", subject: "Computer Science", questionsCount: 15, createdDate: "2024-01-15", source: "Information_security.pdf" },
  { id: 2, title: "Psychology", subject: "AI/ML", questionsCount: 12, createdDate: "2024-01-14", source: "psychology_slide.ppt" }
];

export default function GeneratedMCQsLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const filteredMCQs = mcqsData.filter(mcq => 
    mcq.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (selectedSubject === "All" || mcq.subject === selectedSubject)
  );

  const getDifficultyColor = (difficulty: string) => "bg-gray-100 text-gray-800";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div><h2 className="text-2xl font-bold">Generated MCQs Library</h2><p>Manage and organize your generated MCQ sets</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardContent className="p-4"><div><p className="text-sm">Total MCQ Sets</p><p className="text-xl font-bold">{mcqsData.length}</p></div></CardContent></Card>
        <Card><CardContent className="p-4"><div><p className="text-sm">Total Questions</p><p className="text-xl font-bold">{mcqsData.reduce((sum, mcq) => sum + mcq.questionsCount, 0)}</p></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-1"><Input placeholder="Search MCQ sets by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <div className="flex space-x-2">
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="px-3 py-2 border rounded text-sm">{["All", "Computer Science", "AI/ML"].map(subject => <option key={subject} value={subject}>{subject}</option>)}</select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMCQs.map(mcq => (
          <Card key={mcq.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{mcq.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Subject:</span><span className="font-medium">{mcq.subject}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Questions:</span><span className="font-medium">{mcq.questionsCount}</span>
              </div>
              <div className="text-xs text-gray-500">
                <p>Source: {mcq.source}</p>
                <p>Created: {mcq.createdDate}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">Export</Button>
                <Button variant="outline" size="sm" className="flex-1">Share</Button>
                <Button variant="outline" size="sm" className="flex-1">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}