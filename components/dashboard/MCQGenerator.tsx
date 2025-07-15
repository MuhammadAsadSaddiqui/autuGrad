"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Settings, AlertCircle, Brain } from "lucide-react";

export default function MCQGenerator() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900">MCQ Generator</h2>
        <p className="text-gray-600">
          Generate multiple-choice questions from your content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
        <div className="lg:col-span-2 space-y-6">
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4 p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="p-3 rounded-full bg-blue-100">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Upload your content
                  </h3>
                  <p className="text-sm text-gray-500">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports PDF, PPT, DOCX, TXT (Max 10MB)
                  </p>
                </div>
                <Button className="w-fit">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>

          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Questions
                </label>
                <Input
                  type="number"
                  placeholder="Enter number of questions"
                  defaultValue={5}
                  min={1}
                  max={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="mixed">Mixed</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
           
            </CardContent>
          </Card>

          
          <Button className="w-full" size="lg">
            <Brain className="h-5 w-5 mr-2" />
            Generate MCQs
          </Button>
        </div>

       
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Tips & Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3  rounded-lg">
                
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">
                    Supported Formats
                  </h4>
                  <ul className="mt-2 text-sm text-gray-600 space-y-2">
                    <li>• PDF Documents</li>
                    <li>• PowerPoint Presentations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
