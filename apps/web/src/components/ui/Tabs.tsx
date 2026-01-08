import * as React from "react";
import { cn } from "../../lib/utils";

interface TabsContextType {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

function useTabs() {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error("Tabs compound components must be used within Tabs");
    }
    return context;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    (
        { defaultValue, value, onValueChange, className, children, ...props },
        ref
    ) => {
        const [activeTabState, setActiveTabState] =
            React.useState(defaultValue);

        const activeTab = value !== undefined ? value : activeTabState;
        const setActiveTab = React.useCallback(
            (newValue: string) => {
                if (onValueChange) {
                    onValueChange(newValue);
                }
                setActiveTabState(newValue);
            },
            [onValueChange]
        );

        return (
            <TabsContext.Provider value={{ activeTab, setActiveTab }}>
                <div ref={ref} className={cn("w-full", className)} {...props}>
                    {children}
                </div>
            </TabsContext.Provider>
        );
    }
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-4",
            className
        )}
        {...props}
    />
));
TabsList.displayName = "TabsList";

interface TabsTriggerProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, ...props }, ref) => {
        const { activeTab, setActiveTab } = useTabs();
        const isActive = activeTab === value;

        return (
            <button
                ref={ref}
                type="button"
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    isActive
                        ? "bg-background text-foreground shadow-sm"
                        : "hover:bg-background/50 hover:text-foreground/70",
                    className
                )}
                onClick={() => setActiveTab(value)}
                {...props}
            />
        );
    }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, ...props }, ref) => {
        const { activeTab } = useTabs();

        if (activeTab !== value) return null;

        return (
            <div
                ref={ref}
                className={cn(
                    "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
                    className
                )}
                {...props}
            />
        );
    }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
