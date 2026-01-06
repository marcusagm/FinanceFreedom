import React from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import "./Input.css";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Combine standard Input props with Currency specific props
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    currency?: boolean; // If true, behaves as currency input
    onValueChange?: NumericFormatProps["onValueChange"];
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, currency, ...props }, ref) => {
        const inputClass = cn("input", className);

        const content = currency ? (
            <NumericFormat
                getInputRef={ref}
                className={inputClass}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                {...(props as NumericFormatProps)}
            />
        ) : (
            <input ref={ref} className={inputClass} {...props} />
        );

        if (!label) return content;

        return (
            <div className="input-wrapper">
                <label className="input-label">{label}</label>
                {content}
            </div>
        );
    }
);
Input.displayName = "Input";
