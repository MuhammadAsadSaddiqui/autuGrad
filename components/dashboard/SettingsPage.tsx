"use client";

import { signOut } from "next-auth/react";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    institution: "",
  });

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "export", label: "Data Export" },
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2">Full Name</label>
          <Input
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Email</label>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Phone</label>
          <Input
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Department</label>
          <Input
            value={profile.department}
            onChange={(e) => setProfile({ ...profile, department: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-2">Institution</label>
          <Input
            value={profile.institution}
            onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm mb-2">Current Password</label>
            <Input type="password" placeholder="Enter current password" />
          </div>
          <div>
            <label className="block text-sm mb-2">New Password</label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div>
            <label className="block text-sm mb-2">Confirm New Password</label>
            <Input type="password" placeholder="Confirm new password" />
          </div>
          <Button>Update Password</Button>
        </div>
      </div>
    </div>
  );

  const renderDataExport = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Export Your Data</h3>
        <p className="text-gray-600 mb-6">Download your data in various formats for backup or migration purposes.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">MCQ Sets Export</h4>
              <p className="text-sm text-gray-600 mb-4">Export all your generated MCQ sets</p>
              <Button variant="outline" className="w-full">Export as JSON</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Content Library Export</h4>
              <p className="text-sm text-gray-600 mb-4">Export your uploaded content metadata</p>
              <Button variant="outline" className="w-full">Export as CSV</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Analytics Data</h4>
              <p className="text-sm text-gray-600 mb-4">Export your usage and performance analytics</p>
              <Button variant="outline" className="w-full">Export as PDF</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Complete Backup</h4>
              <p className="text-sm text-gray-600 mb-4">Full backup of all your data</p>
              <Button variant="outline" className="w-full">Create Backup</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Data Import</h3>
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Import Data</h4>
            <p className="text-sm text-gray-600 mb-4">Import MCQ sets or content from external sources</p>
            <Button variant="outline">Import Data</Button>
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
      case "export":
        return renderDataExport();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{tabs.find((tab) => tab.id === activeTab)?.label}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTabContent()}

              <div className="border-t pt-6 mt-6">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => signOut()}>Logout</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}