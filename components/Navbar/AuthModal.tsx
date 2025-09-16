"use client";
import React, { useState } from "react";
import { useGlobalContext } from "@/Context/context";
import { motion, AnimatePresence } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { login, register, resetPasswordLink } from "@/utils/frontendAPIs/auth";
import { pushEvent } from "@/utils/gtag";
import { LoginResponse } from "@/utils/models";

type AuthMode = "login" | "register" | "forgot";

const AuthModal: React.FC = () => {
  const { openAuth, handleCloseAuth, theme } = useGlobalContext();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [forgotData, setForgotData] = useState({ email: "" });

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await login(loginData);
      console.log("Login response:", response); // Debug log

      if (response.success) {

        // Handle both response structures: expected and actual server format
        const accessToken = response.data?.accessToken;
        const userData = response.data?.data;

        if (accessToken && userData) {
          localStorage.setItem("token", accessToken);
          localStorage.setItem("user", JSON.stringify(userData));

          // Track login event
          pushEvent("login", "login", {
            method: "email",
            user_id: userData._id,
          });

          handleCloseAuth();
          window.location.reload();
        } else {
          setError("Invalid response format from server");
        }
      } 
      // Check if user is anonymous (has account but no password set)
      else if (response.anonymous) {
        setError(
          "An account with this email already exists. Please use the 'Forgot Password' link to set a password for your account."
        );
        return;
      }
      
      else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err); // Debug log
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await register(registerData);
      console.log("Register response:", response); // Debug log

      if (response.success) {
        // Handle both response structures: expected and actual server format
        const accessToken =
          (response as any).accessToken || response.data?.accessToken;
        const userData = (response as any).data || response.data?.data;

        if (accessToken && userData) {
          localStorage.setItem("token", accessToken);
          localStorage.setItem("user", JSON.stringify(userData));

          // Track sign up event
          pushEvent("sign_up", "sign_up", {
            method: "email",
            user_id: userData._id,
          });

          handleCloseAuth();
          window.location.reload();
        } else {
          setError("Invalid response format from server");
        }
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err); // Debug log
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await resetPasswordLink(forgotData);
      if (response.success) {
        setSuccess("Password reset link sent to your email");
        setTimeout(() => {
          setMode("login");
          setSuccess("");
        }, 3000);
      } else {
        setError(response.message || "Failed to send reset link");
      }
    } catch (err) {
      setError("An error occurred while sending reset link");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^(\+254|0)[17]\d{8}$/.test(phone);
  };

  const isFormValid = () => {
    switch (mode) {
      case "login":
        return loginData.email && loginData.password;
      case "register":
        return (
          registerData.name &&
          validateEmail(registerData.email) &&
          registerData.password.length >= 6 &&
          validatePhone(registerData.phone)
        );
      case "forgot":
        return validateEmail(forgotData.email);
      default:
        return false;
    }
  };

  const resetForm = () => {
    setLoginData({ email: "", password: "" });
    setRegisterData({ name: "", email: "", password: "", phone: "" });
    setForgotData({ email: "" });
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    resetForm();
    setMode("login");
    handleCloseAuth();
  };

  if (!openAuth) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 relative">
            <h2
              className="text-2xl font-bold text-center"
              style={{ color: theme.customPalette.text.base }}
            >
              {mode === "login" && "Sign In"}
              {mode === "register" && "Create Account"}
              {mode === "forgot" && "Reset Password"}
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

            {mode === "login" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      color: theme.customPalette.text.base,
                      borderColor: theme.customPalette.input.border,
                    }}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    style={{
                      color: theme.customPalette.text.base,
                      borderColor: theme.customPalette.input.border,
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </>
            )}

            {mode === "register" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      color: theme.customPalette.text.base,
                      borderColor: theme.customPalette.input.border,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={registerData.phone}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      color: theme.customPalette.text.base,
                      borderColor: theme.customPalette.input.border,
                    }}
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    style={{
                      color: theme.customPalette.text.base,
                      borderColor: theme.customPalette.input.border,
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </>
            )}

            {mode === "forgot" && (
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={forgotData.email}
                  onChange={(e) => setForgotData({ email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    color: theme.customPalette.text.base,
                    borderColor: theme.customPalette.input.border,
                  }}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 space-y-4">
            <button
              onClick={
                mode === "login"
                  ? handleLogin
                  : mode === "register"
                  ? handleRegister
                  : handleForgotPassword
              }
              disabled={!isFormValid() || loading}
              className="w-full px-4 py-2 font-medium rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              style={{
                backgroundColor: "#3b82f6",
                color: "#ffffff",
              }}
            >
              {loading
                ? "Loading..."
                : mode === "login"
                ? "Sign In"
                : mode === "register"
                ? "Create Account"
                : "Send Reset Link"}
            </button>

            <div className="flex justify-center space-x-4 text-sm">
              {mode === "login" && (
                <>
                  <button
                    onClick={() => setMode("register")}
                    style={{
                      color: "#3b82f6",
                      backgroundColor: "#f3f4f6",
                    }}
                    className="hover:bg-gray-200 px-3 py-2 rounded transition-colors"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => setMode("forgot")}
                    style={{
                      color: "#3b82f6",
                      backgroundColor: "#f3f4f6",
                    }}
                    className="hover:bg-gray-200 px-3 py-2 rounded transition-colors"
                  >
                    Forgot Password?
                  </button>
                </>
              )}

              {mode === "register" && (
                <button
                  onClick={() => setMode("login")}
                  style={{
                    color: "#3b82f6",
                    backgroundColor: "#f3f4f6",
                  }}
                  className="hover:bg-gray-200 px-3 py-2 rounded transition-colors"
                >
                  Already have an account? Sign In
                </button>
              )}

              {mode === "forgot" && (
                <button
                  onClick={() => setMode("login")}
                  style={{
                    color: "#3b82f6",
                    backgroundColor: "#f3f4f6",
                  }}
                  className="hover:bg-gray-200 px-3 py-2 rounded transition-colors"
                >
                  Back to Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
