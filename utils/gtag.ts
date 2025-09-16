"use client";

/**
 * Google Analytics 4 configuration and tracking utilities
 *
 * This module provides functions for loading GA4 scripts and tracking events.
 * It handles script loading, data layer management, and event pushing.
 */

// Global state variables
let isLoaded = false;
let ga4Id = "";

/**
 * Google Analytics event types
 */
export type GAEventType =
  | "page_view"
  | "purchase"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_item"
  | "view_item_list"
  | "begin_checkout"
  | "add_shipping_info"
  | "add_payment_info"
  | "purchase"
  | "refund"
  | "login"
  | "sign_up"
  | "search"
  | "select_content"
  | "share"
  | "custom"
  | "view_cart";

/**
 * Google Analytics event parameters interface
 */
export interface GAEventParameters {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Google Analytics event data interface
 */
export interface GAEventData {
  event_category?: string;
  event_label?: string;
  value?: number;
  currency?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    item_category?: string;
    price?: number;
    quantity?: number;
    affiliation?: string;
    coupon?: string;
    discount?: number;
    index?: number;
    item_brand?: string;
    item_category2?: string;
    item_variant?: string;
  }>;
  [key: string]: any;
}

/**
 * Google Analytics configuration interface
 */
export interface GAConfig {
  tagID: string;
  name: string;
  event: GAEventType;
  data?: GAEventData;
}

/**
 * Window interface extension for Google Analytics
 */
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Load Google Analytics 4 script and initialize tracking
 *
 * This function dynamically loads the GA4 script and sets up the data layer.
 * It also sends an initial configuration and event.
 *
 * @param tagID - Google Analytics 4 measurement ID (e.g., "G-XXXXXXXXXX")
 * @param name - Event name to track
 * @param event - Event type from GAEventType
 * @param data - Optional event data and parameters
 *
 * @example
 * ```typescript
 * // Load GA4 and track page view
 * loadGA4Script("G-XXXXXXXXXX", "page_view", "page_view", {
 *   page_title: "Home Page",
 *   page_location: window.location.href
 * });
 *
 * // Load GA4 and track custom event
 * loadGA4Script("G-XXXXXXXXXX", "custom_event", "custom", {
 *   event_category: "engagement",
 *   event_label: "button_click"
 * });
 * ```
 */
export const loadGA4Script = (
  tagID: string,
  name: string,
  event: GAEventType,
  data?: GAEventData
): void => {
  ga4Id = tagID;

  // Create gtag script element
  const gtagScript = document.createElement("script");
  gtagScript.type = "text/javascript";
  gtagScript.setAttribute(
    "src",
    `https://www.googletagmanager.com/gtag/js?id=${tagID}`
  );
  document.head.appendChild(gtagScript);

  // Handle script load completion
  gtagScript.onload = function () {
    isLoaded = true;

    // Initialize data layer
    window.dataLayer = window.dataLayer || [];

    // Define gtag function
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }

    // Initialize GA4
    gtag("js", new Date());
    gtag("config", tagID);

    // Send initial event
    if (data) {
      gtag(name, event, data);
    } else {
      gtag(name, event);
    }
  };
};

/**
 * Push an event to Google Analytics 4
 *
 * This function loads the GA4 script if not already loaded and pushes an event.
 * It's useful for tracking events after the initial page load.
 *
 * @param name - Event name to track
 * @param event - Event type from GAEventType
 * @param data - Optional event data and parameters
 *
 * @example
 * ```typescript
 * // Track purchase event
 * pushEvent("purchase", "purchase", {
 *   transaction_id: "T_12345",
 *   value: 99.99,
 *   currency: "USD",
 *   items: [{
 *     item_id: "SKU_123",
 *     item_name: "Product Name",
 *     price: 99.99,
 *     quantity: 1
 *   }]
 * });
 *
 * // Track add to cart event
 * pushEvent("add_to_cart", "add_to_cart", {
 *   currency: "USD",
 *   value: 29.99,
 *   items: [{
 *     item_id: "SKU_456",
 *     item_name: "Another Product",
 *     price: 29.99,
 *     quantity: 1
 *   }]
 * });
 * ```
 */
export const pushEvent = (
  name: string,
  event: GAEventType,
  data?: GAEventData
): void => {
  // Create gtag script element
  const gtagScript = document.createElement("script");
  gtagScript.type = "text/javascript";
  gtagScript.setAttribute(
    "src",
    `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`
  );
  document.head.appendChild(gtagScript);

  // Handle script load completion
  gtagScript.onload = function () {
    // Initialize data layer
    window.dataLayer = window.dataLayer || [];

    // Define gtag function
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }

    // Initialize GA4
    gtag("js", new Date());
    gtag("config", ga4Id);

    // Send event
    if (data) {
      gtag(name, event, data);
    } else {
      gtag(name, event);
    }
  };
};

/**
 * Direct gtag function for immediate event pushing
 *
 * This function directly pushes events to the data layer without loading scripts.
 * Use this when GA4 is already loaded and you want to track events immediately.
 *
 * @param name - Event name to track
 * @param event - Event type from GAEventType
 * @param data - Optional event data and parameters
 *
 * @example
 * ```typescript
 * // Track page view
 * gtag("page_view", "page_view", {
 *   page_title: "Product Page",
 *   page_location: window.location.href
 * });
 *
 * // Track custom event
 * gtag("button_click", "custom", {
 *   event_category: "engagement",
 *   event_label: "cta_button"
 * });
 * ```
 */
export const gtag = (
  name: string,
  event: GAEventType,
  data?: GAEventData
): void => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push([name, event, data]);
};

/**
 * Check if Google Analytics is loaded
 *
 * @returns boolean - True if GA4 script is loaded
 */
export const isGALoaded = (): boolean => {
  return isLoaded;
};

/**
 * Get current GA4 measurement ID
 *
 * @returns string - Current GA4 measurement ID or empty string
 */
export const getGA4Id = (): string => {
  return ga4Id;
};

/**
 * Track page view event
 *
 * Convenience function for tracking page views with common parameters.
 *
 * @param pageTitle - Title of the page
 * @param pageLocation - URL of the page (defaults to current location)
 *
 * @example
 * ```typescript
 * // Track current page view
 * trackPageView("Home Page");
 *
 * // Track specific page view
 * trackPageView("Product Detail", "https://example.com/product/123");
 * ```
 */
export const trackPageView = (
  pageTitle: string,
  pageLocation?: string
): void => {
  const location = pageLocation || window.location.href;

  gtag("page_view", "page_view", {
    page_title: pageTitle,
    page_location: location,
    page_referrer: document.referrer,
  });
};

/**
 * Track purchase event
 *
 * Convenience function for tracking purchase events with proper structure.
 *
 * @param transactionId - Unique transaction ID
 * @param value - Total transaction value
 * @param currency - Currency code (default: "USD")
 * @param items - Array of purchased items
 *
 * @example
 * ```typescript
 * trackPurchase("T_12345", 99.99, "USD", [
 *   {
 *     item_id: "SKU_123",
 *     item_name: "Product Name",
 *     price: 99.99,
 *     quantity: 1
 *   }
 * ]);
 * ```
 */
export const trackPurchase = (
  transactionId: string,
  value: number,
  currency: string = "USD",
  items?: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>
): void => {
  gtag("purchase", "purchase", {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items,
  });
};

/**
 * Track add to cart event
 *
 * Convenience function for tracking add to cart events.
 *
 * @param itemId - Product item ID
 * @param itemName - Product name
 * @param price - Product price
 * @param quantity - Quantity added (default: 1)
 * @param currency - Currency code (default: "USD")
 *
 * @example
 * ```typescript
 * trackAddToCart("SKU_123", "Product Name", 29.99, 2, "USD");
 * ```
 */
export const trackAddToCart = (
  itemId: string,
  itemName: string,
  price: number,
  quantity: number = 1,
  currency: string = "USD"
): void => {
  gtag("add_to_cart", "add_to_cart", {
    currency: currency,
    value: price * quantity,
    items: [
      {
        item_id: itemId,
        item_name: itemName,
        price: price,
        quantity: quantity,
      },
    ],
  });
};
