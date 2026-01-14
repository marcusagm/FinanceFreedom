import { type ClassValue, clsx } from "clsx";
import type React from "react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ColorInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void; // Added for RHF
    name?: string; // Added for RHF
    className?: string;
}

export function ColorInput({ label, value, onChange, onBlur, name, className }: ColorInputProps) {
    const [inputValue, setInputValue] = useState(value);

    // Sync input value if external value changes (and is valid)
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        onChange(val);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.toUpperCase();

        // Remove non-hex characters
        val = val.replace(/[^0-9A-F]/g, "");

        // Ensure # prefix
        if (!val.startsWith("#")) {
            val = "#" + val;
        }

        // Limit length
        if (val.length <= 7) {
            setInputValue(val);
        }
    };

    const handleBlur = () => {
        // Strict Validation Logic
        const hexRegex = /^#[0-9A-F]{6}$/;

        // 1. If perfectly valid, commit it.
        if (hexRegex.test(inputValue)) {
            onChange(inputValue);
            if (onBlur) onBlur();
            return;
        }

        // 2. If short hex (#FFF), expand it
        const shortHexRegex = /^#[0-9A-F]{3}$/;
        if (shortHexRegex.test(inputValue)) {
            const r = inputValue[1];
            const g = inputValue[2];
            const b = inputValue[3];
            const expanded = `#${r}${r}${g}${g}${b}${b}`;
            setInputValue(expanded);
            onChange(expanded);
            if (onBlur) onBlur();
            return;
        }

        // 3. If invalid (e.g. #FF, #ZZZ, empty), REVERT to last known valid prop value.
        // Or default to black if prop is somehow broken.
        setInputValue(value || "#000000");
        if (onBlur) onBlur();
    };

    return (
        <div className={cn("flex flex-col items-start gap-1.5 w-full", className)}>
            {label && (
                <label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
            )}
            <div className="flex gap-2 items-center w-full">
                <input
                    type="color"
                    name={name}
                    value={value}
                    onChange={handleNativeChange}
                    // We don't blur the native input usually?
                    className="h-10 w-12 p-0 border-0 bg-transparent cursor-pointer rounded-md overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-input [&::-webkit-color-swatch]:rounded-md"
                />
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleTextChange}
                    onBlur={handleBlur}
                    className="flex-1 h-10 uppercase rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="#000000"
                    maxLength={7}
                />
            </div>
        </div>
    );
}
