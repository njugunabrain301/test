"use client";
import axios from "./axios.config";
import {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  RequestResetPasswordRequest,
  ResetPasswordRequest,
  User,
} from "../models";

/**
 * Authenticate user with email and password
 * @param payload - Login credentials
 * @returns Promise<ApiResponse<{ accessToken: string; data: User }> & { anonymous?: boolean }>
 */
export const login = async (
  payload: LoginRequest
): Promise<
  ApiResponse<{
    accessToken: string;
    data: User;
  }> & { anonymous?: boolean }
> => {
  try {
    const { email, password } = payload;
    const res = await axios.post("/login", { email, password });
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Verify if the current user is authenticated
 * @returns Promise<ApiResponse>
 */
export const verifyAuth = async (): Promise<ApiResponse> => {
  try {
    const res = await axios.get("/verify-auth");
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Register a new user account
 * @param payload - Registration data
 * @returns Promise<ApiResponse<{ data: User; accessToken: string }>>
 */
export const register = async (
  payload: RegisterRequest
): Promise<
  ApiResponse<{
    data: User;
    accessToken: string;
  }>
> => {
  try {
    const res = await axios.post("/register", payload);
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Update user profile information
 * @param payload - Profile update data
 * @returns Promise<ApiResponse<UpdateProfileRequest>>
 */
export const updateProfile = async (
  payload: UpdateProfileRequest
): Promise<ApiResponse<UpdateProfileRequest>> => {
  try {
    const res = await axios.post("/profile/update", payload);
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Delete user profile
 * @returns Promise<ApiResponse>
 */
export const deleteProfile = async (): Promise<ApiResponse> => {
  try {
    const res = await axios.delete("/profile");
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Reset user password with token
 * @param payload - Password reset data
 * @returns Promise<ApiResponse>
 */
export const resetPassword = async (
  payload: ResetPasswordRequest
): Promise<ApiResponse> => {
  try {
    const res = await axios.post("/reset-password", payload);
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};

/**
 * Request password reset link
 * @param payload - Email for password reset
 * @returns Promise<ApiResponse>
 */
export const resetPasswordLink = async (
  payload: RequestResetPasswordRequest
): Promise<ApiResponse> => {
  try {
    const res = await axios.post("/request-reset-password", payload);
    return res.data;
  } catch (err) {
    return err as ApiResponse;
  }
};
