"use client";

import React, { useState } from "react";

interface PriceOption {
  option: string;
  price: number;
  default: boolean;
  _id?: string;
}

interface PriceOptionsProps {
  priceOptions: PriceOption[];
  showPrice?: boolean;
  coupon?: {
    name: string;
    discount: number;
    _id?: string;
  } | null;
  onSelectionChange?: (selectedOption: PriceOption) => void;
}

export default function PriceOptions({
  priceOptions,
  showPrice,
  coupon,
  onSelectionChange,
}: PriceOptionsProps) {
  const [selectedOption, setSelectedOption] = useState(
    priceOptions.find((option) => option.default) || priceOptions[0]
  );

  // Notify parent of initial selection
  React.useEffect(() => {
    if (selectedOption && onSelectionChange) {
      onSelectionChange(selectedOption);
    }
  }, [selectedOption, onSelectionChange]);

  if (!showPrice || !priceOptions || priceOptions.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Price Options</h3>
      <div className="space-y-2">
        {priceOptions.map((option: PriceOption, index: number) => (
          <div
            key={index}
            className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedOption?.option === option.option
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => {
              setSelectedOption(option);
              onSelectionChange?.(option);
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedOption?.option === option.option
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOption?.option === option.option && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <span className="font-medium text-gray-900">
                  {option.option}
                </span>
              </div>
              <div className="text-right">
                {coupon ? (
                  <div>
                    <span className="text-sm text-gray-500 line-through">
                      KES {option.price.toLocaleString()}
                    </span>
                    <div className="text-lg font-bold text-green-600">
                      KES {(option.price - coupon.discount).toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600">
                      -{coupon.discount.toLocaleString()} discount
                    </div>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-green-600">
                    KES {option.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Option Summary */}
      {selectedOption && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-green-700 font-medium">
                Selected Option
              </p>
              <p className="text-green-900 font-semibold">
                {selectedOption.option}
              </p>
            </div>
            <div className="text-right">
              {coupon ? (
                <div>
                  <p className="text-sm text-gray-500 line-through">
                    KES {selectedOption.price.toLocaleString()}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    KES{" "}
                    {(selectedOption.price - coupon.discount).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">
                    {coupon.name} applied (-{coupon.discount.toLocaleString()})
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-bold text-green-600">
                  KES {selectedOption.price.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
