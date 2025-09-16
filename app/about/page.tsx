import React from "react";
import { fetchAboutUs } from "@/utils/backendAPIs/app";
import SanitizedContent from "./SanitizedContent";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const response = await fetchAboutUs();
  const business = response.data;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About {business.name}</h1>
          {business.about && (
            <p className="text-xl opacity-80">{business.about}</p>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* About Detailed */}
          {business.aboutDetailed && (
            <div className="prose prose-lg max-w-none">
              <SanitizedContent
                content={business.aboutDetailed}
                className="text-justify leading-relaxed"
              />
            </div>
          )}

          {/* Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Information</h2>

              <div className="space-y-3">
                {business.phone && (
                  <div>
                    <h3 className="text-lg font-medium">Phone</h3>
                    <p className="text-base">{business.phone}</p>
                  </div>
                )}

                {business.email && (
                  <div>
                    <h3 className="text-lg font-medium">Email</h3>
                    <p className="text-base">{business.email}</p>
                  </div>
                )}

                {business.location && (
                  <div>
                    <h3 className="text-lg font-medium">Location</h3>
                    <p className="text-base">{business.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Business Details */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Business Details</h2>

              <div className="space-y-3">
                {business.workingHours && (
                  <div>
                    <h3 className="text-lg font-medium">Working Hours</h3>
                    <p className="text-base">{business.workingHours}</p>
                  </div>
                )}

                {business.responseTime && (
                  <div>
                    <h3 className="text-lg font-medium">Response Time</h3>
                    <p className="text-base">
                      {business.responseTime.amount}{" "}
                      {business.responseTime.unit}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          {(business.facebook ||
            business.instagram ||
            business.twitter ||
            business.google) && (
            <div className="mt-12 text-center">
              <h2 className="text-2xl font-semibold mb-6">Follow Us</h2>

              <div className="flex justify-center space-x-6">
                {business.facebook && (
                  <a
                    href={business.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span className="text-lg font-medium">Facebook</span>
                  </a>
                )}

                {business.instagram && (
                  <a
                    href={business.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800 transition-colors"
                  >
                    <span className="text-lg font-medium">Instagram</span>
                  </a>
                )}

                {business.twitter && (
                  <a
                    href={business.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-lg font-medium">Twitter</span>
                  </a>
                )}

                {business.google && (
                  <a
                    href={business.google}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <span className="text-lg font-medium">Google</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
