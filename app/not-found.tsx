"use client";
import React, { useState } from "react";
import { useGlobalContext } from "@/Context/context";
import { MagnifyingGlassIcon, HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const { theme } = useGlobalContext();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Icon/Image */}
        <div className="space-y-4">
          <div
            className="text-6xl font-bold"
            style={{ color: theme.customPalette.primary.main }}
          >
            404
          </div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: theme.customPalette.text.base }}
          >
            Page Not Found
          </h1>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <p
            className="text-base"
            style={{ color: theme.customPalette.text.alt }}
          >
            Oops! The page you're looking for doesn't exist. Don't worry, let's
            help you find what you need.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
              style={{
                color: theme.customPalette.text.base,
                borderColor: theme.customPalette.input.border,
                backgroundColor: theme.customPalette.background.primary,
              }}
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 p-0 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: theme.customPalette.primary.main,
                color: theme.customPalette.text.inverted,
              }}
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <button
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg border transition-all duration-200 hover:scale-105"
              style={{
                borderColor: theme.customPalette.primary.main,
                color: theme.customPalette.primary.main,
                backgroundColor: "transparent",
              }}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Go Home</span>
            </button>
          </Link>

          <Link href="/products">
            <button
              className="px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: theme.customPalette.primary.main,
                color: theme.customPalette.text.inverted,
              }}
            >
              Browse Products
            </button>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="pt-8">
          <p
            className="text-sm"
            style={{ color: theme.customPalette.text.alt }}
          >
            Can't find what you're looking for?{" "}
            <Link
              href="/contact"
              className="underline hover:no-underline transition-all duration-200"
              style={{ color: theme.customPalette.primary.main }}
            >
              Contact us
            </Link>{" "}
            for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
