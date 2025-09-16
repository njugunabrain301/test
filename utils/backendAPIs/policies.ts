import { fetchData } from "./fetch.config";
import { ApiResponse, ReturnsPolicy, ShippingPolicy } from "../models";

// Type for shipping policy response (includes delivery locations)
export interface ShippingPolicyResponse {
  shippingPolicy: ShippingPolicy;
  deliveryLocations: any[];
}

/**
 * Fetch returns policy for the business
 * @returns Promise<ApiResponse<ReturnsPolicy>>
 */
export const fetchReturnsPolicy = async (): Promise<
  ApiResponse<ReturnsPolicy>
> => {
  try {
    const res = await fetchData("/business/policy/returns", 60);
    return res;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Fetch shipping policy and delivery locations for the business
 * @returns Promise<ApiResponse<ShippingPolicyResponse>>
 */
export const fetchShippingPolicy = async (): Promise<
  ApiResponse<ShippingPolicyResponse>
> => {
  try {
    const res = await fetchData("/business/policy/shipping");
    return res;
  } catch (err) {
    return err as ApiResponse;
  }
};

export const runtime = "nodejs";
