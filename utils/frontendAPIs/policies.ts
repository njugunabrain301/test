"use client";
import axios, { URL } from "./axios.config";
import { ApiResponse, ReturnRequest } from "../models";

/**
 * Request a return for an order
 * @param payload - Return request data including order ID and reason
 * @returns Promise<ApiResponse>
 */
export const requestReturn = async (
  payload: ReturnRequest
): Promise<ApiResponse> => {
  try {
    const res = await axios.post("/return", payload);
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};
