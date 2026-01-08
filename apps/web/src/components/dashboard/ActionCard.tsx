import type { ActionRecommendation } from "../../services/dashboard.service";
import { Link } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "../ui/Card";
import {
    ArrowRight,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
} from "lucide-react";

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
                return "border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900";
            case "HIGH":
                return "border-indigo-200 bg-indigo-50 dark:bg-indigo-950/20 dark:border-indigo-900";
            case "MEDIUM":
                return "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900";
            default:
                return "border-gray-200";
        }
    };

    return (
        <Card className={`transition-all hover:shadow-md ${getBorderColor()}`}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        {getIcon()}
                        {recommendation.title}
                    </CardTitle>
                    {recommendation.priority === "CRITICAL" && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            Crítico
                        </span>
                    )}
                </div>
                <CardDescription className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                    {recommendation.description}
                </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
                <Link
                    to={recommendation.actionLink}
                    className="group inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:underline"
                >
                    {recommendation.actionLabel}
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
            </CardFooter>
        </Card>
    );
}
