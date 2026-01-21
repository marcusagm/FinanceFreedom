import {
    ArrowRightLeft,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    DollarSign,
    FileInput,
    Layers,
    LayoutDashboard,
    LogOut,
    Settings,
    Tag,
    Target,
    TrendingUp,
    TrendingDown,
    User,
    Users,
    Wallet,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { ModeToggle } from "../ui/ModeToggle";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { Eye, EyeOff } from "lucide-react";

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const { t } = useTranslation();
    const { logout, user } = useAuth();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const { isObfuscated, toggleObfuscation } = usePrivacy();

    const isActive = (path: string) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    const toggleSidebar = () => setCollapsed(!collapsed);

    const navGroups = [
        {
            label: t("sidebar.general.label"),
            items: [
                {
                    icon: LayoutDashboard,
                    label: t("sidebar.general.dashboard"),
                    href: "/",
                },
                {
                    icon: ArrowRightLeft,
                    label: t("sidebar.general.transactions"),
                    href: "/transactions",
                },
                {
                    icon: Wallet,
                    label: t("sidebar.general.accounts"),
                    href: "/accounts",
                },
                {
                    icon: Users,
                    label: t("persons.title"),
                    href: "/persons",
                },
            ],
        },
        {
            label: t("sidebar.expenses.label"),
            items: [
                {
                    icon: TrendingDown,
                    label: t("sidebar.expenses.debts"),
                    href: "/debts",
                },
                {
                    icon: CreditCard,
                    label: t("sidebar.expenses.creditCards"),
                    href: "/credit-cards",
                },
                {
                    icon: Layers,
                    label: t("sidebar.expenses.fixed"),
                    href: "/fixed-expenses",
                },
            ],
        },
        {
            label: t("sidebar.income.label"),
            items: [
                {
                    icon: DollarSign,
                    label: t("sidebar.income.income"),
                    href: "/income",
                },
                {
                    icon: TrendingUp,
                    label: t("sidebar.income.investments"),
                    href: "/investments",
                },
            ],
        },
        {
            label: t("sidebar.planning.label"),
            items: [
                {
                    icon: Tag,
                    label: t("sidebar.planning.categories"),
                    href: "/categories",
                },
                {
                    icon: Target,
                    label: t("sidebar.planning.goals"),
                    href: "/goals",
                },
                {
                    icon: BarChart3,
                    label: t("sidebar.planning.projection"),
                    href: "/income/projection",
                },
            ],
        },
        {
            label: t("sidebar.system.label"),
            items: [
                {
                    icon: FileInput,
                    label: t("sidebar.system.import"),
                    href: "/import",
                },
                {
                    icon: Settings,
                    label: t("sidebar.system.settings"),
                    href: "/settings",
                },
            ],
        },
    ];

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out h-screen sticky top-0",
                collapsed ? "w-16" : "w-64",
                className,
            )}
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center px-4 border-b border-sidebar-border relative">
                {!collapsed && (
                    <span className="font-bold text-xl text-primary tracking-tight whitespace-nowrap overflow-hidden">
                        FinanceFreedom
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "absolute right-2 text-muted-foreground hover:text-foreground",
                        collapsed && "static mx-auto",
                    )}
                    onClick={toggleSidebar}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6">
                {navGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="px-3">
                        {!collapsed && (
                            <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {group.label}
                            </h4>
                        )}
                        <nav className="space-y-1">
                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                                        isActive(item.href)
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                            : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                                        collapsed && "justify-center px-2",
                                    )}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <item.icon
                                        className={cn(
                                            "h-4 w-4 shrink-0",
                                            isActive(item.href)
                                                ? "text-primary"
                                                : "",
                                        )}
                                    />
                                    {!collapsed && <span>{item.label}</span>}

                                    {/* Tooltip for collapsed state would go here if we had a Tooltip component ready-to-use easily wrapping this */}
                                </Link>
                            ))}
                        </nav>
                    </div>
                ))}
            </div>

            {/* Footer / User Profile */}
            <div className="border-t border-sidebar-border p-3 space-y-2">
                {/* Utilities Row */}
                <div
                    className={cn(
                        "flex items-center gap-1",
                        collapsed ? "flex-col" : "justify-between",
                    )}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleObfuscation}
                        title={
                            isObfuscated
                                ? t("sidebar.toggleObfuscation.show")
                                : t("sidebar.toggleObfuscation.hide")
                        }
                        className="h-8 w-8 text-muted-foreground"
                    >
                        {isObfuscated ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </Button>
                    <div className={cn(collapsed && "hidden")}>
                        <ModeToggle />
                    </div>
                    {collapsed && (
                        /* Mode toggle simpler version for collapsed if needed, but existing ModeToggle might be a dropdown */
                        <div className="scale-75 origin-center">
                            <ModeToggle />
                        </div>
                    )}
                </div>

                <div
                    className={cn(
                        "flex items-center gap-3 rounded-md bg-sidebar-accent/50 p-2",
                        collapsed ? "justify-center p-0 bg-transparent" : "",
                    )}
                >
                    <Link
                        to="/profile"
                        className="flex-1 overflow-hidden flex items-center gap-2 hover:bg-sidebar-accent/50 rounded p-1 -ml-1 transition-colors"
                    >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <User className="h-4 w-4" />
                        </div>
                        {!collapsed && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">
                                    {user?.email}
                                </p>
                            </div>
                        )}
                    </Link>
                    {!collapsed && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={logout}
                            title={t("sidebar.logout")}
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                {collapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 mx-auto text-muted-foreground hover:text-destructive"
                        onClick={logout}
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </aside>
    );
}
