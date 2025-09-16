"use client";

import React, { useState } from "react";

interface ProductVariantsProps {
  colors?: string[];
  sizes?: string[];
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: string) => void;
}

export default function ProductVariants({
  colors,
  sizes,
  onColorChange,
  onSizeChange,
}: ProductVariantsProps) {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange?.(color);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    onSizeChange?.(size);
  };

  return (
    <div className="space-y-4">
      {/* Colors */}
      {colors && colors.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Colors</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color: string, index: number) => (
              <button
                key={index}
                onClick={() => handleColorSelect(color)}
                className={`relative w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                  selectedColor === color
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{
                  backgroundColor: color.toLowerCase(),
                }}
                title={color}
              >
                {selectedColor === color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes && sizes.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size: string, index: number) => (
              <button
                key={index}
                onClick={() => handleSizeSelect(size)}
                className={`px-1 py-0 text-sm font-sm border rounded-md transition-colors ${
                  selectedSize === size
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
