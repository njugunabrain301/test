import { createTheme, Theme } from "@mui/material";

/**
 * Theme type definition for better type safety
 */
export type ThemeType = "light" | "dark";

/**
 * Custom palette structure for our themes
 */
export interface CustomPalette {
  primary: {
    main: string;
  };
  text: {
    base: string;
    inverted: string;
    alt: string;
  };
  highlight: {
    main: string;
    light: string;
  };
  background: {
    primary: string;
    inverted: string;
    card?: string;
    panel?: string;
  };
  pane: {
    main: string;
  };
  card: {
    main: string;
  };
  panel: {
    main: string;
    border?: string;
    darker?: string;
  };
  "flat-button": {
    main: string;
  };
  "cart-btn": {
    main: string;
    light?: string;
    dark?: string;
    contrastText: string;
  };
  input: {
    main: string;
    light?: string;
    dark?: string;
    border?: string;
  };
  "input-inverted": {
    main: string;
  };
  success: {
    main: string;
  };
  error: {
    main: string;
  };
}

/**
 * Extended theme interface with custom properties
 */
export interface CustomTheme extends Theme {
  ["theme-type"]: ThemeType;
  customPalette: CustomPalette;
}

/**
 * Theme configuration object type
 */
export interface ThemeConfig {
  name: string;
  type: ThemeType;
  description: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  category: "professional" | "creative" | "minimal" | "bold";
}

/**
 * Available theme configurations for easy reference
 */
export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  classic: {
    name: "Classic",
    type: "light",
    description: "Clean and professional blue theme with white background",
    primaryColor: "#1e90ff",
    backgroundColor: "white",
    textColor: "black",
    category: "professional",
  },
  moonlit: {
    name: "Moonlit",
    type: "dark",
    description: "Dark blue theme with elegant contrast",
    primaryColor: "#1e90ff",
    backgroundColor: "#072440",
    textColor: "white",
    category: "professional",
  },
  dawn: {
    name: "Dawn",
    type: "light",
    description: "Warm beige theme with brown accents",
    primaryColor: "#A27B5C",
    backgroundColor: "#DCD7C9",
    textColor: "#2C3639",
    category: "creative",
  },
  autumn: {
    name: "Autumn",
    type: "light",
    description: "Green and yellow autumn-inspired theme",
    primaryColor: "#7A9D54",
    backgroundColor: "#FAE392",
    textColor: "#192f19",
    category: "creative",
  },
  vibrant: {
    name: "Vibrant",
    type: "dark",
    description: "Bold purple theme with high contrast",
    primaryColor: "#7752FE",
    backgroundColor: "#190482",
    textColor: "#fff",
    category: "bold",
  },
  "red-white": {
    name: "Red & White",
    type: "light",
    description: "Red accent theme with clean white background",
    primaryColor: "#F8485E",
    backgroundColor: "#EEEEEE",
    textColor: "#512D6D",
    category: "bold",
  },
  "brilliant-red": {
    name: "Brilliant Red",
    type: "light",
    description: "High contrast red theme with white background",
    primaryColor: "#F8485E",
    backgroundColor: "#ffffff",
    textColor: "#000",
    category: "bold",
  },
};

/**
 * Helper function to create custom themes with extended properties
 */
const createCustomTheme = (
  baseTheme: any,
  customPalette: CustomPalette,
  themeType: ThemeType
): CustomTheme => {
  const theme = createTheme(baseTheme);

  // Extend the theme with custom properties
  return {
    ...theme,
    ["theme-type"]: themeType,
    customPalette,
  } as CustomTheme;
};

/**
 * Material-UI theme configurations
 *
 * USAGE:
 * - Import in components: import { MUIThemes } from '@/utils/Themes/Themes'
 * - Use in ThemeProvider: <ThemeProvider theme={MUIThemes.classic}>
 * - Access in styled components: ${props => props.theme.customPalette.primary.main}
 * - Get theme type: theme["theme-type"] for conditional styling
 */
export const MUIThemes: Record<string, CustomTheme> = {
  classic: createCustomTheme(
    {
      palette: {
        primary: {
          main: "#1e90ff !important",
        },
        success: {
          main: "#2e7d32 !important",
        },
        error: {
          main: "#d32f2f !important",
        },
      },
    },
    {
      primary: {
        main: "#1e90ff !important",
      },
      text: {
        base: "black",
        inverted: "white",
        alt: "#808080",
      },
      highlight: {
        main: "#1e90ff",
        light: "#75b3f0",
      },
      background: {
        primary: "white",
        inverted: "black",
      },
      pane: { main: "#fff" },
      card: { main: "#1e90ff" },
      panel: {
        main: "#eee",
        darker: "#888",
      },
      "flat-button": {
        main: "#000",
      },
      "cart-btn": {
        main: "#000 !important",
        light: "#101010",
        contrastText: "#fff",
      },
      input: {
        main: "#1e90ff",
      },
      "input-inverted": {
        main: "white",
      },
      success: {
        main: "#2e7d32 !important",
      },
      error: {
        main: "#d32f2f !important",
      },
    },
    "light"
  ),

  moonlit: createCustomTheme(
    {
      palette: {
        primary: {
          main: "#1e90ff !important",
        },
        success: {
          main: "#2e7d32 !important",
        },
        error: {
          main: "#d32f2f !important",
        },
      },
    },
    {
      primary: {
        main: "#1e90ff !important",
      },
      text: {
        base: "white",
        inverted: "white",
        alt: "#68abee",
      },
      highlight: {
        main: "#1e90ff",
        light: "#75b3f0",
      },
      background: {
        primary: "#072440",
        inverted: "#041525",
        card: "dodgerblue",
        panel: "#aaa",
      },
      pane: {
        main: "#092c4e",
      },
      card: { main: "#1e90ff" },
      panel: {
        main: "#092c4e",
        border: "#030d17",
      },
      "flat-button": {
        main: "#68abee",
      },
      "cart-btn": {
        main: "#1e90ff !important",
        light: "#71b0ef",
        dark: "#1467b8",
        contrastText: "#fff",
      },
      input: {
        main: "#1e90ff",
        light: "#68abee",
        dark: "#68abee",
        border: "#68abee",
      },
      "input-inverted": {
        main: "white",
      },
      success: {
        main: "#2e7d32 !important",
      },
      error: {
        main: "#d32f2f !important",
      },
    },
    "dark"
  ),

  dawn: createCustomTheme(
    {
      palette: {
        primary: {
          main: "#A27B5C !important",
        },
        success: {
          main: "#2e7d32 !important",
        },
        error: {
          main: "#d32f2f !important",
        },
      },
    },
    {
      primary: {
        main: "#A27B5C !important",
      },
      text: {
        base: "#2C3639",
        inverted: "#DCD7C9",
        alt: "#6f543e",
      },
      highlight: {
        main: "#A27B5C",
        light: "#ab8669",
      },
      background: {
        primary: "#DCD7C9",
        inverted: "#3F4E4F",
        card: "dodgerblue",
        panel: "#aaa",
      },
      pane: {
        main: "#d7d1c1",
      },
      card: {
        main: "#A27B5C",
      },
      panel: {
        main: "#d7d1c1",
        border: "#b7ac8f",
      },
      "flat-button": {
        main: "#3F4E4F",
      },
      "cart-btn": {
        main: "#A27B5C !important",
        light: "#b99b83",
        dark: "#8c6a4f",
        contrastText: "#fff",
      },
      input: {
        main: "#6f543e",
        light: "#3F4E4F",
        dark: "#3F4E4F",
        border: "#6f543e",
      },
      "input-inverted": {
        main: "#DCD7C9",
      },
      success: {
        main: "#2e7d32 !important",
      },
      error: {
        main: "#d32f2f !important",
      },
    },
    "light"
  ),

  autumn: createCustomTheme(
    {
      palette: {
        primary: {
          main: "#7A9D54 !important",
        },
        success: {
          main: "#2e7d32 !important",
        },
        error: {
          main: "#d32f2f !important",
        },
      },
    },
    {
      primary: {
        main: "#7A9D54 !important",
      },
      text: {
        base: "#192f19",
        inverted: "#DCD7C9",
        alt: "#6f543e",
      },
      highlight: {
        main: "#A27B5C",
        light: "#ab8669",
      },
      background: {
        primary: "#FAE392",
        inverted: "#1A5D1A",
      },
      pane: {
        main: "#f9e085",
      },
      card: {
        main: "#7A9D54",
      },
      panel: {
        main: "#e5c658",
        border: "#e5c658",
      },
      "flat-button": {
        main: "#1A5D1A",
      },
      "cart-btn": {
        main: "#A27B5C !important",
        light: "#b99b83",
        dark: "#8c6a4f",
        contrastText: "#fff",
      },
      input: {
        main: "#1A5D1A",
        light: "#227722",
        dark: "#124012",
        border: "#1A5D1A",
      },
      "input-inverted": {
        main: "#DCD7C9",
      },
      success: {
        main: "#2e7d32 !important",
      },
      error: {
        main: "#d32f2f !important",
      },
    },
    "light"
  ),

  vibrant: createCustomTheme(
    {
      palette: {
        primary: {
          main: "#7752FE !important",
        },
        success: {
          main: "#2e7d32 !important",
        },
        error: {
          main: "#d32f2f !important",
        },
      },
    },
    {
      primary: {
        main: "#7752FE !important",
      },
      text: {
        base: "#fff",
        inverted: "#fff",
        alt: "#E5CFF7",
      },
      highlight: {
        main: "#BEADFA",
        light: "#D0BFFF",
      },
      background: {
        primary: "#190482",
        inverted: "#7752FE",
      },
      pane: {
        main: "#1e059e",
      },
      card: {
        main: "#9376fe",
      },
      panel: {
        main: "#1e059e",
        border: "#1e059e",
      },
      "flat-button": {
        main: "#8E8FFA",
      },
      "cart-btn": {
        main: "#8E8FFA !important",
        contrastText: "#fff",
      },
      input: {
        main: "#7752FE",
        light: "#8E8FFA",
        dark: "#7752FE",
        border: "#7752FE",
      },
      "input-inverted": {
        main: "#fff",
      },
      success: {
        main: "#2e7d32 !important",
      },
      error: {
        main: "#d32f2f !important",
      },
    },
    "dark"
  ),

  "red-white": createCustomTheme(
    {
      palette: {
        primary: {
          main: "#F8485E !important",
        },
        success: {
          main: "#2e7d32 !important",
        },
        error: {
          main: "#d32f2f !important",
        },
      },
    },
    {
      primary: {
        main: "#F8485E !important",
      },
      text: {
        base: "#512D6D",
        inverted: "#fff",
        alt: "#F8485E",
      },
      highlight: {
        main: "#D77FA1",
        light: "#E6B2C6",
      },
      background: {
        primary: "#EEEEEE",
        inverted: "#F8485E",
      },
      pane: {
        main: "#FEF6FB",
      },
      card: {
        main: "#F8485E",
      },
      panel: {
        main: "#FEF6FB",
        border: "#FAEDF0",
      },
      "flat-button": {
        main: "#512D6D",
      },
      "cart-btn": {
        main: "#512D6D !important",
        contrastText: "#ffffff",
      },
      input: {
        main: "#512D6D",
        light: "#512D6D",
        dark: "#512D6D",
        border: "#512D6D",
      },
      "input-inverted": {
        main: "#fff",
      },
      success: {
        main: "#2e7d32 !important",
      },
      error: {
        main: "#d32f2f !important",
      },
    },
    "light"
  ),

  "brilliant-red": createCustomTheme(
    {
      palette: {
        primary: {
          main: "#F8485E !important",
        },
        success: {
          main: "#2e7d32 !important",
        },
        error: {
          main: "#d32f2f !important",
        },
      },
    },
    {
      primary: {
        main: "#F8485E !important",
      },
      text: {
        base: "#000",
        inverted: "#fff",
        alt: "#F8485E",
      },
      highlight: {
        main: "#D77FA1",
        light: "#E6B2C6",
      },
      background: {
        primary: "#ffffff",
        inverted: "#FF0000",
      },
      pane: {
        main: "#ffffff",
      },
      card: {
        main: "#F8485E",
      },
      panel: {
        main: "#ffffff",
        border: "#FAEDF0",
      },
      "flat-button": {
        main: "#512D6D",
      },
      "cart-btn": {
        main: "#ff0000 !important",
        contrastText: "#ffffff",
      },
      input: {
        main: "#512D6D",
        light: "#512D6D",
        dark: "#512D6D",
        border: "#512D6D",
      },
      "input-inverted": {
        main: "#fff",
      },
      success: {
        main: "#2e7d32 !important",
      },
      error: {
        main: "#d32f2f !important",
      },
    },
    "light"
  ),
};

/**
 * Utility functions for theme management
 */

/**
 * Get theme configuration by name
 * @param themeName - Name of the theme
 * @returns ThemeConfig or undefined
 */
export const getThemeConfig = (themeName: string): ThemeConfig | undefined => {
  return THEME_CONFIGS[themeName];
};

/**
 * Get all available theme names
 * @returns Array of theme names
 */
export const getAvailableThemes = (): string[] => {
  return Object.keys(MUIThemes);
};

/**
 * Get themes by category
 * @param category - Theme category
 * @returns Array of theme names in the category
 */
export const getThemesByCategory = (
  category: ThemeConfig["category"]
): string[] => {
  return Object.entries(THEME_CONFIGS)
    .filter(([_, config]) => config.category === category)
    .map(([name, _]) => name);
};

/**
 * Get light themes only
 * @returns Array of light theme names
 */
export const getLightThemes = (): string[] => {
  return Object.entries(THEME_CONFIGS)
    .filter(([_, config]) => config.type === "light")
    .map(([name, _]) => name);
};

/**
 * Get dark themes only
 * @returns Array of dark theme names
 */
export const getDarkThemes = (): string[] => {
  return Object.entries(THEME_CONFIGS)
    .filter(([_, config]) => config.type === "dark")
    .map(([name, _]) => name);
};

/**
 * Check if a theme is dark mode
 * @param themeName - Name of the theme
 * @returns boolean
 */
export const isDarkTheme = (themeName: string): boolean => {
  const config = getThemeConfig(themeName);
  return config?.type === "dark";
};

/**
 * Get theme type (light/dark)
 * @param themeName - Name of the theme
 * @returns ThemeType or undefined
 */
export const getThemeType = (themeName: string): ThemeType | undefined => {
  const config = getThemeConfig(themeName);
  return config?.type;
};
