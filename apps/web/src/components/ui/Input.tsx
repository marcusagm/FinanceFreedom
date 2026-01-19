import React from "react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Combine standard Input props with Currency specific props
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    currency?: boolean; // If true, behaves as currency input
    onValueChange?: NumericFormatProps["onValueChange"];
}

import { useTranslation } from "react-i18next";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, currency, ...props }, ref) => {
        const { i18n } = useTranslation();
        const inputClass = cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
        );

        const isPtBr = i18n.language.toLowerCase().startsWith("pt");
        const currencyPrefix = isPtBr ? "R$ " : "$ ";
        const thousandSeparator = isPtBr ? "." : ",";
        const decimalSeparator = isPtBr ? "," : ".";

        const content = currency ? (
            <NumericFormat
                getInputRef={ref}
                className={inputClass}
                thousandSeparator={thousandSeparator}
                decimalSeparator={decimalSeparator}
                allowedDecimalSeparators={[",", "."]}
                prefix={currencyPrefix}
                decimalScale={2}
                fixedDecimalScale
                {...(props as NumericFormatProps)}
            />
        ) : (
            <input ref={ref} className={inputClass} {...props} />
        );

        if (!label) return content;

        return (
            <div className="flex flex-col items-start gap-1.5 w-full">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
                {content}
            </div>
        );
    },
);
Input.displayName = "Input";
