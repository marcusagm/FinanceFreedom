import type { Theme } from "./types";

export type { Theme } from "./types";

const themeModules = import.meta.glob<true, string, { theme: Theme }>(
    "./themes/*.ts",
    {
        eager: true,
    }
);

export const themes: Theme[] = Object.values(themeModules).map(
    (module) => module.theme
);
