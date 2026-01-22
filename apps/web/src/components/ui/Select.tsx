import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
    SelectRoot,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "./SelectPrimitive";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface Option {
    value: string;
    label: string;
}

export interface SelectProps {
    label?: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

export function Select({
    label,
    value,
    options,
    onChange,
    className,
    placeholder,
    disabled,
}: SelectProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-start gap-1.5 w-full",
                className,
            )}
        >
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                    {label}
                </label>
            )}
            <SelectRoot
                value={value}
                onValueChange={onChange}
                disabled={disabled}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </SelectRoot>
        </div>
    );
}

export {
    SelectRoot,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "./SelectPrimitive";
