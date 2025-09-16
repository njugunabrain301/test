"use client";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/Context/context";
import { checkout, anonymousCheckout } from "@/utils/frontendAPIs/cart";
import { pushEvent } from "@/utils/gtag";

interface BuyNowModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: any;
}

const BuyNowModal: React.FC<BuyNowModalProps> = ({
  open,
  setOpen,
  product,
}) => {
  const { theme, profile, checkoutInfo } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    county: "",
    subcounty: "",
    courier: "",
    pickupDescription: "",
    paymentMode: "",
    paymentCode: "",
  });

  // Product options
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (open) {
      // Pre-fill form if user is logged in
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setFormData((prev) => ({
          ...prev,
          name: userData.name || "",
          phone: userData.phone || "",
          email: userData.email || "",
          county: userData.county || "",
          subcounty: userData.subcounty || "",
          courier: userData.courier || "",
        }));
      }

      // Set default product options
      if (product.priceOptions && product.priceOptions.length > 0) {
        const defaultOption = product.priceOptions.find(
          (opt: any) => opt.default
        );
        setSelectedOption(
          defaultOption ? defaultOption.option : product.priceOptions[0].option
        );
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [open, product]);

  const getCurrentPrice = () => {
    if (product.priceOptions && selectedOption) {
      const option = product.priceOptions.find(
        (opt: any) => opt.option === selectedOption
      );
      return option ? option.price : product.price;
    }
    return product.price;
  };

  const getDeliveryPrice = () => {
    if (formData.county && formData.courier) {
      const location = checkoutInfo.deliveryLocations?.find(
        (loc: any) =>
          loc.county === formData.county && loc.courier === formData.courier
      );
      return location ? parseFloat(location.price) : 0;
    }
    return 0;
  };

  const getTotalPrice = () => {
    return getCurrentPrice() + getDeliveryPrice();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const cartItem = {
        _id: product._id,
        img: product.img || product.images?.[0]?.img,
        name: product.name,
        description: product.description,
        price: getCurrentPrice(),
        amount: 1,
        pid: product._id,
        color: selectedColor,
        size: selectedSize,
        selectedOption: selectedOption,
        brand: product.brand,
        category: product.category,
        subcategory: product.subcategory,
      };

      const checkoutData = {
        single: true,
        cart: [cartItem],
        code: "",
        mode: formData.paymentMode,
        total: getTotalPrice(),
        courier: formData.courier,
        specifications: formData.pickupDescription,
      };

      const token = localStorage.getItem("token");
      let response;

      if (token) {
        // Authenticated checkout
        response = await checkout(checkoutData);
      } else {
        // Anonymous checkout
        response = await anonymousCheckout({
          ...checkoutData,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        });
      }

      if (response.success) {
        // Track purchase event
        pushEvent("purchase", "purchase", {
          transaction_id: response.data?.paymentCode || "temp_" + Date.now(),
          value: getTotalPrice(),
          currency: "KES",
          items: [
            {
              item_id: product._id,
              item_name: product.name,
              affiliation: profile.name,
              price: getCurrentPrice(),
              quantity: 1,
            },
          ],
        });

        setOpen(false);
        // Redirect to success page or show success message
        window.location.href = "/orders";
      } else {
        setError(response.message || "Checkout failed");
      }
    } catch (err) {
      setError("An error occurred during checkout");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setError("");
  };

  const isFormValid = () => {
    if (step === 1) {
      return (
        formData.name && formData.phone && formData.county && formData.courier
      );
    }
    if (step === 2) {
      return formData.paymentMode;
    }
    if (step === 3) {
      return formData.paymentMode !== "payOnDelivery"
        ? formData.paymentCode
        : true;
    }
    return false;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: theme.customPalette.background.primary }}
      >
        {/* Header */}
        <div
          className="p-6 border-b text-center relative"
          style={{ borderColor: theme.customPalette.panel?.border }}
        >
          <h2
            className="text-xl font-semibold"
            style={{ color: theme.customPalette.text.base }}
          >
            Quick Purchase - {product.name}
          </h2>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {error && (
            <div
              className="p-4 rounded-lg text-sm"
              style={{
                backgroundColor: theme.customPalette.error.light,
                color: theme.customPalette.error.main,
                border: `1px solid ${theme.customPalette.error.main}`,
              }}
            >
              {error}
            </div>
          )}

          {/* Step 1: Product Options & Customer Info */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Product Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Product Options</h3>

                {product.priceOptions && product.priceOptions.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price Option
                    </label>
                    <select
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                      style={{
                        color: theme.customPalette.text.base,
                        borderColor: theme.customPalette.input.border,
                        backgroundColor: theme.customPalette.background.primary,
                      }}
                    >
                      {product.priceOptions.map((option: any) => (
                        <option key={option.option} value={option.option}>
                          {option.option} - KES {option.price}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Color
                    </label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                      style={{
                        color: theme.customPalette.text.base,
                        borderColor: theme.customPalette.input.border,
                        backgroundColor: theme.customPalette.background.primary,
                      }}
                    >
                      {product.colors.map((color: string) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Size
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                      style={{
                        color: theme.customPalette.text.base,
                        borderColor: theme.customPalette.input.border,
                        backgroundColor: theme.customPalette.background.primary,
                      }}
                    >
                      {product.sizes.map((size: string) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Information</h3>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                  style={{
                    color: theme.customPalette.text.base,
                    borderColor: theme.customPalette.input.border,
                    backgroundColor: theme.customPalette.background.primary,
                  }}
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                  style={{
                    color: theme.customPalette.text.base,
                    borderColor: theme.customPalette.input.border,
                    backgroundColor: theme.customPalette.background.primary,
                  }}
                />

                <input
                  type="email"
                  placeholder="Email (Optional)"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                  style={{
                    color: theme.customPalette.text.base,
                    borderColor: theme.customPalette.input.border,
                    backgroundColor: theme.customPalette.background.primary,
                  }}
                />
              </div>

              {/* Delivery Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Delivery Information</h3>

                <select
                  value={formData.county}
                  onChange={(e) =>
                    setFormData({ ...formData, county: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                  style={{
                    color: theme.customPalette.text.base,
                    borderColor: theme.customPalette.input.border,
                    backgroundColor: theme.customPalette.background.primary,
                  }}
                >
                  <option value="">Select County</option>
                  {checkoutInfo.counties?.map((county: string) => (
                    <option key={county} value={county.replace("*", "")}>
                      {county.replace("*", "")}{" "}
                      {county.includes("*") && "(Pay on Delivery Available)"}
                    </option>
                  ))}
                </select>

                <select
                  value={formData.courier}
                  onChange={(e) =>
                    setFormData({ ...formData, courier: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                  style={{
                    color: theme.customPalette.text.base,
                    borderColor: theme.customPalette.input.border,
                    backgroundColor: theme.customPalette.background.primary,
                  }}
                >
                  <option value="">Select Courier</option>
                  {checkoutInfo.deliveryLocations
                    ?.filter((loc: any) => loc.county === formData.county)
                    .map((loc: any) => (
                      <option key={loc.courier} value={loc.courier}>
                        {loc.courier} - KES {loc.price}
                      </option>
                    ))}
                </select>

                <input
                  type="text"
                  placeholder="Pickup Description (Optional)"
                  value={formData.pickupDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickupDescription: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                  style={{
                    color: theme.customPalette.text.base,
                    borderColor: theme.customPalette.input.border,
                    backgroundColor: theme.customPalette.background.primary,
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Method</h3>

              <select
                value={formData.paymentMode}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMode: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                style={{
                  color: theme.customPalette.text.base,
                  borderColor: theme.customPalette.input.border,
                  backgroundColor: theme.customPalette.background.primary,
                }}
              >
                <option value="">Select Payment Method</option>
                {checkoutInfo.paymentOptions?.map((option: any) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Payment Instructions */}
              {formData.paymentMode && (
                <div
                  className="p-4 border rounded-lg"
                  style={{ borderColor: theme.customPalette.panel?.border }}
                >
                  <p className="text-sm font-medium mb-2">
                    Payment Instructions:
                  </p>
                  {formData.paymentMode === "MPESA Till" && (
                    <p className="text-sm">
                      Send money to Till Number: {profile.phone}
                    </p>
                  )}
                  {formData.paymentMode === "MPESA Paybill" && (
                    <p className="text-sm">
                      Send money to Paybill: {profile.phone}
                    </p>
                  )}
                  {formData.paymentMode === "Pay on Delivery" && (
                    <p className="text-sm">Pay when your order is delivered</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Payment Code */}
          {step === 3 && formData.paymentMode !== "Pay on Delivery" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Confirmation</h3>

              <input
                type="text"
                placeholder="Transaction Code"
                value={formData.paymentCode}
                onChange={(e) =>
                  setFormData({ ...formData, paymentCode: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                style={{
                  color: theme.customPalette.text.base,
                  borderColor: theme.customPalette.input.border,
                  backgroundColor: theme.customPalette.background.primary,
                }}
              />
            </div>
          )}

          {/* Price Summary */}
          <div
            className="border-t pt-4"
            style={{ borderColor: theme.customPalette.panel?.border }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Total:</h3>
              <p
                className="text-xl font-bold"
                style={{ color: theme.customPalette.primary.main }}
              >
                KES {getTotalPrice()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-6 border-t flex justify-between"
          style={{ borderColor: theme.customPalette.panel?.border }}
        >
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 rounded-lg border transition-all duration-200 hover:scale-105"
              style={{
                borderColor: theme.customPalette.text.alt,
                color: theme.customPalette.text.alt,
                backgroundColor: "transparent",
              }}
            >
              Previous
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!isFormValid()}
              className="px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
              style={{
                backgroundColor: theme.customPalette.primary.main,
                color: theme.customPalette.text.inverted,
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className="px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
              style={{
                backgroundColor: theme.customPalette.primary.main,
                color: theme.customPalette.text.inverted,
              }}
            >
              {loading ? "Processing..." : "Complete Purchase"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal;
