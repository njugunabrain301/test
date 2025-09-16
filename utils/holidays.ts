/**
 * Holiday theme utilities for seasonal decorations
 *
 * This module provides holiday-themed images and logic for determining
 * which holiday decorations to display based on the current date.
 */

/**
 * Image object interface for holiday decorations
 */
export interface HolidayImage {
  src: string;
  width: number;
  height: number;
}

/**
 * Holiday configuration interface
 */
export interface HolidayConfig {
  name: string;
  sideBanner: HolidayImage;
  centerBanner: HolidayImage;
  cardCorner?: HolidayImage;
}

/**
 * Holiday type for better type safety
 */
export type HolidayType = "christmas" | "newYear" | "valentines" | null;

/**
 * Date range interface for holiday periods
 */
export interface HolidayDateRange {
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

/**
 * Holiday date ranges configuration
 */
export const HOLIDAY_DATE_RANGES: Record<string, HolidayDateRange> = {
  christmas: {
    startMonth: 12,
    startDay: 23,
    endMonth: 12,
    endDay: 28,
  },
  newYear: {
    startMonth: 12,
    startDay: 30,
    endMonth: 1,
    endDay: 3,
  },
  valentines: {
    startMonth: 2,
    startDay: 13,
    endMonth: 2,
    endDay: 15,
  },
};

/**
 * Christmas holiday images
 *
 * USAGE:
 * - Import: import { xmasBanner, xmasHat, xmasTree } from '@/utils/holidays'
 * - Use with Next.js Image: <Image {...xmasBanner} alt="Christmas Banner" />
 */
export const xmasBanner: HolidayImage = {
  src: "https://storage.googleapis.com/test-bucket001/images/xmas-banner.gif",
  width: 600,
  height: 200,
};

export const xmasHat: HolidayImage = {
  src: "https://storage.googleapis.com/test-bucket001/images/xmas-hat.gif",
  width: 64,
  height: 64,
};

export const xmasTree: HolidayImage = {
  src: "https://storage.googleapis.com/test-bucket001/images/xmas-tree.gif",
  width: 120,
  height: 180,
};

/**
 * New Year holiday images
 *
 * USAGE:
 * - Import: import { fireworks, newYear } from '@/utils/holidays'
 * - Use with Next.js Image: <Image {...fireworks} alt="Fireworks" />
 */
export const fireworks: HolidayImage = {
  src: "https://storage.googleapis.com/test-bucket001/images/fireworks.gif",
  width: 600,
  height: 200,
};

export const newYear: HolidayImage = {
  src: "https://storage.googleapis.com/test-bucket001/images/new-year.gif",
  width: 600,
  height: 200,
};

/**
 * Valentine's Day holiday images
 *
 * USAGE:
 * - Import: import { vals_banner, vals } from '@/utils/holidays'
 * - Use with Next.js Image: <Image {...vals_banner} alt="Valentine's Banner" />
 */
export const vals_banner: HolidayImage = {
  src: "https://storage.googleapis.com/test-bucket001/images/vals-banner.gif",
  width: 600,
  height: 200,
};

export const vals: HolidayImage = {
  src: "https://storage.googleapis.com/test-bucket001/images/vals.gif",
  width: 120,
  height: 120,
};

/**
 * Holiday configurations for each supported holiday
 */
export const HOLIDAY_CONFIGS: Record<string, HolidayConfig> = {
  christmas: {
    name: "christmas",
    sideBanner: xmasTree,
    centerBanner: xmasBanner,
    cardCorner: xmasHat,
  },
  newYear: {
    name: "Happy New Year",
    sideBanner: fireworks,
    centerBanner: newYear,
  },
  valentines: {
    name: "Valentines",
    sideBanner: vals,
    centerBanner: vals_banner,
  },
};

/**
 * Check if a given date falls within a holiday date range
 *
 * @param date - Date to check
 * @param range - Holiday date range to check against
 * @returns boolean - True if date is within the holiday range
 *
 * @example
 * ```typescript
 * const today = new Date();
 * const isChristmas = isDateInHolidayRange(today, HOLIDAY_DATE_RANGES.christmas);
 * ```
 */
export const isDateInHolidayRange = (
  date: Date,
  range: HolidayDateRange
): boolean => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() returns 0-11

  // Handle year-end holidays (December to January)
  if (range.startMonth === 12 && range.endMonth === 1) {
    return (
      (month === 12 && day >= range.startDay) ||
      (month === 1 && day <= range.endDay)
    );
  }

  // Handle same-month holidays
  return (
    month === range.startMonth && day >= range.startDay && day <= range.endDay
  );
};

/**
 * Get the current holiday based on today's date
 *
 * This function checks the current date against predefined holiday ranges
 * and returns the appropriate holiday configuration if a holiday is active.
 *
 * @returns HolidayConfig | null - Holiday configuration or null if no holiday is active
 *
 * @example
 * ```typescript
 * const currentHoliday = getHoliday();
 * if (currentHoliday) {
 *   console.log(`It's ${currentHoliday.name}!`);
 *   // Use currentHoliday.sideBanner, currentHoliday.centerBanner, etc.
 * }
 * ```
 */
export const getHoliday = (): HolidayConfig | null => {
  const today = new Date();

  // Check each holiday date range
  for (const [holidayKey, dateRange] of Object.entries(HOLIDAY_DATE_RANGES)) {
    if (isDateInHolidayRange(today, dateRange)) {
      return HOLIDAY_CONFIGS[holidayKey];
    }
  }

  return null;
};

/**
 * Get holiday configuration for a specific date
 *
 * @param date - Date to check for holidays
 * @returns HolidayConfig | null - Holiday configuration or null if no holiday on that date
 *
 * @example
 * ```typescript
 * const christmasDate = new Date(2024, 11, 25); // December 25, 2024
 * const holiday = getHolidayForDate(christmasDate);
 * // Returns Christmas configuration
 * ```
 */
export const getHolidayForDate = (date: Date): HolidayConfig | null => {
  // Check each holiday date range
  for (const [holidayKey, dateRange] of Object.entries(HOLIDAY_DATE_RANGES)) {
    if (isDateInHolidayRange(date, dateRange)) {
      return HOLIDAY_CONFIGS[holidayKey];
    }
  }

  return null;
};

/**
 * Get all available holiday types
 *
 * @returns string[] - Array of all supported holiday names
 */
export const getAvailableHolidays = (): string[] => {
  return Object.keys(HOLIDAY_CONFIGS);
};

/**
 * Check if a specific holiday is currently active
 *
 * @param holidayName - Name of the holiday to check
 * @returns boolean - True if the holiday is currently active
 *
 * @example
 * ```typescript
 * const isChristmasActive = isHolidayActive("christmas");
 * ```
 */
export const isHolidayActive = (holidayName: string): boolean => {
  const today = new Date();
  const dateRange = HOLIDAY_DATE_RANGES[holidayName];

  if (!dateRange) {
    return false;
  }

  return isDateInHolidayRange(today, dateRange);
};

/**
 * Get the next upcoming holiday
 *
 * @returns HolidayConfig | null - Next holiday configuration or null if no upcoming holidays
 *
 * @example
 * ```typescript
 * const nextHoliday = getNextHoliday();
 * if (nextHoliday) {
 *   console.log(`Next holiday: ${nextHoliday.name}`);
 * }
 * ```
 */
export const getNextHoliday = (): HolidayConfig | null => {
  const today = new Date();
  const currentYear = today.getFullYear();

  // Check holidays for current year and next year
  for (let year = currentYear; year <= currentYear + 1; year++) {
    for (const [holidayKey, dateRange] of Object.entries(HOLIDAY_DATE_RANGES)) {
      const holidayStart = new Date(
        year,
        dateRange.startMonth - 1,
        dateRange.startDay
      );

      if (holidayStart >= today) {
        return HOLIDAY_CONFIGS[holidayKey];
      }
    }
  }

  return null;
};

/**
 * Get days until next holiday
 *
 * @returns number | null - Days until next holiday or null if no upcoming holidays
 *
 * @example
 * ```typescript
 * const daysUntilHoliday = getDaysUntilNextHoliday();
 * if (daysUntilHoliday !== null) {
 *   console.log(`${daysUntilHoliday} days until next holiday`);
 * }
 * ```
 */
export const getDaysUntilNextHoliday = (): number | null => {
  const nextHoliday = getNextHoliday();
  if (!nextHoliday) {
    return null;
  }

  const today = new Date();
  const currentYear = today.getFullYear();

  // Find the next occurrence of this holiday
  for (const [holidayKey, dateRange] of Object.entries(HOLIDAY_DATE_RANGES)) {
    if (HOLIDAY_CONFIGS[holidayKey].name === nextHoliday.name) {
      const holidayStart = new Date(
        currentYear,
        dateRange.startMonth - 1,
        dateRange.startDay
      );

      // If this year's holiday has passed, check next year
      if (holidayStart < today) {
        holidayStart.setFullYear(currentYear + 1);
      }

      const timeDiff = holidayStart.getTime() - today.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
  }

  return null;
};
