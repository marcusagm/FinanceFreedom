import { AlertTriangle, ArrowRight, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import type { ActionRecommendation } from "../../services/dashboard.service";
import { AppCard } from "../ui/AppCard";
import { Button } from "../ui/Button";

interface ActionCardProps {
    recommendation: ActionRecommendation;
}

export function ActionCard({ recommendation }: ActionCardProps) {
    const getIcon = () => {
        switch (recommendation.type) {
            case "PAY_DEBT":
                return <CheckCircle className="h-5 w-5 text-indigo-500" />;
            case "INVEST":
                return <TrendingUp className="h-5 w-5 text-emerald-500" />;
            case "INCOME_GAP":
                return <AlertTriangle className="h-5 w-5 text-amber-500" />;
            default:
                return <CheckCircle className="h-5 w-5 text-blue-500" />;
        }
    };

    const getBorderColor = () => {
        switch (recommendation.priority) {
            case "CRITICAL":
                return "border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-900";
            case "HIGH":
                return "border-indigo-200 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-900";
            case "MEDIUM":
                return "border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-900";
            default:
                return "border-gray-200 bg-card dark:border-border";
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
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        Crítico
                    </span>
                ) : (
                    <div className="flex items-center gap-2">{getIcon()}</div>
                )
            }
            footer={footer}
        >
            <p className="text-sm text-gray-600 dark:text-gray-300">{recommendation.description}</p>
        </AppCard>
    );
}
