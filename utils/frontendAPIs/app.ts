"use client";
import axios from "./axios.config";
import {
  ApiResponse,
  VisitRequest,
  MessageRequest,
  LeadRequest,
  POSInvoicePaymentRequest,
  POSInvoiceReviewRequest,
} from "../models";

/**
 * Track visitor activity on a specific page
 * @param payload - Visit tracking data
 * @returns Promise<void>
 */
export const visit = async (payload: VisitRequest): Promise<void> => {
  try {
    await axios.post("/visit", payload);
  } catch (err) {
    // Silently handle errors for analytics
  }
};

/**
 * Submit an inquiry when store is not ready
 * @returns Promise<ApiResponse | undefined>
 */
export const inquire = async (): Promise<ApiResponse | undefined> => {
  try {
    const res = await axios.post("/inquire");
    return res.data;
  } catch (err) {
    // Silently handle errors for inquiries
    return undefined;
  }
};

/**
 * Send a message to the business
 * @param payload - Message data
 * @returns Promise<ApiResponse>
 */
export const sendMessage = async (
  payload: MessageRequest
): Promise<ApiResponse> => {
  try {
    const res = await axios.post("/message", payload);
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Submit a lead for tracking
 * @param payload - Lead data
 * @returns Promise<ApiResponse>
 */
export const lead = async (payload: LeadRequest): Promise<ApiResponse> => {
  try {
    const res = await axios.post("/lead", payload);
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Pay for a POS invoice
 * @param payload - Payment data
 * @returns Promise<ApiResponse>
 */
export const payPOSInvoice = async (
  payload: POSInvoicePaymentRequest
): Promise<ApiResponse> => {
  try {
    const res = await axios.post("/posInvoice/pay", payload);
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Submit a review for a POS invoice
 * @param payload - Review data
 * @returns Promise<ApiResponse>
 */
export const reviewPOSInvoice = async (
  payload: POSInvoiceReviewRequest
): Promise<ApiResponse> => {
  try {
    const res = await axios.post("/posInvoice/review", payload);
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};
