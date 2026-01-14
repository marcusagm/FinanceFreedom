import { X } from "lucide-react";
import type React from "react";
import { Button } from "./Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-background rounded-lg shadow-lg border border-border">
                <div className="flex items-center justify-between p-6 pb-4 border-b border-border/50">
                    <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>
                <div className="p-6 pt-4">{children}</div>
                {footer && (
                    <div className="flex items-center justify-end p-6 pt-0 space-x-2">{footer}</div>
                )}
            </div>
        </div>
    );
}
