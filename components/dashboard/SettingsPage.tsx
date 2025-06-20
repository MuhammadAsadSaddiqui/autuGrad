"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Lock,
  Bell,
  Database,
  Shield,
  Download,
  Upload,
  Save,
  Key,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    newFeatures: true,
  });

  const [profile, setProfile] = useState({
    fullName: "Dr. John Doe",
    email: "john.doe@university.edu",
    phone: "+1 234-567-8900",
    department: "Computer Science",
    institution: "Tech University",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "ai-settings", label: "AI Settings", icon: Database },
    { id: "export", label: "Data Export", icon: Download },
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <Input
            value={profile.fullName}
            onChange={(e) =>
              setProfile({ ...profile, fullName: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <Input
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <Input
            value={profile.department}
            onChange={(e) =>
              setProfile({ ...profile, department: e.target.value })
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institution
          </label>
          <Input
            value={profile.institution}
            onChange={(e) =>
              setProfile({ ...profile, institution: e.target.value })
            }
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Profile Picture
        </h3>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-medium">JD</span>
          </div>
          <div>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload New Picture
            </Button>
            <p className="text-sm text-gray-600 mt-1">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Change Password
        </h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <Input type="password" placeholder="Enter current password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <Input type="password" placeholder="Confirm new password" />
          </div>
          <Button>Update Password</Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Two-Factor Authentication
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Enable 2FA</h4>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Setup 2FA
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">
                  API Key for External Integration
                </h4>
                <p className="text-sm text-gray-600 font-mono">
                  ak_1234567890abcdef...
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Regenerate
                </Button>
                <Button variant="outline" size="sm">
                  Copy
                </Button>
              </div>
            </div>
          </div>
          <Button variant="outline">
            <Key className="h-4 w-4 mr-2" />
            Generate New API Key
          </Button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Email Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">
                Receive notifications via email
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  emailNotifications: e.target.checked,
                })
              }
              className="h-4 w-4 text-blue-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Weekly Reports</h4>
              <p className="text-sm text-gray-600">
                Get weekly analytics reports
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weeklyReports}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  weeklyReports: e.target.checked,
                })
              }
              className="h-4 w-4 text-blue-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">New Features</h4>
              <p className="text-sm text-gray-600">
                Be notified about new features and updates
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.newFeatures}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  newFeatures: e.target.checked,
                })
              }
              className="h-4 w-4 text-blue-600"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Push Notifications
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">
                Receive push notifications on your devices
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.pushNotifications}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  pushNotifications: e.target.checked,
                })
              }
              className="h-4 w-4 text-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          MCQ Generation Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Number of Questions
            </label>
            <Input type="number" defaultValue="10" min="1" max="50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Difficulty
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="mixed">Mixed</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                Include Explanations by Default
              </h4>
              <p className="text-sm text-gray-600">
                Auto-generate explanations for answers
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          AI Model Configuration
        </h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Database className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Llama 3.2 3B Model</h4>
          </div>
          <p className="text-sm text-blue-800 mb-3">
            Fine-tuned for educational content and MCQ generation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Model Version:</span> 3.2.1
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> Jan 15, 2024
            </div>
            <div>
              <span className="font-medium">Accuracy:</span> 94.2%
            </div>
            <div>
              <span className="font-medium">Avg Response Time:</span> 1.2s
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Content Processing
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                Auto-process uploaded content
              </h4>
              <p className="text-sm text-gray-600">
                Automatically extract text and prepare for MCQ generation
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                Content quality validation
              </h4>
              <p className="text-sm text-gray-600">
                Check content quality before processing
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataExport = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Export Your Data
        </h3>
        <p className="text-gray-600 mb-6">
          Download your data in various formats for backup or migration
          purposes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                MCQ Sets Export
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Export all your generated MCQ sets
              </p>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Content Library Export
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Export your uploaded content metadata
              </p>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">Analytics Data</h4>
              <p className="text-sm text-gray-600 mb-4">
                Export your usage and performance analytics
              </p>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Complete Backup
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Full backup of all your data
              </p>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Create Backup
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Import</h3>
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">Import Data</h4>
            <p className="text-sm text-gray-600 mb-4">
              Import MCQ sets or content from external sources
            </p>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings();
      case "security":
        return renderSecuritySettings();
      case "notifications":
        return renderNotificationSettings();
      case "ai-settings":
        return renderAISettings();
      case "export":
        return renderDataExport();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {(() => {
                  const currentTab = tabs.find((tab) => tab.id === activeTab);
                  if (currentTab?.icon) {
                    const Icon = currentTab.icon;
                    return <Icon className="h-5 w-5 mr-2" />;
                  }
                  return null;
                })()}
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTabContent()}

              {/* Save Button */}
              <div className="border-t pt-6 mt-6">
                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
