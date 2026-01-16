import {
    AlertTriangle,
    ArrowRight,
    CheckCircle,
    TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { ActionRecommendation } from "../../services/dashboard.service";
import { AppCard } from "../ui/AppCard";
import { Button } from "../ui/Button";

interface ActionCardProps {
    recommendation: ActionRecommendation;
}

export function ActionCard({ recommendation }: ActionCardProps) {
    const { t } = useTranslation();

    const getIcon = () => {
        switch (recommendation.type) {
            case "PAY_DEBT":
                return (
                    <CheckCircle className="h-5 w-5 text-priority-high-foreground" />
                );
            case "INVEST":
                return (
                    <TrendingUp className="h-5 w-5 text-priority-medium-foreground" />
                );
            case "INCOME_GAP":
                return (
                    <AlertTriangle className="h-5 w-5 text-priority-critical-foreground" />
                );
            default:
                return <CheckCircle className="h-5 w-5 text-blue-500" />;
        }
    };

    const getBorderColor = () => {
        switch (recommendation.priority) {
            case "CRITICAL":
                return "border-priority-critical-border bg-priority-critical-bg text-priority-critical-foreground";
            case "HIGH":
                return "border-priority-high-border bg-priority-high-bg text-priority-high-foreground";
            case "MEDIUM":
                return "border-priority-medium-border bg-priority-medium-bg text-priority-medium-foreground";
            default:
                return "border-border bg-card text-card-foreground";
        }
    };

    const footer = (
        <Link to={recommendation.actionLink} className="w-full">
            <Button variant="ghost" className="w-full justify-between">
                {recommendation.actionLabel}
                <ArrowRight className="h-4 w-4" />
            </Button>
        </Link>
    );

    return (
        <AppCard
            title={recommendation.title}
            className={getBorderColor()}
            badge={
                recommendation.priority === "CRITICAL" ? (
                    <span className="inline-flex items-center rounded-full bg-priority-critical-border/50 px-2.5 py-0.5 text-xs font-medium text-priority-critical-foreground">
                        {t("dashboard.actionFeed.critical")}
                    </span>
                ) : (
                    <div className="flex items-center gap-2">{getIcon()}</div>
                )
            }
            footer={footer}
        >
            <p className="text-sm opacity-90">{recommendation.description}</p>
        </AppCard>
    );
}
