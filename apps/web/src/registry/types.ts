export type Theme = {
    name: string;
    label: string;
    activeColor: string;
    cssVars: {
        light: Record<string, string>;
        dark: Record<string, string>;
    };
};
