"use client";
import React, { useState } from "react";
import { useGlobalContext } from "@/Context/context";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, setOpen }) => {
  const { theme } = useGlobalContext();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setOpen(false);
      setSearchTerm("");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSearchTerm("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2
            className="text-xl font-semibold"
            style={{ color: theme.customPalette.text.base }}
          >
            Search Products
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: theme.customPalette.text.base }}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium mb-2">
                Search for products...
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  color: theme.customPalette.text.base,
                  borderColor: theme.customPalette.input.border,
                }}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center"
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                }}
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
              </button>
            </div>

            <div
              className="text-sm"
              style={{ color: theme.customPalette.text.alt }}
            >
              Press Enter to search or click the search button
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
