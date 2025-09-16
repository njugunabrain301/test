"use client";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/Context/context";
import { fetchContactUs } from "@/utils/backendAPIs/app";
import { sendMessage } from "@/utils/frontendAPIs/app";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function ContactPage() {
  const { theme } = useGlobalContext();
  const [contactData, setContactData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: "",
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetchContactUs();
        if (response.success) {
          setContactData(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch contact data:", err);
      }
    };

    fetchContact();
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^(\+254|0)[17]\d{8}$/.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate contact field (email or phone)
    const isEmail = validateEmail(formData.contact);
    const isPhone = validatePhone(formData.contact);

    if (!isEmail && !isPhone) {
      setError("Please enter a valid email address or phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await sendMessage({
        name: formData.name,
        message: formData.message,
        contact: formData.contact,
      });

      if (response.success) {
        setSuccess("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", contact: "", message: "" });
      } else {
        setError(response.message || "Failed to send message");
      }
    } catch (err) {
      setError("An error occurred while sending the message");
    } finally {
      setLoading(false);
    }
  };

  if (!contactData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg opacity-80">
            Get in touch with us. We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Get In Touch</h2>

            <div className="space-y-6">
              {/* Phone */}
              {contactData.phone && (
                <div className="flex items-start space-x-4">
                  <div
                    className="p-3 rounded-full"
                    style={{
                      backgroundColor: theme.customPalette.primary.main,
                    }}
                  >
                    <PhoneIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Phone</h3>
                    <p className="text-base">{contactData.phone}</p>
                  </div>
                </div>
              )}

              {/* Email */}
              {contactData.email && (
                <div className="flex items-start space-x-4">
                  <div
                    className="p-3 rounded-full"
                    style={{
                      backgroundColor: theme.customPalette.primary.main,
                    }}
                  >
                    <EnvelopeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Email</h3>
                    <p className="text-base">{contactData.email}</p>
                  </div>
                </div>
              )}

              {/* Location */}
              {contactData.location && (
                <div className="flex items-start space-x-4">
                  <div
                    className="p-3 rounded-full"
                    style={{
                      backgroundColor: theme.customPalette.primary.main,
                    }}
                  >
                    <MapPinIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Location</h3>
                    <p className="text-base">{contactData.location}</p>
                  </div>
                </div>
              )}

              {/* Working Hours */}
              {contactData.workingHours && (
                <div className="flex items-start space-x-4">
                  <div
                    className="p-3 rounded-full"
                    style={{
                      backgroundColor: theme.customPalette.primary.main,
                    }}
                  >
                    <ClockIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Working Hours</h3>
                    <p className="text-base">{contactData.workingHours}</p>
                  </div>
                </div>
              )}

              {/* Response Time */}
              {contactData.responseTime && (
                <div className="mt-6 p-6 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Response Time</h3>
                  <p className="text-base">
                    We typically respond within{" "}
                    {contactData.responseTime.amount}{" "}
                    {contactData.responseTime.unit}
                  </p>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            {(contactData.facebook ||
              contactData.instagram ||
              contactData.twitter ||
              contactData.google) && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {contactData.facebook && (
                    <a
                      href={contactData.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <p className="text-base">Facebook</p>
                    </a>
                  )}
                  {contactData.instagram && (
                    <a
                      href={contactData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800 transition-colors"
                    >
                      <p className="text-base">Instagram</p>
                    </a>
                  )}
                  {contactData.twitter && (
                    <a
                      href={contactData.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <p className="text-base">Twitter</p>
                    </a>
                  )}
                  {contactData.google && (
                    <a
                      href={contactData.google}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <p className="text-base">Google</p>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    color: theme.customPalette.text.base,
                    borderColor: theme.customPalette.input.border,
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    color: theme.customPalette.text.base,
                    borderColor: theme.customPalette.input.border,
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    color: theme.customPalette.text.base,
                    borderColor: theme.customPalette.input.border,
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white font-medium rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.customPalette.primary.main,
                  color: theme.customPalette.text.inverted,
                }}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
