import React, { useState, useEffect } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import "./ColorInput.css";

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

export function ColorInput({
    label,
    value,
    onChange,
    onBlur,
    name,
    className,
}: ColorInputProps) {
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
        <div className={cn("color-input-wrapper", className)}>
            {label && <label className="color-input-label">{label}</label>}
            <div className="color-input-container">
                <input
                    type="color"
                    name={name}
                    value={value}
                    onChange={handleNativeChange}
                    // We don't blur the native input usually?
                    className="color-input-native"
                />
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleTextChange}
                    onBlur={handleBlur}
                    className="color-input-hex"
                    placeholder="#000000"
                    maxLength={7}
                />
            </div>
        </div>
    );
}
