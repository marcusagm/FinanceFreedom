import { Link, useLocation } from "react-router-dom";
import { ModeToggle } from "../ui/ModeToggle";
import { cn } from "../../lib/utils";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/Button";

export function Header() {
    const location = useLocation();

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
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
        );
    };

    return (
        <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="font-bold text-xl flex items-center gap-2"
                    >
                        FinanceFreedom
                    </Link>
                    <nav className="hidden md:flex gap-2">
                        <Link to="/" className={getLinkClass("/")}>
                            Dashboard
                        </Link>
                        <Link
                            to="/accounts"
                            className={getLinkClass("/accounts")}
                        >
                            Contas
                        </Link>
                        <Link to="/debts" className={getLinkClass("/debts")}>
                            Dívidas
                        </Link>
                        <Link to="/income" className={getLinkClass("/income")}>
                            Renda
                        </Link>
                        <Link
                            to="/income/projection"
                            className={getLinkClass("/income/projection")}
                        >
                            Projeção
                        </Link>
                        <Link
                            to="/transactions"
                            className={getLinkClass("/transactions")}
                        >
                            Transações
                        </Link>
                        <Link to="/import" className={getLinkClass("/import")}>
                            Importar
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    <PrivacyToggle />
                    <ModeToggle />
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
            title={isObfuscated ? "Mostrar valores" : "Ocultar valores"}
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
