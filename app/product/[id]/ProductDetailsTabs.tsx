"use client";

import React, { useState } from "react";
import { Product } from "@/utils/models";

interface ProductDetailsTabsProps {
  product: Product;
}

// Helper function to sanitize HTML - client-side approach
const cleanHTML = (text: string) => {
  if (!text) return "";

  // Basic HTML sanitization - remove script tags and dangerous attributes
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "");
};

export default function ProductDetailsTabs({
  product,
}: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    {
      id: "description",
      label: "Description",
      condition: product.description,
    },
    {
      id: "specs",
      label: "Specifications",
      condition: product.specs && product.specs.length > 0,
    },
    {
      id: "faqs",
      label: "FAQs",
      condition: product.faqs && product.faqs.length > 0,
    },
    {
      id: "reviews",
      label: `Reviews (${product.reviews?.length || 0})`,
      condition: product.reviews && product.reviews.length > 0,
    },
  ].filter((tab) => tab.condition);

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: cleanHTML(product.description || ""),
            }}
          />
        );

      case "specs":
        return (
          <div className="space-y-6">
            {product.specs?.map((spec, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {spec.name}
                </h3>
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(spec.detail || ""),
                  }}
                />
              </div>
            ))}
          </div>
        );

      case "faqs":
        return (
          <div className="space-y-4">
            {product.faqs?.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        );

      case "reviews":
        return (
          <div className="space-y-4">
            {product.reviews?.map((review, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                )}
                {review.media && review.media.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {review.media.map((media, mediaIndex) => (
                      <div
                        key={mediaIndex}
                        className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"
                      >
                        <span className="text-xs text-gray-500">Media</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">{renderTabContent()}</div>
    </div>
  );
}
