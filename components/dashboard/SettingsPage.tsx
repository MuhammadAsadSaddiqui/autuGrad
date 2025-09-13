"use client";
import { signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/lib/context/NotificationContext";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    institution: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { showSuccess, showError } = useNotification();

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        showError("Failed to load profile");
      }
    } catch (error) {
      showError("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const data = await response.json();
        showSuccess("Profile updated successfully");
        setProfile(data.user);
      } else {
        const error = await response.json();
        showError(error.error || "Failed to update profile");
      }
    } catch (error) {
      showError("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/settings/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordForm),
      });

      if (response.ok) {
        showSuccess("Password updated successfully");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const error = await response.json();
        showError(error.error || "Failed to update password");
      }
    } catch (error) {
      showError("Error updating password");
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async (type: string, format: string = "json") => {
    try {
      const response = await fetch(
        `/api/settings/export?type=${type}&format=${format}`,
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        const extension = format === "csv" ? "csv" : "json";
        a.download = `${type}_export_${Date.now()}.${extension}`;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showSuccess(`${type} data exported successfully`);
      } else {
        showError("Failed to export data");
      }
    } catch (error) {
      showError("Error exporting data");
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-2">Full Name</label>
          <Input
            value={profile.fullName}
            onChange={(e) =>
              setProfile({ ...profile, fullName: e.target.value })
            }
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Email</label>
          <Input
            type="email"
            value={profile.email}
            disabled={true}
            className="bg-gray-50"
            title="Email cannot be changed"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Phone</label>
          <Input
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Department</label>
          <Input
            value={profile.department}
            onChange={(e) =>
              setProfile({ ...profile, department: e.target.value })
            }
            disabled={loading}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-2">Institution</label>
          <Input
            value={profile.institution}
            onChange={(e) =>
              setProfile({ ...profile, institution: e.target.value })
            }
            disabled={loading}
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
            <Input
              type="password"
              placeholder="Enter current password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm mb-2">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Confirm New Password</label>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={
              saving ||
              !passwordForm.currentPassword ||
              !passwordForm.newPassword ||
              !passwordForm.confirmPassword
            }
          >
            {saving ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderDataExport = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Export Your Data</h3>
        <p className="text-gray-600 mb-6">
          Download your data in various formats for backup or sharing purposes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">MCQ Sets Export</h4>
              <p className="text-sm text-gray-600 mb-4">
                Export all your generated MCQ sets with questions and answers
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleExportData("mcq-sets", "pdf")}
                >
                  Export as PDF
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleExportData("mcq-sets", "docx")}
                >
                  Export as Word Document
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Students Data</h4>
              <p className="text-sm text-gray-600 mb-4">
                Export your students information and performance data
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleExportData("students", "csv")}
              >
                Export as CSV
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings();
      case "security":
        return renderSecuritySettings();
      default:
        return renderProfileSettings();
    }
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
              <CardTitle>
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTabContent()}

              <div className="border-t pt-6 mt-6">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => signOut()}>
                    Logout
                  </Button>
                  {activeTab === "profile" && (
                    <Button onClick={handleSaveProfile} disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
