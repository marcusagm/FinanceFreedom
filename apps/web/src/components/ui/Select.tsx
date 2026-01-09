import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
        <div
            className={cn(
                "flex flex-col items-start gap-1.5 w-full",
                className
            )}
            ref={containerRef}
        >
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                    {label}
                </label>
            )}

            <div className="relative w-full">
                <button
                    type="button"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{currentLabel || placeholder}</span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                </button>

                {isOpen && (
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full max-h-60 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md z-50 p-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={cn(
                                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                    value === option.value &&
                                        "bg-accent text-accent-foreground font-medium"
                                )}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="flex items-center justify-between w-full">
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
