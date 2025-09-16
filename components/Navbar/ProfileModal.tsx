"use client";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/Context/context";
import {
  updateProfile,
  deleteProfile,
  resetPasswordLink,
} from "@/utils/frontendAPIs/auth";

interface ProfileModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, setOpen }) => {
  const { theme } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (open) {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      }
    }
  }, [open]);

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateProfile(profileData);
      if (response.success) {
        // Update local storage with new data
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          const updatedUser = { ...user, ...profileData };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        setSuccess("Profile updated successfully");
        setIsEditing(false);

        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setShowAdvancedSettings(false);
    setShowDeleteConfirm(false);
    setDeleteConfirmText("");
    setError("");
    setSuccess("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    window.location.reload();
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await resetPasswordLink({ email: profileData.email });
      if (response.success) {
        setSuccess("Password reset link sent to your email");
        setTimeout(() => {
          setSuccess("");
        }, 5000);
      } else {
        setError(response.message || "Failed to send password reset link");
      }
    } catch (err) {
      setError("An error occurred while sending password reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setError("Please type 'DELETE' to confirm account deletion");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await deleteProfile();
      if (response.success) {
        setSuccess("Account deleted successfully");
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else {
        setError(response.message || "Failed to delete account");
      }
    } catch (err) {
      setError("An error occurred while deleting account");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 relative">
          <h2
            className="text-2xl font-bold text-center"
            style={{ color: theme.customPalette.text.base }}
          >
            Profile Information
          </h2>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
              {success}
            </div>
          )}

          {/* Basic Profile Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{
                  color: theme.customPalette.text.base,
                  borderColor: theme.customPalette.input.border,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{
                  color: theme.customPalette.text.base,
                  borderColor: theme.customPalette.input.border,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{
                  color: theme.customPalette.text.base,
                  borderColor: theme.customPalette.input.border,
                }}
              />
            </div>
          </div>

          {/* Advanced Settings Section */}
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="w-full text-left text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              {showAdvancedSettings ? "▼" : "▶"} Advanced Settings
            </button>

            {showAdvancedSettings && (
              <div className="mt-4 space-y-4">
                {/* Change Password */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Change Password
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    We'll send a password reset link to your email address.
                  </p>
                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>

                {/* Delete Account */}
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="text-sm font-medium text-red-900 mb-2">
                    Delete Account
                  </h3>
                  <p className="text-xs text-red-600 mb-3">
                    This action cannot be undone. All your data will be
                    permanently deleted.
                  </p>

                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-3 py-2 text-sm font-medium text-red-600 bg-red-100 border border-red-200 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Delete Account
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-red-700 mb-1">
                          Type "DELETE" to confirm:
                        </label>
                        <input
                          type="text"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-red-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                          placeholder="DELETE"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={loading || deleteConfirmText !== "DELETE"}
                          className="px-3 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? "Deleting..." : "Confirm Delete"}
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeleteConfirmText("");
                          }}
                          className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          {!isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-4 py-2 border rounded-md font-medium hover:bg-gray-50 transition-colors"
                style={{
                  borderColor: "#3b82f6",
                  color: "#3b82f6",
                  backgroundColor: "#f3f4f6",
                }}
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 border rounded-md font-medium hover:bg-gray-50 transition-colors"
                style={{
                  borderColor: "#ef4444",
                  color: "#ef4444",
                  backgroundColor: "#fef2f2",
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 px-4 py-2 font-medium rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                }}
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 border rounded-md font-medium hover:bg-gray-50 transition-colors"
                style={{
                  borderColor: "#6b7280",
                  color: "#6b7280",
                  backgroundColor: "#f3f4f6",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
