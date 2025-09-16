import {
  ApiResponse,
  ShippingPolicy,
  PaymentOption,
  DeliveryLocation,
} from "../models";
import { fetchData } from "./fetch.config";

// Type for checkout info response
export interface CheckoutInfoResponse {
  paymentOptions: PaymentOption[];
  deliveryLocations: DeliveryLocation[];
  shipping: ShippingPolicy;
  counties: string[];
}

/**
 * Get checkout information including payment options, delivery locations, and shipping policy
 * @returns Promise<ApiResponse<CheckoutInfoResponse>>
 */
export const getCheckoutInfo = async (): Promise<
  ApiResponse<CheckoutInfoResponse>
> => {
  try {
    const res = await fetchData("/checkoutinfo", 3600);
    return res;
  } catch (err) {
    return err as ApiResponse;
  }
};

export const runtime = "nodejs";
