import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import "./Select.css";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export function Select({
    label,
    value,
    options,
    onChange,
    className,
    placeholder,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentLabel = options.find((o) => o.value === value)?.label || value;

    return (
        <div className={cn("select-wrapper", className)} ref={containerRef}>
            {label && <label className="select-label">{label}</label>}

            <div className="select-container">
                <button
                    type="button"
                    className="select-trigger"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{currentLabel || placeholder}</span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                </button>

                {isOpen && (
                    <div className="select-dropdown">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={cn(
                                    "select-item",
                                    value === option.value &&
                                        "select-item--selected"
                                )}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    {option.label}
                                    {value === option.value && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
