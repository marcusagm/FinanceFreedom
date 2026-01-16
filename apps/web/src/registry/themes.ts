import type { Theme } from "./types";

export type { Theme } from "./types";

const themeModules = (import.meta as any).glob("./themes/*.ts", {
    eager: true,
});

export const themes: Theme[] = Object.values(themeModules).map(
    (module: any) => module.theme
);
