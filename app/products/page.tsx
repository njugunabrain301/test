"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProducts, fetchCategories } from "@/utils/backendAPIs/products";
import { fetchBusinessProfile } from "@/utils/backendAPIs/app";
import { BusinessProfile, ApiResponse, Product } from "@/utils/models";
import ProductCard from "@/components/ProductCard/ProductCard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "default">("default");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, profileRes] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchBusinessProfile(),
        ]);

        if (productsRes.success) {
          setProducts(productsRes.data || []);
        } else {
          setError("Failed to load products");
        }

        if (categoriesRes.success) {
          setCategories(categoriesRes.data || []);
        }

        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data);
        }
      } catch (err) {
        setError("An error occurred while loading data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.subcategory?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          product.category === selectedCategory ||
          product.subcategory === selectedCategory ||
          (product.categories && product.categories.includes(selectedCategory))
      );
    }

    // Sort products
    if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => {
        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    } else if (sortBy === "price") {
      filtered = [...filtered].sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Products
            </h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Our Products
          </h1>
          {searchQuery && (
            <p className="text-lg text-gray-600 mb-2">
              Search results for:{" "}
              <span className="font-semibold">"{searchQuery}"</span>
            </p>
          )}
          <p className="text-lg text-gray-600">
            {filteredAndSortedProducts.length} product
            {filteredAndSortedProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    // Update URL search params
                    const url = new URL(window.location.href);
                    if (e.target.value) {
                      url.searchParams.set("search", e.target.value);
                    } else {
                      url.searchParams.delete("search");
                    }
                    window.history.replaceState({}, "", url.toString());
                  }}
                  className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "name" | "price" | "default")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Default</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                disabled={sortBy === "default"}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  sortBy === "default"
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : ""
                }`}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {searchQuery ? "No Products Found" : "No Products Available"}
            </h2>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `No products match your search for "${searchQuery}". Try adjusting your search terms or browse all categories.`
                : "We're currently setting up our product catalog. Please check back soon!"}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSortBy("default");
                  setSortOrder("asc");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredAndSortedProducts.map((product, index) => (
              <ProductCard
                key={product._id || index}
                product={product}
                showPrice={profile?.showPrice || false}
              />
            ))}
          </div>
        )}

        {/* Categories Section - Moved to Bottom */}
        {categories.length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category ? "" : category
                    )
                  }
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                    selectedCategory === category
                      ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-sm font-medium">{category}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
