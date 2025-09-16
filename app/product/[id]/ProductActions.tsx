"use client";

import React, { useState } from "react";
import { useGlobalContext } from "@/Context/context";
import { Product, CartItem } from "@/utils/models";
import CheckoutModal from "@/components/CheckoutModal";

interface ProductActionsProps {
  product: Product;
  selectedPriceOption?: {
    option: string;
    price: number;
    default: boolean;
    _id?: string;
  } | null;
  selectedColor?: string;
  selectedSize?: string;
  appliedCoupon?: {
    name: string;
    discount: number;
    _id?: string;
  } | null;
}

export default function ProductActions({
  product,
  selectedPriceOption,
  selectedColor,
  selectedSize,
  appliedCoupon,
}: ProductActionsProps) {
  const { addToLocalCart, profile } = useGlobalContext();
  const [isAdding, setIsAdding] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding) return;

    setIsAdding(true);

    try {
      // Determine the price to use
      let finalPrice = product.price || 0;
      if (selectedPriceOption) {
        finalPrice = selectedPriceOption.price;
      }

      // Note: Add to cart does NOT apply coupon discount
      // Only Buy Now applies coupon discount

      const cartItem = {
        _id: product._id,
        img: product.img || "",
        name: product.name || "",
        description: product.description || "",
        size: selectedSize || "",
        color: selectedColor || "",
        price: finalPrice,
        amount: 1,
        pid: product._id,
        selectedOption: selectedPriceOption?.option || "",
        brand: product.brand || "",
        category: product.category || "",
        subcategory: product.subcategory || "",
      };

      addToLocalCart(cartItem);

      // Show success feedback
      // You could add a toast notification here
      console.log("Added to cart:", cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    setShowCheckoutModal(true);
  };

  const createCartItem = (): CartItem => {
    // Determine the price to use
    let finalPrice = product.price || 0;
    if (selectedPriceOption) {
      finalPrice = selectedPriceOption.price;
    }

    // Apply coupon discount for Buy Now
    if (appliedCoupon) {
      finalPrice = finalPrice - appliedCoupon.discount;
    }

    return {
      _id: product._id,
      img: product.img || "",
      name: product.name || "",
      description: product.description || "",
      size: selectedSize || "",
      color: selectedColor || "",
      price: finalPrice,
      amount: 1,
      pid: product._id,
      selectedOption: selectedPriceOption?.option || "",
      brand: product.brand || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
    };
  };

  const getTotalPrice = (): number => {
    const cartItem = createCartItem();
    return cartItem.price;
  };

  // Don't show buttons if price is not available and profile doesn't allow showing prices
  if (!profile?.showPrice && !product.price && !selectedPriceOption) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Buy Now
        </button>
      </div>

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cart={[createCartItem()]}
        totalPrice={getTotalPrice()}
        single={true}
      />
    </>
  );
}
