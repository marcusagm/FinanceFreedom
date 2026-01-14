import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { format, parse, isValid, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { PatternFormat } from "react-number-format";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Button } from "./Button";
import { Calendar } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
    (
        { date, setDate, className, placeholder = "dd/mm/aaaa", disabled },
        ref
    ) => {
        const [inputValue, setInputValue] = useState(
            date ? format(date, "dd/MM/yyyy") : ""
        );
        const [isPopoverOpen, setIsPopoverOpen] = useState(false);

        // Track the last valid date timestamp to prevent overwriting input during typing
        const lastDateRef = useRef<number | undefined>(
            date ? startOfDay(date).getTime() : undefined
        );

        // Sync input with date prop only when the date effectively changes
        useEffect(() => {
            const normalizedTimestamp = date
                ? startOfDay(date).getTime()
                : undefined;

            if (normalizedTimestamp !== lastDateRef.current) {
                lastDateRef.current = normalizedTimestamp;
                if (date) {
                    setInputValue(format(date, "dd/MM/yyyy"));
                } else {
                    setInputValue("");
                }
            }
        }, [date]);

        const handleInputChange = (values: {
            value: string;
            formattedValue: string;
        }) => {
            const value = values.formattedValue;
            setInputValue(value);

            // Try to parse dd/MM/yyyy
            if (value.length === 10) {
                const parsedDate = parse(value, "dd/MM/yyyy", new Date());
                if (isValid(parsedDate)) {
                    // Verify if it's actually different to avoid unnecessary updates
                    // Normalize both to start of day for comparison
                    const normalizedParsed = startOfDay(parsedDate);
                    const normalizedCurrent = date
                        ? startOfDay(date)
                        : undefined;

                    if (
                        !normalizedCurrent ||
                        normalizedParsed.getTime() !==
                            normalizedCurrent.getTime()
                    ) {
                        setDate(normalizedParsed);
                    }
                }
            } else if (value === "" && date) {
                setDate(undefined);
            }
        };

        const handleCalendarSelect = (newDate: Date | undefined) => {
            if (newDate) {
                // Normalize newDate to start of day before setting
                const normalizedNewDate = startOfDay(newDate);
                setDate(normalizedNewDate);

                // Update local inputs
                setInputValue(format(normalizedNewDate, "dd/MM/yyyy"));
                lastDateRef.current = normalizedNewDate.getTime();
                setIsPopoverOpen(false);
            } else {
                setDate(undefined);
                setInputValue("");
                lastDateRef.current = undefined;
            }
        };

        return (
            <div className={cn("relative flex items-center w-full", className)}>
                <PatternFormat
                    getInputRef={ref} // Forward ref to the actual input
                    format="##/##/####"
                    placeholder={placeholder}
                    mask="_"
                    value={inputValue}
                    onValueChange={handleInputChange}
                    disabled={disabled}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        "pr-10"
                    )}
                />
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 h-10 w-10 text-muted-foreground hover:text-foreground"
                            disabled={disabled}
                        >
                            <CalendarIcon className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleCalendarSelect}
                            initialFocus
                            locale={ptBR}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        );
    }
);

DatePicker.displayName = "DatePicker";
