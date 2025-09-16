import axios from "./axios.config";
import { fetchData } from "./fetch.config";
import { ApiResponse, Product, ReturnsPolicy, ShippingPolicy } from "../models";

// Request payload types
export interface FetchProductRequest {
  pid: string;
}

// Response types for specific endpoints
export interface ProductDetailResponse {
  success: boolean;
  data: Product;
  others: Product[];
  categories: string[];
  returns: ReturnsPolicy;
  shipping: ShippingPolicy;
  offers: string[];
  unitsSold: number;
  unitsRefunded: number;
}

export interface HomePageResponse {
  slider: Product[];
  promoted: Product[];
  ready: boolean;
  active: boolean;
  latest: Product[];
}

/**
 * Fetch all products for the business
 * @returns Promise<ApiResponse<Product[]>>
 */
export const fetchProducts = async (): Promise<ApiResponse<Product[]>> => {
  try {
    const res = await fetchData("/products");
    return res;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Fetch a specific product by ID with related data
 * @param payload - Object containing product ID
 * @returns Promise<ApiResponse<ProductDetailResponse>>
 */
export const fetchProduct = async (
  payload: FetchProductRequest
): Promise<ProductDetailResponse> => {
  try {
    let res = await fetchData("/product/" + payload.pid);
    res.data.offers = res.offers;
    res.data.others = res.others;
    res.data.shipping = res.shipping;
    res.data.returns = res.returns;
    res.data.unitsSold = res.unitsSold;
    res.data.unitsRefunded = res.unitsRefunded;

    return res;
  } catch (err) {
    return err as ProductDetailResponse;
  }
};

/**
 * Fetch homepage data including slider, promoted products, and latest products
 * @returns Promise<ApiResponse<HomePageResponse>>
 */
export const fetchHomePage = async (): Promise<
  ApiResponse<HomePageResponse>
> => {
  try {
    const res = await fetchData("/homepage");
    return res;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Fetch all product categories
 * @returns Promise<ApiResponse<string[]>>
 */
export const fetchCategories = async (): Promise<ApiResponse<string[]>> => {
  try {
    const res = await fetchData("/categories", 60);
    return res;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Fetch genderizable data
 * @returns Promise<ApiResponse<any>>
 */
export const fetchGenderizable = async (): Promise<ApiResponse<any>> => {
  try {
    const res = await fetchData("/genderizable");
    return res;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Fetch wearables data
 * @returns Promise<ApiResponse<any>>
 */
export const fetchWearables = async (): Promise<ApiResponse<any>> => {
  try {
    const res = await fetchData("/wearables");
    return res;
  } catch (err) {
    return err as ApiResponse;
  }
};

export const runtime = "nodejs";
