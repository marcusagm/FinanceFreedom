import { createContext, useContext, useEffect, useState } from "react";
import { systemConfigService } from "../../services/system-config.service";
import { themes } from "../../registry/themes";
import { useAuth } from "../../contexts/AuthContext";

export type Theme = "dark" | "light" | "system";
export type ThemeColor = string;

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    defaultPrimaryColor?: ThemeColor;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    primaryColor: ThemeColor;
    radius: number;
    privacyMode: boolean;
    setTheme: (theme: Theme) => void;
    setPrimaryColor: (color: ThemeColor) => void;
    setRadius: (radius: number) => void;
    setPrivacyMode: (enabled: boolean) => void;
};

const initialState: ThemeProviderState = {
    theme: "system",
    primaryColor: "emerald",
    radius: 0.5,
    privacyMode: false,
    setTheme: () => null,
    setPrimaryColor: () => null,
    setRadius: () => null,
    setPrivacyMode: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = "system",
    defaultPrimaryColor = "emerald",
    storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
    const { isAuthenticated } = useAuth();

    const [theme, setThemeState] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    );
    const [primaryColor, setPrimaryColorState] = useState<ThemeColor>(
        () =>
            (localStorage.getItem(`${storageKey}-primary`) as ThemeColor) ||
            defaultPrimaryColor
    );
    const [radius, setRadiusState] = useState<number>(() => {
        const stored = localStorage.getItem(`${storageKey}-radius`);
        return stored ? parseFloat(stored) : 0.5;
    });
    const [privacyMode, setPrivacyModeState] = useState<boolean>(() => {
        const stored = localStorage.getItem(`${storageKey}-privacy`);
        return stored === "true";
    });

    // Load settings - ONLY if authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            // Force default theme for public pages
            setPrimaryColorState("zinc");
            return;
        }

        const loadSettings = async () => {
            try {
                const configs = await systemConfigService.getAll();

                // Theme Mode
                if (
                    configs["theme.mode"] &&
                    ["dark", "light", "system"].includes(configs["theme.mode"])
                ) {
                    const mode = configs["theme.mode"] as Theme;
                    setThemeState(mode);
                    localStorage.setItem(storageKey, mode);
                }

                // Primary Color
                if (
                    configs["theme.primary"] &&
                    themes.find((t) => t.name === configs["theme.primary"])
                ) {
                    const color = configs["theme.primary"] as ThemeColor;
                    setPrimaryColorState(color);
                    localStorage.setItem(`${storageKey}-primary`, color);
                }

                // Radius
                if (configs["theme.radius"]) {
                    const r = parseFloat(configs["theme.radius"]);
                    if (!isNaN(r)) {
                        setRadiusState(r);
                        localStorage.setItem(`${storageKey}-radius`, String(r));
                    }
                }

                // Privacy Mode
                if (configs["privacy.defaultMode"]) {
                    const enabled = configs["privacy.defaultMode"] === "true";
                    setPrivacyModeState(enabled);
                    localStorage.setItem(
                        `${storageKey}-privacy`,
                        String(enabled)
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load theme settings from backend",
                    error
                );
            }
        };
        loadSettings();
    }, [storageKey, isAuthenticated]);

    // Handle Theme Mode Change (activates .light or .dark class)
    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const mediaQuery = window.matchMedia(
                "(prefers-color-scheme: dark)"
            );
            const applySystemTheme = () => {
                const systemTheme = mediaQuery.matches ? "dark" : "light";
                root.classList.remove("light", "dark");
                root.classList.add(systemTheme);
            };

            applySystemTheme();
            mediaQuery.addEventListener("change", applySystemTheme);

            return () => {
                mediaQuery.removeEventListener("change", applySystemTheme);
            };
        }

        root.classList.add(theme);
    }, [theme]);

    // Apply Full Theme Palette
    useEffect(() => {
        const root = window.document.documentElement;
        const themeConfig = themes.find((t) => t.name === primaryColor);

        if (!themeConfig) return;

        // Determine if we are effectively in dark mode
        const isDark =
            theme === "dark" ||
            (theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);

        const cssVars = isDark
            ? themeConfig.cssVars.dark
            : themeConfig.cssVars.light;

        // Apply all variables for the color scheme
        Object.entries(cssVars).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }, [primaryColor, theme]); // Re-run when color OR theme mode changes

    // Apply Radius
    useEffect(() => {
        const root = window.document.documentElement;
        root.style.setProperty("--radius", `${radius}rem`);
    }, [radius]);

    const setTheme = (newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);
        if (isAuthenticated) {
            systemConfigService
                .set("theme.mode", newTheme)
                .catch(console.error);
        }
    };

    const setPrimaryColor = (newColor: ThemeColor) => {
        localStorage.setItem(`${storageKey}-primary`, newColor);
        setPrimaryColorState(newColor);
        if (isAuthenticated) {
            systemConfigService
                .set("theme.primary", newColor)
                .catch(console.error);
        }
    };

    const setRadius = (newRadius: number) => {
        localStorage.setItem(`${storageKey}-radius`, String(newRadius));
        setRadiusState(newRadius);
        if (isAuthenticated) {
            systemConfigService
                .set("theme.radius", String(newRadius))
                .catch(console.error);
        }
    };

    const setPrivacyMode = (enabled: boolean) => {
        localStorage.setItem(`${storageKey}-privacy`, String(enabled));
        setPrivacyModeState(enabled);
        if (isAuthenticated) {
            systemConfigService
                .set("privacy.defaultMode", String(enabled))
                .catch(console.error);
        }
    };

    const value = {
        theme,
        primaryColor,
        radius,
        privacyMode,
        setTheme,
        setPrimaryColor,
        setRadius,
        setPrivacyMode,
    };

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};
