import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { fetchProduct, fetchCategories } from "@/utils/backendAPIs/products";
import { fetchBusinessProfile } from "@/utils/backendAPIs/app";
import {
  Product,
  BusinessProfile,
  ReturnsPolicy,
  ShippingPolicy,
} from "@/utils/models";
import ProductPageClient from "./ProductPageClient";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const [productRes, profileRes] = await Promise.all([
      fetchProduct({ pid: id }),
      fetchBusinessProfile(),
    ]);

    if (!productRes.success || !productRes.data) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    if (profileRes.success && profileRes.data) {
      const product = productRes.data;
      const profile = profileRes.data;

      // Clean description for metadata (remove HTML tags)
      const cleanDescription = product.description
        ? product.description.replace(/<[^>]*>/g, "").substring(0, 160)
        : `Shop ${product.name} at ${profile.name}`;

      return {
        title: `${product.name} - ${profile.name}`,
        description: cleanDescription,
        keywords: [
          product.name || "",
          product.category || "",
          product.subcategory || "",
          ...(product.categories || []).filter((cat) => cat),
          profile.name || "",
        ]
          .filter(Boolean)
          .join(", "),
        authors: [{ name: profile.name }],
        openGraph: {
          title: `${product.name} - ${profile.name}`,
          description: cleanDescription,
          type: "website",
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`,
          siteName: profile.name,
          images: product.img
            ? [
                {
                  url: product.img,
                  width: 800,
                  height: 600,
                  alt: product.name,
                },
              ]
            : [],
        },
        twitter: {
          card: "summary_large_image",
          title: `${product.name} - ${profile.name}`,
          description: cleanDescription,
          images: product.img ? [product.img] : [],
        },
        alternates: {
          canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`,
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    title: "Product Not Found",
    description: "The requested product could not be found.",
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  try {
    const { id } = await params;
    const search = await searchParams;

    const [productRes, profileRes] = await Promise.all([
      fetchProduct({ pid: id }),
      fetchBusinessProfile(),
    ]);

    if (!productRes.success || !productRes.data) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist.
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      );
    }

    const product = productRes.data;

    if (!product) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist.
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      );
    }

    const profile = profileRes.data;

    if (!product || !profile) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid Product Data
            </h1>
            <p className="text-gray-600">
              The product data is invalid or corrupted.
            </p>
          </div>
        </div>
      );
    }

    // Extract URL parameters
    const source = search.source as string;
    const lp = search.lp as string;
    const couponParam = search.coupon as string;

    // Determine articles to display
    let articles: any[] = [];
    let miniHeader = false;

    if (product.landingPages) {
      if (source !== "google") {
        if (lp) {
          const landingPage = product.landingPages.find(
            (lpItem) => lpItem.name === lp
          );
          if (landingPage) {
            articles = landingPage.articles;
            miniHeader = landingPage.miniHeader;
          }
        } else {
          const defaultLandingPage = product.landingPages.find(
            (lpItem) => lpItem.default || lpItem.name === "default"
          );
          if (defaultLandingPage) {
            articles = defaultLandingPage.articles;
            miniHeader = defaultLandingPage.miniHeader;
          }
        }
      }
    }

    // Find matching coupon from URL parameter
    let appliedCoupon = null;
    if (couponParam && product.coupons && product.coupons.length > 0) {
      appliedCoupon = product.coupons.find(
        (coupon) => coupon._id === couponParam
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product Page Client Component */}
          <ProductPageClient
            product={product}
            profile={profile}
            articles={articles}
            source={source}
            appliedCoupon={appliedCoupon}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Product
          </h1>
          <p className="text-gray-600">
            Something went wrong while loading the product.
          </p>
        </div>
      </div>
    );
  }
}
