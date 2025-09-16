"use client";

import React from "react";
import { Product } from "@/utils/models";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  showPrice?: boolean;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showPrice = false,
  onClick,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default navigation to product page
      router.push(`/product/${product._id}`);
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer hover:scale-[1.02] transition-transform duration-200`}
      onClick={handleClick}
    >
      {/* Product Image */}
      {product.img && (
        <div className="mb-3">
          <img
            src={product.img}
            alt={product.name || "Product"}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>

      {/* Special Offers */}
      {product.offers && product.offers.length > 0 && (
        <div className="mb-2">
          {product.offers.map((offer, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full mr-1 mb-1"
            >
              {offer}
            </span>
          ))}
        </div>
      )}

      {/* Color Options */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-2">
          <span className="text-sm text-gray-600 mr-2">Colors:</span>
          <div className="flex flex-wrap gap-1">
            {product.colors.map((color, colorIndex) => (
              <span
                key={colorIndex}
                className="inline-block w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Options */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-2">
          <span className="text-sm text-gray-600 mr-2">Sizes:</span>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((size, sizeIndex) => (
              <span
                key={sizeIndex}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Price - Only show if showPrice is true */}
      {showPrice && product.price && (
        <div className="mt-3">
          <span className="text-lg font-bold text-green-600">
            KES {product.price.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
