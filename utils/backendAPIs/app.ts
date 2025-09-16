import { ApiResponse, Business, POSInvoice } from "../models";
import { fetchData } from "./fetch.config";

// API Functions with proper types
export const fetchBusinessProfile = async (): Promise<
  ApiResponse<Business>
> => {
  try {
    const res = await fetchData("/business/profile", 60);
    // console.log(res);
    return res;
  } catch (err) {
    return err as ApiResponse;
  }
};

export const fetchAboutUs = async (): Promise<ApiResponse<Business>> => {
  try {
    const res = await fetchData("/business/about", 60);
    return res;
  } catch (err) {
    return err as ApiResponse;
  }
};

export const fetchContactUs = async (): Promise<ApiResponse<Business>> => {
  try {
    const res = await fetchData("/business/contact", 60);
    return res;
  } catch (err) {
    return err as ApiResponse;
  }
};

export const fetchPOSInvoice = async (
  iid: string
): Promise<
  ApiResponse<{
    invoice: POSInvoice;
    payOptions: any[];
  }>
> => {
  try {
    const res = await fetchData(`/posInvoice/${iid}`);
    return res;
  } catch (err) {
    return err as ApiResponse;
  }
};

export const runtime = "nodejs";
