"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/utils/models";
import ProductImageSlider from "./ProductImageSlider";
import ProductDetailsTabs from "./ProductDetailsTabs";
import LandingPageArticles from "./LandingPageArticles";
import PriceOptions from "./PriceOptions";
import ProductVariants from "./ProductVariants";
import ProductActions from "./ProductActions";

interface ProductPageClientProps {
  product: Product;
  profile: any;
  articles: any[];
  source: string | null;
  appliedCoupon: any;
}

export default function ProductPageClient({
  product,
  profile,
  articles,
  source,
  appliedCoupon,
}: ProductPageClientProps) {
  const [selectedPriceOption, setSelectedPriceOption] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Landing Page Articles (if not Google source) */}
        {articles.length > 0 && source !== "google" && (
          <LandingPageArticles articles={articles} />
        )}

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Breadcrumbs */}
          {(product.category || product.subcategory) && (
            <div className="px-8 pt-6 pb-2">
              <nav className="flex items-center space-x-2 text-sm">
                <Link
                  href="/products"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Products
                </Link>
                {product.category && (
                  <>
                    <span className="text-gray-400">/</span>
                    <Link
                      href={`/products?category=${encodeURIComponent(
                        product.category
                      )}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {product.category}
                    </Link>
                  </>
                )}
                {product.subcategory && (
                  <>
                    <span className="text-gray-400">/</span>
                    <Link
                      href={`/products?category=${encodeURIComponent(
                        product.category || ""
                      )}&subcategory=${encodeURIComponent(
                        product.subcategory
                      )}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {product.subcategory}
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <ProductImageSlider
                mainImage={product.img}
                images={product.images}
                productName={product.name || ""}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>

                {/* Product Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>Units Sold: {product.unitsSold || 0}</span>
                  {(product.unitsRefunded || 0) > 0 && (
                    <span>Units Refunded: {product.unitsRefunded}</span>
                  )}
                  {product.condition && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {product.condition}
                    </span>
                  )}
                </div>

                {/* Price Options */}
                {product.priceOptions && product.priceOptions.length > 0 ? (
                  <PriceOptions
                    priceOptions={product.priceOptions}
                    showPrice={profile?.showPrice}
                    coupon={appliedCoupon}
                    onSelectionChange={setSelectedPriceOption}
                  />
                ) : (
                  profile?.showPrice &&
                  product.price && (
                    <div className="mb-4">
                      {appliedCoupon ? (
                        <div>
                          <div className="text-sm text-gray-500 line-through">
                            KES {product.price.toLocaleString()}
                          </div>
                          <div className="text-3xl font-bold text-green-600">
                            KES{" "}
                            {(
                              product.price - appliedCoupon.discount
                            ).toLocaleString()}
                          </div>
                          <div className="text-sm text-green-600">
                            {appliedCoupon.name} applied (-
                            {appliedCoupon.discount.toLocaleString()})
                          </div>
                        </div>
                      ) : (
                        <div className="text-3xl font-bold text-green-600">
                          KES {product.price.toLocaleString()}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Product Variants (Colors & Sizes) */}
              <ProductVariants
                colors={product.colors}
                sizes={product.sizes}
                onColorChange={setSelectedColor}
                onSizeChange={setSelectedSize}
              />

              {/* USPs */}
              {product.USPs && product.USPs.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {product.USPs.map((usp, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{usp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Offers */}
              {product.offers && product.offers.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Special Offers
                  </h3>
                  <div className="space-y-2">
                    {product.offers.map((offer, index) => (
                      <div key={index} className="p-1">
                        <span className="text-yellow-800 font-medium">
                          🎁 {offer}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping Options */}
              {product.shippingOptions &&
                product.shippingOptions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Shipping Options
                    </h3>
                    <div className="space-y-2">
                      {product.shippingOptions.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-gray-700">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Returns Policy */}
              {product.returnsAccepted !== undefined && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Returns Policy
                  </h3>
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.returnsAccepted
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.returnsAccepted
                        ? "Returns Accepted"
                        : "No Returns"}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <ProductActions
                product={product}
                selectedPriceOption={selectedPriceOption}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                appliedCoupon={appliedCoupon}
              />
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <ProductDetailsTabs product={product} />

        {/* Related Products Section */}
        {product.showRelated && product.others && product.others.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.others.slice(0, 8).map((relatedProduct, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {relatedProduct.img && (
                    <img
                      src={relatedProduct.img}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {relatedProduct.name}
                    </h3>
                    {profile?.showPrice && relatedProduct.price && (
                      <p className="text-lg font-bold text-green-600">
                        KES {relatedProduct.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
