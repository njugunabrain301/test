"use client";

import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/Context/context";
import { checkout, anonymousCheckout } from "@/utils/frontendAPIs/cart";
import { getCheckoutInfo } from "@/utils/backendAPIs/cart";
import { pushEvent } from "@/utils/gtag";
import {
  CartItem,
  CheckoutInfo,
  PaymentOption,
  DeliveryLocation,
} from "@/utils/models";
import { X, Truck, User, CreditCard, CheckCircle, Lock } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  totalPrice: number;
  single?: boolean;
}

type CheckoutStep = "delivery" | "profile" | "payment";

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  totalPrice,
  single = false,
}: CheckoutModalProps) {
  const { profile } = useGlobalContext();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("delivery");
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Delivery state
  const [deliveryDay, setDeliveryDay] = useState<"sameday" | "nextday">(
    "nextday"
  );
  const [county, setCounty] = useState("");
  const [subcounty, setSubcounty] = useState("");
  const [courier, setCourier] = useState<{ id: string; label: string } | null>(
    null
  );
  const [specifications, setSpecifications] = useState("");
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [payOnDelivery, setPayOnDelivery] = useState(false);

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Payment state
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentCode, setPaymentCode] = useState("");
  const [availablePaymentOptions, setAvailablePaymentOptions] = useState<
    string[]
  >([]);

  // Filtered options
  const [availableCounties, setAvailableCounties] = useState<string[]>([]);
  const [availableSubcounties, setAvailableSubcounties] = useState<string[]>(
    []
  );
  const [availableCouriers, setAvailableCouriers] = useState<
    { id: string; label: string }[]
  >([]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on client side
    if (typeof window !== "undefined") {
      setIsAuthenticated(!!localStorage.getItem("user"));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCheckoutInfo();
      if (isAuthenticated && typeof window !== "undefined") {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setName(userData.name || "");
        setEmail(userData.email || "");
        setPhone(userData.phone || "");
      }
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    if (checkoutInfo) {
      setupCounties();
    }
  }, [checkoutInfo, deliveryDay]);

  useEffect(() => {
    if (county) {
      setupSubcounties();
    }
  }, [county, deliveryDay]);

  useEffect(() => {
    if (subcounty) {
      setupCouriers();
    }
  }, [subcounty, deliveryDay]);

  useEffect(() => {
    if (courier) {
      calculateDeliveryCost();
      calculateDeliveryTime();
    }
  }, [courier]);

  useEffect(() => {
    if (checkoutInfo?.paymentOptions) {
      const options = checkoutInfo.paymentOptions.map((opt) => opt.type);
      if (payOnDelivery) {
        options.unshift("Payment on delivery");
      }
      setAvailablePaymentOptions(options);
      if (!paymentMode && options.length > 0) {
        setPaymentMode(options[0]);
      }
    }
  }, [checkoutInfo, payOnDelivery]);

  const fetchCheckoutInfo = async () => {
    try {
      const response = await getCheckoutInfo();
      if (response.success && response.data) {
        setCheckoutInfo(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch checkout info:", err);
    }
  };

  const setupCounties = () => {
    if (!checkoutInfo?.deliveryLocations) return;

    const counties = new Set<string>();
    checkoutInfo.deliveryLocations.forEach((loc) => {
      if (
        (loc.sameday && deliveryDay === "sameday") ||
        (loc.nextday && deliveryDay === "nextday")
      ) {
        counties.add(loc.county);
      }
    });
    setAvailableCounties(Array.from(counties));
  };

  const setupSubcounties = () => {
    if (!checkoutInfo?.deliveryLocations || !county) return;

    const subcounties = new Set<string>();
    checkoutInfo.deliveryLocations.forEach((loc) => {
      if (
        ((loc.sameday && deliveryDay === "sameday") ||
          (loc.nextday && deliveryDay === "nextday")) &&
        loc.county === county
      ) {
        if (loc.subcounty) {
          subcounties.add(loc.subcounty);
        }
      }
    });
    setAvailableSubcounties(Array.from(subcounties));
  };

  const setupCouriers = () => {
    if (!checkoutInfo?.deliveryLocations || !county || !subcounty) return;

    const couriers: { id: string; label: string }[] = [];
    checkoutInfo.deliveryLocations.forEach((loc) => {
      if (
        ((loc.sameday && deliveryDay === "sameday") ||
          (loc.nextday && deliveryDay === "nextday")) &&
        loc.county === county &&
        loc.subcounty === subcounty
      ) {
        couriers.push({
          id: loc._id,
          label: `${loc.courier} - ${loc.description} ${
            loc.payOnDelivery ? "(Pay on delivery)" : ""
          }`,
        });
      }
    });
    setAvailableCouriers(couriers);
  };

  const calculateDeliveryCost = () => {
    if (!courier || !checkoutInfo?.deliveryLocations) return;

    const location = checkoutInfo.deliveryLocations.find(
      (loc) => loc._id === courier.id
    );
    if (location) {
      setDeliveryCost(location.price);
      setPayOnDelivery(!!location.payOnDelivery);
    }
  };

  const calculateDeliveryTime = () => {
    if (!courier || !checkoutInfo?.deliveryLocations) return;

    const location = checkoutInfo.deliveryLocations.find(
      (loc) => loc._id === courier.id
    );
    if (location && location.time) {
      const now = new Date();
      const arrivalTime = new Date(now.getTime() + location.time * 60 * 1000);

      const timeString = arrivalTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      const dateString = arrivalTime.toDateString();
      setDeliveryTime(`${timeString} ${dateString}`);
    }
  };

  const validateStep = (step: CheckoutStep): boolean => {
    setError("");

    switch (step) {
      case "delivery":
        if (!county || !subcounty || !courier) {
          setError("Please select all delivery options");
          return false;
        }
        break;
      case "profile":
        if (!name || !email || !phone) {
          setError("Please fill in all profile information");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setError("Please enter a valid email address");
          return false;
        }
        if (!/^(\+254|0)[0-9]{9}$/.test(phone)) {
          setError(
            "Please enter a valid phone number (0712345678 or +254712345678)"
          );
          return false;
        }
        break;
      case "payment":
        if (!paymentMode) {
          setError("Please select a payment method");
          return false;
        }
        if (paymentMode !== "Payment on delivery" && !paymentCode) {
          setError("Please provide the payment code");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;

    // Track shipping info event
    if (currentStep === "delivery") {
      const event = {
        event: "add_shipping_info",
        currency: "KES",
        value: totalPrice,
        coupon: "",
        shipping_tier: "Ground",
        items: cart.map((item, idx) => ({
          item_id: item._id,
          item_name: item.name,
          affiliation: "",
          coupon: "",
          discount: 0,
          index: idx,
          price: item.price,
          quantity: item.amount,
        })),
      };

      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push(event);
      }
      pushEvent("event", "add_shipping_info", event);
    }

    const steps: CheckoutStep[] = ["delivery", "profile", "payment"];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1) {
      // Skip profile step for authenticated users
      if (isAuthenticated && currentStep === "delivery") {
        setCurrentStep("payment");
      } else {
        setCurrentStep(steps[currentIndex + 1]);
      }
    }
  };

  const handleCheckout = async () => {
    if (!validateStep("payment")) return;

    setIsLoading(true);
    setError("");

    try {
      // Track purchase event
      const event = {
        event: "purchase",
        transaction_id: "",
        totalPrice: Number(totalPrice) + Number(deliveryCost),
        value: Number(totalPrice) + Number(deliveryCost),
        tax: 0,
        shipping: deliveryCost,
        currency: "KES",
        coupon: "",
        items: cart.map((item, idx) => ({
          item_id: item._id,
          item_name: item.name,
          affiliation: profile?.name || "",
          coupon: "",
          discount: 0,
          index: idx,
          item_brand: item.brand || "",
          item_category: item.category || "",
          item_category2: item.subcategory || "",
          item_variant: `${item.color || ""} ${item.size || ""} ${
            item.selectedOption || ""
          }`.trim(),
          price: item.price,
          quantity: item.amount,
        })),
      };

      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push(event);
      }
      pushEvent("event", "purchase", event);

      const checkoutData = {
        single,
        cart,
        code: paymentCode,
        mode: paymentMode,
        total: Number(totalPrice) + Number(deliveryCost),
        courier: courier!.id,
        specifications,
        fullDeliveryTime: deliveryTime,
      };

      let response;
      if (isAuthenticated) {
        response = await checkout(checkoutData);
      } else {
        response = await anonymousCheckout({
          ...checkoutData,
          name,
          phone,
          email,
        });
      }

      if (response.success) {
        setSuccess(true);
        // Save delivery details to localStorage
        const deliveryDetails = {
          county,
          subcounty,
          courier: courier!.id,
          description: specifications,
        };
        localStorage.setItem(
          "deliveryDetails",
          JSON.stringify(deliveryDetails)
        );
      } else {
        setError("Checkout failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during checkout. Please try again.");
      console.error("Checkout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (step: CheckoutStep) => {
    switch (step) {
      case "delivery":
        return <Truck className="w-5 h-5" />;
      case "profile":
        return <User className="w-5 h-5" />;
      case "payment":
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getStepTitle = (step: CheckoutStep) => {
    switch (step) {
      case "delivery":
        return "Delivery";
      case "profile":
        return "Profile";
      case "payment":
        return "Payment";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {profile?.showPrice ? "Check Out" : "Get Quote"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Your Order has been received
            </h3>
            <p className="text-gray-600 mb-4">
              Thank you for shopping with us.
            </p>
            <p className="text-gray-600 mb-6">
              {!profile?.showPrice &&
                "We will get back to you as soon as possible with the cost of the goods ordered in order to proceed. "}
              You can track the progress in the{" "}
              <a
                href="/orders"
                className="text-blue-600 hover:underline"
                onClick={onClose}
              >
                orders
              </a>{" "}
              section{" "}
              {!isAuthenticated &&
                " after you log in. You can use the same phone number and email to log in and track your order"}
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Progress Steps */}
            <div className="flex border-b">
              {(["delivery", "profile", "payment"] as CheckoutStep[]).map(
                (step, index) => {
                  const isActive = currentStep === step;
                  const isCompleted =
                    (step === "delivery" && currentStep !== "delivery") ||
                    (step === "profile" && currentStep === "payment");

                  return (
                    <button
                      key={step}
                      onClick={() => {
                        if (
                          step === "delivery" ||
                          (step === "profile" && !isAuthenticated) ||
                          isCompleted
                        ) {
                          setCurrentStep(step);
                        }
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 border-b-2 transition-colors ${
                        isActive
                          ? "border-blue-500 text-blue-600"
                          : isCompleted
                          ? "border-green-500 text-green-600"
                          : "border-gray-200 text-gray-400"
                      } ${
                        step === "profile" && isAuthenticated
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      disabled={step === "profile" && isAuthenticated}
                    >
                      {getStepIcon(step)}
                      <span className="hidden sm:inline">
                        {getStepTitle(step)}
                      </span>
                    </button>
                  );
                }
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Delivery Section */}
              {currentStep === "delivery" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Delivery Information
                  </h3>

                  {/* Delivery Day Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Day
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryDay"
                          value="sameday"
                          checked={deliveryDay === "sameday"}
                          onChange={(e) =>
                            setDeliveryDay(
                              e.target.value as "sameday" | "nextday"
                            )
                          }
                          className="mr-2"
                        />
                        Same Day
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deliveryDay"
                          value="nextday"
                          checked={deliveryDay === "nextday"}
                          onChange={(e) =>
                            setDeliveryDay(
                              e.target.value as "sameday" | "nextday"
                            )
                          }
                          className="mr-2"
                        />
                        Next Day
                      </label>
                    </div>
                  </div>

                  {/* County Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      County
                    </label>
                    <select
                      value={county}
                      onChange={(e) => {
                        setCounty(e.target.value);
                        setSubcounty("");
                        setCourier(null);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select County</option>
                      {availableCounties.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcounty Selection */}
                  {county && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subcounty
                      </label>
                      <select
                        value={subcounty}
                        onChange={(e) => {
                          setSubcounty(e.target.value);
                          setCourier(null);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Subcounty</option>
                        {availableSubcounties.map((sc) => (
                          <option key={sc} value={sc}>
                            {sc}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Courier Selection */}
                  {subcounty && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Courier
                      </label>
                      <select
                        value={courier?.id || ""}
                        onChange={(e) => {
                          const selectedCourier = availableCouriers.find(
                            (c) => c.id === e.target.value
                          );
                          setCourier(selectedCourier || null);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Courier</option>
                        {availableCouriers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Address Specifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street/Building/House Details
                    </label>
                    <textarea
                      value={specifications}
                      onChange={(e) => setSpecifications(e.target.value)}
                      placeholder="Enter detailed address information..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  {/* Delivery Cost and Time */}
                  {courier && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Delivery Cost:
                        </span>
                        <span className="font-semibold">
                          KES {deliveryCost}{" "}
                          {payOnDelivery ? "(Pay on delivery)" : ""}
                        </span>
                      </div>
                      {deliveryTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Expected Arrival:
                          </span>
                          <span className="text-sm font-medium">
                            {deliveryTime}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Section */}
              {currentStep === "profile" && !isAuthenticated && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0712345678 or +254712345678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                    <span>You can delete your account easily at any time</span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4 mt-0.5 text-blue-500" />
                    <span>
                      We handle your provided information responsibly and
                      securely.{" "}
                      <a
                        href="/privacypolicy.html"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </div>
                </div>
              )}

              {/* Payment Section */}
              {currentStep === "payment" && profile?.showPrice && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payment Information
                  </h3>

                  {/* Payment Method Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Payment Method</option>
                      {availablePaymentOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Details */}
                  {paymentMode && paymentMode !== "Payment on delivery" && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {paymentMode === "MPesa-Till" &&
                        checkoutInfo?.paymentOptions && (
                          <div>
                            <h4 className="font-semibold mb-2">
                              MPESA: Buy Goods & Services
                            </h4>
                            <p>
                              Till Number:{" "}
                              {
                                checkoutInfo.paymentOptions.find(
                                  (opt) => opt.type === paymentMode
                                )?.tillNumber
                              }
                            </p>
                            <p>
                              Store Number:{" "}
                              {
                                checkoutInfo.paymentOptions.find(
                                  (opt) => opt.type === paymentMode
                                )?.storeNumber
                              }
                            </p>
                            <p>
                              Business Name:{" "}
                              {
                                checkoutInfo.paymentOptions.find(
                                  (opt) => opt.type === paymentMode
                                )?.name
                              }
                            </p>
                          </div>
                        )}
                      {paymentMode === "MPesa-Paybill" &&
                        checkoutInfo?.paymentOptions && (
                          <div>
                            <h4 className="font-semibold mb-2">
                              MPESA: Paybill
                            </h4>
                            <p>
                              Paybill Number:{" "}
                              {
                                checkoutInfo.paymentOptions.find(
                                  (opt) => opt.type === paymentMode
                                )?.paybillNumber
                              }
                            </p>
                            <p>
                              Account Number:{" "}
                              {
                                checkoutInfo.paymentOptions.find(
                                  (opt) => opt.type === paymentMode
                                )?.accountNumber
                              }
                            </p>
                            <p>
                              Business Name:{" "}
                              {
                                checkoutInfo.paymentOptions.find(
                                  (opt) => opt.type === paymentMode
                                )?.name
                              }
                            </p>
                          </div>
                        )}
                    </div>
                  )}

                  {paymentMode === "Payment on delivery" && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">
                        The payment details will be provided on delivery
                      </p>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Order Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Cart Total:</span>
                        <span>KES {totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Cost:</span>
                        <span>KES {deliveryCost}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Total:</span>
                        <span>
                          KES {Number(totalPrice) + Number(deliveryCost)}
                        </span>
                      </div>
                    </div>
                    {deliveryTime && (
                      <p className="text-sm text-gray-600 mt-2">
                        Expected delivery: {deliveryTime}
                      </p>
                    )}
                  </div>

                  {/* Payment Code Input */}
                  {paymentMode && paymentMode !== "Payment on delivery" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        MPESA Transaction Code
                      </label>
                      <input
                        type="text"
                        value={paymentCode}
                        onChange={(e) => setPaymentCode(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your MPESA transaction code"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-6 border-t bg-gray-50">
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>

              <div className="flex gap-3">
                {currentStep !== "delivery" && (
                  <button
                    onClick={() => {
                      const steps: CheckoutStep[] = [
                        "delivery",
                        "profile",
                        "payment",
                      ];
                      const currentIndex = steps.indexOf(currentStep);
                      if (currentIndex > 0) {
                        setCurrentStep(steps[currentIndex - 1]);
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}

                {currentStep === "payment" ? (
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading
                      ? "Processing..."
                      : profile?.showPrice
                      ? "Complete Order"
                      : "Request Quote"}
                  </button>
                ) : (
                  <button
                    onClick={handleNextStep}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {currentStep === "delivery" && isAuthenticated
                      ? "Continue to Payment"
                      : "Next"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
