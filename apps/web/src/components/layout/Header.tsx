import { Eye, EyeOff, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { ModeToggle } from "../ui/ModeToggle";

export function Header() {
    const location = useLocation();
    const { logout, user } = useAuth();

    const isActive = (path: string) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    const getLinkClass = (path: string) => {
        return cn(
            "text-sm font-medium px-3 py-2 transition-all border-b-2",
            isActive(path)
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
        );
    };

    return (
        <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link to="/" className="font-bold text-xl flex items-center gap-2">
                        FinanceFreedom
                    </Link>
                    <nav className="hidden md:flex gap-2">
                        <Link to="/" className={getLinkClass("/")}>
                            Dashboard
                        </Link>
                        <Link to="/accounts" className={getLinkClass("/accounts")}>
                            Accounts
                        </Link>
                        <Link to="/debts" className={getLinkClass("/debts")}>
                            Debts
                        </Link>
                        <Link to="/income" className={getLinkClass("/income")}>
                            Income
                        </Link>
                        <Link
                            to="/income/projection"
                            className={getLinkClass("/income/projection")}
                        >
                            Projection
                        </Link>
                        <Link to="/investments" className={getLinkClass("/investments")}>
                            Investments
                        </Link>
                        <Link to="/goals" className={getLinkClass("/goals")}>
                            Metas
                        </Link>
                        <Link to="/transactions" className={getLinkClass("/transactions")}>
                            Transactions
                        </Link>
                        <Link to="/import" className={getLinkClass("/import")}>
                            Import
                        </Link>
                        <Link to="/categories" className={getLinkClass("/categories")}>
                            Categorias
                        </Link>
                        <Link to="/fixed-expenses" className={getLinkClass("/fixed-expenses")}>
                            Fixas
                        </Link>
                        <Link to="/settings" className={getLinkClass("/settings")}>
                            Settings
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        to="/profile"
                        className="text-sm font-medium mr-2 hidden md:inline-block hover:underline"
                    >
                        {user?.email}
                    </Link>
                    <PrivacyToggle />
                    <ModeToggle />
                    <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                        <LogOut className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}

function PrivacyToggle() {
    const { isObfuscated, toggleObfuscation } = usePrivacy();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleObfuscation}
            title={isObfuscated ? "Show values" : "Hide values"}
        >
            {isObfuscated ? (
                <EyeOff className="h-[1.2rem] w-[1.2rem]" />
            ) : (
                <Eye className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle privacy mode</span>
        </Button>
    );
}
