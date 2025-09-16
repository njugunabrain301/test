"use client";

import React, { useState } from "react";

interface Coupon {
  name: string;
  discount: number;
  default: boolean;
  _id?: string;
}

interface CouponsProps {
  coupons: Coupon[];
}

export default function Coupons({ coupons }: CouponsProps) {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(
    coupons.find((coupon) => coupon.default) || null
  );

  if (!coupons || coupons.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">
        Available Coupons
      </h3>
      <div className="space-y-2">
        {coupons.map((coupon, index) => (
          <div
            key={index}
            className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedCoupon?.name === coupon.name
                ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setSelectedCoupon(coupon)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedCoupon?.name === coupon.name
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedCoupon?.name === coupon.name && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <span className="font-medium text-gray-900">{coupon.name}</span>
              </div>
              <span className="text-green-600 font-bold">
                -KES {coupon.discount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Coupon Summary */}
      {selectedCoupon && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-green-700 font-medium">
                Selected Coupon
              </p>
              <p className="text-green-900 font-semibold">
                {selectedCoupon.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">
                -KES {selectedCoupon.discount.toLocaleString()}
              </p>
              <p className="text-sm text-green-700">Discount</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
