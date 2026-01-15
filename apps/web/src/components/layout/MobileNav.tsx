import {
    ArrowRightLeft,
    CreditCard,
    DollarSign,
    Home,
    Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../ui/Sheet";
import { Sidebar } from "./Sidebar";

export function MobileNav() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50 safe-area-bottom">
            <nav className="flex items-center justify-around h-16 px-1">
                <Link
                    to="/"
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors",
                        isActive("/")
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary"
                    )}
                >
                    <Home className="h-5 w-5" />
                    <span className="scale-[0.9]">Início</span>
                </Link>
                <Link
                    to="/transactions"
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors",
                        isActive("/transactions")
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary"
                    )}
                >
                    <ArrowRightLeft className="h-5 w-5" />
                    <span className="scale-[0.9]">Transações</span>
                </Link>
                <Link
                    to="/income"
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors",
                        isActive("/income")
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary"
                    )}
                >
                    <DollarSign className="h-5 w-5" />
                    <span className="scale-[0.9]">Renda</span>
                </Link>
                <Link
                    to="/debts"
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors",
                        isActive("/debts")
                            ? "text-primary"
                            : "text-muted-foreground hover:text-primary"
                    )}
                >
                    <CreditCard className="h-5 w-5" />
                    <span className="scale-[0.9]">Dívidas</span>
                </Link>

                <Sheet>
                    <SheetTrigger asChild>
                        <button
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors text-muted-foreground hover:text-primary"
                            )}
                        >
                            <Menu className="h-5 w-5" />
                            <span className="scale-[0.9]">Menu</span>
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="p-0 border-r w-[80%] max-w-75"
                    >
                        <Sidebar className="flex w-full h-full border-none" />
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    );
}
