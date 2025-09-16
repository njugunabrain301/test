import Cookies from "universal-cookie";
import { lead, visit } from "./frontendAPIs/app";

/**
 * Lead tracking types
 */
export type LeadType =
  | "visit"
  | "inquiry"
  | "purchase"
  | "return"
  | "review"
  | "whatsapp";

/**
 * Lead details interface
 */
export interface LeadDetails {
  type: LeadType;
  subject: string;
}

/**
 * Visitor details interface
 */
export interface VisitorDetails {
  page: string;
  visitorId: string;
}

/**
 * Cookie configuration interface
 */
export interface CookieConfig {
  path: string;
  maxAge: number;
}

/**
 * Get lead details and track lead generation
 *
 * This function tracks lead generation activities (visits, inquiries, etc.)
 * and prevents duplicate tracking within a 12-hour window using cookies.
 *
 * @param type - The type of lead activity (visit, inquiry, purchase, etc.)
 * @returns Promise<void> - Resolves when lead is tracked or skipped
 *
 * @example
 * ```typescript
 * // Track a visit lead
 * await getLeadDetails("visit");
 *
 * // Track an inquiry lead
 * await getLeadDetails("inquiry");
 * ```
 */
export const getLeadDetails = async (type: LeadType): Promise<void> => {
  const cookies = new Cookies();
  const lastActionTimestamp = cookies.get(type);
  const currentTime = Date.now();

  // Check if lead was already tracked within 12 hours
  if (
    lastActionTimestamp &&
    currentTime - lastActionTimestamp < 12 * 60 * 60 * 1000
  ) {
    return;
  }

  // Set cookie to track this lead action
  const cookieConfig: CookieConfig = {
    path: "/",
    maxAge: 12 * 60 * 60,
  };
  cookies.set(type, currentTime, cookieConfig);

  // Determine subject from current URL
  const currentUrl = window.location.href;
  const fields = currentUrl.split("/");

  let subject = "home";

  if (fields.includes("filter")) {
    subject = fields[fields.length - 1];
  }

  // Send lead data to backend
  await lead({ type, subject });
};

/**
 * Get visitor details and track page visits
 *
 * This function tracks page visits and generates unique visitor IDs.
 * It prevents duplicate tracking within a 12-hour window using cookies.
 *
 * @param page - Optional page name, defaults to last URL segment
 * @returns Promise<void> - Resolves when visit is tracked or skipped
 *
 * @example
 * ```typescript
 * // Track current page visit
 * await getVisitorDetails();
 *
 * // Track specific page visit
 * await getVisitorDetails("product-page");
 * ```
 */
export const getVisitorDetails = async (page?: string): Promise<void> => {
  const currentUrl = window.location.href;
  const fields = currentUrl.split("/");

  // Use provided page or extract from URL
  if (!page) {
    page = fields[fields.length - 1];
  }

  // Remove query parameters
  page = page.split("?")[0];
  const type = "v-" + page;

  const cookies = new Cookies();
  const lastActionTimestamp = cookies.get(type);
  let cookieId = cookies.get("cid");

  const currentTime = Date.now();

  // Generate unique visitor ID if not exists
  if (!cookieId) {
    cookieId = Date.now() + Math.random().toString(36).substring(2, 8);
    const cookieConfig: CookieConfig = {
      path: "/",
      maxAge: 12 * 60 * 60,
    };
    cookies.set("cid", cookieId, cookieConfig);
  }

  // Check if visit was already tracked within 12 hours
  if (
    lastActionTimestamp &&
    currentTime - lastActionTimestamp < 12 * 60 * 60 * 1000
  ) {
    return;
  }

  // Set cookie to track this visit
  const cookieConfig: CookieConfig = {
    path: "/",
    maxAge: 12 * 60 * 60,
  };
  cookies.set(type, currentTime, cookieConfig);

  // Send visit data to backend
  await visit({ page, visitorId: cookieId });
};

/**
 * Utility function to generate a unique visitor ID
 *
 * @returns string - A unique visitor identifier
 */
export const generateVisitorId = (): string => {
  return Date.now() + Math.random().toString(36).substring(2, 8);
};

/**
 * Utility function to check if an action was performed recently
 *
 * @param actionType - The type of action to check
 * @param hours - Number of hours to check back (default: 12)
 * @returns boolean - True if action was performed within the time window
 */
export const wasActionPerformedRecently = (
  actionType: string,
  hours: number = 12
): boolean => {
  const cookies = new Cookies();
  const lastActionTimestamp = cookies.get(actionType);
  const currentTime = Date.now();

  return !!(
    lastActionTimestamp &&
    currentTime - lastActionTimestamp < hours * 60 * 60 * 1000
  );
};

/**
 * Utility function to set action timestamp
 *
 * @param actionType - The type of action to timestamp
 * @param hours - Number of hours for cookie expiration (default: 12)
 */
export const setActionTimestamp = (
  actionType: string,
  hours: number = 12
): void => {
  const cookies = new Cookies();
  const currentTime = Date.now();
  const cookieConfig: CookieConfig = {
    path: "/",
    maxAge: hours * 60 * 60,
  };

  cookies.set(actionType, currentTime, cookieConfig);
};

/**
 * Utility function to extract page name from URL
 *
 * @param url - The URL to extract page name from (defaults to current URL)
 * @returns string - The extracted page name
 */
export const extractPageFromUrl = (url?: string): string => {
  const currentUrl = url || window.location.href;
  const fields = currentUrl.split("/");
  const page = fields[fields.length - 1];

  return page.split("?")[0];
};
