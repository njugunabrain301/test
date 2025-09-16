"use client";
import React, { useState } from "react";
import { useGlobalContext } from "@/Context/context";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { pushEvent } from "@/utils/gtag";
import CheckoutModal from "@/components/CheckoutModal";

const CartModal: React.FC = () => {
  const {
    openCart,
    handleCloseCart,
    cart,
    totalPrice,
    totalCount,
    removeFromLocalCart,
    profile,
    theme,
  } = useGlobalContext();

  const router = useRouter();

  const resizeImage = (img: string) => {
    return img.replace(
      "https://storage.googleapis.com/test-bucket001/",
      "https://ik.imagekit.io/d4mmlivtj/goduka/tr:w-100,h-100/"
    );
  };

  const handleCheckout = () => {
    // Track begin_checkout event
    const event = {
      event: "begin_checkout",
      currency: "KES",
      value: totalPrice,
      items: cart.map((item, idx) => ({
        item_id: item._id,
        item_name: item.name,
        affiliation: profile.name,
        coupon: "",
        discount: 0,
        index: idx,
        item_brand: item.brand,
        item_category: item.category,
        item_category2: item.subcategory,
        item_variant: `${item.color || ""} ${item.size || ""} ${
          item.selectedOption || ""
        }`.trim(),
        price: item.price,
        quantity: item.amount,
      })),
    };

    pushEvent("begin_checkout", "begin_checkout", event);

    // Close cart modal and open checkout modal
    handleCloseCart();
    // Store cart data for checkout modal
    localStorage.setItem(
      "pendingCheckout",
      JSON.stringify({
        cart,
        totalPrice,
        single: false,
      })
    );
    // Trigger checkout modal via global state
    window.dispatchEvent(new CustomEvent("openCheckout"));
  };

  const handleRemoveItem = (item: any) => {
    removeFromLocalCart(item);

    // Track remove_from_cart event
    pushEvent("remove_from_cart", "remove_from_cart", {
      currency: "KES",
      value: item.price * item.amount,
      items: [
        {
          item_id: item._id,
          item_name: item.name,
          affiliation: profile.name,
          coupon: "",
          discount: 0,
          index: 0,
          item_brand: item.brand,
          item_category: item.category,
          item_category2: item.subcategory,
          item_variant: `${item.color || ""} ${item.size || ""} ${
            item.selectedOption || ""
          }`.trim(),
          price: item.price,
          quantity: item.amount,
        },
      ],
    });
  };

  if (!openCart) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2
            className="text-xl font-bold"
            style={{ color: theme.customPalette.text.base }}
          >
            Shopping Cart ({totalCount})
          </h2>
          <button
            onClick={handleCloseCart}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: theme.customPalette.text.base }}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <h3
                className="text-lg font-medium"
                style={{ color: theme.customPalette.text.alt }}
              >
                Your cart is empty
              </h3>
              <p
                className="text-sm mt-2"
                style={{ color: theme.customPalette.text.alt }}
              >
                Add some products to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={`${item._id}-${item.color}-${item.size}-${index}`}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                  style={{ borderColor: theme.customPalette.panel?.border }}
                >
                  <Image
                    src={resizeImage(item.img)}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-lg font-medium truncate"
                      style={{ color: theme.customPalette.text.base }}
                    >
                      {item.name}
                    </h3>

                    <div className="flex items-center space-x-2 text-sm">
                      {item.color && (
                        <span style={{ color: theme.customPalette.text.alt }}>
                          Color: {item.color}
                        </span>
                      )}
                      {item.size && (
                        <span style={{ color: theme.customPalette.text.alt }}>
                          Size: {item.size}
                        </span>
                      )}
                      {item.selectedOption && (
                        <span style={{ color: theme.customPalette.text.alt }}>
                          {item.selectedOption}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span
                        className="text-sm"
                        style={{ color: theme.customPalette.text.base }}
                      >
                        Qty: {item.amount}
                      </span>

                      <span
                        className="text-lg font-semibold"
                        style={{ color: theme.customPalette.primary.main }}
                      >
                        KES {item.price * item.amount}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    style={{ color: theme.customPalette.error.main }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 space-y-3">
            <div className="flex justify-between items-center">
              <span
                className="text-lg font-semibold"
                style={{ color: theme.customPalette.text.base }}
              >
                Total:
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: theme.customPalette.primary.main }}
              >
                KES {totalPrice}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleCloseCart}
                className="flex-1 px-4 py-2 border rounded-md font-medium hover:bg-gray-50 transition-colors"
                style={{
                  borderColor: "#6b7280",
                  color: "#6b7280",
                  backgroundColor: "#f3f4f6",
                }}
              >
                Continue Shopping
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 px-4 py-2 font-medium rounded-md hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
