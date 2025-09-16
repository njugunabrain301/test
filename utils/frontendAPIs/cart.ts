"use client";
import axios from "./axios.config";
import {
  ApiResponse,
  AddToCartRequest,
  CheckoutRequest,
  AnonymousCheckoutRequest,
  CartItem,
} from "../models";

/**
 * Add a product to the user's cart
 * @param payload - Product data to add to cart
 * @returns Promise<ApiResponse<CartItem[]>>
 */
export const addToCart = async (
  payload: AddToCartRequest
): Promise<ApiResponse<CartItem[]>> => {
  try {
    const res = await axios.post("/cart/add", payload);
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Remove a product from the user's cart
 * @param payload - Product data to remove from cart
 * @returns Promise<ApiResponse<CartItem[]>>
 */
export const removeFromCart = async (payload: {
  _id: string;
}): Promise<ApiResponse<CartItem[]>> => {
  try {
    const res = await axios.post("/cart/remove", payload);
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Complete checkout process for authenticated users
 * @param payload - Checkout data including cart items and delivery info
 * @returns Promise<ApiResponse<CartItem[]>>
 */
export const checkout = async (
  payload: CheckoutRequest
): Promise<ApiResponse<CartItem[]>> => {
  try {
    const res = await axios.post("/checkout", payload);
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Complete checkout process for anonymous users
 * @param payload - Checkout data including user info, cart items and delivery info
 * @returns Promise<ApiResponse<CartItem[]>>
 */
export const anonymousCheckout = async (
  payload: AnonymousCheckoutRequest
): Promise<ApiResponse<CartItem[]>> => {
  try {
    const res = await axios.post("/checkout/anonymous", payload);
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};
