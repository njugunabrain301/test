"use client";

import React, { useState, useEffect } from "react";
import CheckoutModal from "./CheckoutModal";
import { CartItem } from "@/utils/models";

export default function GlobalCheckoutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    cart: CartItem[];
    totalPrice: number;
    single: boolean;
  } | null>(null);

  useEffect(() => {
    const handleOpenCheckout = () => {
      const pendingData = localStorage.getItem("pendingCheckout");
      if (pendingData) {
        const data = JSON.parse(pendingData);
        setCheckoutData(data);
        setIsOpen(true);
        localStorage.removeItem("pendingCheckout");
      }
    };

    window.addEventListener("openCheckout", handleOpenCheckout);
    return () => window.removeEventListener("openCheckout", handleOpenCheckout);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setCheckoutData(null);
  };

  if (!checkoutData) return null;

  return (
    <CheckoutModal
      isOpen={isOpen}
      onClose={handleClose}
      cart={checkoutData.cart}
      totalPrice={checkoutData.totalPrice}
      single={checkoutData.single}
    />
  );
}
