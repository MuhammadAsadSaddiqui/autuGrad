"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/lib/context/NotificationContext";

interface ContentItem {
  id: number;
  title: string;
  fileName: string;
  fileType: string;
  filePath: string;
  fileSize: number;
  uploadDate: string;
  mcqsGenerated: number;
  userId: number;
}

export default function ContentLibrary() {
  const [contentData, setContentData] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("All");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const { showSuccess, showError } = useNotification();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => { fetchContentData(); }, []);

  const fetchContentData = async () => {
    try {
      const response = await fetch("/api/content");
      if (response.ok) {
        const data = await response.json();
        setContentData(data);
      } else {
        showError("Failed to fetch content data");
      }
    } catch { showError("Error fetching content data"); } finally { setLoading(false); }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    const validExtensions = ['pdf', 'ppt', 'pptx'];
    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension || '')) return showError("Only PDF and PPTX files are supported");
    if (file.size > 10 * 1024 * 1024) return showError("File size must be less than 10MB");
    setSelectedFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => e.target.files?.[0] && validateAndSetFile(e.target.files[0]);
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); e.dataTransfer.files.length && validateAndSetFile(e.dataTransfer.files[0]); };
  const triggerFileInput = () => fileInputRef.current?.click();

  const handleUpload = async () => {
    if (!selectedFile) return showError("Please select a file to upload");
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await fetch("/api/content/upload", { method: "POST", body: formData });
      const result = await response.json();
      if (response.ok) { showSuccess("File uploaded successfully"); setShowUploadModal(false); setSelectedFile(null); fetchContentData(); }
      else showError(result.message || "Upload failed");
    } catch { showError("Error uploading file"); } finally { setIsUploading(false); }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(`/api/content/download?path=${encodeURIComponent(filePath)}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none'; a.href = url; a.download = fileName;
        document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); document.body.removeChild(a);
        showSuccess("File downloaded successfully");
      } else showError("Failed to download file");
    } catch { showError("Error downloading file"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      const response = await fetch(`/api/content/${id}`, { method: "DELETE" });
      if (response.ok) { showSuccess("File deleted successfully"); fetchContentData(); }
      else showError("Failed to delete file");
    } catch { showError("Error deleting file"); }
  };

  const filteredContent = contentData.filter(item => 
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.fileName.toLowerCase().includes(searchTerm.toLowerCase())) && 
    (selectedFileType === "All" || item.fileType.toUpperCase() === selectedFileType)
  );

  const getStatusColor = (status: string) => "bg-gray-100 text-gray-800";
  const formatFileSize = (bytes: number) => bytes === 0 ? '0 Bytes' : (() => { const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]; })();

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div><h2 className="text-2xl font-bold">Content Library</h2><p>Manage your uploaded content and generate MCQs</p></div>
        <Button onClick={() => setShowUploadModal(true)}>Upload Content</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><div><p className="text-sm">Total Files</p><p className="text-xl font-bold">{contentData.length}</p></div></CardContent></Card>
        <Card><CardContent className="p-4"><div><p className="text-sm">PDF Files</p><p className="text-xl font-bold">{contentData.filter(item => item.fileType.toUpperCase() === 'PDF').length}</p></div></CardContent></Card>
        <Card><CardContent className="p-4"><div><p className="text-sm">PPTX Files</p><p className="text-xl font-bold">{contentData.filter(item => item.fileType.toUpperCase() === 'PPTX').length}</p></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-1"><Input placeholder="Search content..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <div><select value={selectedFileType} onChange={(e) => setSelectedFileType(e.target.value)} className="px-3 py-2 border rounded text-sm">{["All", "PDF", "PPTX"].map(type => <option key={type} value={type}>{type}</option>)}</select></div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredContent.length === 0 ? (
          <Card><CardContent className="p-8 text-center"><h3 className="text-lg font-medium mb-2">No content found</h3><p className="mb-4">{contentData.length === 0 ? "Upload your first file to get started" : "No files match your search criteria"}</p>{contentData.length === 0 && <Button onClick={() => setShowUploadModal(true)}>Upload Content</Button>}</CardContent></Card>
        ) : (
          filteredContent.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center"><span className="text-sm font-medium">{item.fileType.toUpperCase()}</span></div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{item.fileType.toUpperCase()}</span><span>•</span><span>{formatFileSize(item.fileSize)}</span><span>•</span><span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                        {item.mcqsGenerated > 0 && <><span>•</span><span className="text-green-600">{item.mcqsGenerated} MCQs generated</span></>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload(item.filePath, item.fileName)}>Download</Button>
                      <Button variant="outline" size="sm" onClick={() => console.log("Generate MCQs for", item.id)}>Generate MCQs</Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upload Content</CardTitle>
                <Button variant="outline" size="sm" onClick={() => { setShowUploadModal(false); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>Close</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={triggerFileInput}>
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto rounded bg-gray-100 flex items-center justify-center"><span className="text-sm font-medium">{selectedFile.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'PPTX'}</span></div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>Remove</Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className={`w-12 h-12 mx-auto rounded border-2 border-dashed flex items-center justify-center ${isDragOver ? 'border-blue-500' : 'border-gray-300'}`}><span className="text-xl">+</span></div>
                    <p className={`text-sm ${isDragOver ? 'text-blue-600' : 'text-gray-600'}`}>{isDragOver ? 'Drop your file here' : 'Click to select or drag and drop'}</p>
                    <p className="text-xs text-gray-400">PDF and PPTX files only (Max 10MB)</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={handleFileSelect} className="hidden" />
              <Button variant="outline" onClick={triggerFileInput} className="w-full">Choose File</Button>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" onClick={() => { setShowUploadModal(false); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} disabled={isUploading}>Cancel</Button>
                <Button className="flex-1" onClick={handleUpload} disabled={!selectedFile || isUploading}>{isUploading ? "Uploading..." : "Upload"}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}