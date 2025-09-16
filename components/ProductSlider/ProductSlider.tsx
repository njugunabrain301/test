"use client";
import React, { useState, useEffect } from "react";
import { Product } from "@/utils/models";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface ProductSliderProps {
  products: Product[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const navigateToProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [products.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (products.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">No featured products available</p>
      </div>
    );
  }

  if (products.length === 1) {
    const product = products[0];
    return (
      <div
        className="relative h-96 rounded-lg overflow-hidden cursor-pointer"
        onClick={() => navigateToProduct(product._id)}
      >
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
            {product.description && (
              <p className="text-white/90 text-sm line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  function removeTags(str: string) {
    if (str === null || str === "") return false;
    else str = str.toString();

    return str.replace(/(<([^>]+)>)/gi, "");
  }

  return (
    <div className="relative h-96 rounded-lg overflow-hidden group">
      {/* Slider Container */}
      <div className="relative h-full">
        {products.map((product, index) => (
          <div
            key={product._id || index}
            className={`absolute inset-0 transition-opacity duration-500 cursor-pointer ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => navigateToProduct(product._id)}
          >
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-white/90 text-sm line-clamp-2">
                    {removeTags(product.description)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
