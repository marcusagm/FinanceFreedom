import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Wallet,
    ArrowRightLeft,
    DollarSign,
    Settings as SettingsIcon,
} from "lucide-react";
import { Header } from "./Header";
import { cn } from "../../lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
                <nav className="flex items-center justify-around h-16">
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
                        <span>Início</span>
                    </Link>
                    <Link
                        to="/accounts"
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors",
                            isActive("/accounts")
                                ? "text-primary"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <Wallet className="h-5 w-5" />
                        <span>Contas</span>
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
                        <span>Transações</span>
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
                        <span>Renda</span>
                    </Link>
                    <Link
                        to="/settings"
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors",
                            isActive("/settings")
                                ? "text-primary"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <SettingsIcon className="h-5 w-5" />
                        <span>Config</span>
                    </Link>
                </nav>
            </div>
        </div>
    );
}
