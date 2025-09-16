"use client";
import axios, { URL } from "./axios.config";
import { ApiResponse, OrderItem, ProductReviewRequest } from "../models";

/**
 * Fetch all orders for the authenticated user
 * @returns Promise<ApiResponse<OrderItem[]>>
 */
export const fetchOrders = async (): Promise<ApiResponse<OrderItem[]>> => {
  try {
    const res = await axios.get("/orders");
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Download receipt for a specific order item
 * @param iid - Order item ID
 * @returns Promise<Blob> - PDF receipt file
 */
export const downloadReceipt = async (iid: string): Promise<Blob> => {
  try {
    const res = await axios.get("/receipt/" + iid, {
      responseType: "blob",
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

/**
 * Submit a product review with media files
 * @param payload - Review data including files
 * @returns Promise<ApiResponse>
 */
export const sendReview = async (payload: FormData): Promise<ApiResponse> => {
  try {
    const res = await axios.post("/product/review", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

export const downloadURL = URL + "/receipt";
